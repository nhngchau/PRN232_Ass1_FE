"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginResponse } from "@/lib/auth/types";
import { Button } from "@/components/ui/Buttons";
import { ProjectIcon } from "@/components/ui/Icons";
import { AuthInput } from "@/components/ui/AuthInput";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const data = await api.post<LoginResponse>("/auth/login", { email, password });

      if ((data.token || data.accessToken) && data.refreshToken && data.account) {
        login(data);
        router.push("/admin");
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err: any) {
      const errorMessage = err?.errors 
        ? Object.values(err.errors).flat().join(", ") 
        : err?.message;
      setError(errorMessage || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Form Column */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-20 lg:w-1/2">
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
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-theme-muted">
              Sign in to your account to manage your workspace
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-rose-50 p-3.5 text-xs sm:text-sm font-medium text-rose-700 border border-rose-200/80 flex items-center gap-2.5">
                <svg className="h-4 w-4 shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <AuthInput
                id="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                error={!!error && !email}
              />

              <AuthInput
                id="password"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                error={!!error && !password}
              />
            </div>

            <Button type="submit" className="w-full !py-2.5 text-sm font-semibold mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center pt-3">
              <p className="text-xs text-theme-muted">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Create an account
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
            Streamlined task and project management.
          </h2>
          <p className="text-sm text-theme-muted leading-relaxed">
            Keep your teams synchronized, assign responsibilities, and monitor delivery across all departments from one clean workspace.
          </p>
        </div>

        <div className="text-xs text-theme-muted">
          &copy; {new Date().getFullYear()} TaskTrack. All rights reserved.
        </div>
      </div>
    </div>
  );
}
