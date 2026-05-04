"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const navGroups = [
  {
    label: "Command",
    items: [
      { label: "Command Center", href: "/admin/command" },
    ],
  },
  {
    label: "Cortex Studio",
    items: [
      { label: "Creative Engine", href: "/admin/creative" },
      { label: "Content Calendar", href: "/admin/calendar" },
      { label: "Ad Manager", href: "/admin/ads" },
      { label: "Attribution", href: "/admin/attribution" },
      { label: "AI Plays", href: "/admin/plays" },
    ],
  },
  {
    label: "Live Data",
    items: [
      { label: "Analytics", href: "/admin/analytics" },
      { label: "Reviews", href: "/admin/reviews" },
      { label: "Social Media", href: "/admin/social" },
      { label: "SEO & Rankings", href: "/admin/seo" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Website Pages", href: "/admin/pages" },
      { label: "Bookings", href: "/admin/bookings" },
      { label: "Value Delivered", href: "/admin/impact" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { label: "Site Settings", href: "/admin/settings" },
      { label: "AI Connection (MCP)", href: "/admin/mcp" },
      { label: "Ad Tool Stack", href: "/admin/tools" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-[260px] glass-sidebar h-screen flex flex-col flex-shrink-0 relative z-20">
      <div className="px-6 py-6 border-b border-teal/10">
        <Link href="/admin" className="flex flex-col">
          <span className="text-display text-warm-white text-xl tracking-wider">CORTEX</span>
          <span className="text-warm-white/40 text-[9px] font-body tracking-[0.35em] uppercase mt-0.5">
            Operator OS · Bajablue
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-6 text-warm-white/20 text-[9px] font-body tracking-[0.3em] uppercase mb-2">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-6 py-2.5 text-sm font-body transition-colors duration-200 ${
                    isActive
                      ? "text-teal-light border-l-2 border-teal glass-stat"
                      : "text-warm-white/50 hover:text-warm-white/80 hover:bg-white/[0.03] border-l-2 border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-teal/10">
        <p className="text-warm-white/30 text-[10px] font-body truncate mb-2">{user?.email}</p>
        <button
          onClick={signOut}
          className="text-warm-white/30 hover:text-warm-white/60 text-xs font-body transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
