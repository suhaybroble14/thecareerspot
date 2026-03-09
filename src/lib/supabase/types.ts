export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  dob: string | null;
  role: "member" | "admin";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Membership = {
  id: string;
  user_id: string;
  membership_type: "day_pass" | "30_day";
  amount_paid: number;
  purchased_at: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  membership_id: string | null;
  stripe_payment_id: string | null;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  email_sent: boolean;
  sms_sent: boolean;
  created_at: string;
  updated_at: string;
};

export type MembershipPlan = {
  id: "day_pass" | "30_day";
  name: string;
  price: number;
  duration: string;
  description: string;
};

export type MembershipApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: "submitted" | "under_review" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  booking_date: string;
  qr_code: string;
  qr_used: boolean;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_paid: number;
  refund_reason: string | null;
  status: "pending" | "confirmed" | "cancelled" | "checked_in" | "cancellation_requested";
  created_at: string;
  updated_at: string;
};

export type CheckIn = {
  id: string;
  user_id: string;
  booking_id: string | null;
  membership_id: string | null;
  check_in_type: "day_pass" | "monthly";
  checked_in_at: string;
  checked_in_by: string | null;
};

export type CapacityOverride = {
  id: string;
  override_date: string;
  max_capacity: number;
  reason: string | null;
  created_by: string | null;
  created_at: string;
};

export type Lead = {
  id: string;
  email: string;
  full_name: string | null;
  source: string;
  phone: string | null;
  event_type: string | null;
  preferred_date: string | null;
  guest_count: string | null;
  message: string | null;
  created_at: string;
};

export type AdminNote = {
  id: string;
  target_type: "application" | "booking" | "membership" | "user";
  target_id: string;
  note: string;
  created_by: string | null;
  created_at: string;
};
