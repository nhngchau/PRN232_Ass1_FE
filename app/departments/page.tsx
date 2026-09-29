import Link from "next/link";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { Department } from "@/lib/types";
import { DepartmentIcon } from "@/components/ui/Icons";

export default async function DepartmentsPage() {
  const departments = await api.get<Department[]>("/api/departments");

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-theme-text">Departments</h1>
      {departments.length === 0 ? (
        <EmptyState label="No active departments found." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {departments.map((department) => (
            <Link key={department.departmentId} href={`/departments/${department.departmentId}`} className="group flex flex-col justify-between rounded-2xl border border-theme-border bg-surface p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <DepartmentIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-theme-text group-hover:text-primary transition-colors">{department.departmentName}</h2>
                  <p className="mt-2 text-sm text-theme-muted">{department.departmentDescription}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
