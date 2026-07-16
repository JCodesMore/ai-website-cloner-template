#!/usr/bin/env node
/**
 * AGENTS.md sync — file I/O host; line/@import scanning in WebAssembly.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "AGENTS.md");
const WASM = join(ROOT, "public", "wasm", "resolve-imports.wasm");

const HEADER =
  "<!-- AUTO-GENERATED from AGENTS.md — do not edit directly.\n" +
  "     Run `npm run sync:rules` to regenerate. -->\n\n";

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

function resolveImports(text) {
  const enc = new TextEncoder();
  const srcB = enc.encode(text.replace(/\r\n/g, "\n"));
  const SRC = 0;
  const PATH = 256 * 1024;
  grow(PATH + 4096);
  let m = mem();
  m.set(srcB, SRC);

  const chunks = [];
  let start = 0;
  const len = srcB.length;
  while (start < len) {
    const nl = exp.find_nl(SRC, start, len);
    const end = nl; // exclusive of newline for path extract; include nl when copying
    if (exp.is_import_line(SRC, start, end)) {
      m = mem();
      const plen = exp.extract_import_path(SRC, start, end, PATH);
      const rel = new TextDecoder().decode(m.subarray(PATH, PATH + plen));
      const resolved = join(ROOT, rel);
      if (existsSync(resolved)) {
        chunks.push(readFileSync(resolved, "utf8").replace(/\r\n/g, "\n"));
        if (!chunks[chunks.length - 1].endsWith("\n")) chunks.push("\n");
        chunks.push("\n");
      } else {
        chunks.push(`<!-- Import not found: ${rel} -->\n`);
      }
    } else {
      m = mem();
      const lineEnd = nl < len ? nl + 1 : len;
      chunks.push(new TextDecoder().decode(m.subarray(SRC + start, SRC + lineEnd)));
    }
    start = nl < len ? nl + 1 : len;
  }
  return chunks.join("");
}

function writeFile(rel, content) {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, "utf8");
  console.log(`  ✓ ${rel}`);
}

console.log("Syncing agent rules (WASM @import scan)...");
if (!existsSync(SOURCE)) {
  console.error("Error: AGENTS.md not found");
  process.exit(1);
}

const resolved = resolveImports(readFileSync(SOURCE, "utf8"));
const body = HEADER + resolved;

writeFile(".github/copilot-instructions.md", body);
writeFile(".clinerules", body);
writeFile(
  ".continue/rules/project.md",
  HEADER +
    "---\ndescription: Project conventions for AI Website Clone Template\nalwaysApply: true\n---\n" +
    resolved
);
writeFile(".amazonq/rules/project.md", body);

console.log("\nDone.");
