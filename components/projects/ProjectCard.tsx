import Link from "next/link";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.projectId}`} className="block rounded-md border border-slate-200 bg-white p-4 shadow-sm hover:border-ocean">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-ink">{project.projectName}</h3>
        <ProjectStatusBadge value={project.status} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.description ?? "No description"}</p>
      <p className="mt-3 text-xs text-slate-500">
        {project.departmentName} · {formatDate(project.startDate)}
      </p>
    </Link>
  );
}
