import ProductListPage from "@/components/ProductListPage";
import CompanyFilterBar from "./CompanyFilterBar";
import { getProductsByCategory, getSidebarNews, getSidebarDiscussions, getSidebarOpinions, getSidebarFaq } from "@/lib/repository";
import { getPage, paginate, PAGE_SIZE, filterByIk, filterByTag, filterByAdv, filterByTagAndAdv } from "@/lib/filters";

interface Props { searchParams: Promise<{ ik?: string; tag?: string; adv?: string; page?: string }> }

export default async function CompanyPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.ik) params.set("ik", sp.ik);
  if (sp.tag) params.set("tag", sp.tag);
  if (sp.adv) params.set("adv", sp.adv);
  if (sp.page) params.set("page", sp.page);

  const ik = params.get("ik") || "";
  const tag = params.get("tag") || "";
  const adv = params.get("adv") || "";
  const page = getPage(params);

  let [filtered, newsItems, discussionItems, opinionItems, faqItems] = await Promise.all([
    getProductsByCategory("company"),
    getSidebarNews(),
    getSidebarDiscussions(),
    getSidebarOpinions(),
    getSidebarFaq(),
  ]);
  filtered = filterByIk(filtered, ik);
  if (tag && adv) {
    filtered = filterByTagAndAdv(filtered, tag, adv, "company");
  } else {
    filtered = filterByTag(filtered, tag);
    filtered = filterByAdv(filtered, adv, "company");
  }

  const { items, currentPage, totalPages, total } = paginate(filtered, page, PAGE_SIZE);

  const activeParams = new URLSearchParams();
  if (ik) activeParams.set("ik", ik);
  if (tag) activeParams.set("tag", tag);
  if (adv) activeParams.set("adv", adv);

  return (
    <ProductListPage
      title="企业贷款"
      baseHref="/products/company"
      products={items}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      filterBar={<CompanyFilterBar />}
      sidebar={{ newsItems, discussionItems, opinionItems, faqItems }}
      searchParams={activeParams.toString()}
    />
  );
}
