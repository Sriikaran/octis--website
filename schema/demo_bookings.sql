-- =========================================================================
-- OCTIS MARKETING WEBSITE — ISOLATED DEMO & INQUIRY DATABASE SCHEMA
-- =========================================================================
-- This schema is designed specifically for the public-facing marketing website.
-- It provides durable ACID storage, serverless compatibility, and database-level
-- uniqueness protection for demonstration appointment slots.
--
-- IMPORTANT SAFETY GUIDELINES:
-- 1. Deploy this schema ONLY to a dedicated marketing PostgreSQL database
--    (e.g., dedicated Supabase project, Neon serverless branch, AWS RDS, Railway).
-- 2. NEVER run this schema against the Octis Jewellery ERP production database.
-- 3. The marketing website must have its own isolated database credentials.
-- =========================================================================

-- 1. Showroom Enquiries Table (Captures Request Demo submissions and Contact Form inquiries)
CREATE TABLE IF NOT EXISTS demo_enquiries (
  id BIGSERIAL PRIMARY KEY,
  enquiry_id VARCHAR(64) UNIQUE NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT 'demo_request', -- 'demo_request' or 'contact_form'
  reference_id VARCHAR(64),
  name VARCHAR(120) NOT NULL,
  showroom_name VARCHAR(150),
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(24) NOT NULL,
  city VARCHAR(100),
  product VARCHAR(64) NOT NULL DEFAULT 'jewellery-erp',
  business_type VARCHAR(100) DEFAULT 'Retail Showroom',
  branches VARCHAR(32) DEFAULT '1',
  challenges TEXT,
  message TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'closed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Demonstration Appointments Table
CREATE TABLE IF NOT EXISTS demo_bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_id VARCHAR(64) UNIQUE NOT NULL,
  enquiry_id VARCHAR(64) REFERENCES demo_enquiries(enquiry_id) ON DELETE CASCADE,
  reference_id VARCHAR(64) UNIQUE NOT NULL,
  product VARCHAR(64) NOT NULL,
  booking_date DATE NOT NULL,
  start_time VARCHAR(8) NOT NULL,  -- e.g. '11:00'
  end_time VARCHAR(8) NOT NULL,    -- e.g. '11:30'
  timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
  status VARCHAR(32) NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'pending', 'cancelled', 'completed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  audit_history JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- =========================================================================
-- DATABASE-LEVEL CONCURRENCY & INTEGRITY CONSTRAINTS
-- =========================================================================
-- Prevent double booking: Guarantees at the database engine level that no two
-- active bookings can ever occupy the exact same date and start time,
-- even across concurrent serverless function instances.
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_booking_slot
ON demo_bookings (booking_date, start_time)
WHERE status != 'cancelled';

-- High-performance query indexes
CREATE INDEX IF NOT EXISTS idx_demo_bookings_date ON demo_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_demo_bookings_status ON demo_bookings(status);
CREATE INDEX IF NOT EXISTS idx_demo_enquiries_email ON demo_enquiries(email);
CREATE INDEX IF NOT EXISTS idx_demo_enquiries_created ON demo_enquiries(created_at DESC);

