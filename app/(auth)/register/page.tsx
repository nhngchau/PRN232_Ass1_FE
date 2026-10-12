"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Buttons";
import { useToast } from "@/components/ui/Toast";
import { ProjectIcon } from "@/components/ui/Icons";
import { AuthInput } from "@/components/ui/AuthInput";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const addToast = useToast();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/auth/register", {
        fullName: fullName.trim(),
        email: email.trim(),
        password
      });
      addToast("success", "Registration successful. You can now sign in.");
      router.push("/login");
    } catch (err: any) {
      if (err.status === 409) {
        setErrors({ email: "This email is already registered" });
      } else {
        addToast("error", err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Form Column */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-20 lg:w-1/2 py-8">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/tasktrack-logo.png" alt="TaskTrack Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold tracking-tight text-theme-text">TaskTrack</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">
              Create an account
            </h1>
            <p className="mt-1.5 text-sm text-theme-muted">
              Get started with TaskTrack to organize your workspace
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <AuthInput
              id="fullName"
              type="text"
              label="Full Name"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setErrors(prev => ({ ...prev, fullName: "" })); }}
              placeholder="e.g. John Doe"
              error={!!errors.fullName}
              errorMessage={errors.fullName}
            />

            <AuthInput
              id="email"
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }}
              placeholder="you@example.com"
              error={!!errors.email}
              errorMessage={errors.email}
            />

            <AuthInput
              id="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }}
              placeholder="At least 6 characters"
              error={!!errors.password}
              errorMessage={errors.password}
            />

            <AuthInput
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: "" })); }}
              placeholder="Re-enter password"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
            />

            <Button type="submit" className="w-full !py-2.5 text-sm font-semibold mt-2" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <div className="text-center pt-3">
              <p className="text-xs text-theme-muted">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Feature Panel */}
      <div className="hidden lg:flex lg:w-1/2 border-l border-theme-border bg-slate-50/70 flex-col justify-between p-12 xl:p-16">
        <div className="flex items-center gap-2.5">
          <img src="/tasktrack-logo.png" alt="TaskTrack" className="h-7 w-7 object-contain" />
          <span className="text-sm font-bold tracking-tight text-theme-text uppercase">TaskTrack Platform</span>
        </div>

        <div className="my-auto max-w-md">
          <div className="inline-flex items-center justify-center rounded-xl bg-white p-3 shadow-xs border border-theme-border mb-6">
            <ProjectIcon className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-theme-text leading-tight mb-3">
            Join the modern workspace.
          </h2>
          <p className="text-sm text-theme-muted leading-relaxed">
            Create an account and start managing your tasks and projects with clarity and ease.
          </p>
        </div>

        <div className="text-xs text-theme-muted">
          &copy; {new Date().getFullYear()} TaskTrack. All rights reserved.
        </div>
      </div>
    </div>
  );
}
