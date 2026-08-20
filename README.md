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
| Motion | Framer Motion, one shared vocabulary in `components/motion.tsx` |
| Icons | Lucide |
| Loading | `components/loader.tsx` — the house loader, see below |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```

## Layout

```
app/                     routes (marketing is static, /app is authenticated)
app/api/subscribe        smoke-test email capture → Supabase, or .data/ locally
components/motion.tsx    the page's only motion vocabulary (24px, 500ms, 70ms stagger)
components/ladder.tsx    the signature element: five rungs, real emails
lib/site.ts              product name, URLs, sending domain
lib/ladder.ts            the five tiers, the three cadences, invoice states
lib/emails.ts            the five email templates + renderer
supabase/migrations/     schema
docs/                    the playbook
```

## Design notes

The base is the playbook's paperwork system — cheque-safety palette, ledger rules, and an
escalation ramp where colour is never decorative (deep red belongs to tier 5 and nothing
else). On top of that sits a premium finish: a single deep ink band, softened radii, layered
shadows, a translucent sticky nav, and scroll-triggered motion.

### Waiting states

`<Loader />` is the house loader — a ball climbing steps, which lands on the ladder
metaphor by accident and is worth keeping. Use it for **any block-level wait**: route
transitions, a panel fetching, a section that isn't ready yet. Sizes are `sm` / `md` / `lg`,
it re-colours itself inside `.on-band`, and it holds still under reduced motion.

It is not an inline spinner. The ball deliberately travels well above its own box, so in a
button or a line of text it would be clipped or overlap the label — those keep the small
Lucide spinner. Anything with room for a block gets the loader.

There is deliberately no logo bar and no testimonials — we have no customers yet, and a fake
one is the fastest way to lose a technical audience. The trust strip states things the
product actually does instead.

## Non-negotiables before any real send

- SPF, DKIM, DMARC on the sending **subdomain**, never the root domain.
- Idempotency keyed on `sequence_steps.id` — a cron that runs twice must not email a client twice.
- Send window: no nights, no weekends. Clamp forward to the next weekday 09:00.
- `SENDING_ENABLED=false` halts everything.
- Tiers 4 and 5 reviewed by a lawyer.
