"use client";

import { FormEvent, useEffect, useState } from "react";
import { PriorityBadge, TagPill, TaskStatusBadge } from "@/components/ui/Badge";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { taskPriorityOptions, taskStatusOptions } from "@/lib/constants";
import { Project, Tag, Task } from "@/lib/types";
import { toDateInput } from "@/lib/utils";

const emptyForm = { title: "", description: "", status: 0, priority: 1, dueDate: "", projectId: 0, tagIds: [] as number[] };

export default function ManageTasksPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([api.get<Task[]>("/api/tasks"), api.get<Project[]>("/api/projects"), api.get<Tag[]>("/api/tags")])
      .then(([taskData, projectData, tagData]) => {
        setItems(taskData);
        setProjects(projectData);
        setTags(tagData);
      })
      .catch((err: ApiClientError) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const begin = (task?: Task) => {
    setEditing(task ?? null);
    setForm(task ? {
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      dueDate: toDateInput(task.dueDate),
      projectId: task.projectId,
      tagIds: task.tags.map((tag) => tag.tagId)
    } : { ...emptyForm, projectId: projects[0]?.projectId ?? 0 });
    setOpen(true);
  };

  const toggleTag = (tagId: number) => {
    setForm((current) => ({
      ...current,
      tagIds: current.tagIds.includes(tagId) ? current.tagIds.filter((id) => id !== tagId) : [...current.tagIds, tagId]
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.projectId) {
      setToast({ type: "error", text: "Title and project are required." });
      return;
    }
    setSaving(true);
    const payload = { ...form, dueDate: form.dueDate || null };
    try {
      if (editing) await api.put(`/api/tasks/${editing.taskId}`, payload);
      else await api.post("/api/tasks", payload);
      setToast({ type: "success", text: "Task saved." });
      setOpen(false);
      load();
    } catch (err) {
      setToast({ type: "error", text: err instanceof ApiClientError ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (task: Task) => {
    if (!window.confirm(`Soft delete ${task.title}?`)) return;
    try {
      await api.delete(`/api/tasks/${task.taskId}`);
      setToast({ type: "success", text: "Task soft deleted." });
      load();
    } catch (err) {
      setToast({ type: "error", text: err instanceof ApiClientError ? err.message : "Delete failed." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-bold">Manage Tasks</h1><Button onClick={() => begin()}>Create</Button></div>
      <Toast toast={toast} />
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState label="No active tasks found." /> : (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100"><tr><th className="p-3">Title</th><th className="p-3">Project</th><th className="p-3">Status</th><th className="p-3">Priority</th><th className="p-3">Tags</th><th className="p-3">Actions</th></tr></thead>
            <tbody>{items.map((task) => (
              <tr key={task.taskId} className="border-t">
                <td className="p-3 font-medium">{task.title}</td><td className="p-3">{task.projectName}</td><td className="p-3"><TaskStatusBadge value={task.status} /></td><td className="p-3"><PriorityBadge value={task.priority} /></td>
                <td className="p-3"><div className="flex flex-wrap gap-1">{task.tags.map((tag) => <TagPill key={tag.tagId} name={tag.tagName} color={tag.color} />)}</div></td>
                <td className="flex gap-2 p-3"><Button onClick={() => begin(task)}>Edit</Button><DangerButton onClick={() => remove(task)}>Delete</DangerButton></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <Modal title={editing ? "Edit Task" : "Create Task"} open={open} onClose={() => setOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" maxLength={300} />
          <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: Number(e.target.value) })}><option value={0}>Select project</option>{projects.map((project) => <option key={project.projectId} value={project.projectId}>{project.projectName}</option>)}</select>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>{taskStatusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}>{taskPriorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <textarea className="md:col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium">Tags</p>
            <div className="flex flex-wrap gap-2">{tags.map((tag) => <label key={tag.tagId} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm"><input type="checkbox" checked={form.tagIds.includes(tag.tagId)} onChange={() => toggleTag(tag.tagId)} />{tag.tagName}</label>)}</div>
          </div>
          <Button className="md:col-span-2" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}
