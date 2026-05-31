"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import { Search } from "lucide-react";

export default function AdminInstitutionsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    if (search) p.set("search", search);
    fetch(`/api/admin/institutions?${p}`)
      .then((r) => r.json()).then((d) => { setItems(d.items || []); setTotalPages(d.totalPages || 1); setError(""); })
      .catch(() => setError("加载失败")).finally(() => setLoading(false));
  }, [page, search]);

  async function deleteItem(id: number) {
    if (!confirm("确定删除该机构？")) return;
    const res = await fetch(`/api/admin/institutions/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-slate-900">机构管理</h1>
      <div className="mb-4">
        <div className="relative max-w-[250px]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="搜索机构..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-9 w-full rounded-md border border-slate-200 pl-8 pr-3 text-sm outline-none transition-colors duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" />
        </div>
      </div>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">全称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">加载中...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
            ) : (
              items.map((inst: any) => (
                <tr key={inst.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-slate-400">{inst.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{inst.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{inst.fullName || "-"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteItem(inst.id)} className="text-sm text-red-500 hover:underline cursor-pointer">删除</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} baseHref="/admin/institutions" onPage={setPage} />
    </div>
  );
}
