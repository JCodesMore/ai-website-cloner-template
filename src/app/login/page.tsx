"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  function validate(form: FormData): boolean {
    const errs: { username?: string; password?: string } = {};
    const u = (form.get("username") as string).trim();
    const p = form.get("password") as string;
    if (!u) errs.username = "请输入用户名";
    if (!p) errs.password = "请输入密码";
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push(redirectTo);
        router.refresh();
        return;
      }
      setError(data.error || "登录失败");
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
        : "border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
    }`;

  return (
    <div className="flex min-h-[calc(100vh-64px-300px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">用户登录</h1>
          <p className="mt-2 text-sm text-slate-500">登录您的账户以获得更好的体验</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">用户名</label>
              <input
                type="text"
                name="username"
                placeholder="请输入用户名"
                autoComplete="off"
                className={inputClass("username")}
                onChange={() => errors.username && setErrors({ ...errors, username: undefined })}
              />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">密码</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  placeholder="请输入密码"
                  className={inputClass("password")}
                  onChange={() => errors.password && setErrors({ ...errors, password: undefined })}
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
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-slate-900 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "立即登录"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            还没有账户？<Link href="/register" className="text-amber-600 hover:underline">立即注册</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
