"use client";

/* eslint-disable @next/next/no-img-element */
import { BarChart3, ExternalLink, Inbox, LayoutDashboard, LogOut, Map, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/traffic", label: "Website traffic", icon: BarChart3 },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/tours", label: "Tours", icon: Map },
  { href: "/admin/news", label: "Travel news", icon: Newspaper },
];

export function Sidebar({ newEnquiries }: { newEnquiries: number }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <aside className="sticky top-0 z-20 border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-60 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img src="/sites/showlanka/images/logo.png" alt="" className="h-8 w-auto" />
            <span className="text-sm font-semibold leading-tight">
              Show Lanka
              <span className="block text-xs font-normal text-slate-500">Admin panel</span>
            </span>
          </Link>
          <form action={logout} className="lg:hidden">
            <button type="submit" className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Sign out">
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-2 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition",
                active(href) ? "bg-[#0057a7]/8 text-[#0057a7]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon className="size-4" />
              {label}
              {href === "/admin/enquiries" && newEnquiries > 0 && (
                <span className="ml-auto rounded-full bg-[#0057a7] px-1.5 py-px text-xs font-semibold text-white tabular-nums">{newEnquiries}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="hidden space-y-1 border-t border-slate-100 p-3 lg:block">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            <ExternalLink className="size-4" />
            View website
          </a>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
              <LogOut className="size-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
