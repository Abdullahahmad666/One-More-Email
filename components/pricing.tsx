const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "forever",
    lines: ["2 active invoices", "All five tiers", "Shared sending address"],
  },
  {
    name: "Solo",
    price: "$9",
    note: "per month · $90 a year",
    lines: [
      "20 active invoices",
      "Custom cadence",
      "CSV export",
      "Shared sending address",
    ],
  },
  {
    name: "Studio",
    price: "$19",
    note: "per month · $190 a year",
    lines: [
      "Unlimited invoices",
      "Custom cadence",
      "CSV export",
      "Send from your own domain",
    ],
  },
] as const;

export function Pricing() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {PLANS.map((plan) => (
        <div key={plan.name} className="border border-rule bg-card p-6">
          <p className="type-label text-ink-3">{plan.name}</p>
          <p className="type-num mt-3 text-[28px] leading-none">{plan.price}</p>
          <p className="mt-2 text-small text-ink-3">{plan.note}</p>

          <hr className="my-4 border-0 border-t border-rule" />

          <ul className="flex flex-col gap-2">
            {plan.lines.map((line) => (
              <li key={line} className="text-small text-ink-2">
                {line}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
