"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The positioning in one glance: the client's email on the left, our interface
 * on the right. It defuses the obvious objection — "I can't send something
 * rude to a client" (§5a).
 *
 * The stamp is the one theatrical moment in the product, so it's the one
 * theatrical moment on the page too.
 */
export function SplitDemo() {
  const [paid, setPaid] = useState(false);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* What your client sees */}
      <div className="border border-rule bg-card">
        <div className="border-b border-rule px-4 py-3">
          <p className="type-label text-ink-3">What your client sees</p>
        </div>
        <div className="p-4">
          <p className="text-small font-medium">
            Subject: Overdue: invoice 0042, £3,200.00
          </p>
          <hr className="my-3 border-0 border-t border-rule" />
          <p className="text-small whitespace-pre-line text-ink-2">
            {`Sam,

Invoice 0042 for £3,200.00 was due on 14 July 2026 and remains unpaid 30 days later, despite three previous emails.

The work was delivered and accepted, and payment terms were agreed at the outset. I need either payment or a firm payment date by 28 August 2026.`}
          </p>
        </div>
      </div>

      {/* What you see */}
      <div className="relative border border-rule bg-card">
        <div className="border-b border-rule px-4 py-3">
          <p className="type-label text-ink-3">What you see</p>
        </div>

        <div className="p-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="type-label text-ink-3">Days waited</p>
            <CountUp target={412} />
          </div>

          <hr className="my-4 border-0 border-t border-rule" />

          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="h-[8px] w-[8px] shrink-0"
              style={{ background: "var(--t4-disappointed)" }}
            />
            <span className="type-label">04 Disappointed</span>
          </div>

          <p className="mt-2 text-small text-ink-2">
            Northgate Ltd · £3,200 · next email in 15 days
          </p>

          <hr className="my-4 border-0 border-t border-rule" />

          <button
            type="button"
            onClick={() => setPaid((v) => !v)}
            className="type-label h-11 w-full rounded-[2px] bg-ink text-[color:var(--card)]"
          >
            {paid ? "Chasing stopped. Nice." : "They paid"}
          </button>

          <p className="type-label mt-3 text-ink-3">
            ↑ press it — that&apos;s the whole stop mechanism
          </p>
        </div>

        {paid ? (
          <span
            aria-hidden
            className="animate-stamp-in pointer-events-none absolute right-6 bottom-24 border-2 px-3 py-1"
            style={{ color: "var(--paid)", borderColor: "var(--paid)" }}
          >
            <span className="type-label text-[14px]">Paid</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The joke metric, counted up once when it scrolls into view. It's the number
 * people screenshot, so it's worth the one extra moment of motion (§5b).
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
        const progress = Math.min((now - start) / 800, 1);
        // ease-out, the same curve as the ladder fill
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
    <p ref={ref} className="type-num text-[28px] leading-none tabular-nums">
      {value}
    </p>
  );
}
