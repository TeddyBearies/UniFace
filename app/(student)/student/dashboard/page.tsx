"use client";

const NAV_ITEMS = [
  { label: "Dashboard", active: true },
  { label: "Attendance History", active: false },
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

export default function StudentDashboardPage() {
  return (
    <div className="pageShell">
      <aside className="sidebar">
        <div className="brandArea">
          <SidebarLogo />
        </div>

        <nav className="navList" aria-label="Student navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`navItem ${item.active ? "active" : ""}`}
            >
              {item.active ? (
                <DashboardIcon color={item.active ? "#ffffff" : "#6b7280"} />
              ) : (
                <HistoryIcon />
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="logoutStrip">
          <LogoutIcon />
          <span>LOGOUT</span>
        </button>
      </aside>

      <div className="mainPanel">
        <header className="topBar">
          <div className="topTitle">
            <DashboardIcon />
            <span>Dashboard</span>
          </div>

          <div className="topActions">
            <button type="button" className="bellButton" aria-label="Notifications">
              <BellIcon />
            </button>

            <div className="userBadge">
              <div className="userMeta">
                <p>Student User</p>
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
              <strong>--</strong>
              <p>Waiting for class data</p>
            </article>

            <article className="statCard">
              <div className="cardVisual">
                <SummaryIcon />
              </div>
              <h2>Attendance Summary</h2>
              <strong className="summaryMuted">No data yet</strong>
              <p>Join a class to see statistics</p>
            </article>
          </section>

          <button type="button" className="historyButton">
            <CalendarIcon />
            <span>View Attendance History</span>
          </button>
        </main>
      </div>

      <style jsx>{`
        .pageShell {
          --accent: #1098ae;
          --accent-dark: #0d8699;
          --border: #e7eaf0;
          --text: #16213d;
          --muted: #7a8496;
          display: flex;
          min-height: 100vh;
          background: #f7f8fc;
          color: var(--text);
        }

        .sidebar {
          width: 192px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border-right: 1px solid var(--border);
        }

        .brandArea {
          display: flex;
          align-items: center;
          padding: 18px 18px 16px;
          min-height: 68px;
          border-bottom: 1px solid var(--border);
        }

        .navList {
          padding: 12px 0;
        }

        .navItem {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 32px;
          padding: 0 16px;
          border: 0;
          background: transparent;
          color: #4b5563;
          font: inherit;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
        }

        .navItem + .navItem {
          margin-top: 8px;
        }

        .navItem.active {
          margin-right: 0;
          border-radius: 0 8px 8px 0;
          background: var(--accent);
          color: #ffffff;
          box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.08);
        }

        .logoutStrip {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          min-height: 54px;
          padding: 0 16px;
          border: 0;
          border-top: 1px solid var(--border);
          background: #ffffff;
          color: #4b5563;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          text-align: left;
        }

        .mainPanel {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .topBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 68px;
          padding: 0 24px;
          background: #ffffff;
          border-bottom: 1px solid var(--border);
        }

        .topTitle {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 700;
        }

        .topActions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .bellButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .userBadge {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .userMeta {
          text-align: right;
          line-height: 1.2;
        }

        .userMeta p {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .userMeta span {
          color: #9aa3b1;
          font-size: 12px;
        }

        .userAvatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--accent);
        }

        .contentArea {
          padding: 24px 24px 32px;
        }

        .introBlock h1 {
          margin: 0;
          font-size: 28px;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .introBlock p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 15px;
        }

        .cardsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 28px;
          max-width: 720px;
        }

        .statCard {
          padding: 16px 18px 22px;
          border: 1px solid #eceef4;
          border-radius: 6px;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          text-align: center;
        }

        .cardVisual {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 118px;
          margin-bottom: 12px;
          border: 1px dashed #e6ebf2;
          border-radius: 4px;
          background: #ffffff;
        }

        .statCard h2 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #25314b;
        }

        .statCard strong {
          display: block;
          margin-top: 14px;
          color: var(--accent);
          font-size: 28px;
          line-height: 1;
          font-weight: 800;
        }

        .statCard .summaryMuted {
          color: #7f8898;
          font-size: 14px;
          font-weight: 500;
        }

        .statCard p {
          margin: 12px 0 0;
          color: #98a1af;
          font-size: 14px;
        }

        .historyButton {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 22px;
          min-height: 36px;
          padding: 0 16px;
          border: 0;
          border-radius: 3px;
          background: var(--accent);
          color: #ffffff;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(16, 152, 174, 0.24);
          cursor: pointer;
        }

        .historyButton:hover,
        .navItem:hover,
        .logoutStrip:hover,
        .bellButton:hover {
          filter: brightness(0.98);
        }

        @media (max-width: 900px) {
          .pageShell {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            border-right: 0;
            border-bottom: 1px solid var(--border);
          }

          .brandArea {
            min-height: auto;
          }

          .navList {
            display: flex;
            gap: 8px;
            padding: 12px 14px;
            overflow-x: auto;
          }

          .navItem {
            width: auto;
            min-width: max-content;
            padding: 0 14px;
          }

          .navItem.active {
            border-radius: 8px;
          }

          .logoutStrip {
            display: none;
          }

          .cardsGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .topBar {
            padding: 14px 16px;
            align-items: flex-start;
            flex-direction: column;
          }

          .topActions {
            width: 100%;
            justify-content: space-between;
          }

          .userBadge {
            margin-left: auto;
          }

          .contentArea {
            padding: 20px 16px 28px;
          }

          .introBlock h1 {
            font-size: 24px;
          }

          .cardsGrid {
            margin-top: 22px;
          }
        }
      `}</style>
    </div>
  );
}
