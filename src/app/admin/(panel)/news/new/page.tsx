import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { emptyNews } from "@/components/admin/models";
import { NewsForm } from "@/components/admin/news-form";
import { buttonClass, PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Write article" };

export default function NewNewsPage() {
  return (
    <>
      <Link href="/admin/news" className={`${buttonClass.ghost} mb-3 -ml-2`}>
        <ArrowLeft className="size-4" /> Travel news
      </Link>
      <PageHeader title="Write a travel news article" description="It appears at the top of the News & Offers page once published." />
      <NewsForm initial={emptyNews()} original="" builtin={false} />
    </>
  );
}
