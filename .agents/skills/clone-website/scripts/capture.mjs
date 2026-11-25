#!/usr/bin/env node
// Evidence capture with Playwright. Run the SAME command against the source URL and the local
// route so screenshots line up for comparison.
//
// Usage: node capture.mjs <url> --out <dir> [options]
//   --outline              rendered DOM outline (after JS + scroll-through) → outline.txt, rendered.html
//   --scroll               one screenshot per viewport height (instant scroll) → scroll-NN.png
//   --timeline 1000,4000   screenshots at ms after load (slideshows, intros) → time-<ms>.png
//   --progress <selector> [--steps 0.1,0.4,0.8]
//                          scroll through a tall/sticky scene by progress → progress-<p>.png
//   --click <selector> [--click-times 150,400,1500]
//                          screenshots after clicking (menus, tabs) → click-<ms>.png
//   --rem                  html font-size at several widths (detects vw-scaled rem)
//   --mobile               390x844 touch device instead of 1440x900
//   --wait 4000            ms to wait after load (preloaders, fonts); default 4000
// With no mode flags: --outline --scroll --rem.
// Needs Playwright: npm i --no-save playwright && npx playwright install chromium
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:\/\//.test(a));
const val = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d;
};
const has = (n) => args.includes(`--${n}`);
if (!url || !val("out")) {
  console.error("Usage: node capture.mjs <url> --out <dir> [--outline] [--scroll] [--timeline ms,ms] [--progress sel] [--click sel] [--rem] [--mobile]");
  process.exit(1);
}
const OUT = path.resolve(val("out"));
fs.mkdirSync(OUT, { recursive: true });
const modes = ["outline", "scroll", "timeline", "progress", "click", "rem"].filter(has);
if (!modes.length) modes.push("outline", "scroll", "rem");

let pw;
try {
  pw = await import("playwright");
} catch {
  try {
    pw = createRequire(path.join(process.cwd(), "noop.js"))("playwright");
  } catch {
    console.error("Playwright not found. Run: npm i --no-save playwright && npx playwright install chromium");
    process.exit(1);
  }
}
const { chromium } = pw;
const nums = (s) => s.split(",").map(Number);
const instantScroll = (page, y) => page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);

const browser = await chromium.launch({ headless: true, args: ["--ignore-gpu-blocklist"] });
const ctxOpts = has("mobile")
  ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
  : { viewport: { width: 1440, height: 900 } };
const errors = [];
async function open() {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
  const t0 = Date.now();
  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  return { page, ctx, t0 };
}
const wait = Number(val("wait", 4000));

if (modes.includes("timeline")) {
  const { page, ctx, t0 } = await open();
  for (const t of nums(val("timeline", "1000,2500,5000,8000"))) {
    const left = t - (Date.now() - t0);
    if (left > 0) await page.waitForTimeout(left);
    await page.screenshot({ path: path.join(OUT, `time-${t}.png`) });
  }
  await ctx.close();
}

if (modes.some((m) => ["outline", "scroll", "progress", "click"].includes(m))) {
  const { page, ctx } = await open();
  await page.waitForTimeout(wait);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => innerHeight);

  if (modes.includes("scroll") || modes.includes("outline")) {
    let i = 0;
    for (let y = 0; y < H && i < 40; y += vh, i++) {
      await instantScroll(page, y);
      await page.waitForTimeout(1500);
      if (modes.includes("scroll")) await page.screenshot({ path: path.join(OUT, `scroll-${String(i).padStart(2, "0")}.png`) });
    }
    console.log(`page height ${H}px, ${i} viewport steps`);
  }

  if (modes.includes("outline")) {
    const outline = await page.evaluate(() => {
      const lines = [];
      const walk = (el, d) => {
        const tag = el.tagName.toLowerCase();
        if (["script", "style", "noscript", "path", "g", "defs", "stop", "rect", "circle", "line", "polygon", "source"].includes(tag)) return;
        if (el.classList.contains("char")) return;
        const cls = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).join(".") : "";
        const attrs = ["id", "href", "src", "data-speed", "data-text", "aria-label"]
          .map((a) => (el.getAttribute(a) ? ` ${a}="${el.getAttribute(a).slice(0, 90)}"` : ""))
          .join("");
        let own = "";
        for (const n of el.childNodes) if (n.nodeType === 3) own += n.textContent;
        own = own.replace(/\s+/g, " ").trim();
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const pos = cs.position === "fixed" || cs.position === "sticky" ? ` [${cs.position}]` : "";
        const box = r.width || r.height ? ` (${Math.round(r.width)}x${Math.round(r.height)})` : " (hidden)";
        if (tag === "svg") {
          lines.push(`${"  ".repeat(d)}svg${cls} viewBox="${el.getAttribute("viewBox")}"${box}`);
          return;
        }
        if (tag === "canvas") {
          lines.push(`${"  ".repeat(d)}canvas${cls}${box}${pos}  <-- runtime renderer`);
          return;
        }
        const words = el.querySelector(":scope > .word, :scope > span > .char") ? el.textContent.replace(/\s+/g, " ").trim() : "";
        lines.push(`${"  ".repeat(d)}${tag}${cls}${attrs}${pos}${box}${own || words ? ` | ${(own || words).slice(0, 140)}` : ""}`);
        if (words) return;
        for (const c of el.children) walk(c, d + 1);
      };
      walk(document.body, 0);
      return lines.join("\n");
    });
    fs.writeFileSync(path.join(OUT, "outline.txt"), outline);
    fs.writeFileSync(path.join(OUT, "rendered.html"), await page.content());
    const rootInfo = await page.evaluate(() => ({ html: document.documentElement.className, body: document.body.className }));
    console.log(`outline.txt written (${outline.split("\n").length} lines); html class="${rootInfo.html}" body class="${rootInfo.body}"`);
  }

  if (modes.includes("progress")) {
    const sel = val("progress");
    for (const p of nums(val("steps", "0,0.1,0.25,0.4,0.6,0.8,1"))) {
      await page.evaluate(
        ({ sel, p }) => {
          const el = document.querySelector(sel);
          if (!el) throw new Error(`no element ${sel}`);
          const top = el.getBoundingClientRect().top + scrollY;
          const dist = Math.max(0, el.offsetHeight - innerHeight);
          window.scrollTo({ top: top + p * dist, behavior: "instant" });
        },
        { sel, p }
      );
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(OUT, `progress-${p}.png`) });
    }
  }

  if (modes.includes("click")) {
    const sel = val("click");
    await instantScroll(page, 0);
    await page.waitForTimeout(800);
    await page.click(sel);
    const t0 = Date.now();
    for (const t of nums(val("click-times", "150,400,800,1500,2500"))) {
      const left = t - (Date.now() - t0);
      if (left > 0) await page.waitForTimeout(left);
      await page.screenshot({ path: path.join(OUT, `click-${t}.png`) });
    }
    const after = await page.evaluate(() => ({ html: document.documentElement.className, body: document.body.className }));
    console.log(`after click: html class="${after.html}" body class="${after.body}"`);
  }
  await ctx.close();
}

if (modes.includes("rem")) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load", timeout: 90000 });
  const rows = [];
  for (const w of [1920, 1600, 1440, 1280, 1100, 900, 600, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(200);
    rows.push(`${w}px → html font-size ${await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)}`);
  }
  fs.writeFileSync(path.join(OUT, "rem.txt"), rows.join("\n"));
  console.log(rows.join("\n"));
  await ctx.close();
}

if (errors.length) fs.writeFileSync(path.join(OUT, "errors.txt"), errors.join("\n"));
console.log(`errors: ${errors.length}${errors.length ? " (see errors.txt)" : ""}\nSaved to ${OUT}`);
await browser.close();
