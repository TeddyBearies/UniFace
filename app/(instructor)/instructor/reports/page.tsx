import InstructorPageFrame from "@/components/InstructorPageFrame";

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

export default function InstructorReportsPage() {
  return (
    <InstructorPageFrame activeNav="reports">
      <div className="reports-page instructor-page-content">
        <header className="pageHeader">
          <h1>Instructor Reports</h1>
          <p>Generate and export attendance reports for your courses.</p>
        </header>

        <section className="reportsFiltersCard" aria-label="Report filters">
          <div className="reportFilterGroup courseGroup">
            <label htmlFor="report-course">Select Course</label>
            <div className="selectField">
              <select id="report-course" defaultValue="">
                <option value="" disabled>
                  Choose a course...
                </option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="reportFilterGroup dateGroup">
            <label>Date Range</label>
            <div className="reportDateRow">
              <div className="reportDateField">
                <input type="text" aria-label="Start date" placeholder="mm/dd/yyyy" />
              </div>
              <span className="dateConnector">to</span>
              <div className="reportDateField">
                <input type="text" aria-label="End date" placeholder="mm/dd/yyyy" />
              </div>
            </div>
          </div>

          <div className="reportActionGroup">
            <button type="button" className="primaryAction reportPrimaryAction">
              <GenerateIcon />
              <span>Generate Report</span>
            </button>
            <button type="button" className="downloadAction" aria-label="Download report">
              <DownloadIcon />
            </button>
          </div>
        </section>

        <section className="reportPanel" aria-label="Attendance report summary">
          <div className="reportEmptyState">
            <div className="reportEmptyIconBox">
              <EmptyStateIcon />
            </div>

            <h2>No data available</h2>
            <p>
              Please select a course and date range above to
              <br />
              generate an attendance report summary.
            </p>

            <div className="reportDecorRow" aria-hidden="true">
              <FadedBarIcon />
              <FadedBarIcon />
              <FadedBarIcon />
            </div>
          </div>
        </section>

        <button type="button" className="exportCsvLink">
          <DownloadIcon color="#6c7a91" />
          <span>Export CSV</span>
        </button>
      </div>
    </InstructorPageFrame>
  );
}
