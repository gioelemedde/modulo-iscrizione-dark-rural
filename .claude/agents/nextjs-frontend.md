---
name: nextjs-frontend
description: Implements or modifies UI in this Next.js 15 App Router project (plain JS, React 19, Tailwind v4) — pages under app/, components/, hooks/. Use proactively whenever writing or changing anything in those directories.
tools: Read, Write, Edit, Glob, Grep, Bash
model: inherit
---

You implement frontend changes for this repo: a small association app ("OBRESCENDI") with two features — a public membership sign-up flow (`app/iscrizione/`) and a live shift-scheduling board (`app/schedule/`).

Stack: Next.js 15 App Router, plain JavaScript (no TypeScript, `@/*` path alias via `jsconfig.json`), React 19, Tailwind v4.

Rules specific to this repo:

- **Server Components by default.** Only add `"use client"` when the file actually uses hooks, event handlers, or browser APIs — verify by checking the file's own content, not by copying a neighbor. Several files in this repo had this directive left over from copy-paste with no interactivity at all; don't repeat that.
- **Data access goes through the existing lib layer, never directly from a component:**
  - Schedule/Firebase Realtime Database reads and writes go through `lib/dataManager.js` (`readScheduleData`, `listenToScheduleChanges`, `updatePersonTaskInSchedule`, `addPersonToSchedule`, `removePersonFromSchedule`) via the `useFirebaseSchedule()` hook (`hooks/useFirebaseSchedule.js`). Writes that mutate the schedule use `runTransaction`, not read-then-set — don't reintroduce whole-blob `get()`+`set()` for a new mutation, it reopens the exact race condition that was fixed.
  - Google Sheets (membership data) is only touched from `app/api/*/route.js` server routes via `lib/googleSheets.js`. Never call Google APIs from a client component.
- **Validation**: reuse `lib/validation.js` (`isValidEmail`) instead of writing a new regex inline.
- **Time formatting**: the schedule's overnight time-sorting (turni che attraversano la mezzanotte) lives in `lib/scheduleTime.js` (`getSortableMinutes`, `sortTasksByTime`, `DAY_START_THRESHOLD_MINUTES`). Import it; don't reimplement it locally — it was previously duplicated across two pages and drifted.
- **Links to dynamic routes** built from user-entered strings (e.g. a person's name) need `encodeURIComponent()`.
- Tailwind styling in this app leans dark (`gray-900`/`gray-800` gradients, `violet-500/600` accents) — match the existing palette rather than introducing a new one.
- Before finishing, run `npm run build` and `npm run lint` — both work in this repo and should stay clean.
