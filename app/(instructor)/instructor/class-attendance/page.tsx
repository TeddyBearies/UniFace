import InstructorPageFrame from "@/components/InstructorPageFrame";
import { requireCurrentProfile } from "@/features/auth/guards";
import { getInstructorClassAttendanceData } from "@/features/attendance/instructor-records.service";

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7c8798"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#98a2b3"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 22, height: 22, flex: "none" }}
    >
      <circle cx="11" cy="11" r="6.8" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

function EmptyStateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94a3b8"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 42, height: 42, flex: "none" }}
    >
      <path d="M4 4h7.2L20 12.8V20H7a3 3 0 0 1-3-3z" />
      <path d="M11.2 4v8.8H20" />
      <path d="m4 4 16 16" />
    </svg>
  );
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not scanned";
  }

  return new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Cairo",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function AttendanceStatusBadge({
  status,
}: {
  status: "Present" | "Late" | "Absent";
}) {
  return <span className={`attendanceStatusBadge ${status.toLowerCase()}`}>{status}</span>;
}

export default async function InstructorClassAttendancePage({
  searchParams,
}: {
  searchParams?: {
    courseId?: string;
    dateRange?: string;
    search?: string;
  };
}) {
  await requireCurrentProfile(["instructor", "admin"]);

  const selectedCourseId = searchParams?.courseId || "";
  const selectedDateRange = searchParams?.dateRange || "this-week";
  const search = searchParams?.search || "";

  const classData = await getInstructorClassAttendanceData({
    courseId: selectedCourseId,
    dateRange: selectedDateRange,
    search,
  });

  const hasArchive = classData.dateGroups.some((group) => group.sessions.length > 0);

  return (
    <InstructorPageFrame activeNav="class-attendance">
      <div className="class-attendance-page instructor-page-content">
        <header className="pageHeader">
          <h1>Class Attendance</h1>
          <p>Attendance archive grouped by date and session.</p>
        </header>

        <form className="classFiltersCard" aria-label="Attendance filters" method="get">
          <div className="classFilterGroup">
            <label htmlFor="class-course-filter">Course</label>
            <div className="selectField">
              <select
                id="class-course-filter"
                name="courseId"
                defaultValue={classData.selectedCourseId}
              >
                <option value="">All Courses</option>
                {classData.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="classFilterGroup">
            <label htmlFor="class-date-filter">Date Range</label>
            <div className="selectField">
              <select
                id="class-date-filter"
                name="dateRange"
                defaultValue={classData.selectedDateRange}
              >
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="all-time">All Time</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="classFilterGroup searchGroup">
            <label htmlFor="class-search-filter">Search Students</label>
            <div className="searchField">
              <SearchIcon />
              <input
                id="class-search-filter"
                name="search"
                type="text"
                placeholder="Search by Student ID or Name"
                defaultValue={classData.search}
              />
            </div>
          </div>

          <button type="submit" hidden aria-hidden="true" />
        </form>

        {hasArchive ? (
          <section className="classArchive" aria-label="Attendance archive">
            {classData.dateGroups.map((dateGroup, dateIndex) => (
              <article key={dateGroup.dateKey} className="dateArchiveCard">
                <header className="dateArchiveHeader">
                  <div>
                    <h2>{dateGroup.dateLabel}</h2>
                    <p>{dateGroup.sessions.length} session{dateGroup.sessions.length === 1 ? "" : "s"}</p>
                  </div>
                </header>

                <div className="dateArchiveSessions">
                  {dateGroup.sessions.map((session, sessionIndex) => (
                    <details
                      key={session.sessionId}
                      className="sessionArchiveCard"
                      open={dateIndex === 0 && sessionIndex === 0}
                    >
                      <summary className="sessionArchiveSummary">
                        <div className="sessionArchiveTitle">
                          <strong>{session.sessionTitle}</strong>
                          <span>{session.instructorName}</span>
                        </div>

                        <div className="sessionArchiveSummaryMeta">
                          <span>{formatTime(session.sessionStartsAt)}</span>
                          <span>
                            {session.sessionEndsAt ? formatTime(session.sessionEndsAt) : "Open session"}
                          </span>
                          <span>{session.totalStudentsScanned} scanned</span>
                          <span>{session.totalPresent} present</span>
                          <span>{session.totalLate} late</span>
                          <span>{session.totalAbsent} absent</span>
                        </div>
                      </summary>

                      <div className="sessionArchiveBody">
                        <div className="sessionArchiveStats">
                          <article>
                            <span>Course</span>
                            <strong>
                              {session.courseCode} - {session.courseTitle}
                            </strong>
                          </article>
                          <article>
                            <span>Session Start</span>
                            <strong>{formatDateTime(session.sessionStartsAt)}</strong>
                          </article>
                          <article>
                            <span>Session End</span>
                            <strong>
                              {session.sessionEndsAt ? formatDateTime(session.sessionEndsAt) : "Open"}
                            </strong>
                          </article>
                          <article>
                            <span>Instructor</span>
                            <strong>{session.instructorName}</strong>
                          </article>
                        </div>

                        <div className="sessionStudentArchive">
                          <div className="sessionStudentArchiveHeader">
                            <span>Student ID</span>
                            <span>Name</span>
                            <span>Status</span>
                            <span>Scan Time</span>
                            <span>Notes</span>
                          </div>

                          {session.students.map((student) => (
                            <div key={student.studentProfileId} className="sessionStudentArchiveRow">
                              <span>{student.studentId}</span>
                              <span>{student.studentName}</span>
                              <span>
                                <AttendanceStatusBadge status={student.status} />
                              </span>
                              <span>{formatDateTime(student.recordedAt)}</span>
                              <span>{student.notes}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="classTableCard" aria-label="Attendance records">
            <div className="classTableEmptyState">
              <div className="classTableEmptyIcon">
                <EmptyStateIcon />
              </div>
              <h2>No records yet</h2>
              <p>Select a course or change your filters to see results.</p>
            </div>
          </section>
        )}
      </div>
    </InstructorPageFrame>
  );
}
