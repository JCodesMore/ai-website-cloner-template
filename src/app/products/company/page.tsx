import Banner from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { companyProducts, newsItems, discussionItems } from "@/lib/data";
import { getPage, paginate, PAGE_SIZE, filterByIk, filterByTag, filterByAdv } from "@/lib/filters";

interface Props {
  searchParams: Promise<{ ik?: string; tag?: string; adv?: string; page?: string }>;
}

const institutionTypes = [
  { label: "全部", value: "", active: true },
  { label: "国有银行", value: "socb" },
  { label: "商业银行", value: "jscb" },
  { label: "消费金融", value: "cfc" },
  { label: "贷款撮合", value: "lmc" },
  { label: "其他", value: "other" },
];

const tags = [
  { label: "全部", value: "", active: true },
  { label: "专精特新", value: "24" },
  { label: "国高新", value: "25" },
  { label: "科技类", value: "26" },
  { label: "创新类", value: "27" },
  { label: "涉农类", value: "29" },
  { label: "小巨人", value: "37" },
  { label: "专利贷", value: "38" },
];

const advantages = [
  { label: "全部", value: "", active: true },
  { label: "3-5年", value: "35" },
  { label: "国有银行", value: "40" },
  { label: "先息后本", value: "41" },
  { label: "法人不连带", value: "42" },
  { label: "法人不占股", value: "44" },
  { label: "轻视征信", value: "51" },
  { label: "负债高", value: "58" },
  { label: "线下", value: "60" },
];

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

  let filtered = companyProducts as (typeof companyProducts)[0][];
  filtered = filterByIk(filtered, ik);
  filtered = filterByTag(filtered, tag);
  filtered = filterByAdv(filtered, adv, "company");

  const { items, currentPage, totalPages } = paginate(filtered, page, PAGE_SIZE);

  return (
    <>
      <Banner />
      <div className="ley-inner">
        <div className="layui-row layui-col-space16">
          <div className="layui-col-md9">
            <div className="ley-filter ley-radius">
              <div className="row">
                <div className="title">机构类型：</div>
                <ul className="list">
                  {institutionTypes.map((opt) => (
                    <a key={opt.value} href={opt.value ? `/products/company?ik=${opt.value}` : "/products/company"}>
                      <li className={`item ${(!ik && !opt.value) || ik === opt.value ? "active" : ""}`}>{opt.label}</li>
                    </a>
                  ))}
                </ul>
              </div>
              <div className="row">
                <div className="title">企业标签：</div>
                <ul className="list">
                  {tags.map((opt) => (
                    <a key={opt.value} href={opt.value ? `/products/company?tag=${opt.value}` : "/products/company"}>
                      <li className={`item ${(!tag && !opt.value) || tag === opt.value ? "active" : ""}`}>{opt.label}</li>
                    </a>
                  ))}
                </ul>
              </div>
              <div className="row">
                <div className="title">产品优势：</div>
                <ul className="list">
                  {advantages.map((opt) => (
                    <a key={opt.value} href={opt.value ? `/products/company?adv=${opt.value}` : "/products/company"}>
                      <li className={`item ${(!adv && !opt.value) || adv === opt.value ? "active" : ""}`}>{opt.label}</li>
                    </a>
                  ))}
                </ul>
              </div>
            </div>

            <div className="section-table ley-radius">
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                共 {filtered.length} 个产品
              </p>
              <div className="ley-product-list">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref="/products/company" />
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
