import Link from "next/link";
import { PriorityBadge, TagPill, TaskStatusBadge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { TaskDetail } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ChevronLeftIcon, TaskIcon } from "@/components/ui/Icons";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const task = await api.get<TaskDetail>(`/api/tasks/${id}`);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="mb-2">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-theme-muted hover:text-primary transition-colors"
        >
          <ChevronLeftIcon className="h-3.5 w-3.5" />
          <span>Back to Search / Tasks</span>
        </Link>
      </div>

      <section className="rounded-xl border border-theme-border bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-theme-border/70 pb-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TaskIcon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-theme-text sm:text-2xl">
                {task.title}
              </h1>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <TaskStatusBadge value={task.status} />
                <PriorityBadge value={task.priority} />
              </div>
            </div>
          </div>
        </div>

        {task.description && (
          <div className="mt-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-theme-muted mb-1.5">
              Description
            </h2>
            <p className="text-sm text-theme-text leading-relaxed whitespace-pre-line">
              {task.description}
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard label="Project" value={task.projectName} />
          <InfoCard label="Department" value={task.departmentName} />
          <InfoCard label="Due Date" value={formatDate(task.dueDate)} />
          <InfoCard label="Created Date" value={formatDate(task.createdDate)} />
          <InfoCard label="Modified Date" value={formatDate(task.modifiedDate)} />
        </div>

        <div className="mt-6 border-t border-theme-border/70 pt-4">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-theme-muted">
            Assigned Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {task.tags.length === 0 ? (
              <span className="text-xs text-theme-muted italic">No tags assigned to this task.</span>
            ) : (
              task.tags.map((tag) => (
                <TagPill key={tag.tagId} name={tag.tagName} color={tag.color} />
              ))
            )}
          </div>
        </div>
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
