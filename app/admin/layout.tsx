"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLoader } from "@/components/ui/States";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isManualLogoutInProgress } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If we have definitively loaded auth and there is no token, redirect.
    // AuthProvider initializes and sets token/account. 
    // If not authenticated, redirect.
    if (!isAuthenticated && !isManualLogoutInProgress) {
      router.push("/login");
    }
  }, [isAuthenticated, isManualLogoutInProgress, router]);

  if (!isAuthenticated || isManualLogoutInProgress) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
