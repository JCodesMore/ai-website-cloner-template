"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProductComments({ productId, productName }: { productId: string; productName: string }) {
  const [user, setUser] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.username) setUser(d.username); });
    fetch(`/api/products/${productId}/comments`).then(r => r.json()).then(d => setComments(d.comments || []));
  }, [productId]);

  async function submit() {
    if (!text.trim()) return;
    setSubmitting(true); setMsg("");
    const res = await fetch(`/api/products/${productId}/comments`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text.trim(), productName }),
    });
    const d = await res.json();
    if (d.error && d.error.includes("登录")) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (d.ok) {
      setComments(prev => [{ id: Date.now(), author: user, content: text.trim(), productName, date: "刚刚", status: "pending" }, ...prev]);
      setText("");
    }
    setMsg(d.ok ? "评论已提交，等待审核" : (d.error || "提交失败"));
    setSubmitting(false);
  }

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">评论 ({comments.length})</h3>

      {!user ? (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          请先 <a href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} className="font-semibold text-amber-600 hover:underline">登录</a> 后发表评论
        </div>
      ) : (
        <div className="mb-4">
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="写下你的评论..."
            className="h-20 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition-colors duration-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">以 {user} 的身份评论</span>
            <button disabled={submitting || !text.trim()} onClick={submit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "提交中" : "发表评论"}
            </button>
          </div>
          {msg && <p className={`mt-2 text-xs ${msg.includes("成功") || msg.includes("审核") ? "text-emerald-600" : "text-red-500"}`}>{msg}</p>}
        </div>
      )}

      {comments.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">暂无评论</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c: any) => (
            <div key={c.id} className="rounded-lg border border-slate-100 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-600">
                  {c.author[0]}
                </span>
                <span className="text-sm font-semibold text-slate-900">{c.author}</span>
                <span className="text-xs text-slate-400">{c.date}</span>
                {c.status === "pending" && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">审核中</span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
