import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { DepartmentDetail } from "@/lib/types";

export default async function DepartmentDetailPage({ params }: { params: { id: string } }) {
  const department = await api.get<DepartmentDetail>(`/api/departments/${params.id}`);

  return (
    <div className="space-y-6">
      <section className="rounded-md bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{department.departmentName}</h1>
        <p className="mt-2 text-slate-600">{department.departmentDescription}</p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Projects</h2>
        {department.projects.length === 0 ? (
          <EmptyState label="This department has no active projects." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {department.projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
