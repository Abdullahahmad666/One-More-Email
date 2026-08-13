import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex w-full max-w-[1080px] items-center justify-between gap-6 px-6 py-4">
        <a href="#top" className="type-label text-ink">
          {SITE.name}
        </a>

        <nav className="flex items-center gap-6" aria-label="Sections">
          <a href="#how" className="type-label hidden text-ink-2 sm:inline">
            How it works
          </a>
          <a href="#pricing" className="type-label hidden text-ink-2 sm:inline">
            Pricing
          </a>
          <a href="#faq" className="type-label hidden text-ink-2 sm:inline">
            FAQ
          </a>
          <a
            href="#signup"
            className="type-label rounded-[2px] border border-rule-strong px-3 py-2 text-ink"
          >
            Start free
          </a>
        </nav>
      </div>
    </header>
  );
}
