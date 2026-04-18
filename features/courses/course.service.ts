"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getInstructorCourseOptions } from "@/features/attendance/instructor-records.service";

export async function getInstructorCoursesAction() {
  try {
    return await getInstructorCourseOptions();
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    throw new Error("Failed to load your assigned courses.");
  }
}

export async function ensureStudentEnrolledInCourseAction(
  courseId: string,
  studentProfileId: string,
) {
  const normalizedCourseId = courseId.trim();
  const normalizedStudentProfileId = studentProfileId.trim();

  if (!normalizedCourseId || !normalizedStudentProfileId) {
    throw new Error("Course and student are required.");
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error("Unauthorized");
  }

  if (profile.role !== "admin") {
    const { data: isInstructor, error: instructorError } = await supabase.rpc(
      "is_instructor_for_course",
      {
        course_id: normalizedCourseId,
      },
    );

    if (instructorError) {
      throw new Error("Failed to verify course access.");
    }

    if (!isInstructor) {
      throw new Error("Not an instructor for the selected course.");
    }
  }

  // We use the admin client for the actual upsert because normal instructor RLS
  // access is read-focused; the write is still protected by the explicit checks above.
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("course_enrollments")
    .upsert(
      {
        course_id: normalizedCourseId,
        student_profile_id: normalizedStudentProfileId,
        status: "active",
      },
      {
        onConflict: "course_id,student_profile_id",
      },
    )
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error("Failed to add the student to the selected course.");
  }

  revalidatePath("/instructor/dashboard");
  revalidatePath("/instructor/take-attendance");
  revalidatePath("/instructor/class-attendance");
  revalidatePath("/instructor/reports");
  revalidatePath("/student/dashboard");
  revalidatePath("/student/attendance-history");
  revalidatePath("/admin/reports");

  return { success: true };
}
