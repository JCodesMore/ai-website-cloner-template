"use client";

import { useState } from "react";
import type { DailyPoint } from "@/lib/server/analytics";

/** Round the axis max up to a clean 1/2/5 × 10ⁿ step so ticks read 0 / 50 / 100. */
function niceMax(n: number) {
  if (n <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(n));
  return [1, 2, 2.5, 5, 10].map((m) => m * step).find((m) => m >= n) ?? n;
}

const dayLabel = (day: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${day}T12:00:00Z`).toLocaleDateString("en-GB", { timeZone: "UTC", ...opts });

/** Daily pageviews as columns; hover or focus a day for views and visitors. */
export function TrafficChart({ data, height = 220 }: { data: DailyPoint[]; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(0, ...data.map((d) => d.views)));
  const ticks = [max, max / 2, 0];
  const labelEvery = Math.ceil(data.length / 8);
  const total = data.reduce((s, d) => s + d.views, 0);

  return (
    <figure className="viz-root">
      <div className="flex gap-3">
        {/* y-axis */}
        <div className="relative w-8 shrink-0 text-right text-xs text-slate-500 tabular-nums" style={{ height }}>
          {ticks.map((t, i) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${(i / 2) * 100}%` }}>
              {t >= 1000 ? `${t / 1000}K` : t}
            </span>
          ))}
        </div>
        <div className="relative flex-1" style={{ height }} onMouseLeave={() => setHover(null)}>
          {ticks.map((t, i) => (
            <div key={t} className="absolute inset-x-0 border-t border-slate-200/70" style={{ top: `${(i / 2) * 100}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {data.map((d, i) => (
              <button
                key={d.day}
                type="button"
                className="group relative flex h-full flex-1 items-end outline-none"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${dayLabel(d.day, { weekday: "short", day: "numeric", month: "short" })}: ${d.views} pageviews, ${d.visitors} visitors`}
              >
                <span
                  className="block w-full rounded-t-[4px] transition-opacity"
                  style={{
                    height: d.views ? `max(2px, ${(d.views / max) * 100}%)` : 0,
                    background: "var(--series-1)",
                    opacity: hover === null || hover === i ? 1 : 0.45,
                  }}
                />
              </button>
            ))}
          </div>
          {hover !== null && data[hover] && (
            <div
              role="tooltip"
              className="pointer-events-none absolute top-0 z-10 min-w-36 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
              style={{ left: `clamp(4.5rem, ${((hover + 0.5) / data.length) * 100}%, calc(100% - 4.5rem))` }}
            >
              <p className="font-medium text-slate-900">{dayLabel(data[hover].day, { weekday: "long", day: "numeric", month: "long" })}</p>
              <p className="mt-1 flex items-center justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm" style={{ background: "var(--series-1)" }} />
                  Pageviews
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">{data[hover].views}</span>
              </p>
              <p className="flex items-center justify-between gap-4 text-slate-600">
                <span className="pl-3.5">Visitors</span>
                <span className="font-semibold text-slate-900 tabular-nums">{data[hover].visitors}</span>
              </p>
            </div>
          )}
        </div>
      </div>
      {/* x-axis */}
      <div className="mt-2 ml-11 flex gap-[2px] text-xs text-slate-500">
        {data.map((d, i) => (
          <span key={d.day} className="flex-1 text-center whitespace-nowrap">
            {i % labelEvery === 0 ? dayLabel(d.day, { day: "numeric", month: "short" }) : ""}
          </span>
        ))}
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-slate-500 hover:text-slate-800">Show as table</summary>
        <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Day</th>
                <th className="px-3 py-2 text-right font-medium">Pageviews</th>
                <th className="px-3 py-2 text-right font-medium">Visitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 tabular-nums">
              {[...data].reverse().map((d) => (
                <tr key={d.day}>
                  <td className="px-3 py-1.5">{dayLabel(d.day, { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-3 py-1.5 text-right">{d.views}</td>
                  <td className="px-3 py-1.5 text-right">{d.visitors}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-slate-200 font-medium">
              <tr>
                <td className="px-3 py-2">Total</td>
                <td className="px-3 py-2 text-right tabular-nums">{total}</td>
                <td className="px-3 py-2" />
              </tr>
            </tfoot>
          </table>
        </div>
      </details>
    </figure>
  );
}
