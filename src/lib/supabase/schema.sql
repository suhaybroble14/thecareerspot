-- Supabase database schema for The Career Spot Bristol

-- Users (handled by Supabase Auth, but we extend with profile)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Memberships
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  membership_type text not null check (membership_type in ('day_pass', '30_day')),
  amount_paid decimal(10, 2) not null,
  purchased_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Transactions (Stripe payments)
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  membership_id uuid references memberships(id) on delete set null,
  stripe_payment_id text unique,
  amount decimal(10, 2) not null,
  currency text default 'gbp',
  status text not null check (status in ('pending', 'succeeded', 'failed')),
  email_sent boolean default false,
  sms_sent boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_memberships_user_id on memberships(user_id);
create index if not exists idx_memberships_expires_at on memberships(expires_at);
create index if not exists idx_transactions_user_id on transactions(user_id);
create index if not exists idx_transactions_stripe_id on transactions(stripe_payment_id);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;
alter table memberships enable row level security;
alter table transactions enable row level security;

-- RLS Policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can view their own memberships"
  on memberships for select
  using (auth.uid() = user_id);

create policy "Users can view their own transactions"
  on transactions for select
  using (auth.uid() = user_id);

-- Realtime subscriptions for memberships and transactions
alter publication supabase_realtime add table memberships;
alter publication supabase_realtime add table transactions;
