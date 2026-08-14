"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, FilePlus2, Stamp } from "lucide-react";
import { fadeUp, stagger } from "@/components/motion";

/**
 * Numbered markers appear here and nowhere else on the page, because this is
 * the only content that genuinely is a sequence (§5a).
 */
const STEPS = [
  {
    n: "01",
    icon: FilePlus2,
    title: "Add the invoice",
    body: "Client, amount, due date, and a payment link if you have one. Six fields on one screen — no wizard, no import, no accounting software.",
  },
  {
    n: "02",
    icon: CalendarClock,
    title: "Pick a cadence",
    body: "Gentle, Standard or Relentless. You see every send date laid out before a single email leaves, and you can drag any of them.",
  },
  {
    n: "03",
    icon: Stamp,
    title: "Press “They paid”",
    body: "One button cancels the rest of the sequence and settles the invoice. That is the entire maintenance burden of this product.",
  },
];

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
      {STEPS.map((step) => (
        <motion.li key={step.n} variants={fadeUp}>
          <div className="group h-full rounded-card border border-rule bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-float">
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-btn bg-paper text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-[color:var(--paper)]">
                <step.icon aria-hidden className="size-4" />
              </span>
              <span className="type-num text-[11px] text-ink-3">{step.n}</span>
            </div>

            <h3 className="mt-5 text-title font-semibold text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-small text-ink-2">{step.body}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
