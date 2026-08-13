import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto w-full max-w-[1080px] px-6 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="type-label text-ink">{SITE.name}</p>
          <p className="text-small text-ink-3">
            Automatic invoice chasing for freelancers.
          </p>
        </div>

        <hr className="my-6 border-0 border-t border-rule" />

        <p className="max-w-[680px] text-small text-ink-3">
          Every email carries a line saying it was sent on your behalf, and your
          reply address, because that&apos;s what keeps it honest and what keeps
          it landing in inboxes.
        </p>
      </div>
    </footer>
  );
}
