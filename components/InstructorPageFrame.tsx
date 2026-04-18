import type { ReactNode } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

type InstructorNavKey =
  | "dashboard"
  | "take-attendance"
  | "enroll-student"
  | "class-attendance"
  | "reports";

type InstructorPageFrameProps = {
  activeNav: InstructorNavKey;
  children: ReactNode;
};

const NAV_ITEMS: Array<{
  key: InstructorNavKey;
  label: string;
  href: string;
}> = [
  { key: "dashboard", label: "Dashboard", href: "/instructor/dashboard" },
  { key: "take-attendance", label: "Take Attendance", href: "/instructor/take-attendance" },
  { key: "enroll-student", label: "Enroll New Student", href: "/instructor/enroll-student" },
  { key: "class-attendance", label: "Class Attendance", href: "/instructor/class-attendance" },
  { key: "reports", label: "Reports", href: "/instructor/reports" },
];

function SidebarLogo() {
  return (
    <Link href="/instructor/dashboard" style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 4px' }}>
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

function NavIcon({ kind, active }: { kind: InstructorNavKey; active: boolean }) {
  const color = active ? "#ffffff" : "#475467";

  if (kind === "dashboard") {
    return <DashboardIcon color={color} />;
  }

  if (kind === "take-attendance") {
    return <ScanIcon color={color} />;
  }

  if (kind === "enroll-student") {
    return <StudentAddIcon color={color} />;
  }

  if (kind === "class-attendance") {
    return <AttendanceListIcon color={color} />;
  }

  return <ReportsIcon color={color} />;
}

export default function InstructorPageFrame({
  activeNav,
  children,
}: InstructorPageFrameProps) {
  return (
    <div className="pageShell instructor-tool-page">
      <aside className="sidebar">
        <div className="brandArea">
          <SidebarLogo />
        </div>

        <nav className="navList" aria-label="Instructor navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`navItem ${item.key === activeNav ? "active" : ""}`}
            >
              <NavIcon kind={item.key} active={item.key === activeNav} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <LogoutButton className="logoutStrip">
          <LogoutIcon />
          <span>LOGOUT</span>
        </LogoutButton>
      </aside>

      <main className="workspace">{children}</main>
    </div>
  );
}
