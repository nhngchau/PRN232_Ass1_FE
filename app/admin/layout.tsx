"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLoader } from "@/components/ui/States";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized, isManualLogoutInProgress } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if session restoration has finished and the user is not authenticated
    if (!isInitialized) return;
    if (!isAuthenticated && !isManualLogoutInProgress) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, isManualLogoutInProgress, router]);

  if (!isInitialized || !isAuthenticated || isManualLogoutInProgress) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
