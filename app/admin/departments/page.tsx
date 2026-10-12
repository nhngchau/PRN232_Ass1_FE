"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, SecondaryButton, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { Department } from "@/lib/types";
import { DepartmentIcon, PlusIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";

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
      <PageHeader
        title="Departments"
        description="View and manage organization departments."
        icon={DepartmentIcon}
      >
        <Button onClick={beginCreate}>
          <PlusIcon className="h-4 w-4" />
          <span>Create Department</span>
        </Button>
      </PageHeader>

      {loading ? (
        <LoadingState label="Loading departments..." />
      ) : items.length === 0 ? (
        <EmptyState label="No departments found. Create your first department to get started." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-theme-border bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme-border bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-theme-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/60">
              {items.map((item) => (
                <tr key={item.departmentId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-theme-text">{item.departmentName}</td>
                  <td className="px-4 py-3 text-theme-muted max-w-md truncate">{item.departmentDescription}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <SecondaryButton className="!py-1.5 !px-3 !text-xs" onClick={() => beginEdit(item)}>
                        Edit
                      </SecondaryButton>
                      <DangerButton className="!py-1.5 !px-3 !text-xs" onClick={() => setDeleting(item)}>
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

      <Modal title={editing ? "Edit Department" : "Create Department"} open={open} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Department Name</label>
            <input
              className={`w-full ${formErrors.departmentName ? "!border-rose-400 focus:!ring-rose-500/20" : ""}`}
              value={form.departmentName}
              onChange={(e) => {
                setForm({ ...form, departmentName: e.target.value });
                if (formErrors.departmentName) setFormErrors({ ...formErrors, departmentName: "" });
              }}
              placeholder="e.g. Engineering"
              maxLength={100}
            />
            {formErrors.departmentName && <p className="mt-1 text-xs text-rose-500">{formErrors.departmentName}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Description</label>
            <textarea
              className={`w-full min-h-[90px] ${formErrors.departmentDescription ? "!border-rose-400 focus:!ring-rose-500/20" : ""}`}
              value={form.departmentDescription}
              onChange={(e) => {
                setForm({ ...form, departmentDescription: e.target.value });
                if (formErrors.departmentDescription) setFormErrors({ ...formErrors, departmentDescription: "" });
              }}
              placeholder="Describe department responsibilities"
              maxLength={300}
            />
            {formErrors.departmentDescription && <p className="mt-1 text-xs text-rose-500">{formErrors.departmentDescription}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-theme-border/60">
            <SecondaryButton type="button" onClick={() => setOpen(false)}>
              Cancel
            </SecondaryButton>
            <Button disabled={saving}>
              {saving ? "Saving..." : "Save Department"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Department"
        description={
          <>
            Are you sure you want to delete <strong>&quot;{deleting?.departmentName}&quot;</strong>? This action cannot be undone.
          </>
        }
      />
    </div>
  );
}
