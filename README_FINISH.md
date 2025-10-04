# Optimo Route Pro — Finished MVP

A Next.js (App Router) + Supabase/Neon powered delivery routing dashboard.
This finish pass adds:

- Complete Postgres schema (`scripts/001_create_tables.sql`)
- Dev Row-Level Security policies (`scripts/002_enable_rlS.sql`)
- Sample seed data (`scripts/003_seed_data.sql`)
- One-click *automatic database initialization* via `/api/init-database`
- Route optimization API with **GraphHopper** support **and local fallback** (nearest‑neighbor heuristic) if `GRAPHHOPPER_API_KEY` is not set
- Clean env handling via `.env.example`

## Quick Start

1. **Install deps**
   ```bash
   pnpm install
   # or npm install / yarn
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env.local`
   - Fill:
     - `DATABASE_URL` (Neon/Supabase Postgres conn string)
     - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - optional `GRAPHHOPPER_API_KEY`

3. **Run dev**
   ```bash
   pnpm dev
   ```

4. **Initialize the database**  
   Visit **/orders** or **/drivers** — the first fetch will auto-call `/api/init-database` and run the SQL scripts.
   You can also POST to `/api/init-database` manually.

## How Optimization Works

- If `GRAPHHOPPER_API_KEY` is present, the `/api/optimize` endpoint will call GraphHopper VRP.
- If not, it falls back to a **nearest‑neighbor** sequence starting from the driver's last known location.
  It creates a `routes` record and ordered `stops`, computing straight‑line (haversine) distances and rough ETAs (assuming 40 km/h).

## Tables

- `drivers` — fleet & last known location
- `orders` — jobs with lat/lng & priorities
- `routes` — daily plan, totals
- `stops` — ordered route steps
- `proof_of_delivery` — POD items

## API

- `GET /api/orders` — list (auto-inits DB if missing)
- `POST /api/orders` — create
- `GET /api/drivers` — list
- `POST /api/drivers` — create
- `POST /api/optimize` — body: `{ driver_id: string, order_ids: string[] }`

## Notes

- This code is ready to deploy on Vercel with **Neon**. For Supabase DB, paste its connection string into `DATABASE_URL`.
- RLS policies are permissive for development. Tighten before production.