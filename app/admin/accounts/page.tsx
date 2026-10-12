"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button, SecondaryButton, DangerButton } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, LoadingState, AccessDenied } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { api, ApiClientError } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { Account } from "@/lib/auth/types";
import { Select } from "@/components/ui/Select";
import { UsersIcon } from "@/components/ui/Icons";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoleBadge } from "@/components/ui/RoleBadge";

export default function ManageAccountsPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  
  const [items, setItems] = useState<Account[]>([]);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState({ fullName: "", role: 0 });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [deleting, setDeleting] = useState<Account | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [accessDenied, setAccessDenied] = useState(!isAdmin);

  const load = () => {
    if (!isAdmin) {
      setAccessDenied(true);
      return;
    }
    setLoading(true);
    api.get<Account[]>("/accounts")
      .then(setItems)
      .catch((err: ApiClientError) => {
        if (err.status === 403) {
          setAccessDenied(true);
        } else {
          toast("error", err.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (!isAdmin) setAccessDenied(true);
      else load();
    }
  }, [isAdmin, isAuthenticated]);

  if (accessDenied) {
    return <AccessDenied />;
  }

  const beginEdit = (account: Account) => {
    setEditing(account);
    setForm({ fullName: account.fullName, role: account.role });
    setFormErrors({});
    setOpen(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (!editing) return;

    setSaving(true);
    try {
      await api.put(`/accounts/${editing.accountId}`, {
        accountId: editing.accountId,
        fullName: form.fullName.trim(),
        email: editing.email,
        role: form.role
      });
      toast("success", "Account updated successfully.");
      setOpen(false);
      load();
    } catch (err: any) {
      toast("error", err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await api.delete(`/accounts/${deleting.accountId}`);
      toast("success", "Account deleted successfully.");
      load();
      setDeleting(null);
    } catch (err: any) {
      toast("error", err.message || "Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        description="Manage user access and roles."
        icon={UsersIcon}
      >
        {!loading && (
          <div className="rounded-xl border border-theme-border bg-white px-3.5 py-1.5 shadow-xs text-xs font-medium text-theme-text flex items-center gap-2">
            <span>Total Accounts:</span>
            <span className="font-bold text-primary">{items.length}</span>
          </div>
        )}
      </PageHeader>

      {loading ? (
        <LoadingState label="Loading accounts..." />
      ) : items.length === 0 ? (
        <EmptyState label="No accounts found." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-theme-border bg-white shadow-xs">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-theme-border bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-theme-muted">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border/60">
              {items.map((item) => (
                <tr key={item.accountId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {item.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-theme-text">{item.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-theme-muted">{item.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={item.role} />
                  </td>
                  <td className="px-4 py-3 text-theme-muted text-xs">
                    {item.createdDate ? new Date(item.createdDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-right">
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
      
      <Modal title="Edit Account" open={open} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Full Name</label>
            <input 
              className={`w-full ${formErrors.fullName ? "!border-rose-400 focus:!ring-rose-500/20" : ""}`} 
              value={form.fullName} 
              onChange={(e) => {
                setForm({ ...form, fullName: e.target.value });
                if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: "" });
              }} 
              placeholder="Enter full name" 
              maxLength={100} 
            />
            {formErrors.fullName && <p className="mt-1 text-xs text-rose-500">{formErrors.fullName}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-theme-text">Role</label>
            <Select 
              value={form.role}
              onChange={(val) => setForm({ ...form, role: Number(val) })}
              options={[
                { value: 0, label: "Staff Member" },
                { value: 1, label: "Administrator" }
              ]}
              className="bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-theme-border/60">
            <SecondaryButton type="button" onClick={() => setOpen(false)}>
              Cancel
            </SecondaryButton>
            <Button disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Delete Account"
        description={
          <>
            Are you sure you want to delete the account for <strong>{deleting?.fullName}</strong>? This action cannot be undone.
          </>
        }
      />
    </div>
  );
}
