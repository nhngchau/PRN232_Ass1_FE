"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [deleting, setDeleting] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([api.get<Project[]>("/api/projects"), api.get<Department[]>("/api/departments")])
      .then(([projectData, departmentData]) => {
        setItems(projectData);
        setDepartments(departmentData);
      })
      .catch((err: ApiClientError) => toast("error", err.message))
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
    setFormErrors({});
    setOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    
    if (!form.projectName.trim()) errors.projectName = "Project name is required.";
    if (!form.startDate) errors.startDate = "Start date is required.";
    if (!form.departmentId) errors.departmentId = "Department is required.";
    
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      errors.endDate = "End date must be after start date.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    const payload = { ...form, endDate: form.endDate || null };
    try {
      if (editing) await api.put(`/api/projects/${editing.projectId}`, payload);
      else await api.post("/api/projects", payload);
      toast("success", "Project saved successfully.");
      setOpen(false);
      load();
    } catch (err) {
      toast("error", err instanceof ApiClientError ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/projects/${deleting.projectId}`);
      toast("success", "Project deleted successfully.");
      load();
    } catch (err) {
      toast("error", err instanceof ApiClientError ? err.message : "Delete failed.");
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
            <input 
              className={`w-full ${formErrors.projectName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} 
              value={form.projectName} 
              onChange={(e) => {
                setForm({ ...form, projectName: e.target.value });
                if (formErrors.projectName) setFormErrors({ ...formErrors, projectName: "" });
              }} 
              placeholder="Enter name" 
              maxLength={200} 
            />
            {formErrors.projectName && <p className="mt-1 text-sm text-red-600">{formErrors.projectName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Department</label>
            <Select 
              className={`w-full ${formErrors.departmentId ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} 
              value={form.departmentId} 
              onChange={(val) => {
                setForm({ ...form, departmentId: Number(val) });
                if (formErrors.departmentId) setFormErrors({ ...formErrors, departmentId: "" });
              }} 
              options={[{ value: 0, label: "Select department" }, ...departments.map((d) => ({ value: d.departmentId, label: d.departmentName }))]} 
              placeholder="Select department" 
            />
            {formErrors.departmentId && <p className="mt-1 text-sm text-red-600">{formErrors.departmentId}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Status</label>
            <Select 
              className="w-full" 
              value={form.status} 
              onChange={(val) => setForm({ ...form, status: Number(val) })} 
              options={projectStatusOptions} 
              placeholder="Select status" 
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Start Date</label>
            <input 
              className={`w-full ${formErrors.startDate ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} 
              type="date" 
              value={form.startDate} 
              onChange={(e) => {
                setForm({ ...form, startDate: e.target.value });
                if (formErrors.startDate) setFormErrors({ ...formErrors, startDate: "" });
                if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: "" });
              }} 
            />
            {formErrors.startDate && <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">End Date (Optional)</label>
            <input 
              className={`w-full ${formErrors.endDate ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} 
              type="date" 
              value={form.endDate} 
              onChange={(e) => {
                setForm({ ...form, endDate: e.target.value });
                if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: "" });
              }} 
            />
            {formErrors.endDate && <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-theme-text">Description</label>
            <textarea 
              className="w-full min-h-[100px]" 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              placeholder="Enter description" 
            />
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
