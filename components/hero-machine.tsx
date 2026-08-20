"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TIERS } from "@/lib/ladder";
import { demoSheet } from "@/lib/demo";
import { EmailCapture } from "@/components/email-capture";
import { cn } from "@/lib/utils";

/**
 * The hero is the product running, not a description of it: 45 days of chasing
 * play out in about twelve seconds while the visitor does nothing, which is
 * precisely the pitch. Pressing "They paid" ends it early — the one button the
 * real product has.
 */

const TOTAL_DAYS = 45;
const MS_PER_DAY = 120;
/** Pause on each send so the sheet can be read before the clock moves on. */
const DWELL_MS = 900;
const SHEET_OFFSET = 44;

/**
 * How long the ending holds before the demo runs again. The exhausted verdict
 * is three lines and needs longer than the paid one, which is a single
 * sentence the visitor already understood — they pressed the button.
 */
const RESTART_MS = { paid: 5000, exhausted: 6500 } as const;

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "idle" | "running" | "paid" | "exhausted";

const SHEETS = TIERS.map((tier) => ({ tier, ...demoSheet(tier.id) }));

export function HeroMachine() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const [day, setDay] = useState(0);
  const [sent, setSent] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  /** Nothing animates or auto-restarts while the machine is off screen. */
  const [inView, setInView] = useState(false);

  // Refs carry the live values into the animation frame without re-subscribing.
  const dayRef = useRef(0);
  const sentRef = useRef(0);
  const dwellUntil = useRef(0);
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;
  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;

  const jumpToEnd = useCallback(() => {
    dayRef.current = TOTAL_DAYS;
    sentRef.current = TIERS.length;
    setDay(TOTAL_DAYS);
    setSent(TIERS.length);
    setPhase("exhausted");
  }, []);

  /* Track visibility for the whole lifetime, not just the first entry: the
     clock and the auto-restart both stay parked while the hero is scrolled
     past, so nothing loops at someone reading the pricing table. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting || phaseRef.current !== "idle") return;
        // Reduced motion gets the finished state rather than no state.
        if (reduceRef.current) jumpToEnd();
        else setPhase("running");
      },
      // The machine is taller than most viewports, so a percentage threshold
      // can never be met on a short screen. Start as soon as any of it shows.
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [jumpToEnd]);

  /* The clock. */
  useEffect(() => {
    if (phase !== "running" || !inView) return;

    let last: number | null = null;
    let frame = requestAnimationFrame(function step(ts) {
      if (last === null) last = ts;
      const delta = ts - last;
      last = ts;

      if (ts >= dwellUntil.current) {
        const next = TIERS.find((t) => t.defaultOffset > dayRef.current);
        const ceiling = next ? next.defaultOffset : TOTAL_DAYS;

        dayRef.current = Math.min(dayRef.current + delta / MS_PER_DAY, ceiling);
        setDay(dayRef.current);

        if (next && dayRef.current >= next.defaultOffset) {
          sentRef.current += 1;
          setSent(sentRef.current);
          dwellUntil.current = ts + DWELL_MS;
        }

        if (dayRef.current >= TOTAL_DAYS && sentRef.current === TIERS.length) {
          setPhase("exhausted");
          return;
        }
      }

      frame = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(frame);
  }, [phase, inView]);

  const markPaid = () => setPhase((p) => (p === "paid" ? p : "paid"));

  const replay = useCallback(() => {
    dayRef.current = 0;
    sentRef.current = 0;
    dwellUntil.current = 0;
    setDay(0);
    setSent(0);
    setPhase("running");
  }, []);

  /* Run it again on its own. No button asking to re-watch — if the ending has
     been on screen long enough to read, the demo simply starts over. */
  useEffect(() => {
    if (reduce || !inView) return;
    if (phase !== "paid" && phase !== "exhausted") return;

    const timer = setTimeout(replay, RESTART_MS[phase]);
    return () => clearTimeout(timer);
  }, [phase, inView, reduce, replay]);

  const wholeDay = Math.floor(day);
  const current = [...TIERS].reverse().find((t) => day >= t.defaultOffset);
  const settled = phase === "paid";
  const finished = phase === "exhausted";

  const status = settled
    ? `paid on day ${wholeDay}`
    : finished
      ? "still unpaid"
      : "awaiting payment";

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-start lg:gap-14"
    >
      {/* â”€â”€ The clock â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <span className="type-label text-ink-3">Day</span>

          <span
            className="type-num text-[64px] leading-[0.86] tracking-[-0.05em] tabular-nums transition-colors duration-300 sm:text-[92px] lg:text-[108px]"
            style={{
              color: current ? `var(${current.colorVar})` : "var(--ink)",
            }}
          >
            {String(wholeDay).padStart(2, "0")}
          </span>

          <span
            className="type-label rounded-pill px-2.5 py-1.5 transition-colors duration-300"
            style={{
              background: current ? `var(${current.washVar})` : "var(--paper-2)",
              color: current ? `var(${current.deepVar})` : "var(--ink-3)",
            }}
          >
            {settled
              ? "Chasing stopped"
              : current
                ? `0${current.id} · ${current.name}`
                : "Not yet due"}
          </span>
        </div>

        <p className="type-num mt-5 border-t border-rule pt-4 text-[12px] text-ink-3">
          <span className="text-ink">Northgate Ltd</span> · £3,200 · {status}
        </p>

        <Rail day={day} />
      </div>

      {/* â”€â”€ The desk â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <div className="flex items-center justify-between gap-4">
          <span className="type-label text-ink-3">Sent on your behalf</span>
          <span className="type-label text-ink-3">{sent} of 5</span>
        </div>

        <div className="relative mt-4 h-[318px] sm:h-[308px]">
          {sent === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-card border border-dashed border-rule-strong p-6">
              <p className="max-w-[26ch] text-center text-small text-ink-3">
                Nothing sent yet. The first reminder goes out three days after
                the due date.
              </p>
            </div>
          ) : null}

          <AnimatePresence>
            {SHEETS.slice(0, sent).map(({ tier, subject, snippet }, i) => (
              <motion.article
                key={tier.id}
                initial={reduce ? false : { opacity: 0, y: -26, scale: 1.015 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.34, ease: EASE }}
                className="absolute inset-x-0 rounded-card border border-rule-strong bg-card p-4 shadow-soft"
                style={{
                  top: i * SHEET_OFFSET,
                  zIndex: 10 + i,
                  rotate: `${(i % 2 ? -1 : 1) * (0.4 + i * 0.2)}deg`,
                }}
              >
                <span
                  className="type-label inline-block rounded-pill px-2 py-1 text-[9px]"
                  style={{
                    background: `var(${tier.washVar})`,
                    color: `var(${tier.deepVar})`,
                  }}
                >
                  0{tier.id} · {tier.name}
                </span>

                <p className="type-num mt-2.5 text-[11px] leading-snug text-ink">
                  {subject}
                </p>
                <p className="mt-1.5 line-clamp-3 text-[12.5px] leading-snug text-ink-2">
                  {snippet}
                </p>
                <p className="type-label mt-2.5 text-[9px] text-ink-3">
                  Sent day {tier.defaultOffset} · to sam@northgate.co.uk
                </p>
              </motion.article>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {settled ? (
              <motion.div
                key="stamp"
                aria-hidden
                data-hero-stamp
                initial={
                  reduce
                    ? { opacity: 0.92, scale: 1 }
                    : { opacity: 0, scale: 2.6, y: -16 }
                }
                animate={{ opacity: 0.92, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 460, damping: 14, mass: 0.8 }
                }
                className="pointer-events-none absolute top-[92px] left-1/2 z-20 -translate-x-1/2 rounded-[4px] border-[3px] px-5 py-2"
                style={{
                  rotate: "-13deg",
                  color: "var(--t5-final)",
                  borderColor: "var(--t5-final)",
                  background: "color-mix(in srgb, var(--card) 55%, transparent)",
                }}
              >
                <span className="type-num text-[26px] tracking-[0.14em] sm:text-[30px]">
                  PAID
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* â”€â”€ Controls, verdict, capture â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="min-w-0 lg:col-start-1 lg:row-start-2">
        {/*
          The controls swap rather than stack up as dead buttons. While the
          demo runs there is exactly one thing to do — stop it. Once it's over,
          "They paid" has nothing left to act on, so the row becomes a quiet
          way back instead of two disabled controls sitting side by side.
        */}
        <div className="flex min-h-[44px] flex-wrap items-center gap-3">
          {settled || finished ? (
            /* A depleting rule instead of a button: it explains the restart
               without asking for a click, and it can't be mistaken for a
               product control the way "Replay" could.

               Hidden under reduced motion, where there is no auto-restart to
               announce — the demo has already shown its finished state. */
            reduce ? null : (
            <div className="flex items-center gap-3">
              <span className="type-label text-ink-3">Starting again</span>
              <span className="relative block h-px w-24 overflow-hidden bg-rule">
                <motion.span
                  key={`${phase}-countdown`}
                  className="absolute inset-y-0 left-0 bg-rule-strong"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{
                    duration: RESTART_MS[settled ? "paid" : "exhausted"] / 1000,
                    ease: "linear",
                  }}
                />
              </span>
            </div>
            )
          ) : (
            <>
              <button
                type="button"
                onClick={markPaid}
                className={cn(
                  "relative inline-flex h-11 items-center rounded-btn bg-ink px-5 text-small font-medium text-[color:var(--paper)] shadow-raised",
                  sent >= 2 ? "animate-ping-ring" : "",
                )}
              >
                They paid
              </button>

              <span className="text-small text-ink-3">
                Or wait — it sends the next one on its own.
              </span>
            </>
          )}
        </div>

        <AnimatePresence>
          {settled || finished ? (
            <motion.p
              key={phase}
              role="status"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: EASE }}
              className="mt-5 max-w-[60ch] rounded-card border border-rule-strong bg-card p-4 text-small text-ink-2"
            >
              {settled ? (
                <>
                  <span className="font-semibold text-ink">
                    That&apos;s the entire product.
                  </span>{" "}
                  {sent} email{sent === 1 ? "" : "s"} sent while you did nothing,
                  and one button to stop it. Your client only ever saw a polite
                  reminder.
                </>
              ) : (
                <>
                  <span className="font-semibold text-ink">
                    That&apos;s where the ladder ends.
                  </span>{" "}
                  Five emails over 45 days, and no guessing when to send the
                  next one. If they still haven&apos;t paid, we say so plainly
                  and show you what actually comes next.
                </>
              )}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <div className="mt-7 max-w-[480px]">
          <EmailCapture source="hero" />
        </div>
      </div>
    </div>
  );
}

/** 45 days as a single line, with a tick where each email lands. */
function Rail({ day }: { day: number }) {
  const percent = Math.min(day / TOTAL_DAYS, 1) * 100;

  return (
    <div aria-hidden className="relative mt-7 h-9">
      <div className="absolute top-3.5 right-0 left-0 h-[5px] rounded-[1px] bg-rule" />

      {/* Gradient is painted full-width and clipped, so the colours stay put
          as the fill grows rather than stretching with it. */}
      <div
        className="absolute top-3.5 right-0 left-0 h-[5px] rounded-[1px]"
        style={{
          background:
            "linear-gradient(90deg, var(--t1-friendly) 0%, var(--t2-gentle) 22%, var(--t3-concerned) 47%, var(--t4-disappointed) 67%, var(--t5-final) 100%)",
          clipPath: `inset(0 ${100 - percent}% 0 0)`,
        }}
      />

      {TIERS.map((tier) => {
        const hit = day >= tier.defaultOffset;
        return (
          <div
            key={tier.id}
            className={cn(
              "absolute top-1.5 h-[21px]",
              hit ? "w-0.5 bg-ink" : "w-px bg-rule-strong",
            )}
            style={{ left: `${(tier.defaultOffset / TOTAL_DAYS) * 100}%` }}
          >
            <span className="type-num absolute top-[26px] left-1/2 -translate-x-1/2 text-[9px] text-ink-3">
              {tier.defaultOffset}
            </span>
          </div>
        );
      })}

      <div
        className="absolute top-2 h-[15px] w-[3px] -translate-x-[1px] bg-ink"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}
