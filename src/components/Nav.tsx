"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useDropdown } from "@/hooks/use-dropdown";

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
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { open: dropdownOpen, onMouseEnter, onMouseLeave } = useDropdown(150);
  const { user, loading } = useCurrentUser();

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
    window.location.href = "/";
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 h-16 bg-slate-900 text-white">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-8 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-2xl font-bold tracking-wide">银脉圈</span>
          <div className="flex flex-col">
            <span className="text-sm leading-tight text-slate-300">贷款随心选</span>
            <span className="text-xs leading-tight text-slate-400">yinmaiquan.com</span>
          </div>
        </Link>

        <ul className="flex items-center gap-1 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-md px-3 py-2 transition-colors duration-200 hover:bg-white/10 ${
                  isActive(item.href) ? "bg-white/10 text-yellow-400" : "text-slate-200"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li
            ref={dropdownRef}
            className="relative"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <span className="inline-flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-slate-200 transition-colors duration-200 hover:bg-white/10">
              贷款资讯
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </span>
            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-1 min-w-[140px] rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-lg">
                {subNavItems.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="block px-4 py-2 text-sm text-slate-200 transition-colors duration-150 hover:bg-white/10 hover:text-white"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ul>

        <div className="ml-auto flex items-center gap-4 text-sm">
          {!loading && user ? (
            <>
              <Link href="/profile" className="text-slate-200 transition-colors duration-200 hover:text-white">
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="text-slate-400 transition-colors duration-200 hover:text-white cursor-pointer"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 transition-colors duration-200 hover:text-white"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-yellow-600 px-4 py-1.5 text-white transition-colors duration-200 hover:bg-yellow-700"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
