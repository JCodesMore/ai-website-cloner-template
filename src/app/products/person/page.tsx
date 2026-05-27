import Banner from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { personProducts, newsItems, discussionItems } from "@/lib/data";
import { getPage, paginate, PAGE_SIZE, filterByIk, filterByAdv } from "@/lib/filters";

interface Props {
  searchParams: Promise<{ ik?: string; adv?: string; page?: string }>;
}

const institutionTypes = [
  { label: "全部", value: "", active: true },
  { label: "国有银行", value: "socb" },
  { label: "商业银行", value: "jscb" },
  { label: "消费金融", value: "cfc" },
  { label: "贷款撮合", value: "lmc" },
  { label: "其他", value: "other" },
];

const advantages = [
  { label: "全部", value: "", active: true },
  { label: "极速下款", value: "45" },
  { label: "社保公积金", value: "46" },
  { label: "征信宽松", value: "53" },
  { label: "3-5年", value: "54" },
  { label: "先息后本", value: "55" },
  { label: "线下", value: "61" },
  { label: "消费分期", value: "62" },
];

export default async function PersonPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.ik) params.set("ik", sp.ik);
  if (sp.adv) params.set("adv", sp.adv);
  if (sp.page) params.set("page", sp.page);

  const ik = params.get("ik") || "";
  const adv = params.get("adv") || "";
  const page = getPage(params);

  let filtered = personProducts as (typeof personProducts)[0][];
  filtered = filterByIk(filtered, ik);
  filtered = filterByAdv(filtered, adv, "person");

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
                    <a key={opt.value} href={opt.value ? `/products/person?ik=${opt.value}` : "/products/person"}>
                      <li className={`item ${(!ik && !opt.value) || ik === opt.value ? "active" : ""}`}>{opt.label}</li>
                    </a>
                  ))}
                </ul>
              </div>
              <div className="row">
                <div className="title">产品优势：</div>
                <ul className="list">
                  {advantages.map((opt) => (
                    <a key={opt.value} href={opt.value ? `/products/person?adv=${opt.value}` : "/products/person"}>
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
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref="/products/person" />
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
