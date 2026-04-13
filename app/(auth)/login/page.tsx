"use client";

import type { FormEvent, MouseEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientSessionRole } from "@/features/auth/client-auth";
import { createClient } from "@/lib/supabase/client";
import { hasSupabasePublicEnv } from "@/lib/supabase/config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BACKGROUND_PATTERN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='116' height='116' viewBox='0 0 116 116'%3E%3Cg fill='none' stroke='%231098ae' stroke-width='4.5' stroke-opacity='.86'%3E%3Ccircle cx='0' cy='0' r='58'/%3E%3Ccircle cx='116' cy='0' r='58'/%3E%3Ccircle cx='0' cy='116' r='58'/%3E%3Ccircle cx='116' cy='116' r='58'/%3E%3C/g%3E%3Cg stroke='%231098ae' stroke-width='1.8' stroke-linecap='round' stroke-opacity='.72'%3E%3Cpath d='M54 58h8'/%3E%3Cpath d='M58 54v8'/%3E%3Cpath d='M55.2 55.2l5.6 5.6'/%3E%3Cpath d='M60.8 55.2l-5.6 5.6'/%3E%3C/g%3E%3C/svg%3E";

function Logo() {
  return (
    <img
      src="/haga-login-logo.svg"
      alt="Haga Inc"
      style={{
        width: "76px",
        height: "auto",
        display: "block",
      }}
    />
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "20px",
        height: "20px",
        color: "#a3adbb",
        flex: "none",
      }}
    >
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "20px",
        height: "20px",
        color: "#a3adbb",
        flex: "none",
      }}
    >
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "22px",
        height: "22px",
        color: "#1098ae",
        flex: "none",
      }}
    >
      <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
      <path d="M7 12v4.2c1.1 1.2 2.8 1.8 5 1.8s3.9-.6 5-1.8V12" />
      <path d="M21 9.5v5" />
    </svg>
  );
}

function InstructorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "22px",
        height: "22px",
        color: "#1098ae",
        flex: "none",
      }}
    >
      <path d="M4 19v-2.2c0-2 1.6-3.6 3.6-3.6h8.8c2 0 3.6 1.6 3.6 3.6V19" />
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 5h5" />
      <path d="M4 9h3" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: "22px",
        height: "22px",
        color: "#1098ae",
        flex: "none",
      }}
    >
      <path d="M12 3 6 6.2v5.6c0 4.2 2.7 7.9 6 9.2 3.3-1.3 6-5 6-9.2V6.2L12 3Z" />
      <circle cx="16.5" cy="16.5" r="2.5" />
      <path d="m18.2 18.2 2.3 2.3" />
    </svg>
  );
}

const QUICK_ACCESS_OPTIONS = [
  { label: "Continue as Student", icon: <StudentIcon />, role: "student" },
  { label: "Continue as Instructor", icon: <InstructorIcon />, role: "instructor" },
  { label: "Continue as Admin", icon: <AdminIcon />, role: "admin" },
];

const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Support"];
const IS_SUPABASE_CONFIGURED = hasSupabasePublicEnv();

function getDashboardPathForRole(role: string | null | undefined) {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === "admin") {
    return "/admin/dashboard";
  }

  if (normalizedRole === "instructor") {
    return "/instructor/dashboard";
  }

  return "/student/dashboard";
}

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => (IS_SUPABASE_CONFIGURED ? createClient() : null));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "info" | "success">("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function redirectIfAlreadySignedIn() {
      const sessionRole = await getClientSessionRole();

      if (!cancelled && sessionRole) {
        router.replace(getDashboardPathForRole(sessionRole.role));
        router.refresh();
      }
    }

    redirectIfAlreadySignedIn();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const clearMessage = () => {
    if (message) {
      setMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setMessageTone("error");
      setMessage("Please enter your email address and password.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setMessageTone("error");
      setMessage("Please enter a valid university email address.");
      return;
    }

    if (!IS_SUPABASE_CONFIGURED || !supabase) {
      setMessageTone("error");
      setMessage("Supabase keys are not configured yet. Add them to .env.local and restart the dev server.");
      return;
    }

    setIsSubmitting(true);
    setMessageTone("info");
    setMessage("Signing you in...");

    const {
      data: signInData,
      error,
    } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (error) {
      setMessageTone("error");
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    const userId = signInData.user?.id;

    if (!userId) {
      setMessageTone("error");
      setMessage("Login succeeded, but the user profile could not be loaded.");
      setIsSubmitting(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      setMessageTone("error");
      setMessage(profileError.message);
      setIsSubmitting(false);
      return;
    }

    setMessageTone("success");
    setMessage("Login successful. Redirecting to your dashboard...");
    router.replace(getDashboardPathForRole(profile?.role));
    router.refresh();
  };

  const handleForgotPassword = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setMessageTone("error");
      setMessage("Enter your account email first to request a reset link.");
      return;
    }

    if (!IS_SUPABASE_CONFIGURED || !supabase) {
      setMessageTone("error");
      setMessage("Supabase keys are not configured yet. Add them to .env.local first.");
      return;
    }

    setIsSubmitting(true);
    setMessageTone("info");
    setMessage("Sending reset link...");

    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setMessageTone("error");
      setMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    setMessageTone("success");
    setMessage("Reset link sent. Check your email inbox.");
    setIsSubmitting(false);
  };

  const handleQuickAccess = (role: string) => {
    router.replace(getDashboardPathForRole(role));
    router.refresh();
  };

  return (
    <div className="pageShell login-page">
      <header className="topBar">
        <div className="topBarInner">
          <Logo />
          <p className="portalText">Secure Education Portal</p>
        </div>
      </header>

      <main className="mainArea">
        <section className="loginCard" aria-labelledby="login-title">
          <div className="cardHeading">
            <h1 id="login-title">Welcome back</h1>
            <p>Enter your credentials to access EduScan</p>
          </div>

          <form className="loginForm" onSubmit={handleSubmit} noValidate>
            <label className="fieldGroup" htmlFor="email">
              <span className="fieldLabel">Email Address</span>
              <span className="inputShell">
                <MailIcon />
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="name@university.edu"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearMessage();
                  }}
                />
              </span>
            </label>

            <div className="passwordHeader">
              <label className="fieldLabel" htmlFor="password">
                Password
              </label>
              <a
                href="#"
                className="forgotLink"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </a>
            </div>

            <label className="fieldGroup" htmlFor="password">
              <span className="inputShell">
                <LockIcon />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="........"
                  value={password}
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearMessage();
                  }}
                />
              </span>
            </label>

            <p
              className={`message ${message ? "visible" : ""} ${messageTone}`}
              aria-live="polite"
              role="status"
            >
              {message || "\u00a0"}
            </p>

            <button className="loginButton" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="quickAccess">
            <div className="divider">
              <span>QUICK ACCESS (DEV MODE)</span>
            </div>

            <div className="quickAccessList">
              {QUICK_ACCESS_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className="quickAccessButton"
                  disabled={isSubmitting}
                  onClick={() => handleQuickAccess(option.role)}
                >
                  {option.icon}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="supportLinks" aria-label="Support links">
          {FOOTER_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              onClick={(event) => event.preventDefault()}
            >
              {label}
            </a>
          ))}
        </div>
      </main>

      <footer className="copyright">
        <p>©2024 EduScan Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
