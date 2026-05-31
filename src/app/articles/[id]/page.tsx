import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { articleDetails, newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import type { Metadata } from "next";
import { Clock, Eye, Share2 } from "lucide-react";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = articleDetails.find((a) => a.id === Number(id));
  if (!article) return { title: "文章不存在" };
  return { title: article.title + " - 银脉圈", description: article.title };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = articleDetails.find((a) => a.id === Number(id));
  if (!article) notFound();

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <span>文章详情</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8">
            <h1 className="mb-4 text-2xl font-bold text-slate-900">{article.title}</h1>
            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.date}</span>
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {article.viewCount} 阅读</span>
              <button className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-slate-500 transition-colors duration-200 hover:bg-slate-50 cursor-pointer">
                <Share2 className="h-3.5 w-3.5" /> 分享
              </button>
            </div>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: article.body }} />
          </div>
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
        </div>
      </div>
    </>
  );
}
