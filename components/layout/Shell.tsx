"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  DepartmentIcon,
  SearchIcon,
  ProjectIcon,
  TaskIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  UsersIcon,
  LayoutDashboardIcon,
  LogOutIcon
} from "@/components/ui/Icons";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { useAuth } from "@/components/auth/AuthProvider";

const publicLinks = [
  { label: "Dashboard", href: "/", icon: HomeIcon },
  { label: "Departments", href: "/departments", icon: DepartmentIcon },
  { label: "Search", href: "/search", icon: SearchIcon },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const { isAuthenticated, isAdmin, account, logout } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored) {
      setIsDesktopCollapsed(stored === "true");
    }
  }, []);

  const toggleDesktopSidebar = () => {
    const newVal = !isDesktopCollapsed;
    setIsDesktopCollapsed(newVal);
    localStorage.setItem("sidebarCollapsed", newVal.toString());
  };

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderNavLinks = (
    items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[],
    closeMenu?: () => void
  ) => {
    return items.map(({ label, href, icon: Icon }) => {
      const active = isItemActive(href);
      return (
        <Link
          key={href}
          href={href}
          onClick={closeMenu}
          title={isDesktopCollapsed ? label : undefined}
          className={`group flex items-center h-10 rounded-lg text-sm transition-colors duration-150 ${
            isDesktopCollapsed ? "justify-center w-10 mx-auto" : "gap-3 px-3 w-full"
          } ${
            active
              ? "bg-primary/10 text-primary font-medium"
              : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
          }`}
        >
          <Icon className={`h-5 w-5 shrink-0 transition-colors ${active ? "text-primary" : "text-slate-500 group-hover:text-slate-700"}`} />
          {!isDesktopCollapsed && (
            <span className="truncate">{label}</span>
          )}
        </Link>
      );
    });
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <div className="min-h-screen bg-background flex flex-col">{children}</div>;
  }

  const managementLinks = [
    { label: "Overview", href: "/admin", icon: LayoutDashboardIcon },
    { label: "Departments", href: "/admin/departments", icon: DepartmentIcon },
    { label: "Projects", href: "/admin/projects", icon: ProjectIcon },
    { label: "Tasks", href: "/admin/tasks", icon: TaskIcon },
    { label: "Tags", href: "/admin/tags", icon: TagIcon },
    ...(isAdmin ? [{ label: "Accounts", href: "/admin/accounts", icon: UsersIcon }] : []),
  ];

  const accountLinks = isAuthenticated
    ? [{ label: "Profile", href: "/profile", icon: UserIcon }]
    : [
        { label: "Login", href: "/login", icon: UserIcon },
        { label: "Register", href: "/register", icon: ChevronRightIcon },
      ];

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Mobile Top Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-theme-border bg-white px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900">
          <img src="/tasktrack-logo.png" alt="TaskTrack Logo" className="h-7 w-7 object-contain shrink-0" />
          <span>TaskTrack</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {isMobileMenuOpen ? <XIcon className="h-5 w-5 shrink-0" /> : <MenuIcon className="h-5 w-5 shrink-0" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-theme-border bg-white transition-all duration-200 lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDesktopCollapsed ? "lg:w-[68px]" : "lg:w-64"} w-64`}
      >
        {/* Sidebar Header */}
        <div
          className={`flex h-14 shrink-0 items-center border-b border-theme-border/60 ${
            isDesktopCollapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 overflow-hidden"
            title={isDesktopCollapsed ? "TaskTrack" : undefined}
          >
            <img src="/tasktrack-logo.png" alt="TaskTrack Logo" className="h-7 w-7 shrink-0 object-contain" />
            {!isDesktopCollapsed && (
              <span className="text-base font-bold tracking-tight text-slate-900">
                TaskTrack
              </span>
            )}
          </Link>

          {!isDesktopCollapsed && (
            <button
              onClick={toggleDesktopSidebar}
              aria-label="Collapse sidebar"
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none"
            >
              <ChevronLeftIcon className="h-4 w-4 shrink-0" />
            </button>
          )}

          {isDesktopCollapsed && (
            <button
              onClick={toggleDesktopSidebar}
              aria-label="Expand sidebar"
              className="hidden lg:flex absolute -right-3 top-4 h-6 w-6 items-center justify-center rounded-full border border-theme-border bg-white text-slate-500 shadow-xs transition hover:text-primary hover:border-primary/40 focus:outline-none"
            >
              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-3.5 space-y-5">
          {/* NAVIGATION */}
          <div>
            {!isDesktopCollapsed && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Navigation
              </p>
            )}
            <nav className="space-y-0.5">
              {renderNavLinks(publicLinks, () => setIsMobileMenuOpen(false))}
            </nav>
          </div>

          {/* MANAGEMENT (when authenticated) */}
          {isAuthenticated && (
            <div>
              {!isDesktopCollapsed && (
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Management
                </p>
              )}
              <nav className="space-y-0.5">
                {renderNavLinks(managementLinks, () => setIsMobileMenuOpen(false))}
              </nav>
            </div>
          )}

          {/* ACCOUNT */}
          <div>
            {!isDesktopCollapsed && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Account
              </p>
            )}
            <nav className="space-y-0.5">
              {renderNavLinks(accountLinks, () => setIsMobileMenuOpen(false))}
            </nav>
          </div>
        </div>

        {/* BOTTOM USER AREA (when authenticated) */}
        {isAuthenticated && account && (
          <div className="border-t border-theme-border/70 p-3 bg-slate-50/50">
            {!isDesktopCollapsed ? (
              <div className="flex items-center justify-between gap-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 min-w-0 flex-1 rounded-lg p-1 transition-colors hover:bg-slate-100/80"
                  title="View Profile"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {account.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-xs font-semibold text-slate-900 leading-tight">
                      {account.fullName}
                    </p>
                    <div className="mt-0.5">
                      <RoleBadge role={account.role} />
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOutIcon className="h-4 w-4 shrink-0" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs hover:ring-2 hover:ring-primary/30 transition"
                  title={`${account.fullName} (${account.role === 1 ? "Admin" : "Staff"})`}
                >
                  {account.fullName.substring(0, 2).toUpperCase()}
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus:outline-none"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOutIcon className="h-4 w-4 shrink-0" />
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
