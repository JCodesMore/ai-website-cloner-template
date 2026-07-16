import { pageWasmBytes } from "./generated/page-wasm";

type PageExports = {
  memory: WebAssembly.Memory;
  before_ptr: () => number;
  before_len: () => number;
  marker_ptr: () => number;
  marker_len: () => number;
  after_ptr: () => number;
  after_len: () => number;
  message_ptr: () => number;
  message_len: () => number;
};

export type HomeParts = {
  before: string;
  marker: string;
  after: string;
};

let partsCache: HomeParts | null = null;
let messageCache: string | null = null;
let exportsRef: PageExports | null = null;

function getExports(): PageExports {
  if (exportsRef) return exportsRef;
  const instance = new WebAssembly.Instance(new WebAssembly.Module(pageWasmBytes), {});
  exportsRef = instance.exports as unknown as PageExports;
  return exportsRef;
}

function decode(ptr: number, len: number): string {
  const { memory } = getExports();
  return new TextDecoder().decode(new Uint8Array(memory.buffer, ptr, len));
}

/** Homepage segments from `asm/wasm/page.wat` (no string slicing in the host). */
export function getHomeParts(): HomeParts {
  if (partsCache) return partsCache;
  const e = getExports();
  partsCache = {
    before: decode(e.before_ptr(), e.before_len()),
    marker: decode(e.marker_ptr(), e.marker_len()),
    after: decode(e.after_ptr(), e.after_len()),
  };
  return partsCache;
}

/** Full homepage sentence from WASM linear memory. */
export function getHomeMessage(): string {
  if (messageCache !== null) return messageCache;
  const e = getExports();
  messageCache = decode(e.message_ptr(), e.message_len());
  return messageCache;
}
