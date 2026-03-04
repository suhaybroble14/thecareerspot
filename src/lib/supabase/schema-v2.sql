-- The Career Spot - Database Schema v2
-- Run this in the Supabase SQL Editor
-- This is additive to the existing schema (profiles, memberships, transactions)

-- ============================================
-- 1. Extend existing profiles table
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'member' CHECK (role IN ('member', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- ============================================
-- 2. Membership Applications
-- ============================================
CREATE TABLE IF NOT EXISTS membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  user_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 3. Bookings (day passes with specific dates)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  qr_code text UNIQUE NOT NULL,
  qr_used boolean DEFAULT false,
  stripe_session_id text,
  amount_paid decimal(10, 2) NOT NULL DEFAULT 9.99,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- 4. Check-ins
-- ============================================
CREATE TABLE IF NOT EXISTS check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id),
  membership_id uuid REFERENCES memberships(id),
  check_in_type text NOT NULL CHECK (check_in_type IN ('day_pass', 'monthly')),
  checked_in_at timestamptz DEFAULT now(),
  checked_in_by uuid REFERENCES profiles(id)
);

-- ============================================
-- 5. Capacity Overrides
-- ============================================
CREATE TABLE IF NOT EXISTS capacity_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  override_date date UNIQUE NOT NULL,
  max_capacity integer NOT NULL DEFAULT 14,
  reason text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 6. Leads (newsletter + interest capture)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- 7. Admin Notes
-- ============================================
CREATE TABLE IF NOT EXISTS admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('application', 'booking', 'membership', 'user')),
  target_id uuid NOT NULL,
  note text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_qr ON bookings(qr_code);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON check_ins(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_checkins_user ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON membership_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON membership_applications(email);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_admin_notes_target ON admin_notes(target_type, target_id);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE capacity_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- Users see their own data. Admin operations use the service role key
-- which bypasses RLS entirely.
-- ============================================

-- Membership Applications
CREATE POLICY "Users can view own applications"
  ON membership_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit applications"
  ON membership_applications FOR INSERT
  WITH CHECK (true);

-- Bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Check-ins
CREATE POLICY "Users can view own check_ins"
  ON check_ins FOR SELECT
  USING (auth.uid() = user_id);

-- Capacity Overrides (read-only for everyone, write via service role)
CREATE POLICY "Anyone can read capacity overrides"
  ON capacity_overrides FOR SELECT
  USING (true);

-- Leads (insert only from public, read via service role)
CREATE POLICY "Anyone can submit leads"
  ON leads FOR INSERT
  WITH CHECK (true);

-- Admin Notes (read/write via service role only, no public access)
-- No public policies needed - admin uses service role key

-- ============================================
-- Profile trigger: auto-create profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Enable realtime for new tables
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE check_ins;
ALTER PUBLICATION supabase_realtime ADD TABLE membership_applications;
