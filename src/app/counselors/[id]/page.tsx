import { notFound } from "next/navigation";
import { getAllCounselors } from "@/lib/repository";
import type { Metadata } from "next";
import { Shield, MessageCircle, Phone } from "lucide-react";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const c = (await getAllCounselors()).find(x => x.id === id);
  return { title: (c?.name || "顾问") + " - 银脉圈", description: c?.bio };
}

export default async function CounselorPage({ params }: Props) {
  const { id } = await params;
  const c = (await getAllCounselors()).find(x => x.id === id);
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-5">
          <img className="h-16 w-16 rounded-full object-cover" src={c.avatar} alt={c.name} />
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{c.name}</h1>
              <span className="text-sm text-slate-500">{c.title}</span>
            </div>
            <div className="mb-3 flex items-center gap-1 text-xs text-emerald-600">
              <Shield className="h-3.5 w-3.5" />
              实名认证
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{c.bio}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">一对一服务</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <MessageCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="mb-1 font-medium text-slate-900">微信咨询</h3>
            <p className="mb-3 text-sm text-slate-500">金融难题随时在线解答</p>
            <button className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-emerald-700 cursor-pointer">查看</button>
          </div>
          <div className="rounded-lg border border-slate-200 p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <Phone className="h-6 w-6 text-slate-700" />
            </div>
            <h3 className="mb-1 font-medium text-slate-900">电话咨询</h3>
            <p className="mb-3 text-sm text-slate-500">电话高效沟通，快速解答疑惑</p>
            <button className="rounded-lg bg-emerald-600 px-4 py-1.5 text-sm text-white transition-colors duration-200 hover:bg-emerald-700 cursor-pointer">查看</button>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">成功案例</h2>
        <ul className="space-y-3">
          {c.cases.map((cs: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <p className="text-sm leading-relaxed text-slate-600">{cs}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
