"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Boxes,
  Download,
  MoreHorizontal,
  XCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

// ─── Existing skill types & data ──────────────────────────────────────────────

type Category = "code" | "test" | "write" | "deploy" | "analyze";

interface Skill {
  id: string;
  name: string;
  category: Category;
  description: string;
  agents: string[];
  instructions: string;
}

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; label: string }> = {
  code:    { bg: "bg-violet-500/15", text: "text-violet-400",  label: "Code"    },
  test:    { bg: "bg-yellow-500/15", text: "text-yellow-400",  label: "Test"    },
  write:   { bg: "bg-blue-500/15",   text: "text-blue-400",    label: "Write"   },
  deploy:  { bg: "bg-orange-500/15", text: "text-orange-400",  label: "Deploy"  },
  analyze: { bg: "bg-emerald-500/15",text: "text-emerald-400", label: "Analyze" },
};

const INITIAL_SKILLS: Skill[] = [
  { id: "s1",  name: "Code Review",        category: "code",    description: "Reviews pull requests for code quality, security issues, and best practices.",              agents: ["Dev Agent", "QA Agent"],              instructions: "Review the provided code changes for: 1) Security vulnerabilities 2) Performance issues 3) Code style consistency 4) Test coverage gaps. Provide actionable feedback with specific line references." },
  { id: "s2",  name: "Write Tests",         category: "test",    description: "Generates comprehensive unit and integration tests for code changes.",                    agents: ["QA Agent"],                           instructions: "Analyze the code and generate tests covering: happy paths, edge cases, error scenarios. Aim for >85% coverage. Use the existing test framework and patterns." },
  { id: "s3",  name: "Generate Docs",       category: "write",   description: "Creates technical documentation from code and API specifications.",                      agents: ["Docs Agent"],                         instructions: "Extract public APIs, create markdown documentation with examples, update the README, and generate OpenAPI spec from route handlers." },
  { id: "s4",  name: "Deploy Service",      category: "deploy",  description: "Handles deployment pipeline execution and rollback procedures.",                         agents: ["Deploy Agent"],                       instructions: "Run deployment checklist, execute CI/CD pipeline, monitor deployment health, roll back automatically if error rate exceeds 1% within 10 minutes." },
  { id: "s5",  name: "Analyze Logs",        category: "analyze", description: "Parses application logs to identify errors, anomalies, and performance bottlenecks.",    agents: ["Dev Agent", "QA Agent"],              instructions: "Query the last 24h of logs, identify ERROR and WARN patterns, correlate with deployment events, generate a summary report with severity rankings." },
  { id: "s6",  name: "Triage Issues",       category: "analyze", description: "Categorizes and prioritizes incoming issues based on severity and business impact.",     agents: ["PM Agent"],                           instructions: "Review new issues, assign priority (P0-P3) based on user impact and business criticality, assign to appropriate agent, add relevant labels." },
  { id: "s7",  name: "Send Report",         category: "write",   description: "Compiles and sends status reports to stakeholders.",                                      agents: ["PM Agent"],                           instructions: "Aggregate metrics from the last period, format as a structured report, highlight wins and blockers, send to configured Slack channel or email." },
  { id: "s8",  name: "Search Web",          category: "analyze", description: "Searches the internet for information relevant to current tasks.",                       agents: ["Dev Agent", "PM Agent", "Docs Agent"], instructions: "Use search tools to find relevant documentation, Stack Overflow answers, GitHub issues, or news. Summarize findings and cite sources." },
  { id: "s9",  name: "Run SQL Query",       category: "code",    description: "Executes read-only database queries to gather data insights.",                           agents: ["Dev Agent", "PM Agent"],              instructions: "Construct and execute SELECT queries against the production read replica. Never run INSERT/UPDATE/DELETE. Return results in a formatted table." },
  { id: "s10", name: "Write PR Description",category: "write",   description: "Generates clear, informative pull request descriptions from diffs.",                    agents: ["Dev Agent"],                          instructions: "Analyze the git diff, write a concise PR title, summary of changes, testing notes, and screenshots section. Use the team's PR template." },
  { id: "s11", name: "Monitor Metrics",     category: "analyze", description: "Watches key application metrics and alerts on anomalies.",                               agents: ["Deploy Agent", "QA Agent"],           instructions: "Poll Grafana/Datadog every 5 minutes. Alert if: error rate >0.5%, p95 latency >500ms, CPU >80%, memory >85%. Include trend data in alerts." },
  { id: "s12", name: "Parse JSON Schema",   category: "code",    description: "Validates and transforms JSON data against schemas.",                                    agents: ["Dev Agent"],                          instructions: "Parse the provided JSON, validate against the schema, report validation errors with path references, suggest schema fixes for invalid data." },
];

const AGENT_COLORS: Record<string, string> = {
  "Dev Agent":    "bg-violet-500/15 text-violet-400",
  "QA Agent":     "bg-yellow-500/15 text-yellow-400",
  "PM Agent":     "bg-emerald-500/15 text-emerald-400",
  "Docs Agent":   "bg-pink-500/15 text-pink-400",
  "Deploy Agent": "bg-orange-500/15 text-orange-400",
};

function CategoryBadge({ category }: { category: Category }) {
  const { bg, text, label } = CATEGORY_COLORS[category];
  return (
    <span className={cn("px-1.5 py-0.5 text-[10px] font-medium", bg, text)}>
      {label}
    </span>
  );
}

function AgentPill({ name }: { name: string }) {
  const cls = AGENT_COLORS[name] ?? "bg-muted text-muted-foreground";
  return (
    <span className={cn("px-1.5 py-0.5 text-[10px] font-medium", cls)}>
      {name}
    </span>
  );
}

function SkillCard({
  skill,
  expanded,
  onToggle,
}: {
  skill: Skill;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border p-4 cursor-pointer transition-colors hover:border-foreground/20",
        expanded && "border-foreground/30"
      )}
      onClick={onToggle}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-medium text-foreground truncate">
          {skill.name}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <CategoryBadge category={skill.category} />
          {expanded ? (
            <ChevronUp className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {skill.description}
      </p>

      {/* Bottom row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-muted-foreground mr-0.5">
          Used by {skill.agents.length} {skill.agents.length === 1 ? "agent" : "agents"}:
        </span>
        {skill.agents.map((agent) => (
          <AgentPill key={agent} name={agent} />
        ))}
      </div>

      {/* Expanded instructions */}
      {expanded && (
        <div
          className="mt-3 pt-3 border-t border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Instructions
          </p>
          <textarea
            readOnly
            value={skill.instructions}
            rows={4}
            className="w-full resize-none bg-background border border-border px-3 py-2 text-xs text-foreground/80 focus:outline-none font-mono leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}

interface NewSkillForm {
  name: string;
  description: string;
  category: Category;
  instructions: string;
}

const EMPTY_FORM: NewSkillForm = {
  name: "",
  description: "",
  category: "code",
  instructions: "",
};

// ─── Installed Skill types ────────────────────────────────────────────────────

interface InstalledSkill {
  id: string;
  name: string;
  description: string;
  version: string;
  status: "active" | "paused";
  author: string;
}

const INITIAL_INSTALLED: InstalledSkill[] = [
  { id: "i1", name: "Code Review",          description: "Reviews PRs and suggests improvements",               version: "1.2.0", status: "active", author: "MyaiCompany" },
  { id: "i2", name: "Deployment",           description: "Manages CI/CD pipelines and deployments",            version: "0.9.1", status: "active", author: "community"   },
  { id: "i3", name: "Test Generator",       description: "Generates unit and integration tests automatically", version: "2.1.0", status: "active", author: "MyaiCompany" },
  { id: "i4", name: "Documentation Writer", description: "Generates technical docs from code",                 version: "1.0.3", status: "paused", author: "community"   },
];

type InstallState = "idle" | "loading" | "success" | "error";
type InstallMethod = "url" | "folder";

// ─── Installed skill card ─────────────────────────────────────────────────────

function InstalledSkillCard({
  skill,
  onRemove,
}: {
  skill: InstalledSkill;
  onRemove: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2 relative">
      {/* Top row: name + badges + three-dots */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-semibold text-sm text-foreground">{skill.name}</span>
          {/* Author badge */}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium border",
              skill.author === "MyaiCompany"
                ? "bg-violet-500/15 text-violet-400 border-violet-500/30"
                : "bg-muted/50 text-muted-foreground border-border"
            )}
          >
            {skill.author}
          </span>
          {/* Version pill */}
          <span className="rounded-full bg-muted/50 border border-border px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
            v{skill.version}
          </span>
          {/* Status dot */}
          <span className="flex items-center gap-1 text-[10px]">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                skill.status === "active" ? "bg-emerald-400" : "bg-yellow-400"
              )}
            />
            <span className={skill.status === "active" ? "text-emerald-400" : "text-yellow-400"}>
              {skill.status}
            </span>
          </span>
        </div>

        {/* Three-dots menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-10 w-36 rounded-xl border border-border bg-card shadow-lg py-1"
              onMouseLeave={() => setMenuOpen(false)}
            >
              {[
                { label: "Edit name" },
                { label: "View logs" },
                { label: "Disable" },
                { label: "Uninstall", danger: true },
              ].map((item) => (
                <button
                  key={item.label}
                  className={cn(
                    "w-full text-left px-3 py-1.5 text-xs hover:bg-muted/40 transition-colors",
                    item.danger ? "text-red-400" : "text-foreground"
                  )}
                  onClick={() => {
                    if (item.label === "Uninstall") onRemove(skill.id);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-1">
        <button className="rounded-full border border-border px-3 py-1 text-xs text-foreground hover:bg-muted/40 transition-colors">
          Configure
        </button>
        <button
          onClick={() => onRemove(skill.id)}
          className="rounded-full px-3 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── Install Panel ────────────────────────────────────────────────────────────

const DEMO_SKILL = {
  name: "Web Scraper",
  description: "Scrapes and summarizes web pages for agents",
  version: "1.0.0",
  author: "community",
};

function InstallPanel({ onInstall }: { onInstall: (skill: InstalledSkill) => void }) {
  const [method, setMethod] = useState<InstallMethod>("url");

  // URL method state
  const [urlInput, setUrlInput] = useState("");
  const [urlState, setUrlState] = useState<InstallState>("idle");

  // Folder method state
  const [folderInput, setFolderInput] = useState("");
  const [folderState, setFolderState] = useState<InstallState>("idle");

  function handleFetchUrl() {
    if (!urlInput.startsWith("http")) {
      setUrlState("error");
      return;
    }
    setUrlState("loading");
    setTimeout(() => setUrlState("success"), 2000);
  }

  function handleInstallFromUrl() {
    onInstall({
      id: `i-${Date.now()}`,
      name: DEMO_SKILL.name,
      description: DEMO_SKILL.description,
      version: DEMO_SKILL.version,
      status: "active",
      author: DEMO_SKILL.author,
    });
    setUrlInput("");
    setUrlState("idle");
  }

  function handleInstallFolder() {
    if (!folderInput.startsWith("/") && !folderInput.startsWith("C:\\")) {
      setFolderState("error");
      return;
    }
    setFolderState("loading");
    setTimeout(() => setFolderState("success"), 2000);
  }

  function handleConfirmFolder() {
    onInstall({
      id: `i-${Date.now()}`,
      name: DEMO_SKILL.name,
      description: DEMO_SKILL.description,
      version: DEMO_SKILL.version,
      status: "active",
      author: DEMO_SKILL.author,
    });
    setFolderInput("");
    setFolderState("idle");
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Install a Skill</h2>
      </div>

      {/* Method toggle */}
      <div className="flex rounded-xl border border-border overflow-hidden w-fit">
        {(["url", "folder"] as InstallMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={cn(
              "px-4 py-1.5 text-xs font-medium transition-colors",
              method === m
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {m === "url" ? "From URL" : "From Folder"}
          </button>
        ))}
      </div>

      {/* ── From URL ── */}
      {method === "url" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Skill URL or Link</label>
            <p className="text-[11px] text-muted-foreground">
              Paste a skill URL (e.g. from GitHub or a skill registry). We&apos;ll fetch and install it automatically.
            </p>
            <input
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlState("idle"); }}
              placeholder="https://github.com/user/repo/skill"
              className="rounded-xl border border-border bg-input px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-full transition-colors mt-1"
            />
          </div>

          {/* Fetch button */}
          {urlState !== "success" && (
            <button
              onClick={handleFetchUrl}
              disabled={urlState === "loading"}
              className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium w-fit flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              {urlState === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {urlState === "loading" ? "Fetching skill..." : "Fetch & Install"}
            </button>
          )}

          {/* Success card */}
          {urlState === "success" && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-foreground">{DEMO_SKILL.name}</span>
                <span className="rounded-full bg-muted/50 border border-border px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                  v{DEMO_SKILL.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{DEMO_SKILL.description}</p>
              <button
                onClick={handleInstallFromUrl}
                className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium w-fit hover:bg-primary/90 transition-colors mt-1"
              >
                Confirm Install
              </button>
            </div>
          )}

          {/* Error card */}
          {urlState === "error" && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">
                Could not fetch skill — please check the URL and try again.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── From Folder ── */}
      {method === "folder" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Folder Path</label>
            <p className="text-[11px] text-muted-foreground">
              Point to a local skill folder. The folder must contain a{" "}
              <code className="font-mono">skill.json</code> manifest.
            </p>
            <input
              value={folderInput}
              onChange={(e) => { setFolderInput(e.target.value); setFolderState("idle"); }}
              placeholder="/path/to/skill"
              className="rounded-xl border border-border bg-input px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-full transition-colors mt-1"
            />
          </div>

          {folderState !== "success" && (
            <button
              onClick={handleInstallFolder}
              disabled={folderState === "loading"}
              className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium w-fit flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              {folderState === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {folderState === "loading" ? "Installing..." : "Install"}
            </button>
          )}

          {folderState === "success" && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-foreground">{DEMO_SKILL.name}</span>
                <span className="rounded-full bg-muted/50 border border-border px-2 py-0.5 text-[10px] text-muted-foreground font-mono">
                  v{DEMO_SKILL.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{DEMO_SKILL.description}</p>
              <button
                onClick={handleConfirmFolder}
                className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-medium w-fit hover:bg-primary/90 transition-colors mt-1"
              >
                Confirm Install
              </button>
            </div>
          )}

          {folderState === "error" && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">
                Could not find a valid skill at that path — make sure the folder contains a{" "}
                <code className="font-mono">skill.json</code> manifest.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info box */}
      <div className="rounded-xl bg-muted/30 border border-border/50 p-3 text-xs text-muted-foreground">
        Skills extend your agents&apos; capabilities. A skill is a collection of tools and instructions packaged for reuse.{" "}
        Browse the skill registry at{" "}
        <a
          href="https://skills.myaicompany.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary/70 hover:text-primary underline"
        >
          skills.myaicompany.io
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SkillsPage() {
  // Existing skills (agent-prompt skills)
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewSkillForm>(EMPTY_FORM);

  // Installed skills
  const [installedSkills, setInstalledSkills] = useState<InstalledSkill[]>(INITIAL_INSTALLED);
  const [showInstallPanel, setShowInstallPanel] = useState(false);

  const filtered = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase())
  );

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleCreate() {
    if (!form.name.trim()) return;
    const newSkill: Skill = {
      id: `s${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim() || "No description.",
      category: form.category,
      agents: [],
      instructions: form.instructions.trim(),
    };
    setSkills((prev) => [newSkill, ...prev]);
    setForm(EMPTY_FORM);
    setShowModal(false);
  }

  function handleInstall(skill: InstalledSkill) {
    setInstalledSkills((prev) => [...prev, skill]);
    setShowInstallPanel(false);
  }

  function handleRemoveInstalled(id: string) {
    setInstalledSkills((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4 text-muted-foreground" />
          <h1 className="text-base font-semibold text-foreground">Skills</h1>
          <span className="flex items-center justify-center h-5 min-w-6 px-1.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground">
            {skills.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="pl-7 pr-3 py-1.5 text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors w-48 rounded-lg"
            />
          </div>
          {/* New Skill button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium hover:bg-violet-500 transition-colors rounded-full"
          >
            <Plus className="w-3 h-3" />
            New Skill
          </button>
          {/* Install Skill button */}
          <button
            onClick={() => setShowInstallPanel((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-medium text-foreground hover:bg-muted/40 transition-colors rounded-full"
          >
            <Download className="w-3 h-3" />
            Install Skill
          </button>
        </div>
      </div>

      {/* ── Skills Installation section ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-0 h-full">
          {/* Left: installed skills list */}
          <div className="p-5 border-r border-border flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Installed Skills
                <span className="ml-2 rounded-full bg-muted/60 border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {installedSkills.length}
                </span>
              </h2>
            </div>

            {installedSkills.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center">
                <p className="text-sm text-muted-foreground">No skills installed yet.</p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  Use &quot;Install Skill&quot; to add your first skill.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {installedSkills.map((skill) => (
                  <InstalledSkillCard
                    key={skill.id}
                    skill={skill}
                    onRemove={handleRemoveInstalled}
                  />
                ))}
              </div>
            )}

            {/* Divider to existing skills grid */}
            <div className="mt-4 pt-4 border-t border-border">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Agent Prompt Skills
                <span className="ml-2 rounded-full bg-muted/60 border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {filtered.length}
                </span>
              </h2>
              {filtered.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                  No skills found
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      expanded={expandedId === skill.id}
                      onToggle={() => handleToggle(skill.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: install panel */}
          <div className="p-5 overflow-y-auto">
            {showInstallPanel ? (
              <InstallPanel onInstall={handleInstall} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 border border-border">
                  <Download className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Install a skill</p>
                <p className="text-xs text-muted-foreground">
                  Click &quot;Install Skill&quot; to add new capabilities from a URL or local folder.
                </p>
                <button
                  onClick={() => setShowInstallPanel(true)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/40 transition-colors mt-1"
                >
                  Open install panel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Skill Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="bg-card border border-border w-full max-w-md mx-4 flex flex-col rounded-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">New Skill</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-4 py-4 flex flex-col gap-3">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Summarize Ticket"
                  className="bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of what this skill does..."
                  rows={2}
                  className="resize-none bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as Category }))
                  }
                  className="bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground/30 transition-colors rounded-xl"
                >
                  {(Object.keys(CATEGORY_COLORS) as Category[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_COLORS[cat].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructions */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Instructions
                </label>
                <textarea
                  value={form.instructions}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, instructions: e.target.value }))
                  }
                  placeholder="Describe step-by-step what the agent should do when using this skill..."
                  rows={6}
                  className="resize-none bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors font-mono rounded-xl"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.name.trim()}
                className="px-4 py-1.5 bg-violet-600 text-white text-xs font-medium hover:bg-violet-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-full"
              >
                Create Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
