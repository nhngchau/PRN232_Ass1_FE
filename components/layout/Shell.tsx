"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const links = [
  ["Home", "/"],
  ["Departments", "/departments"],
  ["Search", "/search"],
  ["Manage Departments", "/departments/manage"],
  ["Manage Projects", "/projects/manage"],
  ["Manage Tasks", "/tasks/manage"],
  ["Manage Tags", "/tags/manage"]
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-xl font-bold text-ink">
            TaskTrack
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 ${
                  pathname === href ? "bg-ocean text-white" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
