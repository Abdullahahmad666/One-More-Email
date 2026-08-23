-- Pre-launch email capture for the landing page smoke test.
--
-- WRITE PATH: POST /api/subscribe on our own server, using the service role
-- key. The browser never talks to Supabase directly.
--
-- This is deliberately stricter than the usual "let anon insert" recipe. An
-- anon INSERT policy turns Supabase into a second, public write endpoint that
-- bypasses the honeypot, the rate limit and the format checks in our route --
-- anyone could curl it. Routing every write through our server keeps one door.
--
-- So: RLS on, and NO policies at all. anon and authenticated can do nothing;
-- the service role bypasses RLS, which is how our route gets in. You read the
-- list in the dashboard, which also bypasses RLS.

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text,
  created_at timestamptz not null default now(),

  -- Validation lives on the table, not in a policy. A policy check is skipped
  -- by the service role, so it would never run on our own writes -- which are
  -- the only writes there are. A CHECK constraint applies to everyone.
  constraint waitlist_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint waitlist_email_length check (char_length(email) between 3 and 254),

  -- The route lowercases before inserting; this makes the unique index
  -- genuinely case-insensitive rather than merely usually so.
  constraint waitlist_email_lowercase check (email = lower(email))
);

-- Newest first is how you will always read this.
create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

alter table public.waitlist enable row level security;

-- Belt and braces: even with RLS on, do not leave table grants lying around
-- for the public roles. Nothing in the browser has any business here.
revoke all on public.waitlist from anon, authenticated;

-- Sanity check after running this. Both should return zero rows / an error,
-- never your list:
--   curl "$SUPABASE_URL/rest/v1/waitlist?select=email" -H "apikey: $ANON_KEY"
