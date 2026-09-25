"use client";

export type ToastMessage = { type: "success" | "error"; text: string };

export function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null;
  const tone = toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900";
  return <div className={`mb-4 rounded-md border p-3 text-sm ${tone}`}>{toast.text}</div>;
}
