"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Bot,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  List,
  GitBranch,
  Loader2,
  Cpu,
  Clock,
  DollarSign,
  MoreHorizontal,
  Pause,
  Play,
  AlertCircle,
  Activity,
  Settings,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NewAgentModal } from "@/components/platform/Modals";

const AGENTS = [
  {
    id: "agt-1",
    name: "Dev Agent",
    role: "Senior Software Engineer",
    status: "active" as const,
    adapter: "claude-code",
    lastHeartbeat: "just now",
    runsToday: 8,
    monthlyCost: 84.5,
    budget: 150,
    currentTask: "Implementing OAuth2 PKCE flow",
    supervisor: null,
  },
  {
    id: "agt-2",
    name: "QA Agent",
    role: "QA Engineer",
    status: "active" as const,
    adapter: "claude-code",
    lastHeartbeat: "2m ago",
    runsToday: 4,
    monthlyCost: 42.2,
    budget: 100,
    currentTask: "Writing tests for payment service",
    supervisor: "agt-1",
  },
  {
    id: "agt-3",
    name: "PM Agent",
    role: "Product Manager",
    status: "paused" as const,
    adapter: "claude-api",
    lastHeartbeat: "1h ago",
    runsToday: 1,
    monthlyCost: 18.0,
    budget: 80,
    currentTask: null,
    supervisor: null,
  },
  {
    id: "agt-4",
    name: "Docs Agent",
    role: "Technical Writer",
    status: "error" as const,
    adapter: "bash",
    lastHeartbeat: "2h ago",
    runsToday: 0,
    monthlyCost: 6.8,
    budget: 50,
    currentTask: null,
    supervisor: "agt-1",
    errorMsg: "Tool invocation failed: permission denied",
  },
  {
    id: "agt-5",
    name: "Deploy Agent",
    role: "DevOps Engineer",
    status: "paused" as const,
    adapter: "cursor",
    lastHeartbeat: "3h ago",
    runsToday: 2,
    monthlyCost: 31.1,
    budget: 120,
    currentTask: null,
    supervisor: null,
  },
];

interface Agent {
  id: string;
  name: string;
  role: string;
  status: "active" | "paused" | "error";
  adapter: string;
  lastHeartbeat: string;
  runsToday: number;
  monthlyCost: number;
  budget: number;
  currentTask: string | null;
  supervisor: string | null;
  errorMsg?: string;
  model?: string;
}

const STATUS_TABS = ["all", "active", "paused", "error"] as const;

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn("w-2 h-2 rounded-full shrink-0", {
        "bg-emerald-400": status === "active",
        "bg-yellow-400": status === "paused",
        "bg-red-400": status === "error",
      })}
    />
  );
}

function AdapterBadge({ adapter }: { adapter: string }) {
  const colors: Record<string, string> = {
    "claude-code": "text-violet-400 bg-violet-400/10 border-violet-400/20",
    "claude-api": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    bash: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    cursor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    openai: "text-green-400 bg-green-400/10 border-green-400/20",
  };
  return (
    <span
      className={cn(
        "text-[10px] px-1.5 py-0.5 border font-mono",
        colors[adapter] ?? "text-muted-foreground bg-muted border-border"
      )}
    >
      {adapter}
    </span>
  );
}

function SpendBar({ cost, budget }: { cost: number; budget: number }) {
  const pct = Math.min((cost / budget) * 100, 100);
  const danger = pct > 80;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1 bg-muted overflow-hidden">
        <div
          className={cn("h-full", danger ? "bg-red-400" : "bg-chart-5")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
        ${cost.toFixed(0)}/{budget}
      </span>
    </div>
  );
}

function AgentsPageInner() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [activeTab, setActiveTab] = useState<(typeof STATUS_TABS)[number]>("all");
  const [view, setView] = useState<"list" | "tree">("list");
  const [modalOpen, setModalOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setModalOpen(true);
    }
  }, [searchParams]);

  const toggleAgent = (id: string) =>
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? ("paused" as const) : ("active" as const) }
          : a
      )
    );

  const filtered =
    activeTab === "all" ? agents : agents.filter((a) => a.status === activeTab);

  const counts: Record<string, number> = {
    all: agents.length,
    active: agents.filter((a) => a.status === "active").length,
    paused: agents.filter((a) => a.status === "paused").length,
    error: agents.filter((a) => a.status === "error").length,
  };

  return (
    <div className="h-full flex flex-col">
      <NewAgentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(form) =>
          setAgents((prev) => [
            ...prev,
            {
              id: `agt-${prev.length + 1}`,
              name: form.name,
              role: form.role,
              adapter: form.adapter,
              status: "paused" as const,
              lastHeartbeat: "never",
              runsToday: 0,
              monthlyCost: 0,
              budget: form.budget,
              currentTask: null,
              supervisor: null,
              model: form.model,
            },
          ])
        }
      />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Bot className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold">Agents</h1>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5">
            {agents.length}
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          New Agent
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border shrink-0">
        <div className="flex items-center gap-0.5 flex-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-xs capitalize transition-colors",
                activeTab === tab
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {tab}
              <span className="text-[10px] text-muted-foreground px-1">{counts[tab]}</span>
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-2.5 py-1.5 hover:bg-accent/50 transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* View switcher */}
        <div className="flex border border-border">
          <button
            onClick={() => setView("list")}
            className={cn(
              "p-1.5 transition-colors",
              view === "list"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setView("tree")}
            className={cn(
              "p-1.5 transition-colors border-l border-border",
              view === "tree"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <GitBranch className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view === "list" ? (
          <div className="divide-y divide-border">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] items-center gap-4 px-6 py-2 text-xs text-muted-foreground bg-muted/20">
              <span className="w-4" />
              <span>Agent</span>
              <span className="w-24">Adapter</span>
              <span className="w-20 text-center">Runs today</span>
              <span className="w-36">Budget</span>
              <span className="w-24">Last active</span>
              <span className="w-8" />
            </div>
            {filtered.map((agent) => (
              <div
                key={agent.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] items-center gap-4 px-6 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer group"
              >
                <StatusDot status={agent.status} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{agent.name}</span>
                    {agent.status === "active" && agent.currentTask && (
                      <span className="flex items-center gap-1 text-xs text-blue-400">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        <span className="truncate max-w-[200px]">{agent.currentTask}</span>
                      </span>
                    )}
                    {agent.status === "error" && agent.errorMsg && (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[200px]">{agent.errorMsg}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{agent.role}</span>
                </div>
                <div className="w-24">
                  <AdapterBadge adapter={agent.adapter} />
                </div>
                <div className="w-20 text-center">
                  <span className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Cpu className="w-3 h-3" />
                    {agent.runsToday}
                  </span>
                </div>
                <div className="w-36">
                  <SpendBar cost={agent.monthlyCost} budget={agent.budget} />
                </div>
                <div className="w-24">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {agent.lastHeartbeat}
                  </span>
                </div>
                <div className="w-8 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAgent(agent.id);
                    }}
                    className="p-1 text-muted-foreground/0 group-hover:text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Org tree view */
          <div className="p-6">
            <OrgTree agents={agents} onToggle={toggleAgent} />
          </div>
        )}
      </div>
    </div>
  );
}

function OrgTree({
  agents,
  onToggle,
}: {
  agents: Agent[];
  onToggle: (id: string) => void;
}) {
  const roots = agents.filter((a) => !a.supervisor);
  const children = (id: string) => agents.filter((a) => a.supervisor === id);

  function AgentNode({
    agent,
    depth = 0,
  }: {
    agent: Agent;
    depth?: number;
  }) {
    const kids = children(agent.id);
    return (
      <div className={cn("relative", depth > 0 && "ml-6")}>
        {depth > 0 && (
          <div className="absolute left-[-16px] top-[18px] w-4 h-px bg-border" />
        )}
        <div className="flex items-center gap-3 border border-border bg-card px-4 py-3 hover:border-border/70 hover:bg-card/80 transition-colors cursor-pointer">
          <span
            className={cn("w-1.5 h-1.5 rounded-full shrink-0", {
              "bg-emerald-400": agent.status === "active",
              "bg-yellow-400": agent.status === "paused",
              "bg-red-400": agent.status === "error",
            })}
          />
          <Bot className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{agent.name}</div>
            <div className="text-xs text-muted-foreground">{agent.role}</div>
          </div>
          <AdapterBadge adapter={agent.adapter} />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="w-3 h-3" />
            {agent.monthlyCost.toFixed(0)}
          </div>
          {agent.status === "paused" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(agent.id);
              }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          ) : agent.status === "active" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(agent.id);
              }}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
        {kids.length > 0 && (
          <div className="relative ml-6 mt-2 space-y-2 before:absolute before:left-[-16px] before:top-0 before:bottom-4 before:w-px before:bg-border">
            {kids.map((kid) => (
              <AgentNode key={kid.id} agent={kid} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {roots.map((agent) => (
        <AgentNode key={agent.id} agent={agent} />
      ))}
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading...</div>}>
      <AgentsPageInner />
    </Suspense>
  );
}
