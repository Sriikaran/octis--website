import { getDbPool } from './pool.js';
import { DEMO_CONFIG } from '../demoConfig.js';

/**
 * Helper to compute IST date / time
 */
function getNowInKolkata() {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: DEMO_CONFIG.timezone }));
}

function formatTimeDisplay(time24) {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * 1. Query available slots using PostgreSQL as the source of truth
 */
export async function getAvailableSlotsPg(dateString) {
  const pool = getDbPool();
  if (!pool) {
    throw new Error('DEMO_DATABASE_URL is not configured for PostgreSQL storage adapter.');
  }

  const config = DEMO_CONFIG;

  // Validate date format YYYY-MM-DD
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

  // Check working days (Mon-Fri)
  if (!config.workingDays.includes(dayOfWeek)) {
    return {
      date: dateString,
      isAvailableDay: false,
      reason: `Selected date falls on a non-working day (${dayOfWeek === 0 || dayOfWeek === 6 ? 'Weekend' : 'Off-day'}). Working days are ${config.workingDaysLabel}.`,
      slots: [],
    };
  }

  // Check past date
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

  // Horizon check (30 days)
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

  // Query existing active bookings from PostgreSQL using parameterized query
  const query = `
    SELECT start_time 
    FROM demo_bookings 
    WHERE booking_date = $1 AND status != 'cancelled';
  `;
  const dbRes = await pool.query(query, [dateString]);
  const bookedTimes = new Set(dbRes.rows.map((r) => r.start_time));

  // Generate slots
  const [startH, startM] = config.workingHours.start.split(':').map(Number);
  const [endH, endM] = config.workingHours.end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

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

    const isAlreadyBooked = bookedTimes.has(timeStr);
    if (isAlreadyBooked) {
      unavailableReason = 'Slot already reserved';
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
}

/**
 * 2. Create demo booking atomically inside a PostgreSQL Transaction
 */
export async function createDemoBookingPg(payload) {
  const pool = getDbPool();
  if (!pool) {
    throw new Error('DEMO_DATABASE_URL is not configured for PostgreSQL storage adapter.');
  }

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

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Transactional concurrency check with row lock
    const conflictQuery = `
      SELECT id FROM demo_bookings 
      WHERE booking_date = $1 AND start_time = $2 AND status != 'cancelled'
      FOR UPDATE;
    `;
    const conflictRes = await client.query(conflictQuery, [date, time]);

    if (conflictRes.rows.length > 0) {
      await client.query('ROLLBACK');
      return {
        success: false,
        error: 'This time slot was just booked by another user. Please choose another available slot.',
        code: 'SLOT_UNAVAILABLE',
      };
    }

    // 2. Insert into demo_enquiries
    const insertEnquiryQuery = `
      INSERT INTO demo_enquiries (
        enquiry_id, source, reference_id, name, showroom_name, email, phone, city,
        product, business_type, branches, challenges, message, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $15)
      RETURNING *;
    `;
    const enquiryParams = [
      enquiryId,
      'demo_request',
      referenceId,
      name.trim(),
      showroomName.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      city.trim(),
      product,
      businessType,
      branches,
      challenges.trim(),
      message.trim(),
      'new',
      nowIso,
    ];
    const enqRes = await client.query(insertEnquiryQuery, enquiryParams);

    // 3. Insert into demo_bookings
    const initialAudit = JSON.stringify([
      {
        action: 'created',
        status: config.defaultBookingStatus,
        timestamp: nowIso,
        note: 'Online appointment booked via Octis website (PostgreSQL)',
      },
    ]);

    const insertBookingQuery = `
      INSERT INTO demo_bookings (
        booking_id, enquiry_id, reference_id, product, booking_date, start_time,
        end_time, timezone, status, created_at, updated_at, audit_history
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10, $11)
      RETURNING *;
    `;
    const bookingParams = [
      referenceId,
      enquiryId,
      referenceId,
      product,
      date,
      time,
      endTime,
      config.timezone,
      config.defaultBookingStatus,
      nowIso,
      initialAudit,
    ];
    const bookRes = await client.query(insertBookingQuery, bookingParams);

    await client.query('COMMIT');

    const bookingRow = bookRes.rows[0];
    const enquiryRow = enqRes.rows[0];

    return {
      success: true,
      referenceId,
      booking: {
        bookingId: bookingRow.booking_id,
        enquiryId: bookingRow.enquiry_id,
        referenceId: bookingRow.reference_id,
        product: bookingRow.product,
        date: typeof bookingRow.booking_date === 'string' ? bookingRow.booking_date.split('T')[0] : date,
        startTime: bookingRow.start_time,
        endTime: bookingRow.end_time,
        timezone: bookingRow.timezone,
        status: bookingRow.status,
        createdAt: bookingRow.created_at,
        updatedAt: bookingRow.updated_at,
        auditHistory: typeof bookingRow.audit_history === 'string' ? JSON.parse(bookingRow.audit_history) : bookingRow.audit_history,
      },
      enquiry: {
        enquiryId: enquiryRow.enquiry_id,
        referenceId: enquiryRow.reference_id,
        name: enquiryRow.name,
        showroomName: enquiryRow.showroom_name,
        email: enquiryRow.email,
        phone: enquiryRow.phone,
        city: enquiryRow.city,
        product: enquiryRow.product,
        businessType: enquiryRow.business_type,
        branches: enquiryRow.branches,
        challenges: enquiryRow.challenges,
        message: enquiryRow.message,
        createdAt: enquiryRow.created_at,
      },
    };
  } catch (err) {
    await client.query('ROLLBACK');
    // Unique violation catch for race condition
    if (err.code === '23505') {
      return {
        success: false,
        error: 'This time slot was just booked by another user. Please choose another available slot.',
        code: 'SLOT_UNAVAILABLE',
      };
    }
    throw err;
  } finally {
    client.release();
  }
}

/**
 * 3. List all bookings with customer enquiries from PostgreSQL
 */
export async function listAllBookingsPg({ status, product, date, search } = {}) {
  const pool = getDbPool();
  if (!pool) {
    throw new Error('DEMO_DATABASE_URL is not configured for PostgreSQL storage adapter.');
  }

  let whereClauses = [];
  let params = [];
  let paramIdx = 1;

  if (status) {
    whereClauses.push(`LOWER(b.status) = LOWER($${paramIdx++})`);
    params.push(status);
  }

  if (product) {
    whereClauses.push(`LOWER(b.product) = LOWER($${paramIdx++})`);
    params.push(product);
  }

  if (date) {
    whereClauses.push(`b.booking_date = $${paramIdx++}`);
    params.push(date);
  }

  if (search) {
    whereClauses.push(`(
      b.reference_id ILIKE $${paramIdx} OR
      e.name ILIKE $${paramIdx} OR
      e.showroom_name ILIKE $${paramIdx} OR
      e.email ILIKE $${paramIdx} OR
      e.phone ILIKE $${paramIdx}
    )`);
    params.push(`%${search}%`);
    paramIdx++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const query = `
    SELECT 
      b.booking_id as "bookingId",
      b.enquiry_id as "enquiryId",
      b.reference_id as "referenceId",
      b.product,
      to_char(b.booking_date, 'YYYY-MM-DD') as "date",
      b.start_time as "startTime",
      b.end_time as "endTime",
      b.timezone,
      b.status,
      b.created_at as "createdAt",
      b.updated_at as "updatedAt",
      b.audit_history as "auditHistory",
      e.name as "customerName",
      e.showroom_name as "showroomName",
      e.email,
      e.phone,
      e.city,
      e.business_type as "businessType",
      e.branches,
      e.challenges,
      e.message
    FROM demo_bookings b
    JOIN demo_enquiries e ON b.enquiry_id = e.enquiry_id
    ${whereSql}
    ORDER BY b.booking_date DESC, b.start_time DESC;
  `;

  const res = await pool.query(query, params);
  return res.rows.map((row) => ({
    ...row,
    auditHistory: typeof row.auditHistory === 'string' ? JSON.parse(row.auditHistory) : row.auditHistory,
  }));
}

/**
 * 4. Update booking status inside a PostgreSQL Transaction
 */
export async function updateBookingStatusPg(referenceId, newStatus, reason = '') {
  const pool = getDbPool();
  if (!pool) {
    throw new Error('DEMO_DATABASE_URL is not configured for PostgreSQL storage adapter.');
  }

  const validStatuses = ['confirmed', 'pending', 'cancelled', 'completed'];
  if (!validStatuses.includes(newStatus)) {
    return {
      success: false,
      error: `Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`,
    };
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const selectQuery = `
      SELECT * FROM demo_bookings 
      WHERE reference_id = $1 
      FOR UPDATE;
    `;
    const selRes = await client.query(selectQuery, [referenceId]);
    if (selRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, error: `Booking not found: ${referenceId}` };
    }

    const row = selRes.rows[0];
    const prevStatus = row.status;
    const nowIso = new Date().toISOString();

    let history = typeof row.audit_history === 'string' ? JSON.parse(row.audit_history) : row.audit_history || [];
    history.push({
      action: 'status_change',
      from: prevStatus,
      to: newStatus,
      timestamp: nowIso,
      reason: reason || 'Administrative action',
    });

    const updateQuery = `
      UPDATE demo_bookings
      SET status = $1, updated_at = $2, audit_history = $3
      WHERE reference_id = $4
      RETURNING *;
    `;
    const updRes = await client.query(updateQuery, [newStatus, nowIso, JSON.stringify(history), referenceId]);

    await client.query('COMMIT');

    const updatedRow = updRes.rows[0];
    return {
      success: true,
      booking: {
        bookingId: updatedRow.booking_id,
        enquiryId: updatedRow.enquiry_id,
        referenceId: updatedRow.reference_id,
        product: updatedRow.product,
        date: typeof updatedRow.booking_date === 'string' ? updatedRow.booking_date.split('T')[0] : updatedRow.booking_date,
        startTime: updatedRow.start_time,
        endTime: updatedRow.end_time,
        timezone: updatedRow.timezone,
        status: updatedRow.status,
        createdAt: updatedRow.created_at,
        updatedAt: updatedRow.updated_at,
        auditHistory: history,
      },
      message: `Booking ${referenceId} status updated to ${newStatus}.`,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * 5. Save general contact inquiry into PostgreSQL
 */
export async function saveContactInquiryPg(payload) {
  const pool = getDbPool();
  if (!pool) {
    throw new Error('DEMO_DATABASE_URL is not configured for PostgreSQL storage adapter.');
  }

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

  const insertQuery = `
    INSERT INTO demo_enquiries (
      enquiry_id, source, reference_id, name, showroom_name, email, phone, city,
      product, message, status, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $12)
    RETURNING *;
  `;
  const params = [
    enquiryId,
    'contact_form',
    enquiryId,
    String(name).trim(),
    String(showroomName).trim(),
    String(email).trim().toLowerCase(),
    String(phone).trim(),
    String(city).trim(),
    String(product).trim(),
    String(message).trim(),
    'new',
    nowIso,
  ];

  const res = await pool.query(insertQuery, params);
  const row = res.rows[0];

  return {
    success: true,
    enquiryId: row.enquiry_id,
    enquiry: {
      enquiryId: row.enquiry_id,
      source: row.source,
      name: row.name,
      showroomName: row.showroom_name,
      email: row.email,
      phone: row.phone,
      city: row.city,
      product: row.product,
      message: row.message,
      status: row.status,
      createdAt: row.created_at,
    },
  };
}
