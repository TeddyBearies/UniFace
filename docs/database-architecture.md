# Database Architecture

## Current state

As of 2026-03-24, the repository does not contain a live database client, SQL query code, schema, or migrations.

That means there is no active SQL injection risk in the codebase today.

It also means this is the best time to lock in the database architecture before backend code starts spreading across pages and features.

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

- `id`
- `auth_user_id`
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
- `template_version`
- `embedding_ref`
- `enrollment_status`
- `last_enrolled_at`
- `created_at`
- `updated_at`

Notes:

- Keep raw face files separate from relational records.
- If images are stored, save them in a private bucket and keep only object references in the database.
- If embeddings are stored in Postgres, keep the table tightly restricted and avoid exposing it directly to browser clients.

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

1. Add Supabase clients under `lib/supabase/`.
2. Implement Auth and role-aware profile loading.
3. Create migrations for `profiles`, `courses`, and enrollment tables.
4. Add RLS before connecting any page to live data.
5. Add secure face-enrollment storage and server-only reset flows last.
