"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { LogOut, LayoutDashboard, FileText, Users, Package, Building2, MessageSquare, FileEdit } from "lucide-react";

const navItems = [
  { label: "概览", href: "/admin", icon: LayoutDashboard },
  { label: "贷款申请", href: "/admin/loans", icon: FileText },
  { label: "用户管理", href: "/admin/users", icon: Users },
  { label: "产品管理", href: "/admin/products", icon: Package },
  { label: "机构管理", href: "/admin/institutions", icon: Building2 },
  { label: "评论管理", href: "/admin/comments", icon: MessageSquare },
  { label: "文章管理", href: "/admin/articles", icon: FileEdit },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { open: logoutOpen, loading: loggingOut, setLoading: setLoggingOut, show: showLogout, hide: hideLogout } = useConfirmDialog();

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      setUsername(null);
      hideLogout();
      router.replace("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  }, [router, setLoggingOut, hideLogout]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/admin/auth/me", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.username) setUsername(d.username);
        else if (pathname !== "/admin/login") router.replace("/admin/login");
      })
      .catch(() => {
        if (pathname !== "/admin/login") router.replace("/admin/login");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-blue-600" />
          <p className="text-sm text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="mb-3 text-xl font-bold text-slate-900">页面加载异常</h2>
          <p className="mb-5 text-sm text-slate-500">请稍后重试</p>
          <button onClick={() => window.location.href = "/admin/login"}
            className="rounded-lg bg-yellow-600 px-8 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-yellow-700 cursor-pointer">
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-5">
          <Link href="/admin" className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors duration-200">
            银脉圈 · 后台
          </Link>
          <p className="mt-1 text-xs text-slate-400">{username}</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const active = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-100 p-3">
          <button onClick={showLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-500 transition-colors duration-200 hover:bg-slate-50 hover:text-slate-700 cursor-pointer">
            <LogOut className="h-4 w-4" /> 退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
      <ConfirmDialog
        open={logoutOpen}
        title="退出登录"
        message="确定要退出管理后台吗？"
        confirmText="退出"
        loading={loggingOut}
        onConfirm={handleLogout}
        onCancel={hideLogout}
      />
    </div>
  );
}
