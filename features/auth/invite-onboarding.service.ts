"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCurrentProfile } from "@/features/auth/guards";
import { isAppRole, type AppRole } from "@/features/auth/types";
import { createClient } from "@/lib/supabase/server";

const INVITE_SETUP_PATH = "/invite-setup";

function buildInviteSetupUrl(params: { error?: string }) {
  const searchParams = new URLSearchParams();

  if (params.error) {
    searchParams.set("error", params.error);
  }

  const queryString = searchParams.toString();
  return queryString ? `${INVITE_SETUP_PATH}?${queryString}` : INVITE_SETUP_PATH;
}

function getDashboardPathForRole(role: AppRole) {
  if (role === "admin") {
    return "/admin/dashboard";
  }

  if (role === "instructor") {
    return "/instructor/dashboard";
  }

  return "/student/dashboard";
}

export async function completeInviteOnboardingAction(formData: FormData) {
  const currentProfile = await requireCurrentProfile();
  const password = String(formData.get("password") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();

  if (password.length < 8) {
    redirect(buildInviteSetupUrl({ error: "Password must be at least 8 characters long." }));
  }

  if (password !== confirmPassword) {
    redirect(buildInviteSetupUrl({ error: "Passwords do not match." }));
  }

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password,
    data: {
      onboarding_completed: true,
    },
  });

  if (error) {
    redirect(
      buildInviteSetupUrl({
        error: error.message || "Failed to complete account setup.",
      }),
    );
  }

  revalidatePath(INVITE_SETUP_PATH);

  const role = currentProfile.profile.role;
  if (!isAppRole(role)) {
    redirect("/login");
  }

  redirect(getDashboardPathForRole(role));
}
