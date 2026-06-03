import Link from "next/link";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-slate-300">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-slate-700">{title}</h3>
      {description && (
        <p className="mb-4 max-w-md text-sm text-slate-400">{description}</p>
      )}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
