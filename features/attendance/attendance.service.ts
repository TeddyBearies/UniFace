"use server";

import { createClient } from "@/lib/supabase/server";

async function requireInstructorForCourse(supabase: ReturnType<typeof createClient>, courseId: string) {
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
    const { data: isInstructor } = await supabase.rpc("is_instructor_for_course", {
      course_id: courseId,
    });

    if (!isInstructor) {
      throw new Error("Not an instructor for this course.");
    }
  }

  return user;
}

/**
 * Ensures an active open attendance session exists for the given course today.
 * If not, it creates a new one.
 */
export async function startAttendanceSessionAction(courseId: string) {
  const normalizedCourseId = courseId.trim();
  if (!normalizedCourseId) {
    throw new Error("Please select a course.");
  }

  const supabase = createClient();
  const user = await requireInstructorForCourse(supabase, normalizedCourseId);

  // 1. Verify if an open session already exists
  const { data: existingSession, error: existingSessionError } = await supabase
    .from("attendance_sessions")
    .select("id")
    .eq("course_id", normalizedCourseId)
    .eq("status", "open")
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSessionError) {
    console.error("Failed to check existing sessions:", existingSessionError);
    throw new Error("Failed to verify existing session.");
  }

  if (existingSession) {
    return { sessionId: existingSession.id, isNew: false };
  }

  // 2. Insert a new session (the DB policy ensures the user is an instructor)
  const startsAt = new Date();
  const endsAt = new Date();
  endsAt.setHours(endsAt.getHours() + 4); // default 4 hour window for session safety
  
  const { data: newSession, error } = await supabase
    .from("attendance_sessions")
    .insert({
      course_id: normalizedCourseId,
      created_by_profile_id: user.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "open",
    })
    .select("id")
    .single();

  if (error || !newSession) {
    console.error("Failed to create attendance session:", error);
    throw new Error("Could not start a new attendance session. Ensure you are an instructor for this course.");
  }

  return { sessionId: newSession.id, isNew: true };
}

export async function closeAttendanceSessionAction(courseId: string) {
  const normalizedCourseId = courseId.trim();
  if (!normalizedCourseId) {
    throw new Error("Please select a course.");
  }

  const supabase = createClient();
  const user = await requireInstructorForCourse(supabase, normalizedCourseId);

  const { data: closedSessions, error } = await supabase
    .from("attendance_sessions")
    .update({ status: "closed" })
    .eq("course_id", normalizedCourseId)
    .eq("status", "open")
    .eq("created_by_profile_id", user.id)
    .select("id");

  if (error) {
    console.error("Failed to close session:", error);
    throw new Error("Could not close session.");
  }
  
  return { success: true, closedCount: closedSessions?.length || 0 };
}
