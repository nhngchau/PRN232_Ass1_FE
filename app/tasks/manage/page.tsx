"use client";

import { FormEvent, useEffect, useState } from "react";
import { PriorityBadge, TagPill, TaskStatusBadge } from "@/components/ui/Badge";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { taskPriorityOptions, taskStatusOptions } from "@/lib/constants";
import { Project, Tag, Task } from "@/lib/types";
import { toDateInput } from "@/lib/utils";
import { TaskIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";

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

  const [deleting, setDeleting] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const confirmDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/tasks/${deleting.taskId}`);
      setToast({ type: "success", text: "Task soft deleted." });
      load();
    } catch (err) {
      setToast({ type: "error", text: err instanceof ApiClientError ? err.message : "Delete failed." });
    } finally {
      setIsDeleting(false);
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <TaskIcon className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-theme-text">Manage Tasks</h1>
        </div>
        <Button onClick={() => begin()}>Create Task</Button>
      </div>
      <Toast toast={toast} />
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState label="No active tasks found." /> : (
        <div className="overflow-x-auto rounded-2xl border border-theme-border bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme-border bg-slate-50/80 text-xs uppercase tracking-wider text-theme-muted">
              <tr>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Project</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Tags</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>{items.map((task) => (
              <tr key={task.taskId} className="border-b border-theme-border last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-theme-text">{task.title}</td>
                <td className="p-4 text-theme-muted">{task.projectName}</td>
                <td className="p-4"><TaskStatusBadge value={task.status} /></td>
                <td className="p-4"><PriorityBadge value={task.priority} /></td>
                <td className="p-4"><div className="flex flex-wrap gap-1.5">{task.tags.map((tag) => <TagPill key={tag.tagId} name={tag.tagName} color={tag.color} />)}</div></td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => begin(task)}>Edit</Button>
                    <DangerButton onClick={() => setDeleting(task)}>Delete</DangerButton>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <Modal title={editing ? "Edit Task" : "Create Task"} open={open} onClose={() => setOpen(false)}>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={submit}>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-theme-text">Title</label>
            <input className="w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter title" maxLength={300} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Project</label>
            <Select className="w-full" value={form.projectId} onChange={(val) => setForm({ ...form, projectId: Number(val) })} options={[{ value: 0, label: "Select project" }, ...projects.map((project) => ({ value: project.projectId, label: project.projectName }))]} placeholder="Select project" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Status</label>
            <Select className="w-full" value={form.status} onChange={(val) => setForm({ ...form, status: Number(val) })} options={taskStatusOptions} placeholder="Select status" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Priority</label>
            <Select className="w-full" value={form.priority} onChange={(val) => setForm({ ...form, priority: Number(val) })} options={taskPriorityOptions} placeholder="Select priority" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Due Date (Optional)</label>
            <input className="w-full" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-theme-text">Description</label>
            <textarea className="w-full min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" />
          </div>
          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium text-theme-text">Tags</p>
            <div className="flex flex-wrap gap-2">{tags.map((tag) => <label key={tag.tagId} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-theme-border bg-surface px-3 py-2 text-sm transition-colors hover:border-primary/40"><input type="checkbox" checked={form.tagIds.includes(tag.tagId)} onChange={() => toggleTag(tag.tagId)} className="rounded text-primary focus:ring-primary" />{tag.tagName}</label>)}</div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button disabled={saving}>{saving ? "Saving..." : "Save Task"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Task?"
        description={
          <>
            Are you sure you want to delete <strong>&quot;{deleting?.title}&quot;</strong>?<br />
            This task will be removed from active lists.
          </>
        }
      />
    </div>
  );
}
