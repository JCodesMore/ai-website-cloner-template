"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  AlertTriangle,
  XCircle,
  CheckSquare,
  FileText,
  Check,
  Clock,
  X,
  Send,
  Download,
  Inbox,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type ItemType = "message" | "alert" | "report" | "approval" | "error";
type Section = "inbox" | "done" | "later";
type FilterType = "all" | "alerts" | "reports" | "messages" | "errors";

interface InboxItem {
  id: number;
  section: Section;
  type: ItemType;
  agent: string;
  initials: string;
  color: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  snoozedUntil?: string;
  messages?: { from: string; time: string; text: string }[];
  document?: {
    title: string;
    sections: { heading: string; body: string }[];
    metadata: { author: string; created: string; pages: number };
  };
  agentContext?: {
    status: "active" | "paused" | "error";
    currentTask: string | null;
    lastRun: string;
    runsToday: number;
    budget: number;
    spend: number;
  };
}

// ── Seed data ──────────────────────────────────────────────────────────────

const INBOX_ITEMS: InboxItem[] = [
  {
    id: 1, section: "inbox", type: "message", unread: true,
    agent: "Dev Agent", initials: "DA", color: "#6366f1",
    subject: "PR Ready for Review", preview: "OAuth2 PKCE implementation complete, all tests passing...",
    time: "2m ago",
    messages: [
      { from: "Dev Agent", time: "2m ago", text: "I've completed the OAuth2 PKCE implementation. The PR is ready for your review. I've added unit tests and updated the documentation. All 247 tests passing." },
      { from: "You", time: "1m ago", text: "Great, I'll take a look. Did you handle the token refresh edge case?" },
      { from: "Dev Agent", time: "30s ago", text: "Yes — I added refresh token rotation with automatic retry logic for mid-request expirations. The edge case is covered in test ISS-145-token-refresh." },
    ],
    agentContext: { status: "active", currentTask: "Awaiting PR review", lastRun: "2m ago", runsToday: 8, budget: 150, spend: 84.5 },
  },
  {
    id: 2, section: "inbox", type: "alert", unread: true,
    agent: "QA Agent", initials: "QA", color: "#f59e0b",
    subject: "Budget Alert: 84% used", preview: "Dev Agent has consumed 84% of monthly budget...",
    time: "8m ago",
    messages: [
      { from: "QA Agent", time: "8m ago", text: "⚠️ Budget Alert: Dev Agent has consumed $126 of $150 (84%) this month. At current burn rate (~$3.20/day), the budget will be exhausted in 7 days. Recommend reviewing or increasing budget." },
    ],
    agentContext: { status: "active", currentTask: "Monitoring budgets", lastRun: "8m ago", runsToday: 4, budget: 100, spend: 42 },
  },
  {
    id: 3, section: "inbox", type: "error", unread: true,
    agent: "Docs Agent", initials: "DO", color: "#ef4444",
    subject: "Error: Permission Denied", preview: "EACCES: permission denied, open '/srv/api/openapi.json'...",
    time: "1h ago",
    messages: [
      { from: "Docs Agent", time: "1h ago", text: "Task failed: EACCES: permission denied, open '/srv/api/openapi.json'. I've paused documentation generation until this is resolved. File path: /srv/api/openapi.json" },
      { from: "You", time: "50m ago", text: "I'll fix the permissions. Retry in 30 minutes." },
      { from: "Docs Agent", time: "30m ago", text: "Retried — still receiving EACCES. The permissions may require a process restart to take effect." },
    ],
    agentContext: { status: "error", currentTask: null, lastRun: "30m ago", runsToday: 0, budget: 50, spend: 6.8 },
  },
  {
    id: 4, section: "inbox", type: "approval", unread: false,
    agent: "Dev Agent", initials: "DA", color: "#6366f1",
    subject: "Approval Required: Deploy v2.3.1", preview: "Staging has been stable for 48h. Ready for production...",
    time: "2h ago",
    messages: [
      { from: "Dev Agent", time: "2h ago", text: "v2.3.1 is ready for production deployment. Staging has been running cleanly for 48h. All tests pass. Rollback plan is prepared. Requesting your approval to proceed." },
    ],
    agentContext: { status: "active", currentTask: "Awaiting deployment approval", lastRun: "2h ago", runsToday: 3, budget: 150, spend: 84.5 },
  },
  {
    id: 5, section: "inbox", type: "report", unread: false,
    agent: "PM Agent", initials: "PM", color: "#10b981",
    subject: "Sprint 15 Report", preview: "18 story points delivered, 12% above velocity target...",
    time: "3d ago",
    document: {
      title: "Sprint 15 — Velocity & Delivery Report",
      sections: [
        { heading: "Executive Summary", body: "Sprint 15 delivered 18 story points across 12 issues, exceeding the velocity target by 12%. Key deliverables: OAuth2 PKCE flow, API rate limiting, and expanded test coverage." },
        { heading: "Completed Issues", body: "ISS-138 Migrate legacy endpoints · ISS-139 Refactor auth middleware · ISS-140 Audit permissions · ISS-143 Optimize DB queries\n\n4 issues carried to Sprint 16: ISS-141 (CI/CD), ISS-142 (Rate limiting — in review)." },
        { heading: "Metrics", body: "Velocity: 18 pts (+12% vs Sprint 14) · Coverage: 84% (+3%) · PR merge time: avg 4.2h · Bug escape rate: 0%" },
        { heading: "Sprint 16 Priorities", body: "Mobile push notifications, SEO optimisation, security audit completion. Estimated velocity: 16–20 pts." },
      ],
      metadata: { author: "PM Agent", created: "Apr 14, 2026", pages: 3 },
    },
    agentContext: { status: "paused", currentTask: null, lastRun: "3d ago", runsToday: 0, budget: 80, spend: 18 },
  },
  {
    id: 6, section: "done", type: "message", unread: false,
    agent: "QA Agent", initials: "QA", color: "#f59e0b",
    subject: "Test Suite: 247 Tests Passing", preview: "Coverage at 84%, up from 71%...",
    time: "1d ago",
    messages: [
      { from: "QA Agent", time: "1d ago", text: "All 247 tests passing. Code coverage at 84% (+13%). Two edge cases in payment service logged as ISS-146 and ISS-147." },
    ],
    agentContext: { status: "active", currentTask: "Writing payment tests", lastRun: "5m ago", runsToday: 4, budget: 100, spend: 42 },
  },
  {
    id: 7, section: "done", type: "report", unread: false,
    agent: "QA Agent", initials: "QA", color: "#f59e0b",
    subject: "Security Audit Report Q2", preview: "47 endpoints tested, 3 critical findings resolved...",
    time: "5d ago",
    document: {
      title: "Platform Security Audit — Q2 2026",
      sections: [
        { heading: "Scope", body: "Full audit: authentication flows, API endpoints, user data handling, infrastructure. 47 endpoints tested, 8 agent workflows reviewed." },
        { heading: "Critical Findings", body: "1. Rate limiting absent on /api/auth/login — FIXED (ISS-142)\n2. Admin route permissions not validated — IN PROGRESS (ISS-140)\n3. API tokens in plaintext dev config — FIXED" },
        { heading: "Compliance", body: "SOC 2 Type II: 87% (target 100% Q3) · GDPR: Compliant · ISO 27001: Scheduled Q3 2026" },
      ],
      metadata: { author: "QA Agent", created: "Apr 11, 2026", pages: 5 },
    },
    agentContext: { status: "active", currentTask: "Writing payment tests", lastRun: "5m ago", runsToday: 4, budget: 100, spend: 42 },
  },
  {
    id: 8, section: "later", type: "message", unread: false,
    agent: "PM Agent", initials: "PM", color: "#10b981",
    subject: "Sprint 16 Planning", preview: "Scheduled for Monday 8:00 AM...",
    time: "In 2 days",
    snoozedUntil: "Mon, Apr 20 · 8:00 AM",
    messages: [
      { from: "PM Agent", time: "2d ago", text: "Sprint 16 planning is prepared. I've drafted the board with 14 candidate issues. Ready to review when you are — snoozed until Monday." },
    ],
    agentContext: { status: "paused", currentTask: null, lastRun: "2d ago", runsToday: 0, budget: 80, spend: 18 },
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function typeIcon(type: ItemType) {
  switch (type) {
    case "message":  return <MessageSquare className="w-3.5 h-3.5 text-violet-400" />;
    case "alert":    return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    case "error":    return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    case "approval": return <CheckSquare className="w-3.5 h-3.5 text-blue-400" />;
    case "report":   return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
  }
}

function typeIconBg(type: ItemType): string {
  switch (type) {
    case "message":  return "bg-violet-500/15";
    case "alert":    return "bg-amber-500/15";
    case "error":    return "bg-red-500/15";
    case "approval": return "bg-blue-500/15";
    case "report":   return "bg-emerald-500/15";
  }
}

function statusDotColor(status: "active" | "paused" | "error"): string {
  switch (status) {
    case "active": return "bg-emerald-400";
    case "paused": return "bg-yellow-400";
    case "error":  return "bg-red-400";
  }
}

function renderBodyText(body: string) {
  return body.split("\n\n").map((para, pi) => (
    <p key={pi} className={cn("text-sm leading-relaxed", pi > 0 && "mt-3")} style={{ color: "hsl(var(--foreground) / 0.85)" }}>
      {para.split("\n").map((line, li, arr) => (
        <span key={li}>{line}{li < arr.length - 1 && <br />}</span>
      ))}
    </p>
  ));
}

// ── Sub-components ─────────────────────────────────────────────────────────

function TypeIconBadge({ type }: { type: ItemType }) {
  return (
    <div
      className={cn("flex items-center justify-center rounded-lg shrink-0", typeIconBg(type))}
      style={{ width: 28, height: 28 }}
    >
      {typeIcon(type)}
    </div>
  );
}

function AgentAvatar({
  initials,
  color,
  size = 28,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  const fontSize = size <= 20 ? 9 : size <= 28 ? 10 : 11;
  return (
    <div
      className="flex items-center justify-center font-semibold text-white shrink-0 rounded-lg"
      style={{ width: size, height: size, backgroundColor: color, fontSize }}
    >
      {initials}
    </div>
  );
}

function ContextSidebar({ item }: { item: InboxItem }) {
  const ctx = item.agentContext;
  if (!ctx) return null;
  const pct = Math.min(100, Math.round((ctx.spend / ctx.budget) * 100));
  const barColor = pct >= 85 ? "#ef4444" : pct >= 65 ? "#f59e0b" : "#10b981";

  return (
    <div className="border-l border-border h-full overflow-y-auto" style={{ width: 220 }}>
      <div className="p-4 space-y-4">
        {/* Agent header */}
        <div className="flex items-center gap-2.5">
          <AgentAvatar initials={item.initials} color={item.color} size={32} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{item.agent}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", statusDotColor(ctx.status))} />
              <span className="text-[10px] text-muted-foreground capitalize">{ctx.status}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Current task */}
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Current Task</p>
            <p className="text-xs text-foreground/80">{ctx.currentTask ?? "Idle"}</p>
          </div>

          {/* Last run */}
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Last Run</p>
            <p className="text-xs text-foreground/80">{ctx.lastRun}</p>
          </div>

          {/* Runs today */}
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">Today&apos;s Runs</p>
            <p className="text-xs text-foreground/80">{ctx.runsToday}</p>
          </div>

          {/* Budget */}
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Budget</p>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">${ctx.spend} / ${ctx.budget}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageThread({
  item,
  replyText,
  onReplyChange,
  onSend,
  onMarkDone,
  onSnooze,
}: {
  item: InboxItem;
  replyText: string;
  onReplyChange: (v: string) => void;
  onSend: () => void;
  onMarkDone: () => void;
  onSnooze: () => void;
}) {
  return (
    <div className="flex flex-col h-full min-w-0 flex-1">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border px-4 shrink-0" style={{ paddingTop: 10, paddingBottom: 10 }}>
        <AgentAvatar initials={item.initials} color={item.color} size={28} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate leading-none mb-0.5">{item.agent}</p>
          <p className="text-xs font-semibold text-foreground truncate">{item.subject}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onMarkDone}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          >
            <Check className="w-3 h-3" />
            {item.section === "done" ? "Undo Done" : "Mark Done"}
          </button>
          <button
            onClick={onSnooze}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          >
            <Clock className="w-3 h-3" />
            Snooze
          </button>
        </div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {(item.messages ?? []).map((msg, i) => {
          const isYou = msg.from === "You";
          return (
            <div key={i} className={cn("flex gap-2.5", isYou && "flex-row-reverse")}>
              <div
                className="w-5 h-5 flex items-center justify-center text-white font-semibold shrink-0 rounded-md"
                style={{ backgroundColor: isYou ? "#64748b" : item.color, fontSize: 9 }}
              >
                {isYou ? "Y" : item.initials}
              </div>
              <div className={cn("flex flex-col", isYou ? "items-end" : "items-start")} style={{ maxWidth: "65%" }}>
                <div
                  className={cn(
                    "px-3 py-2 text-sm leading-relaxed",
                    isYou
                      ? "rounded-2xl rounded-tr-sm border border-primary/20"
                      : "rounded-2xl rounded-tl-sm bg-card border border-border/60"
                  )}
                  style={isYou ? { backgroundColor: "hsl(var(--primary) / 0.15)" } : undefined}
                >
                  {msg.text}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{msg.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply bar */}
      <div className="border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => onReplyChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onSend(); } }}
            placeholder="Reply..."
            className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
          />
          <button
            onClick={onSend}
            disabled={!replyText.trim()}
            className="flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0"
            style={{ width: 32, height: 32 }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentViewer({
  item,
  onMarkDone,
  onSnooze,
}: {
  item: InboxItem;
  onMarkDone: () => void;
  onSnooze: () => void;
}) {
  const doc = item.document;
  if (!doc) return null;
  return (
    <div className="flex flex-col h-full min-w-0 flex-1">
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b border-border px-4 shrink-0" style={{ paddingTop: 10, paddingBottom: 10 }}>
        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{doc.title}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{doc.metadata.author} · {doc.metadata.created} · {doc.metadata.pages} pages</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onMarkDone}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          >
            <Check className="w-3 h-3" />
            {item.section === "done" ? "Undo Done" : "Mark Done"}
          </button>
          <button
            onClick={onSnooze}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
          >
            <Clock className="w-3 h-3" />
            Snooze
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer">
            <Download className="w-3 h-3" />
            Download
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {doc.sections.map((section, si) => (
          <div key={si} className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{section.heading}</h3>
            {renderBodyText(section.body)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [items, setItems] = useState<InboxItem[]>(INBOX_ITEMS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("inbox");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [replyText, setReplyText] = useState("");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const selectedItem = items.find((it) => it.id === selectedId) ?? null;

  const inboxCount = items.filter((it) => it.section === "inbox" && it.unread).length;

  const visibleItems = items.filter((it) => {
    if (it.section !== activeSection) return false;
    if (activeFilter === "alerts") return it.type === "alert";
    if (activeFilter === "reports") return it.type === "report";
    if (activeFilter === "messages") return it.type === "message" || it.type === "approval";
    if (activeFilter === "errors") return it.type === "error";
    return true;
  });

  function selectItem(id: number) {
    setSelectedId(id);
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, unread: false } : it)));
    setReplyText("");
  }

  function markDone(id: number) {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        return { ...it, section: it.section === "done" ? "inbox" : "done" };
      })
    );
  }

  function moveLater(id: number) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, section: "later" } : it))
    );
  }

  function dismiss(id: number) {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleSend() {
    if (!replyText.trim() || !selectedId) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === selectedId
          ? { ...it, messages: [...(it.messages ?? []), { from: "You", time: "just now", text: replyText.trim() }] }
          : it
      )
    );
    setReplyText("");
  }

  const SECTIONS: { id: Section; label: string }[] = [
    { id: "inbox", label: "Inbox" },
    { id: "done", label: "Done" },
    { id: "later", label: "Later" },
  ];

  const FILTERS: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "alerts", label: "Alerts" },
    { id: "reports", label: "Reports" },
    { id: "messages", label: "Messages" },
    { id: "errors", label: "Errors" },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* ── Left panel ── */}
      <div className="flex flex-col shrink-0 border-r border-border h-full" style={{ width: 300 }}>

        {/* Page header */}
        <div className="px-4 pt-4 pb-3 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-base font-semibold text-foreground">Inbox</h1>
            {inboxCount > 0 && (
              <span className="flex items-center justify-center h-5 min-w-5 px-1.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">
                {inboxCount}
              </span>
            )}
          </div>

          {/* Section tabs — Close.com underline style */}
          <div className="flex border-b border-border mb-3">
            {SECTIONS.map((s) => {
              const count = s.id === "inbox" ? items.filter((it) => it.section === "inbox").length
                : s.id === "done" ? items.filter((it) => it.section === "done").length
                : items.filter((it) => it.section === "later").length;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setActiveSection(s.id); setSelectedId(null); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors cursor-pointer border-b-2 -mb-px",
                    isActive
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s.label}
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                    isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filter chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-full shrink-0 transition-colors cursor-pointer",
                  activeFilter === f.id
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto py-1">
          {visibleItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-muted-foreground">
              <Inbox className="w-6 h-6 opacity-30" />
              <p className="text-xs">Nothing here</p>
            </div>
          ) : (
            visibleItems.map((item) => {
              const isSelected = selectedId === item.id;
              const isHovered = hoveredId === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => selectItem(item.id)}
                  className={cn(
                    "relative flex items-start gap-2.5 px-3 py-2.5 cursor-pointer transition-colors mx-1 rounded-lg mb-0.5",
                    isSelected
                      ? "bg-accent/60 border-l-2 border-primary"
                      : "hover:bg-accent/30 border-l-2 border-transparent"
                  )}
                  style={{ width: "calc(100% - 8px)" }}
                >
                  <TypeIconBadge type={item.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-medium text-foreground/80 truncate">{item.agent}</span>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">{item.time}</span>
                    </div>
                    <p className={cn("text-sm truncate mb-0.5", item.unread ? "font-semibold text-foreground" : "text-foreground/80")}>
                      {item.subject}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {item.snoozedUntil && <Clock className="w-2.5 h-2.5 text-muted-foreground/60 shrink-0" />}
                      <p className="text-xs text-muted-foreground truncate">
                        {item.snoozedUntil ? `Until ${item.snoozedUntil}` : item.preview}
                      </p>
                    </div>
                  </div>
                  {item.unread && (
                    <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1" style={{ backgroundColor: item.color }} />
                  )}

                  {/* Quick action buttons on hover */}
                  {isHovered && (
                    <div
                      className="absolute flex items-center gap-1"
                      style={{ right: 8, top: "50%", transform: "translateY(-50%)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => markDone(item.id)}
                        title="Mark Done"
                        className="flex items-center justify-center rounded-full bg-muted hover:bg-accent/70 transition-colors cursor-pointer"
                        style={{ width: 24, height: 24 }}
                      >
                        <Check className="w-3 h-3 text-foreground/70" />
                      </button>
                      <button
                        onClick={() => moveLater(item.id)}
                        title="Snooze"
                        className="flex items-center justify-center rounded-full bg-muted hover:bg-accent/70 transition-colors cursor-pointer"
                        style={{ width: 24, height: 24 }}
                      >
                        <Clock className="w-3 h-3 text-foreground/70" />
                      </button>
                      <button
                        onClick={() => dismiss(item.id)}
                        title="Dismiss"
                        className="flex items-center justify-center rounded-full bg-muted hover:bg-accent/70 transition-colors cursor-pointer"
                        style={{ width: 24, height: 24 }}
                      >
                        <X className="w-3 h-3 text-foreground/70" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex h-full min-w-0 overflow-hidden">
        {!selectedItem ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Inbox className="w-10 h-10 opacity-20" />
            <p className="text-sm font-medium">Select an item</p>
            <p className="text-xs opacity-60">Choose a message or report from the left</p>
          </div>
        ) : (
          <>
            {/* Content area */}
            {selectedItem.type === "report" ? (
              <DocumentViewer
                item={selectedItem}
                onMarkDone={() => markDone(selectedItem.id)}
                onSnooze={() => moveLater(selectedItem.id)}
              />
            ) : (
              <MessageThread
                item={selectedItem}
                replyText={replyText}
                onReplyChange={setReplyText}
                onSend={handleSend}
                onMarkDone={() => markDone(selectedItem.id)}
                onSnooze={() => moveLater(selectedItem.id)}
              />
            )}

            {/* Context sidebar */}
            <ContextSidebar item={selectedItem} />
          </>
        )}
      </div>
    </div>
  );
}
