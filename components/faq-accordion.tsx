import { FAQ } from "@/lib/faq";

/**
 * Native <details> — keyboard accessible and works without JavaScript.
 * The open/close marker is a rule, not an icon.
 */
export function FaqAccordion() {
  return (
    <div className="border-t border-rule">
      {FAQ.map((item) => (
        <details key={item.q} className="group border-b border-rule">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-title marker:hidden">
            <span>{item.q}</span>
            <span
              aria-hidden
              className="type-num shrink-0 text-ink-3 group-open:hidden"
            >
              +
            </span>
            <span
              aria-hidden
              className="type-num hidden shrink-0 text-ink-3 group-open:inline"
            >
              −
            </span>
          </summary>
          <p className="max-w-[680px] pb-4 text-ink-2">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
