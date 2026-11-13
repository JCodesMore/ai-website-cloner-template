import type { Ranked } from "@/lib/server/analytics";

/** Ranked list with a proportional bar behind each row; the value sits at the row's end. */
export function BarList({ items, empty = "No data yet.", format = (l: string) => l }: { items: Ranked[]; empty?: string; format?: (label: string) => string }) {
  if (!items.length) return <p className="py-6 text-center text-sm text-slate-500">{empty}</p>;
  const max = Math.max(...items.map((i) => i.value));
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item.label} className="relative flex items-center justify-between gap-3 px-2.5 py-1.5 text-sm">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-[4px]"
            style={{ width: `${(item.value / max) * 100}%`, background: "var(--series-1-soft)" }}
          />
          <span className="relative truncate text-slate-800" title={format(item.label)}>
            {format(item.label)}
          </span>
          <span className="relative font-medium text-slate-900 tabular-nums">{item.value.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  );
}
