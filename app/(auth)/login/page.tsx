"use client";

import type { FormEvent, MouseEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getClientSessionRole } from "@/features/auth/client-auth";
import { createClient } from "@/lib/supabase/client";
import { hasSupabasePublicEnv } from "@/lib/supabase/config";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Logo() {
  return (
    <img
      src="/haga-login-logo.svg"
      alt="Haga Inc"
      style={{
        width: "90px",
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
      style={{ width: "20px", height: "20px", color: "#a3adbb", flex: "none" }}
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
      style={{ width: "20px", height: "20px", color: "#a3adbb", flex: "none" }}
    >
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
      <circle cx="12" cy="16" r="1" />
    </svg>
  );
}


function FlowerPattern() {
  return (
    <img
      src="/flower_pattern.svg"
      alt=""
      className="bgStar"
      aria-hidden="true"
    />
  );
}

function InteractiveBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="interactiveBg" aria-hidden="true">
      {Array.from({ length: 850 }).map((_, i) => (
        <div key={i} className="bgCell">
          <div className="bgCircle" />
          <FlowerPattern />
        </div>
      ))}
    </div>
  );
}

const FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "Support"];
const IS_SUPABASE_CONFIGURED = hasSupabasePublicEnv();

function getDashboardPathForRole(role: string | null | undefined) {
  const normalizedRole = role?.trim().toLowerCase();
  if (normalizedRole === "admin") return "/admin/dashboard";
  if (normalizedRole === "instructor") return "/instructor/dashboard";
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
    return () => { cancelled = true; };
  }, [router]);

  const clearMessage = () => { if (message) setMessage(""); };

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

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
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

  return (
    <div className="pageShell login-page">
      <header className="topBar">
        <div className="topBarInner">
          <Logo />
          <p className="portalText">Secure Education Portal</p>
        </div>
      </header>

      <main className="mainArea">
        <InteractiveBackground />
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
              <a href="#" className="forgotLink" onClick={handleForgotPassword}>
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
        </section>

        <div className="supportLinks" aria-label="Support links">
          {FOOTER_LINKS.map((label) => (
            <a key={label} href="#" onClick={(event) => event.preventDefault()}>
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
