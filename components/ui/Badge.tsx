import { projectStatuses, taskPriorities, taskStatuses } from "@/lib/constants";

const styles = [
  "bg-slate-100 text-slate-800 border-slate-200",
  "bg-cyan-50 text-cyan-800 border-cyan-200",
  "bg-emerald-50 text-emerald-800 border-emerald-200",
  "bg-amber-50 text-amber-800 border-amber-200"
];

export function Badge({ children, tone = 0 }: { children: React.ReactNode; tone?: number }) {
  return <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${styles[tone] ?? styles[0]}`}>{children}</span>;
}

export function ProjectStatusBadge({ value }: { value: number }) {
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
    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color ?? "#94a3b8" }} />
      {name}
    </span>
  );
}
