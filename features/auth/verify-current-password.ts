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

  // Locked scan mode asks for the current password instead of inventing a second
  // unlock secret. Re-authing the same email is the quickest way to prove the
  // person exiting kiosk mode is still the legitimate operator.
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
