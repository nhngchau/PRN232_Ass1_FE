import { ReactNode, ComponentType } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  children,
  className = ""
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 ${className}`}>
      <div className="flex items-start sm:items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5 shrink-0" />
          </div>
        )}
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-theme-text sm:text-3xl">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="mt-1 text-sm text-theme-muted">
              {description}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
