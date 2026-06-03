"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [form, setForm] = useState({
    name: "", institution: "", institutionFullName: "", institutionHref: "",
    category: "person", maxAmount: "", term: "", rate: "", repayment: "",
    advantages: "", summary: "", introHtml: "", image: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setForm({
          name: d.name || "",
          institution: d.institution || "",
          institutionFullName: d.institutionFullName || "",
          institutionHref: d.institutionHref || "",
          category: d.category || "person",
          maxAmount: d.maxAmount || "",
          term: d.term || "",
          rate: d.rate || "",
          repayment: d.repayment || "",
          advantages: (d.advantages || []).join(", "),
          summary: d.summary || "",
          introHtml: d.introHtml || "",
          image: d.image || "",
        });
      })
      .catch(() => setError("加载失败"))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const advs = form.advantages.split(",").map((s) => s.trim()).filter(Boolean);
      const body = { ...form, advantages: advs };
      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/admin/products" : `/api/admin/products/${id}`;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      router.push("/admin/products");
    } catch { setError("网络错误，请重试"); }
    finally { setSaving(false); }
  }

  const inputStyle = { height: 38, borderRadius: 6, border: "1px solid #dcdfe6", padding: "0 10px", fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: "#4b5563", marginBottom: 6, display: "block" };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#999" }}>加载中...</div>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Link href="/admin/products" style={{ color: "#ff5f16", fontSize: 14, textDecoration: "none" }}>← 返回</Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{isNew ? "新增产品" : "编辑产品"}</h1>
      </div>

      {error && <div style={{ padding: 12, background: "#fef2f2", borderRadius: 8, color: "#991b1b", fontSize: 13, marginBottom: 16 }}>{error}</div>}

      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #f0f0f0", padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
        <div>
          <label style={labelStyle}>产品名称 *</label>
          <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>所属机构</label>
          <input style={inputStyle} value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>机构全称</label>
          <input style={inputStyle} value={form.institutionFullName} onChange={(e) => setForm({ ...form, institutionFullName: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>机构链接</label>
          <input style={inputStyle} value={form.institutionHref} onChange={(e) => setForm({ ...form, institutionHref: e.target.value })} placeholder="/institutions/1" />
        </div>
        <div>
          <label style={labelStyle}>分类</label>
          <select style={inputStyle} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="fast">极速贷款</option>
            <option value="company">企业贷款</option>
            <option value="person">个人贷款</option>
            <option value="pledge">抵押贷款</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>最高额度</label>
          <input style={inputStyle} value={form.maxAmount} onChange={(e) => setForm({ ...form, maxAmount: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>贷款期限</label>
          <input style={inputStyle} value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>贷款利率</label>
          <input style={inputStyle} value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>还款方式</label>
          <input style={inputStyle} value={form.repayment} onChange={(e) => setForm({ ...form, repayment: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>产品图片 URL</label>
          <input style={inputStyle} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>产品优势（逗号分隔）</label>
          <input style={inputStyle} value={form.advantages} onChange={(e) => setForm({ ...form, advantages: e.target.value })} placeholder="极速下款, 先息后本, 征信宽松" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>产品摘要</label>
          <textarea style={{ ...inputStyle, height: 60, padding: "8px 10px" }} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>产品介绍 (HTML)</label>
          <textarea style={{ ...inputStyle, height: 200, padding: "8px 10px", fontFamily: "monospace", fontSize: 12 }} value={form.introHtml} onChange={(e) => setForm({ ...form, introHtml: e.target.value })} />
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button className="layui-btn" disabled={saving} onClick={handleSave}
          style={{ height: 40, padding: "0 32px", borderRadius: 8, background: "#ff5f16", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {saving ? "保存中..." : "保存"}
        </button>
        <Link href="/admin/products" className="layui-btn layui-btn-primary"
          style={{ height: 40, lineHeight: "40px", padding: "0 24px", borderRadius: 8, border: "1px solid #dcdfe6", background: "#fff", color: "#4b5563", fontSize: 14, textDecoration: "none", display: "inline-block" }}>
          取消
        </Link>
      </div>
    </div>
  );
}
