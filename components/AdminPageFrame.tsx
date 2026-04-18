import type { ReactNode } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

type AdminNavKey =
  | "dashboard"
  | "user-management"
  | "course-assignment"
  | "reset-face-data"
  | "reports";

type AdminPageFrameProps = {
  activeNav: AdminNavKey;
  title: string;
  profileLabel?: string;
  children: ReactNode;
};

const NAV_ITEMS: Array<{
  key: AdminNavKey;
  label: string;
  href: string;
}> = [
    { key: "dashboard", label: "Dashboard", href: "/admin/dashboard" },
    { key: "user-management", label: "User Management", href: "/admin/user-management" },
    { key: "course-assignment", label: "Course Assignment", href: "/admin/course-assignment" },
    { key: "reset-face-data", label: "Reset Face Data", href: "/admin/reset-face-data" },
    { key: "reports", label: "Reports", href: "/admin/reports" },
  ];

function SidebarLogo() {
  return (
    <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '0 4px' }}>
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

function UsersIcon({ color = "#475467", size = 18 }: { color?: string; size?: number }) {
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
      <circle cx="9" cy="8" r="2.6" />
      <path d="M4.8 18c.8-2.6 2.2-4 4.2-4s3.4 1.4 4.2 4" />
      <path d="M16 7h4" />
      <path d="M18 5v4" />
    </svg>
  );
}

function ClipboardIcon({ color = "#475467", size = 18 }: { color?: string; size?: number }) {
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
      <path d="M9 4h6" />
      <path d="M10 3h4a1 1 0 0 1 1 1v1H9V4a1 1 0 0 1 1-1Z" />
      <path d="M7 5.5H6a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 18 5.5h-1" />
      <path d="M8.5 12.5h7" />
      <path d="M8.5 16h7" />
    </svg>
  );
}

function ResetIcon({ color = "#475467", size = 18 }: { color?: string; size?: number }) {
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
      <path d="M3 3 21 21" />
      <path d="M12 5a7 7 0 0 1 7 7c0 1.2-.3 2.4-.9 3.3" />
      <path d="M5.8 8.1A7 7 0 0 0 12 19a7 7 0 0 0 2.8-.6" />
      <path d="M5 4v5h5" />
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

function NavIcon({ kind, active }: { kind: AdminNavKey; active: boolean }) {
  const color = active ? "#ffffff" : "#475467";

  if (kind === "dashboard") {
    return <DashboardIcon color={color} />;
  }

  if (kind === "user-management") {
    return <UsersIcon color={color} />;
  }

  if (kind === "course-assignment") {
    return <ClipboardIcon color={color} />;
  }

  if (kind === "reset-face-data") {
    return <ResetIcon color={color} />;
  }

  return <ReportsIcon color={color} />;
}

export default function AdminPageFrame({
  activeNav,
  title,
  profileLabel = "Admin",
  children,
}: AdminPageFrameProps) {
  return (
    <div className="pageShell admin-page-shell">
      <aside className="sidebar">
        <div className="brandArea">
          <SidebarLogo />
        </div>

        <nav className="navList" aria-label="Admin navigation">
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

      <div className="mainPanel">
        {title === "Dashboard" && (
          <header className="topBar">
          <div className="topTitle">
            {title === "Dashboard" && <DashboardIcon color="#101a39" />}
            <span>{title}</span>
          </div>

          <div className="topActions">
            <form method="get">
              <button type="submit" className="bellButton" aria-label="Refresh page">
                <BellIcon />
              </button>
            </form>

            <div className="userBadge">
              <div className="userMeta">
                <p>{profileLabel}</p>
                <span>Active Session</span>
              </div>

              <div className="userAvatar">
                <UserIcon />
              </div>
            </div>
          </div>
        </header>
        )}

        <main className="contentArea">{children}</main>
      </div>
    </div>
  );
}
