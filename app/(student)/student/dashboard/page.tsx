import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { requireCurrentProfile } from "@/features/auth/guards";
import { getStudentDashboardData } from "@/features/attendance/student-attendance.service";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/student/dashboard", active: true },
  { label: "Attendance History", href: "/student/attendance-history", active: false },
];

function DashboardIcon({ color = "#1098ae", size = 18 }: { color?: string; size?: number }) {
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

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4b5563"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <path d="M15 17H5.5c1-1.2 1.5-2.9 1.5-5v-1a5 5 0 0 1 10 0v1c0 2.1.5 3.8 1.5 5H17" />
      <path d="M10 20a2 2 0 0 0 4 0" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 28, height: 28, flex: "none" }}
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6.5 19c1.7-3 3.8-4.5 6.5-4.5s4.8 1.5 6.5 4.5" />
    </svg>
  );
}

function AttendanceIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1098ae"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 44, height: 44, flex: "none" }}
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5v14" />
      <path d="M12 12h7" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1098ae"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 44, height: 44, flex: "none" }}
    >
      <rect x="5" y="4" width="14" height="16" rx="1.5" />
      <path d="M9 15v-3" />
      <path d="M12 15v-6" />
      <path d="M15 15v-2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
      <path d="M3.5 9.5h17" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
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

export default async function StudentDashboardPage() {
  const currentProfile = await requireCurrentProfile(["student", "admin"]);
  const dashboardData = await getStudentDashboardData();

  const profileName =
    currentProfile.profile.full_name || currentProfile.user.email || "Student User";
  const attendancePercentage = dashboardData.summary.totalSessions
    ? `${dashboardData.summary.presentRate}%`
    : "--";
  const attendanceSummary = dashboardData.summary.totalSessions
    ? `${dashboardData.summary.presentCount} Present / ${dashboardData.summary.totalSessions} Sessions`
    : "No data yet";
  const attendanceHint = dashboardData.summary.totalSessions
    ? `${dashboardData.summary.absentCount} absences recorded`
    : "Waiting for class data";

  return (
    <div className="pageShell dashboard-page">
      <aside className="sidebar">
        <div className="brandArea">
          <SidebarLogo />
        </div>

        <nav className="navList" aria-label="Student navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`navItem ${item.active ? "active" : ""}`}
            >
              {item.active ? (
                <DashboardIcon color={item.active ? "#ffffff" : "#6b7280"} />
              ) : (
                <HistoryIcon />
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

      <div className="mainPanel">
        <header className="topBar">
          <div className="topTitle">
            <DashboardIcon />
            <span>Dashboard</span>
          </div>

          <div className="topActions">
            <form action="/student/dashboard" method="get">
              <button type="submit" className="bellButton" aria-label="Refresh dashboard">
                <BellIcon />
              </button>
            </form>

            <div className="userBadge">
              <div className="userMeta">
                <p>{profileName}</p>
                <span>Active Session</span>
              </div>

              <div className="userAvatar">
                <UserIcon />
              </div>
            </div>
          </div>
        </header>

        <main className="contentArea">
          <section className="introBlock">
            <h1>Welcome back!</h1>
            <p>Here is your attendance overview for this semester.</p>
          </section>

          <section className="cardsGrid" aria-label="Attendance overview">
            <article className="statCard">
              <div className="cardVisual">
                <AttendanceIcon />
              </div>
              <h2>Attendance Percentage</h2>
              <strong>{attendancePercentage}</strong>
              <p>{attendanceHint}</p>
            </article>

            <article className="statCard">
              <div className="cardVisual">
                <SummaryIcon />
              </div>
              <h2>Attendance Summary</h2>
              <strong className="summaryMuted">{attendanceSummary}</strong>
              <p>Join a class to see more detailed analytics</p>
            </article>
          </section>

          <Link href="/student/attendance-history" className="historyButton">
            <CalendarIcon />
            <span>View Attendance History</span>
          </Link>
        </main>
      </div>
    </div>
  );
}
