import Link from "next/link";
import AdminPageFrame from "@/components/AdminPageFrame";
import { createAdminUserAction } from "@/features/auth/admin-user-management.service";
import { requireCurrentProfile } from "@/features/auth/guards";

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function UserCreateIcon() {
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

export default async function AdminCreateUserPage({
  searchParams,
}: {
  searchParams?: {
    success?: string;
    error?: string;
  };
}) {
  const currentProfile = await requireCurrentProfile(["admin"]);
  const successMessage = searchParams?.success || "";
  const errorMessage = searchParams?.error || "";

  return (
    <AdminPageFrame
      activeNav="user-management"
      title="Create User"
      profileLabel={currentProfile.profile?.full_name || currentProfile.user.email || "Admin"}
    >
      <section className="adminCreateUserPage">
        <header className="adminCreateUserHeader">
          <Link href="/admin/user-management" className="adminCreateUserBackLink">
            <ChevronLeftIcon />
            <span>Back to User Management</span>
          </Link>
          <h1>Create User</h1>
          <p>Add a student, instructor, or admin account.</p>
        </header>

        {successMessage && <p className="adminActionSuccessMessage">{successMessage}</p>}
        {errorMessage && <p className="adminActionErrorMessage">{errorMessage}</p>}

        <section className="adminCreateUserCard">
          <div className="adminAssignHeader">
            <UserCreateIcon />
            <h2>New Account Details</h2>
          </div>

          <form action={createAdminUserAction}>
            <div className="adminCreateUserGrid">
              <div className="adminAssignField">
                <label htmlFor="create-user-full-name">Full Name</label>
                <div className="adminAssignSelect">
                  <input
                    id="create-user-full-name"
                    name="fullName"
                    type="text"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div className="adminAssignField">
                <label htmlFor="create-user-email">Email</label>
                <div className="adminAssignSelect">
                  <input
                    id="create-user-email"
                    name="email"
                    type="email"
                    placeholder="name@university.edu"
                    required
                  />
                </div>
              </div>

              <div className="adminAssignField">
                <label htmlFor="create-user-role">Role</label>
                <div className="adminAssignSelect">
                  <select id="create-user-role" name="role" defaultValue="student">
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="adminAssignField">
                <label htmlFor="create-user-enrollment-year">Enrollment Year</label>
                <div className="adminAssignSelect">
                  <input
                    id="create-user-enrollment-year"
                    name="enrollmentYear"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    placeholder={String(new Date().getFullYear())}
                  />
                </div>
              </div>
            </div>

            <p className="adminCreateUserPasswordNote">
              Users receive a secure one-time invite link to finish setting up their account.
            </p>
            <p className="adminCreateUserPasswordNote">
              University IDs are auto-generated as linear yearly IDs (`YYYYNNNN`) for
              student and instructor accounts and stay tied to the invite flow.
            </p>

            <div className="adminAssignActions">
              <button type="submit" className="adminAssignButton">
                Create User
              </button>
            </div>
          </form>
        </section>
      </section>
    </AdminPageFrame>
  );
}
