# CloudConnect Weather

A real-time weather intelligence dashboard with a NASA/SpaceX command-center aesthetic. Tracks live conditions across 67+ cities worldwide, each tied to a curated tech industry connection story.

**Live site:** https://cloudconnectweather.lovable.app

---

## Features

- **Live weather telemetry** for 67+ global cities (current conditions, 5-day forecast, hourly outlook)
- **Bilingual interface** — full English and Spanish parity, including AI-generated narrative content
- **Interactive world map** (Leaflet) with custom markers and click-through to city details
- **Global city search** powered by OpenWeatherMap geocoding
- **Favorites system** with per-user notes (auth-gated, RLS-secured)
- **Admin dashboard** for managing cities, user roles, and live request logs
- **Resilient data layer** — edge function caching, client-side throttling, exponential backoff with jitter, and rate-limit-aware retry logic

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State / Data | TanStack Query |
| Maps | Leaflet |
| Backend | Supabase (Postgres, Auth, Edge Functions, RLS) |
| Hosting | Lovable Cloud |
| External APIs | OpenWeatherMap |

---

## Architecture Highlights

- **Edge function proxy** (`weather-proxy`) — Keeps the OpenWeatherMap API key server-side, adds a 10-minute in-memory response cache, throttles concurrent upstream calls, and enforces a per-IP request ceiling.
- **Layered rate-limit defense** — Client-side concurrency + per-minute caps, edge-side cache + per-IP throttle. Prevents accidental retry storms and protects free-tier quotas.
- **Role-based access control** — Roles stored in a dedicated `user_roles` table with a `SECURITY DEFINER` `has_role()` function (avoids recursive RLS pitfalls).
- **Observability** — Every edge function request is logged (path, status, IP, user-agent, cache hit/miss, latency) and visible in an admin-only live log viewer with 429 alerting.
- **Auto-pruned logs** — 7-day retention via scheduled cleanup function.

---

## Security Posture

- All secrets (API keys, service-role tokens) live in Lovable Cloud server-side environment; never shipped to the browser.
- Row-Level Security enforced on every user-facing table.
- CORS restricted to known app origins on all edge functions.
- Input validation on all edge function endpoints.
- API key rotation process documented and tested.

---

## Local Development

Requires Node.js 18+ and npm.

```sh
git clone <YOUR_REPO_URL>
cd m3cloudconnect
npm install
npm run dev
