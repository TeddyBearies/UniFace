import Link from "next/link";
import AdminPageFrame from "@/components/AdminPageFrame";
import { getAdminDashboardData } from "@/features/reports/admin-dashboard.service";

const OVERVIEW_CARDS = [
  {
    title: "TOTAL USERS",
    valueKey: "totalUsers",
    hint: "Registered accounts",
    icon: "users",
  },
  {
    title: "ACTIVE COURSES",
    valueKey: "activeCourses",
    hint: "Available this term",
    icon: "courses",
  },
  {
    title: "FACE DATA SCANS",
    valueKey: "faceDataScans",
    hint: "Total attendance events",
    icon: "scan",
  },
  {
    title: "PENDING REPORTS",
    valueKey: "pendingReports",
    hint: "Open attendance sessions",
    icon: "reports",
  },
] as const;

const QUICK_LINKS = [
  {
    title: "Manage Users",
    description: "Add, edit, or remove system users.",
    href: "/admin/user-management",
    icon: "users",
  },
  {
    title: "Course Assignments",
    description: "Assign students to course lists.",
    href: "/admin/course-assignment",
    icon: "courses",
  },
  {
    title: "Reset Biometrics",
    description: "Manage user facial data security.",
    href: "/admin/reset-face-data",
    icon: "reset",
  },
  {
    title: "View Reports",
    description: "Export attendance and system logs.",
    href: "/admin/reports",
    icon: "reports",
  },
] as const;

function OverviewIcon({ kind }: { kind: (typeof OVERVIEW_CARDS)[number]["icon"] }) {
  if (kind === "users") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#9bdbe5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adminMiniIcon">
        <circle cx="8" cy="10" r="2.3" />
        <circle cx="15.5" cy="9" r="1.9" />
        <path d="M4.7 17c.7-2.1 1.9-3.2 3.3-3.2 1.5 0 2.7 1.1 3.4 3.2" />
        <path d="M13.1 15.9c.5-1.5 1.4-2.2 2.5-2.2s2 .7 2.5 2.2" />
      </svg>
    );
  }

  if (kind === "courses") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#9bdbe5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adminMiniIcon">
        <rect x="5" y="4.5" width="14" height="15" rx="1.5" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    );
  }

  if (kind === "scan") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#9bdbe5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adminMiniIcon">
        <path d="M8 4H5a1 1 0 0 0-1 1v3" />
        <path d="M16 4h3a1 1 0 0 1 1 1v3" />
        <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
        <path d="M16 20h3a1 1 0 0 0 1-1v-3" />
        <circle cx="12" cy="12" r="3.3" />
        <path d="M12 8.7v.01" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#b6e7df" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adminMiniIcon">
      <path d="M7.5 4.5h9l1.5 2v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-12z" />
      <path d="M9.5 8.5h5" />
      <path d="M12 11v5" />
    </svg>
  );
}

function QuickLinkIcon({ kind }: { kind: (typeof QUICK_LINKS)[number]["icon"] }) {
  if (kind === "users") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#1692a8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="adminActionIcon">
        <circle cx="9" cy="8" r="2.6" />
        <path d="M4.8 18c.8-2.6 2.2-4 4.2-4s3.4 1.4 4.2 4" />
        <path d="M16 7h4" />
        <path d="M18 5v4" />
      </svg>
    );
  }

  if (kind === "courses") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#1692a8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="adminActionIcon">
        <path d="M9 4h6" />
        <path d="M10 3h4a1 1 0 0 1 1 1v1H9V4a1 1 0 0 1 1-1Z" />
        <path d="M7 5.5H6a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 18 5.5h-1" />
        <path d="m9.2 12 1.8 1.8 3.8-4.3" />
      </svg>
    );
  }

  if (kind === "reset") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#1692a8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="adminActionIcon">
        <path d="M4 12a8 8 0 1 0 3-6.2" />
        <path d="M4 5v5h5" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#1692a8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="adminActionIcon">
      <path d="M4 20h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-7" />
    </svg>
  );
}

function LogIcon({ kind }: { kind: "info" | "sync" | "shield" }) {
  if (kind === "info") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#1692a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adminLogIcon">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 10v5" />
        <path d="M12 7h.01" />
      </svg>
    );
  }

  if (kind === "sync") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#1692a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adminLogIcon">
        <path d="M7 7h4V3" />
        <path d="M17 17h-4v4" />
        <path d="M17 7a6 6 0 0 0-10-1" />
        <path d="M7 17a6 6 0 0 0 10 1" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#1692a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adminLogIcon">
      <path d="M12 3 6 5.5v5.7c0 4.1 2.5 7.9 6 9.8 3.5-1.9 6-5.7 6-9.8V5.5z" />
      <path d="m9.5 12 1.7 1.7 3.3-3.8" />
    </svg>
  );
}

function SectionSparkIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="#1692a8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="adminSectionIcon">
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    </svg>
  );
}

export default async function AdminDashboardPage() {
  const dashboardData = await getAdminDashboardData();

  return (
    <AdminPageFrame
      activeNav="dashboard"
      title="Dashboard"
      profileLabel={dashboardData.profileLabel}
    >
      <section className="adminDashboardPage">
        <header className="adminIntro">
          <h1>System Overview</h1>
          <p>Real-time monitoring and administrative controls.</p>
        </header>

        <section className="adminOverviewGrid" aria-label="System overview">
          {OVERVIEW_CARDS.map((card) => (
            <article key={card.title} className="adminOverviewCard">
              <div className="adminOverviewHeader">
                <span>{card.title}</span>
                <OverviewIcon kind={card.icon} />
              </div>
              <strong>{dashboardData.stats[card.valueKey]}</strong>
              <p>{card.hint}</p>
            </article>
          ))}
        </section>

        <section className="adminQuickLinksSection" aria-labelledby="admin-quick-links-title">
          <div className="adminSectionHeading">
            <SectionSparkIcon />
            <h2 id="admin-quick-links-title">Quick Management Links</h2>
          </div>

          <div className="adminQuickLinksGrid">
            {QUICK_LINKS.map((link) => (
              <Link key={link.title} href={link.href} className="adminQuickLinkCard">
                <QuickLinkIcon kind={link.icon} />
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="adminLogsCard" aria-labelledby="admin-system-logs-title">
          <div className="adminLogsHeader">
            <h2 id="admin-system-logs-title">System Logs</h2>
            <Link href="/admin/reports" className="adminLogsViewAll">
              View All
            </Link>
          </div>

          <div className="adminLogsList">
            {dashboardData.logs.map((log, index) => (
              <article key={`${log.title}-${index}`} className="adminLogItem">
                <div className="adminLogIconWrap">
                  <LogIcon kind={log.icon} />
                </div>
                <div className="adminLogText">
                  <h3>{log.title}</h3>
                  <p>{log.time}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </AdminPageFrame>
  );
}
