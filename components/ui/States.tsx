export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">{label}</div>;
}

export function EmptyState({ label }: { label: string }) {
  return <div className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">{label}</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{message}</div>;
}
