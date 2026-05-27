import Banner from "@/components/Banner";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { pledgeProducts, newsItems, discussionItems } from "@/lib/data";
import { getPage, paginate, PAGE_SIZE, filterByIk } from "@/lib/filters";

interface Props {
  searchParams: Promise<{ ik?: string; page?: string }>;
}

const institutionTypes = [
  { label: "全部", value: "", active: true },
  { label: "国有银行", value: "socb" },
  { label: "商业银行", value: "jscb" },
  { label: "消费金融", value: "cfc" },
  { label: "贷款撮合", value: "lmc" },
  { label: "其他", value: "other" },
];

export default async function PledgePage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.ik) params.set("ik", sp.ik);
  if (sp.page) params.set("page", sp.page);

  const ik = params.get("ik") || "";
  const page = getPage(params);

  let filtered = pledgeProducts as (typeof pledgeProducts)[0][];
  filtered = filterByIk(filtered, ik);

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
                    <a key={opt.value} href={opt.value ? `/products/pledge?ik=${opt.value}` : "/products/pledge"}>
                      <li className={`item ${(!ik && !opt.value) || ik === opt.value ? "active" : ""}`}>{opt.label}</li>
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
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref="/products/pledge" />
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
