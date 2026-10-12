"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLoader } from "@/components/ui/States";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, account } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If we have definitively loaded auth and there is no token, redirect.
    // AuthProvider initializes and sets token/account. 
    // If not authenticated, redirect.
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
