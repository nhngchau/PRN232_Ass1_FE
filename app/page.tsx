import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { api } from "@/lib/api";
import { Department, Project, Task } from "@/lib/types";

export default async function HomePage() {
  const [departments, projects, tasks] = await Promise.all([
    api.get<Department[]>("/api/departments"),
    api.get<Project[]>("/api/projects"),
    api.get<Task[]>("/api/tasks")
  ]);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-surface p-8 shadow-sm md:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-soft opacity-50 blur-3xl"></div>
        <div className="relative z-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Overview</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-theme-text md:text-4xl">Welcome to TaskTrack</h1>
          <p className="mt-4 max-w-2xl text-lg text-theme-muted">Manage departments, projects, tasks, and tags seamlessly in a modern environment.</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Stat label="Departments" value={departments.length} trend="+12%" />
        <Stat label="Active Projects" value={projects.length} trend="Active" />
        <Stat label="Tasks Remaining" value={tasks.length} trend="Requires focus" />
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-theme-text">Recent Projects</h2>
        </div>
        {projects.length === 0 ? (
          <EmptyState label="No active projects yet." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, trend }: { label: string; value: number; trend: string }) {
  return (
    <div className="group rounded-2xl border border-theme-border bg-surface p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <p className="text-sm font-medium text-theme-muted">{label}</p>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-4xl font-extrabold tracking-tight text-theme-text">{value}</p>
        <span className="text-xs font-semibold text-primary">{trend}</span>
      </div>
    </div>
  );
}
