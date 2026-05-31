import Banner from "@/components/Banner";
import Pagination from "@/components/Pagination";
import { institutions, newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { getPage, paginate, PAGE_SIZE, filterInstitutionsByIk, searchInstitutions, sortInstitutions, getWd } from "@/lib/filters";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { FilterRow, type FilterOption } from "@/components/FilterRow";
import { ChevronRight, Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ ik?: string; wd?: string; ob?: string; od?: string; page?: string }>;
}

const institutionTypes: FilterOption[] = [
  { label: "全部", value: "" },
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

  const buildHref = (_param: string, val: string) => {
    const p = new URLSearchParams();
    if (val) p.set("ik", val);
    if (wd) p.set("wd", wd);
    const qs = p.toString();
    return qs ? `/institutions?${qs}` : "/institutions";
  };

  return (
    <>
      <Banner />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-5 rounded-lg border border-slate-200 bg-white p-5">
              <FilterRow title="机构类型" param="ik" value={ik} options={institutionTypes} buildHref={buildHref} />

              <div className="flex items-start gap-3">
                <span className="mt-1.5 shrink-0 text-sm text-slate-500">排序</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "产品最多", ob: "productNum", od: "desc" },
                    { label: "产品最少", ob: "productNum", od: "asc" },
                  ].map((sort) => {
                    const active = ob === sort.ob && od === sort.od;
                    const sp = new URLSearchParams();
                    sp.set("ob", sort.ob);
                    sp.set("od", sort.od);
                    if (ik) sp.set("ik", ik);
                    if (wd) sp.set("wd", wd);
                    return (
                      <a
                        key={sort.label}
                        href={`/institutions?${sp}`}
                        className={`rounded-full px-3 py-1.5 text-sm transition-colors duration-200 ${
                          active
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {sort.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <form action="/institutions" method="get" className="mb-4 flex items-center gap-2">
              {ik && <input type="hidden" name="ik" value={ik} />}
              <input
                type="text"
                name="wd"
                placeholder="搜索机构名称"
                defaultValue={wd}
                className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors duration-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20"
              />
              <button
                type="submit"
                className="flex h-10 items-center gap-1.5 rounded-lg bg-yellow-600 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700 cursor-pointer"
              >
                <Search className="h-4 w-4" /> 搜索
              </button>
            </form>

            <p className="mb-4 text-sm text-slate-500">共 {filtered.length} 个机构</p>

            <div className="space-y-3">
              {items.map((inst) => (
                <Link
                  key={inst.id}
                  href={inst.href}
                  className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 transition-shadow duration-200 hover:shadow-md cursor-pointer"
                >
                  <img
                    src={inst.logo || inst.products[0]?.icon || ""}
                    alt={inst.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 transition-colors duration-200 group-hover:text-yellow-600">
                      {inst.name}
                    </h3>
                    {inst.fullName && (
                      <p className="truncate text-sm text-slate-500">{inst.fullName}</p>
                    )}
                  </div>
                  <div className="hidden flex-wrap gap-1.5 sm:flex">
                    {inst.products.slice(0, 4).map((p, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-300" />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} baseHref="/institutions" />
            )}
          </div>
          <Sidebar
            newsItems={newsItems}
            discussionItems={discussionItems}
            opinionItems={opinionItems}
            faqItems={faqItems}
          />
        </div>
      </div>
    </>
  );
}
