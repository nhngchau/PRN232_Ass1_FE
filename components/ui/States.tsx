import Link from "next/link";
import { Button } from "./Buttons";
import { ReactNode } from "react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex animate-pulse items-center justify-center rounded-xl border border-theme-border bg-surface p-8 text-sm text-theme-muted shadow-xs">
      {label}
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-xs">
      <p className="text-sm font-medium text-theme-muted">{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-xs">
      {message}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-r-transparent"></div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-theme-border bg-surface p-5 sm:p-6 shadow-xs ${className}`}>
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
  action,
  className = ""
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-theme-border bg-surface p-5 sm:p-6 shadow-xs ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h2 className="text-base font-bold text-theme-text sm:text-lg">{title}</h2>
          {description && <p className="mt-0.5 text-xs sm:text-sm text-theme-muted">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}

export function AccessDenied() {
  return (
    <div className="mx-auto mt-12 flex max-w-lg flex-col items-center justify-center rounded-xl border border-theme-border bg-white p-10 text-center shadow-xs">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold tracking-tight text-theme-text mb-2">Access Denied</h2>
      <p className="text-theme-muted mb-6 text-sm max-w-sm">
        You do not have permission to view this page. This area is restricted to administrators.
      </p>
      <Link href="/admin">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
}
