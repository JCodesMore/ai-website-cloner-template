"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.username) router.replace("/admin");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">检查登录状态...</p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-center text-xl font-bold text-slate-900">银脉圈 · 后台管理</h1>
        <p className="mb-8 text-center text-sm text-slate-400">请使用管理员账号登录</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="username" required placeholder="管理员账号"
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" />
          <input type="password" name="password" required placeholder="管理员密码"
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors duration-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20" />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading}
            className="h-11 w-full rounded-lg bg-slate-900 text-sm font-medium text-white transition-colors duration-200 hover:bg-slate-800 disabled:opacity-60 cursor-pointer">
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
