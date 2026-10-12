import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { DepartmentDetail } from "@/lib/types";
import { DepartmentIcon, ChevronLeftIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function DepartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const department = await api.get<DepartmentDetail>(`/api/departments/${id}`);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="mb-2">
        <Link
          href="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-theme-muted hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          <span>Back to Departments</span>
        </Link>
      </div>

      <PageHeader
        title={department.departmentName}
        description={department.departmentDescription}
        icon={DepartmentIcon}
      />

      <section>
        <h2 className="mb-4 text-base font-bold tracking-tight text-theme-text sm:text-lg">
          Projects in this Department ({department.projects.length})
        </h2>
        {department.projects.length === 0 ? (
          <EmptyState label="This department currently has no active projects." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {department.projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
