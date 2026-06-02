"use client";

import React, { useMemo } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Table2, Users, FileText, HelpCircle, Sparkles } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface QAPair {
  question: string;
  answer: string;
}

interface ParamRow {
  key: string;
  value: string;
}

// ---- parser ----

function parseSections(html: string): Section[] {
  const sections: Section[] = [];
  // Split on ## (exactly two hashes, not ###)
  const parts = html.split(/(?=^## [^#])/m);
  for (const part of parts) {
    const m = part.match(/^## (.+)/m);
    if (!m) continue;
    const title = m[1].trim();
    const content = part.slice(m[0].length).trim();
    const id = title.replace(/\s+/g, "-");
    sections.push({ id, title, content });
  }
  return sections;
}

function parseTable(content: string): ParamRow[] {
  const rows: ParamRow[] = [];
  const lines = content.trim().split("\n");
  for (const line of lines) {
    const m = line.match(/^\|(.+)\|(.+)\|$/);
    if (!m) continue;
    const key = m[1].replace(/\*\*/g, "").trim();
    const value = m[2].replace(/\*\*/g, "").trim();
    if (key && value && key !== "参数" && key !== "------") rows.push({ key, value });
  }
  return rows;
}

function parseQA(content: string): QAPair[] {
  const items: QAPair[] = [];
  const regex = /\*\*问：(.+?)\*\*\s*答：(.+?)(?=\*\*问：|$)/gs;
  let m;
  while ((m = regex.exec(content)) !== null) {
    items.push({ question: m[1].trim(), answer: m[2].trim() });
  }
  return items;
}

function parseListItems(content: string): string[] {
  const items: string[] = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^-\s+(.+)/);
    if (m) items.push(m[1].trim());
  }
  return items;
}

function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
}

// ---- section icons ----

const sectionIcons: Record<string, React.ReactNode> = {
  "产品概述": null,
  "核心参数": <Table2 className="h-4 w-4" />,
  "产品特点": <Sparkles className="h-4 w-4" />,
  "适用人群": <Users className="h-4 w-4" />,
  "申请方式": <FileText className="h-4 w-4" />,
  "常见问题": <HelpCircle className="h-4 w-4" />,
};

// ---- main component ----

export default function ProductIntro({ introHtml }: { introHtml: string }) {
  const sections = useMemo(() => parseSections(introHtml), [introHtml]);

  return (
    <div className="product-intro">
        {sections.map((section) => {
          switch (section.title) {
            case "产品概述":
              return <OverviewSection key={section.id} id={section.id} content={section.content} />;
            case "核心参数":
              return <ParamsSection key={section.id} id={section.id} content={section.content} />;
            case "产品特点":
              return <FeaturesSection key={section.id} id={section.id} content={section.content} />;
            case "适用人群":
              return <AudienceSection key={section.id} id={section.id} content={section.content} />;
            case "申请方式":
              return <ApplySection key={section.id} id={section.id} content={section.content} />;
            case "常见问题":
              return <QASection key={section.id} id={section.id} content={section.content} />;
            default:
              return <GenericSection key={section.id} id={section.id} title={section.title} content={section.content} />;
          }
        })}
    </div>
  );
}

// ---- section components ----

function SectionWrap({ id, title, icon, children }: { id: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
        {icon && <span className="text-emerald-600">{icon}</span>}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function OverviewSection({ id, content }: { id: string; content: string }) {
  const imgMatch = content.match(/!\[.*?\]\((.+?)\)/);
  const imgSrc = imgMatch ? imgMatch[1] : null;
  const text = content.replace(/!\[.*?\]\(.+?\)/, "").trim();

  return (
    <SectionWrap id={id} title="产品概述">
      <div className="flex flex-col gap-4 sm:flex-row">
        {imgSrc && (
          <div className="shrink-0">
            <img
              src={imgSrc}
              alt="产品图"
              className="h-24 w-24 rounded-xl border border-slate-200 object-cover shadow-sm sm:h-28 sm:w-28"
            />
          </div>
        )}
        <p className="text-base leading-relaxed text-slate-600">{stripMarkdown(text)}</p>
      </div>
    </SectionWrap>
  );
}

function ParamsSection({ id, content }: { id: string; content: string }) {
  const rows = parseTable(content);
  return (
    <SectionWrap id={id} title="核心参数" icon={sectionIcons["核心参数"]}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                <td className="w-28 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {row.key}
                </td>
                <td className="px-4 py-2.5 text-base text-slate-700">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionWrap>
  );
}

function FeaturesSection({ id, content }: { id: string; content: string }) {
  const items = parseListItems(content);
  return (
    <SectionWrap id={id} title="产品特点" icon={sectionIcons["产品特点"]}>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => {
          const colonIdx = item.indexOf("：") > -1 ? item.indexOf("：") : item.indexOf(":");
          const title = colonIdx > 0 ? item.slice(0, colonIdx).replace(/\*\*/g, "") : "";
          const desc = colonIdx > 0 ? item.slice(colonIdx + 1).trim() : item;
          return (
            <div
              key={i}
              className="rounded-lg border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white p-4"
            >
              {title && <p className="mb-1 text-base font-semibold text-emerald-800">{title}</p>}
              <p className="text-base leading-relaxed text-slate-600">{desc}</p>
            </div>
          );
        })}
      </div>
    </SectionWrap>
  );
}

function AudienceSection({ id, content }: { id: string; content: string }) {
  const items = parseListItems(content);
  return (
    <SectionWrap id={id} title="适用人群" icon={sectionIcons["适用人群"]}>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-base text-slate-700 shadow-sm"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {i + 1}
            </span>
            {stripMarkdown(item)}
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

function ApplySection({ id, content }: { id: string; content: string }) {
  // Split into intro text + code blocks + steps
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <SectionWrap id={id} title="申请方式" icon={sectionIcons["申请方式"]}>
      <div className="space-y-4">
        {parts.map((part, i) => {
          if (part.startsWith("```")) {
            const code = part.replace(/```/g, "").trim();
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600"
              >
                {code}
              </pre>
            );
          }
          // Render markdown text with basic formatting
          const html = part
            .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-slate-800 mt-4 mb-2">$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/^- (.+)$/gm, '<li class="ml-4 mb-1 text-base text-slate-600">$1</li>')
            .replace(/\n\n/g, "</p><p class='mb-2 text-base text-slate-600'>")
            .replace(/\n/g, "<br/>");

          return (
            <div
              key={i}
              className="text-base leading-relaxed text-slate-600"
              dangerouslySetInnerHTML={{
                __html: `<p class='mb-2 text-base text-slate-600'>${html}</p>`,
              }}
            />
          );
        })}
      </div>
    </SectionWrap>
  );
}

function QASection({ id, content }: { id: string; content: string }) {
  const items = parseQA(content);
  return (
    <SectionWrap id={id} title="常见问题" icon={sectionIcons["常见问题"]}>
      <Accordion items={items} />
    </SectionWrap>
  );
}

function GenericSection({ id, title, content }: { id: string; title: string; content: string }) {
  return (
    <SectionWrap id={id} title={title}>
      <div
        className="prose text-base leading-relaxed text-slate-600"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </SectionWrap>
  );
}
