import { NextResponse } from "next/server";

/**
 * Smoke-test email capture (§2c). Deliberately minimal: no auth, no database
 * dependency, no confirmation email yet.
 *
 * Storage: Supabase if it's configured, otherwise a local JSONL file in dev.
 * If neither is available the request still succeeds and the address is
 * logged — losing a validation signup to a misconfigured env var is worse
 * than a duplicate row.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Crude per-IP limit. Fine for a landing page; replace before the app ships.
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

async function store(record: {
  email: string;
  source: string;
  created_at: string;
}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const res = await fetch(`${url}/rest/v1/signups`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates",
      },
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      throw new Error(`Supabase insert failed: ${res.status}`);
    }
    return;
  }

  // Local fallback so the smoke test works before Supabase exists.
  if (process.env.NODE_ENV !== "production") {
    const { appendFile, mkdir } = await import("node:fs/promises");
    await mkdir(".data", { recursive: true });
    await appendFile(".data/signups.jsonl", `${JSON.stringify(record)}\n`, "utf8");
    return;
  }

  console.warn("[subscribe] no store configured, signup only logged", record);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in a minute." },
      { status: 429 },
    );
  }

  let body: { email?: unknown; source?: unknown; company?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "That didn't go through. Try again." },
      { status: 400 },
    );
  }

  // Honeypot filled means a bot. Answer as if it worked.
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  try {
    await store({
      email,
      source: typeof body.source === "string" ? body.source.slice(0, 64) : "unknown",
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[subscribe] store failed", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't save that. Try again in a moment." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
