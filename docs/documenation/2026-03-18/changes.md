# Change Log

This file records project changes in chronological order. Each date gets its own section. If more than one change happens on the same day, list them in the order they happened.

## 2026-03-18

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

## 2026-03-21

1. Added `app/styled-jsx-registry.tsx` to support styled-jsx with the App Router.
   - Purpose: make server-rendered `styled-jsx` styles work correctly in the Next.js App Router, where styles need to be collected and injected during rendering.
   - Scope: created a client component that initializes a style registry, registers server-inserted HTML, flushes collected styles after each render pass, and wraps children in `StyleRegistry`.
   - Outcome: components using `styled-jsx` can now render predictable styles without breaking the App Router rendering flow.
   - Notes: this helper is a shared infrastructure piece, so it keeps style handling centralized instead of duplicating setup in individual pages.

2. Updated `app/layout.tsx` to use the styled-jsx registry wrapper.
   - Purpose: connect the root layout to the new style registry so every page can participate in the same style insertion pipeline.
   - Scope: imported `StyledJsxRegistry` and wrapped the layout children inside it while keeping the existing metadata and base `<body>` styling intact.
   - Outcome: the app now has a root-level integration point for styled-jsx, which reduces the chance of missing styles on server-rendered or hybrid pages.
   - Notes: this change is intentionally small at the layout level, but it unlocks consistent styling behavior across the whole application.

3. Added the student dashboard page at `app/(student)/student/dashboard/page.tsx`.
   - Purpose: create the first post-login student experience so learners can immediately see their attendance status, navigate to history, and understand where their data will appear once the backend is connected.
   - Scope: built a client-side dashboard shell with a left sidebar, a top header, a welcome message, summary cards, and a call-to-action button for attendance history.
   - Layout details: the sidebar includes the project logo, navigation items for `Dashboard` and `Attendance History`, and a logout strip at the bottom; the main panel includes a top bar with a notifications button and a user badge, followed by a content area with an intro block and overview cards.
   - Content details: the dashboard currently shows placeholder states for attendance percentage and attendance summary, which makes it clear that the interface is ready but real student data still needs to be wired in.
   - Visual details: the page uses a clean school-portal style with a white sidebar, soft gray page background, teal accent color, subtle card borders, and clearly separated dashboard sections to keep the layout easy to scan.
   - Outcome: students now have a dedicated dashboard screen that matches the app structure and provides a strong base for attendance metrics, history views, and future interactive data.
   - Notes: this page is still front-end only, so the actions and stats are presentational placeholders until routing and data integration are added.

## 2026-03-24

1. Added database architecture guidance in `docs/database-architecture.md`.
   - Purpose: define the backend direction before database code is introduced so auth, relational data, face-data handling, and access controls can be implemented consistently.
   - Scope: documented the current database-free state of the repo, recommended a Supabase-first architecture, outlined an initial relational schema, and listed the security baseline and implementation order.
   - Outcome: the project now has a clear database plan that can guide future feature work without improvising table design or security rules later.

2. Added database safety standards in `rules/database-rules.md`.
   - Purpose: prevent unsafe query patterns, privilege leaks, and accidental exposure of biometric data as the backend is introduced.
   - Scope: added rules covering SQL injection prevention, service-boundary expectations, Row Level Security requirements, elevated key handling, and special restrictions for face-related data.
   - Outcome: future database work now has a project-local safety checklist that can be reviewed before merging backend changes.

3. Updated `.env.example` with Supabase-ready placeholders.
   - Purpose: replace the empty environment template with a practical starting point for local setup once backend integration begins.
   - Scope: added placeholders for the app URL, Supabase project URL, publishable key, server-only secret key, and optional direct Postgres connection string.
   - Outcome: the project now has a safer and more realistic environment template for a managed Postgres and auth setup.

## 2026-03-26

1. Installed Supabase client dependencies and added reusable client helpers.
   - Purpose: prepare the app to connect to a real Supabase project without scattering setup code across routes and features.
   - Scope: added `@supabase/supabase-js` and `@supabase/ssr`, created shared helpers for browser, server, admin, and middleware contexts under `lib/supabase/`, and added a small environment helper that supports both the newer publishable/secret key names and the older anon/service-role names.
   - Outcome: the project now has one consistent place to create Supabase clients safely in each runtime.

2. Added session-refresh middleware and path alias support.
   - Purpose: make Supabase SSR auth work cleanly with the Next.js App Router while keeping imports predictable as the codebase grows.
   - Scope: added root `middleware.ts`, created the middleware session updater, and updated `tsconfig.json` with the `@/*` import alias.
   - Outcome: auth cookies can now be refreshed centrally, and shared helpers can be imported with cleaner paths.

3. Connected the login page to Supabase email/password auth.
   - Purpose: replace the placeholder submit behavior with a real sign-in flow so the page becomes usable as soon as environment keys are added.
   - Scope: updated `app/(auth)/login/page.tsx` to validate input, detect missing Supabase keys gracefully, call `signInWithPassword`, surface authentication errors, and redirect to the current dashboard placeholder on success.
   - Outcome: the login screen is now ready for real credentials instead of showing a static backend-integration message.

4. Updated support files for the new auth flow.
   - Purpose: make local setup clearer and keep the UI responsive during authentication.
   - Scope: updated `.env.example` with legacy key fallbacks, added a quick Supabase setup note to `README.md`, and adjusted login-page styles in `app/globals.css` for success messaging and disabled states.
   - Outcome: setup is easier to follow, and the login UI now reflects loading and success states more clearly.

5. Upgraded Next.js within the 14.x line after a dependency audit.
   - Purpose: reduce known framework security exposure before putting the new authentication flow on top of the existing stack.
   - Scope: updated `next` from `14.1.0` to `14.2.35`, refreshed the lockfile, and re-ran the build and audit checks.
   - Outcome: the previous critical audit finding was reduced to a remaining high-severity advisory that only clears with a breaking upgrade to Next 16.

6. Consolidated page styling into the new global CSS system.
   - Purpose: simplify the front-end structure by moving large component-local style blocks into one shared stylesheet, while keeping the login and student dashboard screens visually consistent.
   - Scope: added `app/globals.css`, updated `app/layout.tsx` to load it from the root, removed embedded `<style jsx>` blocks from both `app/(auth)/login/page.tsx` and `app/(student)/student/dashboard/page.tsx`, and switched those pages to scoped wrapper classes such as `login-page` and `dashboard-page`.
   - Outcome: styling for the main screens is now centralized, easier to maintain, and easier to extend without repeating long inline CSS blocks across page components.
   - Notes: this was documented as one change because the stylesheet file, layout import, and page refactors all belong to the same styling-architecture shift rather than separate product features.
