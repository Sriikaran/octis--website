import {
  getAvailableSlotsPg,
  createDemoBookingPg,
  listAllBookingsPg,
  updateBookingStatusPg,
  saveContactInquiryPg,
} from './db/postgresAdapter.js';
import {
  getAvailableSlotsFile,
  createDemoBookingFile,
  listAllBookingsFile,
  updateBookingStatusFile,
  saveContactInquiryFile,
  formatTimeDisplay,
} from './db/fileAdapter.js';

export { formatTimeDisplay };

/**
 * Check whether a dedicated PostgreSQL connection string is configured.
 */
export function isDatabaseConfigured() {
  const url = process.env.DEMO_DATABASE_URL;
  return Boolean(url && url.trim().length > 0);
}

/**
 * Return current persistence architecture diagnostics.
 */
export function getStorageDiagnostics() {
  const isDb = isDatabaseConfigured();
  return {
    activeAdapter: isDb ? 'postgresql' : 'file',
    databaseConfigured: isDb,
    databaseUrlMasked: isDb
      ? process.env.DEMO_DATABASE_URL.replace(/:[^:@]+@/, ':****@')
      : null,
    environment: process.env.NODE_ENV || 'development',
    serverlessCompatible: isDb,
  };
}

/**
 * 1. Compute real available time slots for a given date
 */
export async function getAvailableSlots(dateString) {
  if (isDatabaseConfigured()) {
    return await getAvailableSlotsPg(dateString);
  }
  return await getAvailableSlotsFile(dateString);
}

/**
 * 2. Create demo booking atomically (via DB transaction or Mutex file)
 */
export async function createDemoBooking(payload) {
  if (isDatabaseConfigured()) {
    return await createDemoBookingPg(payload);
  }
  return await createDemoBookingFile(payload);
}

/**
 * 3. List all bookings with customer details
 */
export async function listAllBookings(filters) {
  if (isDatabaseConfigured()) {
    return await listAllBookingsPg(filters);
  }
  return await listAllBookingsFile(filters);
}

/**
 * 4. Update booking status
 */
export async function updateBookingStatus(referenceId, newStatus, reason) {
  if (isDatabaseConfigured()) {
    return await updateBookingStatusPg(referenceId, newStatus, reason);
  }
  return await updateBookingStatusFile(referenceId, newStatus, reason);
}

/**
 * 5. Save showroom advisory inquiry
 */
export async function saveContactInquiry(payload) {
  if (isDatabaseConfigured()) {
    return await saveContactInquiryPg(payload);
  }
  return await saveContactInquiryFile(payload);
}
