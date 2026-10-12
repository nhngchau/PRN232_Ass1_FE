"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, SecondaryButton, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, LoadingState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { Tag } from "@/lib/types";
import { TagIcon, PlusIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";

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
      <PageHeader
        title="Tags"
        description="Organize task labels and custom category indicators."
        icon={TagIcon}
      >
        <Button onClick={() => begin()}>
          <PlusIcon className="h-4 w-4" />
          <span>Create Tag</span>
        </Button>
      </PageHeader>

      {loading ? (
        <LoadingState label="Loading tags..." />
      ) : items.length === 0 ? (
        <EmptyState label="No tags found. Create your first tag to get started." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-theme-border bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-theme-border bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-theme-muted">
              <tr>
                <th className="px-4 py-3">Tag Name</th>
                <th className="px-4 py-3">Color Preview</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/60">
              {items.map((tag) => (
                <tr key={tag.tagId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-theme-text">{tag.tagName}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-theme-border bg-white px-2.5 py-1 text-xs font-medium shadow-xs">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tag.color ?? "#94a3b8" }} />
                      <span className="font-mono text-slate-600">{tag.color ?? "None"}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <SecondaryButton className="!py-1.5 !px-3 !text-xs" onClick={() => begin(tag)}>
                        Edit
                      </SecondaryButton>
                      <DangerButton className="!py-1.5 !px-3 !text-xs" onClick={() => setDeleting(tag)}>
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
      
      <Modal title={editing ? "Edit Tag" : "Create Tag"} open={open} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Tag Name</label>
            <input 
              className={`w-full ${formErrors.tagName ? "!border-rose-400 focus:!ring-rose-500/20" : ""}`} 
              value={form.tagName} 
              onChange={(e) => {
                setForm({ ...form, tagName: e.target.value });
                if (formErrors.tagName) setFormErrors({ ...formErrors, tagName: "" });
              }} 
              placeholder="e.g. Bug, Feature, Urgent" 
              maxLength={50} 
            />
            {formErrors.tagName && <p className="mt-1 text-xs text-rose-500">{formErrors.tagName}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Color</label>
            <div className="flex items-center gap-3">
              <input
                className="h-10 w-16 cursor-pointer rounded-xl border border-theme-border bg-white p-1"
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
              <span className="font-mono text-xs text-theme-muted bg-slate-50 px-2.5 py-1.5 rounded-lg border border-theme-border/60">
                {form.color}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-theme-border/60">
            <SecondaryButton type="button" onClick={() => setOpen(false)}>
              Cancel
            </SecondaryButton>
            <Button disabled={saving}>
              {saving ? "Saving..." : "Save Tag"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Tag"
        description={
          <>
            Are you sure you want to delete <strong>&quot;{deleting?.tagName}&quot;</strong>? This action cannot be undone.
          </>
        }
      />
    </div>
  );
}
