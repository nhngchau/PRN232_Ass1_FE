import Link from "next/link";
import { TaskRow } from "@/components/tasks/TaskRow";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { ProjectDetail } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ChevronLeftIcon, ProjectIcon } from "@/components/ui/Icons";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await api.get<ProjectDetail>(`/api/projects/${id}`);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="mb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-theme-muted hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <section className="rounded-xl border border-theme-border bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-theme-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ProjectIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-theme-text sm:text-2xl">
                  {project.projectName}
                </h1>
                <ProjectStatusBadge value={project.status} />
              </div>
            </div>
          </div>
        </div>

        {project.description && (
          <p className="mt-4 text-sm text-theme-muted leading-relaxed">
            {project.description}
          </p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <InfoCard label="Department" value={project.departmentName} />
          <InfoCard label="Start Date" value={formatDate(project.startDate)} />
          <InfoCard label="End Date" value={formatDate(project.endDate)} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-base font-bold tracking-tight text-theme-text sm:text-lg">
          Project Tasks ({project.tasks.length})
        </h2>
        {project.tasks.length === 0 ? (
          <EmptyState label="No active tasks in this project." />
        ) : (
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <TaskRow key={task.taskId} task={task} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50/70 p-3.5 border border-theme-border/60">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-theme-muted">
        {label}
      </span>
      <span className="mt-1 block text-sm font-semibold text-theme-text truncate">
        {value}
      </span>
    </div>
  );
}
