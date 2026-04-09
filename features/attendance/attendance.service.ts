"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Ensures an active open attendance session exists for the given course today.
 * If not, it creates a new one.
 */
export async function startAttendanceSessionAction(courseId: string) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Verify if an open session already exists
  const { data: existingSession } = await supabase
    .from("attendance_sessions")
    .select("id")
    .eq("course_id", courseId)
    .eq("status", "open")
    .single();

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
      course_id: courseId,
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
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("attendance_sessions")
    .update({ status: "closed" })
    .eq("course_id", courseId)
    .eq("status", "open")
    .eq("created_by_profile_id", user.id);

  if (error) {
    console.error("Failed to close session:", error);
    throw new Error("Could not close session.");
  }
  
  return { success: true };
}
