import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What One More Email collects when you join the waitlist, why, and how to be removed. One email address, nothing else.",
  alternates: { canonical: "/privacy" },
};

/** Update this whenever the policy changes. */
const LAST_UPDATED = "24 August 2026";

/** The person legally responsible for this data — the controller. */
const CONTROLLER = "Abdullah Ahmad";
const CONTACT = "abdullah.ahmad3579@gmail.com";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1140px] px-6 py-16 sm:py-24">
          <div className="max-w-[680px]">
            {/* People arrive here from a footer link, so the way out needs to
                be at the top of the page and not only in the nav. */}
            <Link
              href="/"
              scroll={false}
              className="group type-label inline-flex items-center gap-2 text-ink-3 transition-colors hover:text-ink"
            >
              <ArrowLeft
                aria-hidden
                className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to {SITE.name}
            </Link>

            <p className="type-label mt-10 text-ink-3">Privacy</p>

            <h1 className="type-display-tight mt-4 text-[34px] leading-[1.05] text-ink sm:text-[46px]">
              We collect one email address, and only so we can tell you when
              this opens.
            </h1>

            <p className="type-label mt-6 text-ink-3">
              Last updated {LAST_UPDATED}
            </p>

            <div className="mt-12 flex flex-col gap-10">
              <Section title="Who holds this data">
                <p>
                  {SITE.name} is run by {CONTROLLER}. If you want anything on
                  this page actioned — a copy of your data, a correction, or
                  deletion — email{" "}
                  <a
                    href={`mailto:${CONTACT}`}
                    className="text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    {CONTACT}
                  </a>
                  .
                </p>
              </Section>

              <Section title="What we collect">
                <p>
                  If you enter your email address on this site, we store three
                  things:
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  <Item>Your email address.</Item>
                  <Item>
                    Which form you used — just the word{" "}
                    <span className="type-num text-[13px]">hero</span> or{" "}
                    <span className="type-num text-[13px]">footer</span>, so we
                    know which part of the page persuaded you.
                  </Item>
                  <Item>The date and time you submitted it.</Item>
                </ul>
                <p className="mt-4">
                  That is the entire record. We do not ask for your name, your
                  business, or anything about your clients, and we have no way
                  to see any of it.
                </p>
              </Section>

              <Section title="What we deliberately do not do">
                <ul className="flex flex-col gap-2">
                  <Item>
                    No cookies. This site sets none — there is no cookie banner
                    because there is nothing to consent to.
                  </Item>
                  <Item>
                    No analytics, no tracking pixels, no advertising networks,
                    no session recording.
                  </Item>
                  <Item>
                    No third-party fonts or scripts. Our fonts are served from
                    our own domain, so loading this page does not tell anyone
                    else that you visited.
                  </Item>
                  <Item>
                    We do not sell, rent, or share your address with anyone for
                    their own purposes.
                  </Item>
                </ul>
              </Section>

              <Section title="Your IP address">
                <p>
                  To stop bots flooding the signup form, our server counts
                  recent submissions per IP address. That count is held in
                  memory for up to one minute and then discarded. Your IP
                  address is never written to our database and never linked to
                  your email address.
                </p>
              </Section>

              <Section title="Why we are allowed to hold it">
                <p>
                  Consent. You gave us your address and asked to be told when
                  the product opens. That is the only thing we will use it for.
                  You can withdraw consent at any time by emailing us, and we
                  will delete the record.
                </p>
              </Section>

              <Section title="Who else can see it">
                <p>
                  Two companies process this data on our behalf, under their
                  own security and privacy terms:
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  <Item>
                    <span className="text-ink">Supabase</span> — hosts the
                    database the address is stored in.
                  </Item>
                  <Item>
                    <span className="text-ink">Vercel</span> — hosts this site
                    and handles the request when you submit the form.
                  </Item>
                </ul>
                <p className="mt-4">
                  Neither uses your address for their own purposes. Nobody else
                  has access.
                </p>
              </Section>

              <Section title="How long we keep it">
                <p>
                  Until we launch and send you the one email we promised, plus a
                  short period after in case it bounces. If we decide not to
                  launch, we delete the list. Ask us to remove you at any point
                  before then and we will, without asking why.
                </p>
              </Section>

              <Section title="Your rights">
                <p>
                  You can ask us for a copy of what we hold about you, to
                  correct it, or to delete it. Email{" "}
                  <a
                    href={`mailto:${CONTACT}`}
                    className="text-ink underline decoration-rule-strong underline-offset-4 transition-colors hover:decoration-ink"
                  >
                    {CONTACT}
                  </a>{" "}
                  and we will action it. Given that the record is one email
                  address, this is usually a same-day job.
                </p>
              </Section>

              <Section title="Changes to this page">
                <p>
                  If we start collecting anything else — and building the actual
                  product will mean holding your clients&apos; details, which is
                  a much bigger promise — we will rewrite this page before that
                  happens, not after, and email anyone already on the list.
                </p>
              </Section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-title font-semibold text-ink">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-ink-2">{children}</div>
    </section>
  );
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-ink-2">
      <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-rule-strong" />
      <span>{children}</span>
    </li>
  );
}
