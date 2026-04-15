import Link from "next/link";
import AdminPageFrame from "@/components/AdminPageFrame";
import {
  deleteAdminUserAction,
  getAdminUserManagementData,
  updateAdminUserRoleAction,
} from "@/features/auth/admin-user-management.service";

const SUMMARY_CARDS = [
  {
    title: "Total Students",
    key: "totalStudents",
    meta: "Synced",
    icon: "students",
    accent: "green",
  },
  {
    title: "Total Instructors",
    key: "totalInstructors",
    meta: "Synced",
    icon: "instructors",
    accent: "purple",
  },
  {
    title: "Pending Approvals",
    key: "pendingApprovals",
    meta: "Action Required",
    icon: "approvals",
    accent: "amber",
  },
] as const;

function PlusIcon({ color = "#ffffff", size = 16 }: { color?: string; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: size, height: size, flex: "none" }}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
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

function EmptyUsersIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6fc3d3"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 54, height: 54, flex: "none" }}
    >
      <circle cx="9" cy="8" r="2.5" />
      <path d="M4.8 18c.8-2.5 2.2-3.9 4.2-3.9 1.6 0 2.8.8 3.7 2.4" />
      <path d="m13 10 7 7" />
      <path d="m20 10-7 7" />
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
      stroke="#e2e8f0"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 16, height: 16, flex: "none" }}
    >
      <path d={path} />
    </svg>
  );
}

function SummaryIcon({
  kind,
}: {
  kind: (typeof SUMMARY_CARDS)[number]["icon"];
}) {
  if (kind === "students") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5a8dff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="adminUserSummaryIcon"
      >
        <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
        <path d="M7 12v4.2c1.1 1.2 2.8 1.8 5 1.8s3.9-.6 5-1.8V12" />
      </svg>
    );
  }

  if (kind === "instructors") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a855f7"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="adminUserSummaryIcon"
      >
        <circle cx="9" cy="8" r="2.5" />
        <path d="M4.8 18c.8-2.5 2.2-3.9 4.2-3.9s3.4 1.4 4.2 3.9" />
        <path d="M15.5 7h4" />
        <path d="M15.5 11h4" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#f59e0b"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="adminUserSummaryIcon"
    >
      <path d="M12 3 6 6.2v5.6c0 4.2 2.7 7.9 6 9.2 3.3-1.3 6-5 6-9.2V6.2L12 3Z" />
      <path d="M12 8v4" />
      <path d="M12 15h.01" />
    </svg>
  );
}

function MiniUserAddIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1f2937"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 14, height: 14, flex: "none" }}
    >
      <circle cx="9" cy="8" r="2.5" />
      <path d="M4.8 18c.8-2.5 2.2-3.9 4.2-3.9s3.4 1.4 4.2 3.9" />
      <path d="M16.2 7h3.8" />
      <path d="M18.1 5.1v3.8" />
    </svg>
  );
}

export default async function AdminUserManagementPage({
  searchParams,
}: {
  searchParams?: {
    role?: string;
    q?: string;
    page?: string;
    success?: string;
    error?: string;
  };
}) {
  const userData = await getAdminUserManagementData({
    role: searchParams?.role,
    q: searchParams?.q,
    page: searchParams?.page,
  });

  const search = userData.search;
  const startIndex =
    userData.totalUsers === 0 ? 0 : (userData.currentPage - 1) * 8 + 1;
  const endIndex =
    userData.totalUsers === 0
      ? 0
      : startIndex + userData.users.length - 1;
  const successMessage = searchParams?.success || "";
  const errorMessage = searchParams?.error || "";

  return (
    <AdminPageFrame
      activeNav="user-management"
      title="User Management"
      profileLabel={userData.profileLabel}
    >
      <section className="adminUserManagementPage">
        <div className="adminUserHero">
          <div className="adminUserIntro">
            <h1>User Management</h1>
            <p>Manage student and instructor accounts</p>
          </div>

          <Link href="/admin/user-management/create" className="adminAddUserButton">
            <PlusIcon />
            <span>Add User</span>
          </Link>
        </div>

        {successMessage && (
          <p className="adminActionSuccessMessage">{successMessage}</p>
        )}
        {errorMessage && <p className="adminActionErrorMessage">{errorMessage}</p>}

        <div className="adminUserToolbar">
          <div className="adminUserTabs" role="tablist" aria-label="User category">
            <form method="get">
              <input type="hidden" name="role" value="student" />
              {search && <input type="hidden" name="q" value={search} />}
              <button
                type="submit"
                className={`adminUserTab ${
                  userData.selectedRole === "student" ? "active" : ""
                }`}
                role="tab"
                aria-selected={userData.selectedRole === "student"}
              >
                Students
              </button>
            </form>

            <form method="get">
              <input type="hidden" name="role" value="instructor" />
              {search && <input type="hidden" name="q" value={search} />}
              <button
                type="submit"
                className={`adminUserTab ${
                  userData.selectedRole === "instructor" ? "active" : ""
                }`}
                role="tab"
                aria-selected={userData.selectedRole === "instructor"}
              >
                Instructors
              </button>
            </form>
          </div>

          <form className="adminUserSearch" method="get">
            <input type="hidden" name="role" value={userData.selectedRole} />
            <SearchIcon />
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Search users..."
              aria-label="Search users"
            />
            <button type="submit" hidden aria-hidden="true" />
          </form>
        </div>

        <section className="adminUsersTableCard" aria-label="Users list">
          <div className="adminUsersTableHeader">
            <div>ID</div>
            <div>NAME</div>
            <div>ROLE</div>
            <div>ACTIONS</div>
          </div>

          {userData.users.length > 0 ? (
            <div>
              {userData.users.map((user) => {
                const nextRole =
                  user.role === "student"
                    ? "instructor"
                    : user.role === "instructor"
                      ? "student"
                      : "admin";

                return (
                  <div key={user.id} className="adminUsersTableHeader adminUsersTableRow">
                    <div>{user.displayId}</div>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                    <div>
                      <span className={`adminRoleBadge ${user.role}`}>{user.role}</span>
                    </div>
                    <div className="adminUsersActionsCell">
                      <div className="adminUserActions">
                        {user.role !== "admin" ? (
                          <form action={updateAdminUserRoleAction} className="adminInlineActionForm">
                            <input type="hidden" name="userId" value={user.id} />
                            <input type="hidden" name="newRole" value={nextRole} />
                            <input type="hidden" name="role" value={userData.selectedRole} />
                            <input type="hidden" name="q" value={search} />
                            <input
                              type="hidden"
                              name="page"
                              value={String(userData.currentPage)}
                            />
                            <button type="submit" className="adminInlineActionButton">
                              Make {nextRole === "instructor" ? "Instructor" : "Student"}
                            </button>
                          </form>
                        ) : (  
                          <span className="adminInlineActionMuted">Admin Locked</span>
                        )}

                        {user.universityId && user.role !== "admin" && (
                          <Link
                            href={`/admin/reset-face-data?query=${encodeURIComponent(
                              user.universityId,
                            )}`}
                            className="adminInlineLinkAction"
                          >
                            Reset Face
                          </Link>
                        )}

                        {user.role !== "admin" && (
                          <form action={deleteAdminUserAction} className="adminInlineActionForm">
                            <input type="hidden" name="userId" value={user.id} />
                            <input type="hidden" name="role" value={userData.selectedRole} />
                            <input type="hidden" name="q" value={search} />
                            <input
                              type="hidden"
                              name="page"
                              value={String(userData.currentPage)}
                            />
                            <button
                              type="submit"
                              className="adminInlineActionButton adminInlineDeleteButton"
                            >
                              Delete
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="adminUsersEmptyState">
              <div className="adminUsersEmptyIconWrap">
                <EmptyUsersIcon />
              </div>
              <h2>No users found</h2>
              <p>
                There are currently no users matching this
                <br />
                category in the system. Start by adding your first
                <br />
                user.
              </p>

              <Link href="/admin/user-management/create" className="adminUsersEmptyAction">
                <MiniUserAddIcon />
                <span>Add New User</span>
              </Link>
            </div>
          )}

          <footer className="adminUsersTableFooter">
            <p>
              Showing {startIndex}-{endIndex} of {userData.totalUsers} users
            </p>

            <div className="adminUsersPagination" aria-label="Pagination">
              <form method="get">
                <input type="hidden" name="role" value={userData.selectedRole} />
                <input type="hidden" name="q" value={search} />
                <input
                  type="hidden"
                  name="page"
                  value={String(Math.max(userData.currentPage - 1, 1))}
                />
                <button
                  type="submit"
                  className="adminUsersPageButton"
                  aria-label="Previous page"
                  disabled={userData.currentPage <= 1}
                >
                  <PaginationArrow direction="left" />
                </button>
              </form>
              <form method="get">
                <input type="hidden" name="role" value={userData.selectedRole} />
                <input type="hidden" name="q" value={search} />
                <input
                  type="hidden"
                  name="page"
                  value={String(
                    Math.min(userData.currentPage + 1, userData.totalPages),
                  )}
                />
                <button
                  type="submit"
                  className="adminUsersPageButton"
                  aria-label="Next page"
                  disabled={userData.currentPage >= userData.totalPages}
                >
                  <PaginationArrow direction="right" />
                </button>
              </form>
            </div>
          </footer>
        </section>

        <section className="adminUserSummaryGrid" aria-label="User summary">
          {SUMMARY_CARDS.map((card) => (
            <article key={card.title} className="adminUserSummaryCard">
              <div className={`adminUserSummaryIconWrap ${card.accent}`}>
                <SummaryIcon kind={card.icon} />
              </div>

              <div className={`adminUserSummaryMeta ${card.accent}`}>{card.meta}</div>

              <p>{card.title}</p>
              <strong>{userData.summary[card.key]}</strong>
            </article>
          ))}
        </section>
      </section>
    </AdminPageFrame>
  );
}
