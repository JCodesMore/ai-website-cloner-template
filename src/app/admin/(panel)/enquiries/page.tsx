import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge, buttonClass, Card, EmptyState, formatDateTime, inputClass, Notice, PageHeader, statusTone, timeAgo } from "@/components/admin/ui";
import { TIME_ZONE } from "@/lib/server/db";
import { ENQUIRY_STATUSES, listEnquiries, statusCounts } from "@/lib/server/enquiries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Enquiries" };

const PAGE_SIZE = 25;

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");
  const status = one(sp.status);
  const q = one(sp.q).trim();
  const page = Math.max(1, parseInt(one(sp.page), 10) || 1);
  const { items, total } = listEnquiries({ status, q, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const counts = statusCounts();
  const all = Object.values(counts).reduce((s, n) => s + (n ?? 0), 0);
  const href = (p: Record<string, string | number>) => {
    const params = new URLSearchParams();
    const merged: Record<string, string | number> = { status, q, ...p };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === "page" && Number(v) === 1)) params.set(k, String(v));
    const s = params.toString();
    return `/admin/enquiries${s ? `?${s}` : ""}`;
  };
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader title="Enquiries" description="Tour enquiries sent through the contact form on the website." />
      {sp.deleted && <Notice>Enquiry deleted.</Notice>}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav className="flex gap-1 overflow-x-auto" aria-label="Filter by status">
          {[{ value: "", label: "All", n: all }, ...ENQUIRY_STATUSES.map((s) => ({ value: s, label: s, n: counts[s] ?? 0 }))].map((f) => (
            <Link
              key={f.value}
              href={href({ status: f.value, page: 1 })}
              aria-current={status === f.value ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium capitalize whitespace-nowrap transition",
                status === f.value ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200" : "text-slate-600 hover:bg-white/70",
              )}
            >
              {f.label}
              <span className="text-xs text-slate-400 tabular-nums">{f.n}</span>
            </Link>
          ))}
        </nav>
        <form className="relative md:w-72" action="/admin/enquiries">
          {status && <input type="hidden" name="status" value={status} />}
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={q} placeholder="Search name, email, country…" aria-label="Search enquiries" className={`${inputClass} pl-9`} />
        </form>
      </div>

      <Card className="overflow-hidden [&>div]:p-0">
        {items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">From</th>
                  <th className="hidden px-4 py-2.5 font-medium md:table-cell">Travel dates</th>
                  <th className="hidden px-4 py-2.5 font-medium lg:table-cell">Party</th>
                  <th className="px-4 py-2.5 font-medium">Received</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((e) => (
                  <tr key={e.id} className="group relative hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/enquiries/${e.id}`} className="font-medium text-slate-900 after:absolute after:inset-0">
                        {e.name}
                      </Link>
                      <span className="block text-xs text-slate-500">
                        {e.email}
                        {e.country && ` · ${e.country}`}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                      {e.arrival || e.departure ? `${e.arrival || "?"} → ${e.departure || "?"}` : "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                      {[e.adults && `${e.adults} adults`, e.children].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600" title={formatDateTime(e.created_at, TIME_ZONE)}>
                      {timeAgo(e.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[e.status] ?? "slate"}>{e.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState>{q || status ? "No enquiries match this filter." : "No enquiries yet. They appear here when someone sends the contact form."}</EmptyState>
          </div>
        )}
      </Card>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {page} of {pages} · {total} enquiries
          </span>
          <span className="flex gap-2">
            {page > 1 && (
              <Link href={href({ page: page - 1 })} className={buttonClass.secondary}>
                Previous
              </Link>
            )}
            {page < pages && (
              <Link href={href({ page: page + 1 })} className={buttonClass.secondary}>
                Next
              </Link>
            )}
          </span>
        </div>
      )}
    </>
  );
}
