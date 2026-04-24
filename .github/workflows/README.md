# CI Workflows

## `security-scan.yml`

Runs on every pull request and push to `main`. Fails the build when new
vulnerabilities or quality regressions appear.

### Checks performed

1. **TypeScript typecheck** — `tsc --noEmit`
2. **Test suite** — `vitest run` (includes the weather-proxy smoke test that
   verifies the edge function returns HTTP 200 and renders city temperatures)
3. **Dependency audit** — `npm audit --audit-level=high` (fails on high or
   critical CVEs)
4. **Lovable security scan** *(optional)* — calls the Lovable Cloud security
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
npx tsc --noEmit
npx vitest run
npm audit --audit-level=high
```