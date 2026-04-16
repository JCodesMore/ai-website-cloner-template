"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Send,
  Inbox,
  Search,
  FileText,
  AlertCircle,
  Archive,
  MailOpen,
  Download,
} from "lucide-react";

interface Message {
  from: string;
  time: string;
  text: string;
}

interface DocumentSection {
  heading: string;
  body: string;
}

interface DocumentMeta {
  author: string;
  created: string;
  pages: number;
}

interface Thread {
  id: number;
  agent: string;
  initials: string;
  color: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  type: "message" | "document" | "alert";
  messages: Message[];
  document?: {
    title: string;
    sections: DocumentSection[];
    metadata: DocumentMeta;
  };
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 1,
    agent: "Dev Agent",
    initials: "DA",
    color: "#6366f1",
    subject: "PR Ready for Review",
    preview: "I've completed the OAuth2 PKCE implementation...",
    time: "2m ago",
    unread: true,
    type: "message",
    messages: [
      { from: "Dev Agent", time: "2m ago", text: "I've completed the OAuth2 PKCE implementation. The PR is ready for your review. I've added unit tests and updated the docs." },
      { from: "You", time: "1m ago", text: "Great, I'll take a look. Did you handle the token refresh edge case?" },
      { from: "Dev Agent", time: "30s ago", text: "Yes, I added a refresh token rotation mechanism. The edge case where tokens expire mid-request is now handled with automatic retry logic." },
    ],
  },
  {
    id: 2,
    agent: "QA Agent",
    initials: "QA",
    color: "#f59e0b",
    subject: "Test Suite Results",
    preview: "All 247 tests passing. Coverage at 84%...",
    time: "15m ago",
    unread: true,
    type: "message",
    messages: [
      { from: "QA Agent", time: "15m ago", text: "All 247 tests are passing. Code coverage is at 84%, up from 71% last sprint. I found 2 edge cases in the payment service that need attention." },
      { from: "You", time: "10m ago", text: "What are the edge cases?" },
      { from: "QA Agent", time: "9m ago", text: "Edge case 1: concurrent payment requests with the same idempotency key. Edge case 2: timeout handling when the payment gateway takes >30s. I've created issues ISS-146 and ISS-147 for these." },
    ],
  },
  {
    id: 3,
    agent: "PM Agent",
    initials: "PM",
    color: "#10b981",
    subject: "Sprint Planning Complete",
    preview: "I've prepared the sprint board for next week...",
    time: "1h ago",
    unread: false,
    type: "message",
    messages: [
      { from: "PM Agent", time: "1h ago", text: "Sprint planning is complete. I've prioritized 12 issues for next sprint based on the Q2 goals. The Dev Agent has 6 assigned, QA Agent has 4, and I'll handle 2." },
      { from: "You", time: "50m ago", text: "Looks good. Make sure the security audit tasks are top priority." },
      { from: "PM Agent", time: "48m ago", text: "Understood. I've moved ISS-140 (Audit user permissions) and ISS-142 (Rate limiting) to the top of the queue. The Dev Agent will start on these tomorrow morning." },
    ],
  },
  {
    id: 4,
    agent: "Dev Agent",
    initials: "DA",
    color: "#6366f1",
    subject: "Requesting Approval: Deploy to Production",
    preview: "v2.3.1 is ready for production deployment...",
    time: "2h ago",
    unread: false,
    type: "message",
    messages: [
      { from: "Dev Agent", time: "2h ago", text: "v2.3.1 is ready for production deployment. All tests pass, the staging environment has been running for 48h without issues. Requesting approval to proceed." },
      { from: "You", time: "1h 55m ago", text: "I'll review the checklist first. Hold off for now." },
    ],
  },
  {
    id: 5,
    agent: "Docs Agent",
    initials: "DO",
    color: "#ec4899",
    subject: "Error: Documentation Generation Failed",
    preview: "Encountered a permission error when accessing...",
    time: "3h ago",
    unread: true,
    type: "alert",
    messages: [
      { from: "Docs Agent", time: "3h ago", text: "I encountered a permission error when trying to access the API spec files. Error: EACCES: permission denied, open '/srv/api/openapi.json'. I've paused the task until this is resolved." },
      { from: "You", time: "2h 50m ago", text: "I'll fix the permissions. Can you retry in 30 minutes?" },
      { from: "Docs Agent", time: "30m ago", text: "Retried but still getting the same error. The file permissions were updated but I may need a restart to pick up the changes." },
    ],
  },
  {
    id: 6,
    agent: "QA Agent",
    initials: "QA",
    color: "#f59e0b",
    subject: "Coverage Report - Week 15",
    preview: "Weekly coverage report is ready...",
    time: "1d ago",
    unread: false,
    type: "message",
    messages: [
      { from: "QA Agent", time: "1d ago", text: "Weekly coverage report for Week 15 is ready. Overall: 84% (+3%). By module — Auth: 91%, Payments: 78%, API: 87%, Models: 89%. Biggest improvement was in the payment module after the new tests I added." },
    ],
  },
  {
    id: 7,
    agent: "PM Agent",
    initials: "PM",
    color: "#10b981",
    subject: "Budget Alert: Dev Agent at 82%",
    preview: "Dev Agent has used 82% of monthly budget...",
    time: "2d ago",
    unread: false,
    type: "alert",
    messages: [
      { from: "PM Agent", time: "2d ago", text: "Alert: Dev Agent has consumed 82% of their $150 monthly budget ($123 of $150). At the current burn rate, the budget will be exhausted in approximately 5 days. Recommend either reducing run frequency or increasing the budget limit." },
    ],
  },
  {
    id: 8,
    agent: "PM Agent",
    initials: "PM",
    color: "#10b981",
    subject: "Sprint 15 Report",
    preview: "Comprehensive sprint summary with metrics...",
    time: "3d ago",
    unread: false,
    type: "document",
    messages: [],
    document: {
      title: "Sprint 15 — Velocity & Delivery Report",
      sections: [
        {
          heading: "Executive Summary",
          body: "Sprint 15 delivered 18 story points across 12 issues. The team exceeded velocity targets by 12%. Key deliverables include the OAuth2 PKCE implementation, rate limiting on API endpoints, and the new test suite for payment processing.",
        },
        {
          heading: "Issues Completed",
          body: "ISS-138 Migrate legacy endpoints · ISS-139 Refactor auth middleware · ISS-140 Audit permissions · ISS-143 Optimize DB queries\n\n4 issues carried over to Sprint 16: ISS-141 (CI/CD pipeline), ISS-142 (Rate limiting — in review).",
        },
        {
          heading: "Metrics",
          body: "Velocity: 18 pts (+12% vs Sprint 14) · Test coverage: 84% (+3%) · PR merge time: avg 4.2h · Bug escape rate: 0%",
        },
        {
          heading: "Sprint 16 Priorities",
          body: "Focus on mobile push notifications, SEO optimization, and completing the remaining security audit items. Estimated velocity: 16–20 points.",
        },
      ],
      metadata: { author: "PM Agent", created: "Apr 14, 2026", pages: 3 },
    },
  },
  {
    id: 9,
    agent: "QA Agent",
    initials: "QA",
    color: "#f59e0b",
    subject: "Security Audit Report",
    preview: "Full security assessment of the platform...",
    time: "5d ago",
    unread: false,
    type: "document",
    messages: [],
    document: {
      title: "Platform Security Audit — Q2 2026",
      sections: [
        {
          heading: "Scope",
          body: "Full audit of authentication flows, API endpoints, user data handling, and infrastructure configuration. 47 endpoints tested, 8 agent workflows reviewed.",
        },
        {
          heading: "Critical Findings",
          body: "1. Rate limiting absent on /api/auth/login — FIXED (ISS-142)\n2. User permissions not validated on admin routes — IN PROGRESS (ISS-140)\n3. API tokens stored in plaintext in dev config — FIXED",
        },
        {
          heading: "Recommendations",
          body: "Implement OWASP top-10 checklist quarterly. Add automated security scanning to CI/CD pipeline. Rotate all API keys on a 90-day schedule.",
        },
        {
          heading: "Compliance Status",
          body: "SOC 2 Type II: 87% compliant (target: 100% by Q3)\nGDPR: Fully compliant\nISO 27001: Assessment scheduled for Q3 2026",
        },
      ],
      metadata: { author: "QA Agent", created: "Apr 11, 2026", pages: 5 },
    },
  },
];

type Tab = "all" | "unread" | "documents" | "alerts";

function Avatar({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  return (
    <div
      className={cn(
        "flex items-center justify-center font-semibold text-white shrink-0 rounded-xl",
        sizeClass
      )}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function renderBodyText(body: string) {
  const paragraphs = body.split("\n\n");
  return paragraphs.map((para, pi) => (
    <p key={pi} className={cn("text-sm text-foreground/80 leading-relaxed", pi > 0 && "mt-3")}>
      {para.split("\n").map((line, li, arr) => (
        <span key={li}>
          {line}
          {li < arr.length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
}

export default function InboxPage() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedThread = threads.find((t) => t.id === selectedId) ?? null;

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.preview.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeTab === "unread") return t.unread;
    if (activeTab === "documents") return t.type === "document";
    if (activeTab === "alerts") return t.type === "alert";
    return true;
  });

  function handleSelectThread(id: number) {
    setSelectedId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, unread: false } : t))
    );
    setReplyText("");
  }

  function handleArchive(id: number) {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleSend() {
    if (!replyText.trim() || !selectedId) return;
    const newMessage: Message = {
      from: "You",
      time: "just now",
      text: replyText.trim(),
    };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedId
          ? { ...t, messages: [...t.messages, newMessage] }
          : t
      )
    );
    setReplyText("");
  }

  const unreadCount = threads.filter((t) => t.unread).length;

  const TABS: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread" },
    { id: "documents", label: "Documents" },
    { id: "alerts", label: "Alerts" },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Left panel */}
      <div
        className="flex flex-col shrink-0 border-r border-border h-full"
        style={{ width: "280px" }}
      >
        {/* Header */}
        <div className="px-3 pt-4 pb-3 shrink-0 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-base font-semibold text-foreground">Inbox</h1>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center h-5 min-w-5 px-1.5 text-[10px] font-semibold bg-violet-600 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/40 border border-border/60 rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors",
                  activeTab === tab.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto py-1">
          {filteredThreads.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
              No messages
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => handleSelectThread(thread.id)}
                className={cn(
                  "w-full flex items-start gap-2.5 px-3 py-2.5 text-left transition-colors mb-0.5 mx-1 rounded-xl",
                  "hover:bg-accent/30",
                  selectedId === thread.id ? "bg-accent/60" : ""
                )}
                style={{ width: "calc(100% - 8px)" }}
              >
                <Avatar initials={thread.initials} color={thread.color} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={cn(
                        "text-xs truncate",
                        thread.unread
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/80"
                      )}
                    >
                      {thread.agent}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0">
                      {thread.time}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-xs truncate mb-0.5",
                      thread.unread
                        ? "font-medium text-foreground"
                        : "text-foreground/70"
                    )}
                  >
                    {thread.subject}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {thread.type === "document" && (
                      <FileText className="w-2.5 h-2.5 text-muted-foreground/60 shrink-0" />
                    )}
                    {thread.type === "alert" && (
                      <AlertCircle className="w-2.5 h-2.5 text-orange-400 shrink-0" />
                    )}
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {thread.preview}
                    </p>
                  </div>
                </div>
                {thread.unread && (
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: thread.color }}
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {!selectedThread ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Inbox className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">Select a conversation</p>
            <p className="text-xs text-muted-foreground/60">
              Choose a message from the left to get started
            </p>
          </div>
        ) : selectedThread.type === "document" ? (
          /* Document view */
          <div className="flex-1 overflow-y-auto">
            {/* Thread header */}
            <div className="rounded-xl bg-card/50 border border-border/50 px-4 py-3 mx-4 mt-4 mb-4 flex items-center gap-3">
              <Avatar initials={selectedThread.initials} color={selectedThread.color} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-none mb-1">
                  {selectedThread.agent}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedThread.subject}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{selectedThread.time}</span>
              <button
                onClick={() => handleArchive(selectedThread.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors shrink-0"
              >
                <Archive className="w-3 h-3" />
                Archive
              </button>
            </div>

            {/* Document container */}
            {selectedThread.document && (
              <div className="mx-4 mb-4 rounded-2xl border border-border bg-card overflow-hidden">
                {/* Document header bar */}
                <div className="bg-muted/30 border-b border-border px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-foreground/60 shrink-0" />
                    <span className="font-semibold text-base text-foreground">
                      {selectedThread.document.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {selectedThread.document.metadata.author}
                      {" · "}
                      {selectedThread.document.metadata.created}
                      {" · "}
                      {selectedThread.document.metadata.pages} pages
                    </span>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>

                {/* Document body */}
                <div className="px-8 py-6 space-y-6">
                  {selectedThread.document.sections.map((section, si) => (
                    <div
                      key={si}
                      className={cn(
                        "pb-6",
                        si < selectedThread.document!.sections.length - 1 &&
                          "border-b border-border/30"
                      )}
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wide">
                        {section.heading}
                      </h3>
                      {renderBodyText(section.body)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Message/Alert view */
          <>
            {/* Thread header */}
            <div className="rounded-xl bg-card/50 border border-border/50 px-4 py-3 mx-4 mt-4 mb-0 flex items-center gap-3 shrink-0">
              <Avatar initials={selectedThread.initials} color={selectedThread.color} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-none mb-1">
                  {selectedThread.agent}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedThread.subject}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{selectedThread.time}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleArchive(selectedThread.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <Archive className="w-3 h-3" />
                  Archive
                </button>
                <button
                  onClick={() =>
                    setThreads((prev) =>
                      prev.map((t) =>
                        t.id === selectedThread.id ? { ...t, unread: false } : t
                      )
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border/60 rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <MailOpen className="w-3 h-3" />
                  Mark Read
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
              {selectedThread.messages.map((msg, i) => {
                const isYou = msg.from === "You";
                return (
                  <div
                    key={i}
                    className={cn("flex gap-3", isYou && "flex-row-reverse")}
                  >
                    <div
                      className="w-7 h-7 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 rounded-xl"
                      style={{
                        backgroundColor: isYou ? "#64748b" : selectedThread.color,
                      }}
                    >
                      {isYou ? "Y" : selectedThread.initials}
                    </div>
                    <div
                      className={cn(
                        "flex flex-col max-w-[65%]",
                        isYou && "items-end"
                      )}
                    >
                      <div className={cn("flex items-baseline gap-2 mb-1", isYou && "flex-row-reverse")}>
                        <span className="text-xs font-semibold text-foreground">
                          {msg.from}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {msg.time}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "text-sm text-foreground px-3.5 py-2.5 leading-relaxed",
                          isYou
                            ? "rounded-2xl rounded-tr-sm bg-accent/60"
                            : "rounded-2xl rounded-tl-sm bg-card border border-border/50"
                        )}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply area */}
            <div className="shrink-0 rounded-2xl border border-border bg-card mx-4 mb-4 mt-2 p-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Reply to this thread..."
                rows={2}
                className="w-full resize-none bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors rounded-xl"
              />
              <div className="flex items-center justify-end mt-1">
                <button
                  onClick={handleSend}
                  disabled={!replyText.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" />
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
