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
