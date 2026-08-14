"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, stagger } from "@/components/motion";
import { TIERS } from "@/lib/ladder";

/**
 * Each step shows the actual interface rather than a stock icon. These are
 * miniatures of real screens, built from the same tokens as the product, which
 * is both more convincing than an illustration and honest — we aren't shipping
 * a screenshot of something that doesn't exist yet.
 *
 * Numbered markers appear here and nowhere else on the page, because this is
 * the only content that genuinely is a sequence (§5a).
 */
export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <motion.ol
      initial={reduce ? undefined : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={stagger}
      className="grid gap-4 md:grid-cols-3"
    >
      <Step
        n="01"
        title="Add the invoice"
        body="Client, amount, due date, and a payment link if you have one. Six fields on one screen — no wizard, no import, no accounting software."
        mock={<AddInvoiceMock />}
      />
      <Step
        n="02"
        title="Pick a cadence"
        body="Gentle, Standard or Relentless. Every send date is laid out before a single email leaves, and you can drag any of them."
        mock={<CadenceMock />}
      />
      <Step
        n="03"
        title="Press “They paid”"
        body="One button cancels the rest of the sequence and settles the invoice. That is the entire maintenance burden of this product."
        mock={<SettledMock />}
      />
    </motion.ol>
  );
}

function Step({
  n,
  title,
  body,
  mock,
}: {
  n: string;
  title: string;
  body: string;
  mock: React.ReactNode;
}) {
  return (
    <motion.li variants={fadeUp} className="min-w-0">
      <div className="group flex h-full flex-col rounded-card border border-rule bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
        {/* Fixed height so the rules, numbers and titles line up across all
            three cards regardless of how tall each miniature is. */}
        <div
          aria-hidden
          className="flex h-[164px] items-center overflow-hidden rounded-btn border border-rule bg-paper-2 p-4"
        >
          <div className="w-full">{mock}</div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="type-num text-[11px] text-ink-3">{n}</span>
          <span aria-hidden className="h-px flex-1 bg-rule" />
        </div>

        <h3 className="mt-3 text-title font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-small text-ink-2">{body}</p>
      </div>
    </motion.li>
  );
}

/* ── Miniatures ──────────────────────────────────────────────────── */

function MockField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="type-label w-[64px] shrink-0 text-ink-3">{label}</span>
      <span className="flex-1 truncate rounded-[4px] border border-rule bg-card px-2 py-1.5 text-[12px] text-ink">
        {value}
      </span>
    </div>
  );
}

function AddInvoiceMock() {
  return (
    <div className="flex flex-col gap-2">
      <MockField label="Client" value="Sam Reeve" />
      <MockField label="Amount" value="£3,200.00" />
      <MockField label="Due" value="14 Jul 2026" />
    </div>
  );
}

function CadenceMock() {
  const rows = TIERS.slice(0, 3);
  const dates = ["Thu 17 Jul", "Thu 24 Jul", "Mon 04 Aug"];

  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((tier, i) => (
        <div key={tier.id} className="flex items-center gap-2.5">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ background: `var(${tier.colorVar})` }}
          />
          <span className="type-label flex-1 truncate text-ink-2">
            {String(tier.id).padStart(2, "0")} {tier.name}
          </span>
          <span className="type-num shrink-0 text-[11px] text-ink-3">
            {dates[i]}
          </span>
        </div>
      ))}
      <div className="mt-1 flex items-center gap-2.5">
        <span className="size-1.5 shrink-0 rounded-full bg-rule-strong" />
        <span className="type-label flex-1 text-ink-3">04 Disappointed</span>
        <span className="type-num shrink-0 text-[11px] text-ink-3">Wed 13 Aug</span>
      </div>
    </div>
  );
}

function SettledMock() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-ink">Ana Ruiz</span>
        <span className="type-num text-[12px] text-ink">£1,400</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="type-label text-ink-3">Paid after 19 days</span>
        <span
          className="type-label rounded-[4px] border px-2 py-1"
          style={{
            color: "var(--paid)",
            borderColor: "var(--paid)",
            background: "color-mix(in srgb, var(--paid) 10%, transparent)",
            transform: "rotate(-8deg)",
          }}
        >
          Paid
        </span>
      </div>

      <div className="h-px bg-rule" />

      <div className="flex items-center gap-2">
        <span
          className="size-1.5 shrink-0 rounded-full"
          style={{ background: "var(--t2-gentle)" }}
        />
        <span className="type-label text-ink-3">Stopped at tier 2</span>
      </div>
    </div>
  );
}
