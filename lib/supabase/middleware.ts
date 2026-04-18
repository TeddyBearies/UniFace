import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv, hasSupabasePublicEnv } from "./config";

async function getUserWithRetry(
  getUser: () => Promise<{ data: { user: unknown | null } }>,
  attempts = 3,
) {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      // Supabase auth refresh can occasionally be a little ahead of the cookie
      // state in middleware, so we give it a couple of short retries before
      // treating the request like a real auth failure.
      const result = await getUser();
      return {
        user: result.data.user,
        hadError: false,
      };
    } catch (error) {
      lastError = error;

      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }
  }

  return {
    user: null,
    hadError: true,
    error: lastError,
  };
}

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/student") ||
    pathname.startsWith("/instructor") ||
    pathname.startsWith("/admin")
  );
}

export async function updateSession(request: NextRequest) {
  if (!hasSupabasePublicEnv()) {
    if (isProtectedPath(request.nextUrl.pathname)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { supabaseUrl, supabasePublishableKey } = getSupabasePublicEnv();

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // We mirror cookie writes onto both the request and the response so the
        // rest of this middleware run sees the freshest auth state right away.
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { user, hadError } = await getUserWithRetry(() => supabase.auth.getUser());

  if (!user && !hadError && isProtectedPath(request.nextUrl.pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
