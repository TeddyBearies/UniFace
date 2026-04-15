type CourseRelation = {
  code?: string | null;
  title?: string | null;
} | Array<{
  code?: string | null;
  title?: string | null;
}> | null;

type SessionRow = {
  id: string;
  course_id: string;
  created_by_profile_id?: string | null;
  starts_at: string;
  ends_at?: string | null;
  status?: string | null;
  courses?: CourseRelation;
};

type EnrollmentRow = {
  course_id: string;
  student_profile_id: string;
};

type EventRow = {
  id: string;
  attendance_session_id: string;
  student_profile_id: string;
  recorded_at?: string | null;
  matched_by?: string | null;
  confidence_score?: number | string | null;
};

type ProfileRow = {
  id: string;
  full_name?: string | null;
  university_id?: string | null;
};

export type NormalizedAttendanceSession = {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  createdByProfileId: string | null;
  instructorName: string;
  startsAt: string;
  endsAt: string | null;
  status: string;
};

export type AttendanceStatus = "Present" | "Late" | "Absent";

export type NormalizedAttendanceEvent = {
  id: string;
  attendanceSessionId: string;
  studentProfileId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  sessionStartsAt: string;
  sessionEndsAt: string | null;
  recordedAt: string;
  matchedBy: string;
  confidenceScore: number | null;
  status: AttendanceStatus;
  lateMinutes: number | null;
};

export type AttendanceStudentRow = {
  studentProfileId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  recordedAt: string | null;
  lateMinutes: number | null;
  notes: string;
  isScanned: boolean;
};

export type AttendanceSessionGroup = {
  dateKey: string;
  dateLabel: string;
  sessions: Array<{
    sessionId: string;
    courseId: string;
    courseCode: string;
    courseTitle: string;
    sessionTitle: string;
    instructorName: string;
    sessionStartsAt: string;
    sessionEndsAt: string | null;
    totalStudentsScanned: number;
    totalPresent: number;
    totalLate: number;
    totalAbsent: number;
    students: AttendanceStudentRow[];
  }>;
};

export function buildAttendanceNote(input: {
  matchedBy?: string | null;
  confidenceScore?: number | string | null;
  status?: AttendanceStatus;
  lateMinutes?: number | null;
}) {
  const matchedBy = input.matchedBy || "check_in";
  const label = matchedBy.replace(/_/g, " ");
  const numericConfidence =
    typeof input.confidenceScore === "number"
      ? input.confidenceScore
      : typeof input.confidenceScore === "string"
        ? Number.parseFloat(input.confidenceScore)
        : null;

  if (typeof numericConfidence === "number" && Number.isFinite(numericConfidence)) {
    const confidenceLabel = `${label} (${Math.round(numericConfidence * 100)}% confidence)`;
    if (input.status === "Late" && typeof input.lateMinutes === "number") {
      return `${confidenceLabel}, late by ${input.lateMinutes} min`;
    }
    return confidenceLabel;
  }

  if (input.status === "Late" && typeof input.lateMinutes === "number") {
    return `${label}, late by ${input.lateMinutes} min`;
  }

  return label;
}

export function getAttendanceTiming(sessionStartsAt: string, recordedAt?: string | null) {
  if (!recordedAt) {
    return {
      status: "Absent" as AttendanceStatus,
      lateMinutes: null,
      isLate: false,
    };
  }

  const sessionTime = new Date(sessionStartsAt).getTime();
  const scanTime = new Date(recordedAt).getTime();
  const minutesLate = Math.max(Math.floor((scanTime - sessionTime) / 60000), 0);
  const isLate = minutesLate > 15;

  return {
    status: (isLate ? "Late" : "Present") as AttendanceStatus,
    lateMinutes: isLate ? minutesLate : null,
    isLate,
  };
}

function normalizeCourse(courseRelation: CourseRelation) {
  const course = Array.isArray(courseRelation) ? courseRelation[0] : courseRelation;

  return {
    code: course?.code?.trim() || "---",
    title: course?.title?.trim() || "Unknown Course",
  };
}

function buildEnrollmentKey(courseId: string, studentProfileId: string) {
  return `${courseId}:${studentProfileId}`;
}

export function buildNormalizedAttendanceSnapshot({
  sessions,
  enrollments,
  events,
  studentProfilesById,
}: {
  sessions: SessionRow[];
  enrollments: EnrollmentRow[];
  events: EventRow[];
  studentProfilesById: Map<string, ProfileRow>;
}) {
  const normalizedSessions: NormalizedAttendanceSession[] = (sessions ?? []).map((session) => {
    const course = normalizeCourse(session.courses ?? null);

    return {
      id: session.id,
      courseId: session.course_id,
      courseCode: course.code,
      courseTitle: course.title,
      createdByProfileId: session.created_by_profile_id || null,
      instructorName: "",
      startsAt: session.starts_at,
      endsAt: session.ends_at || null,
      status: session.status || "",
    };
  });

  const sessionById = new Map(normalizedSessions.map((session) => [session.id, session]));
  const activeEnrollmentKeys = new Set(
    (enrollments ?? []).map((enrollment) =>
      buildEnrollmentKey(enrollment.course_id, enrollment.student_profile_id),
    ),
  );
  const activeEnrollmentCountsByCourse = new Map<string, number>();

  for (const enrollment of enrollments ?? []) {
    activeEnrollmentCountsByCourse.set(
      enrollment.course_id,
      (activeEnrollmentCountsByCourse.get(enrollment.course_id) ?? 0) + 1,
    );
  }

  const validEvents: NormalizedAttendanceEvent[] = [];

  for (const event of events ?? []) {
    const session = sessionById.get(event.attendance_session_id);
    if (!session) {
      continue;
    }

    if (!activeEnrollmentKeys.has(buildEnrollmentKey(session.courseId, event.student_profile_id))) {
      continue;
    }

    const profile = studentProfilesById.get(event.student_profile_id);
    const studentId = profile?.university_id?.trim() || "";
    const studentName = profile?.full_name?.trim() || "";

    if (!studentId || !studentName) {
      continue;
    }

    validEvents.push({
      id: event.id,
      attendanceSessionId: event.attendance_session_id,
      studentProfileId: event.student_profile_id,
      studentId,
      studentName,
      courseId: session.courseId,
      courseCode: session.courseCode,
      courseTitle: session.courseTitle,
      sessionStartsAt: session.startsAt,
      sessionEndsAt: session.endsAt,
      recordedAt: event.recorded_at || session.startsAt,
      matchedBy: event.matched_by || "check_in",
      confidenceScore:
        typeof event.confidence_score === "number"
          ? event.confidence_score
          : typeof event.confidence_score === "string"
            ? Number.parseFloat(event.confidence_score)
            : null,
      ...getAttendanceTiming(session.startsAt, event.recorded_at || session.startsAt),
    });
  }

  return {
    sessions: normalizedSessions,
    sessionById,
    activeEnrollmentKeys,
    activeEnrollmentCountsByCourse,
    validEvents,
  };
}

function getDateKey(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function getDateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function buildAttendanceDateGroups({
  sessions,
  enrollments,
  events,
  studentProfilesById,
  instructorNamesById = new Map<string, string>(),
}: {
  sessions: SessionRow[];
  enrollments: EnrollmentRow[];
  events: EventRow[];
  studentProfilesById: Map<string, ProfileRow>;
  instructorNamesById?: Map<string, string>;
}): AttendanceSessionGroup[] {
  const snapshot = buildNormalizedAttendanceSnapshot({
    sessions,
    enrollments,
    events,
    studentProfilesById,
  });

  const eventsBySession = new Map<string, NormalizedAttendanceEvent[]>();
  const eventsBySessionAndStudent = new Map<string, NormalizedAttendanceEvent>();

  for (const event of snapshot.validEvents) {
    const existing = eventsBySession.get(event.attendanceSessionId) ?? [];
    existing.push(event);
    eventsBySession.set(event.attendanceSessionId, existing);
    eventsBySessionAndStudent.set(
      `${event.attendanceSessionId}:${event.studentProfileId}`,
      event,
    );
  }

  const sessionsByDate = new Map<string, AttendanceSessionGroup>();

  for (const session of snapshot.sessions) {
    const sessionDateKey = getDateKey(session.startsAt);
    const sessionDateLabel = getDateLabel(session.startsAt);
    const instructorName = session.createdByProfileId
      ? instructorNamesById.get(session.createdByProfileId) || "Instructor"
      : "Instructor";
    const enrolledIds = (enrollments ?? [])
      .filter((enrollment) => enrollment.course_id === session.courseId)
      .map((enrollment) => enrollment.student_profile_id);
    const uniqueEnrollmentIds = Array.from(new Set(enrolledIds));

    const students: AttendanceStudentRow[] = uniqueEnrollmentIds
      .map((studentProfileId) => {
        const profile = studentProfilesById.get(studentProfileId);
        const attendanceEvent = eventsBySessionAndStudent.get(
          `${session.id}:${studentProfileId}`,
        );
        const timing = getAttendanceTiming(
          session.startsAt,
          attendanceEvent?.recordedAt ?? null,
        );

        if (!profile?.full_name?.trim() || !profile?.university_id?.trim()) {
          return null;
        }

        return {
          studentProfileId,
          studentId: profile.university_id,
          studentName: profile.full_name,
          status: timing.status,
          recordedAt: attendanceEvent?.recordedAt ?? null,
          lateMinutes: timing.lateMinutes,
          notes: attendanceEvent
            ? buildAttendanceNote({
                matchedBy: attendanceEvent.matchedBy,
                confidenceScore: attendanceEvent.confidenceScore ?? null,
                status: timing.status,
                lateMinutes: timing.lateMinutes,
              })
            : "No check-in recorded",
          isScanned: Boolean(attendanceEvent),
        };
      })
      .filter(Boolean) as AttendanceStudentRow[];

    const totalStudentsScanned = eventsBySession.get(session.id)?.length ?? 0;
    const totalLate = students.filter((student) => student.status === "Late").length;
    const totalPresent = students.filter((student) => student.status === "Present").length;
    const totalAbsent = students.filter((student) => student.status === "Absent").length;

    const nextSession = {
      sessionId: session.id,
      courseId: session.courseId,
      courseCode: session.courseCode,
      courseTitle: session.courseTitle,
      sessionTitle: `${session.courseCode} - ${session.courseTitle}`,
      instructorName,
      sessionStartsAt: session.startsAt,
      sessionEndsAt: session.endsAt,
      totalStudentsScanned,
      totalPresent,
      totalLate,
      totalAbsent,
      students: students.sort((left, right) => {
        if (left.status === right.status) {
          return left.studentId.localeCompare(right.studentId);
        }

        if (left.status === "Late") {
          return -1;
        }

        if (right.status === "Late") {
          return 1;
        }

        return left.studentId.localeCompare(right.studentId);
      }),
    };

    const existingGroup = sessionsByDate.get(sessionDateKey);
    if (existingGroup) {
      existingGroup.sessions.push(nextSession);
    } else {
      sessionsByDate.set(sessionDateKey, {
        dateKey: sessionDateKey,
        dateLabel: sessionDateLabel,
        sessions: [nextSession],
      });
    }
  }

  return Array.from(sessionsByDate.values())
    .map((group) => ({
      ...group,
      sessions: group.sessions.sort((left, right) =>
        right.sessionStartsAt.localeCompare(left.sessionStartsAt),
      ),
    }))
    .sort((left, right) => right.dateKey.localeCompare(left.dateKey));
}
