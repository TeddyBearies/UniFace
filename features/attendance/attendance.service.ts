"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type AttendanceActor = {
  userId: string;
  role: string;
};

type SessionAttendanceState = {
  presentStudentIds: string[];
};

async function getAttendanceActor(
  supabase: ReturnType<typeof createClient>,
): Promise<AttendanceActor> {
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

  return {
    userId: user.id,
    role: profile.role,
  };
}

async function requireInstructorForCourse(
  supabase: ReturnType<typeof createClient>,
  courseId: string,
) {
  const actor = await getAttendanceActor(supabase);

  if (actor.role !== "admin") {
    const { data: isInstructor } = await supabase.rpc("is_instructor_for_course", {
      course_id: courseId,
    });

    if (!isInstructor) {
      throw new Error("Not an instructor for this course.");
    }
  }

  return actor;
}

async function getSessionAttendanceState(
  supabase: ReturnType<typeof createClient>,
  sessionId: string,
): Promise<SessionAttendanceState> {
  const { data: existingEvents, error } = await supabase
    .from("attendance_events")
    .select("student_profile_id")
    .eq("attendance_session_id", sessionId);

  if (error) {
    throw new Error("Failed to load current attendance records.");
  }

  return {
    presentStudentIds: (existingEvents ?? []).map((event) => event.student_profile_id),
  };
}

/**
 * Ensures an active open attendance session exists for the given course for the
 * current instructor. If not, it creates a new one.
 */
export async function startAttendanceSessionAction(courseId: string) {
  const normalizedCourseId = courseId.trim();
  if (!normalizedCourseId) {
    throw new Error("Please select a course.");
  }

  const supabase = createClient();
  const actor = await requireInstructorForCourse(supabase, normalizedCourseId);

  const { data: existingSession, error: existingSessionError } = await supabase
    .from("attendance_sessions")
    .select("id")
    .eq("course_id", normalizedCourseId)
    .eq("status", "open")
    .eq("created_by_profile_id", actor.userId)
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingSessionError) {
    console.error("Failed to check existing sessions:", existingSessionError);
    throw new Error("Failed to verify existing session.");
  }

  if (existingSession) {
    const sessionState = await getSessionAttendanceState(supabase, existingSession.id);

    return {
      sessionId: existingSession.id,
      isNew: false,
      ...sessionState,
    };
  }

  const startsAt = new Date();
  const endsAt = new Date();
  endsAt.setHours(endsAt.getHours() + 4);

  const { data: newSession, error } = await supabase
    .from("attendance_sessions")
    .insert({
      course_id: normalizedCourseId,
      created_by_profile_id: actor.userId,
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

  revalidatePath("/instructor/dashboard");
  revalidatePath("/instructor/class-attendance");
  revalidatePath("/instructor/reports");
  revalidatePath("/admin/reports");

  return {
    sessionId: newSession.id,
    isNew: true,
    presentStudentIds: [],
  };
}

export async function closeAttendanceSessionAction(sessionId: string) {
  const normalizedSessionId = sessionId.trim();
  if (!normalizedSessionId) {
    throw new Error("Attendance session is required.");
  }

  const supabase = createClient();
  const actor = await getAttendanceActor(supabase);

  if (actor.role !== "instructor" && actor.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const { data: session, error: sessionError } = await supabase
    .from("attendance_sessions")
    .select("id, created_by_profile_id, status")
    .eq("id", normalizedSessionId)
    .maybeSingle();

  if (sessionError || !session) {
    throw new Error("Attendance session not found.");
  }

  if (actor.role !== "admin" && session.created_by_profile_id !== actor.userId) {
    throw new Error("You can only close sessions you started.");
  }

  if (session.status !== "open") {
    return { success: true, closedCount: 0 };
  }

  const { data: closedSessions, error } = await supabase
    .from("attendance_sessions")
    .update({ status: "closed" })
    .eq("id", normalizedSessionId)
    .select("id");

  if (error) {
    console.error("Failed to close session:", error);
    throw new Error("Could not close session.");
  }

  revalidatePath("/instructor/dashboard");
  revalidatePath("/instructor/class-attendance");
  revalidatePath("/instructor/reports");
  revalidatePath("/admin/reports");
  
  return { success: true, closedCount: closedSessions?.length || 0 };
}
