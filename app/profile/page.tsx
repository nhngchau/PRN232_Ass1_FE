"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api";
import { Account } from "@/lib/auth/types";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Buttons";
import { AuthInput } from "@/components/ui/AuthInput";
import { LoadingState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { RoleBadge } from "@/components/ui/RoleBadge";

export default function ProfilePage() {
  const { isAuthenticated, isInitialized, account, updateAccount } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [profile, setProfile] = useState<Account | null>(account);
  const [fullName, setFullName] = useState(account?.fullName ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    api.get<Account>("/profile")
      .then((data) => {
        setProfile(data);
        setFullName(data.fullName);
        updateAccount(data);
      })
      .catch((err: ApiClientError) => toast("error", err.message || "Could not load profile."))
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  const submitProfile = async (event: FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = "Full name cannot be blank.";
    }

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingProfile(true);
    try {
      const updated = await api.put<Account>("/profile", { fullName: fullName.trim() });
      setProfile(updated);
      setFullName(updated.fullName);
      updateAccount(updated);
      toast("success", "Profile updated successfully.");
    } catch (err: any) {
      const nextErrors = flattenErrors(err);
      setProfileErrors(nextErrors);
      toast("error", err.message || "Profile update failed.");
    } finally {
      setSavingProfile(false);
    }
  };

  const submitPassword = async (event: FormEvent) => {
    event.preventDefault();
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = "Current password is required.";
    if (!newPassword) {
      errors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSavingPassword(true);
    try {
      await api.put("/profile/password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
      toast("success", "Password changed successfully.");
    } catch (err: any) {
      setPasswordErrors(flattenErrors(err));
      toast("error", err.message || "Password change failed.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!isAuthenticated || loading) {
    return <LoadingState label="Loading profile..." />;
  }

  const isProfileUnchanged = fullName.trim() === (profile?.fullName ?? "") || !fullName.trim();
  const isPasswordFormIncomplete = !currentPassword || !newPassword || !confirmPassword;

  return (
    <div className="mx-auto max-w-[1040px] space-y-6">
      {/* Standard Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information and account security.
        </p>
      </div>

      {/* Two-column desktop layout (stacks on tablet/mobile) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* Left Card: Account Information */}
        <section className="rounded-xl border border-theme-border bg-white p-4 sm:p-6 shadow-xs">
          <div className="mb-4 border-b border-theme-border/70 pb-3">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Account Information
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Update your personal details.
            </p>
          </div>

          {/* Top identity row */}
          <div className="mb-4 flex items-center gap-3.5 rounded-lg bg-slate-50/80 p-3 border border-theme-border/60">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
              {profile?.fullName.substring(0, 2).toUpperCase() || "TT"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{profile?.fullName}</p>
              <p className="truncate text-xs text-slate-500">{profile?.email}</p>
              <div className="mt-1">
                <RoleBadge role={profile?.role ?? 0} />
              </div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={submitProfile}>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                className={`block w-full h-[42px] rounded-xl border px-3.5 py-2 text-sm text-slate-900 outline-none transition-all focus:ring-2 bg-white ${
                  profileErrors.fullName
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                    : "border-theme-border focus:border-primary focus:ring-primary/20 hover:border-slate-300"
                }`}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setProfileErrors((prev) => ({ ...prev, fullName: "" }));
                }}
                maxLength={100}
                placeholder="Enter full name"
              />
              {profileErrors.fullName && (
                <p className="mt-1 text-xs font-medium text-rose-500">{profileErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                className="block w-full h-[42px] rounded-xl border border-theme-border bg-slate-50/80 px-3.5 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                value={profile?.email ?? ""}
                disabled
              />
            </div>

            {/* Small metadata row */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-theme-border/60">
              <div className="rounded-lg bg-slate-50/60 p-2.5 border border-theme-border/50">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Role</span>
                <span className="mt-0.5 block text-xs font-semibold text-slate-900">
                  {profile?.role === 1 ? "Admin" : "Staff"}
                </span>
              </div>
              <div className="rounded-lg bg-slate-50/60 p-2.5 border border-theme-border/50">
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Member Since</span>
                <span className="mt-0.5 block text-xs font-semibold text-slate-900">
                  {profile?.createdDate ? new Date(profile.createdDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button disabled={savingProfile || isProfileUnchanged} className="h-10 px-4 text-sm font-medium">
                {savingProfile ? "Saving changes..." : "Save changes"}
              </Button>
            </div>
          </form>
        </section>

        {/* Right Card: Password & Security */}
        <section className="rounded-xl border border-theme-border bg-white p-4 sm:p-6 shadow-xs">
          <div className="mb-4 border-b border-theme-border/70 pb-3">
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Password & Security
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Change your account password.
            </p>
          </div>

          <form className="space-y-4" onSubmit={submitPassword}>
            <AuthInput
              id="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordErrors((prev) => ({ ...prev, currentPassword: "" }));
              }}
              error={!!passwordErrors.currentPassword}
              errorMessage={passwordErrors.currentPassword}
            />

            <AuthInput
              id="newPassword"
              type="password"
              label="New Password"
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
              }}
              error={!!passwordErrors.newPassword}
              errorMessage={passwordErrors.newPassword}
            />

            <AuthInput
              id="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              error={!!passwordErrors.confirmPassword}
              errorMessage={passwordErrors.confirmPassword}
            />

            <div className="flex justify-end pt-2">
              <Button disabled={savingPassword || isPasswordFormIncomplete} className="h-10 px-4 text-sm font-medium">
                {savingPassword ? "Changing password..." : "Change password"}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function flattenErrors(err: any) {
  if (!err?.errors) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(err.errors).map(([key, value]) => [
      key.charAt(0).toLowerCase() + key.slice(1),
      Array.isArray(value) ? value.join(" ") : String(value)
    ])
  );
}
