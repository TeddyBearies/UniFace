"use client";

import { createClient } from "@/lib/supabase/client";

export async function verifyCurrentUserPassword(password: string) {
  const normalizedPassword = password.trim();
  if (!normalizedPassword) {
    return {
      ok: false,
      error: "Password is required.",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return {
      ok: false,
      error: "Session verification failed. Please sign in again.",
    };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: normalizedPassword,
  });

  if (signInError) {
    return {
      ok: false,
      error: "Incorrect password. Locked mode remains active.",
    };
  }

  return {
    ok: true,
    error: "",
  };
}
