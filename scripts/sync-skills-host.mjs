#!/usr/bin/env node
/**
 * Format-aware skill sync — file I/O host only.
 * Text transforms: asm/wasm/sync-text.wat
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, ".claude", "skills", "clone-website", "SKILL.md");
const WASM = join(ROOT, "public", "wasm", "sync-text.wasm");

const SHORT_DESC = "Reverse-engineer and clone any website as a pixel-perfect replica";
const HEADER =
  "<!-- AUTO-GENERATED from .claude/skills/clone-website/SKILL.md — do not edit directly.\n" +
  "     Run `npm run sync:skills` to regenerate. -->\n\n";
const NEEDLE = "$ARGUMENTS";
const REPL_PLAIN = "the target URL provided by the user";
const REPL_GEMINI = "{{args}}";

const wasmBytes = readFileSync(WASM);
const instance = new WebAssembly.Instance(new WebAssembly.Module(wasmBytes), {});
const exp = instance.exports;
const memory = exp.memory;

function mem() {
  return new Uint8Array(memory.buffer);
}

function grow(need) {
  const page = 65536;
  const have = memory.buffer.byteLength;
  if (need <= have) return;
  memory.grow(Math.ceil(need / page) - Math.floor(have / page));
}

function writeBytes(rel, content) {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, "utf8");
  console.log(`  ✓ ${rel}`);
}

function wasmReplace(body, replacement) {
  const enc = new TextEncoder();
  const bodyB = enc.encode(body);
  const needleB = enc.encode(NEEDLE);
  const replB = enc.encode(replacement);
  const src = 0;
  const needle = (bodyB.length + 64) & ~15;
  const repl = needle + 64;
  const dst = repl + 256;
  grow(dst + bodyB.length + Math.max(replB.length, 1) * (bodyB.length + 1) + 4096);
  const m = mem();
  m.set(bodyB, src);
  m.set(needleB, needle);
  m.set(replB, repl);
  const n = exp.replace_all(src, bodyB.length, needle, needleB.length, repl, replB.length, dst);
  return new TextDecoder().decode(m.subarray(dst, dst + n));
}

function wasmJsonEscape(text) {
  const enc = new TextEncoder();
  const srcB = enc.encode(text);
  const src = 0;
  const dst = (srcB.length + 64) & ~15;
  grow(dst + srcB.length * 2 + 16);
  const m = mem();
  m.set(srcB, src);
  const n = exp.json_escape(src, srcB.length, dst);
  return new TextDecoder().decode(m.subarray(dst, dst + n));
}

function wasmNormalizeAndBody(raw) {
  const enc = new TextEncoder();
  const rawB = enc.encode(raw);
  const src = 0;
  const dst = (rawB.length + 64) & ~15;
  grow(dst + rawB.length + 16);
  let m = mem();
  m.set(rawB, src);
  const nlen = exp.normalize_lf(src, rawB.length, dst);
  m = mem();
  const norm = Buffer.from(m.subarray(dst, dst + nlen));
  grow(nlen + 16);
  m = mem();
  m.set(norm, 0);
  if (!exp.find_body(0, nlen)) {
    throw new Error("Could not parse SKILL.md frontmatter");
  }
  const off = exp.body_off();
  const blen = exp.body_len();
  const full = new TextDecoder().decode(m.subarray(0, nlen));
  const body = new TextDecoder().decode(m.subarray(off, off + blen));
  return { full, body };
}

console.log("Syncing clone-website skill (WASM transforms)...");
let raw;
try {
  raw = readFileSync(SOURCE, "utf8");
} catch {
  console.error("Error: Source skill not found");
  process.exit(1);
}

const { full, body } = wasmNormalizeAndBody(raw);
const noArgs = wasmReplace(body, REPL_PLAIN);
const geminiBody = wasmReplace(body, REPL_GEMINI);

writeBytes(".codex/skills/clone-website/SKILL.md", full);
writeBytes(".github/skills/clone-website/SKILL.md", full);
writeBytes(".cursor/commands/clone-website.md", HEADER + noArgs);
writeBytes(".windsurf/workflows/clone-website.md", HEADER + noArgs);
writeBytes(
  ".gemini/commands/clone-website.toml",
  `# AUTO-GENERATED from .claude/skills/clone-website/SKILL.md\n` +
    `# Run \`npm run sync:skills\` to regenerate.\n\n` +
    `description = "${SHORT_DESC}"\n` +
    `name = "clone-website"\n\n` +
    `prompt = '''\n${geminiBody}\n'''\n`
);
writeBytes(
  ".opencode/commands/clone-website.md",
  `---\ndescription: "${SHORT_DESC}"\n---\n${HEADER}${body}`
);
writeBytes(
  ".augment/commands/clone-website.md",
  `---\ndescription: "${SHORT_DESC}"\nargument-hint: "<url>"\n---\n${HEADER}${body}`
);
writeBytes(
  ".continue/commands/clone-website.md",
  `---\nname: clone-website\ndescription: "${SHORT_DESC}"\ninvokable: true\n---\n${HEADER}${body}`
);

const escaped = wasmJsonEscape(noArgs);
writeBytes(
  ".amazonq/cli-agents/clone-website.json",
  `{\n  "name": "clone-website",\n  "description": "${SHORT_DESC}",\n  "prompt": "${escaped}",\n  "fileContext": ["AGENTS.md", "docs/research/**"]\n}\n`
);

console.log("\nDone! Transforms executed in WebAssembly.");
