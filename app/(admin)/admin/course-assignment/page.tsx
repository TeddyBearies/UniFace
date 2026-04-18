import AdminPageFrame from "@/components/AdminPageFrame";
import {
  assignInstructorToCourseAction,
  createCourseAndAssignInstructorAction,
  deleteCourseAction,
  getAdminCourseAssignmentData,
  removeCourseAssignmentAction,
} from "@/features/courses/admin-course-assignment.service";

function AssignIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1692a8"
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

function CourseCreateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1692a8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <path d="M4.5 5.5h15v13h-15z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
      <path d="M17.5 4v3" />
      <path d="M16 5.5h3" />
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

export default async function AdminCourseAssignmentPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    semester?: string;
    success?: string;
    error?: string;
  };
}) {
  const assignmentData = await getAdminCourseAssignmentData({
    q: searchParams?.q,
    semester: searchParams?.semester,
  });
  const successMessage = searchParams?.success || "";
  const errorMessage = searchParams?.error || "";
  const selectedSemester = assignmentData.selectedSemester;
  const search = assignmentData.search;
  const searchLower = search.toLowerCase();
  const filteredCourses = assignmentData.courses.filter((course) => {
    if (selectedSemester && course.semester !== selectedSemester) {
      return false;
    }

    if (!searchLower) {
      return true;
    }

    return (
      course.code.toLowerCase().includes(searchLower) ||
      course.title.toLowerCase().includes(searchLower) ||
      course.semester.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminPageFrame
      activeNav="course-assignment"
      title="Course Assignment"
      profileLabel={assignmentData.profileLabel}
    >
      <section className="adminCourseAssignmentPage">
        <header className="adminCourseIntro">
          <h1>Course Assignment</h1>
          <p>Assign instructors to specific courses and manage existing pairings.</p>
        </header>

        {successMessage && (
          <p className="adminActionSuccessMessage">{successMessage}</p>
        )}
        {errorMessage && <p className="adminActionErrorMessage">{errorMessage}</p>}

        <section className="adminAssignCard" aria-labelledby="create-course-title">
          <div className="adminAssignHeader">
            <CourseCreateIcon />
            <h2 id="create-course-title">Create Course and Assign Instructor</h2>
          </div>

          <form action={createCourseAndAssignInstructorAction}>
            <input type="hidden" name="q" value={search} />
            <input type="hidden" name="selectedSemester" value={selectedSemester} />

            <div className="adminAssignFormGrid">
              <div className="adminAssignField">
                <label htmlFor="create-course-code">Course Code</label>
                <div className="adminAssignSelect">
                  <input
                    id="create-course-code"
                    name="courseCode"
                    type="text"
                    placeholder="CS101"
                    required
                  />
                </div>
              </div>

              <div className="adminAssignField">
                <label htmlFor="create-course-title-input">Course Title</label>
                <div className="adminAssignSelect">
                  <input
                    id="create-course-title-input"
                    name="courseTitle"
                    type="text"
                    placeholder="Introduction to Computing"
                    required
                  />
                </div>
              </div>

              <div className="adminAssignField">
                <label htmlFor="create-course-semester">Semester</label>
                <div className="adminAssignSelect">
                  <input
                    id="create-course-semester"
                    name="semester"
                    type="text"
                    list="admin-course-semesters"
                    defaultValue={selectedSemester}
                    placeholder="Fall 2026"
                    required
                  />
                  <datalist id="admin-course-semesters">
                    {assignmentData.semesters.map((semester) => (
                      <option key={semester} value={semester} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="adminAssignField">
                <label htmlFor="create-course-instructor">Assign Instructor (Optional)</label>
                <div className="adminAssignSelect">
                  <select
                    id="create-course-instructor"
                    name="instructorProfileId"
                    defaultValue=""
                  >
                    <option value="">Assign later</option>
                    {assignmentData.instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} ({instructor.email})
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            <p className="adminCourseCreateHint">
              Create the course first and optionally link an instructor in the same step.
            </p>

            <div className="adminAssignActions">
              <button type="submit" className="adminAssignButton">
                <ClipboardCheckIcon />
                <span>Create Course</span>
              </button>
            </div>
          </form>
        </section>

        <section className="adminAssignCard" aria-labelledby="assign-instructor-title">
          <div className="adminAssignHeader">
            <AssignIcon />
            <h2 id="assign-instructor-title">Assign Instructor to Existing Course</h2>
          </div>

          <form action={assignInstructorToCourseAction}>
            <input type="hidden" name="q" value={search} />
            <input type="hidden" name="selectedSemester" value={selectedSemester} />

            <div className="adminAssignFormGrid">
              <div className="adminAssignField">
                <label htmlFor="assign-instructor">Select Instructor</label>
                <div className="adminAssignSelect">
                  <select id="assign-instructor" name="instructorProfileId" defaultValue="">
                    <option value="" disabled>
                      Choose an instructor
                    </option>
                    {assignmentData.instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} ({instructor.email})
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              <div className="adminAssignField">
                <label htmlFor="assign-course">Select Course</label>
                <div className="adminAssignSelect">
                  <select id="assign-course" name="courseId" defaultValue="">
                    <option value="" disabled>
                      Choose a course
                    </option>
                    {assignmentData.courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              <div className="adminAssignField">
                <label htmlFor="assign-semester">Semester</label>
                <div className="adminAssignSelect">
                  <select id="assign-semester" name="semester" defaultValue={selectedSemester}>
                    <option value="" disabled>
                      Select Semester
                    </option>
                    {assignmentData.semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            <div className="adminAssignActions">
              <button type="submit" className="adminAssignButton">
                <ClipboardCheckIcon />
                <span>Assign Course</span>
              </button>
            </div>
          </form>
        </section>

        <section className="adminAssignmentsCard" aria-labelledby="existing-assignments-title">
          <div className="adminAssignmentsTopBar">
            <h2 id="existing-assignments-title">Existing Assignments</h2>

            <form className="adminAssignmentsSearch" method="get">
              <input type="hidden" name="semester" value={selectedSemester} />
              <SearchIcon />
              <input
                name="q"
                type="text"
                placeholder="Search assignments..."
                defaultValue={search}
                aria-label="Search assignments"
              />
              <button type="submit" hidden aria-hidden="true" />
            </form>
          </div>

          <div className="adminAssignmentsHeader">
            <span>INSTRUCTOR</span>
            <span>COURSE</span>
            <span>SEMESTER</span>
            <span>ACTIONS</span>
          </div>

          {assignmentData.assignments.length > 0 ? (
            <div>
              {assignmentData.assignments.map((assignment) => (
                <div key={assignment.id} className="adminAssignmentsHeader adminAssignmentsRow">
                  <span>
                    <strong>{assignment.instructorName}</strong>
                    <small>{assignment.instructorEmail}</small>
                  </span>
                  <span>
                    <strong>{assignment.courseCode}</strong>
                    <small>{assignment.courseTitle}</small>
                  </span>
                  <span>{assignment.semester}</span>
                  <span>
                    <div className="adminAssignmentRowActions">
                      <form action={removeCourseAssignmentAction}>
                        <input type="hidden" name="assignmentId" value={assignment.id} />
                        <input type="hidden" name="q" value={search} />
                        <input type="hidden" name="selectedSemester" value={selectedSemester} />
                        <button type="submit" className="adminInlineActionButton">
                          Remove
                        </button>
                      </form>

                      <form action={deleteCourseAction}>
                        <input type="hidden" name="courseId" value={assignment.courseId} />
                        <input type="hidden" name="q" value={search} />
                        <input type="hidden" name="selectedSemester" value={selectedSemester} />
                        <button
                          type="submit"
                          className="adminInlineActionButton adminInlineDeleteButton"
                        >
                          Delete Course
                        </button>
                      </form>
                    </div>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="adminAssignmentsEmptyState">
              <div className="adminAssignmentsEmptyIconWrap">
                <EmptyInfoIcon />
              </div>
              <h3>No assignments yet</h3>
              <p>Start by selecting an instructor and a course above.</p>
            </div>
          )}
        </section>

        <section className="adminCoursesCard" aria-labelledby="course-catalog-title">
          <div className="adminAssignmentsTopBar">
            <h2 id="course-catalog-title">Course Catalog</h2>
          </div>

          <div className="adminCoursesHeader">
            <span>COURSE</span>
            <span>SEMESTER</span>
            <span>ASSIGNED INSTRUCTORS</span>
            <span>ACTIONS</span>
          </div>

          {filteredCourses.length > 0 ? (
            <div>
              {filteredCourses.map((course) => (
                <div key={course.id} className="adminCoursesRow">
                  <span>
                    <strong>{course.code}</strong>
                    <small>{course.title}</small>
                  </span>
                  <span>{course.semester}</span>
                  <span>{course.instructorCount}</span>
                  <span>
                    <form action={deleteCourseAction}>
                      <input type="hidden" name="courseId" value={course.id} />
                      <input type="hidden" name="q" value={search} />
                      <input type="hidden" name="selectedSemester" value={selectedSemester} />
                      <button
                        type="submit"
                        className="adminInlineActionButton adminInlineDeleteButton"
                      >
                        Delete
                      </button>
                    </form>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="adminCoursesEmpty">
              No courses match the current filters. Create a new course above to get
              started.
            </p>
          )}
        </section>
      </section>
    </AdminPageFrame>
  );
}
