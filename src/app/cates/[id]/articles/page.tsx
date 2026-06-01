import type { NewsItem } from "@/types";
import { getArticlesByCategory } from "@/lib/repository";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { getPage, paginate, PAGE_SIZE } from "@/lib/filters";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

const categoryMeta: Record<number, { title: string; description: string }> = {
  91: { title: "行业资讯", description: "汇聚贷款行业最新资讯" },
  14: { title: "贷款交流", description: "贷款产品口碑信息实时交流" },
  80: { title: "贷款舆情", description: "及时汇总发布各贷款产品的最新舆情反馈" },
  1: { title: "常见问题", description: "汇总聚合各贷款产品的常见问题" },
};

export default async function ArticleCategoryPage(props: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string }> }) {
  const [{ id }, sp] = await Promise.all([props.params, props.searchParams]);
  const categoryId = Number(id);
  const meta = categoryMeta[categoryId];

  const params = new URLSearchParams();
  if (sp.page) params.set("page", sp.page);
  const page = getPage(params);

  if (!meta) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 text-center text-slate-500">
        <h1 className="text-xl font-bold text-slate-900">页面未找到</h1>
      </div>
    );
  }

  const articles = await getArticlesByCategory(categoryId);
  const { items, currentPage, totalPages } = paginate(articles, page, PAGE_SIZE);

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-yellow-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <span>{meta.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{meta.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
            <p className="mb-4 mt-2 text-sm text-slate-400">共 {articles.length} 篇</p>
            {articles.length === 0 ? (
              <EmptyState title="暂无文章" description="该分类下还没有文章，请稍后再来" actionHref="/" actionLabel="返回首页" />
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={`/cates/${categoryId}/articles`} />
                )}
              </>
            )}
          </div>
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
        </div>
      </div>
    </>
  );
}
