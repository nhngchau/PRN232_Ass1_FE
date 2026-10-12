import { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-xs transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-theme-border bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function DangerButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-sm font-medium text-rose-600 shadow-xs transition-all hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function GhostButton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 h-10 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
