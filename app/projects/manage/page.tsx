"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { projectStatusOptions } from "@/lib/constants";
import { Department, Project } from "@/lib/types";
import { toDateInput } from "@/lib/utils";
import { ProjectIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";

const emptyForm = { projectName: "", description: "", startDate: "", endDate: "", status: 0, departmentId: 0 };

export default function ManageProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [deleting, setDeleting] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get<Project[]>("/api/projects"), api.get<Department[]>("/api/departments")])
      .then(([projectData, departmentData]) => {
        setItems(projectData);
        setDepartments(departmentData);
      })
      .catch((err: ApiClientError) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const begin = (project?: Project) => {
    setEditing(project ?? null);
    setForm(project ? {
      projectName: project.projectName,
      description: project.description ?? "",
      startDate: toDateInput(project.startDate),
      endDate: toDateInput(project.endDate),
      status: project.status,
      departmentId: project.departmentId
    } : { ...emptyForm, departmentId: departments[0]?.departmentId ?? 0 });
    setOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.projectName.trim() || !form.startDate || !form.departmentId) {
      setToast({ type: "error", text: "Project name, start date, and department are required." });
      return;
    }
    setSaving(true);
    const payload = { ...form, endDate: form.endDate || null };
    try {
      if (editing) await api.put(`/api/projects/${editing.projectId}`, payload);
      else await api.post("/api/projects", payload);
      setToast({ type: "success", text: "Project saved." });
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
      await api.delete(`/api/projects/${deleting.projectId}`);
      setToast({ type: "success", text: "Project deleted." });
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
            <ProjectIcon className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-theme-text">Manage Projects</h1>
        </div>
        <Button onClick={() => begin()}>Create Project</Button>
      </div>
      <Toast toast={toast} />
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState label="No projects found." /> : (
        <div className="overflow-x-auto rounded-2xl border border-theme-border bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme-border bg-slate-50/80 text-xs uppercase tracking-wider text-theme-muted">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>{items.map((project) => (
              <tr key={project.projectId} className="border-b border-theme-border last:border-0 hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-bold text-theme-text">{project.projectName}</td>
                <td className="p-4 text-theme-muted">{project.departmentName}</td>
                <td className="p-4"><ProjectStatusBadge value={project.status} /></td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => begin(project)}>Edit</Button>
                    <DangerButton onClick={() => setDeleting(project)}>Delete</DangerButton>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <Modal title={editing ? "Edit Project" : "Create Project"} open={open} onClose={() => setOpen(false)}>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={submit}>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-theme-text">Project Name</label>
            <input className="w-full" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} placeholder="Enter name" maxLength={200} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Department</label>
            <Select className="w-full" value={form.departmentId} onChange={(val) => setForm({ ...form, departmentId: Number(val) })} options={[{ value: 0, label: "Select department" }, ...departments.map((d) => ({ value: d.departmentId, label: d.departmentName }))]} placeholder="Select department" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Status</label>
            <Select className="w-full" value={form.status} onChange={(val) => setForm({ ...form, status: Number(val) })} options={projectStatusOptions} placeholder="Select status" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Start Date</label>
            <input className="w-full" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">End Date (Optional)</label>
            <input className="w-full" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-theme-text">Description</label>
            <textarea className="w-full min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter description" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button disabled={saving}>{saving ? "Saving..." : "Save Project"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Project?"
        description={
          <>
            Are you sure you want to delete <strong>&quot;{deleting?.projectName}&quot;</strong>?<br />
            This action cannot be undone.
          </>
        }
      />
    </div>
  );
}
