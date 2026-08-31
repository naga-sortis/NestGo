# NestGo — The Expat Operating System

One place for anyone moving abroad to handle bureaucracy, hand off (or take
over) a home, find people nearby with the same weekly routines, and explore
the destination itself.

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind, deployed as a static
  site to GitHub Pages via `.github/workflows/deploy.yml`.
- **Backend**: [Supabase](https://supabase.com) (Postgres + Realtime + Row
  Level Security) — **optional**. Every data-access module in
  `src/lib/repos/` checks whether it's configured and transparently falls
  back to the static files in `src/data/` and to `localStorage` if not.
  Nothing breaks if it's never set up; see **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
  for how to turn it on.
- **Live external data**: currency conversion in the Discover tab calls the
  free [Frankfurter API](https://frankfurter.dev) directly from the
  browser — a real, working integration, not a mock.

Once Supabase is connected: Settle listings and Social routine joins are
real, shared, and update live across every visitor (via Postgres Realtime
subscriptions); feedback aggregates across all users instead of one
browser; and the Discover guide / visa checklist content can be edited
live in Supabase Studio (with a visible "Verified &lt;date&gt;" badge)
instead of requiring a code change and redeploy.

## The flow

1. **Itinerary intake** — where you're moving from/to and why (student,
   employment, on-site relocation, tourist). Everything after this is
   tailored to that trip. Use **"Start new case"** in the header at any time
   to clear the current trip and begin a fresh one.
2. **Secure** — upload a passport/contract and NestGo auto-fills your
   identity fields (name, passport number, nationality, arrival date) for
   you to review and correct. The arrival checklist is destination- and
   purpose-specific; tap any item to see plain-language instructions, fill
   that procedure's own extra fields, generate a real Google Calendar
   reminder, and jump to either the official government portal (if it can
   be done online) or a scoped search for the nearest office. Once you have
   case data, **"Download my forms"** saves a self-contained HTML summary
   (identity fields, checklist, signature) you can print/save, and
   **"Email me a copy"** opens your own email client with a prefilled
   summary. Every action is logged to a visible "case file" timeline, the
   way a caseworker or travel agent would track your file by hand.
3. **Settle** — unlocks once the Secure checklist is fully checked off (the
   app auto-switches you there). A peer-to-peer marketplace, filterable by
   zone and sorted by price, for taking over a departing expat's lease,
   furniture, and utilities — escrow-protected, and live across users once
   Supabase is connected. A "search the web instead" link is always
   available if nothing local fits.
4. **Social** — city-specific Facebook/Meetup/WhatsApp group search links
   to join, plus neighborhood routine loops (small groups matched by a
   recurring weekly habit) filtered to your destination city.
5. **Discover** — best season to visit, how to get around, cultural/
   traditional highlights, a live currency exchange rate, and trip ideas
   toggled between solo/bachelor and family style — so there's a reason to
   open the app between paperwork sessions.

A feedback widget (rating + comment) sits at the bottom of the app once a
case is started, so real usage signal can drive what gets built next.

Trip data, form answers, the signature, checklist progress, and
community/housing preferences always persist in the browser's
`localStorage` (`src/lib/tripState.tsx`) — this is deliberate: it's
personal case data (identity fields, a signature), and keeping it local
rather than in a shared cloud database avoids introducing an auth system
and a place PII could leak from before anyone's asked for that. "Start new
case" clears it when you want a blank slate.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL. `npm run build` produces a production
bundle in `dist/`; `npm run preview` serves that bundle locally.

To run against a real Supabase backend locally, see
**[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** — copy `.env.example` to
`.env.local` and fill in your project's URL/anon key.

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes the app to
GitHub Pages on every push to `main`. To turn it on:

1. In the repo settings, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).
3. The site will be live at `https://<owner>.github.io/NestGo/`.

`vite.config.ts` sets `base: '/NestGo/'` to match that URL path — update it if
the repo is ever renamed. The `github-pages` deployment environment
(**Settings → Environments**) must allow the branch you're pushing from
under "Deployment branches and rules," or the deploy job is rejected before
it runs.

If you've connected Supabase (see **SUPABASE_SETUP.md**), also add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as repository secrets
under **Settings → Secrets and variables → Actions** — the workflow passes
them through at build time. Leaving them unset is safe; the build still
succeeds and the site runs in static-fallback mode.

## What's mocked right now, and how to make it real

| Feature | Current behavior | To make it real |
| --- | --- | --- |
| Document upload → auto-fill (Secure tab) | Fixed delay, then fills identity fields with plausible placeholder values (`src/components/SecureTab.tsx`, `mockExtractedIdentity`) | Add a Supabase Edge Function (or any small backend) that forwards the file to the Claude or OpenAI API with an extraction prompt, and call it in place of `mockExtractedIdentity` |
| Visa checklist/instructions/forms | Static baseline for Spain, India, US + generic fallback (`src/data/visaRequirements.ts`); reads live from Supabase's `visa_checklist_items` table when rows exist for that scope | Not legal advice — verify against the destination country's official immigration portal. Add/edit rows in Supabase Studio to expand coverage without a redeploy |
| Official portal / nearest-office links (`src/lib/officialLinks.ts`) | Scoped Google searches rather than a hardcoded directory (addresses/emails change, and a wrong one is worse than none) | Build a maintained directory once you can keep it accurate, or partner with a service that already does |
| "Email me a copy" (Secure tab) | A `mailto:` link opens the user's own email client with a summary — it can't attach the downloaded file automatically | Add a real backend (e.g. a Supabase Edge Function + an email API like Resend/SendGrid) to send the signed case file server-side |
| Community groups (Social tab) | Search links (Facebook/Meetup/WhatsApp), not specific group invites | Build a real directory once you have vetted, active groups per city |
| Discover destination guide | Static baseline for 5 countries + generic fallback (`src/data/discover.ts`); reads live from Supabase's `destination_guides` table when a row exists | Expand per city, and refresh seasonally — travel details date quickly. Edit in Supabase Studio, no redeploy needed |
| Currency exchange rate (Discover tab) | **Real** — calls the free Frankfurter API directly from the browser | Already real; no further work needed |
| Waitlist signups | Saved to the browser's `localStorage` (`src/lib/waitlist.ts`) | Point `saveEmail` at a Supabase table (or any datastore) — the call sites don't need to change |
| Marketplace listings (Settle tab) | Static fallback (`src/data/listings.ts`); once Supabase is connected, submissions are real, persisted, and update live for every visitor via Realtime | Already real once connected — see SUPABASE_SETUP.md |
| Routine loops (Social tab) | Static fallback (`src/data/routines.ts`); once Supabase is connected, joins persist and spot counts update live via Realtime, guarded server-side by the `join_routine()` function so a client can't overwrite counts directly | Already real once connected |
| Feedback | Saved to `localStorage` always; also written to Supabase's `feedback` table once connected, with the widget showing the real cross-user average via a `feedback_summary()` RPC (raw comments stay private — no public SELECT policy) | Already real once connected |
| Trip state, signature, checklist progress (`src/lib/tripState.tsx`) | Deliberately `localStorage`-only (see "The flow" above) | Add auth + a per-user table if cross-device case sync is ever wanted — no plan to do this by default, since it's personal/identity data |

None of this requires a rewrite — the mocked functions were written as the
seams where a real backend plugs in later.

## Project structure

```
src/
  components/   Itinerary intake, tab navigation, the four service tabs,
                signature pad, checklist item row, activity timeline,
                feedback widget, exchange rate widget
  data/         Static fallback content: listings/routines, visa
                requirements, community groups, destination guides
  lib/
    repos/      Data-access modules — Supabase-backed with static/local
                fallback (listings, routines, feedback, destination
                guides, visa requirements)
    supabaseClient.ts   Supabase client, or null if not configured
    tripState.tsx       Personal case state (localStorage-only, see above)
    calendar.ts, officialLinks.ts, exportCase.ts, download.ts,
    currency.ts, waitlist.ts
  App.tsx       Layout, tab gating/auto-advance, reset ("Start new case")
supabase/
  migrations/0001_init.sql   Full schema + RLS policies
  seed-example.sql           A few optional example rows
SUPABASE_SETUP.md            Step-by-step: create a project, run the
                              schema, wire up local dev and GitHub Actions
```

## Tech stack

Vite + React + TypeScript + Tailwind CSS v4 + Supabase (optional).
