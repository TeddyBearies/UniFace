import { getCurrentProfile } from "@/features/auth/profile";
import { createClient } from "@/lib/supabase/server";

type InstructorCourse = {
  id: string;
  code: string;
  title: string;
  semester: string;
  activeStudentCount: number;
  sessionCount: number;
  openSessionCount: number;
  lastSessionAt: string | null;
};

type InstructorDashboardData = {
  profileName: string;
  role: string;
  courses: InstructorCourse[];
  stats: {
    assignedCourses: number;
    activeStudents: number;
    totalSessions: number;
    openSessions: number;
  };
};

export async function getInstructorDashboardData(): Promise<InstructorDashboardData | null> {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile?.profile) {
    return null;
  }

  const supabase = createClient();
  const instructorId = currentProfile.profile.id;
  const role = currentProfile.profile.role;

  const { data: assignments, error: assignmentsError } = await supabase
    .from("course_instructors")
    .select(
      `
        course_id,
        courses (
          id,
          code,
          title,
          semester
        )
      `,
    )
    .eq("instructor_profile_id", instructorId);

  if (assignmentsError) {
    throw assignmentsError;
  }

  const normalizedCourses = (assignments ?? [])
    .map((assignment) => {
      const course = Array.isArray(assignment.courses)
        ? assignment.courses[0]
        : assignment.courses;

      if (!course) {
        return null;
      }

      return {
        id: course.id,
        code: course.code,
        title: course.title,
        semester: course.semester,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    code: string;
    title: string;
    semester: string;
  }>;

  if (normalizedCourses.length === 0) {
    return {
      profileName: currentProfile.profile.full_name || currentProfile.user.email || "Instructor",
      role,
      courses: [],
      stats: {
        assignedCourses: 0,
        activeStudents: 0,
        totalSessions: 0,
        openSessions: 0,
      },
    };
  }

  const courseIds = normalizedCourses.map((course) => course.id);

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("course_enrollments")
    .select("course_id")
    .in("course_id", courseIds)
    .eq("status", "active");

  if (enrollmentsError) {
    throw enrollmentsError;
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from("attendance_sessions")
    .select("course_id, status, starts_at")
    .in("course_id", courseIds);

  if (sessionsError) {
    throw sessionsError;
  }

  const studentCounts = new Map<string, number>();
  const sessionSummaries = new Map<
    string,
    { total: number; open: number; lastSessionAt: string | null }
  >();

  for (const enrollment of enrollments ?? []) {
    studentCounts.set(
      enrollment.course_id,
      (studentCounts.get(enrollment.course_id) ?? 0) + 1,
    );
  }

  for (const session of sessions ?? []) {
    const currentSummary = sessionSummaries.get(session.course_id) ?? {
      total: 0,
      open: 0,
      lastSessionAt: null,
    };

    currentSummary.total += 1;

    if (session.status === "open") {
      currentSummary.open += 1;
    }

    if (!currentSummary.lastSessionAt || session.starts_at > currentSummary.lastSessionAt) {
      currentSummary.lastSessionAt = session.starts_at;
    }

    sessionSummaries.set(session.course_id, currentSummary);
  }

  const courses = normalizedCourses.map((course) => {
    const summary = sessionSummaries.get(course.id);

    return {
      ...course,
      activeStudentCount: studentCounts.get(course.id) ?? 0,
      sessionCount: summary?.total ?? 0,
      openSessionCount: summary?.open ?? 0,
      lastSessionAt: summary?.lastSessionAt ?? null,
    };
  });

  return {
    profileName: currentProfile.profile.full_name || currentProfile.user.email || "Instructor",
    role,
    courses,
    stats: {
      assignedCourses: courses.length,
      activeStudents: Array.from(studentCounts.values()).reduce(
        (total, count) => total + count,
        0,
      ),
      totalSessions: Array.from(sessionSummaries.values()).reduce(
        (total, summary) => total + summary.total,
        0,
      ),
      openSessions: Array.from(sessionSummaries.values()).reduce(
        (total, summary) => total + summary.open,
        0,
      ),
    },
  };
}
