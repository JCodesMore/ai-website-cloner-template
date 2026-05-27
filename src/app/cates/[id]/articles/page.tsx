import type { NewsItem } from "@/types";
import { industryArticles, discussionArticles, opinionArticles, faqArticles, discussionItems, newsItems } from "@/lib/data";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { getPage, paginate, PAGE_SIZE } from "@/lib/filters";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

const categoryConfig: Record<number, { title: string; description: string; articles: NewsItem[]; totalPages: number }> = {
  91: { title: "行业资讯", description: "汇聚贷款行业最新资讯", articles: industryArticles, totalPages: 19 },
  14: { title: "贷款交流", description: "贷款产品口碑信息实时交流", articles: discussionArticles, totalPages: 22 },
  80: { title: "贷款舆情", description: "及时汇总发布各贷款产品的最新舆情反馈", articles: opinionArticles, totalPages: 6 },
  1: { title: "常见问题", description: "汇总聚合各贷款产品的常见问题", articles: faqArticles, totalPages: 9 },
};

export default async function ArticleCategoryPage(props: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string }> }) {
  const [{ id }, sp] = await Promise.all([props.params, props.searchParams]);
  const categoryId = Number(id);
  const config = categoryConfig[categoryId];

  const params = new URLSearchParams();
  if (sp.page) params.set("page", sp.page);
  const page = getPage(params);

  if (!config) {
    return <div className="ley-page ley-page-list-news"><div className="ley-inner"><h1>页面未找到</h1></div></div>;
  }

  const { items, currentPage, totalPages } = paginate(config.articles, page, PAGE_SIZE);

  return (
    <>
      <div className="ley-breadcrumb">
        <div className="ley-inner">
          <span className="layui-breadcrumb">
            <a href="/">首页</a>
            <a><cite>{config.title}</cite></a>
          </span>
        </div>
      </div>

      <main className="ley-page ley-page-list-news">
        <div className="ley-inner">
          <div className="layui-row layui-col-space16">
            <div className="layui-col-md9">
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                {config.title} — 共 {config.articles.length} 篇
              </p>
              <div className="list-news">
                {items.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={`/cates/${categoryId}/articles`} />
              )}
            </div>
            <div className="layui-col-md3">
              <Sidebar newsItems={newsItems} discussionItems={discussionItems} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
