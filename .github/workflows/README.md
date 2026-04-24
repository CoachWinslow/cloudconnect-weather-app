# CI Workflows

## `security-scan.yml`

Runs on every pull request and push to `main`. Fails the build when new
vulnerabilities or quality regressions appear.

### Checks performed

1. **Client secret scan** — `node scripts/check-client-secrets.mjs` fails the
   build if a `VITE_`-prefixed env var or any client-side source file contains
   a known secret pattern (`SERVICE_ROLE`, `sk_live_…`, `sk-…`, AWS access
   keys, Google API keys, PEM private key blocks, etc.)
2. **TypeScript typecheck** — `tsc --noEmit`
3. **Test suite** — `vitest run` (includes the weather-proxy smoke test that
   verifies the edge function returns HTTP 200 and renders city temperatures)
4. **Dependency audit** — `npm audit --audit-level=high` (fails on high or
   critical CVEs)
5. **Lovable security scan** *(optional)* — calls the Lovable Cloud security
   scan API and fails the build if any new `warn` or `error` level findings
   are detected

### Required repository secrets

| Secret | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Used by the smoke test to call the edge function |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Anon key for the smoke test |
| `LOVABLE_API_TOKEN` | Optional | Enables the Lovable security scan step |
| `LOVABLE_PROJECT_ID` | Optional | Lovable project ID (`b60a879d-637a-45dc-a32c-16f9ef225621`) |

Add these in **GitHub → Settings → Secrets and variables → Actions**.

### Local equivalent

```bash
node scripts/check-client-secrets.mjs
npx tsc --noEmit
npx vitest run
npm audit --audit-level=high
```