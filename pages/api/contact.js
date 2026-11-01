import { saveContactInquiry } from '../../lib/demoStorage';
import { DEMO_CONFIG } from '../../lib/demoConfig';

// Basic in-memory rate limiting map for contact inquiries (IP -> timestamps)
const contactRateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 5;      // Max 5 contact inquiries per minute

  const timestamps = (contactRateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return true;
  }
  timestamps.push(now);
  contactRateLimitMap.set(ip, timestamps);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Rate limiting check
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many submissions from your network. Please wait a moment before trying again.',
      code: 'RATE_LIMITED',
    });
  }

  const body = req.body || {};

  // Honeypot spam detection
  if (body.botField || body.website_url) {
    return res.status(400).json({ success: false, error: 'Spam submission detected.' });
  }

  const { name, showroomName, phone, email, city, product, message } = body;

  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please provide your full name (at least 2 characters).';
  } else if (name.length > 100) {
    errors.name = 'Name must be under 100 characters.';
  }

  const cleanPhone = String(phone || '').replace(/[\s\-\(\)]/g, '');
  if (!cleanPhone || cleanPhone.length < 8 || cleanPhone.length > 15) {
    errors.phone = 'Please provide a valid phone number (8-15 digits).';
  }

  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      errors.email = 'Please provide a valid email address.';
    }
  }

  if (message && message.length > 2000) {
    errors.message = 'Message must be under 2,000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Please correct the invalid fields in your inquiry.',
      code: 'VALIDATION_FAILED',
      fields: errors,
    });
  }

  try {
    const result = await saveContactInquiry({
      name: name.trim(),
      showroomName: showroomName ? showroomName.trim() : '',
      phone: cleanPhone,
      email: email ? email.trim() : '',
      city: city ? city.trim() : '',
      product: product || 'jewellery-erp',
      message: message ? message.trim() : '',
    });

    return res.status(201).json({
      success: true,
      enquiryId: result.enquiryId,
      message: 'Thank you! Your showroom inquiry has been received. Our advisory team will contact you shortly.',
    });
  } catch (error) {
    console.error('Error saving contact inquiry:', error);
    return res.status(500).json({
      success: false,
      error: 'A server error occurred while processing your message. Please try again or call sales directly.',
      code: 'SERVER_ERROR',
    });
  }
}

