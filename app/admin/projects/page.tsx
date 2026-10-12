"use client";

import { FormEvent, useEffect, useState } from "react";
import { ProjectStatusBadge } from "@/components/ui/Badge";
import { Button, SecondaryButton, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { projectStatusOptions } from "@/lib/constants";
import { Department, Project } from "@/lib/types";
import { toDateInput } from "@/lib/utils";
import { ProjectIcon, PlusIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";
import { PageHeader } from "@/components/ui/PageHeader";

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
      <PageHeader
        title="Projects"
        description="Organize projects, assign departments, and track milestones."
        icon={ProjectIcon}
      >
        <Button onClick={() => begin()}>
          <PlusIcon className="h-4 w-4" />
          <span>Create Project</span>
        </Button>
      </PageHeader>

      {loading ? (
        <LoadingState label="Loading projects..." />
      ) : items.length === 0 ? (
        <EmptyState label="No projects found. Create your first project to get started." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-theme-border bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme-border bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-theme-muted">
              <tr>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/60">
              {items.map((project) => (
                <tr key={project.projectId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-theme-text">{project.projectName}</td>
                  <td className="px-4 py-3 text-theme-muted">{project.departmentName}</td>
                  <td className="px-4 py-3">
                    <ProjectStatusBadge value={project.status} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <SecondaryButton className="!py-1.5 !px-3 !text-xs" onClick={() => begin(project)}>
                        Edit
                      </SecondaryButton>
                      <DangerButton className="!py-1.5 !px-3 !text-xs" onClick={() => setDeleting(project)}>
                        Delete
                      </DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title={editing ? "Edit Project" : "Create Project"} open={open} onClose={() => setOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Project Name</label>
            <input 
              className={`w-full ${formErrors.projectName ? "!border-rose-400 focus:!ring-rose-500/20" : ""}`} 
              value={form.projectName} 
              onChange={(e) => {
                setForm({ ...form, projectName: e.target.value });
                if (formErrors.projectName) setFormErrors({ ...formErrors, projectName: "" });
              }} 
              placeholder="e.g. Website Redesign" 
              maxLength={200} 
            />
            {formErrors.projectName && <p className="mt-1 text-xs text-rose-500">{formErrors.projectName}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Department</label>
            <Select 
              className={`w-full ${formErrors.departmentId ? "!border-rose-400" : ""}`} 
              value={form.departmentId} 
              onChange={(val) => {
                setForm({ ...form, departmentId: Number(val) });
                if (formErrors.departmentId) setFormErrors({ ...formErrors, departmentId: "" });
              }} 
              options={[{ value: 0, label: "Select department" }, ...departments.map((d) => ({ value: d.departmentId, label: d.departmentName }))]} 
              placeholder="Select department" 
            />
            {formErrors.departmentId && <p className="mt-1 text-xs text-rose-500">{formErrors.departmentId}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Status</label>
            <Select 
              className="w-full" 
              value={form.status} 
              onChange={(val) => setForm({ ...form, status: Number(val) })} 
              options={projectStatusOptions} 
              placeholder="Select status" 
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Start Date</label>
            <input 
              className={`w-full ${formErrors.startDate ? "!border-rose-400 focus:!ring-rose-500/20" : ""}`} 
              type="date" 
              value={form.startDate} 
              onChange={(e) => {
                setForm({ ...form, startDate: e.target.value });
                if (formErrors.startDate) setFormErrors({ ...formErrors, startDate: "" });
                if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: "" });
              }} 
            />
            {formErrors.startDate && <p className="mt-1 text-xs text-rose-500">{formErrors.startDate}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">End Date (Optional)</label>
            <input 
              className={`w-full ${formErrors.endDate ? "!border-rose-400 focus:!ring-rose-500/20" : ""}`} 
              type="date" 
              value={form.endDate} 
              onChange={(e) => {
                setForm({ ...form, endDate: e.target.value });
                if (formErrors.endDate) setFormErrors({ ...formErrors, endDate: "" });
              }} 
            />
            {formErrors.endDate && <p className="mt-1 text-xs text-rose-500">{formErrors.endDate}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Description</label>
            <textarea 
              className="w-full min-h-[90px]" 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              placeholder="Provide a project overview" 
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-theme-border/60">
            <SecondaryButton type="button" onClick={() => setOpen(false)}>
              Cancel
            </SecondaryButton>
            <Button disabled={saving}>
              {saving ? "Saving..." : "Save Project"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Project"
        description={
          <>
            Are you sure you want to delete <strong>&quot;{deleting?.projectName}&quot;</strong>? This action cannot be undone.
          </>
        }
      />
    </div>
  );
}
