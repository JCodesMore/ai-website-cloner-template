// src/lib/data-guard/runner.ts
import type { DataRule, DomainReport, DataReport } from "./types";
import { productRules } from "./rules";
import { institutionRules } from "./rules";
import { articleRules } from "./rules";
import { commentRules } from "./rules";

interface DomainDef {
  domain: string;
  rules: DataRule[];
}

const domains: DomainDef[] = [
  { domain: "products", rules: productRules },
  { domain: "institutions", rules: institutionRules },
  { domain: "articles", rules: articleRules },
  { domain: "comments", rules: commentRules },
];

export async function validateAndRepair(): Promise<DataReport> {
  const reports: DomainReport[] = [];

  for (const { domain, rules } of domains) {
    const report: DomainReport = { domain, passed: [], warnings: [], errors: [], autoFixed: 0 };
    for (const rule of rules) {
      try {
        const issues = await rule.check();
        if (issues.length === 0) {
          report.passed.push(rule.name);
          continue;
        }
        if (rule.severity === "warn") {
          report.warnings.push(`${rule.name}: ${issues.length} issues`);
          continue;
        }
        if (rule.repair) {
          const result = await rule.repair(issues);
          report.autoFixed += result.fixed;
          if (result.fixed > 0) {
            report.passed.push(`${rule.name} (fixed ${result.fixed})`);
          }
          if (result.skipped > 0) {
            report.errors.push(`${rule.name}: ${result.skipped} unfixed`);
          }
          if (result.errors.length > 0) {
            for (const e of result.errors) {
              report.errors.push(`${rule.name}: ${e}`);
            }
          }
        } else {
          report.errors.push(`${rule.name}: ${issues.length} issues, no repair`);
        }
      } catch (e: any) {
        report.errors.push(`${rule.name}: ${e.message}`);
      }
    }
    reports.push(report);
  }

  return {
    domains: reports,
    totalAutoFixed: reports.reduce((s, r) => s + r.autoFixed, 0),
    totalWarnings: reports.reduce((s, r) => s + r.warnings.length, 0),
  };
}

export function printDataReport(report: DataReport): void {
  const width = 62;
  const line = "─".repeat(width);
  console.log(`\n┌${line}┐`);
  console.log(`│${"DATA INTEGRITY REPORT".padStart(32).padEnd(width)}│`);
  console.log(`├${line}┤`);

  for (const d of report.domains) {
    const domainLabel = d.domain.padEnd(14);
    let firstLine = true;
    const allItems = [
      ...d.passed.map(p => ({ marker: "✓", text: p })),
      ...d.warnings.map(w => ({ marker: "⚠", text: w })),
      ...d.errors.map(e => ({ marker: "✗", text: e })),
    ];
    if (allItems.length === 0) {
      console.log(`│ ${domainLabel}(no rules defined)${" ".repeat(width - 2 - domainLabel.length - 20)} │`);
    }
    for (const item of allItems) {
      const prefix = firstLine ? domainLabel : " ".repeat(14);
      const content = `${prefix}${item.marker} ${item.text}`;
      console.log(`│ ${content.substring(0, width - 2).padEnd(width - 2)} │`);
      firstLine = false;
    }
  }

  console.log(`├${line}┤`);
  const hasIssues = report.totalAutoFixed > 0 || report.totalWarnings > 0;
  const summary = hasIssues
    ? `Auto-fixed: ${report.totalAutoFixed}. Warnings: ${report.totalWarnings}.`
    : "All data checks passed.";
  console.log(`│ ${summary.padEnd(width - 2)} │`);
  console.log(`└${line}┘\n`);
}
