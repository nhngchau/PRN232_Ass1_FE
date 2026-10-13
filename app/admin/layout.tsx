"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLoader } from "@/components/ui/States";
import { ensureValidSession, isTokenExpired } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated, isInitialized, isManualLogoutInProgress } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isSessionExpired = !!token && isTokenExpired(token);

  useEffect(() => {
    // Only redirect if session restoration has finished and the user is not authenticated
    if (!isInitialized) return;
    if (!isAuthenticated && !isManualLogoutInProgress) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, isManualLogoutInProgress, router]);

  useEffect(() => {
    // An expired token is not a valid session: try the refresh token, otherwise send the user to /login
    if (!isInitialized || !isSessionExpired || isManualLogoutInProgress) return;
    ensureValidSession().then((isValid) => {
      if (!isValid) window.dispatchEvent(new Event("auth:401"));
    });
  }, [isInitialized, isSessionExpired, isManualLogoutInProgress, pathname]);

  if (!isInitialized || !isAuthenticated || isManualLogoutInProgress || isSessionExpired) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
