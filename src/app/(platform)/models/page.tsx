"use client";

import { useState, useEffect, Suspense } from "react";
import { Cpu, Eye, EyeOff, X, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomApi {
  id: string;
  name: string;
  baseUrl: string;
  modelName: string;
  description: string;
  status: "active" | "inactive";
}

interface MarketplaceProvider {
  name: string;
  provider: string;
  color: string;
  models: string;
  tier: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MARKETPLACE: MarketplaceProvider[] = [
  { name: "GPT-4o",           provider: "OpenAI",    color: "#10a37f", models: "gpt-4o, gpt-4o-mini",                  tier: "Pay-per-use" },
  { name: "Claude 3.5 Sonnet",provider: "Anthropic", color: "#cc785c", models: "claude-3-5-sonnet, claude-3-haiku",    tier: "Pay-per-use" },
  { name: "Mistral Large",    provider: "Mistral AI",color: "#ff7000", models: "mistral-large, mistral-7b",            tier: "Pay-per-use" },
  { name: "Llama 3.3 70B",    provider: "Meta",      color: "#0082fb", models: "llama-3.3-70b, llama-3.1-8b",         tier: "Free tier available" },
  { name: "Command R+",       provider: "Cohere",    color: "#6b4fbb", models: "command-r-plus, command-r",            tier: "Pay-per-use" },
  { name: "Gemini 1.5 Pro",   provider: "Google",    color: "#4285f4", models: "gemini-1.5-pro, gemini-flash",         tier: "Pay-per-use" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

const inputCls =
  "rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-full transition-colors";

const selectCls =
  "rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-full transition-colors cursor-pointer";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

// ─── MY MODELS TAB ────────────────────────────────────────────────────────────

function MyModelsTab({ customApis, onDelete }: { customApis: CustomApi[]; onDelete: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Gemma 4 — default, cannot delete */}
      <div className="relative rounded-2xl border-2 border-primary/20 bg-card p-5">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 text-xs font-medium text-violet-400">
            Default
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
            <Cpu className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pr-20">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground">Gemma 4</h3>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                Google
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Our base model. Optimized for agent tasks, code generation, and reasoning.
            </p>

            <div className="mt-4 flex gap-3 flex-wrap">
              {[
                { label: "Context", value: "128K tokens" },
                { label: "Speed",   value: "~60 tok/s" },
                { label: "Cost",    value: "Included" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-0.5 rounded-xl border border-border bg-muted/30 px-3 py-2"
                >
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <span className="text-sm font-medium text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom APIs added by user */}
      {customApis.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Custom APIs
          </p>
          {customApis.map((api) => (
            <div
              key={api.id}
              className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/50 border border-border">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{api.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{api.baseUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  api.status === "active"
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : "bg-muted/50 border border-border text-muted-foreground"
                )}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", api.status === "active" ? "bg-emerald-400" : "bg-muted-foreground")} />
                  {api.status}
                </span>
                <button
                  onClick={() => onDelete(api.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {customApis.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center">
          <p className="text-sm text-muted-foreground">No custom APIs added yet.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Switch to the "Custom API" tab to add one.</p>
        </div>
      )}
    </div>
  );
}

// ─── MARKETPLACE TAB ──────────────────────────────────────────────────────────

function MarketplaceTab() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const toggle = (name: string) =>
    setConnected((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Connect to any AI provider through a single unified API. One billing location.
      </p>

      <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {MARKETPLACE.map((provider) => {
          const isConnected = !!connected[provider.name];
          return (
            <div
              key={provider.name}
              onClick={() => toggle(provider.name)}
              className={cn(
                "rounded-2xl border bg-card p-4 cursor-pointer transition-all duration-200 hover:border-border/70 flex flex-col gap-3",
                isConnected ? "border-emerald-500/40 ring-1 ring-emerald-500/20" : "border-border"
              )}
            >
              {/* Provider header */}
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: provider.color }}
                />
                <span className="text-xs text-muted-foreground">{provider.provider}</span>
              </div>

              <div>
                <p className="font-semibold text-foreground text-sm">{provider.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{provider.models}</p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                  {provider.tier}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(provider.name); }}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
                    isConnected
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  {isConnected ? "Connected ✓" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        All providers billed through your MyaiCompany account. No separate subscriptions needed.
      </p>
    </div>
  );
}

// ─── CUSTOM API TAB ───────────────────────────────────────────────────────────

type TestState = "idle" | "testing" | "success" | "error";

function CustomApiTab({
  customApis,
  onAdd,
  onDelete,
}: {
  customApis: CustomApi[];
  onAdd: (api: CustomApi) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [modelName, setModelName] = useState("");
  const [description, setDescription] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testState, setTestState] = useState<TestState>("idle");

  const canAdd = name.trim() !== "" && baseUrl.trim() !== "" && apiKey.trim() !== "";

  const handleTest = () => {
    setTestState("testing");
    setTimeout(() => {
      // deterministic success for demo
      setTestState("success");
    }, 1500);
  };

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      baseUrl: baseUrl.trim(),
      modelName: modelName.trim() || "unknown",
      description: description.trim(),
      status: "active",
    });
    setName("");
    setBaseUrl("");
    setApiKey("");
    setModelName("");
    setDescription("");
    setTestState("idle");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-1">Add Custom API Endpoint</h3>
        <p className="text-sm text-muted-foreground mb-6">Connect any OpenAI-compatible API endpoint.</p>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="API Name">
              <input
                className={inputCls}
                placeholder="e.g. My Private LLM"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field label="Base URL">
              <input
                className={inputCls}
                placeholder="https://api.example.com/v1"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
              />
            </Field>
          </div>

          <Field label="API Key">
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                className={cn(inputCls, "pr-10")}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Field label="Model Name">
            <input
              className={inputCls}
              placeholder="e.g. gpt-4, llama3"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
          </Field>

          <Field label="Description (optional)">
            <textarea
              className={cn(inputCls, "resize-none h-20")}
              placeholder="Short description of this API..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <div className="flex items-center gap-3 pt-1">
            {/* Test connection */}
            <button
              onClick={handleTest}
              disabled={testState === "testing" || !baseUrl || !apiKey}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                testState === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : testState === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {testState === "testing" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {testState === "success" && <Check className="h-3.5 w-3.5" />}
              {testState === "error" && <X className="h-3.5 w-3.5" />}
              {testState === "idle" && "Test Connection"}
              {testState === "testing" && "Testing..."}
              {testState === "success" && "Connection successful"}
              {testState === "error" && "Could not connect"}
            </button>

            {/* Add API */}
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                canAdd
                  ? "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
                  : "bg-muted/20 text-muted-foreground border border-border opacity-50 cursor-not-allowed"
              )}
            >
              Add API
            </button>
          </div>
        </div>
      </div>

      {/* Existing custom APIs */}
      {customApis.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Added APIs ({customApis.length})
          </p>
          {customApis.map((api) => (
            <div
              key={api.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{api.name}</p>
                <p className="text-xs text-muted-foreground truncate">{api.baseUrl}</p>
              </div>
              <button
                onClick={() => onDelete(api.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "my-models" | "marketplace" | "custom";

function ModelsPageInner() {
  const [activeTab, setActiveTab] = useState<Tab>("my-models");
  const [customApis, setCustomApis] = useState<CustomApi[]>([]);

  // Read tab from URL search param on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "custom") setActiveTab("custom");
      else if (tab === "marketplace") setActiveTab("marketplace");
    }
  }, []);

  const addApi = (api: CustomApi) => setCustomApis((prev) => [...prev, api]);
  const deleteApi = (id: string) => setCustomApis((prev) => prev.filter((a) => a.id !== id));

  const tabs: { value: Tab; label: string }[] = [
    { value: "my-models",    label: "My Models" },
    { value: "marketplace",  label: "Marketplace" },
    { value: "custom",       label: "Custom API" },
  ];

  const totalModels = 1 + customApis.length;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center gap-3 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
          <Cpu className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">Models</h1>
          <span className="rounded-full bg-muted/60 border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {totalModels}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-border shrink-0">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px",
                activeTab === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          {activeTab === "my-models" && (
            <MyModelsTab customApis={customApis} onDelete={deleteApi} />
          )}
          {activeTab === "marketplace" && <MarketplaceTab />}
          {activeTab === "custom" && (
            <CustomApiTab customApis={customApis} onAdd={addApi} onDelete={deleteApi} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-full items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    }>
      <ModelsPageInner />
    </Suspense>
  );
}
