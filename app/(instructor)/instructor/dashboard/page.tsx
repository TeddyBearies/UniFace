import Link from "next/link";
import { redirect } from "next/navigation";
import { getInstructorDashboardData } from "@/features/attendance/instructor-dashboard";
import LogoutButton from "@/components/LogoutButton";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/instructor/dashboard", active: true, icon: "dashboard" },
  { label: "Take Attendance", href: "/instructor/take-attendance", active: false, icon: "scan" },
  { label: "Enroll New Student", href: "/instructor/enroll-student", active: false, icon: "student" },
  { label: "Class Attendance", href: "/instructor/class-attendance", active: false, icon: "attendance" },
  { label: "Reports", href: "/instructor/reports", active: false, icon: "reports" },
];

const QUICK_ACTIONS = [
  {
    title: "Take Attendance",
    description: "Scan student IDs for today's classroom session",
    href: "/instructor/take-attendance",
    icon: "scan",
    accent: "qr",
  },
  {
    title: "Enroll New Student",
    description: "Register new students to the academic system",
    href: "/instructor/enroll-student",
    icon: "enroll",
    accent: "student",
  },
  {
    title: "Class Attendance",
    description: "View and manage comprehensive attendance records",
    href: "/instructor/class-attendance",
    icon: "class",
    accent: "attendance",
  },
  {
    title: "Reports",
    description: "Generate detailed academic and attendance reports",
    href: "/instructor/reports",
    icon: "reports",
    accent: "reports",
  },
];

const STAT_CARDS = [
  {
    key: "assignedCourses",
    label: "Assigned Courses",
  },
  {
    key: "activeStudents",
    label: "Active Students",
  },
  {
    key: "totalSessions",
    label: "Sessions Created",
  },
  {
    key: "openSessions",
    label: "Open Sessions",
  },
] as const;

function DashboardIcon({ color = "#475467", size = 18 }: { color?: string; size?: number }) {
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

function ScanIcon({ color = "#475467", size = 18 }: { color?: string; size?: number }) {
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
      <path d="M8 4H5a1 1 0 0 0-1 1v3" />
      <path d="M16 4h3a1 1 0 0 1 1 1v3" />
      <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
      <path d="M16 20h3a1 1 0 0 0 1-1v-3" />
      <path d="M8 8h1" />
      <path d="M12 8h1" />
      <path d="M16 8h.01" />
      <path d="M8 12h.01" />
      <path d="M12 12h1" />
      <path d="M16 12h.01" />
      <path d="M8 16h1" />
      <path d="M12 16h.01" />
      <path d="M16 16h1" />
    </svg>
  );
}

function StudentAddIcon({ color = "#475467", size = 18 }: { color?: string; size?: number }) {
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
      <path d="M4 19c1.2-2.8 3.3-4.2 6.2-4.2s5 1.4 6.2 4.2" />
      <circle cx="10.2" cy="8.2" r="3.1" />
      <path d="M18.5 8v6" />
      <path d="M15.5 11h6" />
    </svg>
  );
}

function AttendanceListIcon({ color = "#475467", size = 18 }: { color?: string; size?: number }) {
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
      <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h4" />
      <path d="m13.5 16 1.6 1.6 3-3" />
    </svg>
  );
}

function ReportsIcon({ color = "#475467", size = 18 }: { color?: string; size?: number }) {
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
      <path d="M4 20h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-7" />
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
    <img
      src="/user_placeholder.png"
      alt="User"
      style={{
        width: "70%",
        height: "70%",
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

function NavIcon({ kind, active }: { kind: string; active: boolean }) {
  const color = active ? "#ffffff" : "#475467";

  if (kind === "dashboard") {
    return <DashboardIcon color={color} />;
  }

  if (kind === "scan") {
    return <ScanIcon color={color} />;
  }

  if (kind === "student") {
    return <StudentAddIcon color={color} />;
  }

  if (kind === "attendance") {
    return <AttendanceListIcon color={color} />;
  }

  return <ReportsIcon color={color} />;
}

function CardAccentIcon({ kind }: { kind: string }) {
  if (kind === "qr") {
    return <ScanIcon color="#1692a8" size={18} />;
  }

  if (kind === "student") {
    return <StudentAddIcon color="#1692a8" size={18} />;
  }

  if (kind === "attendance") {
    return <AttendanceListIcon color="#1692a8" size={18} />;
  }

  return <ReportsIcon color="#1692a8" size={18} />;
}

function ActionArtwork({ kind }: { kind: string }) {
  if (kind === "scan") {
    return (
      <img
        src="/take_attendance_placeholder.png"
        alt="Take Attendance"
        className="actionArtwork"
      />
    );
  }

  if (kind === "enroll") {
    return (
      <img
        src="/enroll-new-student-placeholder.png"
        alt="Enroll New Student"
        className="actionArtwork"
      />
    );
  }

  if (kind === "class") {
    return (
      <img
        src="/class-attendance-placeholder.png"
        alt="Class Attendance"
        className="actionArtwork"
      />
    );
  }

  return (
    <img
      src="/reports_placeholder.png"
      alt="Reports"
      className="actionArtwork"
    />
  );
}

function formatSessionDate(value: string | null) {
  if (!value) {
    return "No sessions yet";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default async function InstructorDashboardPage() {
  const dashboardData = await getInstructorDashboardData();

  if (!dashboardData) {
    redirect("/login");
  }

  if (dashboardData.role !== "instructor" && dashboardData.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="pageShell instructor-dashboard-page">
      <aside className="sidebar">
        <div className="brandArea">
          <SidebarLogo />
        </div>

        <nav className="navList" aria-label="Instructor navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`navItem ${item.active ? "active" : ""}`}
            >
              <NavIcon kind={item.icon} active={item.active} />
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
          <div className="topTitle">Dashboard</div>

          <div className="topActions">
            <form action="/instructor/dashboard" method="get">
              <button type="submit" className="bellButton" aria-label="Refresh dashboard">
                <BellIcon />
              </button>
            </form>

            <div className="userBadge">
              <div className="userMeta">
                <p>{dashboardData.profileName}</p>
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
            <h1>Welcome back, {dashboardData.profileName}</h1>
            <p>
              Manage your classes, students, and attendance records efficiently from one
              central place.
            </p>
          </section>

          <section className="statsSection" aria-labelledby="instructor-overview-title">
            <h2 id="instructor-overview-title">Overview</h2>

            <div className="statsGrid">
              {STAT_CARDS.map((card) => (
                <article key={card.key} className="statCard">
                  <span>{card.label}</span>
                  <strong>{dashboardData.stats[card.key]}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="coursesSection" aria-labelledby="assigned-courses-title">
            <div className="sectionHeader">
              <h2 id="assigned-courses-title">Assigned Courses</h2>
              <span>{dashboardData.courses.length} total</span>
            </div>

            {dashboardData.courses.length > 0 ? (
              <div className="coursesGrid">
                {dashboardData.courses.map((course) => (
                  <article key={course.id} className="courseCard">
                    <div className="courseCardHeader">
                      <div>
                        <p className="courseCode">{course.code}</p>
                        <h3>{course.title}</h3>
                      </div>
                      <span className="courseSemester">{course.semester}</span>
                    </div>

                    <div className="courseMetaGrid">
                      <div className="courseMetaItem">
                        <span>Students</span>
                        <strong>{course.activeStudentCount}</strong>
                      </div>
                      <div className="courseMetaItem">
                        <span>Sessions</span>
                        <strong>{course.sessionCount}</strong>
                      </div>
                      <div className="courseMetaItem">
                        <span>Open Now</span>
                        <strong>{course.openSessionCount}</strong>
                      </div>
                      <div className="courseMetaItem">
                        <span>Latest Session</span>
                        <strong>{formatSessionDate(course.lastSessionAt)}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="emptyStateCard">
                <h3>No assigned courses yet</h3>
                <p>
                  Once this instructor is linked to courses in Supabase, they will appear
                  here automatically.
                </p>
              </div>
            )}
          </section>

          <section className="actionsSection" aria-labelledby="quick-actions-title">
            <h2 id="quick-actions-title">Quick Actions</h2>

            <div className="actionsGrid">
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.title} href={action.href} className="actionCard">
                  <div className="actionCardVisual">
                    <ActionArtwork kind={action.icon} />
                  </div>

                  <div className="actionCardBody">
                    <div className="actionCardHeader">
                      <h3>{action.title}</h3>
                      <CardAccentIcon kind={action.accent} />
                    </div>
                    <p>{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
