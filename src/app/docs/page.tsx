"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const NAV = [
  {
    group: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "how-it-works", label: "How It Works" },
      { id: "quick-start", label: "Quick Start" },
    ],
  },
  {
    group: "Automation Systems",
    items: [
      { id: "flowstack", label: "FlowStack" },
      { id: "flowops", label: "FlowOps" },
      { id: "system-architecture", label: "System Architecture" },
    ],
  },
  {
    group: "Workflow Modes",
    items: [
      { id: "lead-mode", label: "Lead Mode" },
      { id: "ops-mode", label: "Ops Mode" },
      { id: "data-sync-mode", label: "Data Sync Mode" },
    ],
  },
  {
    group: "Integrations",
    items: [
      { id: "make", label: "Make" },
      { id: "zapier", label: "Zapier" },
      { id: "n8n", label: "n8n" },
      { id: "airtable", label: "Airtable" },
      { id: "notion", label: "Notion" },
    ],
  },
  {
    group: "Support",
    items: [
      { id: "faq", label: "FAQ" },
      { id: "contact", label: "Contact Us" },
    ],
  },
];

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      className="relative my-4 rounded-lg"
      style={{
        background: "oklch(0.18 0.004 106)",
        border: "1px solid oklch(1 0 0 / 0.08)",
      }}
    >
      <button
        onClick={() => {
          navigator.clipboard.writeText(children);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "12px",
          fontSize: "11px",
          fontWeight: 700,
          color: copied ? "oklch(0.95 0.15 108)" : "oklch(1 0 0 / 0.4)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "color 0.15s",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre
        style={{
          padding: "16px 20px",
          fontSize: "13px",
          color: "oklch(1 0 0 / 0.8)",
          overflowX: "auto",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "tip" | "warning";
  children: React.ReactNode;
}) {
  const styles = {
    info: {
      bg: "oklch(0.567 0.15 248 / 0.08)",
      border: "oklch(0.567 0.15 248 / 0.3)",
      label: "Note",
      color: "oklch(0.567 0.15 248)",
    },
    tip: {
      bg: "oklch(0.95 0.15 108 / 0.06)",
      border: "oklch(0.95 0.15 108 / 0.3)",
      label: "Tip",
      color: "oklch(0.95 0.15 108)",
    },
    warning: {
      bg: "oklch(0.75 0.15 60 / 0.08)",
      border: "oklch(0.75 0.15 60 / 0.3)",
      label: "Warning",
      color: "oklch(0.75 0.15 60)",
    },
  };
  const s = styles[type];
  return (
    <div
      className="my-5 rounded-lg p-4"
      style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: s.color,
          display: "block",
          marginBottom: "6px",
        }}
      >
        {s.label}
      </span>
      <p style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.7)", lineHeight: 1.6, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      style={{
        fontSize: "28px",
        fontWeight: 800,
        color: "oklch(1 0 0 / 0.9)",
        marginTop: "56px",
        marginBottom: "16px",
        scrollMarginTop: "80px",
        paddingBottom: "12px",
        borderBottom: "1px solid oklch(1 0 0 / 0.08)",
      }}
    >
      {children}
    </h2>
  );
}

function SubHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      style={{
        fontSize: "18px",
        fontWeight: 700,
        color: "oklch(1 0 0 / 0.9)",
        marginTop: "32px",
        marginBottom: "10px",
        scrollMarginTop: "80px",
      }}
    >
      {children}
    </h3>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "15px", color: "oklch(1 0 0 / 0.65)", lineHeight: 1.75, marginBottom: "16px" }}>
      {children}
    </p>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        padding: "2px 8px",
        background: "oklch(0.95 0.15 108 / 0.1)",
        color: "oklch(0.95 0.15 108)",
        borderRadius: "2px",
        marginRight: "6px",
      }}
    >
      {children}
    </span>
  );
}

function IntegrationCard({
  name,
  description,
  tags,
}: {
  name: string;
  description: string;
  tags: string[];
}) {
  return (
    <div
      className="rounded-lg p-5"
      style={{
        background: "oklch(0.27 0.008 106)",
        border: "1px solid oklch(1 0 0 / 0.08)",
      }}
    >
      <p style={{ fontSize: "15px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", marginBottom: "6px" }}>
        {name}
      </p>
      <p style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.6)", lineHeight: 1.6, marginBottom: "10px" }}>
        {description}
      </p>
      <div>{tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
    </div>
  );
}

export default function DocsPage() {
  const [activeId, setActiveId] = useState("introduction");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Getting Started": true,
    "Automation Systems": true,
    "Workflow Modes": false,
    "Integrations": false,
    "Support": false,
  });

  useEffect(() => {
    const ids = NAV.flatMap((g) => g.items.map((i) => i.id));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveId(id);
  };

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="overflow-x-clip">
      <Navbar />
      <div
        className="mx-auto flex w-full max-w-6xl gap-0 px-6"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
        {/* Sidebar */}
        <aside
          className="hidden shrink-0 md:block"
          style={{
            width: "220px",
            paddingTop: "40px",
            paddingRight: "32px",
            position: "sticky",
            top: "80px",
            alignSelf: "flex-start",
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
        >
          {NAV.map((group) => (
            <div key={group.group} className="mb-4">
              <button
                onClick={() => toggleGroup(group.group)}
                className="flex w-full items-center justify-between"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 0",
                  fontFamily: "inherit",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    color: "oklch(1 0 0 / 0.5)",
                  }}
                >
                  {group.group}
                </span>
                <span style={{ fontSize: "10px", color: "oklch(1 0 0 / 0.3)" }}>
                  {openGroups[group.group] ? "▾" : "▸"}
                </span>
              </button>
              {openGroups[group.group] && (
                <ul className="mt-1 flex flex-col">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollTo(item.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          padding: "5px 8px",
                          fontSize: "13px",
                          fontWeight: activeId === item.id ? 700 : 400,
                          color:
                            activeId === item.id
                              ? "oklch(0.95 0.15 108)"
                              : "oklch(1 0 0 / 0.55)",
                          borderLeft: `2px solid ${
                            activeId === item.id
                              ? "oklch(0.95 0.15 108)"
                              : "transparent"
                          }`,
                          transition: "color 0.15s, border-color 0.15s",
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            paddingTop: "40px",
            paddingBottom: "80px",
            minWidth: 0,
          }}
        >
          {/* ── Getting Started ── */}
          <SectionHeading id="introduction">Introduction</SectionHeading>
          <Body>
            Welcome to the FLO documentation. FLO builds custom automation systems that run your
            business behind the scenes — from lead capture to client delivery, always on, no manual
            work.
          </Body>
          <Body>
            This documentation covers how our systems are built, how the different workflow modes
            work, and how to get the most out of your automation stack.
          </Body>
          <Callout type="tip">
            New here? Start with the Quick Start guide to understand how a FLO system is scoped,
            built, and handed off.
          </Callout>

          <SectionHeading id="how-it-works">How It Works</SectionHeading>
          <Body>
            Every FLO system follows the same three-phase process: Scope, Build, and Hand Off. We
            map your existing workflows, identify automation opportunities, then build a connected
            system using the tools you already rely on.
          </Body>
          <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { step: "01", title: "Scoping Call", body: "We learn your workflow, tools, and where time is lost." },
              { step: "02", title: "System Build", body: "We design and build your automation stack in 3–15 days." },
              { step: "03", title: "Hand Off", body: "You get a live system, documentation, and ongoing support." },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-lg p-5"
                style={{
                  background: "oklch(0.27 0.008 106)",
                  border: "1px solid oklch(1 0 0 / 0.08)",
                }}
              >
                <p style={{ fontSize: "12px", fontWeight: 700, color: "oklch(0.95 0.15 108)", marginBottom: "6px" }}>
                  Step {s.step}
                </p>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", marginBottom: "6px" }}>
                  {s.title}
                </p>
                <p style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.6)", lineHeight: 1.5 }}>{s.body}</p>
              </div>
            ))}
          </div>

          <SectionHeading id="quick-start">Quick Start</SectionHeading>
          <Body>
            Getting started with FLO takes one conversation. Here&apos;s what to expect in your
            first week.
          </Body>
          <SubHeading id="qs-step1">1. Book a scoping call</SubHeading>
          <Body>
            Use the link below to schedule a 30-minute scoping call. Come prepared with a list of
            your most time-consuming manual tasks.
          </Body>
          <a
            href="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "oklch(0.95 0.15 108)",
              color: "oklch(0.217 0.0038309 106.715)",
              fontSize: "14px",
              fontWeight: 700,
              padding: "10px 24px",
              borderRadius: 0,
              textDecoration: "none",
              marginBottom: "24px",
            }}
          >
            Book a Call →
          </a>
          <SubHeading id="qs-step2">2. Review the system map</SubHeading>
          <Body>
            After your call, we&apos;ll send a system map outlining your workflows, the tools
            we&apos;ll connect, and the logic we&apos;ll build. You approve it before we write a
            single automation.
          </Body>
          <SubHeading id="qs-step3">3. Go live</SubHeading>
          <Body>
            Most systems are live within 3–7 business days. You&apos;ll receive a walkthrough video,
            this documentation, and 30 days of dedicated support.
          </Body>

          {/* ── Automation Systems ── */}
          <SectionHeading id="flowstack">FlowStack</SectionHeading>
          <Body>
            FlowStack is FLO&apos;s core product — a fully custom automation system built around a
            single primary workflow. It&apos;s ideal for businesses tackling their first major
            automation: lead intake, client onboarding, invoice routing, or ops handoff.
          </Body>
          <Callout type="info">
            FlowStack systems are built once and run indefinitely. You own the system; we maintain
            it.
          </Callout>
          <SubHeading id="flowstack-scope">What&apos;s Included</SubHeading>
          <ul style={{ paddingLeft: "20px", marginBottom: "16px" }}>
            {[
              "1 core workflow, end-to-end",
              "Up to 3 tool integrations",
              "Error handling and retry logic",
              "30-day post-launch support window",
              "Walkthrough video and runbook",
            ].map((item) => (
              <li key={item} style={{ fontSize: "14px", color: "oklch(1 0 0 / 0.7)", lineHeight: 2 }}>
                {item}
              </li>
            ))}
          </ul>

          <SectionHeading id="flowops">FlowOps</SectionHeading>
          <Body>
            FlowOps is the multi-workflow tier. It handles the full operational surface of a
            business — not just one trigger, but the interconnected logic that keeps your team
            running: lead routing, follow-up sequences, internal task creation, CRM updates, and
            reporting.
          </Body>
          <SubHeading id="flowops-diff">How FlowOps Differs</SubHeading>
          <Body>
            Where FlowStack automates a single linear process, FlowOps handles branching logic,
            conditional routing, and cross-tool state management. Think of it as your operations
            layer, not just a trigger-action chain.
          </Body>
          <CodeBlock>{`# Example: FlowOps lead routing logic
IF lead.source == "Typeform"
  → enrich via Clearbit
  → score lead
  → IF score >= 70: create deal in Pipedrive + notify Slack
  → IF score < 70: add to nurture sequence in ActiveCampaign`}</CodeBlock>

          <SectionHeading id="system-architecture">System Architecture</SectionHeading>
          <Body>
            All FLO systems follow a layered architecture: a trigger layer, a logic layer, and an
            action layer. This separation makes systems easier to maintain, debug, and extend.
          </Body>
          <div className="my-4 rounded-lg p-5" style={{ background: "oklch(0.18 0.004 106)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
            <pre style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.75)", lineHeight: 1.8, margin: 0 }}>
{`Trigger Layer    →  Form submission, webhook, schedule, email
       ↓
Logic Layer      →  Conditions, enrichment, scoring, routing
       ↓
Action Layer     →  CRM update, Slack message, email send, sheet row`}
            </pre>
          </div>

          {/* ── Workflow Modes ── */}
          <SectionHeading id="lead-mode">Lead Mode</SectionHeading>
          <Body>
            Lead Mode automates the full lead lifecycle — from first touch to qualified handoff.
            It captures leads from any source, enriches and scores them, routes them to the right
            person or pipeline stage, and triggers follow-up automatically.
          </Body>
          <SubHeading id="lead-sources">Supported Lead Sources</SubHeading>
          <div className="my-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {["Typeform", "Webflow Forms", "Facebook Ads", "Google Ads", "Calendly", "Manual Entry"].map((s) => (
              <div key={s} className="rounded px-3 py-2" style={{ background: "oklch(0.27 0.008 106)", border: "1px solid oklch(1 0 0 / 0.08)", fontSize: "13px", color: "oklch(1 0 0 / 0.7)" }}>
                {s}
              </div>
            ))}
          </div>

          <SectionHeading id="ops-mode">Ops Mode</SectionHeading>
          <Body>
            Ops Mode handles your internal operations: task creation, team notifications, project
            updates, and approval workflows. It connects your communication tools (Slack, email)
            with your project management tools (Notion, Airtable, ClickUp) automatically.
          </Body>
          <Callout type="tip">
            Ops Mode works best when combined with Lead Mode — new leads trigger ops tasks without
            any manual handoff.
          </Callout>

          <SectionHeading id="data-sync-mode">Data Sync Mode</SectionHeading>
          <Body>
            Data Sync Mode keeps your CRM, spreadsheets, and databases in sync across tools. No
            more copy-pasting between Airtable and Google Sheets, or manually updating Pipedrive
            after a call.
          </Body>
          <CodeBlock>{`# Example: Data Sync schedule
Every hour:
  → Pull new deals from Pipedrive
  → Append rows to Google Sheets (master tracker)
  → Update Airtable base (ops team view)
  → Send Slack digest if > 5 new deals`}</CodeBlock>

          {/* ── Integrations ── */}
          <SectionHeading id="make">Make</SectionHeading>
          <Body>
            Make (formerly Integromat) is FLO&apos;s primary automation platform for visual,
            multi-step workflows. It handles complex branching, error routing, and large data
            operations with a clear visual interface.
          </Body>
          <SubHeading id="make-use-cases">Common Use Cases</SubHeading>
          <Body>Lead routing, onboarding sequences, multi-step data transformation, webhook
          processing, and CRM sync.</Body>

          <SectionHeading id="zapier">Zapier</SectionHeading>
          <Body>
            Zapier is used for straightforward trigger-action workflows, particularly when a client
            already has a Zapier account or when the integration library is the deciding factor.
          </Body>
          <Callout type="warning">
            Zapier has rate limits on lower-tier plans. For high-volume workflows (&gt;1000
            tasks/month), we recommend Make or n8n instead.
          </Callout>

          <SectionHeading id="n8n">n8n</SectionHeading>
          <Body>
            n8n is used for self-hosted or code-heavy automation needs. It offers the most
            flexibility for custom logic, HTTP requests, and JavaScript transformations within
            workflow nodes.
          </Body>
          <CodeBlock>{`// Example: Custom n8n function node
const leads = $input.all();
return leads
  .filter(lead => lead.json.score >= 70)
  .map(lead => ({
    json: {
      ...lead.json,
      assignedTo: lead.json.region === "US" ? "team-us" : "team-eu"
    }
  }));`}</CodeBlock>

          <SectionHeading id="airtable">Airtable</SectionHeading>
          <Body>
            Airtable serves as both a database and a lightweight CRM in many FLO systems. It&apos;s
            the central data layer that your automations read from and write to.
          </Body>

          <SectionHeading id="notion">Notion</SectionHeading>
          <Body>
            Notion is used for ops dashboards, project tracking, and internal wikis. FLO connects
            Notion pages and databases to your automation pipelines so that records are created and
            updated without any manual entry.
          </Body>

          {/* ── Support ── */}
          <SectionHeading id="faq">FAQ</SectionHeading>
          {[
            { q: "Can I change the workflow after it's built?", a: "Yes. We offer a change request window during the 30/60/90-day support period. Larger changes outside scope are quoted separately." },
            { q: "What happens if an automation breaks?", a: "All FLO systems include error handling and alerting. If something breaks, you'll get a Slack or email notification with details, and we'll fix it within one business day during the support window." },
            { q: "Do I need a Make or Zapier account?", a: "You'll need an account on whichever platform we use for your build. We'll guide you through setup and can manage the account on your behalf if preferred." },
            { q: "Can you automate something not on this list?", a: "Almost certainly yes. If a tool has an API, a webhook, or an existing integration, we can connect it. Book a scoping call and we'll confirm." },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="mb-4 rounded-lg p-5"
              style={{ background: "oklch(0.27 0.008 106)", border: "1px solid oklch(1 0 0 / 0.08)" }}
            >
              <p style={{ fontSize: "14px", fontWeight: 700, color: "oklch(1 0 0 / 0.9)", marginBottom: "8px" }}>{q}</p>
              <p style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.6)", lineHeight: 1.65, margin: 0 }}>{a}</p>
            </div>
          ))}

          <SectionHeading id="contact">Contact Us</SectionHeading>
          <Body>
            Can&apos;t find what you&apos;re looking for? Our team responds to all questions within
            one business day.
          </Body>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <a
              href="/signup"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                background: "oklch(0.27 0.008 106)",
                border: "1px solid oklch(0.95 0.15 108 / 0.3)",
                borderRadius: "8px",
                padding: "20px",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 700, color: "oklch(0.95 0.15 108)" }}>
                Book a Call →
              </span>
              <span style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.55)" }}>
                30-minute scoping or support session
              </span>
            </a>
            <a
              href="mailto:hello@floautomation.io"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                background: "oklch(0.27 0.008 106)",
                border: "1px solid oklch(0.567 0.15 248 / 0.3)",
                borderRadius: "8px",
                padding: "20px",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: 700, color: "oklch(0.567 0.15 248)" }}>
                Email Support →
              </span>
              <span style={{ fontSize: "13px", color: "oklch(1 0 0 / 0.55)" }}>
                hello@floautomation.io
              </span>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/"
              style={{
                fontSize: "13px",
                color: "oklch(1 0 0 / 0.5)",
                textDecoration: "none",
              }}
              className="hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
            <Link
              href="/pricing"
              style={{
                fontSize: "13px",
                color: "oklch(1 0 0 / 0.5)",
                textDecoration: "none",
              }}
              className="hover:text-white transition-colors"
            >
              View Pricing →
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
