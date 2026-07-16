import { cnWasmBytes } from "./generated/cn-wasm";

export type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ClassDictionary
  | ClassArray;

export interface ClassDictionary {
  [id: string]: ClassValue;
}

export type ClassArray = ClassValue[];

type CnExports = {
  memory: WebAssembly.Memory;
  cn: (ptr: number, len: number) => number;
  out_len: () => number;
};

let exportsRef: CnExports | null = null;

function getExports(): CnExports {
  if (exportsRef) return exportsRef;
  const instance = new WebAssembly.Instance(new WebAssembly.Module(cnWasmBytes), {});
  exportsRef = instance.exports as unknown as CnExports;
  return exportsRef;
}

/**
 * Walk ClassValue trees into strings. Must stay in TS — object/array shapes
 * are a JavaScript type-system concern. Token merge itself is WebAssembly.
 */
function encodeClassPayload(inputs: ClassValue[]): Uint8Array {
  const parts: string[] = [];

  const walk = (value: ClassValue): void => {
    if (value == null || value === false || value === true) return;
    if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
      const s = String(value).trim();
      if (s) parts.push(s);
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item);
      return;
    }
    if (typeof value === "object") {
      for (const key of Object.keys(value)) {
        if (value[key]) parts.push(key);
      }
    }
  };

  for (const input of inputs) walk(input);
  return new TextEncoder().encode(parts.join("\0"));
}

function ensureMemory(memory: WebAssembly.Memory, bytesNeeded: number): void {
  const page = 65536;
  const have = memory.buffer.byteLength;
  if (bytesNeeded <= have) return;
  const needPages = Math.ceil(bytesNeeded / page) - Math.floor(have / page);
  if (needPages > 0) memory.grow(needPages);
}

/**
 * Join and dedupe Tailwind-style class tokens.
 * Merge algorithm: `asm/wasm/cn.wat`.
 */
export function cn(...inputs: ClassValue[]): string {
  const encoded = encodeClassPayload(inputs);
  if (encoded.length === 0) return "";

  const { memory, cn: cnFn, out_len } = getExports();
  // input + heap(32KiB) + token table + slack
  ensureMemory(memory, encoded.length + 65536);
  const mem = new Uint8Array(memory.buffer);
  mem.set(encoded, 0);
  const outPtr = cnFn(0, encoded.length);
  const len = out_len();
  return new TextDecoder().decode(new Uint8Array(memory.buffer, outPtr, len));
}
