"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
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
    const confirm = form.get("confirm_password") as string;

    if (password !== confirm) {
      setError("两次密码输入不一致");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.redirected) {
        router.push(res.url);
        return;
      }

      const data = await res.json();
      setError(data.error || "注册失败");
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
            <h2>加入我们</h2>
            <p>创建您的账户，享受更多服务与专属特权</p>
          </div>
          <div className="visual-decoration"></div>
        </div>
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>用户注册</h2>
            <p>填写以下信息完成注册</p>
          </div>
          <form className="layui-form auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">用户名</label>
              <div className="form-input-box">
                <input type="text" name="username" required placeholder="6-16位字符，支持字母数字下划线" autoComplete="off" className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">密码</label>
              <div className="form-input-box">
                <input type="password" name="password" required placeholder="至少6位字符" className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">确认密码</label>
              <div className="form-input-box">
                <input type="password" name="confirm_password" required placeholder="请再次输入密码" className="form-input" />
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
                {loading ? "注册中..." : "立即注册"}
              </button>
            </div>
            <div className="auth-links">
              <span className="text-muted">已有账户？</span><a href="/login" className="link-primary">立即登录</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
