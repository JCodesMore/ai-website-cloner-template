#!/usr/bin/env node
// Print code around a term in minified JS/CSS/HTML — the way to read one feature out of a
// bundle (a class name from the rendered DOM, a function name, "ScrollTrigger", "Splide(", ...).
//
// Usage: node find-code.mjs <file|dir> <term> [more terms] [--context 600] [--max 4] [--regex]
// Tip: search the rendered DOM's class names (capture.mjs outline) — elements created by JS
// are absent from SSR HTML, and their class strings lead to the code that builds them.
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  if (i < 0) return d;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const context = Number(flag("context", 600));
const max = Number(flag("max", 4));
const useRegex = args.includes("--regex");
const rest = args.filter((a) => a !== "--regex");
const [target, ...terms] = rest;
if (!target || !terms.length) {
  console.error("Usage: node find-code.mjs <file|dir> <term> [more terms] [--context 600] [--max 4] [--regex]");
  process.exit(1);
}

const files = [];
const walk = (p) => {
  const st = fs.statSync(p);
  if (st.isDirectory()) for (const f of fs.readdirSync(p)) walk(path.join(p, f));
  else if (/\.(m?js|css|html?|json)$/i.test(p)) files.push(p);
};
walk(target);

for (const term of terms) {
  const re = useRegex ? new RegExp(term, "g") : new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  console.log(`\n######## ${term}`);
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    const hits = [...src.matchAll(re)];
    if (!hits.length) continue;
    console.log(`\n=== ${f} — ${hits.length} hit(s)`);
    let lastEnd = -1;
    let shown = 0;
    for (const h of hits) {
      if (h.index < lastEnd) continue; // skip hits already inside the previous window
      const s = Math.max(0, h.index - Math.floor(context / 2));
      const e = Math.min(src.length, h.index + Math.ceil(context / 2));
      console.log(`--- @${h.index}\n${src.slice(s, e).replace(/\s+/g, " ")}`);
      lastEnd = e;
      if (++shown >= max) {
        console.log(`(… more hits; raise --max)`);
        break;
      }
    }
  }
}
