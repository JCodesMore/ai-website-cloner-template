# Native Assembly & WebAssembly Architecture

Performance-sensitive and toolchain utilities in this repository are implemented in assembly language. React/Next.js remains the presentation layer.

## Components

| Surface | Source | Artifact | Role |
| --- | --- | --- | --- |
| Class-name merge | [`asm/wasm/cn.wat`](../asm/wasm/cn.wat) | `public/wasm/cn.wasm` | Last-wins token dedupe for `cn()` |
| Homepage copy | [`asm/wasm/page.wat`](../asm/wasm/page.wat) | `public/wasm/page.wasm` | UTF-8 before/marker/after segments |
| Skill text transforms | [`asm/wasm/sync-text.wat`](../asm/wasm/sync-text.wat) | `public/wasm/sync-text.wasm` | LF normalize, frontmatter body, `$ARGUMENTS` replace, JSON escape |
| Rules `@import` scan | [`asm/wasm/resolve-imports.wat`](../asm/wasm/resolve-imports.wat) | `public/wasm/resolve-imports.wasm` | Line scan / import path extract |
| Skill sync I/O host | [`scripts/sync-skills-host.mjs`](../scripts/sync-skills-host.mjs) | — | File read/write only; transforms in WASM |
| Rules sync I/O host | [`scripts/sync-rules-host.mjs`](../scripts/sync-rules-host.mjs) | — | File read/write only; line classification in WASM |
| Skill byte-copy PE | [`asm/native/sync-skills.asm`](../asm/native/sync-skills.asm) | `bin/sync-skills.exe` | Fast Windows byte propagation |
| Rules byte-copy PE | [`asm/native/sync-agent-rules.asm`](../asm/native/sync-agent-rules.asm) | `bin/sync-agent-rules.exe` | Fast Windows header+copy |

TypeScript hosts (`utils.ts`, `page-message.ts`) only bridge typed JS values and WASM linear memory. Class-value tree walking stays in TS (object/array shapes). Token merge and homepage segments are WebAssembly.

## Build

```bash
npm run build:wasm    # compile all .wat → .wasm + generated TS byte arrays
npm run build:asm     # NASM + MSVC link → bin/*.exe (Windows)
npm run build:native  # both
```

Requirements: Node 24+, `wabt` (devDependency). Native PE: NASM + MSVC Build Tools.

## Sync commands

| Command | Implementation |
| --- | --- |
| `npm run sync:skills` | WASM transforms + thin Node I/O host |
| `npm run sync:rules` | WASM `@import` scan + thin Node I/O host |
| `npm run sync:skills:pe` | `bin/sync-skills.exe` byte-copy |
| `npm run sync:rules:pe` | `bin/sync-agent-rules.exe` header+copy |
| `npm run sync:skills:js` | Legacy pure-JS reference |
| `npm run sync:rules:sh` | Legacy Bash reference |

## Still not convertible

DOM/React/Next.js, Tailwind compilation, markdown documentation bodies, and npm itself have no assembly ABI on this stack. File-system calls remain in thin JS or Win32 PE hosts.

## Memory ABI (`cn`)

1. Host encodes flattened class strings as NUL-separated UTF-8 at offset `0`.
2. Host grows `memory` if needed, calls `cn(ptr, len) -> out_ptr`.
3. Module last-wins dedupes tokens; host reads `out_len()` bytes.
