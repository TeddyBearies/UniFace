"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AppRole } from "@/features/auth/types";
import { getClientSessionRole } from "@/features/auth/client-auth";

export function useClientRoleGuard(allowedRoles: AppRole[]) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const rolesKey = useMemo(() => allowedRoles.join(","), [allowedRoles]);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      const sessionRole = await getClientSessionRole();

      if (cancelled) {
        return;
      }

      if (!sessionRole || !allowedRoles.includes(sessionRole.role)) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.replace("/login");
        router.refresh();
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [rolesKey, router]);

  return {
    isChecking,
    isAuthorized,
  };
}
