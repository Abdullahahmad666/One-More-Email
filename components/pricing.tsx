"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { fadeUp, stagger } from "@/components/motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type Billing = "monthly" | "annual";

/**
 * One shared row set across all three plans, so the columns line up and the
 * differences are readable at a glance. `true` renders a tick, `false` a dash,
 * a string renders the value itself.
 */
const ROWS = [
  "Active invoices",
  "Full five-tier ladder",
  "Custom cadence",
  "CSV export",
  "Send from your own domain",
] as const;

const PLANS = [
  {
    name: "Free",
    tagline: "Fix the client who's ghosting you today.",
    monthly: 0,
    annual: 0,
    values: ["2", true, false, false, false],
    featured: false,
  },
  {
    name: "Solo",
    tagline: "For freelancers with a steady stream of late payers.",
    monthly: 9,
    annual: 90,
    values: ["20", true, true, true, false],
    featured: true,
  },
  {
    name: "Studio",
    tagline: "Chase from your own domain, at any volume.",
    monthly: 19,
    annual: 190,
    values: ["Unlimited", true, true, true, true],
    featured: false,
  },
] as const;

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const reduce = useReducedMotion();

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex justify-start">
        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex items-center gap-1 rounded-pill border border-rule bg-card p-1 shadow-soft"
        >
          {(["monthly", "annual"] as const).map((option) => {
            const active = billing === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setBilling(option)}
                aria-pressed={active}
                className={cn(
                  "type-label relative rounded-pill px-4 py-2 transition-colors",
                  active ? "text-[color:var(--paper)]" : "text-ink-2 hover:text-ink",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="billing-pill"
                    className="absolute inset-0 rounded-pill bg-ink"
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.28, ease: EASE }
                    }
                  />
                ) : null}
                <span className="relative">
                  {option === "monthly" ? "Monthly" : "Annual"}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {billing === "annual" ? (
            <motion.span
              initial={reduce ? undefined : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="type-label ml-3 self-center text-[color:var(--paid)]"
            >
              Two months free
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Plans */}
      <motion.div
        initial={reduce ? undefined : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        variants={stagger}
        className="mt-8 grid gap-4 md:grid-cols-3"
      >
        {PLANS.map((plan) => {
          const price =
            billing === "annual" ? plan.annual : plan.monthly;
          const suffix =
            plan.monthly === 0 ? "forever" : billing === "annual" ? "a year" : "a month";

          return (
            <motion.div key={plan.name} variants={fadeUp} className="min-w-0">
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

                <div className="mt-4 flex items-baseline gap-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={`${plan.name}-${price}`}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="type-num text-[36px] leading-none text-ink"
                    >
                      ${price}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-small text-ink-3">{suffix}</span>
                </div>

                <p className="mt-3 min-h-[42px] text-small text-ink-2">
                  {plan.tagline}
                </p>

                <hr className="my-5 border-0 border-t border-rule" />

                <ul className="flex flex-1 flex-col gap-3">
                  {ROWS.map((row, i) => {
                    const value = plan.values[i];
                    const included = value !== false;

                    return (
                      <li key={row} className="flex items-start gap-2.5">
                        {included ? (
                          <Check
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-[color:var(--paid)]"
                          />
                        ) : (
                          <Minus
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-ink-3"
                          />
                        )}
                        <span
                          className={cn(
                            "text-small",
                            included ? "text-ink-2" : "text-ink-3 line-through",
                          )}
                        >
                          {typeof value === "string" ? (
                            <>
                              <span className="type-num text-ink">{value}</span>{" "}
                              {row.toLowerCase()}
                            </>
                          ) : (
                            row
                          )}
                        </span>
                      </li>
                    );
                  })}
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
          );
        })}
      </motion.div>

      <p className="mt-6 text-small text-ink-3">
        Prices in USD. Sales tax or VAT may apply at checkout. Cancel any time —
        your sequences keep running until the period you paid for ends.
      </p>
    </div>
  );
}
