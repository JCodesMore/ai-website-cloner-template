"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  CalendarDays,
  Sparkles,
  Users,
  Settings,
  Activity,
  ChevronLeft,
} from "lucide-react";

const items = [
  { icon: Home, href: "/", label: "Home" },
  { icon: Search, href: "/search", label: "Search" },
  { icon: CalendarDays, href: "/schedule", label: "Schedule" },
  { icon: Sparkles, href: "/seasonal", label: "Seasonal" },
  { icon: Users, href: "/community", label: "Community" },
  { icon: Settings, href: "/settings", label: "Settings" },
  { icon: Activity, href: "/activity", label: "Activity" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 z-[1001] hidden h-full w-[64px] flex-col items-center border-r border-[var(--border)] bg-[var(--sidebar)] py-4 backdrop-blur-xl md:flex">
      <nav className="mt-[68px] flex flex-1 flex-col items-center gap-1">
        {items.map(({ icon: Icon, href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={`flex size-11 items-center justify-center rounded-xl transition-colors ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-sidebar-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <Icon className="size-[22px]" />
            </Link>
          );
        })}
      </nav>
      <button
        aria-label="Collapse"
        className="mb-2 flex size-11 items-center justify-center rounded-xl text-sidebar-foreground hover:bg-white/5 hover:text-foreground"
      >
        <ChevronLeft className="size-5" />
      </button>
    </aside>
  );
}
