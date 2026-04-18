# Code Documentation Report

This report documents the current implementation file by file and module by module. It focuses on what the code actually does now, how the major modules connect, and where the important logic lives.

## 1. Repository Structure

| Path | Purpose |
| --- | --- |
| `app/` | Next.js App Router pages, route handlers, root layout, CSS imports |
| `components/` | Shared UI shells and reusable interactive controls |
| `features/auth/` | Authentication, role guards, invite onboarding, admin user management |
| `features/attendance/` | Attendance sessions, normalized history building, instructor/student reports |
| `features/courses/` | Course lookup, course assignment, roster enforcement |
| `features/face/` | Face enrollment, template loading, live attendance marking, biometric reset |
| `features/reports/` | Admin dashboard aggregation |
| `lib/supabase/` | Browser, server, admin, and middleware Supabase client helpers |
| `lib/email/` | SMTP email utility currently not wired into active flows |
| `supabase/migrations/` | Database schema history |
| `tests/` | Playwright coverage for auth, student, instructor, admin, and non-functional checks |
| `docs/` | Existing docs plus the new generated documentation package |

## 2. Application Entry and Global Runtime Files

### `app/layout.tsx`

- Purpose: defines the shared HTML shell for the whole app.
- Main responsibilities:
  - imports `app/globals.css`
  - sets metadata
  - wraps the app with `StyledJsxRegistry`
- Dependencies:
  - `app/styled-jsx-registry.tsx`
- Notes:
  - the registry still exists even though the current styling approach is CSS-based

### `app/page.tsx`

- Purpose: redirect the default route to `/login`.
- Main behavior:
  - uses `redirect("/login")`

### `middleware.ts`

- Purpose: plug the Supabase session refresher into Next.js middleware.
- Main behavior:
  - delegates to `updateSession()` in `lib/supabase/middleware.ts`
- Importance:
  - this is the first protection layer for `/student`, `/instructor`, and `/admin`

### `app/globals.css`

- Purpose: small global baseline file that now mainly imports route-specific stylesheets.
- Main responsibilities:
  - base body styling
  - locked scan mode body class behavior
  - imports:
    - `app/styles/layout.css`
    - `app/styles/auth.css`
    - `app/styles/student.css`
    - `app/styles/instructor.css`
    - `app/styles/admin.css`

## 3. Shared Components

### `components/LogoutButton.tsx`

- Purpose: client-side sign-out control used in all role shells.
- Inputs:
  - `className`
  - `children`
  - optional `redirectTo`
- Behavior:
  - creates a Supabase browser client
  - calls `supabase.auth.signOut()`
  - redirects to `/login`

### `components/InstructorPageFrame.tsx`

- Purpose: shared instructor workspace shell.
- Responsibilities:
  - sidebar navigation
  - active route highlighting
  - shared layout for instructor tools
- Used by:
  - take attendance
  - enroll student
  - class attendance
  - reports

### `components/AdminPageFrame.tsx`

- Purpose: shared admin shell with sidebar and top bar.
- Responsibilities:
  - admin navigation
  - page title display
  - profile label display
  - refresh button and avatar shell
- Used by:
  - dashboard
  - user management
  - create user
  - course assignment
  - reset face data
  - reports

## 4. Supabase Utility Layer

### `lib/supabase/config.ts`

- Purpose: centralize environment variable parsing and fallback logic.
- Important functions:
  - `hasSupabasePublicEnv()`
  - `getSupabasePublicEnv()`
  - `getSupabaseAdminEnv()`
- Key detail:
  - supports multiple fallback variable names for public and secret keys

### `lib/supabase/client.ts`

- Purpose: browser-safe singleton Supabase client.
- Why it exists:
  - avoids recreating the browser client across client-side renders

### `lib/supabase/server.ts`

- Purpose: request-bound Supabase server client.
- Why it exists:
  - server components and server actions need cookies to read the current auth state

### `lib/supabase/admin.ts`

- Purpose: privileged Supabase service-role client.
- Why it exists:
  - some operations cannot rely on normal RLS alone, such as reading private storage objects, inviting users, or resetting biometric data

### `lib/supabase/middleware.ts`

- Purpose: middleware-specific session refresh and anonymous blocking.
- Important logic:
  - retries `auth.getUser()`
  - redirects anonymous users away from protected route prefixes
  - gracefully handles missing Supabase env values by redirecting protected routes back to login

## 5. Authentication Module

### `features/auth/types.ts`

- Purpose: central source for role names.
- Exports:
  - `APP_ROLES`
  - `AppRole`
  - `isAppRole()`

### `features/auth/profile.ts`

- Purpose: load the current auth user plus the matching `profiles` row.
- Main output:
  - `{ user, profile }` or `null`
- Dependencies:
  - `lib/supabase/server.ts`

### `features/auth/guards.ts`

- Purpose: server-side route guard helper.
- Main function:
  - `requireCurrentProfile(allowedRoles?)`
- Behavior:
  - redirects to `/login` on missing session or invalid role

### `features/auth/client-auth.ts`

- Purpose: lightweight browser-side session/role loader.
- Used by:
  - login redirect check
  - client-only instructor pages
- Important behavior:
  - reads current session
  - loads `profiles.role`
  - returns `null` if the session is invalid or locked

### `features/auth/useClientRoleGuard.ts`

- Purpose: protect client-only pages where server guards are not enough.
- Output:
  - `{ isChecking, isAuthorized }`
- Used by:
  - `/instructor/enroll-student`
  - `/instructor/take-attendance`

### `features/auth/verify-current-password.ts`

- Purpose: verify the currently signed-in instructor password before unlocking kiosk mode.
- How it works:
  - fetches the current user email
  - re-authenticates with `signInWithPassword`

### Invite flow files

| File | What it does |
| --- | --- |
| `features/auth/InviteCallbackHandler.tsx` | Consumes invite codes, OTP hashes, or access tokens and creates a session |
| `features/auth/InviteSetupForm.tsx` | Lets the invited user set a password and redirects by role |
| `app/(auth)/invite-callback/page.tsx` | Thin route wrapper around the handler |
| `app/(auth)/invite-setup/page.tsx` | Thin route wrapper around the form |
| `features/auth/invite-onboarding.service.ts` | Server-side onboarding helper that currently is not used by the active page flow |

### Admin auth management

`features/auth/admin-user-management.service.ts` is one of the heaviest files in the repo.

Main responsibilities:

- fetch user lists with search and pagination
- backfill missing `university_id` values from auth metadata
- update roles
- delete non-admin users
- invite new users
- generate linear yearly university IDs in `YYYYNNNN` format
- redirect back with success and error messages

Important implementation details:

- student and instructor accounts require an enrollment year
- admin-created users are invited, not assigned a password directly
- the service retries invite creation/profile syncing to avoid metadata and timing issues
- admins cannot demote or delete themselves from this panel

## 6. Attendance Module

### `features/attendance/attendance.service.ts`

- Purpose: session lifecycle management.
- Main functions:
  - `startAttendanceSessionAction(courseId)`
  - `closeAttendanceSessionAction(sessionId)`
- Key logic:
  - verifies the actor is an instructor for the course unless they are an admin
  - reuses an open session if one already exists
  - creates a 4-hour attendance window for new sessions

### `features/attendance/attendance-read.service.ts`

- Purpose: normalize raw database rows into view-friendly attendance data.
- Main exports:
  - `buildAttendanceNote()`
  - `getAttendanceTiming()`
  - `buildNormalizedAttendanceSnapshot()`
  - `buildAttendanceDateGroups()`
- Why it matters:
  - this is the shared translation layer that turns sessions, enrollments, events, and profiles into present/late/absent views

### `features/attendance/student-attendance.service.ts`

- Purpose: student-side summary and history aggregation.
- Main functions:
  - `getStudentAttendanceHistoryData()`
  - `getStudentDashboardData()`
- Inputs:
  - optional `courseId`, `fromDate`, `toDate`
- Outputs:
  - course options
  - history rows
  - percentage summary cards

### `features/attendance/instructor-dashboard.ts`

- Purpose: build live instructor dashboard data.
- Returns:
  - assigned courses
  - active student count
  - session counts
  - open session count

### `features/attendance/instructor-records.service.ts`

- Purpose: instructor archive and reporting aggregator.
- Main functions:
  - `getInstructorCourseOptions()`
  - `getInstructorClassAttendanceData()`
  - `getInstructorReportData()`
  - `buildInstructorReportCsv()`
- Key responsibilities:
  - scope data to the instructor unless the actor is an admin
  - load related sessions, enrollments, events, student profiles, and instructor names
  - group attendance by date and session
  - calculate expected check-ins and attendance rate

### `features/attendance/useLockedScanMode.ts`

- Purpose: browser-only kiosk-mode behavior.
- Responsibilities:
  - request fullscreen
  - prevent casual navigation back
  - prevent accidental unload
  - toggle a body class for locked scanning

## 7. Courses Module

### `features/courses/course.service.ts`

- Purpose: course lookup and roster enforcement for instructors/admins.
- Main functions:
  - `getInstructorCoursesAction()`
  - `ensureStudentEnrolledInCourseAction()`
- Important behavior:
  - only course owners or admins can auto-enroll a student

### `features/courses/admin-course-assignment.service.ts`

- Purpose: admin-only course creation and instructor assignment workflow.
- Main functions:
  - `getAdminCourseAssignmentData()`
  - `assignInstructorToCourseAction()`
  - `createCourseAndAssignInstructorAction()`
  - `removeCourseAssignmentAction()`
  - `deleteCourseAction()`
- Key validations:
  - semester must match the selected course when assigning
  - duplicate instructor-course assignments are blocked
  - course codes are normalized to uppercase

## 8. Face Recognition Module

### `features/face/useFaceApi.ts`

- Purpose: browser-side face model loading and webcam control.
- Main outputs:
  - `videoRef`
  - `loadWebcam()`
  - `stopWebcam()`
  - `detectSingleFace()`
  - `detectFaces()`
- Important assumptions:
  - models are fetched from a public CDN
  - webcam access is available in the browser

### `features/face/face.service.ts`

- Purpose: secure server-side side of biometric enrollment and attendance.
- Main functions:
  - `getEnrollmentCandidateAction()`
  - `enrollStudentFaceAction()`
  - `getCourseFaceTemplatesAction()`
  - `markAttendanceAction()`
- Main responsibilities:
  - validate 8-digit university IDs
  - verify course ownership
  - verify student role and profile completeness
  - upload template JSON to private storage
  - mark attendance with duplicate protection and late status

### `features/face/admin-face-reset.service.ts`

- Purpose: admin biometric reset workflow.
- Main functions:
  - `getAdminFaceResetData()`
  - `resetFaceDataAction()`
- What reset does:
  - find the student by UUID, email, or university ID
  - delete the private storage object
  - delete the `face_templates` row
  - set `face_profiles.enrollment_status` to `reset_required`

## 9. Reports and Dashboard Aggregation

### `features/reports/admin-dashboard.service.ts`

- Purpose: compute admin dashboard numbers and recent event-style log cards.
- Current metrics:
  - total users
  - active courses
  - face data scans
  - pending reports, which in code means open attendance sessions

## 10. Page-Level Documentation

### Authentication pages

| File | Type | Key behavior |
| --- | --- | --- |
| `app/(auth)/login/page.tsx` | Client page | Login, cookie handoff, forgot-password email trigger |
| `app/(auth)/invite-callback/page.tsx` | Server wrapper | Passes query params into client invite resolver |
| `app/(auth)/invite-setup/page.tsx` | Server wrapper | Hosts the invite setup form |

### Student pages

| File | Type | Key behavior |
| --- | --- | --- |
| `app/(student)/student/dashboard/page.tsx` | Server page | Uses `getStudentDashboardData()` and renders summary cards |
| `app/(student)/student/attendance-history/page.tsx` | Server page | Uses `getStudentAttendanceHistoryData()` and renders history rows plus summary stats |

### Instructor pages

| File | Type | Key behavior |
| --- | --- | --- |
| `app/(instructor)/instructor/dashboard/page.tsx` | Server page | Overview, assigned courses, quick links |
| `app/(instructor)/instructor/enroll-student/page.tsx` | Client page | Webcam enrollment, roster-aware student validation |
| `app/(instructor)/instructor/take-attendance/page.tsx` | Client page | Live recognition loop, locked mode, attendance writes |
| `app/(instructor)/instructor/class-attendance/page.tsx` | Server page | Grouped attendance archive |
| `app/(instructor)/instructor/reports/page.tsx` | Server page | Filtered report generation and CSV export |

### Admin pages

| File | Type | Key behavior |
| --- | --- | --- |
| `app/(admin)/admin/dashboard/page.tsx` | Server page | System metrics, quick management links, recent events |
| `app/(admin)/admin/user-management/page.tsx` | Server page | Search, pagination, role changes, deletion |
| `app/(admin)/admin/user-management/create/page.tsx` | Server page | Invite form for new accounts |
| `app/(admin)/admin/course-assignment/page.tsx` | Server page | Course creation and instructor assignment |
| `app/(admin)/admin/reset-face-data/page.tsx` | Server page | Student lookup and biometric reset action |
| `app/(admin)/admin/reports/page.tsx` | Server page | Global report export view |

## 11. API Route Documentation

### `app/api/instructor/reports/route.ts`

- Method: `GET`
- Inputs: `courseId`, `fromDate`, `toDate`
- Output: CSV file download
- Dependency: `getInstructorReportData()`

### `app/api/admin/reports/route.ts`

- Method: `GET`
- Inputs: `courseId`, `fromDate`, `toDate`
- Output: CSV file download
- Note:
  - reuses the same report service as the instructor route, but admin access works because the underlying service accepts admin role context

## 12. Error Handling Patterns

The codebase mainly uses three patterns:

- throw `Error` inside service files for hard failures
- redirect with query-string error messages in admin form actions
- store client-facing error messages in local state inside interactive pages

Examples:

- login page shows validation and auth errors in a status message
- admin mutation services redirect back with `?error=` or `?success=`
- face enrollment and attendance pages keep scanner feedback in local state

## 13. Form Handling and Validation

- login validates email format and empty fields
- invite setup validates password length and confirmation match
- admin create user validates email, role, and enrollment year
- face enrollment validates an exact 8-digit university ID
- course assignment validates UUIDs, semester matching, and duplicates
- biometric reset validates lookup and profile ID before deletion

## 14. Notable Implementation Patterns

- server actions are used more heavily than REST APIs
- the browser does real-time face matching, not the database
- normalized attendance snapshots are reused across multiple pages
- route groups are used to separate role-specific UI areas cleanly
- CSS was refactored into route-specific stylesheets imported from one global entry

## 15. Code-Level Risks and Drift Worth Knowing

- `README.md` and `docs/testing-face-id.md` no longer fully match the live code
- `next.config.mjs` ignores TypeScript and ESLint build errors
- `playwright.config.ts` has a Windows-specific dev server startup command
- `sendAccountCredentialsEmail()` is present but unused
- `completeInviteOnboardingAction()` is present but the live invite setup page uses client-side completion instead
- the student history date range UI is not fully interactive even though the service supports date filtering
