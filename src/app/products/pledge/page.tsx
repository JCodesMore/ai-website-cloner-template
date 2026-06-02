import ProductListPage from "@/components/ProductListPage";
import PledgeFilterBar from "./PledgeFilterBar";
import { getProductsByCategory, getSidebarNews, getSidebarDiscussions, getSidebarOpinions, getSidebarFaq } from "@/lib/repository";
import { getPage, paginate, PAGE_SIZE, filterByIk } from "@/lib/filters";

interface Props { searchParams: Promise<{ ik?: string; page?: string }> }

export default async function PledgePage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.ik) params.set("ik", sp.ik);
  if (sp.page) params.set("page", sp.page);

  const ik = params.get("ik") || "";
  const page = getPage(params);

  let [filtered, newsItems, discussionItems, opinionItems, faqItems] = await Promise.all([
    getProductsByCategory("pledge"),
    getSidebarNews(),
    getSidebarDiscussions(),
    getSidebarOpinions(),
    getSidebarFaq(),
  ]);
  filtered = filterByIk(filtered, ik);

  const { items, currentPage, totalPages, total } = paginate(filtered, page, PAGE_SIZE);

  const activeParams = new URLSearchParams();
  if (ik) activeParams.set("ik", ik);

  return (
    <ProductListPage
      title="抵押贷款"
      baseHref="/products/pledge"
      products={items}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      filterBar={<PledgeFilterBar />}
      sidebar={{ newsItems, discussionItems, opinionItems, faqItems }}
      searchParams={activeParams.toString()}
    />
  );
}
