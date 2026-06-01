import Banner from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { comments } from "@/lib/data";
import type { Product, NewsItem } from "@/types";
import type { ReactNode } from "react";

interface ProductListPageProps {
  title: string;
  baseHref: string;
  products: Product[];
  currentPage: number;
  totalPages: number;
  total: number;
  filterBar?: ReactNode;
  badge?: { text: string; className: string };
  variant?: "fast";
  gridClass?: string;
  sidebar: {
    newsItems: NewsItem[];
    discussionItems: NewsItem[];
    opinionItems: NewsItem[];
    faqItems: NewsItem[];
  };
}

export default function ProductListPage({
  title,
  baseHref,
  products,
  currentPage,
  totalPages,
  total,
  filterBar,
  badge,
  variant,
  gridClass = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  sidebar,
}: ProductListPageProps) {
  return (
    <>
      <Banner commentCount={comments.length} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              {badge && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                  {badge.text}
                </span>
              )}
            </div>
            {filterBar}
            <div className={filterBar ? "mt-5" : ""}>
              <p className="mb-4 text-sm text-slate-500">共 {total} 个产品</p>
              <div className={gridClass}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} variant={variant} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={baseHref} />
              )}
            </div>
          </div>
          <Sidebar
            newsItems={sidebar.newsItems}
            discussionItems={sidebar.discussionItems}
            opinionItems={sidebar.opinionItems}
            faqItems={sidebar.faqItems}
          />
        </div>
      </div>
    </>
  );
}
