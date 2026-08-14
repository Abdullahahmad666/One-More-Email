"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { fadeUp, stagger } from "@/components/motion";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "forever, not a trial",
    lines: ["2 active invoices", "All five tiers", "Shared sending address"],
    featured: false,
  },
  {
    name: "Solo",
    price: "$9",
    note: "per month · $90 a year",
    lines: [
      "20 active invoices",
      "All five tiers",
      "Custom cadence",
      "CSV export",
    ],
    featured: true,
  },
  {
    name: "Studio",
    price: "$19",
    note: "per month · $190 a year",
    lines: [
      "Unlimited invoices",
      "Send from your own domain",
      "Custom cadence",
      "CSV export",
    ],
    featured: false,
  },
];

export function Pricing() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? undefined : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={stagger}
      className="grid gap-4 md:grid-cols-3"
    >
      {PLANS.map((plan) => (
        <motion.div key={plan.name} variants={fadeUp}>
          <div
            className={cn(
              "relative flex h-full flex-col rounded-card border p-6 transition-all duration-300 hover:-translate-y-1",
              plan.featured
                ? "border-ink bg-card shadow-float"
                : "border-rule bg-card shadow-soft hover:shadow-raised",
            )}
          >
            {plan.featured ? (
              <span className="type-label absolute -top-2.5 left-6 rounded-pill bg-ink px-3 py-1 text-[color:var(--paper)]">
                Most freelancers
              </span>
            ) : null}

            <p className="type-label text-ink-3">{plan.name}</p>

            <p className="type-num mt-4 text-[36px] leading-none text-ink">
              {plan.price}
            </p>
            <p className="mt-2 text-small text-ink-3">{plan.note}</p>

            <hr className="my-5 border-0 border-t border-rule" />

            <ul className="flex flex-1 flex-col gap-2.5">
              {plan.lines.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-[color:var(--paid)]"
                  />
                  <span className="text-small text-ink-2">{line}</span>
                </li>
              ))}
            </ul>

            <a
              href="#signup"
              className={cn(
                "mt-6 inline-flex h-11 items-center justify-center rounded-btn text-small font-medium transition-colors",
                plan.featured
                  ? "bg-ink text-[color:var(--paper)]"
                  : "border border-rule-strong text-ink hover:bg-paper",
              )}
            >
              Start chasing
            </a>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
