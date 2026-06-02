"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";

export default function AdminUsersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users?page=${page}`)
      .then(r => r.json()).then(d => { setItems(d.items || []); setTotalPages(d.totalPages || 1); setTotal(d.total || 0); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">用户管理</h1>
        <span className="text-sm text-slate-500">共 {total} 人</span>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">用户名</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">手机号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">角色</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">加载中...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
            ) : (
              items.map((u: any) => (
                <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-slate-400">{u.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{u.username}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{u.phone || "未绑定"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${u.role === "admin" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {u.role === "admin" ? "管理员" : "用户"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-400">{u.createdAt ? new Date(u.createdAt).toLocaleString("zh-CN") : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} baseHref="/admin/users" onPage={setPage} />
    </div>
  );
}
