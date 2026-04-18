"use client";

import type { AppRole } from "@/features/auth/types";
import { isAppRole } from "@/features/auth/types";
import { createClient } from "@/lib/supabase/client";

export async function getClientSessionRole() {
  const supabase = createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return null;
  }

  // We intentionally follow the lightweight session check with getUser() so we
  // confirm the browser still has a valid authenticated identity, not just a
  // stale cached session object.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // Locked scan mode can briefly interfere with client-side auth reads in some
    // browsers, so we fail closed here instead of throwing noisy UI errors.
    if (userError?.message?.toLowerCase().includes("lock")) {
      return null;
    }
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
