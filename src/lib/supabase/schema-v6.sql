-- v6: store full hire enquiry details in leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS event_type text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_date text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS guest_count text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS message text;
