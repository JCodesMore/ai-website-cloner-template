import { getAllProducts } from "@/lib/repository";
import { getWd, paginate, PAGE_SIZE } from "@/lib/filters";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import {
  newsItems, discussionItems, opinionItems, faqItems,
  fastProducts, companyProducts, personProducts, pledgeProducts,
} from "@/lib/data";

interface Props {
  searchParams: Promise<{ wd?: string; page?: string }>;
}

// Build lookup of short institution names from listing JSON (which use
// abbreviations like "北京农商行" vs. DB's full "北京农村商业银行股份有限公司").
// The DB stores scraped full names that may not contain user search terms
// as substrings (e.g., "农商" is NOT a substring of "农村商业银行").
function buildInstAliasMap(): Map<number, string> {
  const map = new Map<number, string>();
  for (const p of [...fastProducts, ...companyProducts, ...personProducts, ...pledgeProducts]) {
    if (!map.has(p.id)) map.set(p.id, p.institution);
  }
  return map;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.wd) params.set("wd", sp.wd);
  if (sp.page) params.set("page", sp.page);

  const wd = getWd(params);
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [allProducts, instAlias] = await Promise.all([
    getAllProducts(),
    buildInstAliasMap(),
  ]);

  const filtered = wd
    ? allProducts.filter(
        (p) => {
          const alias = instAlias.get(p.id);
          const q = wd.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.institution.toLowerCase().includes(q) ||
            (alias && alias.toLowerCase().includes(q))
          );
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

              {!wd && <p className="py-10 text-center text-slate-400">请在搜索框中输入产品名称或机构名称</p>}
              {wd && filtered.length === 0 && (
                <p className="py-10 text-center text-slate-400">未找到与"{wd}"相关的产品，请尝试其他关键词</p>
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
