import Link from "next/link";
import { PriorityBadge, TagPill, TaskStatusBadge } from "@/components/ui/Badge";
import { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { TaskIcon } from "@/components/ui/Icons";

export function TaskRow({ task }: { task: Task }) {
  return (
    <Link
      href={`/tasks/${task.taskId}`}
      className="group grid gap-3.5 rounded-xl border border-theme-border bg-white p-4 shadow-xs transition-all hover:border-slate-300 hover:shadow-xs md:grid-cols-[1fr_auto_auto] items-center"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
          <TaskIcon className="h-5 w-5 shrink-0" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 group-hover:text-primary transition-colors truncate">
            {task.title}
          </h3>
          <p className="text-xs text-slate-500 truncate">{task.projectName}</p>
          {task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <TagPill key={tag.tagId} name={tag.tagName} color={tag.color} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <TaskStatusBadge value={task.status} />
        <PriorityBadge value={task.priority} />
      </div>

      <div className="text-right">
        <span className="text-xs text-slate-500 font-medium">{formatDate(task.dueDate)}</span>
      </div>
    </Link>
  );
}
