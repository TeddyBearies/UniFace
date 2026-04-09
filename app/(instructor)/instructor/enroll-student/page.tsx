import InstructorPageFrame from "@/components/InstructorPageFrame";

function InfoIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2aa0b2"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function DetailsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2aa0b2"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <path d="M4 7h8" />
      <path d="M4 12h6" />
      <path d="M4 17h5" />
      <path d="m15 15 2 2 4-5" />
      <circle cx="16" cy="8" r="2" />
    </svg>
  );
}

function FaceIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2aa0b2"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8.2 10.2h.01" />
      <path d="M15.8 10.2h.01" />
      <path d="M9 15c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5" />
      <path d="M7.5 8C8.6 6.4 10.1 5.6 12 5.6S15.4 6.4 16.5 8" />
    </svg>
  );
}

function CameraOffIcon({ color = "#9ba6ba", size = 78 }: { color?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flex: "none" }}
    >
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6 17 17H6a2 2 0 0 1-2-2V8.2" />
      <path d="M9.5 4H16a2 2 0 0 1 2 2v2.5L21 6v12" />
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
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function StartEnrollIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 24, height: 24, flex: "none" }}
    >
      <path d="M4 11V7a2 2 0 0 1 2-2h4" />
      <path d="M20 13v4a2 2 0 0 1-2 2h-4" />
      <path d="M4 13v4a2 2 0 0 0 2 2h4" />
      <path d="M20 11V7a2 2 0 0 0-2-2h-4" />
      <path d="M9 12h6" />
      <path d="m12 9 3 3-3 3" />
    </svg>
  );
}

function CaptureIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 22, height: 22, flex: "none" }}
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M4.5 12A7.5 7.5 0 0 1 12 4.5" />
      <path d="M19.5 12A7.5 7.5 0 0 1 12 19.5" />
      <path d="M12 4.5A7.5 7.5 0 0 1 19.5 12" />
      <path d="M12 19.5A7.5 7.5 0 0 1 4.5 12" />
    </svg>
  );
}

function StepSquare({ number }: { number: string }) {
  return (
    <span className="stepSquare" aria-hidden="true">
      {number}
    </span>
  );
}

export default function InstructorEnrollStudentPage() {
  return (
    <InstructorPageFrame activeNav="enroll-student">
      <div className="enroll-student-page instructor-page-content">
        <header className="pageHeader">
          <h1>Enroll New Student</h1>
          <div className="infoPill">
            <InfoIcon />
            <span>FIRST TIME REGISTRATION ONLY</span>
          </div>
        </header>

        <div className="enrollGrid">
          <section className="panelCard studentDetailsCard">
            <div className="panelTitle">
              <DetailsIcon />
              <h2>Student Details</h2>
            </div>

            <div className="formGroup">
              <label htmlFor="student-id">Student ID</label>
              <input id="student-id" name="studentId" type="text" placeholder="Enter 8-digit ID" />
            </div>

            <div className="formGroup">
              <label htmlFor="student-name">Student Name</label>
              <input id="student-name" name="studentName" type="text" placeholder="Enter full name" />
            </div>

            <div className="formGroup">
              <label htmlFor="student-course">Course / Group</label>
              <div className="selectField">
                <select id="student-course" name="course" defaultValue="">
                  <option value="" disabled>
                    Select course
                  </option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            <button type="button" className="primaryAction largeAction">
              <StartEnrollIcon />
              <span>Start Enrollment Scan</span>
            </button>
          </section>

          <section className="panelCard biometricCard">
            <div className="panelTitle">
              <FaceIcon />
              <h2>Biometric Registration</h2>
            </div>

            <div className="enrollCameraFrame">
              <span className="frameCorner topLeft" />
              <span className="frameCorner topRight" />
              <span className="frameCorner bottomLeft" />
              <span className="frameCorner bottomRight" />

              <div className="cameraInnerContent">
                <CameraOffIcon />
                <h3>Camera Feed Placeholder</h3>
                <p>Ready for face capture</p>
              </div>
            </div>

            <button type="button" className="primaryAction largeAction">
              <CaptureIcon />
              <span>Capture Face and Save</span>
            </button>

            <p className="helperText">
              Ensure the student is in a well-lit area and looking directly at the
              <br />
              camera.
            </p>
          </section>
        </div>

        <section className="stepsGrid" aria-label="Enrollment steps">
          <article className="stepCard">
            <div className="stepHeader">
              <StepSquare number="1" />
              <h3>STEP 1</h3>
            </div>
            <p>
              Enter correct institutional student
              <br />
              identification details.
            </p>
          </article>

          <article className="stepCard">
            <div className="stepHeader">
              <StepSquare number="2" />
              <h3>STEP 2</h3>
            </div>
            <p>
              Position student within the camera
              <br />
              frame for optimal capture.
            </p>
          </article>

          <article className="stepCard">
            <div className="stepHeader">
              <StepSquare number="3" />
              <h3>STEP 3</h3>
            </div>
            <p>
              Capture face and save to encrypted
              <br />
              biometric database.
            </p>
          </article>
        </section>
      </div>
    </InstructorPageFrame>
  );
}
