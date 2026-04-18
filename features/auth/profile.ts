import { createClient } from "@/lib/supabase/server";

async function getAuthenticatedUserWithRetry(
  getUser: () => Promise<{
    data: { user: Awaited<ReturnType<ReturnType<typeof createClient>["auth"]["getUser"]>>["data"]["user"] };
    error: Awaited<ReturnType<ReturnType<typeof createClient>["auth"]["getUser"]>>["error"];
  }>,
  attempts = 3,
) {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const {
      data: { user },
      error,
    } = await getUser();

    if (!error) {
      return {
        user,
        error: null,
      };
    }

    lastError = error;

    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  return {
    user: null,
    error: lastError,
  };
}

export async function getCurrentProfile() {
  const supabase = createClient();
  const { user, error: userError } = await getAuthenticatedUserWithRetry(() =>
    supabase.auth.getUser(),
  );

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  // Auth tells us who the user is, but the app still needs the companion
  // profile row because that is where role and university-specific metadata live.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, university_id, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  return {
    user,
    profile,
  };
}
