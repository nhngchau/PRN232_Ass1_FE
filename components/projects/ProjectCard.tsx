import Link from "next/link";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ProjectIcon } from "@/components/ui/Icons";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      href={`/projects/${project.projectId}`} 
      className="group flex flex-col justify-between rounded-xl border border-theme-border bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-xs"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            <ProjectIcon className="h-5 w-5 shrink-0" />
          </div>
          <ProjectStatusBadge value={project.status} />
        </div>
        <h3 className="mt-3.5 text-base font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors truncate">
          {project.projectName}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
          {project.description ?? "No description provided."}
        </p>
      </div>
      
      <div className="mt-5 flex items-center justify-between border-t border-theme-border/70 pt-3 text-xs">
        <span className="font-medium text-slate-500 truncate max-w-[150px]">{project.departmentName}</span>
        <span className="text-slate-400">{formatDate(project.startDate)}</span>
      </div>
    </Link>
  );
}
