import Banner from "@/components/Banner";
import Pagination from "@/components/Pagination";
import { institutions, newsItems, discussionItems } from "@/lib/data";
import { getPage, paginate, PAGE_SIZE, filterInstitutionsByIk, searchInstitutions, sortInstitutions, getWd } from "@/lib/filters";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface Props {
  searchParams: Promise<{ ik?: string; wd?: string; ob?: string; od?: string; page?: string }>;
}

const institutionTypes = [
  { label: "全部", value: "", active: true },
  { label: "国有银行", value: "socb" },
  { label: "商业银行", value: "jscb" },
  { label: "消费金融", value: "cfc" },
  { label: "贷款撮合", value: "lmc" },
  { label: "其他", value: "other" },
];

export default async function InstitutionsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.ik) params.set("ik", sp.ik);
  if (sp.wd) params.set("wd", sp.wd);
  if (sp.ob) params.set("ob", sp.ob);
  if (sp.od) params.set("od", sp.od);
  if (sp.page) params.set("page", sp.page);

  const ik = params.get("ik") || "";
  const wd = getWd(params);
  const ob = params.get("ob") || "";
  const od = params.get("od") || "";
  const page = getPage(params);

  let filtered = institutions;
  filtered = filterInstitutionsByIk(filtered, ik);
  filtered = searchInstitutions(filtered, wd);
  filtered = sortInstitutions(filtered, ob, od);

  const { items, currentPage, totalPages } = paginate(filtered, page, PAGE_SIZE);

  return (
    <>
      <Banner />
      <div className="ley-inner">
        <div className="layui-row layui-col-space16">
          <div className="layui-col-md9">
            <div className="ley-filter ley-radius org-filter-panel">
              <div className="row">
                <div className="title">机构类型：</div>
                <ul className="list">
                  {institutionTypes.map((opt) => (
                    <a key={opt.value} href={opt.value ? `/institutions?ik=${opt.value}` : "/institutions"}>
                      <li className={`item ${(!ik && !opt.value) || ik === opt.value ? "active" : ""}`}>{opt.label}</li>
                    </a>
                  ))}
                </ul>
              </div>
              <div className="row org-filter-row-order">
                <div className="title">产品排序：</div>
                <ul className="list">
                  <a href={`/institutions?ob=productNum&od=desc${ik ? `&ik=${ik}` : ""}${wd ? `&wd=${encodeURIComponent(wd)}` : ""}`}>
                    <li className={`item ${ob === "productNum" && od === "desc" ? "active" : ""}`}>产品数量最多</li>
                  </a>
                  <a href={`/institutions?ob=productNum&od=asc${ik ? `&ik=${ik}` : ""}${wd ? `&wd=${encodeURIComponent(wd)}` : ""}`}>
                    <li className={`item ${ob === "productNum" && od === "asc" ? "active" : ""}`}>产品数量最少</li>
                  </a>
                </ul>
              </div>
            </div>

            <div className="org-search-section">
              <form action="/institutions" method="get" className="org-search-form">
                {ik && <input type="hidden" name="ik" value={ik} />}
                <input
                  type="text"
                  name="wd"
                  placeholder="输入机构名称或简称进行搜索"
                  className="org-search-input"
                  defaultValue={wd}
                />
                <button type="submit" className="org-search-submit">
                  <i className="layui-icon layui-icon-search"></i>
                </button>
              </form>
            </div>

            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12, padding: "0 4px" }}>
              共 {filtered.length} 个机构
            </p>

            <div className="org-list-container">
              {items.map((inst) => (
                <Link key={inst.id} href={inst.href} className="org-row">
                  <div className="hover-indicator" />
                  <div className="org-logo-wrap">
                    <img src={inst.logo || inst.products[0]?.icon || ""} alt={inst.name} />
                  </div>
                  <div className="org-info">
                    <h3 className="org-name">{inst.name}</h3>
                    {inst.fullName && (
                      <div className="org-full-name">{inst.fullName}</div>
                    )}
                  </div>
                  <div className="org-product-area">
                    <div className="org-product-badges">
                      {inst.products.map((p: any, i) => (
                        <object key={i}>
                          <a href={p.href} className="single-product-badge">
                            {p.icon && <img className="p-icon-img" src={p.icon} alt="" />}
                            <span className="p-name">{p.name}</span>
                          </a>
                        </object>
                      ))}
                    </div>
                  </div>
                  <div className="org-action">
                    <i className="layui-icon layui-icon-right"></i>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="org-pagination-wrap">
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref="/institutions" />
              </div>
            )}
          </div>
          <div className="layui-col-md3">
            <Sidebar newsItems={newsItems} discussionItems={discussionItems} />
          </div>
        </div>
      </div>
    </>
  );
}
