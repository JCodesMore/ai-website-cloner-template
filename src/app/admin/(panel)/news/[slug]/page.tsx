import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { newsToDraft } from "@/components/admin/models";
import { NewsForm } from "@/components/admin/news-form";
import { Badge, buttonClass, PageHeader } from "@/components/admin/ui";
import { adminNews } from "@/lib/server/content";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditNewsPage({ params }: PageProps<"/admin/news/[slug]">) {
  const { slug } = await params;
  const entry = adminNews().find((e) => e.item.slug === slug);
  if (!entry) notFound();

  return (
    <>
      <Link href="/admin/news" className={`${buttonClass.ghost} mb-3 -ml-2`}>
        <ArrowLeft className="size-4" /> Travel news
      </Link>
      <PageHeader
        title="Edit article"
        description={
          <span className="inline-flex flex-wrap items-center gap-1.5">
            {entry.builtin ? <Badge>Built-in article</Badge> : <Badge tone="violet">Written here</Badge>}
            {entry.edited && <Badge tone="blue">Edited</Badge>}
            {!entry.published && <Badge tone="amber">Hidden</Badge>}
          </span>
        }
      />
      <NewsForm initial={newsToDraft(entry.item, entry.published)} original={slug} builtin={entry.builtin} />
    </>
  );
}
