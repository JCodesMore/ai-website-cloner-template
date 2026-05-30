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
        if (d.username) {
          router.replace("/admin");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6f8" }}>
        <p style={{ color: "#999", fontSize: 14 }}>检查登录状态...</p>
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6f8" }}>
      <div style={{ width: 380, background: "#fff", borderRadius: 12, padding: 40, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>
          银脉圈 · 后台管理
        </h1>
        <p style={{ textAlign: "center", fontSize: 13, color: "#999", marginBottom: 32 }}>
          请使用管理员账号登录
        </p>
        <form className="layui-form" onSubmit={handleSubmit}>
          <div className="layui-form-item" style={{ marginBottom: 16 }}>
            <input type="text" name="username" required placeholder="管理员账号" className="layui-input" style={{ height: 44, borderRadius: 8 }} />
          </div>
          <div className="layui-form-item" style={{ marginBottom: 20 }}>
            <input type="password" name="password" required placeholder="管理员密码" className="layui-input" style={{ height: 44, borderRadius: 8 }} />
          </div>
          {error && <p style={{ color: "#f56c6c", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="layui-btn layui-btn-fluid" disabled={loading}
            style={{ height: 44, borderRadius: 8, background: "#ff5f16", border: "none", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}>
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
