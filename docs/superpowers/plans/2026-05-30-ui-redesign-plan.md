# UI/UX 全面重设计 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 bbxin 网站从橙色 layui 风格全面翻新为"经典黑白+金色点缀"的高端奢华设计系统，移动端优先。

**Architecture:** 分两阶段执行。Phase 1 建立设计系统基础（CSS 变量、字体、Tailwind 配置）并重写 3 个通用组件（Nav、Footer、按钮）。Phase 2 构建首页（Hero+搜索、热门产品、机构、文章）并验证。后续页面推广另开计划。

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Lucide React, IBM Plex Sans

---

### Task 1: 设计系统基础 — CSS 变量与字体

**Files:**
- Modify: `src/app/globals.css` (替换 `:root` CSS 变量块)
- Modify: `src/app/layout.tsx` (更新字体和 metadata)

- [ ] **Step 1: 替换 `:root` CSS 变量**

将 `src/app/globals.css:50-93` 的 `:root` 块替换为：

```css
:root {
  --bbx-primary: #171717;
  --bbx-primary-hover: #404040;
  --bbx-accent: #D4AF37;
  --bbx-accent-hover: #C19A2E;
  --bbx-bg-page: #FFFFFF;
  --bbx-text-main: #171717;
  --bbx-text-muted: #737373;
  --bbx-text-light: #A3A3A3;
  --bbx-text-white: #FFFFFF;
  --bbx-link: #D4AF37;
  --bbx-border: #E5E5E5;

  --background: #FFFFFF;
  --foreground: #171717;
  --card: #FFFFFF;
  --card-foreground: #171717;
  --popover: #FFFFFF;
  --popover-foreground: #171717;
  --primary: #171717;
  --primary-foreground: #FFFFFF;
  --secondary: #F5F5F5;
  --secondary-foreground: #171717;
  --muted: #F5F5F5;
  --muted-foreground: #737373;
  --accent: #D4AF37;
  --accent-foreground: #FFFFFF;
  --destructive: #DC2626;
  --border: #E5E5E5;
  --input: #E5E5E5;
  --ring: #D4AF37;
  --radius: 0.5rem;
  --chart-1: #171717;
  --chart-2: #D4AF37;
  --chart-3: #404040;
  --chart-4: #737373;
  --chart-5: #E5E5E5;
  --sidebar: #FFFFFF;
  --sidebar-foreground: #171717;
  --sidebar-primary: #171717;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #F5F5F5;
  --sidebar-accent-foreground: #D4AF37;
  --sidebar-border: #E5E5E5;
  --sidebar-ring: #D4AF37;
}
```

- [ ] **Step 2: 更新 `body` 样式**

将 `src/app/globals.css:105-111` 的 `body { ... }` 替换为：

```css
body {
  padding-top: 0;
  background: #FFFFFF;
  font-family: "IBM Plex Sans", "Helvetica Neue", "PingFang SC", Tahoma, Arial, sans-serif;
  font-size: 16px;
  color: #171717;
}
```

- [ ] **Step 3: 更新 `layout.tsx` 字体导入**

将 `src/app/layout.tsx` 的字体配置替换为：

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

export const metadata: Metadata = {
  title: "银脉圈 - 贷款口碑 - yinmaiquan.com",
  description: "找贷款，先查银脉圈(yinmaiquan.com)贷款产品口碑。收录全网贷款产品，聚合贷款人口碑反馈，提供贷款产品查询、比对，贷款路上规避风险。",
};
```

更新 `<html>` 标签 className 为 `{ibmPlexSans.variable}`。

- [ ] **Step 4: 删除 layui icon CSS 引用**

在 `layout.tsx` 中删除 `<head>` 内的 `<link rel="stylesheet" href="/statics/js/layui/css/layui-icons.css" />` — 后续用 Lucide 替代。

- [ ] **Step 5: 更新 Theme 配置中的字体**

将 `src/app/globals.css:10` 的 `--font-sans` 改为：

```css
--font-sans: "IBM Plex Sans", "Geist", ui-sans-serif, system-ui, sans-serif;
```

- [ ] **Step 6: 提交**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: apply new design system — black/white/gold palette, IBM Plex Sans"
```

---

### Task 2: 导航栏 Nav — 玻璃质感重写

**Files:**
- Modify: `src/components/Nav.tsx`

完全重写 Nav 组件，从 layui 风格切换到玻璃质感 + 移动端汉堡菜单。

- [ ] **Step 1: 重写 Nav.tsx**

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch("/api/auth/me", { signal: controller.signal })
      .then((res) => res.ok ? res.json() : { authenticated: false })
      .then((data) => {
        if (data.authenticated) setUser(data.username);
        else setUser(null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/products/fast") return pathname.startsWith("/products/fast");
    if (href === "/products/company") return pathname.startsWith("/products/company");
    if (href === "/products/person") return pathname.startsWith("/products/person");
    if (href === "/products/pledge") return pathname.startsWith("/products/pledge");
    if (href === "/institutions") return pathname.startsWith("/institutions");
    if (href === "/comments") return pathname.startsWith("/comments");
    return pathname === href;
  };

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        setLogoutOpen(false);
        router.push("/");
      }
    } finally {
      setLoggingOut(false);
    }
  }, [router]);

  return (
    <>
      <nav className="sticky top-0 z-50 h-14 bg-white/85 backdrop-blur-xl border-b border-[#E5E5E5]">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/statics/images/logo.png" alt="银脉圈" className="h-7 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1 h-full">
            {navItems.map((item) => (
              <li key={item.href} className="h-full flex items-center">
                <Link
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-[#D4AF37]"
                      : "text-[#404040] hover:text-[#171717]"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
                  )}
                </Link>
              </li>
            ))}
            {/* Dropdown */}
            <li
              className="relative h-full flex items-center"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#404040] hover:text-[#171717] transition-colors duration-200"
                aria-expanded={dropdownOpen}
              >
                贷款资讯
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full min-w-[140px] bg-white border border-[#E5E5E5] rounded-lg shadow-md py-1 z-50">
                  {subNavItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-4 py-2 text-sm text-[#404040] hover:text-[#D4AF37] hover:bg-[#F5F5F5] transition-colors duration-200"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3 text-sm">
            {loading ? null : user ? (
              <>
                <Link href="/profile" className="text-[#D4AF37] font-medium">
                  <User className="inline h-4 w-4 mr-1" />
                  {user}
                </Link>
                <button
                  onClick={() => setLogoutOpen(true)}
                  className="text-[#737373] hover:text-[#171717] transition-colors duration-200"
                >
                  <LogOut className="inline h-4 w-4 mr-1" />
                  退出
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[#404040] hover:text-[#171717] transition-colors duration-200"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 bg-[#171717] text-white rounded-md text-sm font-medium hover:bg-[#404040] transition-colors duration-200"
                >
                  注册
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-[#171717] hover:text-[#D4AF37] transition-colors duration-200"
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl animate-slide-in-right">
            <div className="flex flex-col p-6 pt-20 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium py-2 transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-[#D4AF37]"
                      : "text-[#171717] hover:text-[#D4AF37]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-[#E5E5E5] pt-4 mt-2">
                <p className="text-xs text-[#A3A3A3] uppercase tracking-wider mb-2">贷款资讯</p>
                {subNavItems.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="block text-sm text-[#404040] hover:text-[#D4AF37] py-1.5 transition-colors duration-200"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-[#E5E5E5] pt-4">
                {loading ? null : user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block text-sm text-[#D4AF37] font-medium py-1.5"
                    >
                      {user}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block text-sm text-[#737373] hover:text-[#171717] py-1.5 transition-colors duration-200"
                    >
                      退出登录
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/login"
                      className="flex-1 text-center py-2 text-sm border border-[#E5E5E5] rounded-md text-[#171717] hover:border-[#D4AF37] transition-colors duration-200"
                    >
                      登录
                    </Link>
                    <Link
                      href="/register"
                      className="flex-1 text-center py-2 text-sm bg-[#171717] text-white rounded-md hover:bg-[#404040] transition-colors duration-200"
                    >
                      注册
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 300ms ease-out;
        }
      `}</style>

      <ConfirmDialog
        open={logoutOpen}
        title="退出登录"
        message="确定要退出当前账号吗？"
        confirmText="退出"
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Nav.tsx
git commit -m "feat: redesign Nav — glass morphism, mobile hamburger, gold accent"
```

---

### Task 3: Footer — 深色重写

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: 重写 Footer.tsx**

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <img
              className="h-7 w-auto mb-4"
              src="/statics/images/logo_write.png"
              alt="银脉圈"
            />
            <p className="text-sm text-[#A3A3A3] leading-relaxed">
              银脉圈·贷款口碑 致力于为个人和企业提供全面详实的贷款产品口碑信息。秉承"诚信创造财富"的理念，让普惠金融惠及千企万户。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/pages/about" className="text-sm text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-200">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/pages/contact" className="text-sm text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-200">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/pages/statement" className="text-sm text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-200">
                  免责声明
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">产品导航</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products/fast" className="text-sm text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-200">
                  极速贷款
                </Link>
              </li>
              <li>
                <Link href="/products/company" className="text-sm text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-200">
                  企业贷款
                </Link>
              </li>
              <li>
                <Link href="/products/person" className="text-sm text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-200">
                  个人贷款
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="text-sm text-[#A3A3A3] hover:text-[#D4AF37] transition-colors duration-200">
                  机构产品
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#404040]">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-[#737373]">
          Copyright 2008-{new Date().getFullYear()} &copy; 内江银脉圈企业管理咨询有限公司版权所有 www.yinmaiquan.com
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/Footer.tsx
git commit -m "feat: redesign Footer — dark background, gold link hover"
```

---

### Task 4: 按钮组件标准化

**Files:**
- Create: `src/components/ui/Button.tsx`

- [ ] **Step 1: 创建 `src/components/ui/Button.tsx`**

```tsx
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#171717] text-white hover:bg-[#404040] focus-visible:ring-[#171717]",
  accent:
    "bg-[#D4AF37] text-black font-medium hover:bg-[#C19A2E] focus-visible:ring-[#D4AF37]",
  outline:
    "border border-[#E5E5E5] text-[#171717] hover:border-[#D4AF37] hover:text-[#D4AF37] focus-visible:ring-[#D4AF37]",
  ghost:
    "text-[#404040] hover:text-[#171717] hover:bg-[#F5F5F5] focus-visible:ring-[#171717]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-lg h-11 px-5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
```

- [ ] **Step 2: 提交**

```bash
git add src/components/ui/Button.tsx
git commit -m "feat: add standardized Button component — primary, accent, outline, ghost variants"
```

---

### Task 5: ProductCard — 新设计风格

**Files:**
- Modify: `src/components/ProductCard.tsx`

- [ ] **Step 1: 重写 ProductCard.tsx**

```tsx
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "fast";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const isFast = variant === "fast";
  const hasPromo = !!product.promo;

  return (
    <a
      href={product.href}
      className="block bg-white rounded-xl border border-[#E5E5E5] p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 min-w-[260px]"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-6 h-6 rounded-md object-cover flex-shrink-0 mt-0.5"
        />
        <h3 className="text-base font-semibold text-[#171717] leading-snug line-clamp-2 flex-1">
          {product.name}
        </h3>
        <span className="flex-shrink-0 text-xs text-[#D4AF37] bg-[#F5F5F5] rounded-full px-2 py-0.5">
          评：{product.commentCount}
        </span>
      </div>

      {/* Institution */}
      <p className="text-xs text-[#737373] mb-3 ml-9">
        机构：{product.institution}
      </p>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 ml-9">
        <div>
          <p className="text-[11px] text-[#A3A3A3] mb-0.5">最高额度(元)</p>
          <p className="text-xs font-medium text-[#171717]">{product.maxAmount}</p>
        </div>
        <div>
          <p className="text-[11px] text-[#A3A3A3] mb-0.5">还款期限</p>
          <p className="text-xs font-medium text-[#171717]">{product.term}</p>
        </div>
        <div>
          <p className="text-[11px] text-[#A3A3A3] mb-0.5">参考利率</p>
          <p className="text-xs font-medium text-[#171717]">{product.rate}</p>
        </div>
        <div>
          <p className="text-[11px] text-[#A3A3A3] mb-0.5">还款方式</p>
          <p className="text-xs font-medium text-[#171717]">{product.repayment}</p>
        </div>
      </div>

      {/* Actions (fast variant or has promo) */}
      {(isFast || hasPromo) && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F5F5]">
          {product.promo && (
            <span className="text-xs text-[#D4AF37] bg-[#F5F5F5] rounded-full px-2 py-0.5 truncate max-w-[6em]">
              {product.promo}
            </span>
          )}
          <span className="inline-flex items-center justify-center h-8 px-4 text-xs font-semibold text-white bg-[#171717] rounded-lg hover:bg-[#404040] transition-colors duration-200 cursor-pointer">
            立即申请
          </span>
        </div>
      )}
    </a>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: redesign ProductCard — white card, gold accents, Tailwind classes"
```

---

### Task 6: ArticleCard — 新设计风格

**Files:**
- Modify: `src/components/ArticleCard.tsx`

- [ ] **Step 1: 重写 ArticleCard.tsx**

```tsx
import Link from "next/link";
import { Calendar } from "lucide-react";
import type { NewsItem } from "@/types";

interface ArticleCardProps {
  article: NewsItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={article.href}
      className="flex items-start gap-4 py-4 border-b border-[#F5F5F5] hover:border-[#E5E5E5] transition-colors duration-200 group"
    >
      {article.image && (
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-[#171717] group-hover:text-[#D4AF37] transition-colors duration-200 line-clamp-2 leading-snug">
          {article.title}
        </h3>
        {article.description && (
          <p className="text-xs text-[#737373] mt-1 line-clamp-1">{article.description}</p>
        )}
        {article.date && (
          <div className="flex items-center gap-1 mt-2 text-xs text-[#A3A3A3]">
            <Calendar className="h-3 w-3" />
            {article.date}
          </div>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/ArticleCard.tsx
git commit -m "feat: redesign ArticleCard — minimal row style, gold hover"
```

---

### Task 7: 首页 — Hero + 搜索 + 产品 + 机构 + 文章

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/page.client.tsx`
- Modify: `src/app/products/fast/page.tsx` (移除 Banner 引用，Banner 合并进首页)
- Check: `src/data/fastProducts.json` 和 `src/data/institutions.json` 存在

- [ ] **Step 1: 创建 `src/app/page.client.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";
import type { Product, NewsItem } from "@/types";

interface Institution {
  id: number;
  name: string;
  logo?: string;
  href: string;
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [articles, setArticles] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Load hot products
    import("@/data/fastProducts.json")
      .then((m) => setHotProducts((m.default as Product[]).slice(0, 6)))
      .catch(() => {});
    // Load institutions
    import("@/data/institutions.json")
      .then((m) => setInstitutions((m.default as Institution[]).slice(0, 6)))
      .catch(() => {});
    // Load articles
    import("@/data/discussionArticles.json")
      .then((m) => setArticles((m.default as NewsItem[]).slice(0, 5)))
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products/search?wd=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-[28px] md:text-[48px] font-semibold text-[#171717] leading-tight tracking-tight">
            找到最适合你的
            <br />
            <span className="text-[#D4AF37]">金融产品</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-[#737373] max-w-md mx-auto">
            已收录全网 816+ 贷款产品，聚合真实口碑反馈
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto">
            <div className="flex rounded-lg border-2 border-[#D4AF37] overflow-hidden focus-within:ring-2 focus-within:ring-[#D4AF37]/30 transition-shadow duration-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索产品或机构名称"
                className="flex-1 h-12 px-4 text-sm text-[#171717] placeholder-[#A3A3A3] outline-none bg-white"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-14 h-12 bg-[#D4AF37] text-black hover:bg-[#C19A2E] transition-colors duration-200 cursor-pointer"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Hot Products Section */}
      {hotProducts.length > 0 && (
        <section className="py-12 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-[28px] font-semibold text-[#171717]">
                热门产品
              </h2>
              <Link
                href="/products/fast"
                className="flex items-center gap-1 text-sm text-[#737373] hover:text-[#D4AF37] transition-colors duration-200"
              >
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Horizontal scroll on mobile, grid on desktop */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:snap-none">
              {hotProducts.map((product) => (
                <div key={product.id} className="snap-start flex-shrink-0 w-[260px] md:w-auto">
                  <ProductCard product={product} variant="fast" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Institutions Section */}
      {institutions.length > 0 && (
        <section className="py-12 px-4 bg-[#F5F5F5]">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-[28px] font-semibold text-[#171717]">
                合作机构
              </h2>
              <Link
                href="/institutions"
                className="flex items-center gap-1 text-sm text-[#737373] hover:text-[#D4AF37] transition-colors duration-200"
              >
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {institutions.map((inst) => (
                <Link
                  key={inst.id}
                  href={inst.href}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-[#E5E5E5] hover:border-[#D4AF37] hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                    {inst.logo ? (
                      <img src={inst.logo} alt={inst.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-semibold text-[#A3A3A3]">
                        {inst.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#404040] text-center line-clamp-1">
                    {inst.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
      {articles.length > 0 && (
        <section className="py-12 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-[28px] font-semibold text-[#171717]">
                最新文章
              </h2>
              <Link
                href="/cates/14/articles"
                className="flex items-center gap-1 text-sm text-[#737373] hover:text-[#D4AF37] transition-colors duration-200"
              >
                更多文章
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-[#E5E5E5] px-4 divide-y divide-[#F5F5F5]">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 更新 `src/app/page.tsx`** 以使用新首页

```tsx
import HomePage from "./page.client";

export default function Home() {
  return <HomePage />;
}
```

- [ ] **Step 3: 更新 `src/app/products/fast/page.tsx`** 移除 Banner

删除 `import Banner from "@/components/Banner";` 和 `<Banner />` JSX。Banner 功能已合并进首页 Hero。

- [ ] **Step 4: 删除 layout.tsx 中旧的浮层元素**

在 `layout.tsx` 中删除 `<div className="fixed-qr">` 和 `<ul className="layui-fixbar">`——这些是旧版设计元素，新设计暂时去除。

- [ ] **Step 5: 添加移动端横向滚动隐藏滚动条样式**

在 `globals.css` 末尾添加：

```css
/* Hide scrollbar for horizontal scroll containers */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

并在 HomePage 的横向滚动容器上添加 `scrollbar-hide` class。

- [ ] **Step 6: 提交**

```bash
git add src/app/page.tsx src/app/page.client.tsx src/app/products/fast/page.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: build new homepage — hero, search, products, institutions, articles"
```

---

### Task 8: 引入 Lucide 图标依赖

**Files:**
- Verify: `package.json` 已有 `lucide-react`

- [ ] **Step 1: 检查 lucide-react 是否已安装**

```bash
npm ls lucide-react 2>&1 || echo "NOT_INSTALLED"
```

- [ ] **Step 2: 如未安装则添加**

```bash
npm install lucide-react
```

- [ ] **Step 3: 提交（如有变更）**

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react for SVG icons"
```

---

### Task 9: 清理旧 CSS — 移除未使用的 Banner 和 ProductCard 类

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: 移除 Banner CSS 块**

删除 `src/app/globals.css:493-558` 的 `.ley-banner` 相关样式（Banner 组件将被首页 Hero 替代）。

- [ ] **Step 2: 移除 layui 导航 CSS**

删除 `src/app/globals.css:408-496` 的 `.layui-nav` 相关样式（Nav 组件已完全重写，不再使用这些类）。

- [ ] **Step 3: 更新 `body` 的 `padding-top` 和导航 padding**

已在新设计系统中将 `body { padding-top: 0 }` 且 Nav 使用 sticky。确保 `ley-inner` 的固定宽度被响应式替代（后续 Task 处理）。

- [ ] **Step 4: 提交**

```bash
git add src/app/globals.css
git commit -m "refactor: remove unused Banner and layui-nav CSS"
```

---

### Task 10: 全局响应式修复 — `ley-inner` 容器

**Files:**
- Modify: `src/app/globals.css` (`.ley-inner` 样式)

- [ ] **Step 1: 更新 `.ley-inner` 为响应式**

将 `globals.css:124-133` 的 `.ley-inner` 替换为：

```css
.ley-inner {
  margin: 0 auto;
  width: 100%;
  max-width: 1152px;
  padding: 0 16px;
  height: auto;
  overflow: hidden;
}

@media (min-width: 768px) {
  .ley-inner {
    padding: 0 24px;
  }
}
```

- [ ] **Step 2: 更新固定宽度页面布局为响应式**

将 `globals.css:140-165` 的 `.ley-page` 和 grid 系统保留但更新为响应式：

```css
.ley-page {
  padding-top: 24px;
}

.layui-row {
  display: flex;
  flex-wrap: wrap;
}

.layui-col-space16 {
  margin: -8px;
}

.layui-col-space16 > * {
  padding: 8px;
}

@media (min-width: 768px) {
  .layui-col-md9 {
    flex: 0 0 75%;
    max-width: 75%;
  }

  .layui-col-md3 {
    flex: 0 0 25%;
    max-width: 25%;
  }

  .layui-col-md2 {
    flex: 0 0 calc(100% / 6);
    max-width: calc(100% / 6);
  }

  .layui-col-md-offset1 {
    margin-left: calc(100% / 12);
  }
}

@media (max-width: 767px) {
  .layui-col-md9,
  .layui-col-md3,
  .layui-col-md2 {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .layui-col-md-offset1 {
    margin-left: 0;
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add src/app/globals.css
git commit -m "fix: make .ley-inner container responsive, mobile-first grid"
```

---

### Task 11: 验证 — 启动项目并检查

**Files:** 无

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 检查 TypeScript 编译是否有错误**

```bash
npm run typecheck 2>&1 || npx tsc --noEmit 2>&1
```

修复所有类型错误。

- [ ] **Step 3: 检查构建**

```bash
npm run build 2>&1
```

修复所有构建错误。

- [ ] **Step 4: 在浏览器中验证**

检查以下项目：
- 首页在 375px 宽度下所有 5 个区块正常显示
- 导航栏玻璃质感 + 移动端汉堡菜单正常
- 搜索框金色边框 + focus ring 正常
- 产品卡片横向滑动（移动端）正常
- Footer 深色背景正常
- 768px 和 1024px 宽度下布局正常

- [ ] **Step 5: 提交（如有修复）**

```bash
git add -A
git commit -m "fix: verification fixes after redesign"
```
