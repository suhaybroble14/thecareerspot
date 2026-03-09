-- Schema v4: Fix bookings status constraint + add refund_reason
-- Run this in Supabase SQL Editor

-- 1. Fix the status CHECK constraint to include cancellation_requested
--    (Without this, refund requests silently fail at the database level)
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in', 'cancellation_requested'));

-- 2. Add refund_reason column so admins can see why a refund was requested
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS refund_reason text;
