"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.redirected) {
        router.push(res.url);
        return;
      }

      const data = await res.json();
      setError(data.error || "登录失败");
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ley-page-auth">
      <div className="auth-container">
        <div className="auth-visual">
          <div className="visual-content">
            <h2>欢迎回来</h2>
            <p>比比信 - 为您提供最优质的贷款信息服务平台</p>
          </div>
          <div className="visual-decoration"></div>
        </div>
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>用户登录</h2>
            <p>登录您的账户以获得更好的体验</p>
          </div>
          <form className="layui-form auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">用户名</label>
              <div className="form-input-box">
                <input type="text" name="username" required placeholder="请输入用户名" autoComplete="off" className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">密码</label>
              <div className="form-input-box">
                <input type="password" name="password" required placeholder="请输入密码" className="form-input" />
              </div>
            </div>
            <div className="form-group-checkbox">
              <input type="checkbox" name="agree" defaultChecked />
              <span className="policy-links">
                <a href="/pages/agreement" target="_blank">《使用协议》</a> 和 <a href="/pages/privacy" target="_blank">《隐私政策》</a>
              </span>
            </div>
            {error && <p style={{ color: "#f56c6c", fontSize: 14, margin: "8px 0" }}>{error}</p>}
            <div className="form-action">
              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? "登录中..." : "立即登录"}
              </button>
            </div>
            <div className="auth-links">
              <span className="text-muted">还没有账户？</span><a href="/register" className="link-primary">立即注册</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
