import AdminPageFrame from "@/components/AdminPageFrame";
import { requireCurrentProfile } from "@/features/auth/guards";
import { getInstructorReportData } from "@/features/attendance/instructor-records.service";

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

function GenerateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <path d="M4 5h16v14H4z" />
      <path d="M7 9h10" />
      <path d="M7 13h6" />
      <path d="M8 17h2" />
    </svg>
  );
}

function DownloadIcon({ color = "#98a2b3" }: { color?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 20h14" />
    </svg>
  );
}

function EmptyStateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c8cfdb"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 44, height: 44, flex: "none" }}
    >
      <path d="M4 4h7.2L20 12.8V20H7a3 3 0 0 1-3-3z" />
      <path d="M11.2 4v8.8H20" />
      <path d="m4 4 16 16" />
    </svg>
  );
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams?: {
    courseId?: string;
    fromDate?: string;
    toDate?: string;
    generate?: string;
  };
}) {
  const currentProfile = await requireCurrentProfile(["admin"]);

  const selectedCourseId = searchParams?.courseId || "";
  const selectedFromDate = searchParams?.fromDate || "";
  const selectedToDate = searchParams?.toDate || "";
  const shouldGenerate = searchParams?.generate === "1";

  const reportData = await getInstructorReportData({
    courseId: selectedCourseId,
    fromDate: selectedFromDate,
    toDate: selectedToDate,
    generated: shouldGenerate,
  });

  const hasReportRows = reportData.csvRows.length > 0;

  return (
    <AdminPageFrame
      activeNav="reports"
      title="Reports"
      profileLabel={currentProfile.profile?.full_name || currentProfile.user.email || "Admin"}
    >
      <div className="reports-page adminReportsPage instructor-page-content">
        <header className="pageHeader">
          <h1>Admin Reports</h1>
          <p>Generate and export global attendance reports across all courses.</p>
        </header>

        <form className="reportsFiltersCard" aria-label="Report filters" method="get">
          <div className="reportFilterGroup courseGroup">
            <label htmlFor="report-course">Select Course</label>
            <div className="selectField">
              <select id="report-course" name="courseId" defaultValue={reportData.selectedCourseId}>
                <option value="">All Courses</option>
                {reportData.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="reportFilterGroup dateGroup">
            <label>Date Range</label>
            <div className="reportDateRow">
              <div className="reportDateField">
                <input
                  type="date"
                  name="fromDate"
                  aria-label="Start date"
                  defaultValue={reportData.selectedFromDate}
                />
              </div>
              <span className="dateConnector">to</span>
              <div className="reportDateField">
                <input
                  type="date"
                  name="toDate"
                  aria-label="End date"
                  defaultValue={reportData.selectedToDate}
                />
              </div>
            </div>
          </div>

          <div className="reportActionGroup">
            <button
              type="submit"
              className="primaryAction reportPrimaryAction"
              name="generate"
              value="1"
            >
              <GenerateIcon />
              <span>Generate Report</span>
            </button>
            <button
              type="submit"
              className="downloadAction"
              formAction="/api/admin/reports"
              formMethod="get"
              aria-label="Download report"
              disabled={!hasReportRows}
            >
              <DownloadIcon />
            </button>
          </div>
        </form>

        <section className="reportPanel" aria-label="Attendance report summary">
          <div className="reportEmptyState">
            <div className="reportEmptyIconBox">
              <EmptyStateIcon />
            </div>

            {!reportData.generated && (
              <>
                <h2>No data available</h2>
                <p>
                  Please select a course and date range above to
                  <br />
                  generate an attendance report summary.
                </p>
              </>
            )}

            {reportData.generated && !hasReportRows && (
              <>
                <h2>No records found</h2>
                <p>
                  The selected filters returned no attendance records.
                  <br />
                  Try widening the date range or selecting another course.
                </p>
              </>
            )}

            {reportData.generated && hasReportRows && (
              <>
                <h2>Report ready</h2>
                <p>
                  Sessions: {reportData.totals.totalSessions} | Expected Check-Ins:{" "}
                  {reportData.totals.expectedCheckIns}
                  <br />
                  Recorded Check-Ins: {reportData.totals.recordedCheckIns} | Attendance Rate:{" "}
                  {reportData.totals.attendanceRate}%
                </p>
              </>
            )}
          </div>
        </section>

        <section className="adminReportBreakdownCard" aria-label="Report breakdown">
          <div className="adminReportBreakdownHeader">
            <span>COURSE</span>
            <span>SESSIONS</span>
            <span>EXPECTED</span>
            <span>RECORDED</span>
            <span>ABSENT</span>
            <span>RATE</span>
          </div>

          {reportData.generated && reportData.courseBreakdown.length > 0 ? (
            <div>
              {reportData.courseBreakdown.map((courseRow) => (
                <div key={courseRow.courseId} className="adminReportBreakdownRow">
                  <span>
                    <strong>{courseRow.courseCode}</strong>
                    <small>{courseRow.courseTitle}</small>
                  </span>
                  <span>{courseRow.sessions}</span>
                  <span>{courseRow.expected}</span>
                  <span>{courseRow.recorded}</span>
                  <span>{courseRow.absent}</span>
                  <span>{courseRow.attendanceRate}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="adminReportBreakdownEmpty">Generate a report to view course-level details.</p>
          )}
        </section>

        <form action="/api/admin/reports" method="get">
          <input type="hidden" name="courseId" value={reportData.selectedCourseId} />
          <input type="hidden" name="fromDate" value={reportData.selectedFromDate} />
          <input type="hidden" name="toDate" value={reportData.selectedToDate} />
          <button type="submit" className="exportCsvLink" disabled={!hasReportRows}>
            <DownloadIcon color="#6c7a91" />
            <span>Export CSV</span>
          </button>
        </form>
      </div>
    </AdminPageFrame>
  );
}
