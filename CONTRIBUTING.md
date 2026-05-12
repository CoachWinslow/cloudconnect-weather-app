# Contributing

Thanks for working on **m3cloudconnect**! This guide covers what you need to know to get the test suite and CI security scan running cleanly.

## Local development

1. Install dependencies: `bun install` (or `npm ci`).
2. Copy environment variables — the `.env` file is auto-managed by Lovable Cloud and contains:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
3. Run the dev server: `bun run dev`.
4. Run tests: `npx vitest run`.

## GitHub Actions: required repository secrets

The `.github/workflows/security-scan.yml` workflow runs on every push and pull request to `main`. It executes the full Vitest suite, which includes RLS policy checks and a live `weather-proxy` smoke test. Those tests need to talk to the Lovable Cloud (Supabase) backend, so the workflow expects two **repository secrets** to be configured.

If these secrets are missing, the affected tests **skip gracefully** (the build will still pass), but you lose real coverage for backend security policies and the edge function. To get full coverage in CI, set them up.

### How to add them

1. Open your repo on GitHub.
2. Go to **Settings → Secrets and variables → Actions**.
3. Click **New repository secret** and add each of the following:

| Secret name                     | Where to find the value                                                                 | Notes                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | `.env` file in the project root, or **Lovable → Cloud → Settings**                       | Public URL, e.g. `https://<project-ref>.supabase.co`. Safe to share.      |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` file in the project root, or **Lovable → Cloud → Settings**                       | Publishable / anon key. Safe to expose; protected by Row-Level Security.   |

Both values are **publishable** (not secret) — they're already shipped to every browser that loads the app. Storing them as Action secrets is purely a convenience so the workflow file doesn't need to hardcode them.

### Verifying it worked

1. Push any small change to `main` (or re-run the failed workflow).
2. Open **Actions → Security Scan → Security & Quality Checks**.
3. The "Run tests" step should report **18 passed** instead of skipping the RLS and weather-proxy specs.

## What the security scan checks

- **Client-side secret leak scan** — `scripts/check-client-secrets.mjs`
- **TypeScript typecheck** — `tsc --noEmit`
- **Vitest suite** — unit tests, RLS policy tests, weather-proxy smoke test
- **`npm audit --audit-level=high`** — fails on high/critical dependency vulnerabilities
- **Optional Lovable Cloud security scan** — only runs if `LOVABLE_API_TOKEN` and `LOVABLE_PROJECT_ID` repo secrets are set

## Coding conventions

- React + TypeScript + Tailwind. Use semantic design tokens from `src/index.css` and `tailwind.config.ts` — never hardcode colors in components.
- City IDs are **kebab-case**. US cities use `City, Full State Name`; international cities use `City` only.
- **No em dashes (—)** in Intel Reports. Use commas instead.
- React Query hooks must use the `enabled` option to avoid hook-ordering violations.

## Questions?

Open an issue or ping @CoachWinslow.