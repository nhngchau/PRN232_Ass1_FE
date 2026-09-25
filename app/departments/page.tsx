import Link from "next/link";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { Department } from "@/lib/types";

export default async function DepartmentsPage() {
  const departments = await api.get<Department[]>("/api/departments");

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Departments</h1>
      {departments.length === 0 ? (
        <EmptyState label="No active departments found." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {departments.map((department) => (
            <Link key={department.departmentId} href={`/departments/${department.departmentId}`} className="rounded-md border border-slate-200 bg-white p-5 hover:border-ocean">
              <h2 className="font-semibold">{department.departmentName}</h2>
              <p className="mt-2 text-sm text-slate-600">{department.departmentDescription}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
