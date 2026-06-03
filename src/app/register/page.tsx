"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string; confirm?: string; agree?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  function validate(form: FormData): boolean {
    const errs: typeof errors = {};
    const u = (form.get("username") as string).trim();
    const p = form.get("password") as string;
    const c = form.get("confirm_password") as string;

    if (!u) errs.username = "请输入用户名";
    else if (u.length < 4) errs.username = "用户名至少4位字符";
    else if (!/^[a-zA-Z0-9_一-龥]+$/.test(u)) errs.username = "用户名仅支持字母、数字、下划线和中文";

    if (!p) errs.password = "请输入密码";
    else if (p.length < 6) errs.password = "密码至少6位字符";

    if (!c) errs.confirm = "请再次输入密码";
    else if (p !== c) errs.confirm = "两次密码输入不一致";

    if (!agree) errs.agree = "请阅读并同意使用协议和隐私政策";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    if (!validate(form)) return;

    setLoading(true);
    const username = (form.get("username") as string).trim();
    const password = form.get("password") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.redirected) { window.location.href = res.url; return; }
      const data = await res.json();
      setError(data.error || "注册失败");
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: keyof typeof errors) =>
    `h-11 w-full rounded-lg border px-3 pr-10 text-sm outline-none transition-colors duration-200 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
        : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
    }`;

  function clearErr(field: keyof typeof errors) {
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  }

  return (
    <div className="flex min-h-[calc(100vh-64px-300px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">用户注册</h1>
          <p className="mt-2 text-sm text-slate-500">创建您的账户，享受更多服务与专属特权</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">用户名</label>
              <input
                type="text"
                name="username"
                placeholder="4-16位，字母/数字/下划线/中文"
                autoComplete="off"
                className={inputClass("username")}
                onChange={() => clearErr("username")}
              />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">密码</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="至少6位字符"
                  className={inputClass("password")}
                  onChange={() => clearErr("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">确认密码</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm_password"
                  placeholder="请再次输入密码"
                  className={inputClass("confirm")}
                  onChange={() => clearErr("confirm")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs text-slate-500">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => { setAgree(e.target.checked); clearErr("agree"); }}
                  className="accent-emerald-500"
                />
                已阅读并同意
                <Link href="/pages/agreement" target="_blank" className="text-emerald-600 hover:underline">《使用协议》</Link>
                和
                <Link href="/pages/privacy" target="_blank" className="text-emerald-600 hover:underline">《隐私政策》</Link>
              </label>
              {errors.agree && <p className="mt-1 text-xs text-red-500">{errors.agree}</p>}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "立即注册"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            已有账户？<Link href="/login" className="text-emerald-600 hover:underline">立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
