import { getAllProducts, getAllInstitutions, getSidebarNews, getSidebarDiscussions, getSidebarOpinions, getSidebarFaq } from "@/lib/repository";
import { getWd, paginate, PAGE_SIZE } from "@/lib/filters";
import Banner from "@/components/Banner";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import Sidebar from "@/components/Sidebar";
import { Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ wd?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = new URLSearchParams();
  if (sp.wd) params.set("wd", sp.wd);
  if (sp.page) params.set("page", sp.page);

  const wd = getWd(params);
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const [allProducts, allInstitutions, newsItems, discussionItems, opinionItems, faqItems] = await Promise.all([
    getAllProducts(),
    getAllInstitutions(),
    getSidebarNews(), getSidebarDiscussions(), getSidebarOpinions(), getSidebarFaq(),
  ]);

  // Build per-product searchable text: product name + institution + matched
  // institution name/fullName/shortName. Single text per product, single check.
  // This avoids the previous three-path OR matching that caused inconsistent results
  // for short search terms (e.g. "工商" matching products via orphaned institution lookups).
  const productSearchText = new Map<number, string>();
  for (const p of allProducts) {
    const parts = [p.name, p.institution];
    // Find matching institution by substring match. Product institution may be
    // truncated (e.g., "中国邮政储蓄银行" vs "中国邮政储蓄银行股份有限公司").
    // Use includes() in both directions: (institution field contains product inst)
    // OR (product inst contains institution field — catches abbreviation matches).
    // IMPORTANT: empty strings always match includes(""), so filter them out first.
    const pInst = p.institution.toLowerCase();
    const inst = allInstitutions.find((i) => {
      const instName = i.name.toLowerCase();
      const instFull = (i.fullName || "").toLowerCase();
      const instShort = ((i as any).shortName || "").toLowerCase();
      return (instName && instName.includes(pInst)) || (instName && pInst.includes(instName))
          || (instFull && instFull.includes(pInst)) || (instFull && pInst.includes(instFull))
          || (instShort && instShort.includes(pInst)) || (instShort && pInst.includes(instShort));
    });
    if (inst) {
      // fullName may contain scraped boilerplate like "统一社会信用代码：..." or
      // "（依据工商登记信息）" — strip that noise before adding to search text
      const cleanFull = (inst.fullName || "").replace(/[（(]?(统一社会信用代码|依据).*/g, "").trim();
      if (cleanFull) parts.push(cleanFull);
      if ((inst as any).shortName) parts.push((inst as any).shortName);
    }
    productSearchText.set(p.id, parts.filter(Boolean).join(" ").toLowerCase());
  }

  // Bank abbreviation → full name mapping for fuzzy search
  const BANK_ABBREV: Record<string, string> = {
    "建行": "建设银行", "工行": "工商银行", "农行": "农业银行",
    "中行": "中国银行", "交行": "交通银行", "招行": "招商银行",
    "邮储": "邮政储蓄", "邮政": "邮政储蓄", "华夏": "华夏银行",
    "平安": "平安银行", "民生": "民生银行", "光大": "光大银行",
    "中信": "中信银行", "浦发": "浦发银行", "兴业": "兴业银行",
    "广发": "广发银行", "盛京": "盛京银行",
    "国开行": "国家开发银行", "进出口": "中国进出口银行",
    "农发行": "中国农业发展银行", "汇丰": "汇丰银行",
    "渣打": "渣打银行", "花旗": "花旗银行", "东亚": "东亚银行",
    "恒生": "恒生银行", "大华": "大华银行", "华侨": "华侨银行",
    "天府": "四川天府银行", "新网": "四川新网银行",
    "农商": "农村商业银行", "村镇": "村镇银行",
  };

  function expandQuery(q: string): string[] {
    const terms = [q];
    const ql = q.toLowerCase();
    for (const [abbr, full] of Object.entries(BANK_ABBREV)) {
      if (ql.includes(abbr.toLowerCase())) terms.push(full);
    }
    return terms;
  }

  const filtered = wd
    ? allProducts.filter((p) => {
        const text = productSearchText.get(p.id);
        if (!text) return false;
        const queries = expandQuery(wd);
        return queries.some((q) => text.includes(q.toLowerCase()));
      })
    : [];

  const { items: pageItems, currentPage, totalPages, total } = paginate(filtered, page, PAGE_SIZE);

  return (
    <>
      <Banner />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-lg font-bold text-slate-900">
                {wd ? `搜索"${wd}"的结果` : "请输入搜索关键词"}
              </h2>
              {wd && <p className="mb-4 text-sm text-slate-500">共找到 {total} 个相关产品</p>}

              {!wd && (
                <EmptyState
                  icon={<Search className="h-10 w-10" />}
                  title="请输入搜索关键词"
                  description="搜索产品名称或机构名称，查找贷款产品"
                />
              )}
              {wd && filtered.length === 0 && (
                <EmptyState
                  icon={<Search className="h-10 w-10" />}
                  title={`未找到与"${wd}"相关的产品`}
                  description="请尝试其他关键词"
                  actionHref="/products/fast"
                  actionLabel="浏览全部产品"
                />
              )}

              {pageItems.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {pageItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} baseHref={`/products/search?wd=${encodeURIComponent(wd)}`} />
              )}
            </div>
          </div>
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
        </div>
      </div>
    </>
  );
}
