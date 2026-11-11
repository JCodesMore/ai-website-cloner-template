/* eslint-disable @next/next/no-img-element */
import { Pencil, PlayCircle, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { deleteNews, setNewsPublished } from "@/app/admin/actions";
import { DangerButton, PublishToggle } from "@/components/admin/row-actions";
import { Badge, buttonClass, Card, Notice, PageHeader } from "@/components/admin/ui";
import { upload } from "@/components/sites/showlanka/site-link";
import { adminNews } from "@/lib/server/content";

export const metadata: Metadata = { title: "Travel news" };

export default async function NewsAdminPage({ searchParams }: PageProps<"/admin/news">) {
  const sp = await searchParams;
  const entries = adminNews();
  const saved = typeof sp.saved === "string" ? entries.find((e) => e.item.slug === sp.saved) : undefined;

  return (
    <>
      <PageHeader
        title="Travel news"
        description="Articles on the News & Offers page, newest first."
        actions={
          <Link href="/admin/news/new" className={buttonClass.primary}>
            <Plus className="size-4" /> Write article
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
      {sp.deleted && <Notice>Article deleted.</Notice>}
      {sp.reset && <Notice>Article reset to its original content.</Notice>}

      <Card className="[&>div]:p-0">
        <ul className="divide-y divide-slate-100">
          {entries.map(({ item: n, builtin, edited, published }) => {
            const thumb = n.card || n.hero;
            return (
              <li key={n.slug} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md bg-slate-100 sm:w-32">
                  {thumb ? (
                    <img src={upload(thumb)} alt="" className="size-full object-cover" loading="lazy" />
                  ) : n.video ? (
                    <img src={`https://i.ytimg.com/vi/${n.video}/mqdefault.jpg`} alt="" className="size-full object-cover" loading="lazy" />
                  ) : null}
                  {n.video && <PlayCircle className="absolute top-1/2 left-1/2 size-7 -translate-1/2 text-white drop-shadow" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link href={`/admin/news/${n.slug}`} className="font-medium text-slate-900 hover:text-[#0057a7]">
                      {n.title}
                    </Link>
                    {!published && <Badge tone="amber">Hidden</Badge>}
                    {!builtin && <Badge tone="violet">Written here</Badge>}
                    {edited && <Badge tone="blue">Edited</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{n.date}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <Link href={`/admin/news/${n.slug}`} className={buttonClass.ghost}>
                    <Pencil className="size-4" /> Edit
                  </Link>
                  <PublishToggle published={published} onToggle={setNewsPublished.bind(null, n.slug)} />
                  {(!builtin || edited) && (
                    <DangerButton
                      className="px-2.5 py-1"
                      label={builtin ? "Reset" : "Delete"}
                      confirmText={builtin ? `Undo all admin changes to “${n.title}”?` : `Delete “${n.title}” permanently?`}
                      onConfirm={deleteNews.bind(null, n.slug)}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
