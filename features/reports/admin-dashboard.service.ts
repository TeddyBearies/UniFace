import { requireCurrentProfile } from "@/features/auth/guards";
import { createClient } from "@/lib/supabase/server";

export type AdminDashboardData = {
  profileLabel: string;
  stats: {
    totalUsers: number;
    activeCourses: number;
    faceDataScans: number;
    pendingReports: number;
  };
  logs: Array<{
    title: string;
    time: string;
    icon: "info" | "sync" | "shield";
  }>;
};

function formatLogDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const currentProfile = await requireCurrentProfile(["admin"]);
  const supabase = createClient();

  const [totalUsersResult, activeCoursesResult, faceDataScansResult, pendingReportsResult] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("attendance_events").select("id", { count: "exact", head: true }),
      supabase
        .from("attendance_sessions")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
    ]);

  if (totalUsersResult.error) {
    throw totalUsersResult.error;
  }

  if (activeCoursesResult.error) {
    throw activeCoursesResult.error;
  }

  if (faceDataScansResult.error) {
    throw faceDataScansResult.error;
  }

  if (pendingReportsResult.error) {
    throw pendingReportsResult.error;
  }

  const [recentUsersResult, recentAssignmentsResult, recentFaceProfilesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("course_instructors")
      .select("created_at, profiles(full_name), courses(code)")
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("face_profiles")
      .select("updated_at, enrollment_status, profiles(full_name)")
      .order("updated_at", { ascending: false })
      .limit(1),
  ]);

  if (recentUsersResult.error) {
    throw recentUsersResult.error;
  }

  if (recentAssignmentsResult.error) {
    throw recentAssignmentsResult.error;
  }

  if (recentFaceProfilesResult.error) {
    throw recentFaceProfilesResult.error;
  }

  const logs: AdminDashboardData["logs"] = [];

  const recentUser = recentUsersResult.data?.[0];
  if (recentUser?.created_at) {
    logs.push({
      title: `New user added: ${recentUser.full_name || recentUser.email || "Unknown user"}`,
      time: formatLogDate(recentUser.created_at),
      icon: "info",
    });
  }

  const recentAssignment = recentAssignmentsResult.data?.[0];
  const assignmentProfile = Array.isArray(recentAssignment?.profiles)
    ? recentAssignment?.profiles[0]
    : recentAssignment?.profiles;
  const assignmentCourse = Array.isArray(recentAssignment?.courses)
    ? recentAssignment?.courses[0]
    : recentAssignment?.courses;

  if (recentAssignment?.created_at) {
    logs.push({
      title: `Course assignment updated: ${assignmentProfile?.full_name || "Instructor"} → ${
        assignmentCourse?.code || "Course"
      }`,
      time: formatLogDate(recentAssignment.created_at),
      icon: "sync",
    });
  }

  const recentFaceProfile = recentFaceProfilesResult.data?.[0];
  const faceProfileOwner = Array.isArray(recentFaceProfile?.profiles)
    ? recentFaceProfile?.profiles[0]
    : recentFaceProfile?.profiles;

  if (recentFaceProfile?.updated_at) {
    logs.push({
      title: `Biometric status updated for ${faceProfileOwner?.full_name || "student"} (${
        recentFaceProfile.enrollment_status
      })`,
      time: formatLogDate(recentFaceProfile.updated_at),
      icon: "shield",
    });
  }

  if (logs.length === 0) {
    logs.push({
      title: "System initialized and awaiting activity",
      time: "No recent events",
      icon: "info",
    });
  }

  return {
    profileLabel:
      currentProfile.profile.full_name || currentProfile.user.email || "Admin",
    stats: {
      totalUsers: totalUsersResult.count || 0,
      activeCourses: activeCoursesResult.count || 0,
      faceDataScans: faceDataScansResult.count || 0,
      pendingReports: pendingReportsResult.count || 0,
    },
    logs: logs.slice(0, 3),
  };
}
