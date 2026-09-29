import { PriorityBadge, TagPill, TaskStatusBadge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { TaskDetail } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await api.get<TaskDetail>(`/api/tasks/${id}`);

  return (
    <section className="rounded-2xl border border-theme-border bg-surface p-8 shadow-sm">
      <h1 className="text-3xl font-extrabold tracking-tight text-theme-text">{task.title}</h1>
      <p className="mt-4 text-lg text-theme-muted">{task.description ?? "No description"}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <TaskStatusBadge value={task.status} />
        <PriorityBadge value={task.priority} />
      </div>
      <dl className="mt-8 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
        <Info label="Project" value={task.projectName} />
        <Info label="Department" value={task.departmentName} />
        <Info label="Due date" value={formatDate(task.dueDate)} />
        <Info label="Created date" value={formatDate(task.createdDate)} />
        <Info label="Modified date" value={formatDate(task.modifiedDate)} />
      </dl>
      <div className="mt-8 pt-6 border-t border-theme-border">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-theme-muted">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {task.tags.length === 0 ? <span className="text-sm text-theme-muted">No tags</span> : task.tags.map((tag) => <TagPill key={tag.tagId} name={tag.tagName} color={tag.color} />)}
        </div>
      </div>
    </section>
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
