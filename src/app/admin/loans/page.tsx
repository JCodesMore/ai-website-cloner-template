"use client";

import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import { Search, Download } from "lucide-react";

const STATUSES = [
  { value: "new", label: "待联系", color: "text-emerald-700", bg: "bg-emerald-50" },
  { value: "contacted", label: "已联系", color: "text-emerald-700", bg: "bg-emerald-50" },
  { value: "followup", label: "跟进中", color: "text-violet-700", bg: "bg-violet-50" },
  { value: "done", label: "已成交", color: "text-emerald-700", bg: "bg-emerald-50" },
  { value: "rejected", label: "已拒绝", color: "text-slate-600", bg: "bg-slate-100" },
];

export default function AdminLoansPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({ status: "", search: "" });
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page) });
    for (const [k, v] of Object.entries(filters)) {
      if (v) p.set(k, v);
    }
    fetch(`/api/admin/loans?${p}`)
      .then((r) => r.json()).then((d) => { setItems(d.items || []); setTotalPages(d.totalPages || 1); })
      .finally(() => setLoading(false));
  }, [page, filters]);

  async function updateStatus(id: number, status: string) {
    const res = await fetch(`/api/admin/loans/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    if (res.ok) setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  async function saveNote(id: number) {
    const res = await fetch(`/api/admin/loans/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes: noteText }),
    });
    if (res.ok) setItems((prev) => prev.map((x) => (x.id === id ? { ...x, notes: noteText } : x)));
    setEditingNote(null);
    setNoteText("");
  }

  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-slate-900">CRM · 客户跟进</h1>

      <div className="mb-4 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative max-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="搜索手机号..." value={filters.search}
              onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
              className="h-9 w-full rounded-md border border-slate-200 pl-8 pr-3 text-sm outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
          </div>
          <select value={filters.status} onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
            className="h-9 rounded-md border border-slate-200 px-2 text-sm outline-none">
            <option value="">全部状态</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input type="text" placeholder="城市" value={filters.city || ""}
            onChange={(e) => { setFilters({ ...filters, city: e.target.value }); setPage(1); }}
            className="h-9 w-20 rounded-md border border-slate-200 px-2 text-sm outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
          <input type="text" placeholder="用途" value={filters.purpose || ""}
            onChange={(e) => { setFilters({ ...filters, purpose: e.target.value }); setPage(1); }}
            className="h-9 w-20 rounded-md border border-slate-200 px-2 text-sm outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
          <input type="date" value={filters.dateFrom || ""}
            onChange={(e) => { setFilters({ ...filters, dateFrom: e.target.value }); setPage(1); }}
            className="h-9 rounded-md border border-slate-200 px-2 text-sm outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
          <span className="text-xs text-slate-400">至</span>
          <input type="date" value={filters.dateTo || ""}
            onChange={(e) => { setFilters({ ...filters, dateTo: e.target.value }); setPage(1); }}
            className="h-9 rounded-md border border-slate-200 px-2 text-sm outline-none transition-colors duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20" />
          <a href={`/api/admin/loans/export?${new URLSearchParams(filters as any).toString()}`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            <Download className="h-3.5 w-3.5" />导出CSV
          </a>
        </div>
        <div className="text-sm text-slate-500">共 {items.length} 条记录</div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">类型</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">称呼</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">手机号</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">金额</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">用途</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">城市</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">跟进备注</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-slate-400">加载中...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-slate-400">暂无数据</td></tr>
            ) : (
              items.map((a) => {
                const status = STATUSES.find((s) => s.value === a.status) || STATUSES[0];
                return (
                  <tr key={a.id} className={`border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors duration-150 ${a.status === "new" ? "bg-emerald-50/30" : ""}`}>
                    <td className="px-3 py-3 text-sm text-slate-400">{a.id}</td>
                    <td className="px-3 py-3 text-sm text-slate-600">{a.loanType === "company" ? "企业" : "个人"}</td>
                    <td className="px-3 py-3 text-sm text-slate-600">{a.customerName || "-"}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-emerald-600">{a.phone}</td>
                    <td className="px-3 py-3 text-sm text-slate-600">{a.amount}</td>
                    <td className="px-3 py-3 text-sm text-slate-600">{a.customerPurpose || "-"}</td>
                    <td className="px-3 py-3 text-sm text-slate-600">{a.customerCity || "-"}</td>
                    <td className="px-3 py-3">
                      <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)}
                        className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold border-0 outline-none ${status.bg} ${status.color}`}>
                        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="max-w-[220px] px-3 py-2">
                      {editingNote === a.id ? (
                        <div className="flex gap-1">
                          <input autoFocus value={noteText} onChange={(e) => setNoteText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveNote(a.id); if (e.key === "Escape") setEditingNote(null); }}
                            className="h-8 flex-1 rounded border border-slate-200 px-2 text-xs outline-none focus:border-emerald-600" />
                          <button onClick={() => saveNote(a.id)}
                            className="rounded bg-slate-900 px-2 text-xs text-white transition-colors duration-200 hover:bg-slate-800 cursor-pointer">保存</button>
                        </div>
                      ) : (
                        <div onClick={() => { setEditingNote(a.id); setNoteText(a.notes || ""); }}
                          className={`cursor-pointer min-h-[20px] rounded px-1 py-0.5 text-xs leading-5 transition-colors duration-150 hover:bg-slate-100 ${a.notes ? "text-slate-700" : "text-slate-300"}`}
                          title="点击编辑备注">
                          {a.notes || "点击添加备注..."}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap text-slate-400">
                      {a.createdAt ? new Date(a.createdAt).toLocaleString("zh-CN").replace(/\//g, "-") : "-"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} baseHref="/admin/loans" onPage={setPage} />
    </div>
  );
}
