"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Bot,
  AlertTriangle,
  BarChart2,
  MessageSquare,
  Code2,
  Image,
  Video,
  X,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "overview" | "models" | "marketplace" | "apikeys";
type ModelCategory = "all" | "text" | "image" | "video";

// ─── Overview data ────────────────────────────────────────────────────────────

const AGENT_COSTS = [
  { id: "agt-1", name: "Dev Agent", role: "Senior Software Engineer", monthBudget: 150, monthSpend: 84.5, lastMonthSpend: 71.2, runs: 142, avgCostPerRun: 0.59, breakdown: { input: 34.2, output: 50.3 } },
  { id: "agt-2", name: "QA Agent", role: "QA Engineer", monthBudget: 100, monthSpend: 42.2, lastMonthSpend: 38.5, runs: 78, avgCostPerRun: 0.54, breakdown: { input: 18.1, output: 24.1 } },
  { id: "agt-3", name: "PM Agent", role: "Product Manager", monthBudget: 80, monthSpend: 18.0, lastMonthSpend: 22.3, runs: 31, avgCostPerRun: 0.58, breakdown: { input: 7.8, output: 10.2 } },
  { id: "agt-4", name: "Docs Agent", role: "Technical Writer", monthBudget: 50, monthSpend: 6.8, lastMonthSpend: 14.1, runs: 12, avgCostPerRun: 0.57, breakdown: { input: 2.9, output: 3.9 } },
  { id: "agt-5", name: "Deploy Agent", role: "DevOps Engineer", monthBudget: 120, monthSpend: 31.1, lastMonthSpend: 28.9, runs: 54, avgCostPerRun: 0.58, breakdown: { input: 13.2, output: 17.9 } },
];

const DAILY_SPEND = [
  { day: "Apr 1", amount: 4.2 }, { day: "Apr 2", amount: 8.1 }, { day: "Apr 3", amount: 6.5 },
  { day: "Apr 4", amount: 11.2 }, { day: "Apr 5", amount: 9.8 }, { day: "Apr 6", amount: 3.1 },
  { day: "Apr 7", amount: 5.4 }, { day: "Apr 8", amount: 12.3 }, { day: "Apr 9", amount: 10.7 },
  { day: "Apr 10", amount: 8.9 }, { day: "Apr 11", amount: 14.2 }, { day: "Apr 12", amount: 11.5 },
  { day: "Apr 13", amount: 7.2 }, { day: "Apr 14", amount: 9.3 },
];

const totalBudget = AGENT_COSTS.reduce((a, c) => a + c.monthBudget, 0);
const totalSpend = AGENT_COSTS.reduce((a, c) => a + c.monthSpend, 0);
const lastMonthTotal = AGENT_COSTS.reduce((a, c) => a + c.lastMonthSpend, 0);
const maxDaily = Math.max(...DAILY_SPEND.map((d) => d.amount));

// ─── Models tab data ──────────────────────────────────────────────────────────

const ACTIVE_MODELS = [
  { provider: "anthropic", name: "claude-sonnet-4.6", displayName: "Claude Sonnet 4.6", category: "Text & Code", calls: 124, latency: "2.1s", cost: 48.20 },
  { provider: "openai", name: "gpt-5.4-mini", displayName: "GPT-5.4 Mini", category: "Text & Code", calls: 89, latency: "0.8s", cost: 12.40 },
  { provider: "google", name: "gemma-4-26b-a4b-it:free", displayName: "Gemma 4 26B (Free)", category: "Text & Code", calls: 312, latency: "1.4s", cost: 0.00 },
  { provider: "google", name: "gemini-3.1-flash-lite-preview", displayName: "Gemini 3.1 Flash Lite", category: "Text & Code", calls: 67, latency: "0.6s", cost: 2.90 },
  { provider: "x-ai", name: "grok-4.20", displayName: "Grok 4.20", category: "Text & Code", calls: 34, latency: "3.2s", cost: 18.80 },
];

// ─── Marketplace data ─────────────────────────────────────────────────────────

interface MarketplaceModel {
  id: string;
  provider: string;
  name: string;
  category: "text" | "image" | "video";
  capabilities: string[];
  context: string;
  speed: string;
  costPer1k: string;
  description: string;
  benchmarks: Record<string, number | string>;
  featured?: boolean;
  isDefault?: boolean;
}

const MARKETPLACE_MODELS: MarketplaceModel[] = [
  { id: "anthropic/claude-opus-4.7", provider: "anthropic", name: "Claude Opus 4.7", category: "text", capabilities: ["text", "code"], context: "200K", speed: "fast", costPer1k: "$0.015", description: "Anthropic's most capable model. Exceptional at analysis, nuanced writing, and complex multi-step reasoning. Best for high-stakes tasks.", benchmarks: { mmlu: 92, humaneval: 89, hellaswag: 96 }, featured: true },
  { id: "anthropic/claude-sonnet-4.6", provider: "anthropic", name: "Claude Sonnet 4.6", category: "text", capabilities: ["text", "code"], context: "200K", speed: "fast", costPer1k: "$0.003", description: "Balanced performance and speed. Ideal for most agent tasks, coding, and analysis.", benchmarks: { mmlu: 88, humaneval: 85, hellaswag: 93 }, featured: false },
  { id: "openai/gpt-5.4", provider: "openai", name: "GPT-5.4", category: "text", capabilities: ["text", "code"], context: "128K", speed: "fast", costPer1k: "$0.012", description: "OpenAI's flagship reasoning model with strong coding and instruction following.", benchmarks: { mmlu: 91, humaneval: 88, hellaswag: 95 }, featured: true },
  { id: "openai/gpt-5.4-pro", provider: "openai", name: "GPT-5.4 Pro", category: "text", capabilities: ["text", "code"], context: "256K", speed: "medium", costPer1k: "$0.020", description: "Extended context and enhanced reasoning for complex enterprise tasks.", benchmarks: { mmlu: 93, humaneval: 91, hellaswag: 96 }, featured: false },
  { id: "openai/gpt-5.4-mini", provider: "openai", name: "GPT-5.4 Mini", category: "text", capabilities: ["text", "code"], context: "128K", speed: "very fast", costPer1k: "$0.001", description: "Cost-optimised model for high-volume agent tasks and quick lookups.", benchmarks: { mmlu: 82, humaneval: 78, hellaswag: 88 }, featured: false },
  { id: "openai/gpt-5.3-codex", provider: "openai", name: "GPT-5.3 Codex", category: "text", capabilities: ["text", "code"], context: "128K", speed: "fast", costPer1k: "$0.008", description: "Specialised for code generation, debugging, and software engineering tasks.", benchmarks: { mmlu: 85, humaneval: 94, hellaswag: 89 }, featured: false },
  { id: "google/gemma-4-26b-a4b-it:free", provider: "google", name: "Gemma 4 26B (Free)", category: "text", capabilities: ["text", "code"], context: "128K", speed: "fast", costPer1k: "Free", description: "Google's open model, our default. Optimised for agent tasks. Free tier included.", benchmarks: { mmlu: 83, humaneval: 80, hellaswag: 90 }, featured: true, isDefault: true },
  { id: "google/gemma-4-26b-a4b-it", provider: "google", name: "Gemma 4 26B", category: "text", capabilities: ["text", "code"], context: "128K", speed: "fast", costPer1k: "$0.0004", description: "Full Gemma 4 26B without rate limits. Ideal for production agent workloads.", benchmarks: { mmlu: 83, humaneval: 80, hellaswag: 90 }, featured: false },
  { id: "google/gemini-3.1-flash-lite-preview", provider: "google", name: "Gemini 3.1 Flash Lite", category: "text", capabilities: ["text", "code"], context: "1M", speed: "very fast", costPer1k: "$0.0001", description: "Ultra-fast with 1M token context. Perfect for summarisation and quick analysis.", benchmarks: { mmlu: 80, humaneval: 75, hellaswag: 87 }, featured: false },
  { id: "google/gemini-3.1-pro-preview", provider: "google", name: "Gemini 3.1 Pro", category: "text", capabilities: ["text", "code", "image"], context: "1M", speed: "medium", costPer1k: "$0.007", description: "Google's pro model with 1M context and multi-modal capabilities.", benchmarks: { mmlu: 89, humaneval: 84, hellaswag: 93 }, featured: false },
  { id: "qwen/qwen3.6-plus", provider: "qwen", name: "Qwen 3.6 Plus", category: "text", capabilities: ["text", "code"], context: "128K", speed: "fast", costPer1k: "$0.002", description: "Alibaba's advanced reasoning model. Strong multilingual and coding performance.", benchmarks: { mmlu: 86, humaneval: 83, hellaswag: 91 }, featured: false },
  { id: "z-ai/glm-5.1", provider: "zhipu", name: "GLM-5.1", category: "text", capabilities: ["text", "code"], context: "128K", speed: "fast", costPer1k: "$0.003", description: "Zhipu AI's latest model with strong Chinese language understanding and coding.", benchmarks: { mmlu: 84, humaneval: 81, hellaswag: 89 }, featured: false },
  { id: "x-ai/grok-4.20", provider: "x-ai", name: "Grok 4.20", category: "text", capabilities: ["text", "code"], context: "128K", speed: "fast", costPer1k: "$0.010", description: "xAI's reasoning-focused model with real-time knowledge and strong analysis.", benchmarks: { mmlu: 90, humaneval: 87, hellaswag: 94 }, featured: false },
  { id: "x-ai/grok-4.20-multi-agent", provider: "x-ai", name: "Grok 4.20 Multi-Agent", category: "text", capabilities: ["text", "code"], context: "256K", speed: "medium", costPer1k: "$0.025", description: "Specialised for multi-agent coordination and orchestration tasks.", benchmarks: { mmlu: 91, humaneval: 88, hellaswag: 95 }, featured: true },
  { id: "openrouter/auto", provider: "openrouter", name: "OpenRouter Auto", category: "text", capabilities: ["text", "code"], context: "varies", speed: "varies", costPer1k: "varies", description: "Automatically routes to the best available model for your prompt. Smart cost/quality optimisation.", benchmarks: { mmlu: 90, humaneval: 86, hellaswag: 93 }, featured: false },
  { id: "black-forest-labs/flux.2-max", provider: "black-forest-labs", name: "FLUX.2 Max", category: "image", capabilities: ["image"], context: "N/A", speed: "medium", costPer1k: "$0.08/img", description: "Black Forest Labs' flagship image model. Photorealistic, precise prompt following.", benchmarks: { fid: 12, clipScore: 0.89, aesthetics: 8.4 }, featured: true },
  { id: "black-forest-labs/flux.2-klein-4b", provider: "black-forest-labs", name: "FLUX.2 Klein 4B", category: "image", capabilities: ["image"], context: "N/A", speed: "fast", costPer1k: "$0.02/img", description: "Compact 4B version of FLUX.2. Fast generation with good quality.", benchmarks: { fid: 18, clipScore: 0.84, aesthetics: 7.9 }, featured: false },
  { id: "google/gemini-3.1-flash-image-preview", provider: "google", name: "Gemini 3.1 Flash Image", category: "image", capabilities: ["text", "image"], context: "1M", speed: "fast", costPer1k: "$0.003", description: "Multi-modal: generate and understand images with 1M token context.", benchmarks: { fid: 15, clipScore: 0.87, aesthetics: 8.1 }, featured: false },
  { id: "google/gemini-3-pro-image-preview", provider: "google", name: "Gemini 3 Pro Image", category: "image", capabilities: ["text", "image"], context: "128K", speed: "medium", costPer1k: "$0.010", description: "High-quality image generation and understanding. Ideal for creative agent workflows.", benchmarks: { fid: 11, clipScore: 0.91, aesthetics: 8.6 }, featured: false },
  { id: "alibaba/wan-2.7", provider: "alibaba", name: "Wan 2.7", category: "image", capabilities: ["image", "video"], context: "N/A", speed: "medium", costPer1k: "$0.05/img", description: "Alibaba's latest visual model supporting both images and short video.", benchmarks: { fid: 14, clipScore: 0.88, aesthetics: 8.2 }, featured: false },
  { id: "google/veo-3.1", provider: "google", name: "Veo 3.1", category: "video", capabilities: ["video"], context: "N/A", speed: "slow", costPer1k: "$0.50/s", description: "Google's advanced video generation model. High fidelity, complex motion, up to 60s.", benchmarks: { fvd: 180, temporalConsistency: 0.92, aesthetics: 8.8 }, featured: true },
  { id: "openai/sora-2-pro", provider: "openai", name: "Sora 2 Pro", category: "video", capabilities: ["video"], context: "N/A", speed: "slow", costPer1k: "$0.40/s", description: "OpenAI's Sora 2 with photorealistic video generation and precise motion control.", benchmarks: { fvd: 165, temporalConsistency: 0.94, aesthetics: 9.0 }, featured: true },
  { id: "bytedance/seedance-2.0", provider: "bytedance", name: "Seedance 2.0", category: "video", capabilities: ["video"], context: "N/A", speed: "medium", costPer1k: "$0.20/s", description: "ByteDance's high-quality video model. Excellent motion consistency and style.", benchmarks: { fvd: 200, temporalConsistency: 0.90, aesthetics: 8.5 }, featured: false },
  { id: "bytedance/seedance-2.0-fast", provider: "bytedance", name: "Seedance 2.0 Fast", category: "video", capabilities: ["video"], context: "N/A", speed: "fast", costPer1k: "$0.10/s", description: "Faster variant of Seedance 2.0. Optimised for quick preview generation.", benchmarks: { fvd: 220, temporalConsistency: 0.87, aesthetics: 8.1 }, featured: false },
];

// ─── Provider logo ────────────────────────────────────────────────────────────

const PROVIDER_CONFIG: Record<string, { bg: string; label: string; textSize?: string }> = {
  anthropic: { bg: "#CC785C", label: "An" },
  openai: { bg: "#10A37F", label: "OA" },
  google: { bg: "#4285F4", label: "G" },
  "x-ai": { bg: "#000000", label: "X" },
  bytedance: { bg: "#FE2C55", label: "BD" },
  alibaba: { bg: "#FF6A00", label: "Ali", textSize: "text-[9px]" },
  qwen: { bg: "#6052DB", label: "Qw" },
  zhipu: { bg: "#5B73E8", label: "Z" },
  meta: { bg: "#0082FB", label: "M" },
  mistral: { bg: "#FF7000", label: "Mi" },
  "black-forest-labs": { bg: "#1a1a2e", label: "BFL", textSize: "text-[9px]" },
  openrouter: { bg: "#7C3AED", label: "OR" },
};

function ProviderLogo({ provider, size = 28 }: { provider: string; size?: number }) {
  const cfg = PROVIDER_CONFIG[provider] ?? { bg: "#666", label: provider.slice(0, 2).toUpperCase() };
  return (
    <div
      className={cn("rounded-lg flex items-center justify-center font-bold text-white shrink-0", cfg.textSize ?? "text-[10px]")}
      style={{ width: size, height: size, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function BudgetBar({ spend, budget, size = "md" }: { spend: number; budget: number; size?: "sm" | "md" }) {
  const pct = Math.min((spend / budget) * 100, 100);
  const danger = pct > 80;
  const warn = pct > 60 && !danger;
  return (
    <div className="flex items-center gap-2 w-full">
      <div className={cn("overflow-hidden bg-muted", size === "sm" ? "h-1" : "h-1.5", "flex-1")}>
        <div
          className={cn("h-full transition-all", { "bg-red-400": danger, "bg-yellow-400": warn, "bg-chart-5": !danger && !warn })}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab() {
  const changePercent = ((totalSpend - lastMonthTotal) / lastMonthTotal) * 100;
  const remaining = totalBudget - totalSpend;

  return (
    <div className="p-6 space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Month Spend", value: `$${totalSpend.toFixed(2)}`, sub: `of $${totalBudget} budget`, icon: DollarSign, accent: false },
          { label: "Remaining", value: `$${remaining.toFixed(2)}`, sub: `${Math.round((remaining / totalBudget) * 100)}% left`, icon: BarChart2, accent: false },
          { label: "vs Last Month", value: `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`, sub: `was $${lastMonthTotal.toFixed(2)}`, icon: changePercent > 0 ? TrendingUp : TrendingDown, accent: changePercent > 10 },
          { label: "Total Runs", value: AGENT_COSTS.reduce((a, c) => a + c.runs, 0).toString(), sub: "this month", icon: Bot, accent: false },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{card.label}</span>
              <card.icon className={cn("w-4 h-4", card.accent ? "text-yellow-400" : "text-muted-foreground")} />
            </div>
            <div className={cn("text-2xl font-semibold", card.accent ? "text-yellow-300" : "text-foreground")}>{card.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{card.sub}</div>
          </div>
        ))}
      </div>

      {totalSpend / totalBudget > 0.5 && (
        <div className="flex items-center gap-3 border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
          <span className="text-yellow-200/80">
            You've used <strong className="text-yellow-300">{Math.round((totalSpend / totalBudget) * 100)}%</strong> of your monthly budget. 15 days remaining.
          </span>
        </div>
      )}

      {/* Daily spend chart */}
      <div className="bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium">Daily Spend</div>
            <div className="text-xs text-muted-foreground">April 2025</div>
          </div>
          <span className="text-xs text-muted-foreground">Avg ${(totalSpend / DAILY_SPEND.length).toFixed(2)}/day</span>
        </div>
        <div className="flex items-end gap-1.5 h-28">
          {DAILY_SPEND.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div className="w-full bg-chart-5/60 hover:bg-chart-5 transition-colors cursor-default" style={{ height: `${(d.amount / maxDaily) * 100}px` }} />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-popover border border-border px-1.5 py-0.5 text-[10px] text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  ${d.amount}
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground/40 hidden sm:block">{i % 3 === 0 ? d.day.split(" ")[1] : ""}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-agent breakdown */}
      <div className="bg-card border border-border">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-medium">Agent Breakdown</span>
          <span className="text-xs text-muted-foreground">This month</span>
        </div>
        <div className="divide-y divide-border">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2 text-xs text-muted-foreground bg-muted/20">
            <span>Agent</span>
            <span className="w-20 text-right">Spend</span>
            <span className="w-16 text-right">Runs</span>
            <span className="w-20 text-right">Avg/run</span>
            <span className="w-36">Budget</span>
          </div>
          {AGENT_COSTS.map((agent) => {
            const pct = (agent.monthSpend / agent.monthBudget) * 100;
            const danger = pct > 80;
            const warn = pct > 60 && !danger;
            return (
              <div key={agent.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 hover:bg-muted/10 transition-colors">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{agent.name}</div>
                  <div className="text-xs text-muted-foreground">{agent.role}</div>
                </div>
                <div className="w-20 text-right">
                  <span className={cn("text-sm font-medium", { "text-red-400": danger, "text-yellow-400": warn, "text-foreground": !danger && !warn })}>
                    ${agent.monthSpend.toFixed(2)}
                  </span>
                </div>
                <div className="w-16 text-right"><span className="text-sm text-muted-foreground">{agent.runs}</span></div>
                <div className="w-20 text-right"><span className="text-xs text-muted-foreground">${agent.avgCostPerRun.toFixed(2)}</span></div>
                <div className="w-36 space-y-1">
                  <BudgetBar spend={agent.monthSpend} budget={agent.monthBudget} size="sm" />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>${agent.monthSpend.toFixed(0)}</span>
                    <span>${agent.monthBudget}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-4 py-3 bg-muted/20">
            <div className="text-xs font-semibold text-muted-foreground">TOTAL</div>
            <div className="w-20 text-right text-sm font-semibold text-foreground">${totalSpend.toFixed(2)}</div>
            <div className="w-16 text-right text-sm text-muted-foreground">{AGENT_COSTS.reduce((a, c) => a + c.runs, 0)}</div>
            <div className="w-20 text-right text-xs text-muted-foreground">${(totalSpend / AGENT_COSTS.reduce((a, c) => a + c.runs, 0)).toFixed(2)}</div>
            <div className="w-36">
              <BudgetBar spend={totalSpend} budget={totalBudget} size="sm" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                <span>${totalSpend.toFixed(0)}</span>
                <span>${totalBudget}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Models tab ───────────────────────────────────────────────────────────────

function ModelsTab() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-sm font-semibold">Active Models</div>
          <div className="text-xs text-muted-foreground">Models currently powering your agents</div>
        </div>
        <span className="ml-auto text-[10px] font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border">
          Powered by OpenRouter
        </span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 items-center px-4 py-2.5 text-xs text-muted-foreground bg-muted/20 border-b border-border">
          <span className="w-7" />
          <span>Model</span>
          <span className="w-24">Category</span>
          <span className="w-24 text-right">Calls / mo</span>
          <span className="w-20 text-right">Avg latency</span>
          <span className="w-24 text-right">Monthly cost</span>
          <span className="w-32" />
        </div>

        {ACTIVE_MODELS.map((m) => (
          <div key={m.name} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 items-center px-4 py-3 border-b border-border last:border-0 hover:bg-muted/10 transition-colors">
            <ProviderLogo provider={m.provider} size={28} />
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{m.displayName}</div>
              <div className="text-[11px] text-muted-foreground truncate font-mono">{m.name}</div>
            </div>
            <span className="w-24 text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-center">{m.category}</span>
            <span className="w-24 text-right text-sm text-foreground">{m.calls.toLocaleString()}</span>
            <span className="w-20 text-right text-sm text-muted-foreground">{m.latency}</span>
            <span className="w-24 text-right text-sm font-medium text-foreground">
              {m.cost === 0 ? <span className="text-emerald-400">Free</span> : `$${m.cost.toFixed(2)}`}
            </span>
            <div className="w-32 flex justify-end">
              <button className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                View in Marketplace
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Marketplace tab ──────────────────────────────────────────────────────────

interface MarketplaceState {
  balance: number;
  topUpAmount: string;
}

function BenchmarkBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CapabilityIcon({ cap }: { cap: string }) {
  const icons: Record<string, React.ElementType> = { text: MessageSquare, code: Code2, image: Image, video: Video };
  const Icon = icons[cap];
  if (!Icon) return null;
  return <Icon className="w-3.5 h-3.5 text-muted-foreground" />;
}

function ModelDetailModal({ model, onClose }: { model: MarketplaceModel; onClose: () => void }) {
  const [state, setState] = useState<MarketplaceState>({ balance: 0, topUpAmount: "5" });
  const [selectedAgent, setSelectedAgent] = useState("Dev Agent");
  const isText = model.category === "text";
  const isImage = model.category === "image";

  const handleAddCredits = () => {
    const amount = parseFloat(state.topUpAmount);
    if (!isNaN(amount) && amount >= 5) {
      setState((s) => ({ ...s, balance: s.balance + amount }));
    }
  };

  const benchmarkEntries = Object.entries(model.benchmarks);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="w-[520px] rounded-2xl bg-card border border-border p-6 max-h-[85vh] overflow-y-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <ProviderLogo provider={model.provider} size={40} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold">{model.name}</h2>
              {model.featured && (
                <span className="rounded-full bg-violet-500/15 text-violet-400 text-[10px] px-2 py-0.5">Featured</span>
              )}
              {model.isDefault && (
                <span className="rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] px-2 py-0.5">Default</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground capitalize">{model.provider}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize">{model.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{model.description}</p>

        {/* Capabilities */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Capabilities</div>
          <div className="flex gap-3 flex-wrap">
            {model.capabilities.map((cap) => (
              <div key={cap} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CapabilityIcon cap={cap} />
                <span className="capitalize">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Context Window", value: model.context },
            { label: "Speed", value: <span className="capitalize">{model.speed}</span> },
            { label: "Cost per 1K tokens", value: model.costPer1k },
            { label: "Provider", value: <span className="capitalize">{model.provider}</span> },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-muted/30 border border-border px-4 py-3">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-sm font-semibold text-foreground">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Benchmarks */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Benchmarks</div>
          <div className="space-y-3">
            {isText && (
              <>
                {typeof model.benchmarks.mmlu === "number" && <BenchmarkBar label="MMLU" value={model.benchmarks.mmlu as number} max={100} />}
                {typeof model.benchmarks.humaneval === "number" && <BenchmarkBar label="HumanEval" value={model.benchmarks.humaneval as number} max={100} />}
                {typeof model.benchmarks.hellaswag === "number" && <BenchmarkBar label="HellaSwag" value={model.benchmarks.hellaswag as number} max={100} />}
              </>
            )}
            {isImage && (
              <>
                {typeof model.benchmarks.fid === "number" && <BenchmarkBar label="FID Score (lower is better)" value={model.benchmarks.fid as number} max={30} />}
                {typeof model.benchmarks.clipScore === "number" && <BenchmarkBar label="CLIP Score" value={Math.round((model.benchmarks.clipScore as number) * 100)} max={100} />}
                {typeof model.benchmarks.aesthetics === "number" && <BenchmarkBar label="Aesthetics" value={Math.round((model.benchmarks.aesthetics as number) * 10)} max={100} />}
              </>
            )}
            {!isText && !isImage && (
              <>
                {benchmarkEntries.map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{key}</span>
                    <span className="font-medium text-foreground">{String(val)}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Balance section */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Balance</span>
            <span className={cn("text-sm font-semibold", state.balance === 0 ? "text-orange-400" : "text-emerald-400")}>
              ${state.balance.toFixed(2)}
            </span>
          </div>
          {state.balance === 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-orange-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>No balance. Add credits to use this model.</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                  <input
                    type="number"
                    min={5}
                    value={state.topUpAmount}
                    onChange={(e) => setState((s) => ({ ...s, topUpAmount: e.target.value }))}
                    className="w-full pl-6 pr-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="5"
                  />
                </div>
                <button onClick={handleAddCredits} className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                  Add Credits
                </button>
              </div>
              <div className="text-[10px] text-muted-foreground">€5 minimum</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {["Dev Agent", "QA Agent", "PM Agent", "Docs Agent", "Deploy Agent"].map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
                <button className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                  Activate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Close */}
        <button onClick={onClose} className="w-full py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

function MarketplaceTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ModelCategory>("all");
  const [selected, setSelected] = useState<MarketplaceModel | null>(null);

  const filtered = MARKETPLACE_MODELS.filter((m) => {
    const matchesCategory = category === "all" || m.category === category;
    const matchesSearch = search === "" || m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryLabels: { key: ModelCategory; label: string }[] = [
    { key: "all", label: "All" },
    { key: "text", label: "Text & Code" },
    { key: "image", label: "Image" },
    { key: "video", label: "Video" },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search models..."
          className="flex-1 px-4 py-2 text-sm bg-card border border-border rounded-full focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
        />
        <div className="flex gap-1.5 flex-wrap">
          {categoryLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                category === key ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            className="apple-card rounded-2xl border border-border bg-card p-4 hover:border-border/60 cursor-pointer transition-all"
          >
            {/* Top row */}
            <div className="flex items-center gap-2.5 mb-2">
              <ProviderLogo provider={m.provider} size={32} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-sm text-foreground truncate">{m.name}</span>
                  {m.featured && (
                    <span className="rounded-full bg-violet-500/15 text-violet-400 text-[10px] px-2 py-px">Featured</span>
                  )}
                  {m.isDefault && (
                    <span className="rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] px-2 py-px">Default</span>
                  )}
                </div>
              </div>
            </div>

            {/* Capability icons */}
            <div className="flex gap-1.5 mb-2">
              {m.capabilities.map((cap) => (
                <CapabilityIcon key={cap} cap={cap} />
              ))}
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{m.description}</p>

            {/* Bottom row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {m.costPer1k}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground capitalize">
                {m.speed}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(m); }}
                className="ml-auto text-xs px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      {selected && <ModelDetailModal model={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ─── API Keys tab ─────────────────────────────────────────────────────────────

interface ApiKey {
  id: string;
  provider: string;
  label: string;
  maskedKey: string;
}

const PROVIDER_OPTIONS = ["OpenAI", "Anthropic", "Google", "Mistral", "Custom"];

const INITIAL_KEYS: ApiKey[] = [
  { id: "default-or", provider: "openrouter", label: "Default (OpenRouter)", maskedKey: "sk-or-v1-34e9●●●●●●●●" },
];

function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [provider, setProvider] = useState("OpenAI");
  const [apiKey, setApiKey] = useState("");
  const [label, setLabel] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleAdd = () => {
    if (!apiKey.trim()) return;
    const masked = apiKey.slice(0, 8) + "●".repeat(8);
    setKeys((prev) => [
      ...prev,
      {
        id: `key-${Date.now()}`,
        provider: provider.toLowerCase().replace(/\s+/g, "-"),
        label: label || `${provider} key`,
        maskedKey: masked,
      },
    ]);
    setApiKey("");
    setLabel("");
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <div className="p-6 space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <div className="text-sm font-semibold">Your API Keys</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          Add your own API provider keys. These override the default OpenRouter routing for the selected provider.
        </div>
      </div>

      {/* Add key form */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Add New Key</div>

        {/* Provider select */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {PROVIDER_OPTIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>

        {/* API Key input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 pr-9 text-sm font-mono bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:font-sans placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Label input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Label <span className="text-muted-foreground/50">(optional)</span></label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Production key"
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={!apiKey.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Key
        </button>
      </div>

      {/* Saved keys */}
      {keys.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved Keys</div>
          {keys.map((k) => (
            <div key={k.id} className="rounded-xl border border-border bg-card/50 px-4 py-3 flex items-center gap-3">
              <ProviderLogo provider={k.provider} size={24} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{k.label}</div>
                <div className="text-xs font-mono text-muted-foreground mt-0.5">{k.maskedKey}</div>
              </div>
              <button
                onClick={() => handleRevoke(k.id)}
                className="flex items-center gap-1 text-xs text-red-400 border border-red-400/30 hover:bg-red-400/10 px-2.5 py-1 rounded-full transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CostsPage() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "models", label: "Models" },
    { key: "marketplace", label: "Marketplace" },
    { key: "apikeys", label: "API Keys" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold">Costs</h1>
          <span className="text-xs text-muted-foreground">April 2025</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 py-2 border-b border-border shrink-0">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              tab === key ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "overview" && <OverviewTab />}
        {tab === "models" && <ModelsTab />}
        {tab === "marketplace" && <MarketplaceTab />}
        {tab === "apikeys" && <ApiKeysTab />}
      </div>
    </div>
  );
}
