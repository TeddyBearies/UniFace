# File Structure Rules 
Facial Recognition Attendance Web App

Goal: keep the repo clean and predictable, but not over engineered.

## Approved folder layout

/  
  app/                 # Next.js routes only
    (auth)/
    (student)/
    (instructor)/
    (admin)/
    api/
  components/          # shared UI components
  features/            # feature logic + feature specific UI
    auth/
    face/
    attendance/
    reports/
    courses/
  lib/                 # shared helpers (supabase, utils, validators)
  public/              # static assets
  docs/                # diagrams + notes
  supabase/            # migrations/seed/schema if used
  tests/               # optional, keep basic
  README.md
  .env.example

If a new folder doesn’t fit one of these, don’t add it.

## What goes where (simple rules)

### app/
Only routing + page layout.
No heavy logic here.

### features/
If it’s a real product feature (auth, face, attendance, reports, courses), it lives here.
Each feature can contain whatever it needs (components, hooks, services, types) but keep it small and obvious.

### components/
Reusable UI used across multiple features.
If it’s only used in one feature, keep it inside that feature instead.

### lib/
Shared helpers used in multiple places (supabase client, small utilities, validators).
If it is only used in one feature, it belongs in that feature.

### docs/
Diagrams, setup notes, requirement notes.
No code imports from docs.

### supabase/
Database schema, migrations, seed files, policies if you have them.

## Naming conventions (do not freestyle)

- folders: `lowercase` (use `_` only if needed)
- components: `PascalCase.tsx`
- hooks: `useThing.ts`
- helpers/services: `thing.ts` or `thing.service.ts` (pick one and stick to it)

## Repo hygiene (anti sloppy mode)

1. No random files in root (only the approved ones).
2. No “misc”, “temp”, “final final” folders, ever.
3. No duplicated utils across features. If two features need it, move it to `lib/`.
4. Do not commit real facial images. Use placeholders only if needed.
5. Everything static goes in `public/`.

## Quick decision checklist

- route/page? → `app/`
- feature code? → `features/<feature>/`
- shared UI? → `components/`
- shared helper? → `lib/`
- diagrams/notes? → `docs/`
- db stuff? → `supabase/`