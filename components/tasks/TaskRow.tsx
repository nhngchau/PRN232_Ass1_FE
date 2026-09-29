import Link from "next/link";
import { PriorityBadge, TagPill, TaskStatusBadge } from "@/components/ui/Badge";
import { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { TaskIcon } from "@/components/ui/Icons";

export function TaskRow({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.taskId}`} className="group grid gap-4 rounded-2xl border border-theme-border bg-surface p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md md:grid-cols-[1fr_auto_auto] items-center">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <TaskIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold tracking-tight text-theme-text group-hover:text-primary transition-colors">{task.title}</h3>
          <p className="mt-1 text-sm text-theme-muted">{task.projectName}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <TagPill key={tag.tagId} name={tag.tagName} color={tag.color} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <TaskStatusBadge value={task.status} />
        <PriorityBadge value={task.priority} />
      </div>
      <p className="text-sm font-medium text-theme-muted">{formatDate(task.dueDate)}</p>
    </Link>
  );
}
