"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskRow } from "@/components/tasks/TaskRow";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { api, ApiClientError } from "@/lib/api";
import { taskPriorityOptions, taskStatusOptions } from "@/lib/constants";
import { Project, Tag, Task } from "@/lib/types";
import { SearchIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SearchPage() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projectId, setProjectId] = useState("");
  const [tagId, setTagId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get<Project[]>("/api/projects"), api.get<Tag[]>("/api/tags")])
      .then(([projectData, tagData]) => {
        setProjects(projectData);
        setTags(tagData);
      })
      .catch((err: ApiClientError) => setError(err.message));
  }, []);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (title.trim()) params.set("title", title.trim());
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    if (projectId) params.set("projectId", projectId);
    if (tagId) params.set("tagId", tagId);
    return params.toString();
  }, [title, status, priority, projectId, tagId]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setLoading(true);
      setError("");
      api
        .get<Task[]>(`/api/tasks/search${query ? `?${query}` : ""}`)
        .then(setTasks)
        .catch((err: ApiClientError) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => window.clearTimeout(handle);
  }, [query]);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Search Tasks"
        description="Search and filter tasks across projects, priorities, statuses, and tags."
        icon={SearchIcon}
      />
      
      <section className="rounded-xl border border-theme-border bg-white p-4 sm:p-5 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className="w-full"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Search by title..."
          />
          <Select
            className="w-full"
            value={status}
            onChange={(val) => setStatus(val as string)}
            options={[{ value: "", label: "All Statuses" }, ...taskStatusOptions]}
            placeholder="All Statuses"
          />
          <Select
            className="w-full"
            value={priority}
            onChange={(val) => setPriority(val as string)}
            options={[{ value: "", label: "All Priorities" }, ...taskPriorityOptions]}
            placeholder="All Priorities"
          />
          <Select
            className="w-full"
            value={projectId}
            onChange={(val) => setProjectId(val as string)}
            options={[{ value: "", label: "All Projects" }, ...projects.map(p => ({ value: p.projectId.toString(), label: p.projectName }))]}
            placeholder="All Projects"
          />
          <Select
            className="w-full"
            value={tagId}
            onChange={(val) => setTagId(val as string)}
            options={[{ value: "", label: "All Tags" }, ...tags.map(t => ({ value: t.tagId.toString(), label: t.tagName }))]}
            placeholder="All Tags"
          />
        </div>
      </section>

      {error && <ErrorState message={error} />}

      {loading ? (
        <LoadingState label="Searching tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState label="No tasks matched your filter criteria." />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskRow key={task.taskId} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
