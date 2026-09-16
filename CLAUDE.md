# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint (`eslint` + `eslint-config-next`, flat config in `eslint.config.mjs`)

No test suite is configured in this repo.

## Subagents

Four project-scoped subagents live in `.claude/agents/`: `nextjs-frontend` (implements UI changes), `architect` (consult before non-trivial changes), `code-checker` (mechanical build/lint/regression pass), `code-reviewer` (final correctness/security/maintainability pass). Each has this repo's architecture baked in — read them before reinventing the same guidance ad hoc.

## Architecture

Next.js 15 App Router app, plain JavaScript (no TypeScript), React 19, Tailwind CSS v4. Two unrelated data stores, no ORM/migrations for either:

- **Firebase Realtime Database** (`lib/firebase.js`, `lib/dataManager.js`, `hooks/useFirebaseSchedule.js`) — backs the shift-scheduling board at `app/schedule/`. Single JSON blob (node `scheduleData`) with `schedule` (array of `{ name, tasks: [{ time, category, activity }] }`), `timeSlots` (ordered overnight hour ranges), and `activities` (category → activity labels). `useFirebaseSchedule` holds a live `onValue` listener, so edits sync in real time across clients. Writes that mutate the schedule (`updatePersonTaskInSchedule`, `addPersonToSchedule`, `removePersonFromSchedule`) go through Firebase `runTransaction` rather than read-then-set, so concurrent edits from multiple clients don't silently clobber each other. `lib/scheduleData.json` is seed data, loaded once via `app/init/` (guarded by a `window.confirm` — it overwrites all live data).
- **Google Sheets**, accessed via a service account (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` in `.env.local`) through `lib/googleSheets.js` — acts as the membership database for the `iscrizione` (sign-up) flow. `Iscritti` sheet holds member records; `Accessi` sheet logs event check-ins, gated to the event window from `lib/eventWindow.js` (`EVENT_DATE` env var, `YYYY-MM-DD`; counts entries up to 06:00 the following day as the same event day — mirrors the overnight-crossing logic in `lib/scheduleTime.js`). `EVENT_DATE` must be set both in `.env.local` (dev) and in the Vercel project's Environment Variables (prod) — `.env.local` is gitignored and never reaches Vercel.

Shared `lib/` modules: `lib/validation.js` (`isValidEmail`), `lib/scheduleTime.js` (overnight-aware time sorting, used by both `app/schedule/category/[category]/` and `app/schedule/person/[name]/`), `lib/eventWindow.js`, `lib/googleSheets.js` (Sheets connection + `sanitizeForSheets`, which guards against Sheets formula injection on free-text fields).

API routes (`app/api/*`, route handlers):
- `check-email` — looks up an email in `Iscritti`; on match, logs an `Accessi` check-in row if within the event window.
- `submit-form` — validates required fields and verifies the reCAPTCHA token server-side (`RECAPTCHA_SECRET_KEY` env var — required, submissions are rejected without it) before doing anything else, then builds a `matricola` (member ID), generates a membership PDF (`pdf-lib`), writes the row to `Iscritti`, emails the signed PDF (`nodemailer`, `EMAIL_USER`/`EMAIL_PASS`).

No auth system: "login" is just an email lookup against the `Iscritti` sheet; `/schedule` and `/init` are unprotected (the latter has a confirm guard as its only safety net).

Secrets live in `.env.local` (gitignored) — and, separately, must be duplicated in the Vercel dashboard for production; there's no automatic sync between the two. `lib/firebase.js` has the Firebase *client* config (API key etc.) hardcoded in source rather than env vars — normal for Firebase web config, not a leak of a private key.
