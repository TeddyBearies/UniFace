# Database Rules
Haga-FaceID database safety standards.

These rules exist to keep the app safe from SQL injection, privilege leaks, and accidental biometric data exposure.

## Non-negotiables

1. No raw SQL string interpolation in app code.
2. No database access from `app/` pages except through approved helpers or feature services.
3. No server secret may be imported into client code.
4. Every exposed table must use Row Level Security (RLS).
5. Biometric data must be treated as sensitive data by default.

## Query safety

- Prefer the Supabase query builder in app code for CRUD work.
- If raw SQL is ever required, keep it inside `supabase/migrations/` or tightly scoped server-only code.
- Never build SQL with template strings, string concatenation, or user-supplied column names.
- If dynamic filtering or sorting is needed, map user input to a fixed allowlist of known columns and directions before it reaches the database.
- Validate payloads before insert or update so malformed input is rejected before the database call.

## Access model

- Browser code may use only `NEXT_PUBLIC_SUPABASE_URL` and the publishable key.
- Elevated keys such as `SUPABASE_SECRET_KEY` are server-only and must never reach the browser.
- Admin actions, face enrollment, reset-face-data flows, and reporting exports should run through server-only code.
- Authorization must come from verified auth claims and database policies, not from client-supplied role flags.

## Schema rules

- Use UUID primary keys unless there is a strong reason not to.
- Add `created_at` and `updated_at` timestamps to product tables.
- Use foreign keys for enrollments, attendance records, course assignments, and face-profile ownership.
- Prefer soft-deleting biometric references only if audit needs require it. Otherwise delete them fully.
- Keep sensitive or internal-only tables out of broadly exposed schemas where possible.

## Face data rules

- Do not store raw face images unless the feature explicitly requires retention.
- If raw images are required, keep them in a private bucket with strict retention and server-mediated access.
- Store only the minimum face template or embedding data needed for matching.
- Face templates, embeddings, and reset operations should be writable only by trusted server paths.
- Student-facing clients should never query other students' face data, directly or indirectly.

## Recommended service boundaries

- `lib/supabase/`: shared client creation for browser and server contexts.
- `features/auth/`: sign-in, session, and role lookup.
- `features/courses/`: course assignment and enrollment reads/writes.
- `features/attendance/`: attendance sessions, check-in events, reports.
- `features/face/`: enrollment status, secure upload flow, matching pipeline hooks.

## Release gate

Before merging any database-related feature, verify:

1. No user input is used to compose SQL directly.
2. RLS is enabled and tested for each new exposed table.
3. Elevated keys are used only in server code.
4. The feature still works when a user tries to access another role's data.
5. Any biometric data path has explicit retention and deletion rules.
