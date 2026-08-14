"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";
import { LadderMark } from "@/components/ladder-mark";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#emails", label: "The emails" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/**
 * Sticky, translucent, and only draws its rule once you've scrolled — the nav
 * should be present without competing with the hero.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-rule bg-[color:var(--paper)]/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-6 px-6 py-4">
        <a href="#top" className="flex items-center gap-2.5">
          <LadderMark />
          <span className="type-label text-ink">{SITE.name}</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Sections">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-small text-ink-2 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#signup"
            className="group hidden items-center gap-2 rounded-btn bg-ink px-4 py-2.5 text-small font-medium text-[color:var(--paper)] shadow-soft transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex"
          >
            Start chasing
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-btn border border-rule text-ink md:hidden"
          >
            {open ? (
              <X aria-hidden className="size-4" />
            ) : (
              <Menu aria-hidden className="size-4" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden border-t border-rule bg-[color:var(--paper)]/95 backdrop-blur-xl md:hidden"
          aria-label="Sections"
        >
          <div className="mx-auto flex w-full max-w-[1140px] flex-col px-6 py-2">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-rule py-3 text-small text-ink-2 last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.nav>
      ) : null}
    </motion.header>
  );
}

