import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Small presentational pieces shared by the admin pages.

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs outline-none transition placeholder:text-slate-400 focus:border-[#0057a7] focus:ring-3 focus:ring-[#0057a7]/15 disabled:bg-slate-100 disabled:text-slate-500";

export const buttonClass = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0057a7] px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-[#004a8f] focus-visible:ring-3 focus-visible:ring-[#0057a7]/30 focus-visible:outline-none disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 focus-visible:ring-3 focus-visible:ring-[#0057a7]/20 focus-visible:outline-none disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:ring-3 focus-visible:ring-red-500/20 focus-visible:outline-none disabled:opacity-60",
  ghost:
    "inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
};

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-slate-200 bg-white shadow-xs", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

const badgeTone = {
  blue: "bg-blue-50 text-blue-800 ring-blue-200",
  green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  violet: "bg-violet-50 text-violet-800 ring-violet-200",
};

export function Badge({ tone = "slate", children }: { tone?: keyof typeof badgeTone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset", badgeTone[tone])}>
      {children}
    </span>
  );
}

export const statusTone = { new: "blue", contacted: "amber", booked: "green", closed: "slate" } as const;

export function Notice({ tone = "green", children }: { tone?: "green" | "red"; children: ReactNode }) {
  return (
    <div
      role="status"
      className={cn(
        "mb-5 rounded-lg border px-4 py-3 text-sm",
        tone === "green" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-800",
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ children, action }: { children: ReactNode; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
      <p>{children}</p>
      {action && (
        <Link href={action.href} className={cn(buttonClass.primary, "mt-4")}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

const fmt = (tz: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: tz, ...opts });

export function formatDateTime(ms: number, tz: string) {
  return fmt(tz, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(ms);
}

export function timeAgo(ms: number) {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

export const compact = (n: number) => new Intl.NumberFormat("en", { notation: n >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(n);
