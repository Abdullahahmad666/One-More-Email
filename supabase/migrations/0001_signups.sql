-- Smoke-test email capture (§2c). Written to by /api/subscribe with the
-- service role key, never read from the browser.
create table if not exists signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

alter table signups enable row level security;
-- No policies: anon and authenticated get nothing. The service role bypasses RLS.
