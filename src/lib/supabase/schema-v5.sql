-- v5: store payment_intent_id directly on bookings for reliable refunds
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
