"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ArticleEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [form, setForm] = useState({ title: "", body: "", date: "", viewCount: 0, categoryId: 0 });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/articles/${id}`).then((r) => r.json()).then((d) => {
      if (d.error) { setError(d.error); return; }
      setForm({ title: d.title || "", body: d.body || "", date: d.date || "", viewCount: d.viewCount || 0, categoryId: d.categoryId || 0 });
    }).catch(() => setError("加载失败")).finally(() => setLoading(false));
  }, [id, isNew]);

  async function handleSave() {
    setSaving(true); setError("");
    try {
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${id}`;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      router.push("/admin/articles");
    } catch { setError("网络错误，请重试"); }
    finally { setSaving(false); }
  }

  const inputStyle = { height: 38, borderRadius: 6, border: "1px solid #dcdfe6", padding: "0 10px", fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: "#4b5563", marginBottom: 6, display: "block" as const };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#999" }}>加载中...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Link href="/admin/articles" style={{ color: "#ff5f16", fontSize: 14, textDecoration: "none" }}>← 返回</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{isNew ? "新增文章" : "编辑文章"}</h1>
      </div>
      {error && <div style={{ padding: 12, background: "#fef2f2", borderRadius: 8, color: "#991b1b", fontSize: 13, marginBottom: 16 }}>{error}</div>}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0f0f0", padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
        <div>
          <label style={labelStyle}>标题 *</label>
          <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>日期</label>
          <input style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="2026-05-29" />
        </div>
        <div>
          <label style={labelStyle}>阅读量</label>
          <input style={inputStyle} type="number" value={form.viewCount} onChange={(e) => setForm({ ...form, viewCount: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <label style={labelStyle}>分类 ID</label>
          <select style={inputStyle} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) || 0 })}>
            <option value={0}>—</option>
            <option value={91}>行业资讯</option>
            <option value={14}>贷款交流</option>
            <option value={80}>贷款舆情</option>
            <option value={1}>常见问题</option>
          </select>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>正文 (HTML)</label>
          <textarea style={{ ...inputStyle, height: 400, padding: "10px", fontFamily: "monospace", fontSize: 12, lineHeight: 1.5 }} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </div>
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button className="layui-btn" disabled={saving} onClick={handleSave}
          style={{ height: 40, padding: "0 32px", borderRadius: 8, background: "#ff5f16", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {saving ? "保存中..." : "保存"}
        </button>
        <Link href="/admin/articles" style={{ height: 40, lineHeight: "40px", padding: "0 24px", borderRadius: 8, border: "1px solid #dcdfe6", background: "#fff", color: "#4b5563", fontSize: 14, textDecoration: "none" }}>取消</Link>
      </div>
    </div>
  );
}
