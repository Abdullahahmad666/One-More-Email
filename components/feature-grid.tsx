"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarClock,
  FileDown,
  Globe,
  History,
  PauseCircle,
  ScrollText,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { fadeUp, stagger } from "@/components/motion";

/**
 * The smaller promises, after the three big ones. Everything here is something
 * the product does or will do at launch — no aspirational filler.
 */
const FEATURES = [
  {
    icon: ScrollText,
    title: "A full send log",
    body: "Every email that went out, stored exactly as it was sent. You can always answer “what did you send my client?”",
  },
  {
    icon: PauseCircle,
    title: "Pause without losing the thread",
    body: "A client asks for a week. Pause holds the sequence and picks the schedule back up where it left off.",
  },
  {
    icon: CalendarClock,
    title: "Drag any send date",
    body: "The presets cover most invoices. When one doesn't, move an individual send instead of rebuilding the cadence.",
  },
  {
    icon: History,
    title: "Days-to-payment, tracked",
    body: "Every settled invoice records how long it took and which tier did it. Useful the next time you set terms.",
  },
  {
    icon: Wallet,
    title: "Your payment link, carried through",
    body: "Whatever link you already use — Stripe, Wise, a bank detail block — rides along in every reminder.",
  },
  {
    icon: Globe,
    title: "Send from your own domain",
    body: "On Studio, chase from your address instead of ours, with the exact DNS records laid out for you.",
  },
  {
    icon: ShieldAlert,
    title: "Bounces stop the sequence",
    body: "If the address is wrong, we halt the chase and tell you, rather than emailing a dead inbox five times.",
  },
  {
    icon: FileDown,
    title: "Export or delete, any time",
    body: "Take everything as CSV, or delete the account outright. Both are real buttons, not a support request.",
  },
];

export function FeatureGrid() {
  const reduce = useReducedMotion();

  return (
    <motion.ul
      initial={reduce ? undefined : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={stagger}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {FEATURES.map((feature) => (
        <motion.li key={feature.title} variants={fadeUp} className="min-w-0">
          <div className="group h-full rounded-card border border-rule bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-raised">
            <span className="inline-flex size-9 items-center justify-center rounded-btn bg-paper text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-[color:var(--paper)]">
              <feature.icon aria-hidden className="size-4" />
            </span>

            <h3 className="mt-4 text-small font-semibold text-ink">
              {feature.title}
            </h3>
            <p className="mt-2 text-small text-ink-2">{feature.body}</p>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}
