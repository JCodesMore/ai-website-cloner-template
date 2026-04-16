"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Network,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  DollarSign,
  Clock,
  Bot,
  AlertTriangle,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentStatus = "active" | "paused" | "error";

interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  adapter: string;
  monthlyCost: number;
  budget: number;
  currentTask: string | null;
  supervisor: string | null;
  errorMsg?: string;
  runsToday?: number;
  lastHeartbeat?: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  {
    id: "agt-1",
    name: "Dev Agent",
    role: "Senior Software Engineer",
    status: "active",
    adapter: "claude-code",
    monthlyCost: 84.5,
    budget: 150,
    currentTask: "Implementing OAuth2 PKCE flow",
    supervisor: null,
    runsToday: 14,
    lastHeartbeat: "2s ago",
  },
  {
    id: "agt-2",
    name: "QA Agent",
    role: "QA Engineer",
    status: "active",
    adapter: "claude-code",
    monthlyCost: 42.2,
    budget: 100,
    currentTask: "Writing tests for payment service",
    supervisor: "agt-1",
    runsToday: 8,
    lastHeartbeat: "11s ago",
  },
  {
    id: "agt-3",
    name: "PM Agent",
    role: "Product Manager",
    status: "paused",
    adapter: "claude-api",
    monthlyCost: 18.0,
    budget: 80,
    currentTask: null,
    supervisor: null,
    runsToday: 3,
    lastHeartbeat: "12m ago",
  },
  {
    id: "agt-4",
    name: "Docs Agent",
    role: "Technical Writer",
    status: "error",
    adapter: "bash",
    monthlyCost: 6.8,
    budget: 50,
    currentTask: null,
    supervisor: "agt-1",
    errorMsg: "Tool invocation failed: permission denied",
    runsToday: 1,
    lastHeartbeat: "1h ago",
  },
  {
    id: "agt-5",
    name: "Deploy Agent",
    role: "DevOps Engineer",
    status: "paused",
    adapter: "cursor",
    monthlyCost: 31.1,
    budget: 120,
    currentTask: null,
    supervisor: null,
    runsToday: 5,
    lastHeartbeat: "5m ago",
  },
];

const EDGES: { from: string; to: string }[] = [
  { from: "agt-1", to: "agt-2" },
  { from: "agt-1", to: "agt-4" },
];

const INITIAL_POSITIONS: Record<string, { x: number; y: number }> = {
  "agt-1": { x: 300, y: 80 },
  "agt-3": { x: 600, y: 80 },
  "agt-5": { x: 900, y: 80 },
  "agt-2": { x: 200, y: 280 },
  "agt-4": { x: 400, y: 280 },
};

const NODE_W = 200;
const NODE_H = 130;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_DOT_COLOR: Record<AgentStatus, string> = {
  active: "#34d399",   // emerald-400
  paused: "#facc15",   // yellow-400
  error: "#f87171",    // red-400
};

const STATUS_GLOW: Record<AgentStatus, string> = {
  active: "0 0 6px 1px rgba(52,211,153,0.45)",
  paused: "0 0 6px 1px rgba(250,204,21,0.45)",
  error: "0 0 6px 1px rgba(248,113,113,0.45)",
};

const STATUS_LABEL: Record<AgentStatus, string> = {
  active: "Active",
  paused: "Paused",
  error: "Error",
};

const ADAPTER_PILL: Record<string, string> = {
  "claude-code": "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  "claude-api": "bg-purple-500/15 text-purple-300 border border-purple-500/30",
  bash: "bg-zinc-500/15 text-zinc-300 border border-zinc-500/30",
  cursor: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
};

function adapterClass(adapter: string) {
  return ADAPTER_PILL[adapter] ?? "bg-muted/40 text-muted-foreground border border-border/50";
}

// ─── SVG Edges ────────────────────────────────────────────────────────────────

function Edges({ positions }: { positions: Record<string, { x: number; y: number }> }) {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,255,255,0.18)" />
        </marker>
      </defs>
      {EDGES.map(({ from, to }) => {
        const a = positions[from];
        const b = positions[to];
        if (!a || !b) return null;
        const x1 = a.x + NODE_W / 2;
        const y1 = a.y + NODE_H;
        const x2 = b.x + NODE_W / 2;
        const y2 = b.y;
        const cy = (y1 + y2) / 2;
        return (
          <path
            key={`${from}-${to}`}
            d={`M ${x1},${y1} C ${x1},${cy} ${x2},${cy} ${x2},${y2}`}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
    </svg>
  );
}

// ─── Node Card ────────────────────────────────────────────────────────────────

interface NodeCardProps {
  agent: Agent;
  position: { x: number; y: number };
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
}

function NodeCard({ agent, position, isSelected, onPointerDown }: NodeCardProps) {
  const pct = Math.min(100, (agent.monthlyCost / agent.budget) * 100);
  const barColor = pct > 80 ? "#f87171" : pct > 55 ? "#facc15" : "#34d399";

  return (
    <div
      data-node="true"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: NODE_W,
        touchAction: "none",
        transition: "box-shadow 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
      className={cn(
        "rounded-2xl border bg-card/85 backdrop-blur-md shadow-lg cursor-grab active:cursor-grabbing p-3.5 select-none",
        "transition-all duration-200",
        isSelected
          ? "border-primary/50 ring-2 ring-primary/30 scale-[1.02]"
          : "border-border/50 hover:border-border hover:scale-[1.01] hover:shadow-xl"
      )}
      onPointerDown={(e) => onPointerDown(e, agent.id)}
    >
      {/* Top row: name + status dot */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate leading-tight">{agent.name}</div>
          <div className="text-[11px] text-muted-foreground truncate mt-0.5">{agent.role}</div>
        </div>
        <span
          className="mt-0.5 w-2 h-2 rounded-full shrink-0"
          style={{
            backgroundColor: STATUS_DOT_COLOR[agent.status],
            boxShadow: STATUS_GLOW[agent.status],
          }}
        />
      </div>

      {/* Adapter badge */}
      <div className="mb-2.5">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", adapterClass(agent.adapter))}>
          {agent.adapter}
        </span>
      </div>

      {/* Cost bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
          <span>Cost</span>
          <span className="tabular-nums">${agent.monthlyCost.toFixed(0)}/${agent.budget}</span>
        </div>
        <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      {/* Current task */}
      {agent.status === "active" && agent.currentTask ? (
        <div className="text-[10px] text-blue-400 truncate leading-tight">{agent.currentTask}</div>
      ) : agent.status === "error" ? (
        <div className="flex items-center gap-1 text-[10px] text-red-400 truncate">
          <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{agent.errorMsg}</span>
        </div>
      ) : (
        <div className="text-[10px] text-muted-foreground/60">Idle</div>
      )}
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
  agent,
  onClose,
  onTogglePause,
}: {
  agent: Agent;
  onClose: () => void;
  onTogglePause: (id: string) => void;
}) {
  const pct = Math.min(100, (agent.monthlyCost / agent.budget) * 100);
  const barColor = pct > 80 ? "bg-red-400" : pct > 55 ? "bg-yellow-400" : "bg-emerald-400";

  return (
    <div
      className="w-[300px] shrink-0 h-full flex flex-col bg-card/90 backdrop-blur-xl border-l border-border z-20"
      style={{ animation: "slide-down 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both" }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-4 py-3.5 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{agent.name}</div>
          <div className="text-xs text-muted-foreground truncate mt-0.5">{agent.role}</div>
        </div>
        <button
          onClick={onClose}
          className="mt-0.5 p-1 rounded-lg hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Status + adapter row */}
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: STATUS_DOT_COLOR[agent.status],
              boxShadow: STATUS_GLOW[agent.status],
            }}
          />
          <span className="text-sm">{STATUS_LABEL[agent.status]}</span>
          <span
            className={cn(
              "ml-auto rounded-full text-[10px] px-2 py-0.5 font-medium",
              adapterClass(agent.adapter)
            )}
          >
            {agent.adapter}
          </span>
        </div>

        {/* Error message */}
        {agent.status === "error" && agent.errorMsg && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-red-400 leading-relaxed">{agent.errorMsg}</p>
          </div>
        )}

        {/* Budget bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Monthly budget</span>
            <span className="tabular-nums font-medium">
              ${agent.monthlyCost.toFixed(2)}
              <span className="text-muted-foreground/60"> / ${agent.budget}</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/40">
            <div
              className={cn("h-full rounded-full transition-all duration-500", barColor)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground/70 text-right">{Math.round(pct)}% used</div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <PanelField icon={<Bot className="w-3.5 h-3.5" />} label="Adapter">
            {agent.adapter}
          </PanelField>
          <PanelField icon={<Clock className="w-3.5 h-3.5" />} label="Runs today">
            {agent.runsToday ?? 0} runs
          </PanelField>
          <PanelField icon={<DollarSign className="w-3.5 h-3.5" />} label="Monthly cost">
            ${agent.monthlyCost.toFixed(2)}
          </PanelField>
          <PanelField icon={<Clock className="w-3.5 h-3.5" />} label="Last heartbeat">
            {agent.lastHeartbeat ?? "—"}
          </PanelField>
          <PanelField icon={<Bot className="w-3.5 h-3.5" />} label="Current task">
            {agent.currentTask ?? "Idle"}
          </PanelField>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="px-4 py-3 border-t border-border space-y-2">
        <button
          onClick={() => onTogglePause(agent.id)}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all duration-200",
            agent.status === "active"
              ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 hover:bg-yellow-500/25"
              : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25"
          )}
        >
          {agent.status === "active" ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              Pause Agent
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Resume Agent
            </>
          )}
        </button>
        <Link
          href="/issues"
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25 text-sm font-medium transition-all duration-200"
        >
          View Issues
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function PanelField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

// ─── Controls Pill ────────────────────────────────────────────────────────────

function Controls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onFit,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFit: () => void;
}) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-px bg-card/85 backdrop-blur-md border border-border/60 rounded-2xl shadow-lg overflow-hidden">
      <CtrlBtn onClick={onZoomIn} title="Zoom in">
        <ZoomIn className="w-3.5 h-3.5" />
      </CtrlBtn>
      <div className="w-px h-5 bg-border/60" />
      <CtrlBtn onClick={onZoomOut} title="Zoom out">
        <ZoomOut className="w-3.5 h-3.5" />
      </CtrlBtn>
      <div className="w-px h-5 bg-border/60" />
      <div className="px-2.5 text-[11px] text-muted-foreground tabular-nums font-medium select-none">
        {Math.round(zoom * 100)}%
      </div>
      <div className="w-px h-5 bg-border/60" />
      <CtrlBtn onClick={onReset} title="Reset view">
        <RotateCcw className="w-3.5 h-3.5" />
      </CtrlBtn>
      <div className="w-px h-5 bg-border/60" />
      <CtrlBtn onClick={onFit} title="Fit all">
        <Maximize2 className="w-3.5 h-3.5" />
      </CtrlBtn>
    </div>
  );
}

function CtrlBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
    >
      {children}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrgPage() {
  // Canvas transform
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  // Node positions
  const [positions, setPositions] =
    useState<Record<string, { x: number; y: number }>>(INITIAL_POSITIONS);

  // Selected node
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Simulated pause state overlay (doesn't mutate AGENTS array)
  const [pausedOverride, setPausedOverride] = useState<Record<string, boolean>>({});

  // Refs for drag — avoids stale closures
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    type: "pan" | "node";
    nodeId?: string;
    startPointer: { x: number; y: number };
    startValue: { x: number; y: number };
    moved: boolean;
  } | null>(null);

  // ── Wheel zoom toward cursor ───────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setTransform((prev) => {
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.min(2.0, Math.max(0.4, prev.scale * factor));
        // Zoom toward cursor: keep the point under cursor fixed
        const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale);
        const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale);
        return { x: newX, y: newY, scale: newScale };
      });
    },
    []
  );

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // ── Node pointer down ──────────────────────────────────────────────────────
  const handleNodePointerDown = useCallback(
    (e: React.PointerEvent, nodeId: string) => {
      e.stopPropagation();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragState.current = {
        type: "node",
        nodeId,
        startPointer: { x: e.clientX, y: e.clientY },
        startValue: { ...positions[nodeId] },
        moved: false,
      };
    },
    [positions]
  );

  // ── Canvas pointer down (pan) ──────────────────────────────────────────────
  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only start panning if clicking the canvas itself (not a node)
      if ((e.target as HTMLElement).closest("[data-node]")) return;
      dragState.current = {
        type: "pan",
        startPointer: { x: e.clientX, y: e.clientY },
        startValue: { x: transform.x, y: transform.y },
        moved: false,
      };
    },
    [transform.x, transform.y]
  );

  // ── Pointer move ───────────────────────────────────────────────────────────
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragState.current;
      if (!d) return;
      const dx = e.clientX - d.startPointer.x;
      const dy = e.clientY - d.startPointer.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) d.moved = true;

      if (d.type === "pan") {
        setTransform((prev) => ({
          ...prev,
          x: d.startValue.x + dx,
          y: d.startValue.y + dy,
        }));
      } else if (d.type === "node" && d.nodeId) {
        setPositions((prev) => ({
          ...prev,
          [d.nodeId!]: {
            x: d.startValue.x + dx / transform.scale,
            y: d.startValue.y + dy / transform.scale,
          },
        }));
      }
    },
    [transform.scale]
  );

  // ── Pointer up ─────────────────────────────────────────────────────────────
  const handlePointerUp = useCallback(() => {
    const d = dragState.current;
    if (!d) return;
    if (d.type === "node" && d.nodeId && !d.moved) {
      setSelectedId((prev) => (prev === d.nodeId ? null : d.nodeId!));
    }
    dragState.current = null;
  }, []);

  // ── Controls ───────────────────────────────────────────────────────────────
  const zoomIn = useCallback(
    () => setTransform((t) => ({ ...t, scale: Math.min(2.0, t.scale * 1.2) })),
    []
  );
  const zoomOut = useCallback(
    () => setTransform((t) => ({ ...t, scale: Math.max(0.4, t.scale / 1.2) })),
    []
  );
  const resetView = useCallback(() => setTransform({ x: 0, y: 0, scale: 1 }), []);

  const fitAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const xs = Object.values(positions).map((p) => p.x);
    const ys = Object.values(positions).map((p) => p.y);
    const minX = Math.min(...xs) - 40;
    const minY = Math.min(...ys) - 40;
    const maxX = Math.max(...xs) + NODE_W + 40;
    const maxY = Math.max(...ys) + NODE_H + 40;
    const contentW = maxX - minX;
    const contentH = maxY - minY;
    const newScale = Math.min(2, Math.max(0.4, Math.min(rect.width / contentW, rect.height / contentH)));
    setTransform({
      x: (rect.width - contentW * newScale) / 2 - minX * newScale,
      y: (rect.height - contentH * newScale) / 2 - minY * newScale,
      scale: newScale,
    });
  }, [positions]);

  // ── Pause toggle ───────────────────────────────────────────────────────────
  const handleTogglePause = useCallback((id: string) => {
    setPausedOverride((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Merge pause overrides into agent data
  const agentsWithOverride = AGENTS.map((a) => {
    const toggled = pausedOverride[a.id];
    if (toggled === undefined) return a;
    return {
      ...a,
      status: (a.status === "active" ? "paused" : "active") as AgentStatus,
    };
  });

  const selectedAgent = selectedId
    ? agentsWithOverride.find((a) => a.id === selectedId) ?? null
    : null;

  // Cursor style based on current drag
  const canvasCursor =
    dragState.current?.type === "pan" ? "grabbing" : "grab";

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
        <Network className="w-4 h-4 text-muted-foreground" />
        <h1 className="text-sm font-semibold">Org Chart</h1>
        <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md tabular-nums">
          {AGENTS.length} agents
        </span>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            New Agent
          </button>
        </div>
      </header>

      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden"
          style={{
            cursor: canvasCursor,
            // Dot-grid background
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Transformed inner canvas */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              transformOrigin: "0 0",
            }}
          >
            {/* SVG edges — behind nodes, pointer-events none */}
            <Edges positions={positions} />

            {/* Node cards */}
            {agentsWithOverride.map((agent) => (
              <NodeCard
                key={agent.id}
                agent={agent}
                position={positions[agent.id]}
                isSelected={selectedId === agent.id}
                onPointerDown={handleNodePointerDown}
              />
            ))}
          </div>

          {/* Controls pill — top-left, outside transform */}
          <Controls
            zoom={transform.scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={resetView}
            onFit={fitAll}
          />
        </div>

        {/* Detail panel */}
        {selectedAgent && (
          <DetailPanel
            key={selectedAgent.id}
            agent={selectedAgent}
            onClose={() => setSelectedId(null)}
            onTogglePause={handleTogglePause}
          />
        )}
      </div>
    </div>
  );
}
