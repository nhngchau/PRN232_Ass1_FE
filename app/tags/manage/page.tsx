"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { Tag } from "@/lib/types";
import { TagIcon } from "@/components/ui/Icons";

const emptyForm = { tagName: "", color: "#FF6B9D" };

export default function ManageTagsPage() {
  const [items, setItems] = useState<Tag[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Tag | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [deleting, setDeleting] = useState<Tag | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<Tag[]>("/api/tags")
      .then(setItems)
      .catch((err: ApiClientError) => toast("error", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const begin = (tag?: Tag) => {
    setEditing(tag ?? null);
    setForm(tag ? { tagName: tag.tagName, color: tag.color ?? "#FF6B9D" } : emptyForm);
    setFormErrors({});
    setOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.tagName.trim()) errors.tagName = "Tag name is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (editing) await api.put(`/api/tags/${editing.tagId}`, form);
      else await api.post("/api/tags", form);
      toast("success", "Tag saved successfully.");
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
      await api.delete(`/api/tags/${deleting.tagId}`);
      toast("success", "Tag deleted successfully.");
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
            <TagIcon className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-theme-text">Manage Tags</h1>
        </div>
        <Button onClick={() => begin()}>Create Tag</Button>
      </div>

      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState label="No tags found." /> : (
        <div className="overflow-x-auto rounded-2xl border border-theme-border bg-surface shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme-border bg-slate-50/80 text-xs uppercase tracking-wider text-theme-muted">
              <tr>
                <th className="p-4 font-semibold">Tag name</th>
                <th className="p-4 font-semibold">Color</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((tag) => (
                <tr key={tag.tagId} className="border-b border-theme-border last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-theme-text">{tag.tagName}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-theme-border bg-surface px-2.5 py-1 text-xs font-medium shadow-sm">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.color ?? "#94a3b8" }} />
                      {tag.color ?? "None"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => begin(tag)}>Edit</Button>
                      <DangerButton onClick={() => setDeleting(tag)}>Delete</DangerButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal title={editing ? "Edit Tag" : "Create Tag"} open={open} onClose={() => setOpen(false)}>
        <form className="space-y-5" onSubmit={submit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Tag Name</label>
            <input 
              className={`w-full ${formErrors.tagName ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`} 
              value={form.tagName} 
              onChange={(e) => {
                setForm({ ...form, tagName: e.target.value });
                if (formErrors.tagName) setFormErrors({ ...formErrors, tagName: "" });
              }} 
              placeholder="Enter tag name" 
              maxLength={50} 
            />
            {formErrors.tagName && <p className="mt-1 text-sm text-red-600">{formErrors.tagName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-theme-text">Color</label>
            <div className="flex items-center gap-3">
              <input className="h-10 w-20 cursor-pointer rounded-xl border border-theme-border bg-surface p-1" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              <span className="text-sm text-theme-muted">{form.color}</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button disabled={saving}>{saving ? "Saving..." : "Save Tag"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Tag?"
        description={
          <>
            Are you sure you want to delete <strong>&quot;{deleting?.tagName}&quot;</strong>?<br />
            This action cannot be undone.
          </>
        }
      />
    </div>
  );
}
