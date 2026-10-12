import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { Department, Project, Task } from "@/lib/types";
import { HomeHeroActions } from "@/components/home/HomeHeroActions";
import { DepartmentIcon, ProjectIcon, TaskIcon } from "@/components/ui/Icons";

export default async function HomePage() {
  const [departments, projects, tasks] = await Promise.all([
    api.get<Department[]>("/api/departments").catch(() => []),
    api.get<Project[]>("/api/projects").catch(() => []),
    api.get<Task[]>("/api/tasks").catch(() => [])
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Hero Header */}
      <section className="rounded-xl border border-theme-border bg-white p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
            Task & Team Management
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-theme-text sm:text-3xl lg:text-4xl">
            Welcome to TaskTrack
          </h1>
          <p className="mt-2 text-sm sm:text-base text-theme-muted leading-relaxed">
            Manage and explore departments, projects, tasks, and tags seamlessly in a unified modern environment.
          </p>
          <HomeHeroActions />
        </div>
      </section>

      {/* Overview Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Departments"
          value={departments.length}
          icon={DepartmentIcon}
          accent="bg-blue-50 text-blue-600 border-blue-100"
        />
        <StatCard
          label="Active Projects"
          value={projects.length}
          icon={ProjectIcon}
          accent="bg-indigo-50 text-indigo-600 border-indigo-100"
        />
        <StatCard
          label="Total Tasks"
          value={tasks.length}
          icon={TaskIcon}
          accent="bg-pink-50 text-pink-600 border-pink-100"
        />
      </section>

      {/* Recent Projects */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-theme-text sm:text-xl">
            Recent Projects
          </h2>
        </div>
        {projects.length === 0 ? (
          <EmptyState label="No active projects yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-theme-border bg-white p-5 shadow-xs transition hover:border-slate-300">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-theme-muted">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-theme-text">{value}</p>
    </div>
  );
}
