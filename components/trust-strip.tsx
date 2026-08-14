import { Clock, FileText, ShieldCheck, Trash2 } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion";

/**
 * Real trust signals, not a logo bar. We have no customer logos yet, and a
 * fake one is the fastest way to lose a technical audience (§5a). These are
 * all things the product genuinely does.
 */
const SIGNALS = [
  {
    icon: FileText,
    title: "Plain text, always",
    body: "No tracking pixels, no images, no marketing footer. It reads like you typed it.",
  },
  {
    icon: ShieldCheck,
    title: "Authenticated sending",
    body: "SPF, DKIM and DMARC on a dedicated domain, so it lands in the inbox.",
  },
  {
    icon: Clock,
    title: "Office hours only",
    body: "Never at night, never at the weekend. A 3am final notice reads unhinged.",
  },
  {
    icon: Trash2,
    title: "Your data, reversible",
    body: "Export everything to CSV or delete the account outright, whenever you like.",
  },
];

export function TrustStrip() {
  return (
    <RevealGroup className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {SIGNALS.map((signal) => (
        <RevealItem key={signal.title}>
          <div className="flex gap-3">
            <signal.icon
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-ink-3"
            />
            <div>
              <p className="text-small font-semibold text-ink">{signal.title}</p>
              <p className="mt-1 text-small text-ink-2">{signal.body}</p>
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
