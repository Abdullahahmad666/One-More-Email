"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "done" | "error";

/**
 * The single conversion point on the page. One field, a real <label>, and a
 * confirmation that doesn't apologise or gush (§4g, §6b).
 */
export function EmailCapture({
  source,
  tone = "light",
}: {
  source: string;
  tone?: "light" | "band";
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onBand = tone === "band";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    const form = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          // Honeypot: bots fill every field they find.
          company: form.get("company") ?? "",
        }),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "That didn't go through. Try again.");
        return;
      }

      setStatus("done");
      setMessage("You're on the list. We'll email you once when it opens.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("That didn't go through — check your connection and retry.");
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={id} className="sr-only">
            Your email address
          </label>
          <input
            id={id}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@studio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "h-12 w-full rounded-btn border px-4 text-body transition-shadow duration-200",
              onBand
                ? "border-band-rule bg-band-2 text-band-ink placeholder:text-band-ink-2 focus:border-band-ink-2"
                : "border-rule-strong bg-card text-ink shadow-soft placeholder:text-ink-3 focus:shadow-raised",
            )}
          />
        </div>

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <div aria-hidden className="hidden">
          <label htmlFor={`${id}-company`}>Company</label>
          <input
            id={`${id}-company`}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0, scale: 0.99 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-btn px-6 text-small font-medium shadow-raised disabled:opacity-70",
            onBand
              ? "bg-band-ink text-band"
              : "bg-ink text-[color:var(--paper)]",
          )}
        >
          {status === "sending" ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : null}
          {status === "sending" ? "Adding you" : "Start chasing"}
          {status === "sending" ? null : (
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          )}
        </motion.button>
      </form>

      <p
        className={cn(
          "type-label mt-3",
          onBand ? "text-band-ink-2" : "text-ink-3",
        )}
      >
        Free for 2 invoices · no card · one email when it opens
      </p>

      <AnimatePresence>
        {message ? (
          <motion.p
            key={message}
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mt-3 flex items-start gap-2 text-small",
              onBand ? "text-band-ink" : "text-ink",
            )}
          >
            {status === "error" ? (
              <TriangleAlert
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-[color:var(--t4-disappointed)]"
              />
            ) : (
              <Check
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-[color:var(--paid)]"
              />
            )}
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
