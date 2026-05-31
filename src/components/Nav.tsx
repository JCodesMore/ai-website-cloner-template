"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { label: "极速贷款", href: "/products/fast" },
  { label: "企业贷款", href: "/products/company" },
  { label: "个人贷款", href: "/products/person" },
  { label: "抵押贷款", href: "/products/pledge" },
  { label: "机构产品", href: "/institutions" },
  { label: "评论", href: "/comments" },
];

const subNavItems = [
  { label: "行业资讯", href: "/cates/91/articles" },
  { label: "贷款交流", href: "/cates/14/articles" },
  { label: "贷款舆情", href: "/cates/80/articles" },
  { label: "常见问题", href: "/cates/1/articles" },
];

export default function Nav() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.ok ? res.json() : { authenticated: false })
      .then((data) => {
        if (data.authenticated) setUser(data.username);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isActive = (href: string) => {
    if (href === "/products/fast") return pathname.startsWith("/products/fast");
    if (href === "/products/company") return pathname.startsWith("/products/company");
    if (href === "/products/person") return pathname.startsWith("/products/person");
    if (href === "/products/pledge") return pathname.startsWith("/products/pledge");
    if (href === "/institutions") return pathname.startsWith("/institutions");
    if (href === "/comments") return pathname.startsWith("/comments");
    return pathname === href;
  };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  return (
    <div className="ley-nav">
      <div className="nav-wrapper ley-inner ley-inner-wide">
        <Link href="/" className="logo">
          <img src="/statics/images/logo.png" alt="" />
        </Link>
        <ul className="layui-nav ley-nav-ul">
          {navItems.map((item) => (
            <li
              key={item.href}
              className={`layui-nav-item ${isActive(item.href) ? "layui-this" : ""}`}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          <li
            className="layui-nav-item"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <a href="javascript:;">贷款资讯</a>
            {dropdownOpen && (
              <dl className="layui-nav-child" style={{ display: "block" }}>
                {subNavItems.map((sub) => (
                  <dd key={sub.href}>
                    <Link href={sub.href}>{sub.label}</Link>
                  </dd>
                ))}
              </dl>
            )}
          </li>
        </ul>
        <div className="nav-right-area">
          <div className="nav-auth-links">
            {loading ? null : user ? (
              <>
                <span className="nav-auth-link" style={{ color: "#ff5f16", fontWeight: 600 }}>
                  {user}
                </span>
                <span className="nav-auth-sep">|</span>
                <a href="javascript:;" onClick={handleLogout} className="nav-auth-link">退出</a>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-auth-link">登录</Link>
                <span className="nav-auth-sep">|</span>
                <Link href="/register" className="nav-auth-link nav-auth-link--register">注册</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
