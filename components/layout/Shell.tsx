"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { MenuIcon, XIcon, HomeIcon, DepartmentIcon, SearchIcon, ProjectIcon, TaskIcon, TagIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

const links = [
  { label: "Dashboard", href: "/", icon: HomeIcon },
  { label: "Departments", href: "/departments", icon: DepartmentIcon },
  { label: "Search", href: "/search", icon: SearchIcon },
];

const managementLinks = [
  { label: "Departments", href: "/departments/manage", icon: DepartmentIcon },
  { label: "Projects", href: "/projects/manage", icon: ProjectIcon },
  { label: "Tasks", href: "/tasks/manage", icon: TaskIcon },
  { label: "Tags", href: "/tags/manage", icon: TagIcon },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

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

  const renderNavLinks = (items: typeof links, closeMenu?: () => void) => {
    return items.map(({ label, href, icon: Icon }) => {
      const isActive = pathname === href;
      return (
        <Link
          key={href}
          href={href}
          onClick={closeMenu}
          title={isDesktopCollapsed ? label : undefined}
          className={`flex items-center rounded-xl text-sm font-medium transition-all duration-300 ${
            isDesktopCollapsed ? "justify-center p-3" : "gap-3 px-3 py-2.5"
          } ${
            isActive
              ? "bg-primary-soft text-primary"
              : "text-theme-text hover:bg-slate-100 hover:text-primary"
          }`}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isDesktopCollapsed ? "w-0 opacity-0" : "w-[120px] opacity-100"}`}>
            {label}
          </span>
        </Link>
      );
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Mobile Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-theme-border bg-surface px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-theme-text">
          <img src="/tasktrack-logo.png" alt="TaskTrack Logo" className="h-8 w-8 object-contain" />
          TaskTrack
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-xl p-2 text-theme-text hover:bg-slate-100"
        >
          {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform flex-col border-r border-theme-border bg-surface transition-all duration-300 lg:static lg:flex lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDesktopCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        <div className={`hidden items-center lg:flex ${isDesktopCollapsed ? "h-auto flex-col gap-4 py-4" : "h-16 justify-between px-6"}`}>
          <Link href="/" className="flex items-center gap-3 overflow-hidden" title={isDesktopCollapsed ? "TaskTrack" : undefined}>
            <img src="/tasktrack-logo.png" alt="TaskTrack Logo" className="h-10 w-10 shrink-0 object-contain" />
            <span className={`text-xl font-bold tracking-tight text-theme-text whitespace-nowrap transition-all duration-300 overflow-hidden ${isDesktopCollapsed ? "w-0 opacity-0" : "w-[110px] opacity-100"}`}>
              TaskTrack
            </span>
          </Link>
          
          <button
            onClick={toggleDesktopSidebar}
            aria-label={isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-theme-muted transition-colors hover:bg-primary-soft hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {isDesktopCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            {renderNavLinks(links, () => setIsMobileMenuOpen(false))}
          </nav>
          
          <div className="mt-8">
            <h3 className={`mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-theme-muted transition-all duration-300 overflow-hidden whitespace-nowrap ${isDesktopCollapsed ? "h-0 max-w-0 opacity-0 mb-0" : "h-auto max-w-[150px] opacity-100"}`}>
              Management
            </h3>
            <nav className="space-y-1">
              {renderNavLinks(managementLinks, () => setIsMobileMenuOpen(false))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
