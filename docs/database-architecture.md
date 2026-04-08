# Database Architecture

## Current state

As of 2026-03-26, the repository now has:

- shared Supabase client helpers under `lib/supabase/`
- a first SQL migration under `supabase/migrations/`
- a real login flow wired to Supabase email/password auth

There is still no raw SQL in app code, so the main SQL injection surface remains limited to controlled migration SQL instead of runtime query construction.

## Recommendation

Supabase is a strong fit for this project right now.

Why it fits this stage:

- The app is still early, so we can introduce one consistent auth + database + storage model without doing a painful migration later.
- The product already has clear role boundaries: student, instructor, and admin. Supabase Auth plus Postgres RLS maps cleanly to that model.
- Attendance systems need relational data. Postgres is a better fit than a document database for courses, enrollments, sessions, and reports.
- Face-recognition workflows usually need private file storage and secure server-side actions. Supabase covers both with Storage and server-side keys.

## Recommended stack split

- Auth: Supabase Auth
- App database: Supabase Postgres
- File storage: Supabase Storage private buckets
- Schema management: `supabase/migrations/`
- App access pattern: Supabase query builder in feature services, not direct page-level queries

## Initial schema outline

### `profiles`

- `id` (same UUID as `auth.users.id`)
- `email`
- `full_name`
- `role` (`student`, `instructor`, `admin`)
- `created_at`
- `updated_at`

### `courses`

- `id`
- `code`
- `title`
- `semester`
- `created_at`
- `updated_at`

### `course_instructors`

- `id`
- `course_id`
- `instructor_profile_id`
- `created_at`

### `course_enrollments`

- `id`
- `course_id`
- `student_profile_id`
- `status`
- `created_at`

### `attendance_sessions`

- `id`
- `course_id`
- `created_by_profile_id`
- `starts_at`
- `ends_at`
- `status`
- `created_at`

### `attendance_events`

- `id`
- `attendance_session_id`
- `student_profile_id`
- `matched_by`
- `confidence_score`
- `recorded_at`
- `created_at`

### `face_profiles`

- `id`
- `profile_id`
- `enrollment_status`
- `last_enrolled_at`
- `created_at`
- `updated_at`

### `face_templates`

- `id`
- `face_profile_id`
- `storage_object_path`
- `template_version`
- `created_at`
- `updated_at`

Notes:

- Keep raw face files separate from relational records.
- If images are stored, save them in a private bucket and keep only object references in the database.
- If embeddings are stored in Postgres, keep the table tightly restricted and avoid exposing it directly to browser clients.
- The current repo migration creates a private `face-templates` bucket for admin-managed template files.

## Security baseline

1. Enable RLS on every table in exposed schemas.
2. Write policies per role instead of trusting client UI.
3. Keep all elevated operations server-only.
4. Never compose SQL from user input.
5. Treat face data as restricted data with explicit retention rules.

## When Supabase is the wrong choice

Supabase is a weaker fit if any of these become true:

- You need fully custom database hosting from day one.
- You plan to run heavy face-matching compute inside the database itself.
- You expect complex multi-region data residency requirements immediately.
- You want to avoid a managed backend platform entirely.

For the current repo state, none of those concerns are visible yet.

## Suggested next implementation order

1. Run the initial migration in your Supabase project.
2. Create a first user through Supabase Auth.
3. Promote instructor and admin accounts by updating `profiles.role`.
4. Start connecting pages to role-aware profile loading.
5. Add secure face-enrollment storage and reset flows last.
