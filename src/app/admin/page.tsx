"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Users, Phone, CheckCircle } from "lucide-react";

const cards = [
  { label: "产品管理", desc: "产品 CRUD", href: "/admin/products", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-600" },
  { label: "CRM 客户跟进", desc: "销售跟进", href: "/admin/loans", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  { label: "机构管理", desc: "机构 CRUD", href: "/admin/institutions", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  { label: "评论管理", desc: "审核 / 删除", href: "/admin/comments", color: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
  { label: "文章管理", desc: "文章 CRUD", href: "/admin/articles", color: "bg-violet-50 text-violet-600", dot: "bg-violet-500" },
];

const STATUS_LABELS: Record<string, string> = { new: "待联系", contacted: "已联系", followup: "跟进中", done: "已成交", rejected: "已拒绝" };
const STATUS_COLORS: Record<string, string> = {
  new: "bg-emerald-500", contacted: "bg-blue-500", followup: "bg-violet-500", done: "bg-emerald-700", rejected: "bg-slate-400",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(d => { if (!d.error) setStats(d); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">管理后台</h1>

      {/* Quick stats */}
      {loading ? (
        <div className="mb-6 text-sm text-slate-400">加载数据...</div>
      ) : stats ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Phone className="h-5 w-5" />} label="今日新增" value={stats.today} color="bg-emerald-50 text-emerald-700" />
          <StatCard icon={<Users className="h-5 w-5" />} label="总申请数" value={stats.total} color="bg-blue-50 text-blue-700" />
          <StatCard icon={<CheckCircle className="h-5 w-5" />} label="已成交" value={stats.statusDist?.find((s: any) => s.status === "done")?.count || 0} color="bg-violet-50 text-violet-700" />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="跟进中" value={stats.statusDist?.find((s: any) => s.status === "followup")?.count || 0} color="bg-amber-50 text-amber-700" />
        </div>
      ) : null}

      {/* 7-day trend chart */}
      {stats?.trend?.length > 0 && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">近7天申请趋势</h3>
          <div className="flex items-end gap-2" style={{ height: 120 }}>
            {stats.trend.map((d: any, i: number) => {
              const maxCount = Math.max(...stats.trend.map((x: any) => x.count), 1);
              const height = (d.count / maxCount) * 100;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-medium text-slate-600">{d.count}</span>
                  <div className="w-full rounded-t bg-emerald-500 transition-all" style={{ height: `${Math.max(height, 4)}%` }} />
                  <span className="text-xs text-slate-400">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status distribution */}
      {stats?.statusDist?.length > 0 && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">状态分布</h3>
          <div className="flex h-6 overflow-hidden rounded-full">
            {stats.statusDist.map((s: any) => {
              const pct = stats.total > 0 ? (s.count / stats.total) * 100 : 0;
              return (
                <div
                  key={s.status}
                  className={`${STATUS_COLORS[s.status] || "bg-slate-300"} transition-all`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                  title={`${STATUS_LABELS[s.status] || s.status}: ${s.count}`}
                />
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            {stats.statusDist.map((s: any) => (
              <span key={s.status} className="flex items-center gap-1.5">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_COLORS[s.status] || "bg-slate-300"}`} />
                {STATUS_LABELS[s.status] || s.status}: {s.count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nav cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}
            className="group rounded-lg border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
              <span className={`h-3 w-3 rounded ${card.dot}`} />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors duration-200">{card.label}</h3>
            <p className="text-xs text-slate-400">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
