"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { Plus, Search } from "lucide-react";

interface Product {
  id: number;
  name: string;
  institution: string;
  category: string;
  maxAmount: string;
  rate: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.items || []);
        setTotalPages(d.totalPages || 1);
        setError("");
      })
      .catch(() => setError("加载失败，请确认数据库已连接"))
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">产品管理</h1>
        <Link href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800">
          <Plus className="h-4 w-4" /> 新增产品
        </Link>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="搜索产品名或机构名..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none transition-colors duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" />
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">产品名</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">机构</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">额度</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">利率</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">加载中...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-slate-400">{p.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.institution}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.maxAmount}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{p.rate}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/admin/products/${p.id}`} className="text-sm text-blue-600 hover:underline">编辑</Link>
                      <button onClick={async () => {
                        if (!confirm("确定删除该产品？")) return;
                        const res = await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
                        if (res.ok) setProducts((prev) => prev.filter((x) => x.id !== p.id));
                      }} className="text-sm text-red-500 hover:underline cursor-pointer">
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} baseHref="/admin/products" onPage={setPage} />
    </div>
  );
}
