import InstructorPageFrame from "@/components/InstructorPageFrame";
import { requireCurrentProfile } from "@/features/auth/guards";
import { getInstructorClassAttendanceData } from "@/features/attendance/instructor-records.service";

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default async function InstructorClassAttendancePage({
  searchParams,
}: {
  searchParams?: {
    courseId?: string;
    dateRange?: string;
    search?: string;
    page?: string;
  };
}) {
  await requireCurrentProfile(["instructor", "admin"]);

  const selectedCourseId = searchParams?.courseId || "";
  const selectedDateRange = searchParams?.dateRange || "this-week";
  const search = searchParams?.search || "";
  const currentPage = Number.parseInt(searchParams?.page || "1", 10);

  const classData = await getInstructorClassAttendanceData({
    courseId: selectedCourseId,
    dateRange: selectedDateRange,
    search,
    page: Number.isNaN(currentPage) ? 1 : currentPage,
  });

  const pageStart = classData.totalRecords === 0 ? 0 : (classData.currentPage - 1) * 10 + 1;
  const pageEnd = classData.totalRecords === 0 ? 0 : pageStart + classData.records.length - 1;

  return (
    <InstructorPageFrame activeNav="class-attendance">
      <div className="class-attendance-page instructor-page-content">
        <header className="pageHeader">
          <h1>Class Attendance</h1>
          <p>View and manage detailed student attendance history and records.</p>
        </header>

        <form className="classFiltersCard" aria-label="Attendance filters" method="get">
          <div className="classFilterGroup">
            <label htmlFor="class-course-filter">Course</label>
            <div className="selectField">
              <select id="class-course-filter" name="courseId" defaultValue={classData.selectedCourseId}>
                <option value="">All Courses</option>
                {classData.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </select>
              <ChevronDownIcon />
            </div>
          </div>

          <div className="classFilterGroup">
            <label htmlFor="class-date-filter">Date Range</label>
            <div className="selectField">
              <select id="class-date-filter" name="dateRange" defaultValue={classData.selectedDateRange}>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="all-time">All Time</option>
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
                name="search"
                type="text"
                placeholder="Search by Student ID or Name"
                defaultValue={classData.search}
              />
            </div>
          </div>

          <button type="submit" hidden aria-hidden="true" />
        </form>

        <section className="classTableCard" aria-label="Attendance records">
          <div className="classTableHeader">
            <span>Student ID</span>
            <span>Student Name</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {classData.records.length > 0 ? (
            <div>
              {classData.records.map((record) => (
                <div key={record.id} className="classTableHeader">
                  <span>{record.studentId}</span>
                  <span>{record.studentName}</span>
                  <span>{formatDate(record.occurredAt)}</span>
                  <span>{record.status}</span>
                  <span>{record.notes}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="classTableEmptyState">
              <div className="classTableEmptyIcon">
                <EmptyStateIcon />
              </div>
              <h2>No records yet</h2>
              <p>Select a course or change your filters to see results.</p>
            </div>
          )}

          <footer className="classTableFooter">
            <p>
              Showing {pageStart}-{pageEnd} of {classData.totalRecords} records
            </p>

            <div className="paginationButtons" aria-label="Pagination">
              <form method="get">
                <input type="hidden" name="courseId" value={classData.selectedCourseId} />
                <input type="hidden" name="dateRange" value={classData.selectedDateRange} />
                <input type="hidden" name="search" value={classData.search} />
                <input
                  type="hidden"
                  name="page"
                  value={String(Math.max(classData.currentPage - 1, 1))}
                />
                <button
                  type="submit"
                  className="paginationButton"
                  aria-label="Previous page"
                  disabled={classData.currentPage <= 1}
                >
                  <PaginationArrow direction="left" />
                </button>
              </form>

              <form method="get">
                <input type="hidden" name="courseId" value={classData.selectedCourseId} />
                <input type="hidden" name="dateRange" value={classData.selectedDateRange} />
                <input type="hidden" name="search" value={classData.search} />
                <input
                  type="hidden"
                  name="page"
                  value={String(Math.min(classData.currentPage + 1, classData.totalPages))}
                />
                <button
                  type="submit"
                  className="paginationButton"
                  aria-label="Next page"
                  disabled={classData.currentPage >= classData.totalPages}
                >
                  <PaginationArrow direction="right" />
                </button>
              </form>
            </div>
          </footer>
        </section>
      </div>
    </InstructorPageFrame>
  );
}
