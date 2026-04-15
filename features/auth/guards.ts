import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/features/auth/profile";
import { isAppRole, type AppRole } from "@/features/auth/types";

export async function requireCurrentProfile(allowedRoles?: AppRole[]) {
  let currentProfile: Awaited<ReturnType<typeof getCurrentProfile>> | null = null;

  try {
    currentProfile = await getCurrentProfile();
  } catch {
    redirect("/login");
  }

  if (!currentProfile?.profile) {
    redirect("/login");
  }

  const currentRole = currentProfile.profile.role;

  if (allowedRoles?.length) {
    if (!isAppRole(currentRole) || !allowedRoles.includes(currentRole)) {
      redirect("/login");
    }
  }

  return currentProfile;
}
