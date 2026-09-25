import { PriorityBadge, TagPill, TaskStatusBadge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { TaskDetail } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = await api.get<TaskDetail>(`/api/tasks/${params.id}`);

  return (
    <section className="rounded-md bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="mt-2 text-slate-600">{task.description ?? "No description"}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <TaskStatusBadge value={task.status} />
        <PriorityBadge value={task.priority} />
      </div>
      <dl className="mt-6 grid gap-4 text-sm md:grid-cols-2">
        <Info label="Project" value={task.projectName} />
        <Info label="Department" value={task.departmentName} />
        <Info label="Due date" value={formatDate(task.dueDate)} />
        <Info label="Created date" value={formatDate(task.createdDate)} />
        <Info label="Modified date" value={formatDate(task.modifiedDate)} />
      </dl>
      <div className="mt-6">
        <h2 className="mb-2 font-semibold">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {task.tags.length === 0 ? <span className="text-sm text-slate-500">No tags</span> : task.tags.map((tag) => <TagPill key={tag.tagId} name={tag.tagName} color={tag.color} />)}
        </div>
      </div>
    </section>
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
