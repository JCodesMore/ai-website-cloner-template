import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function DocH2({
  children,
  icon: Icon,
}: {
  children: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <h2 className="mt-12 flex items-center gap-2 text-[22px] font-semibold tracking-tight text-zinc-50 first:mt-0 sm:text-2xl">
      {Icon ? (
        <Icon
          className="size-[18px] shrink-0 text-emerald-400/70"
          strokeWidth={1.75}
          aria-hidden
        />
      ) : null}
      {children}
    </h2>
  );
}

export function DocH3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-7 text-[17px] font-semibold text-zinc-100">{children}</h3>
  );
}

export function DocUl({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-emerald-400/70">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function DocCallout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.04] p-6 shadow-[0_4px_24px_rgb(0_0_0/0.22)] backdrop-blur-md">
      {title ? (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
          {title}
        </p>
      ) : null}
      <div className="text-zinc-300">{children}</div>
    </div>
  );
}

export function DocInlineLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-emerald-300 underline decoration-emerald-500/40 underline-offset-2 transition-colors hover:text-emerald-200 hover:decoration-emerald-400"
    >
      {children}
    </Link>
  );
}

/** Pill badge used above DocH2 to label a section. */
export function DocSectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
      {children}
    </span>
  );
}

/** 2-column responsive glass-card grid replacing DocUl on feature-heavy sections. */
export function DocFeatureGrid({
  items,
}: {
  items: { icon?: LucideIcon; text: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.text}
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 backdrop-blur-sm"
          >
            {Icon ? (
              <Icon
                className="mt-0.5 size-4 shrink-0 text-emerald-400/80"
                strokeWidth={1.75}
                aria-hidden
              />
            ) : (
              <span
                className="mt-[7px] size-1.5 shrink-0 rounded-full bg-emerald-400/70"
                aria-hidden
              />
            )}
            <span className="text-[14px] leading-relaxed text-zinc-300">
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Horizontal stat highlight strip. */
export function DocStat({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ value, label }) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3.5 backdrop-blur-sm"
        >
          <span className="text-[22px] font-semibold tracking-tight text-zinc-50">
            {value}
          </span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
