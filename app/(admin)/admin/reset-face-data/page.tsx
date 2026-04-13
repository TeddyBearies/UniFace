import AdminPageFrame from "@/components/AdminPageFrame";
import { requireCurrentProfile } from "@/features/auth/guards";

function WarningIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#d97706"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 22, height: 22, flex: "none" }}
    >
      <path d="M12 4 3.8 19h16.4L12 4Z" />
      <path d="M12 9v4.5" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function StudentLookupIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a0a8b5"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, flex: "none" }}
    >
      <circle cx="9" cy="8" r="2.4" />
      <path d="M4.8 18c.8-2.4 2.2-3.8 4.2-3.8s3.4 1.4 4.2 3.8" />
      <circle cx="17.5" cy="16.5" r="2.5" />
      <path d="m19.2 18.2 2.2 2.2" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#8a94a6"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 12, height: 12, flex: "none" }}
    >
      <path d="M12 3 6 5.5v5.7c0 4.1 2.5 7.9 6 9.8 3.5-1.9 6-5.7 6-9.8V5.5z" />
      <path d="m9.5 12 1.7 1.7 3.3-3.8" />
    </svg>
  );
}

function TrashIcon() {
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
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M8 7l1 11h6l1-11" />
      <path d="M10 11v4" />
      <path d="M14 11v4" />
    </svg>
  );
}

function HelpIcon() {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.6 2.6 0 0 1 5 1c0 2-2.5 2.2-2.5 4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function AuditIcon() {
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
      <path d="M7 7h4V3" />
      <path d="M17 17h-4v4" />
      <path d="M17 7a6 6 0 0 0-10-1" />
      <path d="M7 17a6 6 0 0 0 10 1" />
    </svg>
  );
}

export default async function AdminResetFaceDataPage() {
  await requireCurrentProfile(["admin"]);

  return (
    <AdminPageFrame activeNav="reset-face-data" title="">
      <section className="adminResetFaceDataPage">
        <header className="adminResetIntro">
          <h1>Reset Biometric Data</h1>
          <p>Remove existing facial recognition profiles for specific students.</p>
        </header>

        <section className="adminResetWarningBanner" aria-label="Important warning">
          <WarningIcon />
          <div>
            <h2>Important Warning</h2>
            <p>
              This action is permanent and cannot be undone. Once the face data is
              reset, the student will be unable to use biometric authentication features
              until they re-enroll their information in the system.
            </p>
          </div>
        </section>

        <section className="adminResetMainCard" aria-labelledby="student-identification-title">
          <div className="adminResetMainHeader">
            <h2 id="student-identification-title">Student Identification</h2>
            <p>
              Enter the unique ID of the student whose biometric record needs to be
              cleared.
            </p>
          </div>

          <div className="adminResetFieldBlock">
            <label htmlFor="reset-student-id">Student ID Number</label>
            <div className="adminResetInput">
              <StudentLookupIcon />
              <input
                id="reset-student-id"
                type="text"
                placeholder="e.g. 2024-00123"
                aria-label="Student ID Number"
              />
            </div>
            <span className="adminResetHint">
              Search student by their 10-digit institutional identifier.
            </span>
          </div>

          <footer className="adminResetFooter">
            <div className="adminResetVerification">
              <ShieldCheckIcon />
              <span>Requires admin verification</span>
            </div>

            <button type="button" className="adminResetAction">
              <TrashIcon />
              <span>Reset Face Data</span>
            </button>
          </footer>
        </section>

        <section className="adminResetInfoGrid" aria-label="Reset biometric guidance">
          <article className="adminResetInfoCard">
            <div className="adminResetInfoHeader">
              <HelpIcon />
              <h3>When to use this?</h3>
            </div>
            <p>
              Use this tool if a student&apos;s appearance has changed
              <br />
              significantly, if their profile was corrupted, or if they
              <br />
              have requested a data reset for privacy reasons.
            </p>
          </article>

          <article className="adminResetInfoCard">
            <div className="adminResetInfoHeader">
              <AuditIcon />
              <h3>Audit Trail</h3>
            </div>
            <p>
              Every biometric reset is logged with your admin ID
              <br />
              and the timestamp. This log is accessible via the
              <br />
              Reports dashboard for security auditing.
            </p>
          </article>
        </section>
      </section>
    </AdminPageFrame>
  );
}
