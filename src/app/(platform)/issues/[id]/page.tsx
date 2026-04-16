"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Brain,
  CheckCircle2,
  Circle,
  Code,
  Loader2,
  MessageSquare,
  XCircle,
  Clock,
  CircleDot,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_ISSUES } from "../page";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = {
  step: string;
  duration: number;
  done: boolean;
  active?: boolean;
};

const BASE_STEPS: Step[] = [
  { step: "Analyzing requirements", duration: 800, done: true },
  { step: "Reading relevant codebase", duration: 600, done: true },
  { step: "Planning implementation", duration: 400, done: true },
  { step: "Writing code changes", duration: 1200, done: false, active: true },
  { step: "Running tests", duration: 0, done: false },
  { step: "Creating pull request", duration: 0, done: false },
];

const COMPLETED_STEPS: Step[] = BASE_STEPS.map((s) => ({ ...s, done: true, active: false }));

const ERROR_STEPS: Step[] = [
  { step: "Analyzing requirements", duration: 800, done: true },
  { step: "Reading relevant codebase", duration: 600, done: true },
  { step: "Planning implementation", duration: 400, done: true },
  { step: "Writing code changes", duration: 0, done: false, active: false },
  { step: "Running tests", duration: 0, done: false },
  { step: "Creating pull request", duration: 0, done: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusIcon({ status, size = "sm" }: { status: string; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  switch (status) {
    case "completed":
      return <CheckCircle2 className={cn(cls, "text-emerald-400")} />;
    case "in_progress":
      return <Loader2 className={cn(cls, "text-blue-400 animate-spin")} />;
    case "in_review":
      return <Clock className={cn(cls, "text-yellow-400")} />;
    case "error":
      return <XCircle className={cn(cls, "text-red-400")} />;
    default:
      return <CircleDot className={cn(cls, "text-muted-foreground")} />;
  }
}

function StatusLabel({ status }: { status: string }) {
  const map: Record<string, string> = {
    in_progress: "In Progress",
    in_review: "In Review",
    completed: "Completed",
    error: "Error",
  };
  return <span>{map[status] ?? status}</span>;
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
        "text-[10px] px-2 py-0.5 border font-medium uppercase tracking-wide rounded-full",
        map[priority]
      )}
    >
      {priority}
    </span>
  );
}

// ─── Reasoning Trace ──────────────────────────────────────────────────────────

function ReasoningTrace({ status }: { status: string }) {
  const [visibleCount, setVisibleCount] = useState(0);

  const isLive = status === "in_progress" || status === "in_review";
  const isCompleted = status === "completed";
  const isError = status === "error";

  const steps = isCompleted ? COMPLETED_STEPS : isError ? ERROR_STEPS : BASE_STEPS;
  const maxVisible = isError ? 4 : steps.length;

  useEffect(() => {
    setVisibleCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= maxVisible) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [status, maxVisible]);

  const pulseColor = isLive ? "bg-emerald-400" : "bg-muted-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 mb-4">
      <div className="flex items-center gap-2.5">
        <Brain className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Agent Reasoning</span>
        {isLive && (
          <span className={cn("w-2 h-2 rounded-full animate-pulse", pulseColor)} />
        )}
        {isCompleted && (
          <span className="w-2 h-2 rounded-full bg-muted-foreground" />
        )}
      </div>

      <div className="space-y-2.5 mt-4">
        {steps.slice(0, visibleCount).map((s, i) => (
          <div key={i} className="flex items-center gap-3 text-sm fade-in">
            {s.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : s.active ? (
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            )}
            <span
              className={cn(
                s.done
                  ? "text-foreground"
                  : s.active
                  ? "text-foreground"
                  : "text-muted-foreground/50"
              )}
            >
              {s.step}
            </span>
            {s.duration > 0 && (
              <span className="ml-auto text-[10px] text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded-full font-mono">
                {s.duration}ms
              </span>
            )}
          </div>
        ))}

        {isError && visibleCount >= 4 && (
          <div className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 flex items-start gap-2.5 fade-in">
            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-400 font-medium">Agent encountered an error</p>
              <p className="text-xs text-red-400/70 mt-0.5">
                Failed to generate valid output. The task could not be completed. Review the issue
                and retry.
              </p>
            </div>
          </div>
        )}

        {isCompleted && visibleCount >= steps.length && (
          <div className="mt-2 pt-2 border-t border-border flex items-center gap-2 fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-muted-foreground">Completed in 3.8s</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Code Output ──────────────────────────────────────────────────────────────

function CodeOutput({ issue }: { issue: (typeof ALL_ISSUES)[number] }) {
  const showStatuses = ["in_progress", "in_review", "completed"];
  if (!showStatuses.includes(issue.status)) return null;

  const statusLine =
    issue.status === "completed"
      ? "[status: done]"
      : issue.status === "in_review"
      ? "[status: review]"
      : "[status: running]";

  const code = `// Simulated output relevant to the issue title
> Initializing task: ${issue.title}
> Loading context from codebase...
> Found 3 relevant files
> Writing implementation...
${statusLine}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Code className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Output</span>
        </div>
        {issue.status === "completed" && (
          <button className="text-xs border border-border px-3 py-1 rounded-full hover:bg-accent/50 transition-all duration-200 text-muted-foreground hover:text-foreground">
            View PR #42
          </button>
        )}
      </div>
      <pre className="bg-background/80 rounded-xl p-4 text-xs font-mono overflow-auto max-h-48 text-muted-foreground leading-relaxed whitespace-pre-wrap border border-border">
        {code}
      </pre>
    </div>
  );
}

// ─── Comments ─────────────────────────────────────────────────────────────────

function CommentsSection({ issue }: { issue: (typeof ALL_ISSUES)[number] }) {
  const [comment, setComment] = useState("");

  const prefilled = [
    {
      initials: "JD",
      name: "Jordan Dev",
      time: "1 day ago",
      text: `Starting analysis on "${issue.title}". Initial pass looks straightforward — will update once implementation is underway.`,
    },
    {
      initials: "AL",
      name: "Alex Lead",
      time: "10h ago",
      text: "Looks good so far. Make sure to handle edge cases around auth token expiry if applicable.",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <MessageSquare className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-semibold">Notes & Comments</span>
      </div>

      <div className="space-y-4">
        {prefilled.map((c, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
              {c.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-medium">{c.name}</span>
                <span className="text-[10px] text-muted-foreground/60">{c.time}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a note..."
          rows={2}
          className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring resize-none"
        />
        <div className="flex justify-end">
          <button
            disabled={!comment.trim()}
            className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:bg-primary/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
          >
            Add note
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel: Status Card ─────────────────────────────────────────────────

function StatusCard({ issue }: { issue: (typeof ALL_ISSUES)[number] }) {
  const [status, setStatus] = useState(issue.status);

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Status",
      value: (
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="appearance-none bg-muted border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-ring pr-5 cursor-pointer"
          >
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </select>
          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
        </div>
      ),
    },
    {
      label: "Priority",
      value: (
        <span
          className={cn(
            "text-[10px] px-2 py-0.5 border font-medium uppercase tracking-wide rounded-full",
            issue.priority === "high"
              ? "text-red-400 bg-red-400/10 border-red-400/20"
              : issue.priority === "medium"
              ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
              : "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
          )}
        >
          {issue.priority}
        </span>
      ),
    },
    {
      label: "Agent",
      value: (
        <div className="flex items-center gap-1">
          <Bot className="w-3 h-3 text-muted-foreground/60 shrink-0" />
          <span className="text-xs">{issue.agent}</span>
        </div>
      ),
    },
    { label: "Project", value: <span className="text-xs">{issue.project}</span> },
    { label: "Created", value: <span className="text-xs text-muted-foreground">2 days ago</span> },
    {
      label: "Updated",
      value: <span className="text-xs text-muted-foreground">{issue.updated}</span>,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 mb-3">
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground shrink-0">{r.label}</span>
            <div>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Right Panel: Activity Timeline ──────────────────────────────────────────

function ActivityTimeline({ issue }: { issue: (typeof ALL_ISSUES)[number] }) {
  const items = [
    { text: "Issue created", time: "2 days ago" },
    { text: `Assigned to ${issue.agent}`, time: "2 days ago" },
    { text: "Status changed to In Progress", time: "1 day ago" },
    { text: "Agent started working", time: issue.updated },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
        Activity
      </p>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[3px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4 pl-5">
          {items.map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-muted-foreground/40 border border-border" />
              <p className="text-xs text-foreground/80">{item.text}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function IssueDetailPage({ params }: { params: { id: string } }) {
  const issue = ALL_ISSUES.find((i) => i.id.toLowerCase() === params.id.toLowerCase());

  if (!issue) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <CircleDot className="w-10 h-10 text-muted-foreground/30" />
        <p className="text-sm font-semibold text-foreground">Issue not found</p>
        <p className="text-xs text-muted-foreground">
          No issue matching <span className="font-mono text-foreground/70">{params.id}</span>
        </p>
        <Link
          href="/issues"
          className="mt-2 flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-full hover:bg-accent/50 transition-all duration-200 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Issues
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Back button */}
      <div className="px-6 pt-4 pb-2 shrink-0">
        <Link
          href="/issues"
          className="inline-flex items-center gap-1.5 text-xs border border-border px-3 py-1.5 rounded-full hover:bg-accent/50 transition-all duration-200 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Issues
        </Link>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 gap-4 px-6 pb-6 overflow-hidden">
        {/* Left panel */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* Issue header card */}
          <div className="rounded-2xl border border-border bg-card p-6 mb-4">
            {/* Row 1: badges + action */}
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                {issue.id}
              </span>
              <StatusIcon status={issue.status} size="sm" />
              <PriorityBadge priority={issue.priority} />
              <div className="flex-1" />
              <button className="text-xs border border-border px-3 py-1 rounded-full hover:bg-accent/50 transition-all duration-200 text-muted-foreground hover:text-foreground flex items-center gap-1.5">
                <Bot className="w-3 h-3" />
                Open in agent
              </button>
            </div>

            {/* Row 2: title */}
            <h1 className="text-xl font-semibold mb-3 leading-snug">{issue.title}</h1>

            {/* Row 3: metadata */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-xs text-muted-foreground">{issue.agent}</span>
              </div>
              <span className="text-muted-foreground/30 text-xs">·</span>
              <span className="text-xs text-muted-foreground">{issue.project}</span>
              {issue.labels.length > 0 && (
                <>
                  <span className="text-muted-foreground/30 text-xs">·</span>
                  <div className="flex items-center gap-1">
                    {issue.labels.map((l) => (
                      <span
                        key={l}
                        className="text-[10px] text-muted-foreground/70 border border-border px-2 py-0.5 rounded-full"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </>
              )}
              <span className="text-muted-foreground/30 text-xs">·</span>
              <span className="text-xs text-muted-foreground/60">Updated {issue.updated}</span>
            </div>
          </div>

          {/* Reasoning trace */}
          <ReasoningTrace status={issue.status} />

          {/* Code output */}
          <CodeOutput issue={issue} />

          {/* Comments */}
          <CommentsSection issue={issue} />
        </div>

        {/* Right panel — 320px fixed */}
        <div className="shrink-0 overflow-y-auto" style={{ width: "320px" }}>
          <StatusCard issue={issue} />
          <ActivityTimeline issue={issue} />
        </div>
      </div>
    </div>
  );
}
