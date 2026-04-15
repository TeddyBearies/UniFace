import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getStudentAttendanceHistoryData } from "@/features/attendance/student-attendance.service";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/student/dashboard", active: false },
  { label: "Attendance History", href: "/student/attendance-history", active: true },
];

function DashboardIcon({ color = "#6b7280", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flex: "none" }}
    >
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function HistoryIcon({ color = "#6b7280", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flex: "none" }}
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4b5563"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <path d="M14 7V5.5A1.5 1.5 0 0 0 12.5 4h-7A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20h7a1.5 1.5 0 0 0 1.5-1.5V17" />
      <path d="M10 12h10" />
      <path d="m17 8 3 4-3 4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9aa3b1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CalendarIcon({ color = "#9aa3b1", size = 20 }: { color?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flex: "none" }}
    >
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
      <path d="M3.5 9.5h17" />
    </svg>
  );
}

function EmptyStateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9aa3b1"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 34, height: 34, flex: "none" }}
    >
      <path d="M6 4.5h8l4 4v11a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 19.5v-13A2 2 0 0 1 7 4.5Z" />
      <path d="M14 4.5v4h4" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function PresentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.3 2.5 2.5 5-5.6" />
    </svg>
  );
}

function AbsentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 8.5 7 7" />
      <path d="m15.5 8.5-7 7" />
    </svg>
  );
}

function LateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function SidebarLogo() {
  return (
    <img
      src="/haga-site-logo.svg"
      alt="Haga"
      style={{
        width: "42px",
        height: "42px",
        display: "block",
        objectFit: "contain",
      }}
    />
  );
}

function SummaryCardIcon({ tone }: { tone: string }) {
  if (tone === "success") {
    return <PresentIcon />;
  }

  if (tone === "danger") {
    return <AbsentIcon />;
  }

  return <LateIcon />;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AttendanceHistoryPage({
  searchParams,
}: {
  searchParams?: {
    courseId?: string;
    fromDate?: string;
    toDate?: string;
  };
}) {
  const selectedCourseId = searchParams?.courseId || "";
  const selectedFromDate = searchParams?.fromDate || "";
  const selectedToDate = searchParams?.toDate || "";

  const historyData = await getStudentAttendanceHistoryData({
    courseId: selectedCourseId,
    fromDate: selectedFromDate,
    toDate: selectedToDate,
  });

  return (
    <div className="pageShell student-history-page">
      <aside className="sidebar">
        <div className="brandArea">
          <SidebarLogo />
        </div>

        <nav className="navList" aria-label="Student navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className={`navItem ${item.active ? "active" : ""}`}>
              {item.active ? (
                <HistoryIcon color="#ffffff" />
              ) : (
                <DashboardIcon />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <LogoutButton className="logoutStrip">
          <LogoutIcon />
          <span>LOGOUT</span>
        </LogoutButton>
      </aside>

      <main className="historyMain">
        <section className="historyIntro">
          <h1>Attendance History</h1>
          <p>Review your historical attendance logs across all courses.</p>
        </section>

        <form className="filtersCard" aria-label="Attendance filters" method="get">
          <div className="filterGroup">
            <label htmlFor="course-filter">COURSE</label>
            <div className="fieldShell selectShell">
              <select id="course-filter" name="courseId" defaultValue={historyData.selectedCourseId}>
                <option value="">All Courses</option>
                {historyData.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="filterGroup">
            <label htmlFor="date-range">DATE RANGE</label>
            <div className="fieldShell dateShell" id="date-range">
              <CalendarIcon />
              <span>
                {historyData.selectedFromDate
                  ? formatDate(historyData.selectedFromDate)
                  : "mm/dd/yyyy"}
              </span>
              <span className="dateDivider" />
              <span>
                {historyData.selectedToDate
                  ? formatDate(historyData.selectedToDate)
                  : "mm/dd/yyyy"}
              </span>
            </div>
          </div>

          <input type="hidden" name="fromDate" value={historyData.selectedFromDate} />
          <input type="hidden" name="toDate" value={historyData.selectedToDate} />

          <button type="submit" className="applyButton">
            Apply Filters
          </button>
        </form>

        <section className="historyTableCard" aria-label="Attendance history table">
          <div className="tableHeader">
            <span>DATE &amp; TIME</span>
            <span>COURSE</span>
            <span>STATUS</span>
            <span>NOTES</span>
          </div>

          {historyData.records.length > 0 ? (
            <div>
              {historyData.records.map((record) => (
                <div key={record.id} className="tableHeader">
                  <span>{formatDateTime(record.recordedAt || record.sessionStartsAt)}</span>
                  <span>
                    {record.courseCode} - {record.courseTitle}
                  </span>
                  <span>{record.status}</span>
                  <span>{record.notes}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptyIconWrap">
                <EmptyStateIcon />
              </div>
              <h2>No records yet</h2>
              <p>
                Your attendance history will appear here once
                <br />
                you start checking into your classes.
              </p>
            </div>
          )}
        </section>

        <section className="summaryGrid" aria-label="Attendance summary metrics">
          <article className="summaryCard">
            <div className="summaryLabel">
              <SummaryCardIcon tone="success" />
              <span>PRESENT RATE</span>
            </div>
            <strong>{historyData.summary.presentRate}%</strong>
          </article>

          <article className="summaryCard">
            <div className="summaryLabel">
              <SummaryCardIcon tone="danger" />
              <span>ABSENT RATE</span>
            </div>
            <strong>{historyData.summary.absentRate}%</strong>
          </article>

          <article className="summaryCard">
            <div className="summaryLabel">
              <SummaryCardIcon tone="warning" />
              <span>LATE CHECK-INS</span>
            </div>
            <strong>{historyData.summary.lateCount}</strong>
          </article>
        </section>
      </main>
    </div>
  );
}
