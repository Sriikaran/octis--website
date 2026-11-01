import fs from 'fs';
import path from 'path';
import { DEMO_CONFIG } from '../demoConfig.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'demo_bookings.json');

// Simple in-process mutex lock to guarantee atomic concurrency
let mutexPromise = Promise.resolve();
function acquireLock() {
  let release;
  const nextLock = new Promise((resolve) => {
    release = resolve;
  });
  const currentLock = mutexPromise.then(() => release);
  mutexPromise = mutexPromise.then(() => nextLock);
  return currentLock;
}

/** Ensure data file exists with valid structure */
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      enquiries: [],
      bookings: [],
      meta: {
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

/** Read data with fail-safe error handling */
function readDataUnsafe() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading demo_bookings.json, resetting corrupt file:', err);
    ensureDataFile();
    return { enquiries: [], bookings: [], meta: { version: 1 } };
  }
}

/** Atomic write to avoid partial writes */
async function writeDataUnsafe(data) {
  ensureDataFile();
  data.meta = {
    ...data.meta,
    updatedAt: new Date().toISOString(),
  };
  const tempFile = `${DATA_FILE}.tmp-${Date.now()}`;
  await fs.promises.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  await fs.promises.rename(tempFile, DATA_FILE);
}

/** Format date helpers for Asia/Kolkata timezone */
function getNowInKolkata() {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: DEMO_CONFIG.timezone }));
}

/** Format 24-hr time to 12-hr display (e.g. "14:30" -> "2:30 PM") */
export function formatTimeDisplay(time24) {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * 1. Compute real available time slots for a given date string (YYYY-MM-DD)
 */
export async function getAvailableSlotsFile(dateString) {
  const release = await acquireLock();
  try {
    const data = readDataUnsafe();
    const config = DEMO_CONFIG;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return {
        date: dateString,
        isAvailableDay: false,
        reason: 'Invalid date format. Expected YYYY-MM-DD.',
        slots: [],
      };
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const targetDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const dayOfWeek = targetDate.getUTCDay();

    if (!config.workingDays.includes(dayOfWeek)) {
      return {
        date: dateString,
        isAvailableDay: false,
        reason: `Selected date falls on a non-working day (${dayOfWeek === 0 || dayOfWeek === 6 ? 'Weekend' : 'Off-day'}). Working days are ${config.workingDaysLabel}.`,
        slots: [],
      };
    }

    const nowIst = getNowInKolkata();
    const todayStr = nowIst.toLocaleDateString('en-CA');

    if (dateString < todayStr) {
      return {
        date: dateString,
        isAvailableDay: false,
        reason: 'Cannot book appointments in the past.',
        slots: [],
      };
    }

    const maxDate = new Date(nowIst);
    maxDate.setDate(maxDate.getDate() + config.maxBookingHorizonDays);
    const maxDateStr = maxDate.toLocaleDateString('en-CA');
    if (dateString > maxDateStr) {
      return {
        date: dateString,
        isAvailableDay: false,
        reason: `Cannot book appointments more than ${config.maxBookingHorizonDays} days in advance.`,
        slots: [],
      };
    }

    const [startH, startM] = config.workingHours.start.split(':').map(Number);
    const [endH, endM] = config.workingHours.end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const existingBookings = (data.bookings || []).filter(
      (b) => b.date === dateString && b.status !== 'cancelled'
    );

    const stepMinutes = config.durationMinutes + config.bufferMinutes;
    const slots = [];

    for (let m = startMinutes; m + config.durationMinutes <= endMinutes; m += stepMinutes) {
      const slotHour = Math.floor(m / 60);
      const slotMin = m % 60;
      const timeStr = `${String(slotHour).padStart(2, '0')}:${String(slotMin).padStart(2, '0')}`;
      const endMinuteTotal = m + config.durationMinutes;
      const endHour = Math.floor(endMinuteTotal / 60);
      const endMin = endMinuteTotal % 60;
      const endTimeStr = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      let isNoticeValid = true;
      let unavailableReason = null;

      if (dateString === todayStr) {
        const slotDateObj = new Date(year, month - 1, day, slotHour, slotMin);
        const diffMs = slotDateObj - nowIst;
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffHours < config.minAdvanceNoticeHours) {
          isNoticeValid = false;
          unavailableReason = `Requires at least ${config.minAdvanceNoticeHours}h advance notice`;
        }
      }

      let isAlreadyBooked = false;
      for (const booking of existingBookings) {
        if (booking.startTime === timeStr) {
          isAlreadyBooked = true;
          unavailableReason = 'Slot already reserved';
          break;
        }
      }

      const available = isNoticeValid && !isAlreadyBooked;

      slots.push({
        slotId: `${dateString}_${timeStr}`,
        time: timeStr,
        endTime: endTimeStr,
        display: formatTimeDisplay(timeStr),
        durationMinutes: config.durationMinutes,
        available,
        reason: available ? null : unavailableReason,
      });
    }

    return {
      date: dateString,
      isAvailableDay: true,
      timezone: config.timezone,
      timezoneDisplay: config.timezoneDisplay,
      slots,
    };
  } finally {
    release();
  }
}

/**
 * 2. Atomically create a new enquiry and book the demo slot
 */
export async function createDemoBookingFile(payload) {
  const release = await acquireLock();
  try {
    const data = readDataUnsafe();
    const config = DEMO_CONFIG;

    const {
      name,
      showroomName,
      email,
      phone,
      city,
      product = 'jewellery-erp',
      businessType = 'Retail Showroom',
      branches = '1',
      challenges = '',
      message = '',
      date,
      time,
    } = payload;

    if (!name || !showroomName || !email || !phone || !city || !date || !time) {
      return {
        success: false,
        error: 'All required fields (name, showroomName, email, phone, city, date, time) must be provided.',
        code: 'VALIDATION_FAILED',
      };
    }

    const existingConflict = (data.bookings || []).find(
      (b) => b.date === date && b.startTime === time && b.status !== 'cancelled'
    );

    if (existingConflict) {
      return {
        success: false,
        error: 'This time slot was just booked by another user. Please choose another available slot.',
        code: 'SLOT_UNAVAILABLE',
      };
    }

    const dateCompact = date.replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const referenceId = `OCT-DEMO-${dateCompact}-${randomSuffix}`;
    const enquiryId = `ENQ-${Date.now()}-${randomSuffix}`;

    const [h, m] = time.split(':').map(Number);
    const endMinuteTotal = h * 60 + m + config.durationMinutes;
    const endHour = Math.floor(endMinuteTotal / 60);
    const endMin = endMinuteTotal % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

    const nowIso = new Date().toISOString();

    const enquiry = {
      enquiryId,
      referenceId,
      name: name.trim(),
      showroomName: showroomName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      product,
      businessType,
      branches,
      challenges: challenges.trim(),
      message: message.trim(),
      createdAt: nowIso,
    };

    const booking = {
      bookingId: referenceId,
      enquiryId,
      referenceId,
      product,
      date,
      startTime: time,
      endTime,
      timezone: config.timezone,
      status: config.defaultBookingStatus,
      createdAt: nowIso,
      updatedAt: nowIso,
      auditHistory: [
        {
          action: 'created',
          status: config.defaultBookingStatus,
          timestamp: nowIso,
          note: 'Online appointment booked via Octis website',
        },
      ],
    };

    data.enquiries.push(enquiry);
    data.bookings.push(booking);

    await writeDataUnsafe(data);

    return {
      success: true,
      referenceId,
      booking,
      enquiry,
    };
  } finally {
    release();
  }
}

/**
 * 3. List all bookings with enquiries for authorized administrators
 */
export async function listAllBookingsFile({ status, product, date, search } = {}) {
  const release = await acquireLock();
  try {
    const data = readDataUnsafe();
    const enquiriesMap = new Map((data.enquiries || []).map((e) => [e.enquiryId, e]));

    let results = (data.bookings || []).map((b) => {
      const enq = enquiriesMap.get(b.enquiryId) || {};
      return {
        ...b,
        customerName: enq.name || 'Unknown',
        showroomName: enq.showroomName || 'Unknown',
        email: enq.email || '',
        phone: enq.phone || '',
        city: enq.city || '',
        businessType: enq.businessType || '',
        branches: enq.branches || '',
        challenges: enq.challenges || '',
        message: enq.message || '',
      };
    });

    if (status) {
      results = results.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }
    if (product) {
      results = results.filter((r) => r.product.toLowerCase() === product.toLowerCase());
    }
    if (date) {
      results = results.filter((r) => r.date === date);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.referenceId.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.showroomName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.includes(q)
      );
    }

    results.sort((a, b) => {
      const dtA = `${a.date} ${a.startTime}`;
      const dtB = `${b.date} ${b.startTime}`;
      return dtB.localeCompare(dtA);
    });

    return results;
  } finally {
    release();
  }
}

/**
 * 4. Update booking status
 */
export async function updateBookingStatusFile(referenceId, newStatus, reason = '') {
  const release = await acquireLock();
  try {
    const data = readDataUnsafe();
    const validStatuses = ['confirmed', 'pending', 'cancelled', 'completed'];

    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: `Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}` };
    }

    const booking = (data.bookings || []).find((b) => b.referenceId === referenceId);
    if (!booking) {
      return { success: false, error: `Booking not found: ${referenceId}` };
    }

    const prevStatus = booking.status;
    booking.status = newStatus;
    booking.updatedAt = new Date().toISOString();

    if (!booking.auditHistory) booking.auditHistory = [];
    booking.auditHistory.push({
      action: 'status_change',
      from: prevStatus,
      to: newStatus,
      timestamp: booking.updatedAt,
      reason: reason || 'Administrative action',
    });

    await writeDataUnsafe(data);

    return {
      success: true,
      booking,
      message: `Booking ${referenceId} status updated to ${newStatus}.`,
    };
  } finally {
    release();
  }
}

/**
 * 5. Save general contact form inquiry
 */
export async function saveContactInquiryFile(payload) {
  const release = await acquireLock();
  try {
    const data = readDataUnsafe();
    const {
      name,
      showroomName = '',
      email = '',
      phone,
      city = '',
      product = 'jewellery-erp',
      message = '',
    } = payload;

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const enquiryId = `ENQ-CONTACT-${Date.now()}-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    const enquiry = {
      enquiryId,
      source: 'contact_form',
      name: String(name).trim(),
      showroomName: String(showroomName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      city: String(city).trim(),
      product: String(product).trim(),
      message: String(message).trim(),
      status: 'new',
      createdAt: nowIso,
    };

    if (!data.enquiries) data.enquiries = [];
    data.enquiries.push(enquiry);

    await writeDataUnsafe(data);

    return {
      success: true,
      enquiryId,
      enquiry,
    };
  } finally {
    release();
  }
}
