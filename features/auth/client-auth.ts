"use client";

import type { AppRole } from "@/features/auth/types";
import { isAppRole } from "@/features/auth/types";
import { createClient } from "@/lib/supabase/client";

export async function getClientSessionRole() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !isAppRole(profile?.role)) {
    return null;
  }

  return {
    userId: user.id,
    role: profile.role as AppRole,
  };
}
