"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings2,
  User,
  Palette,
  Bell,
  Cpu,
  Link2,
  Bot,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, LANGUAGES, type LangCode } from "@/context/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section =
  | "General"
  | "Profile"
  | "Appearance"
  | "Notifications"
  | "API & Models"
  | "Integrations"
  | "Agents"
  | "Danger Zone";

interface NavItem {
  label: Section;
  icon: React.ReactNode;
  danger?: boolean;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: "General",      icon: <Settings2     className="h-4 w-4" /> },
  { label: "Profile",      icon: <User          className="h-4 w-4" /> },
  { label: "Appearance",   icon: <Palette       className="h-4 w-4" /> },
  { label: "Notifications",icon: <Bell          className="h-4 w-4" /> },
  { label: "API & Models", icon: <Cpu           className="h-4 w-4" /> },
  { label: "Integrations", icon: <Link2         className="h-4 w-4" /> },
  { label: "Agents",       icon: <Bot           className="h-4 w-4" /> },
  { label: "Danger Zone",  icon: <AlertTriangle className="h-4 w-4" />, danger: true },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function useSave(key?: string) {
  const [saved, setSaved] = useState(false);
  const save = useCallback(() => {
    setSaved(true);
    if (key && typeof window !== "undefined") {
      // signal saved — actual persistence done per field
    }
  }, [key]);
  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);
  return { saved, save };
}

const inputCls =
  "rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-full transition-colors";

const selectCls =
  "rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 w-full transition-colors cursor-pointer";

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-6", className)}>
      {children}
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold mb-1 text-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function SaveBtn({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2",
        saved
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
          : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
      )}
    >
      {saved ? <><Check className="h-3.5 w-3.5" /> Saved ✓</> : "Save Changes"}
    </button>
  );
}

function IOSToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-12 shrink-0 rounded-full border-2 border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

// ─── GENERAL ──────────────────────────────────────────────────────────────────

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Australia/Sydney",
  "America/Sao_Paulo",
  "Africa/Cairo",
  "Pacific/Auckland",
];

type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

function GeneralSection() {
  const { saved, save } = useSave();
  const { lang, setLang } = useI18n();

  const [timezone, setTimezone] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("tz") ?? "UTC";
    return "UTC";
  });
  const [dateFormat, setDateFormat] = useState<DateFormat>(() => {
    if (typeof window !== "undefined")
      return (localStorage.getItem("dateFormat") as DateFormat) ?? "MM/DD/YYYY";
    return "MM/DD/YYYY";
  });

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tz", timezone);
      localStorage.setItem("dateFormat", dateFormat);
    }
    save();
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionTitle title="General" description="Workspace-wide preferences." />
      <SectionCard>
        <div className="flex flex-col gap-5">
          <Field label="Language" hint="Changes the interface language.">
            <select
              className={selectCls}
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} — {l.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Timezone">
            <select
              className={selectCls}
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </Field>

          <Field label="Date Format">
            <div className="flex flex-col gap-2">
              {(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] as DateFormat[]).map((fmt) => (
                <label key={fmt} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="dateFormat"
                    value={fmt}
                    checked={dateFormat === fmt}
                    onChange={() => setDateFormat(fmt)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{fmt}</span>
                </label>
              ))}
            </div>
          </Field>

          <div className="pt-1">
            <SaveBtn onClick={handleSave} saved={saved} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────

function ProfileSection() {
  const { saved, save } = useSave();
  const [name, setName] = useState("Johan D.");
  const [email, setEmail] = useState("johan@myaicompany.io");

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionTitle title="Profile" description="Your personal information." />
      <SectionCard>
        <div className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-lg font-semibold text-primary select-none">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{name}</p>
              <span className="mt-1 inline-flex items-center rounded-full bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 text-xs font-medium text-violet-400">
                Owner
              </span>
            </div>
          </div>

          <div className="h-px bg-border" />

          <Field label="Full Name">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.io"
            />
          </Field>

          <Field label="Role">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-1 text-sm font-medium text-violet-400">
                Owner
              </span>
              <span className="text-xs text-muted-foreground">Full access to all settings</span>
            </div>
          </Field>

          <div className="pt-1">
            <SaveBtn onClick={save} saved={saved} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── APPEARANCE ───────────────────────────────────────────────────────────────

type Theme = "Dark" | "Light" | "System";
type Density = "Compact" | "Default" | "Comfortable";

const ACCENT_SWATCHES: { hex: string; label: string }[] = [
  { hex: "#8b5cf6", label: "Violet" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#10b981", label: "Emerald" },
  { hex: "#f97316", label: "Orange" },
  { hex: "#f43f5e", label: "Rose" },
  { hex: "#0ea5e9", label: "Sky" },
];

function AppearanceSection() {
  const { saved, save } = useSave();
  const [theme, setTheme] = useState<Theme>("Dark");
  const [density, setDensity] = useState<Density>(() => {
    if (typeof window !== "undefined")
      return (localStorage.getItem("density") as Density) ?? "Default";
    return "Default";
  });
  const [accent, setAccent] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("accentUser") ?? "#8b5cf6";
    return "#8b5cf6";
  });

  const applyTheme = (t: Theme) => {
    setTheme(t);
    if (typeof window !== "undefined") {
      if (t === "Dark") document.documentElement.setAttribute("data-theme", "dark");
      else if (t === "Light") document.documentElement.setAttribute("data-theme", "light");
      else document.documentElement.removeAttribute("data-theme");
    }
  };

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("density", density);
      localStorage.setItem("accentUser", accent);
      document.documentElement.style.setProperty("--accent-user", accent);
    }
    save();
  };

  const themeOptions: { value: Theme; icon: React.ReactNode; preview: string }[] = [
    { value: "Dark",   icon: <Moon className="h-4 w-4" />,    preview: "bg-zinc-900 border-zinc-700" },
    { value: "Light",  icon: <Sun className="h-4 w-4" />,     preview: "bg-zinc-100 border-zinc-200" },
    { value: "System", icon: <Monitor className="h-4 w-4" />, preview: "bg-gradient-to-r from-zinc-900 to-zinc-100 border-zinc-500" },
  ];

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionTitle title="Appearance" description="Customize the look and feel." />

      <SectionCard>
        <div className="flex flex-col gap-6">
          {/* Theme */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, icon, preview }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    onClick={() => applyTheme(value)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 rounded-2xl border p-3 text-sm transition-all duration-200",
                      active
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    {active && (
                      <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                    <div className={cn("h-8 w-full rounded-lg border", preview)} />
                    <div className="flex items-center gap-1.5">
                      {icon}
                      {value}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Accent color */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Accent Color</p>
            <div className="flex gap-3">
              {ACCENT_SWATCHES.map((c) => (
                <button
                  key={c.hex}
                  title={c.label}
                  onClick={() => setAccent(c.hex)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                    accent === c.hex ? "border-white/80 scale-110 ring-2 ring-white/30" : "border-transparent"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Density */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-foreground">Sidebar Density</p>
            <div className="flex gap-2">
              {(["Compact", "Default", "Comfortable"] as Density[]).map((d) => {
                const active = density === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      active
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    {active && <Check className="h-3 w-3" />}
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-1">
            <SaveBtn onClick={handleSave} saved={saved} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

function NotificationsSection() {
  const { saved, save } = useSave();
  const [notifEmail, setNotifEmail] = useState("johan@myaicompany.io");
  const [toggles, setToggles] = useState({
    newIssues:     true,
    agentUpdates:  true,
    mentions:      true,
    weeklyDigest:  false,
  });

  const setToggle = (key: keyof typeof toggles) => (v: boolean) =>
    setToggles((prev) => ({ ...prev, [key]: v }));

  const notifItems: { key: keyof typeof toggles; label: string; description: string }[] = [
    { key: "newIssues",    label: "New Issues",     description: "Get notified when a new issue is created." },
    { key: "agentUpdates", label: "Agent Updates",  description: "Receive updates when agents complete tasks or fail." },
    { key: "mentions",     label: "Mentions",       description: "Get notified when you are mentioned." },
    { key: "weeklyDigest", label: "Weekly Digest",  description: "A weekly summary of your workspace activity." },
  ];

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionTitle title="Notifications" description="Control what you hear about and when." />

      <SectionCard>
        <div className="flex flex-col gap-4">
          {notifItems.map((item, i) => (
            <div key={item.key}>
              <IOSToggle
                checked={toggles[item.key]}
                onChange={setToggle(item.key)}
                label={item.label}
                description={item.description}
              />
              {i < notifItems.length - 1 && <div className="mt-4 h-px bg-border/60" />}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <Field label="Notification Email" hint="Where email notifications will be sent.">
          <input
            type="email"
            className={inputCls}
            value={notifEmail}
            onChange={(e) => setNotifEmail(e.target.value)}
            placeholder="you@company.io"
          />
        </Field>
      </SectionCard>

      <SaveBtn onClick={save} saved={saved} />
    </div>
  );
}

// ─── API & MODELS ─────────────────────────────────────────────────────────────

const CONNECTED_APIS = [
  { name: "Gemma 4 Default", status: "active" },
  { name: "Custom LLM – Prod", status: "active" },
  { name: "Mistral Self-hosted", status: "inactive" },
];

function ApiModelsSection() {
  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionTitle title="API & Models" description="Manage your AI model connections and API keys." />

      {/* Info card */}
      <SectionCard>
        <div className="flex flex-col gap-4">
          {/* Default model */}
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30 shrink-0">
              <Cpu className="h-5 w-5 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Gemma 4 by Google</p>
              <p className="text-xs text-muted-foreground">Default model for all agents</p>
            </div>
            <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-2.5 py-0.5 text-xs font-medium text-violet-400 shrink-0">
              Google
            </span>
          </div>

          {/* Connected APIs */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Connected APIs
            </p>
            {CONNECTED_APIS.map((api) => (
              <div key={api.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/10 px-4 py-3">
                <span className="text-sm text-foreground">{api.name}</span>
                <span className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                  api.status === "active"
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                    : "bg-muted/50 border border-border text-muted-foreground"
                )}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", api.status === "active" ? "bg-emerald-400" : "bg-muted-foreground")} />
                  {api.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href="/models"
          className="rounded-full px-4 py-2 text-sm font-medium bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors flex items-center gap-2"
        >
          Manage Models <ChevronRight className="h-4 w-4" />
        </a>
        <a
          href="/models?tab=custom"
          className="rounded-full px-4 py-2 text-sm font-medium border border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
        >
          Add Custom API
        </a>
      </div>
    </div>
  );
}

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────

const INTEGRATIONS_DATA = [
  { key: "github",  name: "GitHub",  connected: true,  color: "#24292e" },
  { key: "slack",   name: "Slack",   connected: false, color: "#e01e5a" },
  { key: "jira",    name: "Jira",    connected: false, color: "#0052cc" },
  { key: "linear",  name: "Linear",  connected: false, color: "#5e6ad2" },
  { key: "notion",  name: "Notion",  connected: false, color: "#000000" },
  { key: "vercel",  name: "Vercel",  connected: false, color: "#000000" },
];

function IntegrationsSection() {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS_DATA.map((i) => [i.key, i.connected]))
  );

  const toggle = (key: string) =>
    setConnected((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <SectionTitle title="Integrations" description="Connect your favorite tools." />
      <div className="grid grid-cols-2 gap-4">
        {INTEGRATIONS_DATA.map((integration) => {
          const isConnected = connected[integration.key];
          return (
            <div
              key={integration.key}
              className={cn(
                "rounded-2xl border bg-card p-5 flex flex-col gap-4 transition-all duration-200",
                isConnected ? "border-emerald-500/30" : "border-border"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                  style={{ backgroundColor: integration.color + "22", color: integration.color, border: `1px solid ${integration.color}33` }}
                >
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{integration.name}</p>
                    {isConnected && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Connected
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggle(integration.key)}
                className={cn(
                  "w-full rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  isConnected
                    ? "border-border text-muted-foreground hover:border-red-500/40 hover:text-red-400"
                    : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {isConnected ? "Disconnect" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AGENTS ───────────────────────────────────────────────────────────────────

function AgentsSection() {
  const { saved, save } = useSave();
  const [maxConcurrent, setMaxConcurrent] = useState(5);
  const [budget, setBudget] = useState(100);
  const [autoPause, setAutoPause] = useState(false);
  const [heartbeat, setHeartbeat] = useState("5min");

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("agentMaxConcurrent", String(maxConcurrent));
      localStorage.setItem("agentBudget", String(budget));
      localStorage.setItem("agentAutoPause", String(autoPause));
      localStorage.setItem("agentHeartbeat", heartbeat);
    }
    save();
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionTitle title="Agents" description="Default configuration for all agents." />
      <SectionCard>
        <div className="flex flex-col gap-5">
          <Field label="Max Concurrent Agents" hint="How many agents can run in parallel.">
            <input
              type="number"
              min={1}
              max={20}
              className={inputCls}
              value={maxConcurrent}
              onChange={(e) => setMaxConcurrent(Number(e.target.value))}
            />
          </Field>

          <Field label="Default Monthly Budget per Agent">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <input
                type="number"
                min={0}
                className={cn(inputCls, "pl-7")}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </div>
          </Field>

          <Field label="Heartbeat Interval" hint="How often agents report their status.">
            <select
              className={selectCls}
              value={heartbeat}
              onChange={(e) => setHeartbeat(e.target.value)}
            >
              {["1min", "5min", "15min", "30min"].map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </Field>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <IOSToggle
              checked={autoPause}
              onChange={setAutoPause}
              label="Auto-pause on budget exceed"
              description="Automatically pause an agent when its monthly budget is exceeded."
            />
          </div>

          <div className="pt-1">
            <SaveBtn onClick={handleSave} saved={saved} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── DANGER ZONE ──────────────────────────────────────────────────────────────

function DangerZoneSection() {
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportState, setExportState] = useState<"idle" | "preparing" | "ready">("idle");

  const handleExport = () => {
    setExportState("preparing");
    setTimeout(() => setExportState("ready"), 2000);
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <SectionTitle title="Danger Zone" description="Irreversible actions — proceed with caution." />

      <div className="rounded-2xl border border-red-500/30 bg-red-950/20 overflow-hidden">
        {/* Delete all data */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-red-500/20">
          <div>
            <p className="text-sm font-medium text-foreground">Delete all data</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Contact support to permanently delete your account data.</p>
          </div>
          <button
            disabled
            className="shrink-0 rounded-full border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400/50 cursor-not-allowed opacity-50"
          >
            Contact Support
          </button>
        </div>

        {/* Reset to defaults */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-red-500/20">
          <div>
            <p className="text-sm font-medium text-foreground">Reset to defaults</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Reset all settings to their original defaults.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {confirmReset && (
              <button
                onClick={() => setConfirmReset(false)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/40 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => {
                if (confirmReset) {
                  if (typeof window !== "undefined") localStorage.clear();
                  setConfirmReset(false);
                } else {
                  setConfirmReset(true);
                }
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                confirmReset
                  ? "border-red-500/50 bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  : "border-red-500/40 bg-transparent text-red-400 hover:bg-red-500/10"
              )}
            >
              {confirmReset ? "Confirm Reset" : "Reset to Defaults"}
            </button>
          </div>
        </div>

        {/* Export all data */}
        <div className="flex items-start justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-medium text-foreground">Export all data</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Download a JSON archive of your workspace.</p>
          </div>
          <button
            onClick={exportState === "idle" ? handleExport : undefined}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              exportState === "idle"
                ? "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                : exportState === "preparing"
                ? "border-border text-muted-foreground cursor-wait"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            )}
          >
            {exportState === "idle" && "Export all data"}
            {exportState === "preparing" && "Preparing export..."}
            {exportState === "ready" && "Download ready"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("General");

  function renderContent() {
    switch (activeSection) {
      case "General":       return <GeneralSection />;
      case "Profile":       return <ProfileSection />;
      case "Appearance":    return <AppearanceSection />;
      case "Notifications": return <NotificationsSection />;
      case "API & Models":  return <ApiModelsSection />;
      case "Integrations":  return <IntegrationsSection />;
      case "Agents":        return <AgentsSection />;
      case "Danger Zone":   return <DangerZoneSection />;
    }
  }

  return (
    <div className="flex h-full bg-background">
      {/* Left nav */}
      <nav className="w-52 shrink-0 border-r border-border py-4 px-2 sticky top-0 h-screen overflow-y-auto">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
          Settings
        </p>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = item.label === activeSection;
            return (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.label)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-all duration-200",
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : item.danger
                    ? "text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span className={cn(
                  "shrink-0",
                  active ? "text-accent-foreground" : item.danger ? "text-red-400/70" : ""
                )}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Right content */}
      <main className="flex-1 overflow-y-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
}
