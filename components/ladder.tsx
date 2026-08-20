"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CornerUpLeft, Mail } from "lucide-react";
import { TIERS, type TierId } from "@/lib/ladder";
import { demoEmail } from "@/lib/demo";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The Ladder — the signature element (§4e), and the hero's whole argument.
 * Five rungs, tier 5 at the top. Rungs at or below the selection are filled;
 * rungs above are hairlines. Clicking one shows the real email, word for word.
 *
 * No video, no signup wall on the thing that explains the thing (§5a).
 */
export function Ladder() {
  const [active, setActive] = useState<TierId>(1);
  const reduce = useReducedMotion();

  const email = demoEmail(active);
  const rungs = [...TIERS].reverse();

  return (
    /* min-w-0 lets this grid item shrink below its content's min-content width,
       so the truncated address line can actually truncate instead of forcing
       the whole column wider than the viewport.

       overflow-x-clip belongs here rather than on the page section: the glow
       below is deliberately wider than its box, so containing it at the source
       means the ladder can be dropped anywhere without leaking a horizontal
       scrollbar. Vertical bleed is preserved. */
    <div className="relative min-w-0 overflow-x-clip">
      <div className="glow-ramp absolute inset-0 -z-10" aria-hidden />

      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        className="edge-light overflow-hidden rounded-card bg-card"
      >
        {/* Rungs */}
        <div className="border-b border-rule p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="type-label text-ink-3">Escalation ladder</p>
            <span className="type-label rounded-pill border border-rule px-2 py-1 text-ink-3">
              Try it
            </span>
          </div>

          <ul className="flex flex-col gap-1">
            {rungs.map((tier, i) => {
              const filled = tier.id <= active;
              const isActive = tier.id === active;

              return (
                <li key={tier.id}>
                  <button
                    type="button"
                    onClick={() => setActive(tier.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-btn px-2 py-2 text-left transition-colors duration-200",
                      isActive ? "bg-paper" : "hover:bg-paper/60",
                    )}
                  >
                    <span
                      className={cn(
                        "type-num text-[11px]",
                        isActive ? "text-ink" : "text-ink-3",
                      )}
                    >
                      {String(tier.id).padStart(2, "0")}
                    </span>

                    {/* Fixed width, no wrap: the columns must line up like a ledger. */}
                    <span
                      className={cn(
                        "type-label w-[104px] shrink-0 whitespace-nowrap transition-colors",
                        isActive ? "text-ink" : "text-ink-2",
                      )}
                    >
                      {tier.name}
                    </span>

                    {/* Colour carries the tier, but never alone — the number and
                        name are always present (§4g). */}
                    <span
                      aria-hidden
                      className="relative h-[7px] min-w-0 flex-1 overflow-hidden rounded-pill bg-[color:var(--paper)] ring-1 ring-rule ring-inset"
                    >
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-pill"
                        style={{ background: `var(${tier.colorVar})` }}
                        initial={reduce ? false : { width: "0%" }}
                        animate={{ width: filled ? "100%" : "0%" }}
                        transition={{
                          duration: 0.42,
                          ease: EASE,
                          delay: reduce ? 0 : (TIERS.length - 1 - i) * 0.06,
                        }}
                      />
                      {isActive && !reduce ? (
                        <span className="absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                      ) : null}
                    </span>

                    <span
                      className={cn(
                        "type-num w-[42px] shrink-0 text-right text-[11px]",
                        isActive ? "text-ink" : "text-ink-3",
                      )}
                    >
                      +{tier.defaultOffset}d
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* The email itself */}
        <div className="bg-paper-2 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Mail aria-hidden className="size-3.5 text-ink-3" />
            <p className="type-label text-ink-3">
              What your client receives · tier {active}
            </p>
          </div>

          <div className="overflow-hidden rounded-btn border border-rule bg-card shadow-soft">
            <div className="border-b border-rule px-4 py-3">
              <p className="text-small font-medium text-ink">
                {email.subject}
              </p>
              <p className="mt-1 truncate text-[12px] text-ink-3">
                from {SITE.fromAddress} · to sam@northgate.co.uk
              </p>
            </div>

            <div className="px-4 py-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="text-small whitespace-pre-line text-ink-2"
                >
                  {email.body}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-3 flex items-center gap-2 text-[12px] text-ink-3">
            <CornerUpLeft aria-hidden className="size-3.5 shrink-0" />
            Replies go straight to your own inbox.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
