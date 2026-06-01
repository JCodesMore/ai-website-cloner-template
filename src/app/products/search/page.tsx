import { getAllProducts, getAllInstitutions } from "@/lib/repository";
import { getWd, paginate, PAGE_SIZE } from "@/lib/filters";
import Banner from "@/components/Banner";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ wd?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.wd) params.set("wd", sp.wd);
  if (sp.page) params.set("page", sp.page);

  const wd = getWd(params);
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [allProducts, allInstitutions] = await Promise.all([
    getAllProducts(),
    getAllInstitutions(),
  ]);

  // Build institution search lookup: institution name → combined searchable text
  // Keyed by name (not id) because product.institution holds the name string,
  // and product ID != institution ID (they're different tables with overlapping IDs).
  const instSearch = new Map<string, string>();
  for (const inst of allInstitutions) {
    const text = [inst.name, inst.fullName, (inst as any).shortName || ""]
      .filter(Boolean).join(" ").toLowerCase();
    instSearch.set(inst.name.toLowerCase(), text);
    // Also index by shortName and fullName so products with any variant can match
    if (inst.fullName) instSearch.set(inst.fullName.toLowerCase(), text);
    if ((inst as any).shortName) instSearch.set((inst as any).shortName.toLowerCase(), text);
  }

  const filtered = wd
    ? allProducts.filter(
        (p) => {
          const q = wd.toLowerCase();
          if (p.name.toLowerCase().includes(q)) return true;
          if (p.institution.toLowerCase().includes(q)) return true;
          let instText = instSearch.get(p.institution.toLowerCase());
          // Fallback: product's institution name may not exactly match any institution
          // name/fullName/shortName (e.g., product has "中国邮政储蓄银行" but institution
          // has "中国邮政储蓄银行股份有限公司"). Try to find via substring match.
          if (!instText) {
            for (const [key, text] of instSearch) {
              if (key.includes(p.institution.toLowerCase()) || p.institution.toLowerCase().includes(key)) {
                instText = text;
                instSearch.set(p.institution.toLowerCase(), text); // cache for next lookup
                break;
              }
            }
          }
          return instText ? instText.includes(q) : false;
        },
      )
    : [];

  const { items: pageItems, currentPage, totalPages, total } = paginate(filtered, page, PAGE_SIZE);

  return (
    <>
      <Banner />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-bold text-slate-900">
                {wd ? `搜索"${wd}"的结果` : "请输入搜索关键词"}
              </h2>
              {wd && <p className="mb-4 text-sm text-slate-500">共找到 {total} 个相关产品</p>}

              {!wd && (
                <EmptyState
                  icon={<Search className="h-10 w-10" />}
                  title="请输入搜索关键词"
                  description="搜索产品名称或机构名称，查找贷款产品"
                />
              )}
              {wd && filtered.length === 0 && (
                <EmptyState
                  icon={<Search className="h-10 w-10" />}
                  title={`未找到与"${wd}"相关的产品`}
                  description="请尝试其他关键词"
                  actionHref="/products/fast"
                  actionLabel="浏览全部产品"
                />
              )}

              {pageItems.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {pageItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={`/products/search?wd=${encodeURIComponent(wd)}`} />
              )}
            </div>
          </div>
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
        </div>
      </div>
    </>
  );
}
