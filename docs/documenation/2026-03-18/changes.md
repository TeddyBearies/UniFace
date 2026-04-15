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

7. Added the first Supabase migration in `supabase/migrations/20260326170000_initial_schema.sql`.
   - Purpose: define the first real database layer so authentication, profiles, courses, attendance, and face-enrollment metadata all have a consistent schema before page-level data work begins.
   - Scope: added enums, tables, indexes, update triggers, an auth-user profile bootstrap trigger, and baseline RLS policies for students, instructors, and admins.
   - Outcome: the repo now has a reproducible starting schema that can be applied to a Supabase project instead of creating tables manually in the dashboard.

8. Added Supabase setup notes in `supabase/README.md`.
   - Purpose: keep the database folder self-explanatory so migration files and setup expectations stay easy to find later.
   - Scope: documented what the `supabase/` folder contains, the recommended migration flow, and the simplest sequence for creating users and assigning roles after signup.
   - Outcome: the backend setup path is now clearer for future work and for anyone joining the project later.

9. Added a minimal server-side auth helper in `features/auth/profile.ts`.
   - Purpose: create a simple shared entry point for reading the signed-in user and matching profile without duplicating Supabase query code across pages.
   - Scope: added `getCurrentProfile()`, which reads the current authenticated user from the server client and fetches the corresponding row from `profiles`.
   - Outcome: role-aware page wiring now has a small, reusable helper ready for the next integration step.

10. Added a private storage migration for face-template files.
   - Purpose: move sensitive face-template file handling into Supabase Storage instead of leaving that part undefined while only relational tables exist.
   - Scope: added `supabase/migrations/20260327110000_face_storage.sql`, which creates a private `face-templates` bucket and admin-only storage policies on `storage.objects`.
   - Outcome: the Supabase backend definition now covers both relational data and the first secure storage layer needed for a FaceID workflow.


## 2026-03-27

1. Updated `docs/database-architecture.md` to reflect the implemented Supabase baseline.
   - Purpose: bring the architecture guide back in sync with the codebase now that Supabase helpers, a first migration, and a real login flow are present instead of keeping the document in the earlier pre-database planning state.
   - Scope: changed the current-state section from "no live database client or migrations" to a description of the actual repo contents, clarified that SQL risk is still mostly limited to controlled migration files rather than runtime query building, updated the `profiles` model to use the auth user UUID directly, split face-enrollment storage details into a separate `face_templates` table, and revised the recommended next steps to focus on running the migration, creating initial users, assigning roles, and then wiring pages to real profile data.
   - Outcome: the database reference now better matches the schema and auth approach the project is actually using, which reduces the chance of future implementation work following outdated design notes.

2. Removed `.env.example` from the repository.
   - Purpose: remove the tracked example environment template from the current repo state.
   - Scope: deleted the file that previously documented the expected public Supabase URL and key variables, server-only secret variables, and optional direct database connection string.
   - Outcome: the project no longer ships a checked-in example environment file, so environment setup guidance now depends on other documentation such as the README or local team knowledge.

## 2026-04-08

1. Added the instructor dashboard page at `app/(instructor)/instructor/dashboard/page.tsx`.
   - Purpose: create the first dedicated instructor landing screen so teaching staff have a central dashboard after login rather than sharing student-facing placeholders.
   - Scope: added an instructor sidebar with role-specific navigation links, a top bar with session/profile indicators, a welcome section, and a large quick-actions area that points to future instructor tools such as taking attendance, enrolling students, reviewing class attendance, and generating reports.
   - UI details: the quick-action cards use custom SVG illustrations and descriptive copy so the page already communicates the intended instructor workflow even before the downstream pages are fully built.
   - Outcome: the project now has a role-specific instructor entry point that matches the broader app structure and creates a clear home for future instructor operations.

2. Added the student attendance-history page at `app/(student)/student/attendance-history/page.tsx`.
   - Purpose: give students a dedicated place to review historical attendance data instead of keeping history as a placeholder link with no destination.
   - Scope: built a full attendance-history screen with student navigation, filter controls for course and date range, an empty-state table area for future records, and summary cards for present rate, absent rate, and late check-ins.
   - UI details: the page is intentionally designed to work even before real backend data is connected, using empty-state messaging and zeroed summary metrics to show what information will appear later.
   - Outcome: the student experience now includes a second functional route beyond the dashboard, which makes the student section feel more complete and ready for live data wiring.

3. Updated shared navigation and styling to support the new instructor and student routes.
   - Purpose: connect the new screens into the existing UI flow so navigation is usable and the new pages match the established visual system.
   - Scope: updated `app/(student)/student/dashboard/page.tsx` to use real `next/link` navigation for sidebar items and the attendance-history call-to-action, and expanded `app/globals.css` with new style blocks for the instructor dashboard and student attendance-history layouts, including responsive behavior and link-safe navigation styling.
   - Outcome: both the new pages and the existing student dashboard now behave like connected application routes instead of isolated mock screens, while still sharing one centralized styling system.

4. Connected the instructor dashboard to live Supabase-backed overview data.
   - Purpose: move the instructor dashboard beyond a static mock so it can reflect the signed-in instructor's assigned courses and attendance activity directly from the backend.
   - Scope: added `features/attendance/instructor-dashboard.ts` as a server-side data helper that reads the current authenticated profile, fetches instructor course assignments, counts active enrollments, summarizes attendance sessions, and returns a dashboard-ready data shape; updated `app/(instructor)/instructor/dashboard/page.tsx` to become an async server page that uses this helper, redirects unauthenticated or unauthorized users, personalizes the header with the instructor name, renders overview stat cards, and lists assigned courses with session metadata; expanded `app/globals.css` with styling for the new overview, courses, and empty-state sections.
   - Outcome: the instructor dashboard now has a real data path from Supabase to the UI, which makes it useful as an actual role-aware landing page instead of only a visual placeholder.

5. Fixed the Supabase public-key environment fallback in `lib/supabase/config.ts`.
   - Purpose: resolve a configuration bug where the app could still fail to initialize Supabase even when a valid public key was present under an alternate environment variable name.
   - Scope: added support for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` as an additional fallback when resolving the browser-safe Supabase key, kept the legacy anon-key fallback in place, and updated the thrown error message so it correctly lists all accepted fallback variables.
   - Outcome: the Supabase config layer is now more tolerant of the environment naming used in local setup, which reduces startup and login failures caused by mismatched variable names.

## 2026-04-09

1. Added a reusable instructor tool layout in `components/InstructorPageFrame.tsx`.
   - Purpose: avoid duplicating the instructor sidebar, navigation icons, and workspace shell across every instructor tool page as more routes are added.
   - Scope: created a shared frame component with typed navigation keys, role-specific nav links, reusable instructor icons, the instructor sidebar shell, and a workspace area that accepts page content through `children`.
   - Outcome: new instructor tools can now share one consistent navigation and layout wrapper, which makes the instructor area easier to scale and maintain.

2. Added the instructor take-attendance page at `app/(instructor)/instructor/take-attendance/page.tsx`.
   - Purpose: create a dedicated instructor workflow screen for running classroom attendance sessions instead of leaving the dashboard quick action without a real destination.
   - Scope: built a page with course selection, session control buttons, a large camera-feed placeholder, an awaiting-scan panel, and a footer summary area for scan session counts and latest scan status.
   - UI details: the screen is structured as a real attendance-control interface, with a clear step order and placeholder states that make it ready for future camera, QR, and attendance-session logic.
   - Outcome: the instructor area now includes a focused route for attendance-taking operations rather than only a top-level dashboard.

3. Added the instructor student-enrollment page at `app/(instructor)/instructor/enroll-student/page.tsx`.
   - Purpose: create a dedicated registration workflow for adding new students and capturing their face enrollment data.
   - Scope: built a two-panel page with student-detail inputs, course selection, enrollment start and capture actions, a biometric camera placeholder, and a three-step instructional section explaining the enrollment flow.
   - UI details: the page is designed to communicate a structured registration process even before backend validation, camera integration, and storage wiring are finished.
   - Outcome: instructors now have a dedicated enrollment route that matches the intended FaceID registration workflow and provides a clear base for future implementation.

4. Expanded `app/globals.css` to support the new instructor tool pages.
   - Purpose: style the shared instructor frame and the new attendance/enrollment screens inside the same centralized CSS system used elsewhere in the app.
   - Scope: added layout, form, panel, action-button, camera-placeholder, footer, and responsive rules for the `instructor-tool-page`, `take-attendance-page`, and `enroll-student-page` screen families.
   - Outcome: the new instructor routes now share a coherent visual system and responsive behavior without reintroducing large page-local style blocks.

5. Added the first face-recognition client utilities under `features/face/`.
   - Purpose: create a reusable client and server foundation for biometric enrollment and live attendance recognition instead of embedding all face-processing logic directly inside page components.
   - Scope: added `features/face/useFaceApi.ts` to load `face-api.js` models from the CDN, manage webcam startup and shutdown, and expose single-face and multi-face detection helpers; added `features/face/face.service.ts` with server actions for enrolling student face templates into Supabase Storage, loading enrolled course templates for recognition, and marking attendance events for matched students.
   - Outcome: the project now has a dedicated face-recognition feature layer that separates camera/model behavior from Supabase persistence and attendance writes, making future biometric work easier to extend and debug.

6. Wired the instructor enrollment and attendance pages to the FaceID workflow.
   - Purpose: move the instructor tools from static placeholders to interactive biometric screens that can begin exercising the real enrollment and recognition flow.
   - Scope: updated `app/(instructor)/instructor/enroll-student/page.tsx` into a client page that tracks form state, loads face models, activates the webcam, captures one face descriptor, and saves the template through the enrollment server action; updated `app/(instructor)/instructor/take-attendance/page.tsx` into a client page that loads course templates, starts a webcam-backed session, runs repeated face comparisons in the browser, and records matches through the attendance server action while updating live UI counters and status text.
   - Outcome: the instructor tool pages now behave like the first working version of the FaceID flow rather than static mock screens, providing a concrete base for real course data, production thresholds, and hardware testing.

7. Added local testing guidance for the FaceID workflow and installed the required dependency.
   - Purpose: make the new biometric flow testable by documenting the expected Supabase state and adding the browser-side library needed to run recognition.
   - Scope: added `docs/testing-face-id.md` with a step-by-step local testing guide for student enrollment and live attendance scanning, and updated `package.json` plus `package-lock.json` to install `face-api.js` and its supporting dependency tree.
   - Outcome: the project now includes both the runtime dependency and the written testing path needed to verify the FaceID workflow in a local development environment.

8. Added a migration to support student lookup by university ID.
   - Purpose: give instructors a practical identifier for face enrollment instead of requiring raw internal profile UUIDs during manual testing and registration.
   - Scope: added `supabase/migrations/20260409111500_add_university_id.sql`, which introduces a unique `university_id` column on `public.profiles` and creates an index for fast lookups by that value.
   - Outcome: the database now supports the 8-digit university ID flow used by the enrollment screen and the FaceID testing guide.

9. Added server-side service helpers for instructor course loading and attendance session lifecycle.
   - Purpose: move course/session logic out of page components so instructor tools can rely on reusable server actions instead of hardcoded or page-local database behavior.
   - Scope: added `features/courses/course.service.ts` to load the signed-in instructor's assigned courses, and added `features/attendance/attendance.service.ts` to create or reuse open attendance sessions and close them when scanning ends.
   - Outcome: course retrieval and attendance-session management now live in focused service files, which makes the instructor workflow easier to maintain and reuse across future pages.

10. Updated the instructor FaceID pages to use real course data and persisted attendance sessions.
   - Purpose: improve the first biometric workflow so it relies less on mock values and better matches the intended production behavior.
   - Scope: updated `app/(instructor)/instructor/take-attendance/page.tsx` to load the instructor's assigned courses dynamically, start a real open attendance session in the database before scanning, and close that session through a server action when the instructor ends it; updated `app/(instructor)/instructor/enroll-student/page.tsx` so enrollment is driven by the face utilities and uses the entered university ID as the lookup key for saving biometric data.
   - Outcome: the instructor biometric tools now follow a more realistic end-to-end path through Supabase, reducing reliance on hardcoded course placeholders and making the flow closer to a true app workflow.


## 2026-04-13

1. Added the instructor reports page and CSV export flow.
   - Purpose: give instructors a dedicated place to review attendance activity by course and date range, then export the result for offline use.
   - Scope: built `app/(instructor)/instructor/reports/page.tsx` with course and date filters, a generated-summary panel, and a disabled-by-default download action; added `app/api/instructor/reports/route.ts` to return a CSV download built from `getInstructorReportData()` and `buildInstructorReportCsv()`; expanded `app/globals.css` with report-specific layout, filter, empty-state, and responsive rules.
   - Outcome: instructors now have a real reporting screen instead of a placeholder, plus a direct export path for attendance summaries.

2. Added the instructor class-attendance page.
   - Purpose: provide a searchable attendance list for classroom review rather than keeping that workflow buried inside other instructor screens.
   - Scope: created `app/(instructor)/instructor/class-attendance/page.tsx` with course/date filters, a search field, table scaffolding, and pagination controls, then paired it with matching `app/globals.css` styles for the class-attendance layout and responsive behavior.
   - Outcome: instructors now have a dedicated page for browsing class attendance records in a structured table view.

3. Connected shared auth guards and service-backed data flow across the app.
   - Purpose: centralize session and role handling while replacing more of the page-level placeholder logic with reusable backend helpers.
   - Scope: added `features/auth/types.ts`, `features/auth/client-auth.ts`, `features/auth/guards.ts`, and `features/auth/useClientRoleGuard.ts` to standardize app roles and role checks; updated `app/(auth)/login/page.tsx`, `app/(student)/student/dashboard/page.tsx`, `app/(student)/student/attendance-history/page.tsx`, `app/(instructor)/instructor/dashboard/page.tsx`, `app/(instructor)/instructor/take-attendance/page.tsx`, and `app/(instructor)/instructor/enroll-student/page.tsx` to use the newer auth and data helpers; added or expanded `features/attendance/attendance.service.ts`, `features/attendance/instructor-records.service.ts`, `features/attendance/student-attendance.service.ts`, `features/courses/course.service.ts`, `features/face/face.service.ts`, `features/face/useFaceApi.ts`, and `components/LogoutButton.tsx` to support the live data flow.
   - Outcome: login, student, instructor, and report screens now share the same session model and backend service layer instead of each page carrying its own isolated logic.

4. Added the admin dashboard and shared admin shell.
   - Purpose: create a proper admin landing area with system overview cards and quick management links.
   - Scope: created `app/(admin)/admin/dashboard/page.tsx`, added `components/AdminPageFrame.tsx` for the reusable admin sidebar/workspace shell, and extended `app/globals.css` with the admin dashboard and shared admin frame styling.
   - Outcome: admin users now have a dedicated dashboard structure that matches the rest of the role-based app navigation.

5. Added the admin user-management page and refined the admin visual system.
   - Purpose: provide a dedicated admin workspace for browsing and managing users.
   - Scope: created `app/(admin)/admin/user-management/page.tsx` with summary cards, tabs, search, and an empty-state table, then refined `app/globals.css` to cover the user-management layout, actions, summary cards, pagination, and responsive behavior.
   - Outcome: the admin area now has a concrete user-management screen and a more complete visual system for upcoming admin workflows.

6. Added the admin course-assignment page.
   - Purpose: give admins a dedicated place to assign instructors to courses and review existing pairings.
   - Scope: created `app/(admin)/admin/course-assignment/page.tsx` with instructor and course selectors, a semester selector, an assign action, a searchable assignments table, and an empty state; expanded `app/globals.css` with course-assignment layout, form, table, search, and responsive rules.
   - Outcome: the admin area now includes a focused workflow for managing course ownership instead of leaving assignments as an unbuilt placeholder.

7. Added the admin biometric reset page.
   - Purpose: give admins a dedicated recovery and privacy workflow for clearing a student's stored face data when biometric information needs to be reset.
   - Scope: created `app/(admin)/admin/reset-face-data/page.tsx` with a permanent-action warning banner, a student ID lookup field, a reset action button, verification messaging, and guidance cards explaining when to use the tool and how the reset is audited; expanded `app/globals.css` with the matching reset-page layout, warning, form, footer, info-card, and responsive styles.
   - Outcome: the admin area now includes a controlled interface for biometric reset requests instead of leaving this sensitive workflow undefined.

8. Connected the admin area to live service-backed workflows.
   - Purpose: replace the remaining static admin placeholders with real data, form actions, and export paths so the admin section behaves like an operational control panel.
   - Scope: updated `app/(admin)/admin/dashboard/page.tsx` to read live dashboard stats and recent events from `features/reports/admin-dashboard.service.ts`; updated `app/(admin)/admin/user-management/page.tsx` to use `features/auth/admin-user-management.service.ts` for filtering, pagination, role changes, and reset-face links; added `app/(admin)/admin/user-management/create/page.tsx` with the `createAdminUserAction` form; updated `app/(admin)/admin/course-assignment/page.tsx` to use `features/courses/admin-course-assignment.service.ts` for assignment listing, creation, and removal; updated `app/(admin)/admin/reset-face-data/page.tsx` to use `features/face/admin-face-reset.service.ts` for student lookup and biometric reset actions; added `app/(admin)/admin/reports/page.tsx` and `app/api/admin/reports/route.ts` for admin-wide report generation and CSV export; refined `components/AdminPageFrame.tsx` and `app/globals.css` to support the new admin actions, messages, rows, inputs, and report layouts.
   - Outcome: the admin section now supports real operational workflows for viewing metrics, managing users, assigning courses, resetting biometric data, and exporting reports instead of relying on static mock screens.

9. Hardened attendance marking against duplicate scan inserts.
   - Purpose: prevent the same student from being recorded more than once in the same attendance session when the FaceID workflow rechecks a match.
   - Scope: updated `features/face/face.service.ts` so `markAttendanceAction()` now looks up an existing attendance event before inserting a new one, returning a success response when the student is already marked present.
   - Outcome: repeated recognition passes no longer create duplicate attendance rows, which makes the attendance records more stable during live scanning.


## 2026-04-15

1. Added the admin reports page and export route.
   - Purpose: give admins a dedicated reporting screen for reviewing attendance across all courses and exporting the result for offline use.
   - Scope: created `app/(admin)/admin/reports/page.tsx` with course and date filters, report summaries, breakdown rows, and CSV export actions; added `app/api/admin/reports/route.ts` to generate the downloadable report file; expanded `app/globals.css` with the admin-specific report layout and responsive styles.
   - Outcome: admins now have a real reporting workflow that mirrors the instructor report experience, including on-demand CSV export.

2. Expanded the admin workflow stack with live services and user creation.
   - Purpose: replace the remaining admin placeholders with service-backed workflows for dashboard metrics, user management, course assignment, and biometric reset operations.
   - Scope: updated `app/(admin)/admin/dashboard/page.tsx`, `app/(admin)/admin/user-management/page.tsx`, `app/(admin)/admin/course-assignment/page.tsx`, and `app/(admin)/admin/reset-face-data/page.tsx` to use live admin services; added `app/(admin)/admin/user-management/create/page.tsx` for creating student, instructor, and admin accounts; introduced `features/reports/admin-dashboard.service.ts`, `features/auth/admin-user-management.service.ts`, `features/courses/admin-course-assignment.service.ts`, and `features/face/admin-face-reset.service.ts`; refined `components/AdminPageFrame.tsx` and `app/globals.css` so the new admin actions, status messages, tables, and forms fit the shared shell.
   - Outcome: the admin control area now supports real dashboard data, account creation, role updates, course assignments, face-data resets, and report navigation instead of static mock screens.

3. Hardened attendance, scan-mode, and history handling.
   - Purpose: make live attendance sessions more secure and make the archive/report views reflect real session timing and scan states more accurately.
   - Scope: added `features/attendance/attendance-read.service.ts` and `features/attendance/useLockedScanMode.ts`; added `features/auth/verify-current-password.ts` and tightened `features/auth/client-auth.ts` plus `lib/supabase/client.ts` so browser auth checks work cleanly with locked scanning; expanded `features/attendance/attendance.service.ts`, `features/attendance/instructor-dashboard.ts`, `features/attendance/instructor-records.service.ts`, `features/attendance/student-attendance.service.ts`, `features/courses/course.service.ts`, `features/face/face.service.ts`, and `features/face/useFaceApi.ts` to support session ownership checks, attendance session revalidation, late/duplicate handling, richer CSV rows, and safer webcam scanning; updated `app/(instructor)/instructor/take-attendance/page.tsx`, `app/(instructor)/instructor/class-attendance/page.tsx`, `app/(instructor)/instructor/reports/page.tsx`, and `app/(student)/student/attendance-history/page.tsx` so the UI now shows grouped archives, date-and-time stamps, late statuses, locked fullscreen scanning, and password-protected unlock flow.
   - Outcome: the attendance experience is now more resilient and realistic, with cleaner scan safety, better session history, and more accurate report data across instructor and student views.

4. Upgraded the instructor biometric workflows.
   - Purpose: move the FaceID screens from basic camera demos into roster-aware enrollment and attendance tools with stronger operator safeguards.
   - Scope: updated `app/(instructor)/instructor/enroll-student/page.tsx` to load the instructor's assigned courses, validate the candidate student against the selected course, and auto-add an enrolled student to the roster when appropriate; updated `app/(instructor)/instructor/take-attendance/page.tsx` to enter a browser fullscreen locked-scan mode, protect exit with password verification, show richer scan feedback, and provide controls for starting, scanning, and ending live attendance sessions; expanded `app/globals.css` with the matching locked-scan, fullscreen, unlock-dialog, feedback, and camera-control styling.
   - Outcome: instructors now get a safer, more guided FaceID experience that ties live scanning to course rosters and explicit session control.

5. Reworked the attendance archive and student history views.
   - Purpose: make attendance history easier to read by surfacing the actual session timeline rather than only flat check-in rows.
   - Scope: updated `app/(instructor)/instructor/class-attendance/page.tsx` to group records by date and session, show per-session student rows, and display scan timing and status badges; updated `app/(student)/student/attendance-history/page.tsx` to show date and time together for each record; expanded `app/(instructor)/instructor/reports/page.tsx` to render a summary grid and course breakdown when report data exists; added the matching layout and responsive style updates in `app/globals.css`.
   - Outcome: both student and instructor history screens now communicate when scans happened, not just which course they belong to.

6. Added shared attendance-read and auth helpers.
   - Purpose: centralize the snapshot, locking, and password-verification logic used by the attendance and FaceID flows.
   - Scope: added `features/attendance/attendance-read.service.ts` for normalized session, event, and late-status aggregation; added `features/attendance/useLockedScanMode.ts` for browser fullscreen lock behavior and escape prevention; added `features/auth/verify-current-password.ts` for protected unlock checks; tightened `features/auth/client-auth.ts` and `lib/supabase/client.ts` so browser role lookups and Supabase client reuse are more reliable.
   - Outcome: the app now has a shared helper layer for locked scanning, browser auth, and attendance snapshot formatting.

7. Hardened the attendance and face service layer.
   - Purpose: make live sessions, roster checks, and facial recognition behave more consistently under real usage.
   - Scope: expanded `features/attendance/attendance.service.ts`, `features/attendance/instructor-dashboard.ts`, `features/attendance/instructor-records.service.ts`, `features/attendance/student-attendance.service.ts`, `features/courses/course.service.ts`, `features/face/face.service.ts`, and `features/face/useFaceApi.ts` with session ownership checks, unique student counting, grouped date/session snapshots, course auto-enrollment support, duplicate attendance prevention, late-status handling, stricter webcam readiness checks, and better detection defaults.
   - Outcome: attendance capture, reporting, and face enrollment now share a more robust backend foundation that reduces duplicate writes and makes the live UI data more accurate.
