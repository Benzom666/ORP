# One‑Click Deploy (Vercel)

This project is ready for Vercel. Create a new Vercel project from this folder and add these **Environment Variables**:

- `DATABASE_URL` — Postgres connection (Neon or Supabase). Use SSL required.
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key.
- `GRAPHHOPPER_API_KEY` — (optional) GraphHopper VRP API key.

> **Why Supabase vars if I use Neon?**  
> The UI talks to our Next.js API routes only. Those routes currently use the Supabase client for DB access. The simplest path is: use **Supabase Postgres** as your DB (free tier is fine). If you insist on Neon, set `DATABASE_URL` to Neon for **init scripts**, and also create a Supabase project that connects to that same DB (or refactor the API routes to use `@neondatabase/serverless`). I can provide that refactor on request.

## Steps
1. Push this repo to GitHub/GitLab.
2. In Vercel → **New Project** → import the repo.
3. Add the env vars above (or use `vercel env pull`/`vercel env add`).
4. Deploy.

After first run, the app will auto‑initialize your DB on first visit to **/orders** or **/drivers**.