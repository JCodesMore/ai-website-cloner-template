import type { Metadata } from "next";
import Link from "next/link";
import { BarList } from "@/components/admin/bar-list";
import { TrafficChart } from "@/components/admin/traffic-chart";
import { Card, compact, PageHeader, StatTile } from "@/components/admin/ui";
import { daily, rangeStart, top, totals } from "@/lib/server/analytics";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Website traffic" };

const RANGES = [
  { days: 1, label: "Today" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const country = (code: string) => {
  if (!code) return "Unknown";
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
};
const pct = (n: number) => `${Math.round(n * 100)}%`;

export default async function TrafficPage({ searchParams }: PageProps<"/admin/traffic">) {
  const { range } = await searchParams;
  const days = RANGES.find((r) => String(r.days) === range)?.days ?? 30;
  const from = rangeStart(days);
  const t = totals(from);
  // Compare with the period of the same length just before.
  const prev = totals(from - days * 86400000, from);
  const delta = (now: number, before: number) => {
    if (!before) return now ? "New this period" : "No change";
    const d = (now - before) / before;
    return `${d >= 0 ? "+" : "−"}${Math.abs(Math.round(d * 100))}% vs previous ${days === 1 ? "day" : `${days} days`}`;
  };

  return (
    <>
      <PageHeader
        title="Website traffic"
        description="Visits to showlanka.com, counted without cookies. Bots and admin pages are left out."
        actions={
          <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 shadow-xs" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <Link
                key={r.days}
                href={`/admin/traffic?range=${r.days}`}
                aria-current={r.days === days ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition",
                  r.days === days ? "bg-[#0057a7] text-white" : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {r.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Visitors" value={compact(t.visitors)} hint={delta(t.visitors, prev.visitors)} />
        <StatTile label="Pageviews" value={compact(t.views)} hint={delta(t.views, prev.views)} />
        <StatTile label="Visits" value={compact(t.sessions)} hint={`${t.sessions ? (t.views / t.sessions).toFixed(1) : 0} pages per visit`} />
        <StatTile label="Bounce rate" value={pct(t.bounceRate)} hint="Visits that saw one page" />
        <StatTile label="Enquiries" value={t.enquiries} hint={delta(t.enquiries, prev.enquiries)} />
        <StatTile label="Conversion" value={t.visitors ? `${((t.enquiries / t.visitors) * 100).toFixed(1)}%` : "0%"} hint="Enquiries per visitor" />
      </div>

      {days > 1 && (
        <Card title="Pageviews per day" className="mt-6">
          <TrafficChart data={daily(days)} />
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Top pages" action={<span className="text-xs text-slate-500">Pageviews</span>}>
          <BarList items={top("path", from, 10)} />
        </Card>
        <Card title="Where visitors came from" action={<span className="text-xs text-slate-500">Visits</span>}>
          <BarList items={top("source", from, 10)} />
        </Card>
        <Card title="Countries" action={<span className="text-xs text-slate-500">Pageviews</span>}>
          <BarList items={top("country", from, 10)} format={country} />
          <p className="mt-3 text-xs text-slate-500">Countries are known only when the site runs behind Cloudflare or Vercel; otherwise they show as Unknown.</p>
        </Card>
        <div className="grid gap-6">
          <Card title="Devices">
            <BarList items={top("device", from, 3)} />
          </Card>
          <Card title="Browsers">
            <BarList items={top("browser", from, 6)} />
          </Card>
        </div>
      </div>
    </>
  );
}
