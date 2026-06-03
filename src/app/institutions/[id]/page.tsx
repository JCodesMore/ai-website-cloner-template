import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getInstitutionById, getSidebarNews, getSidebarDiscussions, getSidebarOpinions, getSidebarFaq } from "@/lib/repository";
import type { Metadata } from "next";
import { ExternalLink, ChevronRight } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import FollowButton from "@/components/FollowButton";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const inst = await getInstitutionById(id);
  return { title: (inst?.name || "机构") + " - 银脉圈", description: inst?.fullName };
}

export default async function InstitutionDetailPage({ params }: Props) {
  const { id } = await params;
  const [inst, newsItems, discussionItems, opinionItems, faqItems] = await Promise.all([
    getInstitutionById(id),
    getSidebarNews(), getSidebarDiscussions(), getSidebarOpinions(), getSidebarFaq(),
  ]);
  if (!inst) notFound();

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/institutions" className="hover:text-emerald-600 transition-colors duration-200">机构产品</Link>
          <span className="mx-2">/</span>
          <span>{inst.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="flex items-start gap-5 rounded-lg border border-slate-200 bg-white p-6">
              {inst.logo ? (
                <img src={inst.logo} alt={inst.name} className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 object-cover" />
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 text-lg font-bold">
                  {inst.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-900">{inst.fullName}</h1>
                  <ShareButton url={`/institutions/${id}`} title={inst.fullName} variant="product" />
                  <FollowButton institutionId={id} />
                </div>
                {inst.website && (
                  <a href={"http://" + inst.website} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> 访问官网
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2.5 text-lg font-semibold text-slate-900">
                <span className="block h-4 w-1 rounded-full bg-slate-900" />
                机构介绍
              </h2>
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600" dangerouslySetInnerHTML={{ __html: inst.introHtml }} />
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h2 className="mb-4 flex items-center gap-2.5 text-lg font-semibold text-slate-900">
                <span className="block h-4 w-1 rounded-full bg-emerald-600" />
                在营产品
                <span className="text-sm font-normal text-slate-400">共 {inst.products.length} 款</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {inst.products.map((p, i) => {
                  return (
                    <Link
                      key={i}
                      href={p.href}
                      className="group flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-shadow duration-200 hover:shadow-md cursor-pointer"
                    >
                      {p.icon ? (
                        <img src={p.icon} alt="" className="mt-0.5 h-8 w-8 shrink-0 rounded-lg object-cover" />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1.5 text-sm font-semibold text-slate-900 transition-colors duration-200 group-hover:text-emerald-600">
                          {p.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          <div className="text-xs text-slate-400">最高额度</div>
                          <div className="text-xs text-slate-400">参考利率</div>
                          <div className="text-xs font-medium text-slate-700">{p.maxAmount}</div>
                          <div className="text-xs font-medium text-slate-700">{p.rate}</div>
                          <div className="text-xs text-slate-400 mt-1">还款期限</div>
                          <div className="text-xs text-slate-400 mt-1">还款方式</div>
                          <div className="text-xs font-medium text-slate-700">{p.term}</div>
                          <div className="text-xs font-medium text-slate-700">{p.repayment}</div>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                          查看详情 <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
        </div>
      </div>
    </>
  );
}
