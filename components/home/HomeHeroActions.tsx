"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button, SecondaryButton } from "@/components/ui/Buttons";
import { LayoutDashboardIcon, UserIcon, ChevronRightIcon } from "@/components/ui/Icons";

export function HomeHeroActions() {
  const { isAuthenticated, account } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-3 pt-3">
        <Link href="/admin">
          <Button className="!h-10 !px-4">
            <LayoutDashboardIcon className="h-4 w-4 shrink-0" />
            <span>Go to Workspace</span>
            <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
          </Button>
        </Link>
        <Link href="/profile">
          <SecondaryButton className="!h-10 !px-4">
            <UserIcon className="h-4 w-4 shrink-0" />
            <span>Profile ({account?.fullName})</span>
          </SecondaryButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 pt-3">
      <Link href="/login">
        <Button className="!h-10 !px-4">
          <span>Sign in</span>
          <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
        </Button>
      </Link>
      <Link href="/register">
        <SecondaryButton className="!h-10 !px-4">
          <span>Create an account</span>
        </SecondaryButton>
      </Link>
    </div>
  );
}
