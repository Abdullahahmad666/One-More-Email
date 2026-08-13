/**
 * The five emails (§6a). These are the product — every one is professional,
 * and the tier name never appears in them.
 *
 * Hard rules for tier 5: never state a consequence you aren't prepared to
 * carry out, never imply you are a collections agency or a solicitor, never
 * invent interest charges that weren't in the original agreement. Tiers 4 and
 * 5 need a lawyer's eyes before launch (§6a, §14).
 */

import type { TierId } from "./ladder";

export interface MergeFields {
  number: string;
  amount: string;
  due_date: string;
  days_overdue: number;
  client_first_name: string;
  payment_link_line: string;
  signature: string;
  deadline_date: string;
  business_name: string;
}

export interface EmailTemplate {
  tier: TierId;
  subject: (f: MergeFields) => string;
  body: (f: MergeFields) => string;
}

const FOOTER = (f: MergeFields) => `Sent on behalf of ${f.business_name}.`;

export const TEMPLATES: Record<TierId, EmailTemplate> = {
  1: {
    tier: 1,
    subject: (f) => `Invoice ${f.number} — just a nudge`,
    body: (f) => `Hi ${f.client_first_name},

Hope you're well. Just a quick note that invoice ${f.number} for ${f.amount} was due on ${f.due_date} — I know these things slip through.

${f.payment_link_line}

If it's already on its way, ignore me entirely.

Thanks,
${f.signature}`,
  },
  2: {
    tier: 2,
    subject: (f) => `Invoice ${f.number} — ${f.amount} outstanding`,
    body: (f) => `Hi ${f.client_first_name},

Following up on invoice ${f.number} for ${f.amount}, which was due on ${f.due_date} and is now ${f.days_overdue} days outstanding.

${f.payment_link_line}

If there's anything you need from me to get it processed — a PO number, a resend to accounts — just let me know.

Thanks,
${f.signature}`,
  },
  3: {
    tier: 3,
    subject: (f) => `Invoice ${f.number} — three weeks overdue`,
    body: (f) => `Hi ${f.client_first_name},

Invoice ${f.number} for ${f.amount} is now ${f.days_overdue} days past its due date and I haven't had a response to my previous emails.

Could you let me know when I can expect payment? If there's a problem with the invoice or the work, I'd rather hear it than keep chasing.

${f.payment_link_line}

${f.signature}`,
  },
  4: {
    tier: 4,
    subject: (f) => `Overdue: invoice ${f.number}, ${f.amount}`,
    body: (f) => `${f.client_first_name},

Invoice ${f.number} for ${f.amount} was due on ${f.due_date} and remains unpaid ${f.days_overdue} days later, despite three previous emails.

The work was delivered and accepted, and payment terms were agreed at the outset. I need either payment or a firm payment date by ${f.deadline_date}.

${f.payment_link_line}

${f.signature}`,
  },
  5: {
    tier: 5,
    subject: (f) => `Final reminder — invoice ${f.number}`,
    body: (f) => `${f.client_first_name},

This is my final reminder regarding invoice ${f.number} for ${f.amount}, now ${f.days_overdue} days overdue.

If payment or a written payment plan isn't received by ${f.deadline_date}, I'll begin the formal recovery process available to me.

I'd much rather resolve this directly. Please get in touch.

${f.signature}`,
  },
};

export function renderEmail(tier: TierId, fields: MergeFields) {
  const template = TEMPLATES[tier];
  return {
    subject: template.subject(fields),
    // Plain text, no tracking pixels, no images, no CTA buttons (§9d).
    body: `${template.body(fields)}\n\n—\n${FOOTER(fields)}`,
  };
}

/** Sample fields for the landing-page demo and the free generator tool. */
export const DEMO_FIELDS: MergeFields = {
  number: "0042",
  amount: "£3,200.00",
  due_date: "14 July 2026",
  days_overdue: 21,
  client_first_name: "Sam",
  payment_link_line: "You can pay here: https://pay.example.com/0042",
  signature: "Alex",
  deadline_date: "28 August 2026",
  business_name: "Alex Rowe Design",
};
