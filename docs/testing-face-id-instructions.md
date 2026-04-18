# FaceID Testing Instructions

This guide is the current testing reference for the biometric enrollment and live attendance flow in Haga FaceID. It matches the code that is in the repository now, not the older UUID-based testing flow.

## What You Are Testing

There are two connected biometric workflows in this project:

1. **Face enrollment**
   - An instructor enters a student's 8-digit university ID.
   - The app verifies that the student account exists and has a `face_profile`.
   - The browser captures one face descriptor and saves it through a server action.

2. **Live attendance**
   - An instructor starts a real attendance session for one assigned course.
   - The app loads face templates for students enrolled in that course.
   - The browser compares live webcam detections against those stored templates.
   - A successful match creates one attendance event in the database.

## Before You Start

Make sure these pieces are ready first.

### 1. Environment variables

This repository does **not** currently include a checked-in `.env.example`, so set the variables manually in `.env.local`.

Minimum required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
```

Accepted fallbacks in the current code:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Run the app

```bash
npm run dev
```

Then open:

- `http://localhost:3000/login`

### 3. Confirm database setup

The biometric flow depends on the Supabase schema being applied.

You should already have:

- `profiles`
- `face_profiles`
- `face_templates`
- `courses`
- `course_instructors`
- `course_enrollments`
- `attendance_sessions`
- `attendance_events`
- private storage bucket: `face-templates`

### 4. Prepare test accounts

You will usually need:

- one **instructor** account that can sign in
- one **student** account with:
  - `role = student`
  - an **8-digit** `university_id`
  - a non-empty `full_name`
- one course assigned to that instructor

### 5. Recommended database checks

Use Supabase Studio or SQL to confirm the student is in a good state for testing.

Example query:

```sql
select
  p.id,
  p.full_name,
  p.email,
  p.university_id,
  p.role,
  fp.id as face_profile_id,
  fp.enrollment_status,
  fp.last_enrolled_at
from public.profiles p
left join public.face_profiles fp
  on fp.profile_id = p.id
where p.role = 'student'
order by p.created_at desc;
```

For a brand-new enrollment test, the easiest student state is:

- `enrollment_status = not_started`

For a retest after clearing data:

- `enrollment_status = reset_required`

If the student already has:

- `enrollment_status = complete`

then the enrollment page will not save a new face template unless you reset that student first.

## Recommended Test Setup

For the smoothest full test, prepare this situation:

- Instructor account is assigned to at least one course.
- Student account has a valid 8-digit `university_id`.
- Student has `full_name` filled in.
- Student is either:
  - already enrolled in that course, or
  - not enrolled yet, but you plan to pick a course during enrollment so the app can auto-add the student to the roster when saving face data.

You can verify instructor-course assignment with a query like this:

```sql
select
  c.code,
  c.title,
  c.semester,
  ci.instructor_profile_id
from public.course_instructors ci
join public.courses c
  on c.id = ci.course_id
order by c.code;
```

## Part 1: Test Face Enrollment

### Goal

Save one face descriptor for a student and confirm the face template is linked correctly.

### Steps

1. Sign in as an instructor.
2. Open:
   - `http://localhost:3000/instructor/enroll-student`
3. Wait for the page to finish loading AI models.
   - The page may briefly show `Loading AI Models...`
4. Fill in:
   - **Student ID**: the student's **8-digit university ID**
   - **Student Name**: must match the real profile name closely enough to pass the page check
   - **Course / Group (Optional)**: choose one of the instructor's assigned courses if you want the student tied to a course immediately
5. Click **Start Enrollment Scan**.
6. Allow webcam access if the browser asks.
7. Position one face clearly in the frame.
8. Click **Capture Face and Save**.
9. After a successful capture, click **Save Face Data**.

### What success looks like

You should see a success message similar to:

- `Student face enrolled securely.`
- or `Student face enrolled securely and added to the selected course roster.`

### What the app does behind the scenes

The current code will:

- look up the student by `profiles.university_id`
- verify that the student account belongs to a real `student` profile
- verify that the student has a linked `face_profile`
- capture one descriptor in the browser with `face-api.js`
- upload that descriptor as JSON into the private `face-templates` bucket
- upsert a row in `public.face_templates`
- update `public.face_profiles.enrollment_status` to `complete`
- optionally auto-enroll the student in the selected course

### Quick verification queries

Check the student's face status:

```sql
select
  p.full_name,
  p.university_id,
  fp.enrollment_status,
  fp.last_enrolled_at,
  ft.storage_object_path,
  ft.template_version
from public.profiles p
join public.face_profiles fp
  on fp.profile_id = p.id
left join public.face_templates ft
  on ft.face_profile_id = fp.id
where p.university_id = '20260001';
```

If you selected a course and expected auto-enrollment:

```sql
select
  c.code,
  c.title,
  ce.status,
  p.university_id
from public.course_enrollments ce
join public.courses c
  on c.id = ce.course_id
join public.profiles p
  on p.id = ce.student_profile_id
where p.university_id = '20260001';
```

## Part 2: Test Live Attendance

### Goal

Use the enrolled face template to mark one attendance event during a real attendance session.

### Steps

1. Stay signed in as the same instructor.
2. Open:
   - `http://localhost:3000/instructor/take-attendance`
3. Select a course from the dropdown.
   - This should be a course assigned to the signed-in instructor.
   - The enrolled student should be actively enrolled in this course.
4. Click **Start Session**.

### What happens when the session starts

The current app will:

- load face templates for active students in the selected course
- create or reuse an open attendance session in `attendance_sessions`
- start the webcam
- begin a browser-side recognition loop

### What success looks like

When the enrolled student looks into the camera:

- the page should show a success or late status
- `Present` or `Late` counts should update
- `Last scan` should update
- one row should be added to `attendance_events`

### Database verification

Check the newest session:

```sql
select
  s.id,
  s.course_id,
  s.created_by_profile_id,
  s.starts_at,
  s.ends_at,
  s.status
from public.attendance_sessions s
order by s.created_at desc
limit 5;
```

Check the newest attendance event:

```sql
select
  ae.id,
  ae.attendance_session_id,
  p.full_name,
  p.university_id,
  ae.matched_by,
  ae.confidence_score,
  ae.recorded_at
from public.attendance_events ae
join public.profiles p
  on p.id = ae.student_profile_id
order by ae.created_at desc
limit 10;
```

## Part 3: Test Late Attendance

If you want to verify the late status logic:

1. Start an attendance session.
2. Wait more than **15 minutes** after the session's `starts_at`.
3. Let the student scan.

Expected result:

- the UI should show a `Late` result
- the event still writes successfully
- the status is derived later from the gap between `recorded_at` and `starts_at`

## Part 4: Test Duplicate Protection

The scanner runs in a loop, so duplicate protection is important.

### Steps

1. Start a session.
2. Let the same student get recognized once.
3. Keep the same student in front of the camera.

Expected result:

- the app should not insert multiple attendance rows for the same session and student
- the UI may show that the student was already recorded

This is protected in two places:

- application logic checks for an existing row first
- the database also has a unique constraint on `(attendance_session_id, student_profile_id)`

## Part 5: Test Locked Scan Mode

The attendance page has a locked tablet mode for classroom use.

### Steps

1. Open `/instructor/take-attendance`
2. Click **Enter Locked Tablet Mode**
3. Try pressing `Escape`
4. Try exiting the page

Expected result:

- the page should resist casual exit
- unlocking should require the instructor's current password

### Important note

Unlocking uses the signed-in instructor's real password through Supabase re-authentication. It does **not** use a separate local kiosk PIN.

## Part 6: Reset and Retest Biometric Data

If you want to run enrollment again for the same student:

1. Sign in as an admin.
2. Open:
   - `http://localhost:3000/admin/reset-face-data`
3. Search using one of:
   - the student's 8-digit university ID
   - email
   - profile UUID
4. Click **Reset Face Data**

Expected result:

- storage object is removed from the private bucket
- `face_templates` row is deleted
- `face_profiles.enrollment_status` becomes `reset_required`

After that, you can go back to the instructor enrollment page and test again.

## Troubleshooting

### "No student found with that 8-digit University ID."

Check that:

- the value is exactly 8 digits
- the matching row exists in `public.profiles`
- the row belongs to a `student`

### "This student profile is missing a full name."

The enrollment flow currently requires `profiles.full_name` to be populated because the UI and attendance history depend on it later.

### "This student already has enrolled face data."

That student already has `face_profiles.enrollment_status = complete`.

Options:

- reset that student's face data from the admin panel
- use a different student account for testing

### "Not an instructor for the selected course."

The signed-in instructor is not assigned to that course in `course_instructors`.

### "Students are enrolled in this course, but none of them have completed face enrollment yet."

This means:

- the roster exists
- but no student in that course currently has a usable face template

### Camera opens but no attendance is recorded

Check:

- the enrolled student is in the selected course roster
- the student still has `full_name` and `university_id`
- the face template row exists
- the live face is clear enough for a confident match

### Models do not load

The browser needs network access to the face model files loaded from jsDelivr in `features/face/useFaceApi.ts`.

### You get redirected back to `/login`

Check:

- Supabase env variables are correct
- the browser session is still active
- the user really has the expected role in `profiles.role`

## Short Practical Checklist

If you just want the fastest successful end-to-end test, use this checklist:

- instructor account can log in
- instructor has at least one assigned course
- student has a valid 8-digit `university_id`
- student has `full_name`
- student has `face_profile`
- student does not already have `enrollment_status = complete`
- enroll the student from `/instructor/enroll-student`
- start a session from `/instructor/take-attendance`
- scan the same face again to create an attendance event

If all of that works, the core FaceID pipeline is working end to end.
