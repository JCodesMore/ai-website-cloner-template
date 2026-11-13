#!/usr/bin/env node
// Pull rules from a (minified) stylesheet by selector, keeping their @media context, so the
// source CSS can be ported verbatim instead of guessed from screenshots.
//
// Usage:
//   node css-pick.mjs <css file|dir> --match "<selector regex>" [--exclude "<regex>"]
//   node css-pick.mjs <css file|dir> --base    # :root vars, html/body sizing, @font-face families,
//                                              # @keyframes, @property — read this first
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const val = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const target = args[0];
if (!target || (!val("match") && !args.includes("--base"))) {
  console.error('Usage: node css-pick.mjs <css|dir> --match "<regex>" [--exclude "<regex>"] | --base');
  process.exit(1);
}
const files = [];
const walk = (p) => {
  if (fs.statSync(p).isDirectory()) for (const f of fs.readdirSync(p)) walk(path.join(p, f));
  else if (p.endsWith(".css")) files.push(p);
};
walk(target);

function blocks(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    const open = s.indexOf("{", i);
    if (open < 0) break;
    const head = s.slice(i, open).trim();
    let depth = 1;
    let j = open + 1;
    while (j < s.length && depth) {
      if (s[j] === "{") depth++;
      else if (s[j] === "}") depth--;
      j++;
    }
    out.push({ head, body: s.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}

const groups = new Map();
const add = (media, rule) => {
  if (!groups.has(media)) groups.set(media, []);
  groups.get(media).push(rule);
};

for (const f of files) {
  const css = fs.readFileSync(f, "utf8").replace(/^﻿/, "").replace(/\/\*[\s\S]*?\*\//g, "");
  if (args.includes("--base")) {
    const fonts = new Set();
    for (const b of blocks(css)) {
      if (b.head.startsWith("@font-face")) {
        const fam = b.body.match(/font-family:\s*([^;]+)/);
        const w = b.body.match(/font-weight:\s*([^;]+)/);
        const st = b.body.match(/font-style:\s*([^;]+)/);
        if (fam) fonts.add(`${fam[1].trim()} ${w ? w[1] : ""} ${st ? st[1] : ""}`.trim());
      } else if (b.head.startsWith("@keyframes") || b.head.startsWith("@property")) {
        add("", `${b.head}{${b.body}}`);
      } else if (b.head.startsWith("@media")) {
        for (const r of blocks(b.body)) if (/(^|,)\s*(html|body|:root)\b/.test(r.head)) add(b.head, `${r.head}{${r.body}}`);
      } else if (/(^|,)\s*(html|body|:root)\b/.test(b.head)) {
        add("", `${b.head}{${b.body}}`);
      }
    }
    console.log(`/* fonts in ${path.basename(f)}: ${[...fonts].join(" | ")} */`);
    continue;
  }
  const match = new RegExp(val("match"));
  const exclude = val("exclude") ? new RegExp(val("exclude")) : null;
  const keep = (head) => match.test(head) && !(exclude && exclude.test(head));
  for (const b of blocks(css)) {
    if (b.head.startsWith("@media") || b.head.startsWith("@supports") || b.head.startsWith("@container")) {
      for (const r of blocks(b.body)) if (keep(r.head)) add(b.head, `${r.head}{${r.body}}`);
    } else if (!b.head.startsWith("@") && keep(b.head)) {
      add("", `${b.head}{${b.body}}`);
    }
  }
}

for (const [media, rules] of groups) {
  console.log(media ? `\n${media} {` : "/* base */");
  for (const r of rules) console.log((media ? "  " : "") + r);
  if (media) console.log("}");
}
