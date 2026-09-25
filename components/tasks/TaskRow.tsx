import Link from "next/link";
import { PriorityBadge, TagPill, TaskStatusBadge } from "@/components/ui/Badge";
import { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function TaskRow({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.taskId}`} className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 hover:border-ocean md:grid-cols-[1fr_auto_auto]">
      <div>
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-sm text-slate-600">{task.projectName}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <TagPill key={tag.tagId} name={tag.tagName} color={tag.color} />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <TaskStatusBadge value={task.status} />
        <PriorityBadge value={task.priority} />
      </div>
      <p className="text-sm text-slate-600">{formatDate(task.dueDate)}</p>
    </Link>
  );
}
