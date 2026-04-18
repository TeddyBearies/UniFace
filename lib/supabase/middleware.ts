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

function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("auth-token"));
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

  if (isProtectedPath(request.nextUrl.pathname) && !hasSupabaseAuthCookie(request)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  const { user, hadError } = await getUserWithRetry(() => supabase.auth.getUser());

  if (!user && !hadError && isProtectedPath(request.nextUrl.pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
