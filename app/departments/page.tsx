import Link from "next/link";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { Department } from "@/lib/types";
import { DepartmentIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function DepartmentsPage() {
  const departments = await api.get<Department[]>("/api/departments").catch(() => []);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Departments"
        description="Browse all organizational departments and their assigned projects."
        icon={DepartmentIcon}
      />

      {departments.length === 0 ? (
        <EmptyState label="No active departments found." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {departments.map((department) => (
            <Link
              key={department.departmentId}
              href={`/departments/${department.departmentId}`}
              className="group flex flex-col justify-between rounded-xl border border-theme-border bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-sm"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <DepartmentIcon className="h-5 w-5 shrink-0" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-theme-text group-hover:text-primary transition-colors">
                    {department.departmentName}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-theme-muted leading-relaxed line-clamp-2">
                    {department.departmentDescription}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
