import ProductListPage from "@/components/ProductListPage";
import { getProductsByCategory, getSidebarNews, getSidebarDiscussions, getSidebarOpinions, getSidebarFaq } from "@/lib/repository";
import { getPage, paginate, PAGE_SIZE_FAST } from "@/lib/filters";

interface Props { searchParams: Promise<{ page?: string }> }

export default async function FastPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.page) params.set("page", sp.page);
  const page = getPage(params);
  const [products, newsItems, discussionItems, opinionItems, faqItems] = await Promise.all([
    getProductsByCategory("fast"),
    getSidebarNews(),
    getSidebarDiscussions(),
    getSidebarOpinions(),
    getSidebarFaq(),
  ]);
  const { items, currentPage, totalPages, total } = paginate(products, page, PAGE_SIZE_FAST);

  return (
    <ProductListPage
      title="极速贷款"
      baseHref="/products/fast"
      products={items}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      variant="fast"
      gridClass="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      badge={{ text: "最快5分钟即可下款", className: "bg-emerald-50 text-emerald-700" }}
      sidebar={{ newsItems, discussionItems, opinionItems, faqItems }}
    />
  );
}
