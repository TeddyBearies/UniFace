import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { requireCurrentProfile } from "@/features/auth/guards";
import { getStudentDashboardData } from "@/features/attendance/student-attendance.service";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/student/dashboard", active: true },
  { label: "Attendance History", href: "/student/attendance-history", active: false },
];

function DashboardIcon({ color = "#1692a8", size = 18 }: { color?: string; size?: number }) {
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



function UserIcon() {
  return (
    <img
      src="/user_placeholder.png"
      alt="User"
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
        borderRadius: "14px",
      }}
    />
  );
}



function LogoutIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
    <Link href="/student/dashboard" style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 4px' }}>
      <img
        src="/faceScan_logo.png"
        alt="FaceScan Logo"
        style={{
          width: "auto",
          height: "100px",
          display: "block",
          objectFit: "contain",
        }}
      />
    </Link>
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
            <DashboardIcon color="#101a39" />
            <span>Dashboard</span>
          </div>

          <div className="topActions">

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
              <div className="statCardHeader">
                <h2>Attendance Percentage</h2>
                <img src="/attendance_percentage_placeholder.png" alt="Percentage Icon" />
              </div>
              <strong>{attendancePercentage}</strong>
              <p>{attendanceHint}</p>
            </article>

            <article className="statCard">
              <div className="statCardHeader">
                <h2>Attendance Summary</h2>
                <img src="/attendance_summary_placeholder.png" alt="Summary Icon" />
              </div>
              <strong className="summaryMuted">{attendanceSummary}</strong>
              <p>Join a class to see more detailed analytics</p>
            </article>

            <article className="statCard actionStatCard">
              <div className="statCardHeader">
                <h2>History</h2>
                <img src="/view_history_placeholder.png" alt="History Icon" />
              </div>
              <strong className="summaryMuted">Review Records</strong>
              <Link href="/student/attendance-history" className="historyLinkStretch" />
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
