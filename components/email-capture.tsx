"use client";

import { useId, useState } from "react";

type Status = "idle" | "sending" | "done" | "error";

/**
 * The single conversion point on the page. One field, a real <label>, and a
 * confirmation that doesn't apologise or gush (§4g, §6b).
 */
export function EmailCapture({ source }: { source: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

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
      setMessage("You're on the list. We'll email you when it opens.");
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
          <label htmlFor={id} className="type-label mb-2 block text-ink-3">
            Your email
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
            className="h-11 w-full rounded-[2px] border border-rule-strong bg-card px-3 text-body text-ink placeholder:text-ink-3"
          />
        </div>

        {/* Honeypot — visually and programmatically hidden from people. */}
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

        <button
          type="submit"
          disabled={status === "sending"}
          className="type-label h-11 shrink-0 self-end rounded-[2px] bg-ink px-6 text-[color:var(--card)] disabled:opacity-60"
        >
          {status === "sending" ? "Adding you…" : "Start chasing"}
        </button>
      </form>

      <p className="type-label mt-3 text-ink-3">
        Free for 2 invoices · no card
      </p>

      {message ? (
        <p
          role="status"
          className={`animate-toast-in mt-3 border-l-2 py-1 pl-3 text-small ${
            status === "error"
              ? "border-l-[color:var(--t4-disappointed)] text-ink"
              : "border-l-[color:var(--paid)] text-ink-2"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
