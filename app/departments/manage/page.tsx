"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { Department } from "@/lib/types";

const emptyForm = { departmentName: "", departmentDescription: "" };

export default function ManageDepartmentsPage() {
  const [items, setItems] = useState<Department[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Department | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const load = () => {
    setLoading(true);
    api.get<Department[]>("/api/departments").then(setItems).catch((err: ApiClientError) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const beginCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const beginEdit = (department: Department) => {
    setEditing(department);
    setForm({ departmentName: department.departmentName, departmentDescription: department.departmentDescription });
    setOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.departmentName.trim() || !form.departmentDescription.trim()) {
      setToast({ type: "error", text: "Name and description are required." });
      return;
    }

    setSaving(true);
    try {
      if (editing) await api.put(`/api/departments/${editing.departmentId}`, form);
      else await api.post("/api/departments", form);
      setToast({ type: "success", text: "Department saved." });
      setOpen(false);
      load();
    } catch (err) {
      setToast({ type: "error", text: err instanceof ApiClientError ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (department: Department) => {
    if (!window.confirm(`Delete ${department.departmentName}?`)) return;
    try {
      await api.delete(`/api/departments/${department.departmentId}`);
      setToast({ type: "success", text: "Department deleted." });
      load();
    } catch (err) {
      setToast({ type: "error", text: err instanceof ApiClientError ? err.message : "Delete failed." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Manage Departments</h1>
        <Button onClick={beginCreate}>Create</Button>
      </div>
      <Toast toast={toast} />
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState label="No departments found." /> : (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr><th className="p-3">Name</th><th className="p-3">Description</th><th className="p-3">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.departmentId} className="border-t">
                  <td className="p-3 font-medium">{item.departmentName}</td>
                  <td className="p-3 text-slate-600">{item.departmentDescription}</td>
                  <td className="flex gap-2 p-3"><Button onClick={() => beginEdit(item)}>Edit</Button><DangerButton onClick={() => remove(item)}>Delete</DangerButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal title={editing ? "Edit Department" : "Create Department"} open={open} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <input className="w-full" value={form.departmentName} onChange={(e) => setForm({ ...form, departmentName: e.target.value })} placeholder="Department name" maxLength={100} />
          <textarea className="w-full" value={form.departmentDescription} onChange={(e) => setForm({ ...form, departmentDescription: e.target.value })} placeholder="Description" maxLength={300} />
          <Button disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}
