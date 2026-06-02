import Link from "next/link";
import { Package, FileText, Building2, MessageSquare, FileEdit } from "lucide-react";

const cards = [
  { label: "产品管理", desc: "产品 CRUD", href: "/admin/products", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-600" },
  { label: "CRM 客户跟进", desc: "销售跟进", href: "/admin/loans", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  { label: "机构管理", desc: "机构 CRUD", href: "/admin/institutions", color: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  { label: "评论管理", desc: "审核 / 删除", href: "/admin/comments", color: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
  { label: "文章管理", desc: "文章 CRUD", href: "/admin/articles", color: "bg-violet-50 text-violet-600", dot: "bg-violet-500" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">管理后台</h1>
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
