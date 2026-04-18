"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type InviteCallbackHandlerProps = {
  nextPathParam?: string;
  code?: string;
  tokenHash?: string;
  type?: string;
};

function getSafeRedirectPath(nextPath: string | undefined) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/invite-setup";
  }

  return nextPath;
}

function buildLoginErrorUrl(message: string) {
  return `/login?error=${encodeURIComponent(message)}`;
}

export default function InviteCallbackHandler({
  nextPathParam,
  code,
  tokenHash,
  type,
}: InviteCallbackHandlerProps) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("Preparing your account setup...");

  useEffect(() => {
    let cancelled = false;

    async function resolveInvite() {
      const supabase = createClient();
      const nextPath = getSafeRedirectPath(nextPathParam);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const hashErrorDescription = hashParams.get("error_description");
      const hashErrorCode = hashParams.get("error_code");

      let errorMessage: string | null = null;

      // Supabase can send invite state back in a few different formats depending
      // on how the email link was generated, so we support the main variants here.
      if (hashErrorDescription || hashErrorCode) {
        errorMessage =
          hashErrorCode === "otp_expired"
            ? "This invite link has expired or has already been used. Please request a new invite."
            : decodeURIComponent(hashErrorDescription || "Invite link is invalid or expired.");
      } else if (accessToken && refreshToken) {
        setStatusMessage("Finalizing your invite session...");
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        errorMessage = error?.message || null;
      } else if (code) {
        setStatusMessage("Verifying your invite link...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        errorMessage = error?.message || null;
      } else if (tokenHash && type) {
        setStatusMessage("Confirming your invite...");
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as EmailOtpType,
        });
        errorMessage = error?.message || null;
      } else {
        errorMessage = "Invite link is invalid or expired.";
      }

      if (cancelled) {
        return;
      }

      if (errorMessage) {
        router.replace(buildLoginErrorUrl(errorMessage));
        router.refresh();
        return;
      }

      router.replace(nextPath);
      router.refresh();
    }

    resolveInvite();

    return () => {
      cancelled = true;
    };
  }, [code, nextPathParam, router, tokenHash, type]);

  return (
    <div className="pageShell login-page">
      <header className="topBar">
        <div className="topBarInner">
          <p className="portalText">Secure Education Portal</p>
          <p className="portalText">Invite Verification</p>
        </div>
      </header>

      <main className="mainArea">
        <section className="loginCard" aria-labelledby="invite-callback-title">
          <div className="cardHeading">
            <h1 id="invite-callback-title">Setting up your secure session</h1>
            <p>{statusMessage}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
