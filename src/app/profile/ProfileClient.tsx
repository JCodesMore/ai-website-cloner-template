"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff, User, Lock, Heart, MessageSquare, Calendar, Check, Building2 } from "lucide-react";

interface Props {
  user: { username: string; phone: string; createdAt: string | null };
  follows: { productId: number; productName: string; institution: string; category: string }[];
  followedInstitutions: { institutionId: number; institutionName: string; institutionFullName: string }[];
  comments: { id: number; content: string; productName: string; date: string }[];
}

type Tab = "info" | "password" | "follows" | "instFollows" | "comments";

const tabs: { key: Tab; label: string; icon: typeof User }[] = [
  { key: "info", label: "基本资料", icon: User },
  { key: "password", label: "修改密码", icon: Lock },
  { key: "follows", label: "关注的产品", icon: Heart },
  { key: "instFollows", label: "关注的机构", icon: Building2 },
  { key: "comments", label: "我的评论", icon: MessageSquare },
];

export default function ProfileClient({ user, follows, followedInstitutions, comments }: Props) {
  const [active, setActive] = useState<Tab>("info");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">个人中心</h1>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Left sidebar */}
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                active === t.key
                  ? "bg-amber-50 text-amber-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              {t.key === "follows" && follows.length > 0 && (
                <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
                  {follows.length}
                </span>
              )}
              {t.key === "instFollows" && followedInstitutions.length > 0 && (
                <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
                  {followedInstitutions.length}
                </span>
              )}
              {t.key === "comments" && comments.length > 0 && (
                <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
                  {comments.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right content */}
        <div className="min-h-[400px] rounded-xl border border-slate-200 bg-white p-6">
          {active === "info" && <InfoTab user={user} />}
          {active === "password" && <PasswordTab />}
          {active === "follows" && <FollowsTab follows={follows} />}
          {active === "instFollows" && <InstFollowsTab followedInstitutions={followedInstitutions} />}
          {active === "comments" && <CommentsTab comments={comments} />}
        </div>
      </div>
    </div>
  );
}

/* ---- Info Tab ---- */
function InfoTab({ user }: { user: { username: string; phone: string; createdAt: string | null } }) {
  const [phone, setPhone] = useState(user.phone);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true); setMsg(null);
    try {
      const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone }) });
      const d = await res.json();
      setMsg({ ok: d.ok, text: d.ok ? "手机号已绑定" : d.error || "保存失败" });
    } catch { setMsg({ ok: false, text: "网络错误" }); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <User className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-slate-900">基本资料</h2>
      </div>
      <div className="space-y-5 max-w-md">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-slate-500">用户名</label>
            <p className="mt-0.5 font-semibold text-slate-900">{user.username}</p>
          </div>
          <div>
            <label className="text-xs text-slate-500">注册时间</label>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-600">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString("zh-CN") : "-"}
            </p>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500">手机号</label>
          <div className="mt-1 flex gap-2">
            <input className="h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" placeholder="输入手机号" value={phone} onChange={(e) => { setPhone(e.target.value); setMsg(null); }} />
            <button onClick={save} disabled={saving} className="flex h-11 items-center gap-1.5 rounded-lg bg-amber-500 px-5 text-sm font-medium text-black hover:bg-amber-400 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? "保存中" : "绑定"}
            </button>
          </div>
          {msg && <p className={`mt-1.5 text-xs ${msg.ok ? "text-emerald-600" : "text-red-500"}`}>{msg.text}</p>}
        </div>
      </div>
    </div>
  );
}

/* ---- Password Tab ---- */
function PasswordTab() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState({ cur: false, n: false, c: false });

  async function save() {
    setSaving(true); setMsg(null);
    if (!form.current) { setMsg({ ok: false, text: "请输入当前密码" }); setSaving(false); return; }
    if (form.newPass.length < 6) { setMsg({ ok: false, text: "新密码至少6位" }); setSaving(false); return; }
    if (form.newPass !== form.confirm) { setMsg({ ok: false, text: "两次新密码不一致" }); setSaving(false); return; }
    try {
      const res = await fetch("/api/profile/password", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: form.current, newPassword: form.newPass }) });
      const d = await res.json();
      setMsg({ ok: d.ok, text: d.ok ? "密码修改成功" : d.error || "修改失败" });
      if (d.ok) setForm({ current: "", newPass: "", confirm: "" });
    } catch { setMsg({ ok: false, text: "网络错误" }); }
    finally { setSaving(false); }
  }

  function input(name: "cur" | "n" | "c", field: "current" | "newPass" | "confirm", placeholder: string) {
    return (
      <div className="relative">
        <input type={show[name] ? "text" : "password"} className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-10 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" placeholder={placeholder} value={form[field]} onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setMsg(null); }} />
        <button type="button" onClick={() => setShow({ ...show, [name]: !show[name] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          {show[name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <Lock className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-slate-900">修改密码</h2>
      </div>
      <div className="max-w-sm space-y-3">
        {input("cur", "current", "当前密码")}
        {input("n", "newPass", "新密码（至少6位）")}
        {input("c", "confirm", "确认新密码")}
        <button onClick={save} disabled={saving} className="flex h-11 items-center gap-1.5 rounded-lg bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          修改密码
        </button>
        {msg && <p className={`text-xs ${msg.ok ? "text-emerald-600" : "text-red-500"}`}>{msg.text}</p>}
      </div>
    </div>
  );
}

/* ---- Follows Tab ---- */
function FollowsTab({ follows }: { follows: { productId: number; productName: string; institution: string; category: string }[] }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <Heart className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-slate-900">关注的产品</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{follows.length}</span>
      </div>
      {follows.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">
          暂无关注，去<a href="/products/fast" className="text-amber-600 hover:underline">产品列表</a>看看吧
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {follows.map((f) => (
            <Link key={f.productId} href={`/products/${f.category || "person"}/${f.productId}`} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/50">
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-sm text-slate-900">{f.productName}</div>
                <div className="mt-0.5 truncate text-xs text-slate-400">{f.institution}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Comments Tab ---- */
function CommentsTab({ comments }: { comments: { id: number; content: string; productName: string; date: string }[] }) {
  if (comments.length === 0) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-2.5">
          <MessageSquare className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-slate-900">我的评论</h2>
        </div>
        <p className="py-12 text-center text-sm text-slate-400">暂无评论</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <MessageSquare className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-slate-900">我的评论</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{comments.length}</span>
      </div>
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border border-slate-100 p-4 transition-colors duration-200 hover:bg-slate-50">
            <p className="mb-2 text-sm leading-relaxed text-slate-700">{c.content}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              {c.productName && <span className="inline-flex items-center gap-1"><span className="h-1 w-1 rounded-full bg-amber-400" />产品：{c.productName}</span>}
              <span>{c.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Institutions Follow Tab ---- */
function InstFollowsTab({ followedInstitutions }: { followedInstitutions: { institutionId: number; institutionName: string; institutionFullName: string }[] }) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <Building2 className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-slate-900">关注的机构</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{followedInstitutions.length}</span>
      </div>
      {followedInstitutions.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">
          暂无关注，去<a href="/institutions" className="text-amber-600 hover:underline">机构列表</a>看看吧
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {followedInstitutions.map((f) => (
            <Link key={f.institutionId} href={`/institutions/${f.institutionId}`} className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/50">
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-sm text-slate-900">{f.institutionName}</div>
                {f.institutionFullName && (
                  <div className="mt-0.5 truncate text-xs text-slate-400">{f.institutionFullName}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
