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
    <div className="space-y-8">
      <section className="rounded-md bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">PRN232 Assignment 1</p>
        <h1 className="mt-2 text-3xl font-bold">Welcome to TaskTrack</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Manage departments, projects, tasks, and tags through a public CRUD workflow.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Stat label="Active departments" value={departments.length} />
        <Stat label="Active projects" value={projects.length} />
        <Stat label="Active tasks" value={tasks.length} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Active Projects</h2>
        {projects.length === 0 ? (
          <EmptyState label="No active projects yet." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
