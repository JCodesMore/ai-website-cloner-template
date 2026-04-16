"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Inbox, CircleDot, Repeat2, Target, Network,
  Boxes, DollarSign, History, Settings, SquarePen, Search,
  Bot, CheckSquare, ChevronDown, Plus, Cpu, Globe, Layers,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useShell } from "./PlatformShell";
import { MyaiCompanyLogo } from "./Logo";
import { useI18n } from "@/context/i18n";
import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItemDef {
  labelKey: keyof ReturnType<typeof useI18n>["t"];
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const SIDEBAR_AGENTS = [
  { name: "Dev Agent", status: "active" },
  { name: "QA Agent", status: "active" },
  { name: "PM Agent", status: "paused" },
  { name: "Docs Agent", status: "error" },
] as const;

type AgentStatus = (typeof SIDEBAR_AGENTS)[number]["status"];

const STATUS_DOT: Record<AgentStatus, string> = {
  active: "bg-emerald-400",
  paused: "bg-yellow-400",
  error: "bg-red-400",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavItem({
  href,
  icon: Icon,
  label,
  badge,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 px-2.5 py-1.5 text-sm rounded-lg transition-all duration-150 relative",
        isActive
          ? "bg-sidebar-primary/15 text-sidebar-primary font-medium"
          : "text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {/* Active left indicator */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-sidebar-primary rounded-full" />
      )}
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge != null && badge > 0 && (
        <span className="text-xs bg-sidebar-primary text-sidebar-primary-foreground px-1.5 py-0.5 rounded-full font-semibold min-w-[18px] text-center leading-none">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 py-1 text-[10px] font-semibold text-sidebar-foreground/35 uppercase tracking-widest">
      {children}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { openCommandPalette, openNewProject, openNewAgent, projects, activeProject, setActiveProject } = useShell();
  const { t } = useI18n();
  const [projectOpen, setProjectOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!projectOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [projectOpen]);

  const activeProjectData = projects.find((p) => p.name === activeProject) ?? null;

  const navItems: NavItemDef[] = [
    { labelKey: "dashboard" as const, href: "/", icon: LayoutDashboard },
    { labelKey: "inbox" as const, href: "/inbox", icon: Inbox, badge: 3 },
  ];
  const workItems: NavItemDef[] = [
    { labelKey: "issues" as const, href: "/issues", icon: CircleDot },
    { labelKey: "routines" as const, href: "/routines", icon: Repeat2 },
    { labelKey: "goals" as const, href: "/goals", icon: Target },
    { labelKey: "approvals" as const, href: "/approvals", icon: CheckSquare },
  ];
  const companyItems: NavItemDef[] = [
    { labelKey: "agents" as const, href: "/agents", icon: Bot },
    { labelKey: "org" as const, href: "/org", icon: Network },
    { labelKey: "skills" as const, href: "/skills", icon: Boxes },
    { labelKey: "costs" as const, href: "/costs", icon: DollarSign },
    { labelKey: "activity" as const, href: "/activity", icon: History },
    { labelKey: "models" as const, href: "/models", icon: Cpu },
    { labelKey: "settings" as const, href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-60 shrink-0 h-full flex flex-col bg-sidebar/90 backdrop-blur-xl border-r border-sidebar-border">
      {/* Company header */}
      <div className="flex items-center gap-2.5 px-3 py-3 border-b border-sidebar-border">
        <div className="shrink-0 rounded-xl overflow-hidden shadow-sm">
          <MyaiCompanyLogo size={28} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-sidebar-foreground truncate block leading-tight">
            MyaiCompany
          </span>
          <span className="inline-flex items-center rounded-full text-[9px] font-semibold px-1.5 py-px bg-gradient-to-r from-violet-600 to-indigo-600 text-white leading-none mt-0.5">
            PRO
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-sidebar-foreground/35 shrink-0" />
      </div>

      {/* Project switcher */}
      <div className="px-1 py-2 border-b border-sidebar-border relative" ref={dropdownRef}>
        <button
          onClick={() => setProjectOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-3 py-2 mx-0 rounded-xl hover:bg-sidebar-accent/50 cursor-pointer transition-all duration-150"
        >
          {activeProjectData ? (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: activeProjectData.color }}
            />
          ) : (
            <Layers className="w-3.5 h-3.5 text-sidebar-foreground/50 shrink-0" />
          )}
          <span className="flex-1 text-left text-sm text-sidebar-foreground/80 truncate">
            {activeProject ?? "All Projects"}
          </span>
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-sidebar-foreground/35 shrink-0 transition-transform duration-150",
              projectOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {projectOpen && (
          <div className="absolute left-2 right-2 top-full mt-1 z-50 rounded-xl border border-sidebar-border bg-sidebar shadow-xl slide-down overflow-hidden">
            {/* All Projects */}
            <button
              onClick={() => { setActiveProject(null); setProjectOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg mx-1 cursor-pointer transition-colors text-left",
                "hover:bg-sidebar-accent/60",
                activeProject === null
                  ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                  : "text-sidebar-foreground/70"
              )}
              style={{ width: "calc(100% - 8px)" }}
            >
              <Globe className="w-3.5 h-3.5 text-sidebar-foreground/50 shrink-0" />
              <span className="flex-1">All Projects</span>
              {activeProject === null && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>

            {/* Project list */}
            {projects.map((p) => (
              <button
                key={p.name}
                onClick={() => { setActiveProject(p.name); setProjectOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg mx-1 cursor-pointer transition-colors text-left",
                  "hover:bg-sidebar-accent/60",
                  activeProject === p.name
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                    : "text-sidebar-foreground/70"
                )}
                style={{ width: "calc(100% - 8px)" }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <span className="flex-1 truncate">{p.name}</span>
                {activeProject === p.name && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}

            {/* New Project */}
            <div className="border-t border-sidebar-border/50 mt-1 pt-1 pb-1">
              <button
                onClick={() => { openNewProject(); setProjectOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg mx-1 cursor-pointer transition-colors text-left text-sidebar-foreground/45 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                style={{ width: "calc(100% - 8px)" }}
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search + New Issue */}
      <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-sidebar-border">
        <button
          onClick={openCommandPalette}
          className="flex-1 flex items-center gap-2 px-2.5 py-1.5 text-sm text-sidebar-foreground/45 hover:text-sidebar-foreground bg-sidebar-accent/30 hover:bg-sidebar-accent/60 rounded-lg border border-transparent hover:border-sidebar-border/60 transition-all duration-150"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left truncate">{t.search}</span>
          <span className="text-[10px] border border-sidebar-border/50 px-1 rounded text-sidebar-foreground/25 font-mono">
            ⌘K
          </span>
        </button>
        <Link
          href="/issues?new=1"
          className="p-1.5 hover:bg-sidebar-accent/60 rounded-lg transition-colors text-sidebar-foreground/45 hover:text-sidebar-foreground"
          title="New issue"
        >
          <SquarePen className="w-4 h-4" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-1.5">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t[item.labelKey]}
            badge={item.badge}
          />
        ))}

        {/* Work section */}
        <div className="pt-4 pb-1">
          <SectionLabel>{t.work}</SectionLabel>
        </div>
        {workItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t[item.labelKey]}
          />
        ))}

        {/* Company section */}
        <div className="pt-4 pb-1">
          <SectionLabel>{t.company}</SectionLabel>
        </div>
        {companyItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t[item.labelKey]}
          />
        ))}

        {/* Projects */}
        <div className="pt-4 pb-1">
          <div className="flex items-center justify-between px-2.5 py-1">
            <span className="text-[10px] font-semibold text-sidebar-foreground/35 uppercase tracking-widest">
              {t.projects}
            </span>
            <button
              onClick={openNewProject}
              className="p-0.5 hover:bg-sidebar-accent/60 rounded-md transition-colors text-sidebar-foreground/30 hover:text-sidebar-foreground/70"
              title="New project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {projects.map((p) => (
          <Link
            key={p.name}
            href={`/issues?project=${encodeURIComponent(p.name)}`}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-1.5 text-sm hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all duration-150",
              activeProject === p.name
                ? "text-sidebar-foreground font-medium"
                : "text-sidebar-foreground/65"
            )}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span className="truncate flex-1">{p.name}</span>
            {activeProject === p.name && (
              <Check className="w-3 h-3 shrink-0 text-sidebar-foreground/60" />
            )}
          </Link>
        ))}

        {/* Agents */}
        <div className="pt-4 pb-1">
          <div className="flex items-center justify-between px-2.5 py-1">
            <span className="text-[10px] font-semibold text-sidebar-foreground/35 uppercase tracking-widest">
              {t.agents}
            </span>
            <button
              onClick={openNewAgent}
              className="p-0.5 hover:bg-sidebar-accent/60 rounded-md transition-colors text-sidebar-foreground/30 hover:text-sidebar-foreground/70"
              title="New agent"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {SIDEBAR_AGENTS.map((a) => (
          <Link
            key={a.name}
            href="/agents"
            className="flex items-center gap-2.5 px-2.5 py-1.5 text-sm text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all duration-150"
          >
            <span
              className={cn("w-1.5 h-1.5 rounded-full shrink-0", STATUS_DOT[a.status])}
            />
            <span className="truncate">{a.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
