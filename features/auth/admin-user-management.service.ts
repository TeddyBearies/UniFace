"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentProfile } from "@/features/auth/guards";
import { isAppRole, type AppRole } from "@/features/auth/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ADMIN_USER_MANAGEMENT_PATH = "/admin/user-management";
const ADMIN_CREATE_USER_PATH = "/admin/user-management/create";
const ADMIN_USERS_PAGE_SIZE = 8;

type UserRoleFilter = "student" | "instructor";

export type AdminUserRow = {
  id: string;
  displayId: string;
  name: string;
  email: string;
  role: AppRole;
  universityId: string | null;
  createdAt: string;
};

export type AdminUserManagementData = {
  profileLabel: string;
  selectedRole: UserRoleFilter;
  search: string;
  users: AdminUserRow[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  summary: {
    totalStudents: number;
    totalInstructors: number;
    pendingApprovals: number;
  };
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

function normalizeRoleFilter(roleValue: string | undefined): UserRoleFilter {
  return roleValue === "instructor" ? "instructor" : "student";
}

function normalizePage(pageValue: string | undefined) {
  const parsedPage = Number.parseInt(pageValue || "1", 10);
  if (Number.isNaN(parsedPage) || parsedPage < 1) {
    return 1;
  }
  return parsedPage;
}

function sanitizeSearch(searchValue: string | undefined) {
  if (!searchValue) {
    return "";
  }

  return searchValue.replace(/[^a-zA-Z0-9@._\-\s]/g, " ").trim().slice(0, 64);
}

function buildManageUrl(params: {
  role?: string;
  q?: string;
  page?: string | number;
  success?: string;
  error?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.role) {
    searchParams.set("role", params.role);
  }

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.success) {
    searchParams.set("success", params.success);
  }

  if (params.error) {
    searchParams.set("error", params.error);
  }

  const queryString = searchParams.toString();
  return queryString
    ? `${ADMIN_USER_MANAGEMENT_PATH}?${queryString}`
    : ADMIN_USER_MANAGEMENT_PATH;
}

function buildCreateUserUrl(params: { success?: string; error?: string }) {
  const searchParams = new URLSearchParams();

  if (params.success) {
    searchParams.set("success", params.success);
  }

  if (params.error) {
    searchParams.set("error", params.error);
  }

  const queryString = searchParams.toString();
  return queryString ? `${ADMIN_CREATE_USER_PATH}?${queryString}` : ADMIN_CREATE_USER_PATH;
}

function normalizeInviteErrorMessage(message: string) {
  const normalizedMessage = message.trim();
  const lowerMessage = normalizedMessage.toLowerCase();

  if (lowerMessage.includes("email rate limit exceeded")) {
    return "Supabase email sending is temporarily rate-limited. Wait a bit before sending another invite, or configure custom SMTP in Supabase to raise the email limit.";
  }

  if (lowerMessage.includes("rate limit")) {
    return "Invite sending is being rate-limited right now. Please wait a moment and try again.";
  }

  return normalizedMessage || "Failed to create invite.";
}

function getDisplayId(profile: {
  id: string;
  university_id?: string | null;
}) {
  if (profile.university_id) {
    return profile.university_id;
  }

  return profile.id.slice(0, 8).toUpperCase();
}

function extractUniversityIdFromMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const record = metadata as Record<string, unknown>;
  const value = record.university_id || record.student_id;
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue || null;
}

async function syncUniversityIdFromAuthMetadata(
  admin: ReturnType<typeof createAdminClient>,
  profile: {
    id: string;
    full_name?: string | null;
    email?: string | null;
    role: AppRole;
    university_id?: string | null;
    created_at: string;
  },
) {
  if (profile.university_id) {
    return profile;
  }

  // Invites can create the auth user before the profile row has all derived fields.
  // This backfill keeps the admin table readable even if the trigger/profile update
  // landed before the generated university ID was copied over.
  const { data: authUserResult, error } = await admin.auth.admin.getUserById(profile.id);
  if (error || !authUserResult.user) {
    return profile;
  }

  const generatedUniversityId = extractUniversityIdFromMetadata(authUserResult.user.user_metadata);
  if (!generatedUniversityId) {
    return profile;
  }

  const { error: updateError } = await admin
    .from("profiles")
    .update({ university_id: generatedUniversityId })
    .eq("id", profile.id);

  if (updateError) {
    return profile;
  }

  return {
    ...profile,
    university_id: generatedUniversityId,
  };
}

export async function getAdminUserManagementData(filters: {
  role?: string;
  q?: string;
  page?: string;
}): Promise<AdminUserManagementData> {
  const currentProfile = await requireCurrentProfile(["admin"]);
  const supabase = createClient();
  const admin = createAdminClient();
  const selectedRole = normalizeRoleFilter(filters.role);
  const search = sanitizeSearch(filters.q);
  const requestedPage = normalizePage(filters.page);

  const {
    count: totalStudents,
    error: totalStudentsError,
  } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "student");

  if (totalStudentsError) {
    throw totalStudentsError;
  }

  const {
    count: totalInstructors,
    error: totalInstructorsError,
  } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "instructor");

  if (totalInstructorsError) {
    throw totalInstructorsError;
  }

  const {
    count: pendingApprovals,
    error: pendingApprovalsError,
  } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "student")
    .is("university_id", null);

  if (pendingApprovalsError) {
    throw pendingApprovalsError;
  }

  let usersCountQuery = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", selectedRole);

  let usersQuery = supabase
    .from("profiles")
    .select("id, full_name, email, role, university_id, created_at")
    .eq("role", selectedRole)
    .order("created_at", { ascending: false });

  if (search) {
    const searchPredicate = `full_name.ilike.%${search}%,email.ilike.%${search}%,university_id.ilike.%${search}%`;
    usersCountQuery = usersCountQuery.or(searchPredicate);
    usersQuery = usersQuery.or(searchPredicate);
  }

  const { count: totalUsers, error: countError } = await usersCountQuery;
  if (countError) {
    throw countError;
  }

  const totalPages = Math.max(
    Math.ceil((totalUsers || 0) / ADMIN_USERS_PAGE_SIZE),
    1,
  );
  const currentPage = Math.min(requestedPage, totalPages);
  const rangeStart = (currentPage - 1) * ADMIN_USERS_PAGE_SIZE;
  const rangeEnd = rangeStart + ADMIN_USERS_PAGE_SIZE - 1;

  const { data: users, error: usersError } = await usersQuery.range(rangeStart, rangeEnd);

  if (usersError) {
    throw usersError;
  }

  const syncedUsers = await Promise.all(
    (users || [])
      .filter((user) => isAppRole(user.role))
      .map((user) =>
        syncUniversityIdFromAuthMetadata(admin, {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          university_id: user.university_id || null,
          created_at: user.created_at,
        }),
      ),
  );

  return {
    profileLabel:
      currentProfile.profile.full_name || currentProfile.user.email || "Admin",
    selectedRole,
    search,
    users: syncedUsers.map((user) => ({
        id: user.id,
        displayId: getDisplayId(user),
        name: user.full_name || "Unknown User",
        email: user.email || "No email",
        role: user.role,
        universityId: user.university_id || null,
        createdAt: user.created_at,
      })),
    totalUsers: totalUsers || 0,
    currentPage,
    totalPages,
    summary: {
      totalStudents: totalStudents || 0,
      totalInstructors: totalInstructors || 0,
      pendingApprovals: pendingApprovals || 0,
    },
  };
}

function normalizeRoleForMutation(roleValue: FormDataEntryValue | null) {
  if (roleValue !== "student" && roleValue !== "instructor" && roleValue !== "admin") {
    return null;
  }

  return roleValue as AppRole;
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function normalizeEnrollmentYear(value: FormDataEntryValue | null) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  if (!/^\d{4}$/.test(raw)) {
    return null;
  }

  const year = Number.parseInt(raw, 10);
  const currentYear = new Date().getFullYear();
  if (Number.isNaN(year) || year < 2000 || year > currentYear + 1) {
    return null;
  }

  return String(year);
}

type ManageActionContext = {
  role: UserRoleFilter;
  search: string;
  page: number;
};

function getManageActionContext(formData: FormData): ManageActionContext {
  const role = normalizeRoleFilter(normalizeText(formData.get("role")));
  const search = sanitizeSearch(normalizeText(formData.get("q")));
  const page = normalizePage(normalizeText(formData.get("page")));

  return {
    role,
    search,
    page,
  };
}

function getInviteRedirectTo() {
  const customUrl = String(process.env.NEXT_PUBLIC_APP_URL || "").trim();
  const vercelUrl = String(process.env.NEXT_PUBLIC_VERCEL_URL || "").trim();
  
  let appUrl = customUrl;
  if (!appUrl && vercelUrl) {
    appUrl = `https://${vercelUrl}`;
  }

  if (!appUrl) {
    return undefined;
  }

  return `${appUrl.replace(/\/+$/g, "")}/invite-callback`;
}

async function getNextUniversityIdForYear(
  admin: ReturnType<typeof createAdminClient>,
  enrollmentYear: string,
) {
  const { data: existingIds, error } = await admin
    .from("profiles")
    .select("university_id")
    .like("university_id", `${enrollmentYear}%`)
    .not("university_id", "is", null);

  if (error) {
    throw error;
  }

  let maxSequence = 0;

  for (const row of existingIds || []) {
    const universityId = String(row.university_id || "");
    if (!new RegExp(`^${enrollmentYear}\\d{4}$`).test(universityId)) {
      continue;
    }

    const sequence = Number.parseInt(universityId.slice(4), 10);
    if (!Number.isNaN(sequence) && sequence > maxSequence) {
      maxSequence = sequence;
    }
  }

  const nextSequence = maxSequence + 1;
  if (nextSequence > 9999) {
    throw new Error("Enrollment year sequence limit reached.");
  }

  return `${enrollmentYear}${String(nextSequence).padStart(4, "0")}`;
}

export async function updateAdminUserRoleAction(formData: FormData) {
  const currentProfile = await requireCurrentProfile(["admin"]);
  const admin = createAdminClient();

  const userId = normalizeText(formData.get("userId"));
  const newRole = normalizeRoleForMutation(formData.get("newRole"));
  const { role, search, page } = getManageActionContext(formData);

  if (!isUuid(userId) || !newRole) {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "Invalid user update request.",
      }),
    );
  }

  if (currentProfile.profile.id === userId && newRole !== "admin") {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "You cannot remove your own admin access.",
      }),
    );
  }

  const { data: targetProfile, error: targetProfileError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", userId)
    .maybeSingle();

  if (targetProfileError || !targetProfile?.id) {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "Target user was not found.",
      }),
    );
  }

  if (targetProfile.role === newRole) {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        success: "User role is already up to date.",
      }),
    );
  }

  const { error } = await admin
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "Failed to update user role.",
      }),
    );
  }

  revalidatePath(ADMIN_USER_MANAGEMENT_PATH);
  redirect(
    buildManageUrl({
      role,
      q: search,
      page,
      success: "User role updated successfully.",
    }),
  );
}

export async function deleteAdminUserAction(formData: FormData) {
  const currentProfile = await requireCurrentProfile(["admin"]);

  const userId = normalizeText(formData.get("userId"));
  const { role, search, page } = getManageActionContext(formData);

  if (!isUuid(userId)) {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "Invalid user delete request.",
      }),
    );
  }

  if (currentProfile.profile.id === userId) {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "You cannot delete your own admin account.",
      }),
    );
  }

  const admin = createAdminClient();

  const { data: targetProfile, error: targetProfileError } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", userId)
    .maybeSingle();

  if (targetProfileError || !targetProfile?.id) {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "Target user was not found.",
      }),
    );
  }

  if (targetProfile.role === "admin") {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "Admin users cannot be deleted from this panel.",
      }),
    );
  }

  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    redirect(
      buildManageUrl({
        role,
        q: search,
        page,
        error: "Failed to delete user.",
      }),
    );
  }

  revalidatePath(ADMIN_USER_MANAGEMENT_PATH);
  redirect(
    buildManageUrl({
      role,
      q: search,
      page,
      success: "User deleted successfully.",
    }),
  );
}

export async function createAdminUserAction(formData: FormData) {
  await requireCurrentProfile(["admin"]);

  const email = normalizeEmail(formData.get("email"));
  const fullName = normalizeText(formData.get("fullName"));
  const role = normalizeRoleForMutation(formData.get("role"));
  const enrollmentYear = normalizeEnrollmentYear(formData.get("enrollmentYear"));
  const shouldGenerateUniversityId = role === "student" || role === "instructor";

  if (!email || !email.includes("@")) {
    redirect(buildCreateUserUrl({ error: "Enter a valid email address." }));
  }

  if (!fullName) {
    redirect(buildCreateUserUrl({ error: "Full name is required." }));
  }

  if (!role) {
    redirect(buildCreateUserUrl({ error: "Role is required." }));
  }

  if (enrollmentYear === null) {
    redirect(
      buildCreateUserUrl({ error: "Enrollment year must be a valid 4-digit year." }),
    );
  }

  if (shouldGenerateUniversityId && !enrollmentYear) {
    redirect(
      buildCreateUserUrl({
        error: "Enrollment year is required for student and instructor accounts.",
      }),
    );
  }

  const admin = createAdminClient();

  const { data: existingProfile, error: existingProfileError } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingProfileError) {
    redirect(buildCreateUserUrl({ error: "Failed to verify existing users." }));
  }

  if (existingProfile?.id) {
    redirect(buildCreateUserUrl({ error: "This email is already registered." }));
  }

  let generatedUniversityId: string | null = null;
  let lastInviteError: string | null = null;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      // University IDs are generated optimistically and retried because invite
      // creation and profile syncing can collide under fast repeated admin actions.
      if (shouldGenerateUniversityId) {
        generatedUniversityId = await getNextUniversityIdForYear(admin, enrollmentYear as string);
      } else {
        generatedUniversityId = null;
      }

      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name: fullName,
          role,
          university_id: generatedUniversityId || "",
          student_id: generatedUniversityId || "",
        },
        redirectTo: getInviteRedirectTo(),
      });

      if (!error && data.user?.id) {
        const createdUserId = data.user.id;
        let profileSynced = false;

        for (let syncAttempt = 0; syncAttempt < 6; syncAttempt += 1) {
          const { data: updatedProfile, error: updateError } = await admin
            .from("profiles")
            .update({
              full_name: fullName,
              role,
              university_id: generatedUniversityId,
            })
            .eq("id", createdUserId)
            .select("id")
            .maybeSingle();

          if (!updateError && updatedProfile?.id) {
            profileSynced = true;
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 120));
        }

        if (!profileSynced) {
          await admin.auth.admin.deleteUser(createdUserId);
          redirect(
            buildCreateUserUrl({
              error: "User invite was cancelled because the generated university ID could not be saved.",
            }),
          );
        }

        lastInviteError = null;
        break;
      }

      lastInviteError = normalizeInviteErrorMessage(
        error?.message || "Failed to create invite.",
      );
      const normalizedError = lastInviteError.toLowerCase();
      if ((normalizedError.includes("already") || error?.code === "23505") && shouldGenerateUniversityId) {
        continue;
      }

      if (normalizedError.includes("already")) {
        redirect(buildCreateUserUrl({ error: "This email is already registered." }));
      }

      redirect(buildCreateUserUrl({ error: lastInviteError }));
    } catch (inviteError) {
      if (isRedirectError(inviteError)) {
        throw inviteError;
      }

      lastInviteError = normalizeInviteErrorMessage(
        inviteError instanceof Error ? inviteError.message : "Failed to create invite.",
      );
      break;
    }
  }

  if (lastInviteError) {
    redirect(
      buildCreateUserUrl({
        error: lastInviteError || "Failed to create invite.",
      }),
    );
  }

  revalidatePath(ADMIN_USER_MANAGEMENT_PATH);
  redirect(
    buildCreateUserUrl({
      success:
        role === "student"
          ? `Student invite sent successfully. Student ID ${generatedUniversityId} is tied to the invite link.`
          : shouldGenerateUniversityId
            ? `Invite sent successfully. ID ${generatedUniversityId} is tied to the invite link.`
            : "Invite sent successfully.",
    }),
  );
}
