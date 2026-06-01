import ProductListPage from "@/components/ProductListPage";
import PersonFilterBar from "./PersonFilterBar";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { getProductsByCategory } from "@/lib/repository";
import { getPage, paginate, PAGE_SIZE, filterByIk, filterByAdv } from "@/lib/filters";

interface Props { searchParams: Promise<{ ik?: string; adv?: string; page?: string }> }

export default async function PersonPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.ik) params.set("ik", sp.ik);
  if (sp.adv) params.set("adv", sp.adv);
  if (sp.page) params.set("page", sp.page);

  const ik = params.get("ik") || "";
  const adv = params.get("adv") || "";
  const page = getPage(params);

  let filtered = await getProductsByCategory("person");
  filtered = filterByIk(filtered, ik);
  filtered = filterByAdv(filtered, adv, "person");

  const { items, currentPage, totalPages, total } = paginate(filtered, page, PAGE_SIZE);

  const activeParams = new URLSearchParams();
  if (ik) activeParams.set("ik", ik);
  if (adv) activeParams.set("adv", adv);

  return (
    <ProductListPage
      title="个人贷款"
      baseHref="/products/person"
      products={items}
      currentPage={currentPage}
      totalPages={totalPages}
      total={total}
      filterBar={<PersonFilterBar />}
      sidebar={{ newsItems, discussionItems, opinionItems, faqItems }}
      searchParams={activeParams.toString()}
    />
  );
}
