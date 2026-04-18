import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/features/auth/profile";
import {
  AttendanceSessionGroup,
  AttendanceStatus,
  buildAttendanceNote,
  buildAttendanceDateGroups,
  buildNormalizedAttendanceSnapshot,
} from "@/features/attendance/attendance-read.service";

type InstructorCourseOption = {
  id: string;
  code: string;
  title: string;
};

type AttendanceSnapshotFilters = {
  courseId?: string;
  fromDate?: string;
  toDate?: string;
  dateRange?: string;
};

type InstructorAttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseTitle: string;
  sessionStartsAt: string;
  recordedAt: string;
  status: AttendanceStatus;
  notes: string;
};

export type InstructorClassAttendanceData = {
  courses: InstructorCourseOption[];
  selectedCourseId: string;
  selectedDateRange: string;
  search: string;
  records: InstructorAttendanceRecord[];
  dateGroups: AttendanceSessionGroup[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
};

export type InstructorReportData = {
  courses: InstructorCourseOption[];
  selectedCourseId: string;
  selectedFromDate: string;
  selectedToDate: string;
  generated: boolean;
  totals: {
    totalSessions: number;
    expectedCheckIns: number;
    recordedCheckIns: number;
    attendanceRate: number;
    uniqueStudents: number;
  };
  courseBreakdown: Array<{
    courseId: string;
    courseCode: string;
    courseTitle: string;
    sessions: number;
    expected: number;
    recorded: number;
    absent: number;
    attendanceRate: number;
  }>;
  csvRows: Array<{
    sessionStartsAt: string;
    recordedAt: string;
    courseCode: string;
    courseTitle: string;
    studentId: string;
    studentName: string;
    status: string;
    notes: string;
  }>;
};

type AttendanceSnapshot = {
  courses: InstructorCourseOption[];
  scopedCourses: InstructorCourseOption[];
  selectedCourseId: string;
  selectedFromDate: string;
  selectedToDate: string;
  sessions: any[];
  enrollments: any[];
  events: any[];
  studentProfilesById: Map<string, any>;
  instructorNamesById: Map<string, string>;
};

type InstructorContext = {
  userId: string;
  role: "instructor" | "admin";
};

function toStartOfDayIso(dateValue: string) {
  return `${dateValue}T00:00:00.000Z`;
}

function toEndOfDayIso(dateValue: string) {
  return `${dateValue}T23:59:59.999Z`;
}

function getDateRangePreset(dateRange?: string) {
  const today = new Date();
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  if (dateRange === "this-week") {
    const start = new Date(today);
    const weekday = start.getDay();
    const mondayOffset = (weekday + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
    start.setHours(0, 0, 0, 0);

    return { fromDate: start.toISOString(), toDate: end.toISOString() };
  }

  if (dateRange === "this-month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    start.setHours(0, 0, 0, 0);
    return { fromDate: start.toISOString(), toDate: end.toISOString() };
  }

  return { fromDate: "", toDate: "" };
}

function normalizeCourseFromAssignment(assignment: any) {
  const course = Array.isArray(assignment.courses) ? assignment.courses[0] : assignment.courses;

  if (!course) {
    return null;
  }

  return {
    id: course.id,
    code: course.code,
    title: course.title,
  };
}

async function getInstructorContext(): Promise<InstructorContext> {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile?.profile) {
    throw new Error("Unauthorized");
  }

  const role = currentProfile.profile.role;
  if (role !== "instructor" && role !== "admin") {
    throw new Error("Unauthorized");
  }

  return {
    userId: currentProfile.profile.id,
    role,
  };
}

export async function getInstructorCourseOptions() {
  const context = await getInstructorContext();
  const supabase = createClient();
  return loadInstructorCourseOptions(context, supabase);
}

async function loadInstructorCourseOptions(
  context: InstructorContext,
  supabase: ReturnType<typeof createClient>,
) {
  if (context.role === "admin") {
    // Admin reports and archive pages intentionally work across the whole course
    // catalog, so admins are not restricted to one instructor assignment list here.
    const { data: courses, error } = await supabase
      .from("courses")
      .select("id, code, title")
      .order("code", { ascending: true });

    if (error) {
      throw error;
    }

    return courses || [];
  }

  const { data: assignments, error } = await supabase
    .from("course_instructors")
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
    .eq("instructor_profile_id", context.userId);

  if (error) {
    throw error;
  }

  return (assignments ?? [])
    .map(normalizeCourseFromAssignment)
    .filter(Boolean) as InstructorCourseOption[];
}

async function getInstructorAttendanceSnapshot(
  filters: AttendanceSnapshotFilters = {},
): Promise<AttendanceSnapshot> {
  const context = await getInstructorContext();
  const supabase = createClient();
  const courses = await loadInstructorCourseOptions(context, supabase);
  const selectedCourseId = filters.courseId || "";

  if (courses.length === 0) {
    return {
      courses: [],
      scopedCourses: [],
      selectedCourseId,
      selectedFromDate: filters.fromDate || "",
      selectedToDate: filters.toDate || "",
      sessions: [],
      enrollments: [],
      events: [],
      studentProfilesById: new Map(),
      instructorNamesById: new Map(),
    };
  }

  const scopedCourseIds = selectedCourseId
    ? courses.filter((course) => course.id === selectedCourseId).map((course) => course.id)
    : courses.map((course) => course.id);
  const scopedCourses = selectedCourseId
    ? courses.filter((course) => course.id === selectedCourseId)
    : courses;

  if (scopedCourseIds.length === 0) {
    return {
      courses,
      scopedCourses: [],
      selectedCourseId,
      selectedFromDate: filters.fromDate || "",
      selectedToDate: filters.toDate || "",
      sessions: [],
      enrollments: [],
      events: [],
      studentProfilesById: new Map(),
      instructorNamesById: new Map(),
    };
  }

  const presetRange = getDateRangePreset(filters.dateRange);
  const fromDate = filters.fromDate
    ? toStartOfDayIso(filters.fromDate)
    : presetRange.fromDate;
  const toDate = filters.toDate ? toEndOfDayIso(filters.toDate) : presetRange.toDate;

  let sessionsQuery = supabase
    .from("attendance_sessions")
    .select(
      `
        id,
        course_id,
        created_by_profile_id,
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

  if (fromDate) {
    sessionsQuery = sessionsQuery.gte("starts_at", fromDate);
  }

  if (toDate) {
    sessionsQuery = sessionsQuery.lte("starts_at", toDate);
  }

  const { data: sessions, error: sessionsError } = await sessionsQuery;

  if (sessionsError) {
    throw sessionsError;
  }

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("course_enrollments")
    .select("course_id, student_profile_id")
    .in("course_id", scopedCourseIds)
    .eq("status", "active");

  if (enrollmentsError) {
    throw enrollmentsError;
  }

  const sessionIds = (sessions ?? []).map((session) => session.id);
  let events: any[] = [];

  if (sessionIds.length > 0) {
    const { data: attendanceEvents, error: eventsError } = await supabase
      .from("attendance_events")
      .select(
        "id, attendance_session_id, student_profile_id, recorded_at, matched_by, confidence_score",
      )
      .in("attendance_session_id", sessionIds);

    if (eventsError) {
      throw eventsError;
    }

    events = attendanceEvents ?? [];
  }

  // The archive and report screens need names for both students and instructors,
  // so we collect every profile we might need in one follow-up lookup here.
  const studentIds = Array.from(
    new Set(
      [...(enrollments ?? []), ...(events ?? [])]
        .map((row: any) => row.student_profile_id)
        .filter(Boolean),
    ),
  );

  const studentProfilesById = new Map<string, any>();
  const instructorNamesById = new Map<string, string>();
  const instructorIds = Array.from(
    new Set((sessions ?? []).map((session) => session.created_by_profile_id).filter(Boolean)),
  );

  if (studentIds.length > 0 || instructorIds.length > 0) {
    const admin = createAdminClient();
    const profileIds = Array.from(new Set([...studentIds, ...instructorIds]));
    const { data: profiles, error: profilesError } = await admin
      .from("profiles")
      .select("id, full_name, university_id")
      .in("id", profileIds);

    if (profilesError) {
      throw profilesError;
    }

    for (const profile of profiles ?? []) {
      studentProfilesById.set(profile.id, profile);
      if (instructorIds.includes(profile.id) && profile.full_name?.trim()) {
        instructorNamesById.set(profile.id, profile.full_name);
      }
    }
  }

  return {
    courses,
    scopedCourses,
    selectedCourseId,
    selectedFromDate: filters.fromDate || "",
    selectedToDate: filters.toDate || "",
    sessions: sessions || [],
    enrollments: enrollments || [],
    events: events || [],
    studentProfilesById,
    instructorNamesById,
  };
}

export async function getInstructorClassAttendanceData({
  courseId = "",
  dateRange = "this-week",
  search = "",
  page = 1,
  pageSize = 10,
}: {
  courseId?: string;
  dateRange?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<InstructorClassAttendanceData> {
  const snapshot = await getInstructorAttendanceSnapshot({ courseId, dateRange });
  const normalizedSnapshot = buildNormalizedAttendanceSnapshot({
    sessions: snapshot.sessions,
    enrollments: snapshot.enrollments,
    events: snapshot.events,
    studentProfilesById: snapshot.studentProfilesById,
  });
  const dateGroups = buildAttendanceDateGroups({
    sessions: snapshot.sessions,
    enrollments: snapshot.enrollments,
    events: snapshot.events,
    studentProfilesById: snapshot.studentProfilesById,
    instructorNamesById: snapshot.instructorNamesById,
  });
  const normalizedSearch = search.trim().toLowerCase();

  let filteredDateGroups = dateGroups;
  if (normalizedSearch) {
    // Search works at both session and student level: if the session metadata
    // matches, we keep the full session; otherwise we narrow it down to matching students.
    filteredDateGroups = dateGroups
      .map((group) => ({
        ...group,
        sessions: group.sessions
          .map((session) => {
            const sessionMatches =
              session.courseCode.toLowerCase().includes(normalizedSearch) ||
              session.courseTitle.toLowerCase().includes(normalizedSearch) ||
              session.sessionTitle.toLowerCase().includes(normalizedSearch) ||
              session.instructorName.toLowerCase().includes(normalizedSearch) ||
              group.dateLabel.toLowerCase().includes(normalizedSearch);

            const students = sessionMatches
              ? session.students
              : session.students.filter(
                  (student) =>
                    student.studentName.toLowerCase().includes(normalizedSearch) ||
                    student.studentId.toLowerCase().includes(normalizedSearch),
                );

            if (!sessionMatches && students.length === 0) {
              return null;
            }

            return {
              ...session,
              students,
            };
          })
          .filter(Boolean) as AttendanceSessionGroup["sessions"],
      }))
      .filter((group) => group.sessions.length > 0);
  }

  let records: InstructorAttendanceRecord[] = filteredDateGroups.flatMap((group) =>
    group.sessions.flatMap((session) =>
      session.students
        .filter((student) => student.isScanned)
        .map((student) => ({
          id: `${session.sessionId}:${student.studentProfileId}`,
          studentId: student.studentId,
          studentName: student.studentName,
          courseCode: session.courseCode,
          courseTitle: session.courseTitle,
          sessionStartsAt: session.sessionStartsAt,
          recordedAt: student.recordedAt || session.sessionStartsAt,
          status: student.status,
          notes: student.notes,
        })),
    ),
  );

  records.sort((left, right) => {
    return new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime();
  });

  return {
    courses: snapshot.courses,
    selectedCourseId: snapshot.selectedCourseId,
    selectedDateRange: dateRange,
    search,
    records,
    totalRecords: records.length,
    currentPage: 1,
    totalPages: 1,
    dateGroups: filteredDateGroups,
  };
}

export async function getInstructorReportData({
  courseId = "",
  fromDate = "",
  toDate = "",
  generated = false,
}: {
  courseId?: string;
  fromDate?: string;
  toDate?: string;
  generated?: boolean;
} = {}): Promise<InstructorReportData> {
  const snapshot = await getInstructorAttendanceSnapshot({ courseId, fromDate, toDate });
  const normalizedSnapshot = buildNormalizedAttendanceSnapshot({
    sessions: snapshot.sessions,
    enrollments: snapshot.enrollments,
    events: snapshot.events,
    studentProfilesById: snapshot.studentProfilesById,
  });
  const generatedReport = Boolean(generated);

  if (!generatedReport) {
    return {
      courses: snapshot.courses,
      selectedCourseId: snapshot.selectedCourseId,
      selectedFromDate: snapshot.selectedFromDate,
      selectedToDate: snapshot.selectedToDate,
      generated: false,
      totals: {
        totalSessions: 0,
        expectedCheckIns: 0,
        recordedCheckIns: 0,
        attendanceRate: 0,
        uniqueStudents: 0,
      },
      courseBreakdown: [],
      csvRows: [],
    };
  }

  const sessionsByCourse = new Map<string, number>();
  const enrollmentsByCourse = new Map<string, number>();
  const recordedByCourse = new Map<string, number>();

  for (const session of normalizedSnapshot.sessions) {
    sessionsByCourse.set(
      session.courseId,
      (sessionsByCourse.get(session.courseId) ?? 0) + 1,
    );
  }

  normalizedSnapshot.activeEnrollmentCountsByCourse.forEach((count, courseId) => {
    enrollmentsByCourse.set(courseId, count);
  });

  for (const event of normalizedSnapshot.validEvents) {
    recordedByCourse.set(
      event.courseId,
      (recordedByCourse.get(event.courseId) ?? 0) + 1,
    );
  }

  const courseBreakdown = snapshot.scopedCourses.map((course) => {
    const sessions = sessionsByCourse.get(course.id) ?? 0;
    // Expected check-ins are not stored directly. We derive them from the number
    // of sessions multiplied by the active roster size for that course.
    const expected = sessions * (enrollmentsByCourse.get(course.id) ?? 0);
    const recorded = recordedByCourse.get(course.id) ?? 0;
    const absent = Math.max(expected - recorded, 0);
    const attendanceRate = expected ? Math.round((recorded / expected) * 100) : 0;

    return {
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      sessions,
      expected,
      recorded,
      absent,
      attendanceRate,
    };
  });

  const totalSessions = normalizedSnapshot.sessions.length;
  const expectedCheckIns = courseBreakdown.reduce(
    (total, courseRow) => total + courseRow.expected,
    0,
  );
  const recordedCheckIns = normalizedSnapshot.validEvents.length;
  const attendanceRate = expectedCheckIns
    ? Math.round((recordedCheckIns / expectedCheckIns) * 100)
    : 0;
  const uniqueStudents = new Set(
    normalizedSnapshot.validEvents.map((event) => event.studentProfileId),
  ).size;

  const csvRows = normalizedSnapshot.validEvents.map((event) => ({
    sessionStartsAt: event.sessionStartsAt,
    recordedAt: event.recordedAt,
    courseCode: event.courseCode,
    courseTitle: event.courseTitle,
    studentId: event.studentId,
    studentName: event.studentName,
    status: "Present",
    notes: buildAttendanceNote(event),
  }));

  csvRows.sort((left, right) => {
    return new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime();
  });

  return {
    courses: snapshot.courses,
    selectedCourseId: snapshot.selectedCourseId,
    selectedFromDate: snapshot.selectedFromDate,
    selectedToDate: snapshot.selectedToDate,
    generated: true,
    totals: {
      totalSessions,
      expectedCheckIns,
      recordedCheckIns,
      attendanceRate,
      uniqueStudents,
    },
    courseBreakdown,
    csvRows,
  };
}

export function buildInstructorReportCsv(rows: InstructorReportData["csvRows"]) {
  const header = [
    "Session Start",
    "Check-In Time",
    "Course Code",
    "Course Title",
    "Student ID",
    "Student Name",
    "Status",
    "Notes",
  ];
  const lines = [header.join(",")];

  for (const row of rows) {
    const values = [
      row.sessionStartsAt,
      row.recordedAt,
      row.courseCode,
      row.courseTitle,
      row.studentId,
      row.studentName,
      row.status,
      row.notes,
    ].map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`);

    lines.push(values.join(","));
  }

  return lines.join("\n");
}
