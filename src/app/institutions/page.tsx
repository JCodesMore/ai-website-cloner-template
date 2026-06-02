import Banner from "@/components/Banner";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import InstitutionFilterBar from "./InstitutionFilterBar";
import { getAllInstitutions } from "@/lib/repository";
import { newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import { getPage, paginate, PAGE_SIZE, filterInstitutionsByIk, searchInstitutions, sortInstitutions, getWd } from "@/lib/filters";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { ChevronRight, Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ ik?: string; wd?: string; ob?: string; od?: string; page?: string }>;
}

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

  let filtered = await getAllInstitutions();
  filtered = filterInstitutionsByIk(filtered, ik);
  filtered = searchInstitutions(filtered, wd);
  filtered = sortInstitutions(filtered, ob, od);

  const { items, currentPage, totalPages } = paginate(filtered, page, PAGE_SIZE);

  return (
    <>
      <Banner />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="mb-6 text-xl font-bold text-slate-900">在营机构</h2>
            <InstitutionFilterBar />

            <div className="mt-5">
              <form action="/institutions" method="get" className="mb-4 flex items-center gap-2">
                {ik && <input type="hidden" name="ik" value={ik} />}
                <input
                  type="text"
                  name="wd"
                  placeholder="搜索机构名称"
                  defaultValue={wd}
                  className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
                <button
                  type="submit"
                  className="flex h-10 items-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700 cursor-pointer"
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
                    {(inst.logo || inst.products[0]?.icon) ? (
                      <img
                        src={inst.logo || inst.products[0]?.icon}
                        alt={inst.name}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">
                        {inst.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 transition-colors duration-200 group-hover:text-emerald-600">
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

              {filtered.length === 0 && ik && (
                <EmptyState
                  title="该类型暂未收录机构"
                  description="换个筛选条件试试，或浏览全部机构"
                  actionHref="/institutions"
                  actionLabel="查看全部机构"
                />
              )}

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref="/institutions" />
              )}
            </div>
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
