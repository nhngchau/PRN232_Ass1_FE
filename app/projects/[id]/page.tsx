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
    <div className="space-y-6">
      <section className="rounded-md bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{project.projectName}</h1>
          <ProjectStatusBadge value={project.status} />
        </div>
        <p className="mt-2 text-slate-600">{project.description ?? "No description"}</p>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          <Info label="Department" value={project.departmentName} />
          <Info label="Start date" value={formatDate(project.startDate)} />
          <Info label="End date" value={formatDate(project.endDate)} />
        </dl>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Tasks</h2>
        {project.tasks.length === 0 ? <EmptyState label="No active tasks in this project." /> : <div className="space-y-3">{project.tasks.map((task) => <TaskRow key={task.taskId} task={task} />)}</div>}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
