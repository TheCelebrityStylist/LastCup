create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text,
  entitlement text default 'free',
  status text default 'inactive',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists customers_email_idx on customers(email);
create index if not exists customers_stripe_customer_id_idx on customers(stripe_customer_id);
create index if not exists customers_subscription_id_idx on customers(stripe_subscription_id);
