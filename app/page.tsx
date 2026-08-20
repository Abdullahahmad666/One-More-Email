import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Ladder } from "@/components/ladder";
import { HeroMachine } from "@/components/hero-machine";
import { EmailCapture } from "@/components/email-capture";
import { SplitDemo } from "@/components/split-demo";
import { HowItWorks } from "@/components/how-it-works";
import { TrustStrip } from "@/components/trust-strip";
import { FeatureGrid } from "@/components/feature-grid";
import { Pricing } from "@/components/pricing";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/motion";
import { FAQ } from "@/lib/faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — automatic invoice chasing for freelancers`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

/**
 * Single job: get a cold visitor to understand the escalation ladder in under
 * 8 seconds and hand over an email address (§5a).
 *
 * Copy stays inside a ~680px measure and left-aligned. A centred hero is the
 * default look of every SaaS landing page; a left-aligned block reads like a
 * document, which is on-brief (§4d).
 */
export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        {/* overflow-x-clip contains the decorative glow, which is deliberately
            larger than its box. */}
        <section className="mx-auto w-full max-w-[1140px] overflow-x-clip px-6 pt-8 pb-16 sm:pt-12 sm:pb-24">
          {/* The headline measure is set in px, not ch: a ch-based max-width on
              this wrapper resolves against the 16px body font rather than the
              54px headline, which breaks the line one word at a time. */}
          <div>
            <Reveal>
              <span className="type-label inline-flex items-center gap-2 rounded-pill border border-rule bg-card px-3 py-1.5 whitespace-nowrap text-ink-2 shadow-soft">
                <Sparkles aria-hidden className="size-3 text-ink-3" />
                {/* The send date is the first thing to go on a narrow screen —
                    the pill must stay on one line to read as a stamp. */}
                Invoice 0042 ·{" "}
                <span className="hidden sm:inline">sent 14 July · </span>
                unpaid
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="type-display-tight mt-5 max-w-[15ch] text-[34px] leading-[1.03] text-balance text-ink sm:text-[46px] lg:text-[54px]">
                Watch 45 days of chasing happen{" "}
                <span className="text-ink-3">without you.</span>
              </h1>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[54ch] text-[17px] leading-[1.6] text-ink-2">
              Automatic invoice chasing for freelancers. It gets firmer on a
              schedule so you don&apos;t have to. Petty on the inside, polite on
              the outside.
            </p>
          </Reveal>

          <div className="mt-10 sm:mt-12">
            <HeroMachine />
          </div>
        </section>

        {/* ── Trust ────────────────────────────────────────────── */}
        <section className="border-y border-rule bg-paper-2">
          <div className="mx-auto w-full max-w-[1140px] px-6 py-14">
            <TrustStrip />
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section id="how" className="mx-auto w-full max-w-[1140px] px-6 py-20 sm:py-28">
          <Reveal className="max-w-[680px]">
            <p className="type-label text-ink-3">How it works</p>
            <h2 className="type-display mt-4 text-[32px] leading-[1.1] text-ink sm:text-[44px]">
              Three decisions, then it runs itself.
            </h2>
            <p className="mt-4 max-w-[52ch] text-ink-2">
              The whole product exists to shorten the distance between
              &ldquo;this invoice is late&rdquo; and &ldquo;the money
              arrived&rdquo;.
            </p>
          </Reveal>

          <div className="mt-12">
            <HowItWorks />
          </div>
        </section>

        {/* ── The five emails, in full ─────────────────────────── */}
        <section id="emails" className="border-t border-rule bg-paper-2">
          <div className="mx-auto w-full max-w-[1140px] px-6 py-20 sm:py-28">
            <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              <Reveal className="min-w-0 lg:pt-4">
                <p className="type-label text-ink-3">The five emails</p>
                <h2 className="type-display mt-4 text-[32px] leading-[1.1] text-ink sm:text-[44px]">
                  You wrote the first email. We&apos;ll write the next four.
                </h2>
                <p className="mt-4 max-w-[52ch] text-ink-2">
                  Read every one of them right now, word for word, before you
                  hand over an address. Click any rung — the ladder is the whole
                  product, and there&apos;s nothing behind a signup wall.
                </p>
              </Reveal>

              <div className="min-w-0">
                <Ladder />
              </div>
            </div>
          </div>
        </section>

        {/* ── The dark band: client sees / you see ─────────────── */}
        <section
          id="split"
          className="on-band bg-band text-band-ink"
        >
          <div className="mx-auto w-full max-w-[1140px] px-6 py-20 sm:py-28">
            <Reveal className="max-w-[720px]">
              <p className="type-label text-band-ink-2">The split</p>
              <h2 className="type-display mt-4 text-[32px] leading-[1.1] text-band-ink sm:text-[44px]">
                Your client gets a professional email. You get to call it
                &ldquo;Disappointed&rdquo;.
              </h2>
              <p className="mt-4 max-w-[56ch] text-band-ink-2">
                The tier names are ours and they never leave your screen. Every
                email your client reads is one you&apos;d have been happy to
                write yourself — which is exactly why it gets paid.
              </p>
            </Reveal>

            <div className="mt-12">
              <Reveal>
                <SplitDemo />
              </Reveal>
            </div>

            <Reveal className="mt-14 max-w-[720px] border-l-2 border-l-band-rule pl-6">
              <p className="type-display text-[24px] leading-[1.25] text-band-ink sm:text-[30px]">
                The money isn&apos;t lost because the client refused. It&apos;s
                lost because nobody followed up on day 24.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Everything else ──────────────────────────────────── */}
        <section id="features" className="border-t border-rule bg-paper-2">
          <div className="mx-auto w-full max-w-[1140px] px-6 py-20 sm:py-28">
            <Reveal className="max-w-[680px]">
              <p className="type-label text-ink-3">Everything else</p>
              <h2 className="type-display mt-4 text-[32px] leading-[1.1] text-ink sm:text-[44px]">
                The small things that decide whether you trust it.
              </h2>
              <p className="mt-4 max-w-[52ch] text-ink-2">
                A chasing tool is only useful if you can see exactly what it did
                and stop it instantly. That&apos;s most of what&apos;s here.
              </p>
            </Reveal>

            <div className="mt-12">
              <FeatureGrid />
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────── */}
        <section id="pricing" className="mx-auto w-full max-w-[1140px] px-6 py-20 sm:py-28">
          <Reveal className="max-w-[680px]">
            <p className="type-label text-ink-3">Pricing</p>
            <h2 className="type-display mt-4 text-[32px] leading-[1.1] text-ink sm:text-[44px]">
              Costs less than the invoice you&apos;re not chasing.
            </h2>
            <p className="mt-4 max-w-[52ch] text-ink-2">
              Free for two invoices, forever — long enough to fix the client
              who&apos;s ghosting you today.
            </p>
          </Reveal>

          <div className="mt-12">
            <Pricing />
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="border-t border-rule bg-paper-2">
          <div
            id="faq"
            className="mx-auto w-full max-w-[1140px] px-6 py-20 sm:py-28"
          >
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
              <Reveal className="min-w-0">
                <p className="type-label text-ink-3">FAQ</p>
                <h2 className="type-display mt-4 text-[32px] leading-[1.1] text-ink sm:text-[40px]">
                  The questions everyone asks
                </h2>
              </Reveal>

              <Reveal delay={0.06} className="min-w-0">
                <FaqAccordion />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────── */}
        <section id="signup" className="on-band bg-band text-band-ink">
          <div className="mx-auto w-full max-w-[1140px] px-6 py-20 sm:py-28">
            <Reveal className="max-w-[680px]">
              <h2 className="type-display-tight text-[34px] leading-[1.05] text-band-ink sm:text-[48px]">
                One recovered invoice pays for a decade of this.
              </h2>
              <p className="mt-5 max-w-[52ch] text-band-ink-2">
                We&apos;re building it now. Leave your email and you&apos;ll get
                exactly one message, on the day it opens.
              </p>

              <div className="mt-9 max-w-[540px]">
                <EmailCapture source="footer" tone="band" />
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* SoftwareApplication + FAQPage schema (§7d). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: SITE.name,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: SITE.description,
              url: SITE.url,
              offers: [
                { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
                { "@type": "Offer", name: "Solo", price: "9", priceCurrency: "USD" },
                { "@type": "Offer", name: "Studio", price: "19", priceCurrency: "USD" },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ]),
        }}
      />
    </>
  );
}
