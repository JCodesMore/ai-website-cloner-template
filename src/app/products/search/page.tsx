import { getAllProducts, getAllInstitutions } from "@/lib/repository";
import { getWd, paginate, PAGE_SIZE } from "@/lib/filters";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";

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

  // Build institution search lookup: id → combined searchable text
  const instSearch = new Map<number, string>();
  for (const inst of allInstitutions) {
    instSearch.set(inst.id, [
      inst.name,
      inst.fullName,
      (inst as any).shortName || "",
    ].filter(Boolean).join(" ").toLowerCase());
  }

  const filtered = wd
    ? allProducts.filter(
        (p) => {
          const q = wd.toLowerCase();
          if (p.name.toLowerCase().includes(q)) return true;
          if (p.institution.toLowerCase().includes(q)) return true;
          const instText = instSearch.get(p.id);
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

              {!wd && <p className="py-10 text-center text-slate-400">请在搜索框中输入产品名称或机构名称</p>}
              {wd && filtered.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-slate-400">未找到与"{wd}"相关的产品，请尝试其他关键词</p>
                  <a href="/products/fast" className="mt-3 inline-block text-sm text-yellow-600 hover:underline">
                    浏览全部产品
                  </a>
                </div>
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
