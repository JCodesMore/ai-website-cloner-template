import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getArticleById } from "@/lib/repository";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import type { Metadata } from "next";
import { Clock, Eye } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import ArticleTracker from "@/components/ArticleTracker";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(Number(id));
  if (!article) return { title: "文章不存在" };
  return { title: article.title + " - 银脉圈", description: article.title };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(Number(id));
  if (!article) notFound();

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors duration-200">首页</Link>
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
              <ShareButton
                url={`/articles/${id}`}
                title={article.title}
                variant="article"
              />
            </div>
            {article.body ? (
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: article.body }} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-semibold text-slate-400">文章内容即将上线</p>
                <p className="mt-2 text-sm text-slate-400">我们正在准备原创内容，敬请期待</p>
              </div>
            )}
            <ArticleTracker articleId={Number(id)} />
          </div>
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
        </div>
      </div>
    </>
  );
}
