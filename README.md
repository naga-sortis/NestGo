# NestGo — The Expat Operating System

One place for anyone moving abroad to handle bureaucracy, hand off (or take
over) a home, find people nearby with the same weekly routines, and explore
the destination itself.

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
   furniture, and utilities — escrow-protected. A "search the web instead"
   link is always available if nothing local fits.
4. **Social** — city-specific Facebook/Meetup/WhatsApp group search links
   to join, plus neighborhood routine loops (small groups matched by a
   recurring weekly habit) filtered to your destination city.
5. **Discover** — best season to visit, how to get around, cultural/
   traditional highlights, and trip ideas toggled between solo/bachelor and
   family style — so there's a reason to open the app between paperwork
   sessions.

A feedback widget (rating + comment) sits at the bottom of the app once a
case is started, so real usage signal can drive what gets built next.

This repo is the working prototype: a static React app, deployable for free
on GitHub Pages, with every AI/backend interaction currently **mocked** so it
can be demoed and user-tested with zero infrastructure cost. Trip data,
form answers, the signature, checklist progress, community/housing
preferences, and feedback persist in the browser's `localStorage`
(`src/lib/tripState.tsx`) so a session survives a refresh — "Start new case"
clears it deliberately when you want a blank slate.

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
| Document upload → auto-fill (Secure tab) | Fixed delay, then fills identity fields with plausible placeholder values (`src/components/SecureTab.tsx`, `mockExtractedIdentity`) | Add a Supabase Edge Function (or any small backend) that forwards the file to the Claude or OpenAI API with an extraction prompt, and call it in place of `mockExtractedIdentity` |
| Visa checklist/instructions/forms (`src/data/visaRequirements.ts`) | A small starting set for Spain, India, and the US, plus a generic fallback for any other country | Not legal advice — verify against the destination country's official immigration portal, and expand the data file as you cover more countries |
| Official portal / nearest-office links (`src/lib/officialLinks.ts`) | Scoped Google searches rather than a hardcoded directory (addresses/emails change, and a wrong one is worse than none) | Build a maintained directory once you can keep it accurate, or partner with a service that already does |
| "Email me a copy" (Secure tab) | A `mailto:` link opens the user's own email client with a summary — it can't attach the downloaded file automatically | Add a real backend (e.g. a Supabase Edge Function + an email API like Resend/SendGrid) to send the signed case file server-side |
| Community groups (Social tab) | Search links (Facebook/Meetup/WhatsApp), not specific group invites | Build a real directory once you have vetted, active groups per city |
| Discover content (`src/data/discover.ts`) | General, country-level starting points for 5 countries + a generic fallback | Expand per city, and refresh seasonally — travel details date quickly |
| Waitlist signups | Saved to the browser's `localStorage` (`src/lib/waitlist.ts`) | Point `saveEmail` at a Supabase table (or any datastore) — the call sites don't need to change |
| Marketplace listings (Settle tab) | Hardcoded in `src/data/listings.ts`, new listings just show a success message | Persist submitted listings to a database and read the grid from there |
| Routine groups (Social tab) | Hardcoded in `src/data/routines.ts` | Persist joins and add real group-chat creation once there's a backend |
| Trip state, signature, checklist, feedback (`src/lib/tripState.tsx`) | Saved to the browser's `localStorage` — private to one browser, lost if storage is cleared or "Start new case" is used | Swap for a real backend (e.g. Supabase) keyed by a signed-in user, so a case survives across devices, and feedback aggregates across users instead of one browser |

None of this requires a rewrite — the mocked functions were written as the
seams where a real backend plugs in later.

## Project structure

```
src/
  components/   Itinerary intake, tab navigation, the four service tabs,
                signature pad, checklist item row, activity timeline,
                feedback widget
  data/         Mock listings/routines, visa requirements, community groups,
                destination guides (Discover tab)
  lib/          Trip state (localStorage-backed), Google Calendar link
                builder, official-source search links, case summary export,
                file download helper, waitlist persistence
  App.tsx       Layout, tab gating/auto-advance, reset ("Start new case")
```

## Tech stack

Vite + React + TypeScript + Tailwind CSS v4. No backend yet by design — see
the mocking table above for the next step once real users are testing it.
