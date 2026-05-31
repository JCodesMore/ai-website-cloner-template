/**
 * Data integrity checker — runs against PostgreSQL (the source of truth).
 *
 * Usage:
 *   bun run check-data.mjs
 *   bun run check-data.mjs --ci        # exit 1 if data has errors
 */

import { Pool } from "pg";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORTS_DIR = join(ROOT, "reports");

if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const ci = process.argv.includes("--ci");
const now = new Date();
const dateStr = now.toISOString().slice(0, 10);

async function main() {
  const errors = [];

  // ── Products ──────────────────────────────────────────
  const { rows: [prodSummary] } = await pool.query(`
    SELECT
      count(*) as total,
      count(*) FILTER (WHERE name IS NULL OR name = '') as no_name,
      count(*) FILTER (WHERE image IS NULL OR image = '') as no_image,
      count(*) FILTER (WHERE image LIKE 'https://%') as remote_image,
      count(*) FILTER (WHERE jsonb_array_length(advantages) = 0) as no_advantages,
      count(*) FILTER (WHERE summary IS NULL OR summary = '') as no_summary,
      count(*) FILTER (WHERE intro_html IS NULL OR length(intro_html) < 200) as short_intro,
      count(*) FILTER (WHERE institution_full_name IS NULL OR institution_full_name = '') as no_fullname,
      count(*) FILTER (WHERE category IS NULL OR category = '') as no_category,
      count(*) FILTER (WHERE max_amount IS NULL OR max_amount = '') as no_amount,
      count(*) FILTER (WHERE rate IS NULL OR rate = '') as no_rate,
      count(*) FILTER (WHERE rate LIKE '%万元%') as bad_rate
    FROM products
  `);

  // ── Institutions ──────────────────────────────────────
  const { rows: [instSummary] } = await pool.query(`
    SELECT
      count(*) as total,
      count(*) FILTER (WHERE logo LIKE 'https://%') as remote_logo,
      count(*) FILTER (WHERE intro_html IS NULL OR length(intro_html) < 100) as short_intro
    FROM institutions
  `);

  // ── Articles ──────────────────────────────────────────
  const { rows: [artSummary] } = await pool.query(`
    SELECT count(*) as total,
           count(*) FILTER (WHERE body IS NULL OR length(body) < 100) as short_body
    FROM articles
  `);

  // ── Build report ──────────────────────────────────────
  const lines = [];
  lines.push("# Data Integrity Report — " + dateStr);
  lines.push("");
  lines.push("Generated: " + now.toISOString());
  lines.push("");

  lines.push("## Products (" + prodSummary.total + " total)");
  lines.push("");
  lines.push("| Field | Missing | Pct |");
  lines.push("|-------|---------|-----|");

  const productFields = [
    ["Name", +prodSummary.no_name],
    ["Image (any)", +prodSummary.no_image],
    ["Image (remote URL)", +prodSummary.remote_image],
    ["Advantages", +prodSummary.no_advantages],
    ["Summary", +prodSummary.no_summary],
    ["Intro HTML (<200c)", +prodSummary.short_intro],
    ["Institution Full Name", +prodSummary.no_fullname],
    ["Category", +prodSummary.no_category],
    ["Max Amount", +prodSummary.no_amount],
    ["Rate", +prodSummary.no_rate],
    ["Rate (swapped w/ amount)", +prodSummary.bad_rate],
  ];

  for (const [label, count] of productFields) {
    const pct = prodSummary.total > 0 ? Math.round(count / prodSummary.total * 100) : 0;
    const icon = pct === 0 ? "✅" : pct < 10 ? "⚠️" : "❌";
    lines.push(`| ${icon} ${label} | ${count} | ${pct}% |`);
    if (pct > 0 && label.includes("Advantages") || label.includes("Summary") || label.includes("Image (remote")) {
      errors.push(`products.${label.toLowerCase().replace(/[^a-z]/g, "_")}: ${count}/${prodSummary.total} (${pct}%)`);
    }
  }
  lines.push("");

  lines.push("## Institutions (" + instSummary.total + " total)");
  lines.push("");
  lines.push("| Field | Missing | Pct |");
  lines.push("|-------|---------|-----|");
  const instFields = [
    ["Logo (remote URL)", +instSummary.remote_logo],
    ["Intro HTML (<100c)", +instSummary.short_intro],
  ];
  for (const [label, count] of instFields) {
    const pct = instSummary.total > 0 ? Math.round(count / instSummary.total * 100) : 0;
    const icon = pct === 0 ? "✅" : pct < 10 ? "⚠️" : "❌";
    lines.push(`| ${icon} ${label} | ${count} | ${pct}% |`);
  }
  lines.push("");

  lines.push("## Articles (" + artSummary.total + " total)");
  lines.push("");
  lines.push("| Field | Missing | Pct |");
  lines.push("|-------|---------|-----|");
  lines.push(`| Body (<100c) | ${artSummary.short_body} | ${Math.round(artSummary.short_body / artSummary.total * 100)}% |`);
  lines.push("");

  const report = lines.join("\n");
  console.log(report);

  const reportPath = join(REPORTS_DIR, `data-check-${dateStr}.md`);
  writeFileSync(reportPath, report, "utf-8");
  console.log(`Report saved: reports/data-check-${dateStr}.md`);

  if (ci && errors.length > 0) {
    console.error(`\n❌ Data integrity errors found:\n${errors.join("\n")}`);
    process.exit(1);
  }

  await pool.end();
}

main().catch(err => {
  console.error("Check failed:", err.message);
  process.exit(1);
});
