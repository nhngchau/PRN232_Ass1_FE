"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { Toast, ToastMessage } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { Tag } from "@/lib/types";

const emptyForm = { tagName: "", color: "#3B82F6" };

export default function ManageTagsPage() {
  const [items, setItems] = useState<Tag[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const load = () => {
    setLoading(true);
    api.get<Tag[]>("/api/tags").then(setItems).catch((err: ApiClientError) => setError(err.message)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const begin = (tag?: Tag) => {
    setEditing(tag ?? null);
    setForm(tag ? { tagName: tag.tagName, color: tag.color ?? "#3B82F6" } : emptyForm);
    setOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.tagName.trim()) {
      setToast({ type: "error", text: "Tag name is required." });
      return;
    }
    setSaving(true);
    try {
      if (editing) await api.put(`/api/tags/${editing.tagId}`, form);
      else await api.post("/api/tags", form);
      setToast({ type: "success", text: "Tag saved." });
      setOpen(false);
      load();
    } catch (err) {
      setToast({ type: "error", text: err instanceof ApiClientError ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (tag: Tag) => {
    if (!window.confirm(`Delete ${tag.tagName}?`)) return;
    try {
      await api.delete(`/api/tags/${tag.tagId}`);
      setToast({ type: "success", text: "Tag deleted." });
      load();
    } catch (err) {
      setToast({ type: "error", text: err instanceof ApiClientError ? err.message : "Delete failed." });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><h1 className="text-2xl font-bold">Manage Tags</h1><Button onClick={() => begin()}>Create</Button></div>
      <Toast toast={toast} />
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState label="No tags found." /> : (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100"><tr><th className="p-3">Tag name</th><th className="p-3">Color</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {items.map((tag) => (
                <tr key={tag.tagId} className="border-t">
                  <td className="p-3 font-medium">{tag.tagName}</td>
                  <td className="p-3"><span className="inline-flex items-center gap-2"><span className="h-4 w-4 rounded-full border" style={{ backgroundColor: tag.color ?? "#94a3b8" }} />{tag.color ?? "None"}</span></td>
                  <td className="flex gap-2 p-3"><Button onClick={() => begin(tag)}>Edit</Button><DangerButton onClick={() => remove(tag)}>Delete</DangerButton></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal title={editing ? "Edit Tag" : "Create Tag"} open={open} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <input className="w-full" value={form.tagName} onChange={(e) => setForm({ ...form, tagName: e.target.value })} placeholder="Tag name" maxLength={50} />
          <input className="w-full" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          <Button disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
        </form>
      </Modal>
    </div>
  );
}
