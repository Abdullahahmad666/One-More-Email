"use client";

import { useEffect, useState } from "react";
import { TIERS, type TierId } from "@/lib/ladder";
import { demoEmail } from "@/lib/demo";

/**
 * The Ladder — the signature element (§4e). Five rungs, top to bottom, tier 5
 * first. Rungs at or below the selected tier are filled; rungs above are
 * hairline outlines. Clicking a rung shows the real email for that tier.
 *
 * This is the demo. No video, no signup wall on the thing that explains the
 * thing (§5a).
 */
export function Ladder() {
  const [active, setActive] = useState<TierId>(1);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);

  // Rung fill: 240ms ease-out, staggered 60ms on first paint (§4f).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(true));
    const timer = setTimeout(() => setSettled(true), TIERS.length * 60 + 240);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  const email = demoEmail(active);
  const rungs = [...TIERS].reverse(); // 05 at the top

  return (
    <div className="border border-rule bg-card">
      <div className="border-b border-rule px-4 py-3 sm:px-6">
        <p className="type-label text-ink-3">The escalation ladder</p>
      </div>

      <ul className="px-4 py-4 sm:px-6">
        {rungs.map((tier, i) => {
          const filled = tier.id <= active;
          const isActive = tier.id === active;
          // Stagger runs top-down on first paint, then delays are dropped so
          // clicks feel immediate.
          const delay = settled ? 0 : (TIERS.length - 1 - i) * 60;

          return (
            <li key={tier.id}>
              <button
                type="button"
                onClick={() => setActive(tier.id)}
                aria-pressed={isActive}
                className="group flex w-full items-center gap-3 py-2 text-left sm:gap-4"
              >
                <span
                  className={`type-num text-[11px] tabular-nums ${
                    isActive ? "text-ink" : "text-ink-3"
                  }`}
                >
                  {String(tier.id).padStart(2, "0")}
                </span>

                {/* Fixed width and no wrapping so all five rungs align — the
                    whole point of a ledger is that the columns line up. */}
                <span
                  className={`type-label w-[104px] shrink-0 whitespace-nowrap ${
                    isActive ? "text-ink" : "text-ink-2"
                  }`}
                >
                  {tier.name}
                </span>

                {/* The bar carries tier colour. It is never the only signal —
                    the number and the name are always present (§4g). */}
                <span
                  aria-hidden
                  className="relative h-[8px] min-w-0 flex-1 border border-rule"
                >
                  <span
                    className="absolute inset-0 origin-left"
                    style={{
                      background: `var(${tier.colorVar})`,
                      transform: `scaleX(${revealed && filled ? 1 : 0})`,
                      transition: "transform 240ms ease-out",
                      transitionDelay: `${delay}ms`,
                    }}
                  />
                </span>

                <span
                  className={`type-num w-[42px] shrink-0 text-right text-[11px] ${
                    isActive ? "text-ink" : "text-ink-3"
                  }`}
                >
                  +{tier.defaultOffset}d
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-rule px-4 py-4 sm:px-6">
        <p className="type-label mb-3 text-ink-3">
          What your client receives · tier {active}
        </p>

        {/* key forces the 160ms fade on every rung change. */}
        <div key={active} className="animate-fade-in paper-lift border border-rule bg-paper p-4">
          <p className="text-small font-medium">
            Subject: {email.subject}
          </p>
          <hr className="my-3 border-0 border-t border-rule" />
          <p className="text-small whitespace-pre-line text-ink-2">
            {email.body}
          </p>
        </div>

        <p className="type-label mt-3 text-ink-3">
          ↑ click any rung — this is the real email, word for word
        </p>
      </div>
    </div>
  );
}
