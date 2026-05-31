import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { institutionDetails, newsItems, discussionItems, opinionItems, faqItems } from "@/lib/data";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const inst = institutionDetails.find(x => x.id === id);
  return { title: (inst?.name || "机构") + " - 银脉圈", description: inst?.fullName };
}

export default async function InstitutionDetailPage({ params }: Props) {
  const { id } = await params;
  const inst = institutionDetails.find(x => x.id === id);
  if (!inst) notFound();

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors duration-200">首页</Link>
          <span className="mx-2">/</span>
          <Link href="/institutions" className="hover:text-blue-600 transition-colors duration-200">机构产品</Link>
          <span className="mx-2">/</span>
          <span>{inst.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="flex items-start gap-5 rounded-lg border border-slate-200 bg-white p-6">
              <img src={inst.logo} alt={inst.name} className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 object-cover" />
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-900">{inst.fullName}</h1>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{inst.name}</span>
                </div>
                <a href={"http://" + inst.website} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
                  <ExternalLink className="h-3.5 w-3.5" /> 访问官网
                </a>
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
                {inst.products.map((p: any, i: number) => (
                  <Link key={i} href={p.href} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 transition-colors duration-200 hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      {p.icon && <img src={p.icon} alt="" className="h-5 w-5 rounded-full" />}
                      <span className="text-sm font-medium text-slate-900">{p.name}</span>
                    </div>
                    <span className="text-xs text-blue-600">查看详情</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Sidebar newsItems={newsItems} discussionItems={discussionItems} opinionItems={opinionItems} faqItems={faqItems} />
        </div>
      </div>
    </>
  );
}
