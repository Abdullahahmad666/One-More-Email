import { getTier, type TierId } from "./ladder";
import { renderEmail, type MergeFields } from "./emails";

/** Demo invoice used by the landing hero and the free generator. */
const BASE: MergeFields = {
  number: "0042",
  amount: "£3,200.00",
  due_date: "14 July 2026",
  days_overdue: 3,
  client_first_name: "Sam",
  payment_link_line: "Payment link: https://pay.example.com/inv-0042",
  signature: "Alex\nAlex Rowe Design",
  deadline_date: "28 August 2026",
  business_name: "Alex Rowe Design",
};

/** Days overdue tracks the tier's own offset, so the copy stays truthful. */
export function demoEmail(tier: TierId) {
  const { defaultOffset } = getTier(tier);
  return renderEmail(tier, { ...BASE, days_overdue: defaultOffset });
}

/**
 * A one-glance version of the same email for the hero's paper stack: the
 * subject plus the body with the greeting, payment link, signature and
 * "sent on behalf of" footer stripped out. Derived from the real template so
 * the stack can never drift from what actually gets sent.
 */
export function demoSheet(tier: TierId) {
  const { subject, body } = demoEmail(tier);

  const snippet = body
    .split("\n—\n")[0]
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(
      (paragraph) =>
        paragraph.length > 0 &&
        !/^(hi\s|sam,|thanks,)/i.test(paragraph) &&
        !/^payment link:/i.test(paragraph) &&
        !paragraph.includes(BASE.business_name),
    )
    .join(" ");

  return { subject, snippet };
}
