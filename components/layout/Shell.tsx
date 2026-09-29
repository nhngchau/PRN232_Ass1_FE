"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { MenuIcon, XIcon, HomeIcon, DepartmentIcon, SearchIcon, ProjectIcon, TaskIcon, TagIcon } from "@/components/ui/Icons";

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

  const renderNavLinks = (items: typeof links, closeMenu?: () => void) => {
    return items.map(({ label, href, icon: Icon }) => {
      const isActive = pathname === href;
      return (
        <Link
          key={href}
          href={href}
          onClick={closeMenu}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? "bg-primary-soft text-primary"
              : "text-theme-text hover:bg-slate-100 hover:text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
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
        className={`fixed inset-y-0 left-0 z-40 w-64 transform flex-col border-r border-theme-border bg-surface transition-transform duration-300 lg:static lg:flex lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden h-16 items-center px-6 lg:flex">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-theme-text">
            <img src="/tasktrack-logo.png" alt="TaskTrack Logo" className="h-10 w-10 object-contain" />
            TaskTrack
          </Link>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            {renderNavLinks(links, () => setIsMobileMenuOpen(false))}
          </nav>
          
          <div className="mt-8">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-theme-muted">
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
