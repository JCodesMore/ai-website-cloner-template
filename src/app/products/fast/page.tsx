import Banner from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { fastProducts, newsItems, discussionItems } from "@/lib/data";
import { getPage, paginate, PAGE_SIZE_FAST } from "@/lib/filters";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function FastPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.page) params.set("page", sp.page);

  const page = getPage(params);
  const { items, currentPage, totalPages } = paginate(fastProducts, page, PAGE_SIZE_FAST);

  return (
    <>
      <Banner />
      <div className="ley-inner">
        <div className="layui-row layui-col-space16">
          <div className="layui-col-md9">
            <div className="section-table ley-radius section-table-fast">
              <div className="fast-section-head">
                <div className="fast-section-title-group">
                  <h2 className="fast-section-title">极速贷款</h2>
                  <span className="fast-section-subtitle">最快5分钟即可下款</span>
                </div>
              </div>
              <div className="ley-product-list ley-product-list-fast">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} variant="fast" />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref="/products/fast" />
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
