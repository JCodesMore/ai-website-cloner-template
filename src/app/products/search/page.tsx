import { fastProducts, companyProducts, personProducts, pledgeProducts } from "@/lib/data";
import { getWd, paginate, PAGE_SIZE } from "@/lib/filters";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { newsItems, discussionItems } from "@/lib/data";

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

  const allProducts = [
    ...fastProducts.map((p) => ({ ...p, _category: "fast" as const })),
    ...companyProducts.map((p) => ({ ...p, _category: "company" as const })),
    ...personProducts.map((p) => ({ ...p, _category: "person" as const })),
    ...pledgeProducts.map((p) => ({ ...p, _category: "pledge" as const })),
  ];

  const filtered = wd
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(wd.toLowerCase()) ||
          p.institution.toLowerCase().includes(wd.toLowerCase()),
      )
    : [];

  const { items: pageItems, currentPage, totalPages, total } = paginate(filtered, page, PAGE_SIZE);

  return (
    <>
      <Banner />
      <div className="ley-inner">
        <div className="layui-row layui-col-space16">
          <div className="layui-col-md9">
            <div className="section-table ley-radius" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px", color: "#111827" }}>
                {wd ? `搜索"${wd}"的结果` : "请输入搜索关键词"}
              </h2>
              {wd && (
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>
                  共找到 {total} 个相关产品
                </p>
              )}

              {!wd && (
                <p style={{ fontSize: 14, color: "#9ca3af", padding: "40px 0", textAlign: "center" }}>
                  请在搜索框中输入产品名称或机构名称
                </p>
              )}

              {wd && filtered.length === 0 && (
                <p style={{ fontSize: 14, color: "#9ca3af", padding: "40px 0", textAlign: "center" }}>
                  未找到与"{wd}"相关的产品，请尝试其他关键词
                </p>
              )}

              {pageItems.length > 0 && (
                <div className="ley-product-list" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                  {pageItems.map((product) => (
                    <ProductCard key={`${product._category}-${product.id}`} product={product} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseHref={`/products/search?wd=${encodeURIComponent(wd)}`}
                />
              )}
            </div>
          </div>
          <div className="layui-col-md3">
            <Sidebar newsItems={newsItems} discussionItems={discussionItems} />
          </div>
        </div>
      </div>
    </>
  );
}
