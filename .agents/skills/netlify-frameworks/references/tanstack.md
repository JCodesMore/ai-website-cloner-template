# TanStack Start on Netlify

## Setup

> **Check current versions before pinning.** Knowledge cutoffs lag behind npm, and guessing a version tends to fail (`npm install` rejects it, or worse, installs something incompatible). Before pinning `@netlify/vite-plugin-tanstack-start`, `@tanstack/react-start`, `vite`, or any other package in `package.json`, run `npm view <pkg> version` to get the current `latest`. Or omit explicit pins and let `npm install` pick them up. If that check itself fails (no network, registry unreachable), still don't fall back to a guessed exact pin — install without a version (or with `@latest`) and tell the user live verification wasn't possible so they should confirm the installed versions. Never present an unverified `x.y.z` as the current release.

TanStack Start uses the `@netlify/vite-plugin-tanstack-start` plugin for deployment.

```bash
npm install -D @netlify/vite-plugin-tanstack-start
```

Register it in `vite.config.ts` alongside the TanStack Start and React plugins:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";
import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tanstackStart(), netlify(), viteReact()],
});
```

> **TanStack Start < 1.132.0:** the standalone plugin isn't available. Instead pass the `target: 'netlify'` option to `tanstackStart()` in `vite.config.ts` (`tanstackStart({ target: 'netlify' })`) and don't install `@netlify/vite-plugin-tanstack-start`.

> **Netlify CLI deploys:** deploying with the Netlify CLI requires netlify-cli ≥ 17.31.

## What the Plugin Does

- Deploys SSR, Server Routes, Server Functions, and middleware to Netlify Functions
- Provides full local Netlify platform emulation in `vite dev` (no `netlify dev` needed)
- Maps TanStack Start's file-based routing to Netlify's infrastructure

## Server Functions

TanStack Start uses `createServerFn` for server-side logic. These are automatically handled by the Netlify plugin — no raw Netlify Functions needed:

```typescript
import { createServerFn } from "@tanstack/react-start";

const getItems = createServerFn({ method: "GET" }).handler(async () => {
  // Server-side code — runs as Netlify Function in production
  const items = await db.select().from(itemsTable);
  return items;
});
```

## Local Development

```bash
npm run dev    # vite dev — full Netlify platform emulation
```

The plugin emulates the production Netlify platform locally, exposing Functions, Edge Functions, Blobs, Database, the Cache API, Image CDN, redirects, rewrites, headers, environment variables, and AI Gateway — without needing `netlify dev`.

## Build and Deploy

```toml
# netlify.toml
[build]
command = "vite build"
publish = "dist/client"
```

The plugin configures the output structure for Netlify automatically.
