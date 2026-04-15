import { createClient } from "@/lib/supabase/server";
import { requireCurrentProfile } from "@/features/auth/guards";
import {
  buildAttendanceNote,
  buildNormalizedAttendanceSnapshot,
  getAttendanceTiming,
} from "@/features/attendance/attendance-read.service";

type StudentAttendanceFilters = {
  courseId?: string;
  fromDate?: string;
  toDate?: string;
};

export type StudentAttendanceRecord = {
  id: string;
  sessionStartsAt: string;
  recordedAt: string | null;
  courseCode: string;
  courseTitle: string;
  status: "Present" | "Late" | "Absent";
  notes: string;
};

export type StudentCourseOption = {
  id: string;
  code: string;
  title: string;
};

export type StudentAttendanceSummary = {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  presentRate: number;
  absentRate: number;
};

export type StudentAttendanceHistoryData = {
  profileName: string;
  courses: StudentCourseOption[];
  selectedCourseId: string;
  selectedFromDate: string;
  selectedToDate: string;
  records: StudentAttendanceRecord[];
  summary: StudentAttendanceSummary;
};

function toStartOfDayIso(dateValue: string) {
  return `${dateValue}T00:00:00.000Z`;
}

function toEndOfDayIso(dateValue: string) {
  return `${dateValue}T23:59:59.999Z`;
}

export async function getStudentAttendanceHistoryData(
  filters: StudentAttendanceFilters = {},
): Promise<StudentAttendanceHistoryData> {
  const currentProfile = await requireCurrentProfile(["student", "admin"]);
  const supabase = createClient();

  const studentId = currentProfile.profile.id;
  const profileName =
    currentProfile.profile.full_name || currentProfile.user.email || "Student";

  const { data: enrollments, error: enrollmentError } = await supabase
    .from("course_enrollments")
    .select(
      `
        course_id,
        courses (
          id,
          code,
          title
        )
      `,
    )
    .eq("student_profile_id", studentId)
    .eq("status", "active");

  if (enrollmentError) {
    throw enrollmentError;
  }

  const courses = (enrollments ?? [])
    .map((enrollment) => {
      const course = Array.isArray(enrollment.courses)
        ? enrollment.courses[0]
        : enrollment.courses;

      if (!course) {
        return null;
      }

      return {
        id: course.id,
        code: course.code,
        title: course.title,
      };
    })
    .filter(Boolean) as StudentCourseOption[];

  if (courses.length === 0) {
    return {
      profileName,
      courses: [],
      selectedCourseId: "",
      selectedFromDate: filters.fromDate || "",
      selectedToDate: filters.toDate || "",
      records: [],
      summary: {
        totalSessions: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        presentRate: 0,
        absentRate: 0,
      },
    };
  }

  const selectedCourseId = filters.courseId || "";
  const scopedCourseIds = selectedCourseId
    ? courses.filter((course) => course.id === selectedCourseId).map((course) => course.id)
    : courses.map((course) => course.id);

  if (scopedCourseIds.length === 0) {
    return {
      profileName,
      courses,
      selectedCourseId,
      selectedFromDate: filters.fromDate || "",
      selectedToDate: filters.toDate || "",
      records: [],
      summary: {
        totalSessions: 0,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        presentRate: 0,
        absentRate: 0,
      },
    };
  }

  let sessionsQuery = supabase
    .from("attendance_sessions")
    .select(
      `
        id,
        course_id,
        starts_at,
        ends_at,
        status,
        courses (
          code,
          title
        )
      `,
    )
    .in("course_id", scopedCourseIds)
    .order("starts_at", { ascending: false });

  if (filters.fromDate) {
    sessionsQuery = sessionsQuery.gte("starts_at", toStartOfDayIso(filters.fromDate));
  }

  if (filters.toDate) {
    sessionsQuery = sessionsQuery.lte("starts_at", toEndOfDayIso(filters.toDate));
  }

  const { data: sessions, error: sessionsError } = await sessionsQuery;

  if (sessionsError) {
    throw sessionsError;
  }

  const sessionIds = (sessions ?? []).map((session) => session.id);
  let events: any[] = [];

  if (sessionIds.length > 0) {
    const { data: attendanceEvents, error: eventsError } = await supabase
      .from("attendance_events")
      .select(
        "id, attendance_session_id, student_profile_id, recorded_at, matched_by, confidence_score",
      )
      .eq("student_profile_id", studentId)
      .in("attendance_session_id", sessionIds);

    if (eventsError) {
      throw eventsError;
    }

    events = attendanceEvents ?? [];
  }

  const normalizedSnapshot = buildNormalizedAttendanceSnapshot({
    sessions: sessions ?? [],
    enrollments: (enrollments ?? []).map((enrollment) => ({
      course_id: enrollment.course_id,
      student_profile_id: studentId,
    })),
    events,
    studentProfilesById: new Map([
      [
        studentId,
        {
          id: studentId,
          full_name: currentProfile.profile.full_name,
          university_id: currentProfile.profile.university_id,
        },
      ],
    ]),
  });

  const eventBySession = new Map(
    normalizedSnapshot.validEvents.map((event) => [event.attendanceSessionId, event]),
  );

  const records: StudentAttendanceRecord[] = normalizedSnapshot.sessions.map((session) => {
    const event = eventBySession.get(session.id);
    const timing = getAttendanceTiming(session.startsAt, event?.recordedAt ?? null);

    return {
      id: session.id,
      sessionStartsAt: session.startsAt,
      recordedAt: event?.recordedAt || null,
      courseCode: session.courseCode,
      courseTitle: session.courseTitle,
      status: timing.status,
      notes: event
        ? buildAttendanceNote({
            matchedBy: event.matchedBy,
            confidenceScore: event.confidenceScore,
            status: timing.status,
            lateMinutes: timing.lateMinutes,
          })
        : "No check-in recorded",
    };
  });

  const totalSessions = records.length;
  const presentCount = records.filter((record) => record.status === "Present").length;
  const lateCount = records.filter((record) => record.status === "Late").length;
  const absentCount = records.filter((record) => record.status === "Absent").length;
  const attendedCount = presentCount + lateCount;

  const summary: StudentAttendanceSummary = {
    totalSessions,
    presentCount,
    absentCount,
    lateCount,
    presentRate: totalSessions ? Math.round((attendedCount / totalSessions) * 100) : 0,
    absentRate: totalSessions ? Math.round((absentCount / totalSessions) * 100) : 0,
  };

  return {
    profileName,
    courses,
    selectedCourseId,
    selectedFromDate: filters.fromDate || "",
    selectedToDate: filters.toDate || "",
    records,
    summary,
  };
}

export async function getStudentDashboardData() {
  const historyData = await getStudentAttendanceHistoryData();

  return {
    profileName: historyData.profileName,
    summary: historyData.summary,
    courses: historyData.courses,
  };
}
