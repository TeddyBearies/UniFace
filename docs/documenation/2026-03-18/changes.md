# Change Log - 2026-03-18

This file records changes made on `2026-03-18` in the order they happened. If more than one change happens on the same day, add a new numbered entry below the previous one.

1. Planned and created the initial application file structure.
   - Purpose: establish a clean, organized foundation before writing feature code so routing, responsibilities, and shared resources stay easy to understand as the project grows.
   - Scope: set up the main app areas as separate folders for different concerns, including `app/(auth)`, `app/(admin)`, `app/(student)`, `app/(instructor)`, and `app/api`, plus supporting top-level folders such as `components`, `features`, `lib`, `rules`, `supabase`, `tests`, `public`, and `docs`.
   - Outcome: the project now has a clear starting layout for authentication flows, role-based sections, API work, reusable UI, business logic, database integration, tests, and static assets.
   - Notes: placeholder files like `.gitkeep` were used to preserve empty directories until real implementation files are added.

2. Created the `documenation/2026-03-18/` folder structure and started this log.
   - Purpose: create a dated change record so future work can be tracked in sequence and reviewed later without guessing what changed first.
   - Scope: added the top-level `documenation` directory, the `2026-03-18` date folder, and this markdown log file.
   - Outcome: there is now a dedicated place to record daily changes in order, with room for multiple entries in the same day.

3. Added the root application layout in `app/layout.tsx`.
   - Purpose: define the shared HTML shell for the Next.js app so every page inherits the same baseline structure, metadata, and visual defaults.
   - Scope: added `metadata` for the project title and description, wrapped the app in a root `<html lang="en">` element, and set a consistent `<body>` style with zero margin, full viewport height, a light neutral background, dark text, and the `Public Sans`-based font stack.
   - Outcome: all future pages now render inside one centralized layout, which makes the app easier to theme and keeps global presentation decisions in one place.
   - Notes: this is the foundation layer that other routes, like authentication pages, will build on.

4. Added the initial login screen at `app/(auth)/login/page.tsx`.
   - Purpose: create a user-facing entry point for the authentication flow so students, instructors, and admins have a dedicated place to sign in.
   - Scope: built a client-side login page with local state for email, password, and feedback messages; added basic email validation; and included a submit handler that currently acts as a placeholder until backend authentication is connected.
   - UI details: the page uses a branded header, a centered login card, icon-backed input fields, a password field, a forgot-password link stub, inline validation messaging, and a submit button styled to match the project's visual direction.
   - Outcome: the project now has a functional login interface that looks complete from the front end and is ready to be wired to real auth logic later.
   - Notes: the page intentionally blocks the default form submit behavior for now so the UX can be tested without a backend.
