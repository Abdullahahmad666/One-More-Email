import { cn } from "@/lib/utils";

const UNITS = {
  sm: "4px",
  md: "7px",
  lg: "10px",
} as const;

/**
 * The house loader: a ball climbing steps. Use it for any block-level waiting
 * state — route transitions, panels fetching, a section that isn't ready.
 *
 * It is deliberately NOT an inline spinner. The ball travels well above its own
 * box on purpose, so it needs room; inside a button or a text line it would
 * either be clipped or overlap the label. Keep the small inline spinner for
 * those, and use this wherever there's space for it.
 *
 * Colours follow the surface automatically — `.on-band` inverts them.
 */
export function Loader({
  size = "md",
  label = "Loading",
  className,
}: {
  size?: keyof typeof UNITS;
  /** Announced to screen readers; the animation itself is decorative. */
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center gap-4", className)}
    >
      {/* Extra headroom for the climb, so the ball is never clipped. */}
      <div className="flex items-end justify-center pt-[6em]" style={{ fontSize: UNITS[size] }}>
        <span aria-hidden className="loader" style={{ "--loader-unit": UNITS[size] } as React.CSSProperties} />
      </div>

      <span className="type-label text-ink-3">{label}</span>
    </div>
  );
}
