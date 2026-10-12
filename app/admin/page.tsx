"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Department, Project, Task, Tag } from "@/lib/types";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  DepartmentIcon,
  ProjectIcon,
  TaskIcon,
  TagIcon,
  UsersIcon,
  ChevronRightIcon
} from "@/components/ui/Icons";
import { PageLoader } from "@/components/ui/States";
import { RoleBadge } from "@/components/ui/RoleBadge";

export default function AdminDashboard() {
  const { account, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    departments: 0,
    projects: 0,
    tasks: 0,
    tags: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [depts, projs, tasks, tags] = await Promise.all([
          api.get<Department[]>("/departments").catch(() => []),
          api.get<Project[]>("/projects").catch(() => []),
          api.get<Task[]>("/tasks").catch(() => []),
          api.get<Tag[]>("/tags").catch(() => [])
        ]);
        setStats({
          departments: depts?.length || 0,
          projects: projs?.length || 0,
          tasks: tasks?.length || 0,
          tags: tags?.length || 0
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  const statCards = [
    {
      title: "Departments",
      count: stats.departments,
      href: "/admin/departments",
      icon: DepartmentIcon,
      accent: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      title: "Projects",
      count: stats.projects,
      href: "/admin/projects",
      icon: ProjectIcon,
      accent: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "Tasks",
      count: stats.tasks,
      href: "/admin/tasks",
      icon: TaskIcon,
      accent: "bg-pink-50 text-pink-600 border-pink-100"
    },
    {
      title: "Tags",
      count: stats.tags,
      href: "/admin/tags",
      icon: TagIcon,
      accent: "bg-amber-50 text-amber-600 border-amber-100"
    }
  ];

  const quickActions = [
    {
      title: "Manage Departments",
      description: "Manage organizational units and descriptions",
      href: "/admin/departments",
      icon: DepartmentIcon
    },
    {
      title: "Manage Projects",
      description: "Oversee project dates, status, and departments",
      href: "/admin/projects",
      icon: ProjectIcon
    },
    {
      title: "Manage Tasks",
      description: "Track work items, priorities, and assigned tags",
      href: "/admin/tasks",
      icon: TaskIcon
    },
    {
      title: "Manage Tags",
      description: "Organize custom labels and color indicators",
      href: "/admin/tags",
      icon: TagIcon
    },
    ...(isAdmin
      ? [
          {
            title: "Manage Accounts",
            description: "View and update user roles and credentials",
            href: "/admin/accounts",
            icon: UsersIcon
          }
        ]
      : [])
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Welcome Header */}
      <div className="rounded-xl border border-theme-border bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {account?.fullName}
          </h1>
          <RoleBadge role={account?.role ?? 0} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your workspace.
        </p>
      </div>

      {/* 4 Compact Summary Cards in one row on desktop */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group flex flex-col justify-between rounded-xl border border-theme-border bg-white p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {card.title}
                  </span>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${card.accent}`}>
                    <Icon className="h-4 w-4 shrink-0" />
                  </div>
                </div>

                <div className="my-2">
                  <p className="text-2xl font-bold tracking-tight text-slate-900">
                    {card.count}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-medium text-primary">
                  <span>Manage {card.title}</span>
                  <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions in a compact grid */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-start gap-3 rounded-xl border border-theme-border bg-white p-3.5 shadow-xs transition-all hover:border-primary/40 hover:shadow-xs"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-700 border border-theme-border/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Icon className="h-5 w-5 shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {action.title}
                    </p>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 truncate">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
