import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/features/auth/profile";

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
  occurredAt: string;
  status: "Present";
  notes: string;
};

export type InstructorClassAttendanceData = {
  courses: InstructorCourseOption[];
  selectedCourseId: string;
  selectedDateRange: string;
  search: string;
  records: InstructorAttendanceRecord[];
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
    date: string;
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
  selectedCourseId: string;
  selectedFromDate: string;
  selectedToDate: string;
  sessions: any[];
  enrollments: any[];
  events: any[];
  studentProfilesById: Map<string, any>;
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
      selectedCourseId,
      selectedFromDate: filters.fromDate || "",
      selectedToDate: filters.toDate || "",
      sessions: [],
      enrollments: [],
      events: [],
      studentProfilesById: new Map(),
    };
  }

  const scopedCourseIds = selectedCourseId
    ? courses.filter((course) => course.id === selectedCourseId).map((course) => course.id)
    : courses.map((course) => course.id);

  if (scopedCourseIds.length === 0) {
    return {
      courses,
      selectedCourseId,
      selectedFromDate: filters.fromDate || "",
      selectedToDate: filters.toDate || "",
      sessions: [],
      enrollments: [],
      events: [],
      studentProfilesById: new Map(),
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
        starts_at,
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

  const studentIds = Array.from(
    new Set((events ?? []).map((event) => event.student_profile_id).filter(Boolean)),
  );

  const studentProfilesById = new Map<string, any>();

  if (studentIds.length > 0) {
    const { data: studentProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, university_id")
      .in("id", studentIds);

    if (profilesError) {
      throw profilesError;
    }

    for (const profile of studentProfiles ?? []) {
      studentProfilesById.set(profile.id, profile);
    }
  }

  return {
    courses,
    selectedCourseId,
    selectedFromDate: filters.fromDate || "",
    selectedToDate: filters.toDate || "",
    sessions: sessions || [],
    enrollments: enrollments || [],
    events: events || [],
    studentProfilesById,
  };
}

function buildAttendanceNote(event: any) {
  if (typeof event.confidence_score === "number") {
    return `${event.matched_by} (${Math.round(event.confidence_score * 100)}% confidence)`;
  }

  return event.matched_by || "Check-in recorded";
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
  const sessionById = new Map(snapshot.sessions.map((session) => [session.id, session]));
  const normalizedSearch = search.trim().toLowerCase();

  let records: InstructorAttendanceRecord[] = snapshot.events
    .map((event) => {
      const profile = snapshot.studentProfilesById.get(event.student_profile_id);
      const session = sessionById.get(event.attendance_session_id);
      const course = Array.isArray(session?.courses) ? session.courses[0] : session?.courses;

      if (!session) {
        return null;
      }

      const studentIdentifier =
        profile?.university_id || event.student_profile_id.slice(0, 8).toUpperCase();

      return {
        id: event.id,
        studentId: studentIdentifier,
        studentName: profile?.full_name || "Unknown Student",
        courseCode: course?.code || "---",
        courseTitle: course?.title || "Unknown Course",
        occurredAt: event.recorded_at || session.starts_at,
        status: "Present",
        notes: buildAttendanceNote(event),
      };
    })
    .filter(Boolean) as InstructorAttendanceRecord[];

  if (normalizedSearch) {
    records = records.filter((record) => {
      return (
        record.studentName.toLowerCase().includes(normalizedSearch) ||
        record.studentId.toLowerCase().includes(normalizedSearch) ||
        record.courseCode.toLowerCase().includes(normalizedSearch)
      );
    });
  }

  records.sort((left, right) => {
    return new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime();
  });

  const totalRecords = records.length;
  const totalPages = Math.max(Math.ceil(totalRecords / pageSize), 1);
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pagedRecords = records.slice(pageStart, pageStart + pageSize);

  return {
    courses: snapshot.courses,
    selectedCourseId: snapshot.selectedCourseId,
    selectedDateRange: dateRange,
    search,
    records: pagedRecords,
    totalRecords,
    currentPage,
    totalPages,
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
  const sessionById = new Map(snapshot.sessions.map((session) => [session.id, session]));

  for (const session of snapshot.sessions) {
    sessionsByCourse.set(
      session.course_id,
      (sessionsByCourse.get(session.course_id) ?? 0) + 1,
    );
  }

  for (const enrollment of snapshot.enrollments) {
    enrollmentsByCourse.set(
      enrollment.course_id,
      (enrollmentsByCourse.get(enrollment.course_id) ?? 0) + 1,
    );
  }

  for (const event of snapshot.events) {
    const session = sessionById.get(event.attendance_session_id);
    if (!session) {
      continue;
    }

    recordedByCourse.set(
      session.course_id,
      (recordedByCourse.get(session.course_id) ?? 0) + 1,
    );
  }

  const courseBreakdown = snapshot.courses.map((course) => {
    const sessions = sessionsByCourse.get(course.id) ?? 0;
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

  const totalSessions = snapshot.sessions.length;
  const expectedCheckIns = courseBreakdown.reduce(
    (total, courseRow) => total + courseRow.expected,
    0,
  );
  const recordedCheckIns = snapshot.events.length;
  const attendanceRate = expectedCheckIns
    ? Math.round((recordedCheckIns / expectedCheckIns) * 100)
    : 0;
  const uniqueStudents = new Set(snapshot.events.map((event) => event.student_profile_id)).size;

  const csvRows = snapshot.events
    .map((event) => {
      const session = sessionById.get(event.attendance_session_id);
      const profile = snapshot.studentProfilesById.get(event.student_profile_id);
      const course = Array.isArray(session?.courses) ? session.courses[0] : session?.courses;

      if (!session) {
        return null;
      }

      return {
        date: event.recorded_at || session.starts_at,
        courseCode: course?.code || "---",
        courseTitle: course?.title || "Unknown Course",
        studentId: profile?.university_id || event.student_profile_id,
        studentName: profile?.full_name || "Unknown Student",
        status: "Present",
        notes: buildAttendanceNote(event),
      };
    })
    .filter(Boolean) as InstructorReportData["csvRows"];

  csvRows.sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
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
  const header = ["Date", "Course Code", "Course Title", "Student ID", "Student Name", "Status", "Notes"];
  const lines = [header.join(",")];

  for (const row of rows) {
    const values = [
      row.date,
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
