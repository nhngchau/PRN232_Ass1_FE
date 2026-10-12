export function RoleBadge({ role, className = "" }: { role: number; className?: string }) {
  if (role === 1) {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60 ${className}`}
      >
        Admin
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/60 ${className}`}
    >
      Staff
    </span>
  );
}
