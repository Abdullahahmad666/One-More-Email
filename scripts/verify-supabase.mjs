/**
 * Checks the Supabase wiring end to end without ever printing a key.
 *
 *   npm run verify:supabase
 *
 * It proves four things:
 *   1. the keys are present and are the keys you think they are
 *   2. the waitlist table exists and our server can write to it
 *   3. a repeat signup is absorbed rather than erroring
 *   4. the anon key CANNOT read the list  <- the one that actually matters
 */
import { readFileSync, existsSync } from "node:fs";

// Read .env.local then .env, first value wins, same order Next.js uses.
function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const [, k, raw] = m;
      if (env[k] !== undefined) continue;
      env[k] = raw.trim().replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

/** Reads the role claim out of a Supabase JWT. Never returns the key. */
function keyRole(key) {
  if (!key) return "missing";
  if (key.startsWith("sb_secret_")) return "secret (new format)";
  if (key.startsWith("sb_publishable_")) return "publishable (new format)";
  try {
    const payload = JSON.parse(
      Buffer.from(key.split(".")[1], "base64").toString("utf8"),
    );
    return payload.role ?? "unknown";
  } catch {
    return "unrecognised";
  }
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const service = env.SUPABASE_SERVICE_ROLE_KEY;
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let failed = false;
const ok = (m) => console.log("  PASS  " + m);
const bad = (m) => { failed = true; console.log("  FAIL  " + m); };
const skip = (m) => console.log("  SKIP  " + m);

console.log("\n1. Keys");
if (!url) bad("NEXT_PUBLIC_SUPABASE_URL is not set");
else if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url))
  bad(`URL does not look like a Supabase project URL: ${url}`);
else ok(`URL looks right (${url})`);

const serviceRole = keyRole(service);
if (!service) bad("SUPABASE_SERVICE_ROLE_KEY is not set");
else if (serviceRole === "anon")
  bad("SUPABASE_SERVICE_ROLE_KEY holds the ANON key - wrong key pasted");
else if (serviceRole === "service_role" || serviceRole === "secret (new format)")
  ok(`service key role = ${serviceRole}`);
else bad(`service key role = ${serviceRole} (expected service_role)`);

if (!anon) skip("anon key not set - the RLS read test needs it (optional)");
else ok(`anon key role = ${keyRole(anon)}`);

if (!url || !service || serviceRole === "anon") {
  console.log("\nStopping: fix the keys above first.\n");
  process.exit(1);
}

const base = url.replace(/\/$/, "");
const svc = { apikey: service, Authorization: `Bearer ${service}` };
const probe = `verify-${Date.now()}@example.com`;

console.log("\n2. Table + write access");
let res = await fetch(`${base}/rest/v1/waitlist?select=id&limit=1`, { headers: svc });
if (res.status === 404) bad("table 'waitlist' not found - run the migration SQL");
else if (!res.ok) bad(`reading as service role failed: ${res.status} ${await res.text()}`);
else ok("waitlist table exists and the service role can read it");

console.log("\n3. Insert + duplicate handling");
const insert = () =>
  fetch(`${base}/rest/v1/waitlist?on_conflict=email`, {
    method: "POST",
    headers: { ...svc, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({ email: probe, source: "verify-script" }),
  });

res = await insert();
if (res.ok) ok(`inserted a probe row (${res.status})`);
else bad(`insert failed: ${res.status} ${await res.text()}`);

res = await insert();
if (res.ok || res.status === 409) ok(`same address again was absorbed (${res.status})`);
else bad(`duplicate insert errored: ${res.status} ${await res.text()}`);

console.log("\n4. RLS: the browser must not be able to read the list");
if (!anon) {
  skip("no anon key set - paste it in to run this check");
} else {
  res = await fetch(`${base}/rest/v1/waitlist?select=email`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  });
  const body = await res.text();
  if (res.ok && body.trim() !== "[]")
    bad(`anon CAN READ the list - RLS is not protecting you. Got: ${body.slice(0, 120)}`);
  else if (res.ok) ok("anon read returned an empty array (RLS holding)");
  else ok(`anon read was refused (${res.status}) - RLS holding`);

  res = await fetch(`${base}/rest/v1/waitlist`, {
    method: "POST",
    headers: { apikey: anon, Authorization: `Bearer ${anon}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: `anon-should-fail-${Date.now()}@example.com` }),
  });
  if (res.ok) bad("anon CAN INSERT directly - your honeypot and rate limit are bypassable");
  else ok(`anon insert was refused (${res.status}) - every write goes through our route`);
}

console.log("\n5. Cleanup");
res = await fetch(`${base}/rest/v1/waitlist?email=eq.${encodeURIComponent(probe)}`, {
  method: "DELETE",
  headers: svc,
});
if (res.ok) ok("probe row removed");
else bad(`could not remove probe row: ${res.status}`);

console.log(failed ? "\nSomething is wrong - see FAIL lines above.\n" : "\nAll good. The waitlist is wired up.\n");
process.exit(failed ? 1 : 0);
