"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ } from "@/lib/faq";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * One panel open at a time. Buttons, not <details>, so the height can animate —
 * with aria-expanded and a labelled region so it stays keyboard-navigable.
 */
export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {FAQ.map((item, i) => {
        const isOpen = open === i;

        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    "min-w-0 text-title font-medium transition-colors",
                    isOpen ? "text-ink" : "text-ink-2 group-hover:text-ink",
                  )}
                >
                  {item.q}
                </span>

                <motion.span
                  aria-hidden
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.24, ease: EASE }}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-btn border border-rule text-ink-2"
                >
                  <Plus className="size-4" />
                </motion.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] pr-14 pb-5 text-ink-2">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
