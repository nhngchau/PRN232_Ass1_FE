import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { DepartmentDetail } from "@/lib/types";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const department = await api.get<DepartmentDetail>(`/api/departments/${id}`);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-theme-border bg-surface p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-theme-text">{department.departmentName}</h1>
        <p className="mt-4 text-lg text-theme-muted">{department.departmentDescription}</p>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-theme-text">Projects in this Department</h2>
        {department.projects.length === 0 ? (
          <EmptyState label="This department has no active projects." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {department.projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
