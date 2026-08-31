# Connecting NestGo to a real, shared database

NestGo works today with zero backend — everything falls back to static
demo data and the browser's `localStorage`. This guide turns on the real
thing: a shared Postgres database with live updates across every visitor,
using [Supabase](https://supabase.com) (free tier is enough to start).

Nothing here is required to keep the site running — skip this entirely and
NestGo keeps working exactly as it does now. Do this when you're ready for
listings, routine loops, and feedback to be real and shared instead of
per-browser demo data.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (GitHub login is
   the fastest option).
2. Click **New project**. Pick an organization (or create one), name the
   project (e.g. `nestgo`), set a database password (save it somewhere —
   you likely won't need it day to day, but it's your project's master
   password), and pick a region close to your users.
3. Wait ~2 minutes for the project to provision.

## 2. Get your API credentials

1. In the project, go to **Settings → API**.
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`).
3. Copy the **anon public** key (a long JWT-looking string). This is safe
   to expose in a public frontend — it only grants what your Row Level
   Security policies below allow, nothing more.

## 3. Run the database schema

1. In the project, go to **SQL Editor**.
2. Open `supabase/migrations/0001_init.sql` from this repo, copy its full
   contents, paste into a new SQL Editor query, and click **Run**.
3. (Optional) Do the same with `supabase/seed-example.sql` if you want a
   couple of example rows to confirm everything is wired up — the app
   works fine without this, it just means you'll see today's static demo
   content instead of live rows until you add your own.

This creates: `listings`, `routines`, `feedback`, `destination_guides`, and
`visa_checklist_items` — each with Row Level Security enabled so the public
`anon` key can only do what's explicitly allowed (see the comments in the
migration file for exactly what).

## 4. Add the credentials to the app

**For local development:**

```bash
cp .env.example .env.local
# then edit .env.local and paste in your Project URL and anon key
npm run dev
```

**For the production deploy (GitHub Pages via GitHub Actions):**

1. In the GitHub repo, go to **Settings → Secrets and variables → Actions**.
2. Add two repository secrets:
   - `VITE_SUPABASE_URL` — your Project URL
   - `VITE_SUPABASE_ANON_KEY` — your anon public key
3. Push to `main` (or re-run the `Deploy to GitHub Pages` workflow from the
   **Actions** tab) — the next build picks them up automatically.

If these secrets are absent, the build still succeeds and the site falls
back to static data, exactly like before — there's no way to accidentally
break production by not having done this yet.

## 5. What becomes "real" once this is connected

- **Settle listings** — submissions are saved for real and appear live to
  every visitor (via Supabase Realtime), instead of just showing a success
  message.
- **Social routine loops** — joins persist and spot counts update live
  across everyone viewing the app.
- **Feedback** — ratings/comments are stored centrally instead of per
  browser, and the widget shows the real average across all users.
- **Discover guide & visa checklist content** — read from
  `destination_guides` / `visa_checklist_items` if those tables have rows
  for a given country/purpose, with a "Verified <date>" badge; otherwise
  the static content in `src/data/` is used, so there's no empty state.

## 6. Keeping content current

There's no automatic scraper keeping visa rules or destination guides
up to date — that's a deliberate choice (see the main README's "What's
mocked" table for why). To update content:

- Open the **Table editor** in Supabase Studio.
- Edit `destination_guides` or `visa_checklist_items` rows directly, or add
  new ones for a country/purpose not covered yet — bump `last_verified_at`
  when you do.
- Changes are live immediately, no redeploy needed.
