"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type InviteSetupFormProps = {
  errorMessage: string;
};

type InviteProfileState = {
  email: string;
  universityId: string;
  role: string;
};

function getRoleLabel(role: string) {
  if (role === "instructor") {
    return "Instructor";
  }

  if (role === "admin") {
    return "Admin";
  }

  return "Student";
}

function getIdLabel(role: string) {
  if (role === "instructor") {
    return "Instructor ID";
  }

  if (role === "admin") {
    return "Account ID";
  }

  return "Student ID";
}

export default function InviteSetupForm({ errorMessage }: InviteSetupFormProps) {
  const router = useRouter();
  const [profileState, setProfileState] = useState<InviteProfileState | null>(null);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInviteProfile() {
      const supabase = createClient();
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const hashErrorDescription = hashParams.get("error_description");
      const hashErrorCode = hashParams.get("error_code");

      if (hashErrorDescription || hashErrorCode) {
        setLoadError(
          hashErrorCode === "otp_expired"
            ? "This invite link has expired or has already been used. Please request a new invite."
            : decodeURIComponent(hashErrorDescription || "Invite link is invalid."),
        );
        setIsLoading(false);
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (cancelled) {
          return;
        }

        if (error) {
          setLoadError("Your invite session could not be started. Please request a new invite.");
          setIsLoading(false);
          return;
        }

        window.history.replaceState({}, document.title, "/invite-setup");
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (cancelled) {
          return;
        }

        if (error) {
          setLoadError("This invite link is invalid or expired. Please request a new invite.");
          setIsLoading(false);
          return;
        }

        window.history.replaceState({}, document.title, "/invite-setup");
      } else if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "invite" | "recovery" | "email_change" | "email",
        });

        if (cancelled) {
          return;
        }

        if (error) {
          setLoadError("This invite link is invalid or expired. Please request a new invite.");
          setIsLoading(false);
          return;
        }

        window.history.replaceState({}, document.title, "/invite-setup");
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (userError || !user) {
        setLoadError("Your invite session could not be loaded. Please reopen the invite email link.");
        setIsLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email, university_id")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (profileError) {
        setLoadError(profileError.message || "We could not load your invited account.");
        setIsLoading(false);
        return;
      }

      const studentId =
        profile?.university_id ||
        String(user.user_metadata?.university_id || user.user_metadata?.student_id || "").trim() ||
        user.id.slice(0, 8).toUpperCase();
      const role = String(user.user_metadata?.role || "student").trim().toLowerCase();

      setProfileState({
        email: profile?.email || user.email || "",
        universityId: studentId,
        role,
      });
      setIsLoading(false);
    }

    loadInviteProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const visibleError = submitError || loadError || errorMessage;
  const roleLabel = getRoleLabel(profileState?.role || "student");
  const idLabel = getIdLabel(profileState?.role || "student");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedPassword.length < 8) {
      setSubmitError("Password must be at least 8 characters long.");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: trimmedPassword,
      data: {
        onboarding_completed: true,
      },
    });

    if (error) {
      setSubmitError(error.message || "Failed to save your password.");
      setIsSubmitting(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user?.id || "")
      .maybeSingle();

    const role = String(profile?.role || user?.user_metadata?.role || "").toLowerCase();

    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else if (role === "instructor") {
      router.replace("/instructor/dashboard");
    } else {
      router.replace("/student/dashboard");
    }

    router.refresh();
  };

  return (
    <div className="pageShell login-page">
      <header className="topBar">
        <div className="topBarInner">
          <p className="portalText">Secure Education Portal</p>
          <p className="portalText">Account Setup</p>
        </div>
      </header>

      <main className="mainArea">
        <section className="loginCard" aria-labelledby="invite-setup-title">
          <div className="cardHeading">
            <h1 id="invite-setup-title">Complete your account</h1>
            <p>Set a password to activate your invited {roleLabel.toLowerCase()} account.</p>
          </div>

          {visibleError && (
            <p className="message visible error" style={{ marginTop: 0 }}>
              {visibleError}
            </p>
          )}

          {isLoading ? (
            <p className="message visible info" style={{ marginTop: 0, minHeight: 24 }}>
              Loading your invite details...
            </p>
          ) : profileState ? (
            <form className="loginForm" onSubmit={handleSubmit} noValidate>
              <label className="fieldGroup" htmlFor="invite-email">
                  <span className="fieldLabel">{roleLabel} Email</span>
                <span className="inputShell">
                  <input
                    id="invite-email"
                    value={profileState.email}
                    type="email"
                    readOnly
                    aria-readonly="true"
                  />
                </span>
              </label>

              <label className="fieldGroup" htmlFor="invite-student-id" style={{ marginTop: 20 }}>
                <span className="fieldLabel">{idLabel}</span>
                <span className="inputShell">
                  <input
                    id="invite-student-id"
                    value={profileState.universityId}
                    type="text"
                    readOnly
                    aria-readonly="true"
                  />
                </span>
              </label>

              <label className="fieldGroup" htmlFor="password" style={{ marginTop: 20 }}>
                <span className="fieldLabel">Password</span>
                <span className="inputShell">
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </span>
              </label>

              <label className="fieldGroup" htmlFor="confirmPassword" style={{ marginTop: 20 }}>
                <span className="fieldLabel">Confirm Password</span>
                <span className="inputShell">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </span>
              </label>

              <button
                className="loginButton"
                type="submit"
                style={{ marginTop: 28 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving password..." : "Set Up Account"}
              </button>
            </form>
          ) : null}
        </section>
      </main>
    </div>
  );
}
