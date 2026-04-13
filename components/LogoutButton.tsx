"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  className: string;
  children: ReactNode;
  redirectTo?: string;
};

export default function LogoutButton({
  className,
  children,
  redirectTo = "/login",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.replace(redirectTo);
      router.refresh();
      setIsSigningOut(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleSignOut}
      disabled={isSigningOut}
      aria-busy={isSigningOut}
    >
      {children}
    </button>
  );
}
