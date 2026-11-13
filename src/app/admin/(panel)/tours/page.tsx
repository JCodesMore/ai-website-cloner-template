/* eslint-disable @next/next/no-img-element */
import { Copy, Pencil, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { deleteTour, setTourPublished } from "@/app/admin/actions";
import { DangerButton, PublishToggle } from "@/components/admin/row-actions";
import { Badge, buttonClass, Card, Notice, PageHeader } from "@/components/admin/ui";
import { upload } from "@/components/sites/showlanka/site-link";
import { adminTours } from "@/lib/server/content";

export const metadata: Metadata = { title: "Tours" };

export default async function ToursAdminPage({ searchParams }: PageProps<"/admin/tours">) {
  const sp = await searchParams;
  const entries = adminTours();
  const saved = typeof sp.saved === "string" ? entries.find((e) => e.item.slug === sp.saved) : undefined;

  return (
    <>
      <PageHeader
        title="Tours"
        description={`${entries.filter((e) => e.published).length} of ${entries.length} tours are on the website.`}
        actions={
          <Link href="/admin/tours/new" className={buttonClass.primary}>
            <Plus className="size-4" /> New tour
          </Link>
        }
      />
      {saved && (
        <Notice>
          Saved “{saved.item.title}”.{" "}
          {saved.published && (
            <a href={`/${saved.item.slug}`} target="_blank" rel="noopener" className="font-medium underline">
              View it on the website
            </a>
          )}
        </Notice>
      )}
      {sp.deleted && <Notice>Tour deleted.</Notice>}
      {sp.reset && <Notice>Tour reset to its original content.</Notice>}

      <Card className="[&>div]:p-0">
        <ul className="divide-y divide-slate-100">
          {entries.map(({ item: t, builtin, edited, published }) => (
            <li key={t.slug} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <img src={upload(t.card || t.hero)} alt="" className="aspect-video w-full rounded-md bg-slate-100 object-cover sm:w-32" loading="lazy" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Link href={`/admin/tours/${t.slug}`} className="font-medium text-slate-900 hover:text-[#0057a7]">
                    {t.title}
                  </Link>
                  {!published && <Badge tone="amber">Hidden</Badge>}
                  {!builtin && <Badge tone="violet">Created here</Badge>}
                  {edited && <Badge tone="blue">Edited</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-slate-500">
                  {t.duration} · from {t.cardPrice} per person{t.code && ` · code ${t.code}`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <Link href={`/admin/tours/${t.slug}`} className={buttonClass.ghost}>
                  <Pencil className="size-4" /> Edit
                </Link>
                <Link href={`/admin/tours/new?from=${t.slug}`} className={buttonClass.ghost} title="Start a new tour from a copy of this one">
                  <Copy className="size-4" /> Duplicate
                </Link>
                <PublishToggle published={published} onToggle={setTourPublished.bind(null, t.slug)} />
                {(!builtin || edited) && (
                  <DangerButton
                    className="px-2.5 py-1"
                    label={builtin ? "Reset" : "Delete"}
                    confirmText={builtin ? `Undo all admin changes to “${t.title}”?` : `Delete “${t.title}” permanently?`}
                    onConfirm={deleteTour.bind(null, t.slug)}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
