# One More Email

Automatic invoice chasing for freelancers. It gets firmer on a schedule so you don't have to.
Petty on the inside, polite on the outside.

The build spec lives in [docs/dunning-kruger-playbook.pdf](docs/dunning-kruger-playbook.pdf).
Section references in code comments (`§4b`, `§8c`, …) point at that document.

## The one design rule

The humour lives entirely in our interface. The emails the client receives are impeccably
professional, and the internal tier name (`Disappointed`, `Final Notice`) never appears in them.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) on Vercel |
| Database + auth | Supabase (Postgres, magic link, RLS) — not wired yet |
| Email | Resend — not wired yet |
| Billing | Polar — not wired yet |
| Scheduling | Vercel Cron, hourly — not wired yet |
| Styling | Tailwind v4 with the tokens in `app/globals.css` |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```

## Layout

```
app/          routes (marketing is static, /app is authenticated)
lib/site.ts   product name, URLs, sending domain
lib/ladder.ts the five tiers, the three cadences, invoice states
lib/emails.ts the five email templates + renderer
docs/         the playbook
```

## Non-negotiables before any real send

- SPF, DKIM, DMARC on the sending **subdomain**, never the root domain.
- Idempotency keyed on `sequence_steps.id` — a cron that runs twice must not email a client twice.
- Send window: no nights, no weekends. Clamp forward to the next weekday 09:00.
- `SENDING_ENABLED=false` halts everything.
- Tiers 4 and 5 reviewed by a lawyer.
