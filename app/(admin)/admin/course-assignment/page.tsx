import AdminPageFrame from "@/components/AdminPageFrame";
import { requireCurrentProfile } from "@/features/auth/guards";

function AssignIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1098ae"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <circle cx="9" cy="8" r="2.5" />
      <path d="M4.8 18c.8-2.5 2.2-3.9 4.2-3.9s3.4 1.4 4.2 3.9" />
      <path d="M16.2 7h3.8" />
      <path d="M18.1 5.1v3.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a0a8b5"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <circle cx="11" cy="11" r="6.4" />
      <path d="m19 19-3.4-3.4" />
    </svg>
  );
}

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
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ClipboardCheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 15, height: 15, flex: "none" }}
    >
      <path d="M9 4h6" />
      <path d="M10 3h4a1 1 0 0 1 1 1v1H9V4a1 1 0 0 1 1-1Z" />
      <path d="M7 5.5H6a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 18 5.5h-1" />
      <path d="m9.2 12 1.8 1.8 3.8-4.3" />
    </svg>
  );
}

function EmptyInfoIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8f9cb2"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 34, height: 34, flex: "none" }}
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 10v5" />
      <path d="M12 7h.01" />
    </svg>
  );
}

export default async function AdminCourseAssignmentPage() {
  await requireCurrentProfile(["admin"]);

  return (
    <AdminPageFrame activeNav="course-assignment" title="">
      <section className="adminCourseAssignmentPage">
        <header className="adminCourseIntro">
          <h1>Course Assignment</h1>
          <p>Assign instructors to specific courses and manage existing pairings.</p>
        </header>

        <section className="adminAssignCard" aria-labelledby="assign-instructor-title">
          <div className="adminAssignHeader">
            <AssignIcon />
            <h2 id="assign-instructor-title">Assign New Instructor</h2>
          </div>

          <div className="adminAssignFormGrid">
            <div className="adminAssignField">
              <label htmlFor="assign-instructor">Select Instructor</label>
              <div className="adminAssignSelect">
                <select id="assign-instructor" defaultValue="">
                  <option value="" disabled>
                    Choose an instructor
                  </option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="adminAssignField">
              <label htmlFor="assign-course">Select Course</label>
              <div className="adminAssignSelect">
                <select id="assign-course" defaultValue="">
                  <option value="" disabled>
                    Choose a course
                  </option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <div className="adminAssignField">
              <label htmlFor="assign-semester">Semester</label>
              <div className="adminAssignSelect">
                <select id="assign-semester" defaultValue="">
                  <option value="" disabled>
                    Select Semester
                  </option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          <div className="adminAssignActions">
            <button type="button" className="adminAssignButton">
              <ClipboardCheckIcon />
              <span>Assign Course</span>
            </button>
          </div>
        </section>

        <section className="adminAssignmentsCard" aria-labelledby="existing-assignments-title">
          <div className="adminAssignmentsTopBar">
            <h2 id="existing-assignments-title">Existing Assignments</h2>

            <div className="adminAssignmentsSearch">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search assignments..."
                aria-label="Search assignments"
              />
            </div>
          </div>

          <div className="adminAssignmentsHeader">
            <span>INSTRUCTOR</span>
            <span>COURSE</span>
            <span>SEMESTER</span>
            <span>ACTIONS</span>
          </div>

          <div className="adminAssignmentsEmptyState">
            <div className="adminAssignmentsEmptyIconWrap">
              <EmptyInfoIcon />
            </div>
            <h3>No assignments yet</h3>
            <p>Start by selecting an instructor and a course above.</p>
          </div>
        </section>
      </section>
    </AdminPageFrame>
  );
}
