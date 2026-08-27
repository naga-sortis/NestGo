# NestGo — The Expat Operating System

One place for anyone moving abroad to handle bureaucracy, hand off (or take
over) a home, and find people nearby with the same weekly routines.

Three services, one app:

- **Secure** — upload a passport/contract, get local paperwork (e.g. Spain's
  EX-15) pre-filled, and track an arrival checklist.
- **Settle** — a peer-to-peer marketplace where a departing expat lists their
  lease, furniture, and utility contracts as one package for an incoming
  expat to take over, escrow-protected.
- **Social** — small (4–6 person) groups matched by neighborhood and a
  recurring weekly habit — a coffee run, a padel match, a co-working slot —
  instead of one-off mixers.

This repo is the working prototype: a static React app, deployable for free
on GitHub Pages, with every AI/backend interaction currently **mocked** so it
can be demoed and user-tested with zero infrastructure cost.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL. `npm run build` produces a production
bundle in `dist/`; `npm run preview` serves that bundle locally.

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy.yml` builds and publishes the app to
GitHub Pages on every push to `main`. To turn it on:

1. In the repo settings, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).
3. The site will be live at `https://<owner>.github.io/NestGo/`.

`vite.config.ts` sets `base: '/NestGo/'` to match that URL path — update it if
the repo is ever renamed.

## What's mocked right now, and how to make it real

| Feature | Current behavior | To make it real |
| --- | --- | --- |
| Document upload (Secure tab) | Fixed delay, then fills in placeholder fields | Add a Supabase Edge Function (or any small backend) that forwards the file to the Claude or OpenAI API with an extraction prompt, and call it from `src/components/SecureTab.tsx` in place of the `setTimeout` |
| Waitlist signups | Saved to the browser's `localStorage` (`src/lib/waitlist.ts`) | Point `saveEmail` at a Supabase table (or any datastore) — the call sites don't need to change |
| Marketplace listings (Settle tab) | Hardcoded in `src/data/listings.ts`, new listings just show a success message | Persist submitted listings to a database and read the grid from there |
| Routine groups (Social tab) | Hardcoded in `src/data/routines.ts` | Persist joins and add real group-chat creation once there's a backend |

None of this requires a rewrite — the mocked functions were written as the
seams where a real backend plugs in later.

## Project structure

```
src/
  components/   Hero, tab navigation, and the three service tabs
  data/         Mock listings and routines
  lib/          Waitlist persistence (localStorage today, swappable)
  App.tsx       Layout + tab switching
```

## Tech stack

Vite + React + TypeScript + Tailwind CSS v4. No backend yet by design — see
the mocking table above for the next step once real users are testing it.
