"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button, SecondaryButton } from "@/components/ui/Buttons";
import { LayoutDashboardIcon, UserIcon, ChevronRightIcon, DepartmentIcon, SearchIcon } from "@/components/ui/Icons";

export function HomeHeroActions() {
  const { isAuthenticated, account } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="flex flex-wrap items-center gap-3 pt-3">
        <Link href="/admin">
          <Button className="!h-10 !px-4">
            <LayoutDashboardIcon className="h-4 w-4 shrink-0" />
            <span>Go to Dashboard</span>
            <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
          </Button>
        </Link>
        <Link href="/departments">
          <SecondaryButton className="!h-10 !px-4">
            <DepartmentIcon className="h-4 w-4 shrink-0" />
            <span>Departments</span>
          </SecondaryButton>
        </Link>
        <Link href="/search">
          <SecondaryButton className="!h-10 !px-4">
            <SearchIcon className="h-4 w-4 shrink-0" />
            <span>Search</span>
          </SecondaryButton>
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
          <span>Register</span>
        </SecondaryButton>
      </Link>
      <Link href="/departments">
        <SecondaryButton className="!h-10 !px-4">
          <DepartmentIcon className="h-4 w-4 shrink-0" />
          <span>Departments</span>
        </SecondaryButton>
      </Link>
      <Link href="/search">
        <SecondaryButton className="!h-10 !px-4">
          <SearchIcon className="h-4 w-4 shrink-0" />
          <span>Search</span>
        </SecondaryButton>
      </Link>
    </div>
  );
}
