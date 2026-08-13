import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Ladder } from "@/components/ladder";
import { EmailCapture } from "@/components/email-capture";
import { SplitDemo } from "@/components/split-demo";
import { Pricing } from "@/components/pricing";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
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
 * Layout is 1080px max with copy held to a 680px measure, left-aligned. A
 * centred hero is the default look of every SaaS landing page; a left-aligned
 * block reads like a document, which is on-brief (§4d).
 */
export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top" className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1080px] px-6 py-16 sm:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div className="max-w-[680px]">
              <p className="type-label text-ink-3">For freelancers</p>

              <h1 className="type-display mt-4 text-[40px] leading-[1.06] sm:text-[56px] sm:leading-[1.02]">
                You wrote the first email. We&apos;ll write the next four.
              </h1>

              <p className="mt-6 max-w-[560px] text-ink-2">
                Automatic invoice chasing for freelancers. It gets firmer on a
                schedule so you don&apos;t have to. Petty on the inside, polite
                on the outside.
              </p>

              <div className="mt-8 max-w-[520px]">
                <EmailCapture source="hero" />
              </div>
            </div>

            <Reveal>
              <Ladder />
            </Reveal>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <section id="how" className="border-t border-rule">
          <div className="mx-auto w-full max-w-[1080px] px-6 py-16">
            <p className="type-label text-ink-3">How it works</p>

            {/* Numbered markers appear here and nowhere else, because this is
                the only content on the page that genuinely is a sequence. */}
            <ol className="mt-8 grid gap-8 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  h: "Add the invoice",
                  p: "Client, amount, due date. Six fields, one screen, no wizard.",
                },
                {
                  n: "02",
                  h: "Pick a cadence",
                  p: "Gentle, Standard or Relentless. You see every send date before anything goes out.",
                },
                {
                  n: "03",
                  h: "Press “They paid”",
                  p: "One button cancels the rest of the sequence. That's the whole job.",
                },
              ].map((step, i) => (
                <Reveal key={step.n} delay={i * 60}>
                  <li className="border-t border-rule pt-4">
                    <p className="type-num text-[11px] text-ink-3">{step.n}</p>
                    <h3 className="mt-2 text-title font-semibold">{step.h}</h3>
                    <p className="mt-2 text-small text-ink-2">{step.p}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ── The thesis ───────────────────────────────────────── */}
        <section className="border-t border-rule">
          <div className="mx-auto w-full max-w-[1080px] px-6 py-16">
            <Reveal>
              <blockquote className="max-w-[680px] border-l-2 border-l-rule-strong pl-6">
                <p className="type-display text-[28px] leading-[1.15]">
                  The money isn&apos;t lost because the client refused. It&apos;s
                  lost because nobody followed up on day 24.
                </p>
              </blockquote>
            </Reveal>
          </div>
        </section>

        {/* ── Client sees / you see ────────────────────────────── */}
        <section className="border-t border-rule">
          <div className="mx-auto w-full max-w-[1080px] px-6 py-16">
            <div className="max-w-[680px]">
              <h2 className="type-display text-[28px] leading-[1.15] sm:text-[40px] sm:leading-[1.06]">
                Your client gets a professional email. You get to call it
                “Disappointed”.
              </h2>
              <p className="mt-4 text-ink-2">
                The tier names are ours. They never appear in anything your
                client reads, and every email is one you&apos;d be happy to have
                written yourself.
              </p>
            </div>

            <div className="mt-10">
              <Reveal>
                <SplitDemo />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────── */}
        <section id="pricing" className="border-t border-rule">
          <div className="mx-auto w-full max-w-[1080px] px-6 py-16">
            <div className="max-w-[680px]">
              <h2 className="type-display text-[28px] leading-[1.15] sm:text-[40px] sm:leading-[1.06]">
                Costs less than the invoice you&apos;re not chasing.
              </h2>
              <p className="mt-4 text-ink-2">
                Free for two invoices, forever — long enough to fix the client
                who&apos;s ghosting you today.
              </p>
            </div>

            <div className="mt-10">
              <Reveal>
                <Pricing />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section id="faq" className="border-t border-rule">
          <div className="mx-auto w-full max-w-[1080px] px-6 py-16">
            <div className="max-w-[680px]">
              <h2 className="type-display text-[28px] leading-[1.15] sm:text-[40px] sm:leading-[1.06]">
                The questions everyone asks
              </h2>

              <div className="mt-8">
                <FaqAccordion />
              </div>
            </div>
          </div>
        </section>

        {/* ── Signup ───────────────────────────────────────────── */}
        <section id="signup" className="border-t border-rule">
          <div className="mx-auto w-full max-w-[1080px] px-6 py-16">
            <div className="max-w-[680px]">
              <h2 className="type-display text-[28px] leading-[1.15] sm:text-[40px] sm:leading-[1.06]">
                One late invoice pays for a decade of this.
              </h2>
              <p className="mt-4 text-ink-2">
                We&apos;re building it now. Leave your email and you&apos;ll get
                one message when it opens — nothing else.
              </p>

              <div className="mt-8 max-w-[520px]">
                <EmailCapture source="footer" />
              </div>
            </div>
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
                {
                  "@type": "Offer",
                  name: "Free",
                  price: "0",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Solo",
                  price: "9",
                  priceCurrency: "USD",
                },
                {
                  "@type": "Offer",
                  name: "Studio",
                  price: "19",
                  priceCurrency: "USD",
                },
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
