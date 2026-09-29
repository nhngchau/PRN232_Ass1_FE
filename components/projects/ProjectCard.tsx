import Link from "next/link";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ProjectIcon } from "@/components/ui/Icons";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      href={`/projects/${project.projectId}`} 
      className="group flex flex-col justify-between rounded-2xl border border-theme-border bg-surface p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <ProjectIcon className="h-5 w-5" />
          </div>
          <ProjectStatusBadge value={project.status} />
        </div>
        <h3 className="mt-4 text-lg font-bold tracking-tight text-theme-text group-hover:text-primary transition-colors">{project.projectName}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-theme-muted">{project.description ?? "No description provided."}</p>
      </div>
      
      <div className="mt-6 flex items-center justify-between border-t border-theme-border pt-4">
        <p className="text-xs font-medium text-theme-muted">{project.departmentName}</p>
        <p className="text-xs text-theme-muted/70">{formatDate(project.startDate)}</p>
      </div>
    </Link>
  );
}
