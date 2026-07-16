#!/usr/bin/env node
/**
 * Compile asm/wasm/*.wat -> public/wasm/*.wasm
 * and emit TypeScript byte modules under src/lib/generated/
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import wabtFactory from "wabt";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WAT_DIR = join(ROOT, "asm", "wasm");
const OUT_DIR = join(ROOT, "public", "wasm");
const GEN_DIR = join(ROOT, "src", "lib", "generated");

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(GEN_DIR, { recursive: true });

const wabt = await wabtFactory();

const files = readdirSync(WAT_DIR).filter((f) => f.endsWith(".wat"));
if (files.length === 0) {
  console.error("No .wat files in asm/wasm");
  process.exit(1);
}

for (const file of files) {
  const name = file.replace(/\.wat$/, "");
  const exportName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) + "WasmBytes";
  const watPath = join(WAT_DIR, file);
  // wabt is sensitive to CRLF on some short modules — normalize to LF
  const wat = readFileSync(watPath, "utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const parsed = wabt.parseWat(file, wat);
  parsed.validate();
  const { buffer } = parsed.toBinary({ log: false });
  const wasmPath = join(OUT_DIR, `${name}.wasm`);
  writeFileSync(wasmPath, Buffer.from(buffer));

  const bytes = [...new Uint8Array(buffer)];
  const ts = `/* AUTO-GENERATED from asm/wasm/${file} — run npm run build:wasm */\n` +
    `export const ${exportName} = new Uint8Array([\n  ${bytes.join(", ")}\n]);\n`;
  writeFileSync(join(GEN_DIR, `${name}-wasm.ts`), ts);
  console.log(`  ✓ ${file} -> public/wasm/${name}.wasm (${buffer.byteLength} bytes)`);
}

console.log("WASM build complete.");
