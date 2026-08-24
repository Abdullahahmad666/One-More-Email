import Link from "next/link";
import { FileCheck2, Lock, MailMinus } from "lucide-react";
import { SITE } from "@/lib/site";
import { LadderMark } from "@/components/ladder-mark";

/**
 * Multi-column footer. Anything that resolves to a real destination is a link;
 * anything still to be written is plain text marked "Soon". A footer full of
 * dead links is worse than a smaller honest one, and this audience checks.
 */
const COLUMNS: {
  title: string;
  soon?: boolean;
  links: { label: string; href?: string; soon?: boolean }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "The emails", href: "/#emails" },
      { label: "Everything else", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    // Marked once at the column, not once per row — a badge on every line
    // reads as clutter and collides with wrapped labels.
    title: "Free tools",
    soon: true,
    links: [
      { label: "Payment reminder generator" },
      { label: "Late payment interest calculator" },
      { label: "Email templates" },
    ],
  },
  {
    title: "Guides",
    soon: true,
    links: [
      { label: "What to do when a client won't pay" },
      { label: "Asking a client to pay, politely" },
      { label: "How often to follow up" },
      { label: "Small claims for unpaid invoices" },
    ],
  },
  {
    // Privacy is live because we are already collecting addresses; Terms and
    // the DPA are not needed until there is a product to sell.
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", soon: true },
      { label: "DPA", soon: true },
    ],
  },
];

const BADGES = [
  { icon: Lock, label: "SPF · DKIM · DMARC" },
  { icon: MailMinus, label: "No tracking pixels" },
  { icon: FileCheck2, label: "Export & delete" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper-2">
      <div className="mx-auto w-full max-w-[1140px] px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          {/* Brand */}
          <div className="min-w-0 max-w-[340px]">
            <Link href="/" scroll={false} className="flex items-center gap-2.5">
              <LadderMark />
              <span className="type-label text-ink">{SITE.name}</span>
            </Link>

            <p className="mt-4 text-small text-ink-2">
              Automatic invoice chasing for freelancers. It gets firmer on a
              schedule so you don&apos;t have to.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {BADGES.map((badge) => (
                <li key={badge.label} className="flex items-center gap-2.5">
                  <badge.icon aria-hidden className="size-3.5 text-ink-3" />
                  <span className="type-label text-ink-3">{badge.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.title} className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="type-label text-ink-3">{column.title}</p>
                  {column.soon ? (
                    <span className="type-label rounded-pill border border-rule px-1.5 py-0.5 text-[9px] text-ink-3">
                      Soon
                    </span>
                  ) : null}
                </div>

                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <Link
                          href={link.href}
                          scroll={false}
                          className="text-small text-ink-2 transition-colors hover:text-ink"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span className="flex items-center gap-2 text-small text-ink-3">
                          {link.label}
                          {link.soon ? (
                            <span className="type-label rounded-pill border border-rule px-1.5 py-0.5 text-[9px] text-ink-3">
                              Soon
                            </span>
                          ) : null}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-rule pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-label text-ink-3">
              © 2026 {SITE.name}
            </p>
            <p className="max-w-[52ch] text-small text-ink-3">
              Every email carries your reply address and a line saying it was
              sent on your behalf. That&apos;s what keeps it honest, and what
              keeps it landing in inboxes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
