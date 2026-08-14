import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "The emails", href: "#emails" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper-2">
      <div className="mx-auto w-full max-w-[1140px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
          <div className="max-w-[420px]">
            <p className="type-label text-ink">{SITE.name}</p>
            <p className="mt-3 text-small text-ink-2">
              Automatic invoice chasing for freelancers. It gets firmer on a
              schedule so you don&apos;t have to.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="type-label text-ink-3">{column.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-small text-ink-2 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-10 border-0 border-t border-rule" />

        <p className="max-w-[62ch] text-small text-ink-3">
          Every email carries your reply address and a line saying it was sent on
          your behalf. That&apos;s what keeps it honest, and it&apos;s also what
          keeps it landing in inboxes.
        </p>
      </div>
    </footer>
  );
}
