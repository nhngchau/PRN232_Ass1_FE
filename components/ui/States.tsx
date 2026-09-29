export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="flex animate-pulse items-center justify-center rounded-2xl border border-theme-border bg-surface p-8 text-sm text-theme-muted shadow-sm">{label}</div>;
}

export function EmptyState({ label }: { label: string }) {
  return <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center shadow-sm">
    <p className="text-sm font-medium text-theme-muted">{label}</p>
  </div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800 shadow-sm">{message}</div>;
}
