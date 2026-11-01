import { createDemoBooking } from '../../../lib/demoStorage';
import { sendDemoNotifications } from '../../../lib/demoNotificationService';

// Basic in-memory rate limiting map (IP -> timestamp)
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Rate limiting check
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many booking attempts from your network. Please wait a moment before trying again.',
      code: 'RATE_LIMITED',
    });
  }

  const body = req.body || {};

  // Honeypot spam check: hidden field should be empty
  if (body.botField || body.website_url) {
    return res.status(400).json({ success: false, error: 'Spam detected.' });
  }

  const {
    name,
    showroomName,
    email,
    phone,
    city,
    product,
    businessType,
    branches,
    challenges,
    message,
    date,
    time,
  } = body;

  // Server-side field validation
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  } else if (name.length > 100) {
    errors.name = 'Name must be under 100 characters.';
  }

  if (!showroomName || typeof showroomName !== 'string' || showroomName.trim().length < 2) {
    errors.showroomName = 'Please provide your jewellery showroom or business name.';
  } else if (showroomName.length > 150) {
    errors.showroomName = 'Business name must be under 150 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(String(email).trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  const cleanPhone = String(phone || '').replace(/[\s\-\(\)]/g, '');
  if (!cleanPhone || cleanPhone.length < 8 || cleanPhone.length > 15) {
    errors.phone = 'Please provide a valid phone number (10 digits).';
  }

  if (!city || typeof city !== 'string' || city.trim().length < 2) {
    errors.city = 'Please specify your city or location.';
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Valid date (YYYY-MM-DD) is required.';
  }

  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    errors.time = 'Valid time slot (HH:MM) is required.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Please correct the invalid fields in your submission.',
      code: 'VALIDATION_FAILED',
      fields: errors,
    });
  }

  try {
    const result = await createDemoBooking({
      name,
      showroomName,
      email,
      phone: cleanPhone,
      city,
      product: product || 'jewellery-erp',
      businessType: businessType || 'Retail Showroom',
      branches: branches || '1',
      challenges: challenges || '',
      message: message || '',
      date,
      time,
    });

    if (!result.success) {
      if (result.code === 'SLOT_UNAVAILABLE') {
        return res.status(409).json(result);
      }
      return res.status(400).json(result);
    }

    // Trigger notification boundary asynchronously
    const notification = await sendDemoNotifications({
      booking: result.booking,
      enquiry: result.enquiry,
    });

    return res.status(201).json({
      success: true,
      referenceId: result.referenceId,
      booking: result.booking,
      enquiry: result.enquiry,
      notification,
    });
  } catch (error) {
    console.error('Error processing demo booking:', error);
    return res.status(500).json({
      success: false,
      error: 'A server error occurred while confirming your booking. Please try again.',
      code: 'SERVER_ERROR',
    });
  }
}

