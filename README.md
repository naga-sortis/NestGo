# NestGo — The Expat Operating System

One place for anyone moving abroad to handle bureaucracy, hand off (or take
over) a home, and find people nearby with the same weekly routines.

## The flow

1. **Itinerary intake** — where you're moving from/to and why (student,
   employment, on-site relocation, tourist). Everything after this is
   tailored to that trip.
2. **Secure** — a document upload, a destination- and purpose-specific
   paperwork form, an e-signature, and an arrival checklist. Every action is
   logged to a visible "case file" timeline, the way a caseworker or travel
   agent would track your file by hand. Each checklist item can generate a
   real Google Calendar reminder (opens Google's own "add event" page — no
   API key needed).
3. **Settle** — unlocks once the Secure checklist is fully checked off (the
   app auto-switches you there). A peer-to-peer marketplace, filterable by
   zone and sorted by price, for taking over a departing expat's lease,
   furniture, and utilities — escrow-protected. A "search the web instead"
   link is always available if nothing local fits.
4. **Social** — city-specific Facebook/Meetup/WhatsApp group search links
   to join, plus neighborhood routine loops (small groups matched by a
   recurring weekly habit) filtered to your destination city.

This repo is the working prototype: a static React app, deployable for free
on GitHub Pages, with every AI/backend interaction currently **mocked** so it
can be demoed and user-tested with zero infrastructure cost. Trip data,
form answers, the signature, checklist progress, and community/housing
preferences persist in the browser's `localStorage` (`src/lib/tripState.tsx`)
so a session survives a refresh.

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
the repo is ever renamed. The `github-pages` deployment environment
(**Settings → Environments**) must allow the branch you're pushing from
under "Deployment branches and rules," or the deploy job is rejected before
it runs.

## What's mocked right now, and how to make it real

| Feature | Current behavior | To make it real |
| --- | --- | --- |
| Document upload (Secure tab) | Fixed delay, then lets you fill fields manually | Add a Supabase Edge Function (or any small backend) that forwards the file to the Claude or OpenAI API with an extraction prompt, and call it from `src/components/SecureTab.tsx` in place of the `setTimeout` |
| Visa checklist/form content (`src/data/visaRequirements.ts`) | A small starting set for Spain, India, and the US, plus a generic fallback for any other country | Not legal advice — verify against the destination country's official immigration portal, and expand the data file as you cover more countries |
| Community groups (Social tab) | Search links (Facebook/Meetup/WhatsApp), not specific group invites | Build a real directory once you have vetted, active groups per city |
| Waitlist signups | Saved to the browser's `localStorage` (`src/lib/waitlist.ts`) | Point `saveEmail` at a Supabase table (or any datastore) — the call sites don't need to change |
| Marketplace listings (Settle tab) | Hardcoded in `src/data/listings.ts`, new listings just show a success message | Persist submitted listings to a database and read the grid from there |
| Routine groups (Social tab) | Hardcoded in `src/data/routines.ts` | Persist joins and add real group-chat creation once there's a backend |
| Trip state, signature, checklist progress (`src/lib/tripState.tsx`) | Saved to the browser's `localStorage` — private to one browser, lost if storage is cleared | Swap for a real backend (e.g. Supabase) keyed by a signed-in user, so a case survives across devices |

None of this requires a rewrite — the mocked functions were written as the
seams where a real backend plugs in later.

## Project structure

```
src/
  components/   Itinerary intake, tab navigation, the three service tabs,
                signature pad, activity timeline
  data/         Mock listings/routines, visa requirements, community groups
  lib/          Trip state (localStorage-backed), Google Calendar link
                builder, waitlist persistence
  App.tsx       Layout, tab gating/auto-advance
```

## Tech stack

Vite + React + TypeScript + Tailwind CSS v4. No backend yet by design — see
the mocking table above for the next step once real users are testing it.
