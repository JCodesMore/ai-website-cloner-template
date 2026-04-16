"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CircleDot,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  Bot,
  MoreHorizontal,
  Pencil,
  Copy,
  Archive,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NewIssueModal } from "@/components/platform/Modals";

export const ALL_ISSUES = [
  {
    id: "ISS-145",
    title: "Implement OAuth2 PKCE flow for mobile clients",
    agent: "Dev Agent",
    priority: "high",
    status: "in_progress",
    project: "Backend Infra",
    updated: "just now",
    labels: ["auth", "mobile"],
  },
  {
    id: "ISS-144",
    title: "Write unit tests for payment processing service",
    agent: "QA Agent",
    priority: "high",
    status: "in_progress",
    project: "Backend Infra",
    updated: "5m ago",
    labels: ["testing", "payments"],
  },
  {
    id: "ISS-143",
    title: "Optimize database queries in reporting module",
    agent: "Dev Agent",
    priority: "medium",
    status: "in_review",
    project: "Backend Infra",
    updated: "20m ago",
    labels: ["performance", "db"],
  },
  {
    id: "ISS-142",
    title: "Implement rate limiting on API endpoints",
    agent: "Dev Agent",
    priority: "high",
    status: "in_progress",
    project: "Backend Infra",
    updated: "1h ago",
    labels: ["security", "api"],
  },
  {
    id: "ISS-141",
    title: "Update CI/CD pipeline for new deployment strategy",
    agent: "Dev Agent",
    priority: "medium",
    status: "in_progress",
    project: "Mobile App",
    updated: "2h ago",
    labels: ["devops"],
  },
  {
    id: "ISS-140",
    title: "Audit user permissions and access controls",
    agent: "QA Agent",
    priority: "high",
    status: "in_review",
    project: "Backend Infra",
    updated: "3h ago",
    labels: ["security"],
  },
  {
    id: "ISS-139",
    title: "Refactor legacy authentication middleware",
    agent: "Dev Agent",
    priority: "medium",
    status: "completed",
    project: "Backend Infra",
    updated: "5h ago",
    labels: ["auth", "refactor"],
  },
  {
    id: "ISS-138",
    title: "Migrate legacy endpoints to new auth system",
    agent: "Dev Agent",
    priority: "medium",
    status: "completed",
    project: "Backend Infra",
    updated: "8h ago",
    labels: ["auth", "migration"],
  },
  {
    id: "ISS-137",
    title: "Generate API documentation from OpenAPI spec",
    agent: "Docs Agent",
    priority: "low",
    status: "error",
    project: "Marketing Site",
    updated: "1d ago",
    labels: ["docs"],
  },
  {
    id: "ISS-136",
    title: "Set up monitoring dashboards in Grafana",
    agent: "PM Agent",
    priority: "low",
    status: "completed",
    project: "Backend Infra",
    updated: "2d ago",
    labels: ["monitoring"],
  },
  {
    id: "ISS-135",
    title: "Push notifications for iOS and Android",
    agent: "Dev Agent",
    priority: "medium",
    status: "in_progress",
    project: "Mobile App",
    updated: "2d ago",
    labels: ["mobile", "notifications"],
  },
  {
    id: "ISS-134",
    title: "SEO optimization for landing pages",
    agent: "PM Agent",
    priority: "low",
    status: "in_review",
    project: "Marketing Site",
    updated: "3d ago",
    labels: ["seo", "frontend"],
  },
];

const STATUS_TABS = ["all", "in_progress", "in_review", "completed", "error"] as const;

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    case "in_progress":
      return <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />;
    case "in_review":
      return <Clock className="w-3.5 h-3.5 text-yellow-400" />;
    case "error":
      return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    default:
      return <CircleDot className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    high: "text-red-400 bg-red-400/10 border-red-400/20",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    low: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
  };
  return (
    <span
      className={cn(
        "text-[10px] px-1.5 py-0.5 border font-medium uppercase tracking-wide rounded-full",
        map[priority]
      )}
    >
      {priority}
    </span>
  );
}

function RowDropdown({
  issueId,
  open,
  onClose,
}: {
  issueId: string;
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;

  const itemCls =
    "flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent/50 cursor-pointer transition-colors";

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-xl border border-border bg-popover shadow-xl slide-down"
    >
      <div className={itemCls}>
        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        Edit
      </div>
      <div className={itemCls}>
        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        Duplicate
      </div>
      <div className={cn(itemCls, "justify-between")}>
        <span className="flex items-center gap-2">
          <CircleDot className="w-3.5 h-3.5 text-muted-foreground" />
          Change Status
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className={itemCls}>
        <Archive className="w-3.5 h-3.5 text-muted-foreground" />
        Archive
      </div>
      <div className={cn(itemCls, "text-red-400")}>
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </div>
    </div>
  );
}

function IssuesPageInner() {
  const [issues, setIssues] = useState(ALL_ISSUES);
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setModalOpen(true);
    }
  }, [searchParams]);

  const filtered = issues.filter((issue) => {
    if (activeTab !== "all" && issue.status !== activeTab) return false;
    if (
      search &&
      !issue.title.toLowerCase().includes(search.toLowerCase()) &&
      !issue.id.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const tabLabel: Record<string, string> = {
    all: "All",
    in_progress: "In Progress",
    in_review: "In Review",
    completed: "Done",
    error: "Error",
  };

  const counts: Record<string, number> = {};
  STATUS_TABS.forEach((t) => {
    counts[t] = t === "all" ? issues.length : issues.filter((i) => i.status === t).length;
  });

  return (
    <div className="h-full flex flex-col">
      <NewIssueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(form) => {
          const newId = `ISS-${146 + issues.length - ALL_ISSUES.length}`;
          setIssues((prev) => [
            {
              id: newId,
              title: form.title,
              agent: form.agent,
              priority: form.priority,
              project: form.project,
              status: "in_progress",
              updated: "just now",
              labels: [],
            },
            ...prev,
          ]);
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <CircleDot className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold">Issues</h1>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {issues.length}
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90 transition-colors font-medium rounded-full"
        >
          <Plus className="w-3.5 h-3.5" />
          New Issue
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border shrink-0">
        {/* Tabs */}
        <div className="flex items-center gap-0.5 flex-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors rounded-full",
                activeTab === tab
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {tabLabel[tab]}
              <span
                className={cn(
                  "text-[10px] px-1 rounded-full",
                  activeTab === tab ? "bg-border text-foreground" : "text-muted-foreground"
                )}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 pr-3 py-1.5 text-xs bg-muted border border-border focus:outline-none focus:border-ring w-48 placeholder:text-muted-foreground rounded-xl"
          />
        </div>

        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-2.5 py-1.5 hover:bg-accent/50 transition-colors rounded-xl">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Table header */}
      <div className="grid items-center gap-4 px-6 py-2 border-b border-border text-xs text-muted-foreground bg-muted/30 shrink-0" style={{ gridTemplateColumns: "auto 1fr auto auto auto auto auto" }}>
        <span className="w-4" />
        <span>Title</span>
        <span className="w-20 text-center">Priority</span>
        <span className="w-24">Agent</span>
        <span className="w-28">Project</span>
        <span className="w-16 text-right">Updated</span>
        <span className="w-6" />
      </div>

      {/* Issue rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CircleDot className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No issues found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Try adjusting your filters or search
            </p>
          </div>
        ) : (
          filtered.map((issue) => (
            <div
              key={issue.id}
              onClick={() => router.push(`/issues/${issue.id.toLowerCase()}`)}
              className="grid items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors cursor-pointer group"
              style={{ gridTemplateColumns: "auto 1fr auto auto auto auto auto" }}
            >
              <StatusIcon status={issue.status} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono shrink-0">
                    {issue.id}
                  </span>
                  <span className="text-sm text-foreground truncate group-hover:text-foreground">
                    {issue.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {issue.labels.map((l) => (
                    <span
                      key={l}
                      className="text-[10px] text-muted-foreground/60 border border-border px-1 py-0.5 rounded-full"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-20 flex justify-center">
                <PriorityBadge priority={issue.priority} />
              </div>
              <div className="w-24 flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-muted-foreground/50 shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{issue.agent}</span>
              </div>
              <div className="w-28">
                <span className="text-xs text-muted-foreground/70 truncate">{issue.project}</span>
              </div>
              <div className="w-16 text-right">
                <span className="text-xs text-muted-foreground/50">{issue.updated}</span>
              </div>
              {/* Three-dots menu */}
              <div
                className="w-6 flex justify-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(openDropdownId === issue.id ? null : issue.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1 rounded-lg hover:bg-accent/70 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
                <RowDropdown
                  issueId={issue.id}
                  open={openDropdownId === issue.id}
                  onClose={() => setOpenDropdownId(null)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function IssuesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading...</div>}>
      <IssuesPageInner />
    </Suspense>
  );
}
