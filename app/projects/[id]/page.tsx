import { TaskRow } from "@/components/tasks/TaskRow";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { ProjectDetail } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await api.get<ProjectDetail>(`/api/projects/${id}`);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-theme-border bg-surface p-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-text">{project.projectName}</h1>
          <ProjectStatusBadge value={project.status} />
        </div>
        <p className="mt-4 text-lg text-theme-muted">{project.description ?? "No description"}</p>
        <dl className="mt-8 grid gap-6 text-sm md:grid-cols-3">
          <Info label="Department" value={project.departmentName} />
          <Info label="Start date" value={formatDate(project.startDate)} />
          <Info label="End date" value={formatDate(project.endDate)} />
        </dl>
      </section>

      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-theme-text">Tasks</h2>
        {project.tasks.length === 0 ? <EmptyState label="No active tasks in this project." /> : <div className="space-y-4">{project.tasks.map((task) => <TaskRow key={task.taskId} task={task} />)}</div>}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 border border-theme-border">
      <dt className="text-xs font-semibold uppercase tracking-wider text-theme-muted">{label}</dt>
      <dd className="mt-1 text-base font-medium text-theme-text">{value}</dd>
    </div>
  );
}
