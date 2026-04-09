import InstructorPageFrame from "@/components/InstructorPageFrame";

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8 6 4-6 4z" fill="#ffffff" stroke="none" />
    </svg>
  );
}

function RotateIcon({ color = "#cbd5e1" }: { color?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <path d="M20 4v6h-6" />
      <path d="M4 20v-6h6" />
      <path d="M19 10a8 8 0 0 0-14-3l-1 1" />
      <path d="M5 14a8 8 0 0 0 14 3l1-1" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#e48a8a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, flex: "none" }}
    >
      <circle cx="12" cy="12" r="10" />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="#e48a8a" stroke="none" />
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

function CameraOffIcon({ color = "#707070", size = 84 }: { color?: string; size?: number }) {
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

function ScanAwaitIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#c6cee0"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 34, height: 34, flex: "none" }}
    >
      <circle cx="10" cy="8" r="3.2" />
      <path d="M4.5 18c1.3-3 3.2-4.6 5.5-4.6 1.1 0 2.1.3 3 .8" />
      <circle cx="16.8" cy="16.8" r="3.7" />
      <path d="m19.4 19.4 2.5 2.5" />
    </svg>
  );
}

export default function InstructorTakeAttendancePage() {
  return (
    <InstructorPageFrame activeNav="take-attendance">
      <div className="take-attendance-page instructor-page-content">
        <header className="pageHeader">
          <h1>Take Attendance</h1>
          <p>Daily attendance scanning during class</p>
        </header>

        <div className="takeGrid">
          <div className="takeControlsColumn">
            <section className="controlCard">
              <div className="sectionTitle">
                <span className="stepBadge">1</span>
                <h2>Select Course</h2>
              </div>

              <div className="fieldBlock">
                <label htmlFor="active-course">Course Name</label>
                <div className="selectField">
                  <select id="active-course" defaultValue="">
                    <option value="" disabled>
                      Select an active course
                    </option>
                  </select>
                  <ChevronDownIcon />
                </div>
              </div>

              <button type="button" className="primaryAction">
                <PlayIcon />
                <span>Start Session</span>
              </button>
            </section>

            <section className="controlCard mutedCard">
              <div className="sectionTitle">
                <span className="stepBadge muted">2</span>
                <h2>Session Controls</h2>
              </div>

              <button type="button" className="secondaryAction disabledAction" disabled>
                <RotateIcon />
                <span>Scan Next Student</span>
              </button>

              <button type="button" className="secondaryAction dangerAction">
                <StopIcon />
                <span>End Session</span>
              </button>
            </section>
          </div>

          <div className="scanColumn">
            <section className="cameraCard">
              <div className="cameraStatus">
                <span className="statusDot" />
                <span>STANDBY</span>
              </div>

              <div className="cameraPlaceholder">
                <CameraOffIcon />
                <h3>Camera Feed Placeholder</h3>
                <p>Start session to activate camera</p>
              </div>
            </section>

            <section className="awaitCard">
              <div className="awaitIconBox">
                <ScanAwaitIcon />
              </div>
              <h3>Awaiting Scan</h3>
              <p>
                Position the student&apos;s QR code in front of the
                <br />
                camera to verify identity.
              </p>
            </section>
          </div>
        </div>

        <footer className="scanFooterBar">
          <div className="scanFooterStats">
            <span className="footerStat">
              <span className="footerDot present" />
              Present: 0
            </span>
            <span className="footerStat">
              <span className="footerDot enrolled" />
              Enrolled: 32
            </span>
          </div>

          <p className="lastScanText">Last scan: None</p>
        </footer>
      </div>
    </InstructorPageFrame>
  );
}
