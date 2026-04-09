# Testing Facial Recognition Integration

This guide provides a step-by-step walkthrough to test the biometric student enrollment and the attendance scanning functionalities locally.

## Prerequisite: Database Verification

Since the application writes and verifies sensitive data via Supabase Server Actions, you need a valid database state.

1. **Verify Supabase Connection**: Ensure your `.env.local` contains valid credentials and the Next.js development server is running (`npm run dev`).
2. **Identify a Student UUID**: Log in to your Supabase studio (or use an SQL query) and locate a row in the `public.profiles` table with the role `student`. Copy that exact `id` (UUID). 
   *(Note: The face components verify that the person enrolling actually maps to a row in `face_profiles`, which triggers when a `profile` exists).*
3. **Establish Enrollment Linkage**: If you are taking attendance for a specific course, confirm that the referenced student is enrolled in a course under `public.course_enrollments` linked to your instructor profile. *(If you just want to test face scanning without RLS errors, ensure you are logged in as an Instructor or Admin in your browser).*

## Step 1: Enrolling a Face

1. **Navigate to the Enrollment Page**:
   Open your browser and navigate to the local environment:
   `http://localhost:3000/instructor/enroll-student`
2. **Fill in Details**:
   - In the **Student Profile ID** field, paste the Student UUID you copied from Supabase.
   - Enter a mock student name.
   - Choose a course/group.
3. **Activate Camera**:
   - Click the **Start Enrollment Scan** button. (Your browser will ask for webcam permissions; allow them).
   - You should see the video feed. Wait a moment for the AI models to load and initialize over the network.
4. **Capture & Save**:
   - Ensure your face is clearly visible.
   - Click **Capture Face**. The system will freeze the frame and analyze it. 
   - Once it informs you that the face was captured, click the **Save Face Data** button.
   - A success message will appear indicating the biometric data securely inserted into your Supabase `face-templates` bucket!

## Step 2: Testing Live Attendance

1. **Navigate to the Attendance Scanner**:
   Now, go to:
   `http://localhost:3000/instructor/take-attendance`
2. **Configure Session**:
   - Select the mock active course from the drop-down. *(Note if you have actual courses configured in Supabase, select one that the enrolled student is assigned to).*
   - Click **Start Session**.
   - The UI will say "Fetching face templates for course..." (loading descriptors from Supabase).
   - The webcam will turn on.
3. **Live Recognition**:
   - The camera component will begin taking samples several times a second securely in the browser. 
   - Look directly into the camera. 
   - Because you were just enrolled, the AI model evaluates the Euclidean distance of your live face against the stored template. 
   - Instantly, the `Present:` count should increase, and the `Last scan:` text should update to show the student's name!

## Troubleshooting

- **"Type Error" or "Unauthorized" on Save**: Check Supabase permissions. Make sure that you are authenticated properly as an Instructor using the Next.js app session or that your RLS policies match your current login.
- **"Models Failed to Load"**: This means the browser couldn't stream `face-api.js` weights from jsDelivr. Disable proxy blockers, ad-blockers, or VPNs if they are blocking CDN access.
- **Missing Student ID**: If you enter a fake UUID not inside `public.profiles`, the server action will halt and inform you that no `face_profile` was found. Ensure you test against a valid database UUID.
