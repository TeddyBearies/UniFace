import Link from "next/link";
import { redirect } from "next/navigation";
import { getInstructorDashboardData } from "@/features/attendance/instructor-dashboard";

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
    return <ScanIcon color="#1098ae" size={18} />;
  }

  if (kind === "student") {
    return <StudentAddIcon color="#1098ae" size={18} />;
  }

  if (kind === "attendance") {
    return <AttendanceListIcon color="#1098ae" size={18} />;
  }

  return <ReportsIcon color="#1098ae" size={18} />;
}

function ActionArtwork({ kind }: { kind: string }) {
  if (kind === "scan") {
    return (
      <svg aria-hidden="true" viewBox="0 0 220 180" className="actionArtwork">
        <g fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="42" y="34" width="136" height="114" rx="7" />
          <path d="M42 64h136" />
          <rect x="58" y="25" width="14" height="28" rx="7" />
          <rect x="148" y="25" width="14" height="28" rx="7" />
          <rect x="58" y="86" width="22" height="22" rx="2" />
          <rect x="58" y="117" width="22" height="22" rx="2" />
          <rect x="58" y="55" width="22" height="22" rx="2" />
          <circle cx="110" cy="66" r="11" />
          <path d="M95 85c3-8 8-12 15-12s12 4 15 12" />
          <circle cx="110" cy="97" r="11" />
          <path d="M95 116c3-8 8-12 15-12s12 4 15 12" />
          <circle cx="110" cy="128" r="11" />
          <path d="M95 147c3-8 8-12 15-12s12 4 15 12" />
          <path d="M137 58h20" />
          <path d="M137 70h20" />
          <path d="M137 89h20" />
          <path d="M137 101h20" />
          <path d="M137 120h20" />
          <path d="M137 132h20" />
          <path d="m63 65 5 5 10-11" />
          <path d="m63 96 5 5 10-11" />
          <path d="m63 127 5 5 10-11" />
        </g>
      </svg>
    );
  }

  if (kind === "enroll") {
    return (
      <svg aria-hidden="true" viewBox="0 0 220 180" className="actionArtwork">
        <g fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M55 28h88l30 30v94H55z" />
          <path d="M143 28v30h30" />
          <circle cx="102" cy="58" r="12" />
          <path d="M82 90c4-11 11-16 20-16s16 5 20 16" />
          <circle cx="72" cy="96" r="8" />
          <path d="m68 96 3 3 6-7" />
          <path d="M78 110h54" />
          <path d="M72 124h60" />
          <path d="M72 138h49" />
          <path d="m138 141 15-43 11 10-15 43" />
          <path d="m153 94 11 10" />
          <path d="M95 156c8 0 4-18 17-18" />
        </g>
      </svg>
    );
  }

  if (kind === "class") {
    return (
      <svg aria-hidden="true" viewBox="0 0 220 180" className="actionArtwork">
        <g fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m40 46 16 16 32-32" />
          <path d="m92 46 16 16 32-32" />
          <path d="m144 46 16 16 32-32" />
          <circle cx="55" cy="100" r="17" />
          <path d="M37 148v-15c0-11 8-19 18-19s18 8 18 19v15" />
          <circle cx="110" cy="100" r="17" />
          <path d="M92 148v-15c0-11 8-19 18-19s18 8 18 19v15" />
          <circle cx="165" cy="100" r="17" />
          <path d="M147 148v-15c0-11 8-19 18-19s18 8 18 19v15" />
        </g>
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 220 180" className="actionArtwork">
      <g fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 48h72c9 0 16 7 16 16v58c0 9-7 16-16 16H58c-9 0-16-7-16-16V64c0-9 7-16 16-16Z" />
        <path d="M70 68h48" />
        <path d="M70 89h56" />
        <path d="M70 110h48" />
        <path d="M70 131h34" />
        <path d="M132 53h22c9 0 16 7 16 16v51" />
        <path d="M132 72h38" />
        <path d="M136 89h10" />
        <path d="M151 89h10" />
        <path d="M166 89h10" />
        <path d="M136 82v25" />
        <path d="M151 74v33" />
        <path d="M166 65v42" />
        <circle cx="168" cy="126" r="26" />
        <path d="m156 126 8 8 17-18" />
        <path d="M42 48 80 10h50c8 0 15 7 15 15v23" />
        <path d="M80 10v38H42" />
      </g>
    </svg>
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

        <button type="button" className="logoutStrip">
          <LogoutIcon />
          <span>LOGOUT</span>
        </button>
      </aside>

      <div className="mainPanel">
        <header className="topBar">
          <div className="topTitle">Dashboard</div>

          <div className="topActions">
            <button type="button" className="bellButton" aria-label="Notifications">
              <BellIcon />
            </button>

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
