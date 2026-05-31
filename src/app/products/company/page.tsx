import ProductListPage from "@/components/ProductListPage";
import CompanyFilterBar from "./CompanyFilterBar";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { getProductsByCategory } from "@/lib/repository";
import { getPage, paginate, PAGE_SIZE, filterByIk, filterByTag, filterByAdv } from "@/lib/filters";

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

  let filtered = await getProductsByCategory("company");
  filtered = filterByIk(filtered, ik);
  filtered = filterByTag(filtered, tag);
  filtered = filterByAdv(filtered, adv, "company");

  const { items, currentPage, totalPages, total } = paginate(filtered, page, PAGE_SIZE);

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
    />
  );
}
