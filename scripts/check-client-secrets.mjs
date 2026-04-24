#!/usr/bin/env node
/**
 * CI guard: fail the build if obviously-secret values leak into the client.
 *
 * Two checks:
 *  1. Any `VITE_`-prefixed env var (in .env, .env.*, or process.env) whose
 *     NAME or VALUE matches a secret pattern. `VITE_` vars are bundled into
 *     the client JS, so they MUST NOT contain server secrets.
 *  2. Any client-side source file (src/**, index.html) that contains a
 *     literal secret pattern (service-role key fragments, sk_ keys, etc.).
 *
 * Exits 1 on any finding so GitHub Actions fails the build.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

// Patterns that should NEVER appear in client-bound code or VITE_ vars.
// Each entry: { name, regex, appliesTo: "name" | "value" | "both" }
const SECRET_PATTERNS = [
  // For env-var NAMES we want the broad substring; for source code we want a stricter shape.
  { name: "Supabase service-role key name", regex: /SERVICE_ROLE/i, appliesTo: "name" },
  // Source-code hit: an actual JWT-shaped assignment to a service-role-ish identifier.
  {
    name: "Supabase service-role key value",
    regex: /service[_\-]?role[_\-]?key["'\s:=]+["']?eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}/i,
    appliesTo: "value",
  },
  { name: "Stripe/secret key prefix (sk_)", regex: /\bsk_(live|test)_[A-Za-z0-9]{10,}/, appliesTo: "value" },
  { name: "Generic secret key name", regex: /\b(SECRET_KEY|PRIVATE_KEY|API_SECRET)\b/i, appliesTo: "name" },
  { name: "OpenAI key prefix", regex: /\bsk-[A-Za-z0-9]{20,}/, appliesTo: "value" },
  { name: "AWS access key id", regex: /\bAKIA[0-9A-Z]{16}\b/, appliesTo: "value" },
  { name: "Google API key", regex: /\bAIza[0-9A-Za-z\-_]{35}\b/, appliesTo: "value" },
  { name: "PEM private key block", regex: /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/, appliesTo: "value" },
];

// Allowlist: known-safe occurrences (e.g. this script itself, docs).
const PATH_ALLOWLIST = [
  "scripts/check-client-secrets.mjs",
];

const findings = [];

function record(file, line, message) {
  findings.push({ file, line, message });
}

// ---------- 1. Scan env files ----------

const ENV_FILES = [".env", ".env.local", ".env.development", ".env.production", ".env.test"];

function parseEnvFile(path) {
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const entries = [];
  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line || line.startsWith("#")) return;
    const eq = line.indexOf("=");
    if (eq === -1) return;
    let name = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    entries.push({ name, value, line: idx + 1 });
  });
  return entries;
}

function checkEnvEntry(file, entry) {
  if (!entry.name.startsWith("VITE_")) return;
  for (const p of SECRET_PATTERNS) {
    const checkName = p.appliesTo === "name" || p.appliesTo === "both";
    const checkValue = p.appliesTo === "value" || p.appliesTo === "both";
    if (checkName && p.regex.test(entry.name)) {
      record(file, entry.line, `VITE_ env var name matches "${p.name}": ${entry.name}`);
    }
    if (checkValue && entry.value && p.regex.test(entry.value)) {
      record(file, entry.line, `VITE_ env var value matches "${p.name}" (${entry.name})`);
    }
  }
}

for (const f of ENV_FILES) {
  const abs = join(ROOT, f);
  if (!existsSync(abs)) continue;
  for (const entry of parseEnvFile(abs)) checkEnvEntry(f, entry);
}

// Also check process.env for VITE_ vars injected by CI
for (const [name, value] of Object.entries(process.env)) {
  if (!name.startsWith("VITE_")) continue;
  for (const p of SECRET_PATTERNS) {
    const checkName = p.appliesTo === "name" || p.appliesTo === "both";
    const checkValue = p.appliesTo === "value" || p.appliesTo === "both";
    if (checkName && p.regex.test(name)) {
      record("process.env", 0, `VITE_ env var name matches "${p.name}": ${name}`);
    }
    if (checkValue && value && p.regex.test(value)) {
      record("process.env", 0, `VITE_ env var value matches "${p.name}" (${name})`);
    }
  }
}

// ---------- 2. Scan client source files ----------

const CLIENT_DIRS = ["src"];
const CLIENT_EXTRA_FILES = ["index.html"];
const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".html", ".css"]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full, out);
    } else {
      const ext = full.slice(full.lastIndexOf("."));
      if (SCAN_EXTENSIONS.has(ext)) out.push(full);
    }
  }
  return out;
}

function isAllowlisted(relPath) {
  return PATH_ALLOWLIST.includes(relPath);
}

const filesToScan = [];
for (const d of CLIENT_DIRS) {
  const abs = join(ROOT, d);
  if (existsSync(abs)) walk(abs, filesToScan);
}
for (const f of CLIENT_EXTRA_FILES) {
  const abs = join(ROOT, f);
  if (existsSync(abs)) filesToScan.push(abs);
}

for (const file of filesToScan) {
  const rel = relative(ROOT, file);
  if (isAllowlisted(rel)) continue;
  const content = readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);
  for (const p of SECRET_PATTERNS) {
    // Only value-style patterns make sense for source scanning.
    if (p.appliesTo === "name") continue;
    lines.forEach((line, idx) => {
      if (p.regex.test(line)) {
        record(rel, idx + 1, `Client source matches "${p.name}"`);
      }
    });
  }
}

// ---------- Report ----------

if (findings.length === 0) {
  console.log("✓ check-client-secrets: no client-side secret leaks detected.");
  process.exit(0);
}

console.error(`✗ check-client-secrets: ${findings.length} finding(s):\n`);
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}  ${f.message}`);
}
console.error(
  "\nVITE_-prefixed env vars are bundled into the public client JS. " +
  "Move any server-only secrets into Lovable Cloud secrets and access them from edge functions.",
);
process.exit(1);