import InstructorPageFrame from "@/components/InstructorPageFrame";
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

function FadedBarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#eef2f7"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 28, height: 28, flex: "none", opacity: 0.55 }}
    >
      <path d="M4 20h16" />
      <path d="M8 20v-7" />
      <path d="M12 20V9" />
      <path d="M16 20v-4" />
    </svg>
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <article className="reportSummaryStat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default async function InstructorReportsPage({
  searchParams,
}: {
  searchParams?: {
    courseId?: string;
    fromDate?: string;
    toDate?: string;
    generate?: string;
  };
}) {
  await requireCurrentProfile(["instructor", "admin"]);

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
    <InstructorPageFrame activeNav="reports">
      <div className="reports-page instructor-page-content">
        <header className="pageHeader">
          <h1>Instructor Reports</h1>
          <p>Generate and export attendance reports for your courses.</p>
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
              formAction="/api/instructor/reports"
              formMethod="get"
              aria-label="Download report"
              disabled={!hasReportRows}
            >
              <DownloadIcon />
            </button>
          </div>
        </form>

        <section className="reportPanel" aria-label="Attendance report summary">
          {!reportData.generated || !hasReportRows ? (
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

              <div className="reportDecorRow" aria-hidden="true">
                <FadedBarIcon />
                <FadedBarIcon />
                <FadedBarIcon />
              </div>
            </div>
          ) : (
            <div className="reportResults">
              <div className="reportSummaryGrid">
                <SummaryStat label="Sessions" value={reportData.totals.totalSessions} />
                <SummaryStat
                  label="Expected Check-Ins"
                  value={reportData.totals.expectedCheckIns}
                />
                <SummaryStat
                  label="Recorded Check-Ins"
                  value={reportData.totals.recordedCheckIns}
                />
                <SummaryStat
                  label="Attendance Rate"
                  value={`${reportData.totals.attendanceRate}%`}
                />
              </div>

              <div className="reportBreakdownCard">
                <div className="reportBreakdownHeader">
                  <h2>Course Breakdown</h2>
                  <p>{reportData.courseBreakdown.length} course view(s)</p>
                </div>

                <div className="reportBreakdownTable" role="table" aria-label="Course breakdown">
                  <div className="reportBreakdownRow reportBreakdownHead" role="row">
                    <span>Course</span>
                    <span>Sessions</span>
                    <span>Expected</span>
                    <span>Recorded</span>
                    <span>Absent</span>
                    <span>Rate</span>
                  </div>

                  {reportData.courseBreakdown.map((course) => (
                    <div key={course.courseId} className="reportBreakdownRow" role="row">
                      <span>
                        {course.courseCode} - {course.courseTitle}
                      </span>
                      <span>{course.sessions}</span>
                      <span>{course.expected}</span>
                      <span>{course.recorded}</span>
                      <span>{course.absent}</span>
                      <span>{course.attendanceRate}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <form action="/api/instructor/reports" method="get">
          <input type="hidden" name="courseId" value={reportData.selectedCourseId} />
          <input type="hidden" name="fromDate" value={reportData.selectedFromDate} />
          <input type="hidden" name="toDate" value={reportData.selectedToDate} />
          <button type="submit" className="exportCsvLink" disabled={!hasReportRows}>
            <DownloadIcon color="#6c7a91" />
            <span>Export CSV</span>
          </button>
        </form>
      </div>
    </InstructorPageFrame>
  );
}
