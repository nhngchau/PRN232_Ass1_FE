"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { Department } from "@/lib/types";
import { DepartmentIcon } from "@/components/ui/Icons";

const emptyForm = { departmentName: "", departmentDescription: "" };

export default function ManageDepartmentsPage() {
  const [items, setItems] = useState<Department[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Department | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [deleting, setDeleting] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<Department[]>("/api/departments")
      .then(setItems)
      .catch((err: ApiClientError) => toast("error", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const beginCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setOpen(true);
  };

  const beginEdit = (department: Department) => {
    setEditing(department);
    setForm({ departmentName: department.departmentName, departmentDescription: department.departmentDescription });
    setFormErrors({});
    setOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.departmentName.trim()) errors.departmentName = "Department name is required.";
    if (!form.departmentDescription.trim()) errors.departmentDescription = "Description is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (editing) await api.put(`/api/departments/${editing.departmentId}`, form);
      else await api.post("/api/departments", form);
      toast("success", "Department saved successfully.");
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
      await api.delete(`/api/departments/${deleting.departmentId}`);
      toast("success", "Department deleted successfully.");
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
            <DepartmentIcon className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-theme-text">Manage Departments</h1>
        </div>
        <Button onClick={beginCreate}>Create Department</Button>
      </div>

      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState label="No departments found." /> : (
        <div className="overflow-x-auto rounded-2xl border border-theme-border bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme-border bg-slate-50/80 text-xs uppercase tracking-wider text-theme-muted">
              <tr><th className="p-4 font-semibold">Name</th><th className="p-4 font-semibold">Description</th><th className="p-4 font-semibold text-right">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.departmentId} className="border-b border-theme-border last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-theme-text">{item.departmentName}</td>
                  <td className="p-4 text-theme-muted">{item.departmentDescription}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => beginEdit(item)}>Edit</Button>
                      <DangerButton onClick={() => setDeleting(item)}>Delete</DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal title={editing ? "Edit Department" : "Create Department"} open={open} onClose={() => setOpen(false)}>
        <form className="space-y-5" onSubmit={submit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Department Name</label>
            <input 
              className={`w-full ${formErrors.departmentName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} 
              value={form.departmentName} 
              onChange={(e) => {
                setForm({ ...form, departmentName: e.target.value });
                if (formErrors.departmentName) setFormErrors({ ...formErrors, departmentName: "" });
              }} 
              placeholder="Enter name" 
              maxLength={100} 
            />
            {formErrors.departmentName && <p className="mt-1 text-sm text-red-600">{formErrors.departmentName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Description</label>
            <textarea 
              className={`w-full min-h-[100px] ${formErrors.departmentDescription ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} 
              value={form.departmentDescription} 
              onChange={(e) => {
                setForm({ ...form, departmentDescription: e.target.value });
                if (formErrors.departmentDescription) setFormErrors({ ...formErrors, departmentDescription: "" });
              }} 
              placeholder="Enter description" 
              maxLength={300} 
            />
            {formErrors.departmentDescription && <p className="mt-1 text-sm text-red-600">{formErrors.departmentDescription}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button disabled={saving}>{saving ? "Saving..." : "Save Department"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Department?"
        description={
          <>
            Are you sure you want to delete <strong>&quot;{deleting?.departmentName}&quot;</strong>?<br />
            This action cannot be undone.
          </>
        }
      />
    </div>
  );
}
