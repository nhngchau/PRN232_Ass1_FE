"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { projectStatusOptions } from "@/lib/constants";
import { Department, Project } from "@/lib/types";
import { toDateInput } from "@/lib/utils";

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

  const remove = async (project: Project) => {
    if (!window.confirm(`Delete ${project.projectName}?`)) return;
    try {
      await api.delete(`/api/projects/${project.projectId}`);
      setToast({ type: "success", text: "Project deleted." });
      load();
    } catch (err) {
      setToast({ type: "error", text: err instanceof ApiClientError ? err.message : "Delete failed." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-bold">Manage Projects</h1><Button onClick={() => begin()}>Create</Button></div>
      <Toast toast={toast} />
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState label="No projects found." /> : (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100"><tr><th className="p-3">Name</th><th className="p-3">Department</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
            <tbody>{items.map((project) => (
              <tr key={project.projectId} className="border-t">
                <td className="p-3 font-medium">{project.projectName}</td><td className="p-3">{project.departmentName}</td><td className="p-3"><ProjectStatusBadge value={project.status} /></td>
                <td className="flex gap-2 p-3"><Button onClick={() => begin(project)}>Edit</Button><DangerButton onClick={() => remove(project)}>Delete</DangerButton></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
      <Modal title={editing ? "Edit Project" : "Create Project"} open={open} onClose={() => setOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <input value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} placeholder="Project name" maxLength={200} />
          <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: Number(e.target.value) })}><option value={0}>Select department</option>{departments.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}</select>
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>{projectStatusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
          <textarea className="md:col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <Button className="md:col-span-2" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}
