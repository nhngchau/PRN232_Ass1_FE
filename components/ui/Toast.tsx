"use client";

export type ToastMessage = { type: "success" | "error"; text: string };

export function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null;
  const tone = toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800";
  return <div className={`mb-6 rounded-xl border p-4 text-sm font-medium shadow-sm ${tone}`}>{toast.text}</div>;
}
