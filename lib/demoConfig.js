/**
 * Centralized Demo & Appointment Booking Configuration
 * All settings are configurable and respect the Indian business context by default.
 */

export const DEMO_CONFIG = {
  // Business timezone
  timezone: process.env.DEMO_TIMEZONE || 'Asia/Kolkata',
  timezoneDisplay: 'IST (India Standard Time, UTC+05:30)',

  // Configured working days: 1 = Monday to 5 = Friday (0 = Sunday, 6 = Saturday)
  // Can be configured to include Saturdays ([1, 2, 3, 4, 5, 6]) if approved by management.
  workingDays: [1, 2, 3, 4, 5],
  workingDaysLabel: 'Monday to Friday',

  // Configured working hours in local business timezone (24-hour format)
  workingHours: {
    start: '10:00', // 10:00 AM IST
    end: '18:00',   // 06:00 PM IST
  },

  // Appointment duration and buffer settings
  durationMinutes: 30, // 30-minute demonstration
  bufferMinutes: 15,   // 15-minute preparation buffer between sessions

  // Advance notice and horizon limits
  minAdvanceNoticeHours: 2, // Minimum 2 hours advance notice before slot start
  maxBookingHorizonDays: 30, // Can book up to 30 days ahead

  // Default initial booking state:
  // 'confirmed' if calendar auto-confirms open slots, or 'pending' if manual verification is required.
  defaultBookingStatus: 'confirmed',

  // Support contact information
  contactEmail: 'hello@octis.in',
  contactPhone: '+91 7396 029 339',
};

export const PRODUCT_OPTIONS = [
  {
    id: 'jewellery-erp',
    name: 'Octis Jewellery ERP',
    tagline: 'Retail Showroom Suite',
    description: 'POS touch billing, barcode tags, HUID hallmarking, karigar slips & BI',
  },
  {
    id: 'pawnify',
    name: 'Pawnify',
    tagline: 'Gold & Silver Loan Broker Platform',
    description: 'Girvi lending, multi-item appraisals, RBI LTV compliance & interest engine',
  },
  {
    id: 'bulion',
    name: 'Bulion',
    tagline: 'Physical Bullion Trading & Inventory',
    description: 'Live rate quoting, rate lock blocks, two-way buy/sell deal lifecycle & vault custody',
  },
  {
    id: 'multiple',
    name: 'Multiple Products / Not Sure',
    tagline: 'Full Ecosystem Consultation',
    description: 'Discuss showroom, pawn, or bullion requirements with our advisory team',
  },
];

