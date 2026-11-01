import { ArrowRight, Map, Newspaper } from "lucide-react";
import Link from "next/link";
import { TrafficChart } from "@/components/admin/traffic-chart";
import { Badge, buttonClass, Card, compact, EmptyState, PageHeader, StatTile, statusTone, timeAgo } from "@/components/admin/ui";
import { daily, liveVisitors, rangeStart, totals } from "@/lib/server/analytics";
import { adminNews, adminTours } from "@/lib/server/content";
import { listEnquiries, statusCounts } from "@/lib/server/enquiries";

export default function DashboardPage() {
  const today = totals(rangeStart(1));
  const week = totals(rangeStart(7));
  const counts = statusCounts();
  const recent = listEnquiries({ limit: 6 }).items;
  const tours = adminTours();
  const news = adminNews();

  return (
    <>
      <PageHeader
        title="Ayubowan, Janaka"
        description="Here is what is happening on showlanka.com."
        actions={
          <>
            <Link href="/admin/news/new" className={buttonClass.secondary}>
              <Newspaper className="size-4" />
              Write news
            </Link>
            <Link href="/admin/tours/new" className={buttonClass.primary}>
              <Map className="size-4" />
              New tour
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Visitors today" value={compact(today.visitors)} hint={`${compact(today.views)} pageviews`} />
        <StatTile label="Visitors, last 7 days" value={compact(week.visitors)} hint={`${compact(week.views)} pageviews`} />
        <StatTile label="New enquiries" value={counts.new ?? 0} hint={`${week.enquiries} in the last 7 days`} />
        <StatTile label="On the site now" value={liveVisitors()} hint="Active in the last 5 minutes" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card
          title="Pageviews, last 14 days"
          className="lg:col-span-3"
          action={
            <Link href="/admin/traffic" className={buttonClass.ghost}>
              Full report <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          <TrafficChart data={daily(14)} height={180} />
        </Card>

        <Card
          title="Latest enquiries"
          className="lg:col-span-2"
          action={
            <Link href="/admin/enquiries" className={buttonClass.ghost}>
              All <ArrowRight className="size-3.5" />
            </Link>
          }
        >
          {recent.length ? (
            <ul className="-my-2 divide-y divide-slate-100">
              {recent.map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="-mx-2 flex items-start justify-between gap-3 rounded-md px-2 py-2.5 hover:bg-slate-50">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900">{e.name}</span>
                      <span className="block truncate text-xs text-slate-500">
                        {[e.country, e.arrival && `arrives ${e.arrival}`].filter(Boolean).join(" · ") || e.email}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <Badge tone={statusTone[e.status] ?? "slate"}>{e.status}</Badge>
                      <span className="text-xs text-slate-400">{timeAgo(e.created_at)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState>No enquiries yet. They appear here when someone sends the contact form.</EmptyState>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/tours" className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300">
          <p className="text-sm text-slate-500">Tours on the website</p>
          <p className="mt-1 text-lg font-semibold">
            {tours.filter((t) => t.published).length} published
            <span className="ml-2 text-sm font-normal text-slate-500">{tours.filter((t) => !t.builtin).length} created here</span>
          </p>
        </Link>
        <Link href="/admin/news" className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300">
          <p className="text-sm text-slate-500">Travel news articles</p>
          <p className="mt-1 text-lg font-semibold">
            {news.filter((n) => n.published).length} published
            <span className="ml-2 text-sm font-normal text-slate-500">{news.filter((n) => !n.builtin).length} written here</span>
          </p>
        </Link>
      </div>
    </>
  );
}
