"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type MotionProps,
} from "framer-motion";
import { Check, Mail, Pause, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The stamp's motion, defined once at module scope.
 *
 * These objects must keep a stable identity across renders. Inline literals —
 * particularly the `scale` keyframe array — look new to Framer on every parent
 * re-render, which restarts the entry animation on top of the exit and makes
 * the stamp flash back to full opacity before it unmounts.
 */
const STAMP_MOTION: MotionProps = {
  initial: { opacity: 0, rotate: -8, scale: 1.35 },
  animate: {
    opacity: 1,
    rotate: -8,
    scale: 1,
    /*
      A spring gives the press-and-settle overshoot the stamp needs. The
      earlier version used a `scale` keyframe array with `times`, but a
      transition's `times` applies to every property in the target — the
      three-stop timing corrupted the scalar `opacity` and `rotate` alongside
      it, which made the stamp fade up, fall away and snap back on entry.
    */
    transition: {
      scale: { type: "spring", stiffness: 520, damping: 17, mass: 0.7 },
      opacity: { duration: 0.14, ease: "easeOut" },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.16, ease: "easeOut" },
  },
};

/** Reduced motion: the stamp is simply a static stamp (§4f). */
const STAMP_MOTION_REDUCED: MotionProps = {
  initial: { opacity: 1, rotate: -8, scale: 1 },
  animate: { opacity: 1, rotate: -8, scale: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

/**
 * The positioning in one glance: the client's email on the left, our interface
 * on the right. It defuses the obvious objection — "I can't send something
 * rude to a client" (§5a).
 *
 * This whole section sits on the one dark band in the product, because the
 * contrast is the point: the same invoice, two completely different tones.
 */
export function SplitDemo() {
  const [paid, setPaid] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* What your client sees */}
      <div className="overflow-hidden rounded-card border border-band-rule bg-band-2">
        <div className="flex items-center gap-2 border-b border-band-rule px-5 py-4">
          <Mail aria-hidden className="size-3.5 text-band-ink-2" />
          <p className="type-label text-band-ink-2">What your client sees</p>
        </div>

        <div className="p-5">
          <p className="text-small font-medium text-band-ink">
            Overdue: invoice 0042, £3,200.00
          </p>
          <hr className="my-4 border-0 border-t border-band-rule" />
          <p className="text-small whitespace-pre-line text-band-ink-2">
            {`Sam,

Invoice 0042 for £3,200.00 was due on 14 July 2026 and remains unpaid 30 days later, despite three previous emails.

The work was delivered and accepted, and payment terms were agreed at the outset. I need either payment or a firm payment date by 28 August 2026.

Alex
Alex Rowe Design`}
          </p>
        </div>
      </div>

      {/* What you see */}
      <div className="relative overflow-hidden rounded-card border border-band-rule bg-band-2">
        <div className="flex items-center gap-2 border-b border-band-rule px-5 py-4">
          <span
            aria-hidden
            className="size-1.5 rounded-full"
            style={{ background: "var(--t4-disappointed)" }}
          />
          <p className="type-label text-band-ink-2">What you see</p>
        </div>

        <div className="p-5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="type-label text-band-ink-2">Days waited</p>
            <CountUp target={412} />
          </div>

          <hr className="my-4 border-0 border-t border-band-rule" />

          <div className="flex flex-wrap items-center gap-2">
            <span
              className="type-label inline-flex items-center gap-2 rounded-pill px-3 py-1.5"
              style={{
                color: "var(--t4-disappointed)",
                background: "color-mix(in srgb, var(--t4-disappointed) 16%, transparent)",
              }}
            >
              <span
                aria-hidden
                className="size-1.5 rounded-full"
                style={{ background: "var(--t4-disappointed)" }}
              />
              04 Disappointed
            </span>
            <span className="text-small text-band-ink-2">
              Northgate Ltd · next email in 15 days
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <motion.button
              type="button"
              onClick={() => setPaid((v) => !v)}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.18, ease: EASE }}
              className={cn(
                "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-btn text-small font-medium transition-colors",
                paid
                  ? "bg-[color:var(--paid)] text-band-ink"
                  : "bg-band-ink text-band",
              )}
            >
              {paid ? <Check aria-hidden className="size-4" /> : null}
              {paid ? "Chasing stopped. Nice." : "They paid"}
            </motion.button>

            <span className="inline-flex h-11 items-center justify-center gap-2 rounded-btn border border-band-rule px-4 text-small text-band-ink-2">
              <Pause aria-hidden className="size-3.5" />
              Pause 7 days
            </span>

            <span className="inline-flex h-11 items-center justify-center gap-2 rounded-btn border border-band-rule px-4 text-small text-band-ink-2">
              <SendHorizontal aria-hidden className="size-3.5" />
              Send next
            </span>
          </div>

          {/* The hint and the stamp share one row and swap places. The stamp is
              in normal flow rather than absolutely positioned, so it can't land
              on the days-waited figure or the buttons at any width. min-h keeps
              the card from resizing when they swap.

              The hint lives in a wrapper that is always rendered, so the stamp
              keeps a fixed position among its siblings. If React had to move
              the stamp's DOM node to make room for the hint, that counts as a
              re-insertion and would restart its entry animation mid-exit. */}
          <div className="mt-4 flex min-h-[42px] items-center gap-4">
            <div className="min-w-0 flex-1">
              {paid ? null : (
                <p className="type-label text-band-ink-2">
                  ↑ press it — that&apos;s the whole stop mechanism
                </p>
              )}
            </div>

            <AnimatePresence>
              {paid ? (
                <motion.span
                  key="paid-stamp"
                  aria-hidden
                  data-stamp
                  /* Framer owns entry and exit. A CSS keyframe here would win
                     the cascade over Framer's inline opacity and strand the
                     stamp on screen through its exit. */
                  {...(reduce ? STAMP_MOTION_REDUCED : STAMP_MOTION)}
                  className="shrink-0 rounded-btn border-2 px-4 py-1.5"
                  style={{
                    color: "var(--paid)",
                    borderColor: "var(--paid)",
                    background:
                      "color-mix(in srgb, var(--paid) 14%, var(--band-2))",
                    boxShadow:
                      "1px 1px 0 color-mix(in srgb, var(--paid) 45%, transparent)",
                  }}
                >
                  <span className="type-label text-[15px]">Paid</span>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * The joke metric, counted up once when it scrolls into view. It's the number
 * people screenshot, so it earns its moment of motion (§5b).
 */
function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      // Reduced motion gets the final number, immediately (§4f).
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setValue(target);
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 900, 1);
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <p
      ref={ref}
      className="type-num text-[32px] leading-none text-band-ink tabular-nums"
    >
      {value}
    </p>
  );
}
