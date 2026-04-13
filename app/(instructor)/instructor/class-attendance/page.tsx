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

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#98a2b3"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 22, height: 22, flex: "none" }}
    >
      <circle cx="11" cy="11" r="6.8" />
      <path d="m20 20-3.8-3.8" />
    </svg>
  );
}

function EmptyStateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#94a3b8"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 42, height: 42, flex: "none" }}
    >
      <path d="M4 4h7.2L20 12.8V20H7a3 3 0 0 1-3-3z" />
      <path d="M11.2 4v8.8H20" />
      <path d="m4 4 16 16" />
    </svg>
  );
}

function PaginationArrow({ direction }: { direction: "left" | "right" }) {
  const path = direction === "left" ? "m14 7-5 5 5 5" : "m10 7 5 5-5 5";

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#d0d5dd"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <path d={path} />
    </svg>
  );
}

export default function InstructorClassAttendancePage() {
  return (
    <InstructorPageFrame activeNav="class-attendance">
      <div className="class-attendance-page instructor-page-content">
        <header className="pageHeader">
          <h1>Class Attendance</h1>
          <p>View and manage detailed student attendance history and records.</p>
        </header>

        <section className="classFiltersCard" aria-label="Attendance filters">
          <div className="classFilterGroup">
            <label htmlFor="class-course-filter">Course</label>
            <div className="selectField">
              <select id="class-course-filter" defaultValue="all-courses">
                <option value="all-courses">All Courses</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="classFilterGroup">
            <label htmlFor="class-date-filter">Date Range</label>
            <div className="selectField">
              <select id="class-date-filter" defaultValue="this-week">
                <option value="this-week">This Week</option>
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="classFilterGroup searchGroup">
            <label htmlFor="class-search-filter">Search Students</label>
            <div className="searchField">
              <SearchIcon />
              <input
                id="class-search-filter"
                type="text"
                placeholder="Search by Student ID or Name"
              />
            </div>
          </div>
        </section>

        <section className="classTableCard" aria-label="Attendance records">
          <div className="classTableHeader">
            <span>Student ID</span>
            <span>Student Name</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div className="classTableEmptyState">
            <div className="classTableEmptyIcon">
              <EmptyStateIcon />
            </div>
            <h2>No records yet</h2>
            <p>Select a course or change your filters to see results.</p>
          </div>

          <footer className="classTableFooter">
            <p>Showing 0 of 0 records</p>

            <div className="paginationButtons" aria-label="Pagination">
              <button type="button" className="paginationButton" aria-label="Previous page">
                <PaginationArrow direction="left" />
              </button>
              <button type="button" className="paginationButton" aria-label="Next page">
                <PaginationArrow direction="right" />
              </button>
            </div>
          </footer>
        </section>
      </div>
    </InstructorPageFrame>
  );
}
