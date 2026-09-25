"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskRow } from "@/components/tasks/TaskRow";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { api, ApiClientError } from "@/lib/api";
import { taskPriorityOptions, taskStatusOptions } from "@/lib/constants";
import { Project, Tag, Task } from "@/lib/types";

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search Tasks</h1>
      <section className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-5">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Any status</option>
          {taskStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="">Any priority</option>
          {taskPriorityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select value={projectId} onChange={(event) => setProjectId(event.target.value)}>
          <option value="">Any project</option>
          {projects.map((project) => (
            <option key={project.projectId} value={project.projectId}>
              {project.projectName}
            </option>
          ))}
        </select>
        <select value={tagId} onChange={(event) => setTagId(event.target.value)}>
          <option value="">Any tag</option>
          {tags.map((tag) => (
            <option key={tag.tagId} value={tag.tagId}>
              {tag.tagName}
            </option>
          ))}
        </select>
      </section>
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : tasks.length === 0 ? <EmptyState label="No tasks matched your filters." /> : <div className="space-y-3">{tasks.map((task) => <TaskRow key={task.taskId} task={task} />)}</div>}
    </div>
  );
}
