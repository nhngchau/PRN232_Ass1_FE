import { projectStatuses, taskPriorities, taskStatuses } from "@/lib/constants";

const styles = [
  "bg-slate-100 text-slate-700 border-slate-200", // 0: Neutral / default
  "bg-blue-50 text-blue-700 border-blue-200", // 1: Info / In Progress
  "bg-emerald-50 text-emerald-700 border-emerald-200", // 2: Success
  "bg-amber-50 text-amber-700 border-amber-200" // 3: Warning / Hold / High
];

export function Badge({ children, tone = 0 }: { children: React.ReactNode; tone?: number }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[tone] ?? styles[0]}`}>{children}</span>;
}

export function ProjectStatusBadge({ value }: { value: number }) {
  // Map project status to visual tones:
  // Assuming 0: Planning (Neutral), 1: Active (Info), 2: Completed (Success), 3: On Hold (Warning)
  return <Badge tone={value}>{projectStatuses[value] ?? "Unknown"}</Badge>;
}

export function TaskStatusBadge({ value }: { value: number }) {
  return <Badge tone={value}>{taskStatuses[value] ?? "Unknown"}</Badge>;
}

export function PriorityBadge({ value }: { value: number }) {
  const tone = value === 3 ? 3 : value;
  return <Badge tone={tone}>{taskPriorities[value] ?? "Unknown"}</Badge>;
}

export function TagPill({ name, color }: { name: string; color?: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-theme-border bg-surface px-2.5 py-1 text-xs font-medium text-theme-text shadow-sm">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color ?? "#94a3b8" }} />
      {name}
    </span>
  );
}
