---
name: netlify-frameworks
description: Deploy and configure web frameworks on Netlify — build settings and SSR/edge adapters plus local platform emulation and env vars. Use when setting up or fixing a framework deploy (Next.js / Astro / Nuxt / SvelteKit / Remix / React Router / TanStack Start / SolidStart / Gatsby / Angular / Vite / Express / Hydrogen / Hugo / Eleventy / Vue / React), adding SSR or edge functions or middleware wired to Netlify context, fixing SPA redirect and catch-all rules, setting a build command or publish directory, or debugging "why isn't my env var updating" and framework build failures.
---

Route framework-specific deep work to the guides in this skill: `references/astro.md`, `references/nextjs.md`, `references/nuxt.md`, `references/sveltekit.md`, `references/tanstack.md`, `references/vite.md`.

## Env vars: modern rules (read first)

Env values are injected **at build time**. Any change (client- or server-side) requires a **redeploy** — editing a var in the UI/CLI does NOT reach the live site or already-deployed functions until a new build runs.

**Never use a client prefix for secrets.** Client-prefixed vars are inlined into the browser bundle:
`VITE_`, `NEXT_PUBLIC_`, `PUBLIC_`, `NUXT_PUBLIC_`, `REACT_APP_`, `GATSBY_`, `VUE_APP_`.

Client-embed prefixes by framework: CRA `REACT_APP_`, Gatsby `GATSBY_`, Next `NEXT_PUBLIC_`, Nuxt `NUXT_ENV_`, Vue CLI `VUE_APP_`.

**Scopes:** build-time access needs **Builds** scope; SSR/DSG runtime access needs **both Functions and Builds**. `netlify.toml` is read only during build — functions cannot read it at runtime; set runtime vars in UI/CLI/API.

Netlify build variables can't be used as values in the UI or `netlify.toml` env sections. Set them inline before the build command:
```toml
[build]
  command = "REACT_APP_CONTEXT=$CONTEXT npm run build"
```

## SPA redirects and the SSR catch-all footgun

SPAs (React, Vue CLI, Vite, Nuxt in SPA mode) need a rewrite to serve `index.html` for `pushState`:
```
/* /index.html 200
```

**Remove any SPA catch-all when adopting an SSR adapter.** A leftover `/* → /index.html 200` silently serves static `index.html` for SSR pages and API routes — user redirects beat adapter-generated routes.

## Local dev with platform emulation (no Netlify CLI)

Vite-based frameworks emulate Netlify primitives (functions, edge functions, blobs, Netlify Database, Cache API, Image CDN, redirects/rewrites, headers, env vars, AI Gateway) in the dev server:

| Framework | Plugin/module | Run |
|-----------|---------------|-----|
| Astro (5.12+) | built-in (Netlify Vite plugin auto-loaded) | `astro dev` |
| Nuxt | `@netlify/nuxt` | `nuxt dev` |
| React Router | `@netlify/vite-plugin` | `react-router dev` |
| SolidStart 2 | `@netlify/vite-plugin` | `vite dev` |
| TanStack Start | `@netlify/vite-plugin-tanstack-start` | (vite) |
| Vite | `@netlify/vite-plugin` | `npx vite` |

Still need `netlify dev` (Netlify CLI) for: Gatsby generated functions (run `netlify build` first), Angular SSR local test (`netlify serve`), and frameworks without a Vite plugin.

**`netlify dev` gotcha:** with both a custom `command` and a `targetPort` in `[dev]`, you must set `framework = "#custom"` — otherwise the detector runs and your custom command is silently ignored.

## Build settings by framework

| Framework | Build command | Publish |
|-----------|---------------|---------|
| Angular (standard) | `ng build --prod` | `dist/YOUR_PROJECT_NAME` |
| Astro | `astro build` | `dist` |
| Create React App | `react-scripts build` | `build` |
| Eleventy | `eleventy` | `_site` |
| Gatsby | `gatsby build` | `public` |
| Hugo | `hugo` | `public` |
| Hydrogen | `remix vite:build` | `dist/client` |
| Next.js (SSR/hybrid) | `next build` | `.next` |
| Next.js (static export) | `next build && next export` | `out` (`NETLIFY_NEXT_PLUGIN_SKIP=true`) |
| Nuxt 3 | `nuxt build` | `dist` |
| Nuxt 2 | `nuxt generate` | `dist` |
| React Router | `react-router build` | `build/client` |
| Remix (Vite) | `remix vite:build` | `build/client` |
| SolidStart 2 (Vite plugin) | `vite build` | `dist/client` |
| SolidStart 2 (Nitro) | `vite build` | `dist` |
| SolidStart 1.x | `vinxi build` | `dist` |
| SvelteKit | `vite build` | `build` |
| TanStack Start (1.132.0+) | `vite build` | `dist/client` |
| Vite | `vite build` | `dist` |
| Vue CLI | `vue-cli-service build` | `dist` |

Detection suggests these; override in `netlify.toml` or UI (project configuration > Build & deploy > Continuous deployment > Build settings).

## SSR / adapter setup

### Astro
`npx astro add netlify` installs the adapter and edits `astro.config.mjs`. Adapter needed for SSR and out-of-the-box Image CDN for `<Image />`. SSR → Netlify Functions; middleware → Edge Functions. Adapter-less deploy only if no server features and no Image CDN need. Skew protection from 5.15.0.

### Next.js (13.5+ only)
Zero-config via the OpenNext adapter (`@netlify/plugin-nextjs`). Do NOT pin the version — Netlify auto-updates each build. Treat the legacy adapter as read-only history, never a recommendation.
Adapter provisions: serverless function for SSR/ISR/PPR/route handlers/Server Actions; Edge Function for Middleware; Full Route + Data Cache; Image CDN with `next/image`.
Skew protection is opt-in: set `NETLIFY_NEXT_SKEW_PROTECTION=true`, redeploy. No automatic support for client `fetch` — direct calls with `x-deployment-id: process.env.NEXT_DEPLOYMENT_ID`. Details in `references/nextjs.md`.

### SvelteKit
```bash
npm install -D @sveltejs/adapter-netlify
```
```js
import adapter from '@sveltejs/adapter-netlify';
export default { kit: { adapter: adapter() } };
```
Replace `@sveltejs/adapter-auto` with the specific import. SSR routes → a `render` function.
- `split: true` → one function per route. **Incompatible with Edge Functions** (`edge: false` or omit).
- `edge: true` → SSR in a Deno edge function; can't combine with `split`.
- **Redirects NOT supported in `netlify.toml`** — use `_redirects`.
- Edge functions don't work locally with `netlify dev` for SvelteKit.

### React Router (7+)
New: `npx create-react-router@latest --template netlify/react-router-template`. Existing:
```bash
npm install @netlify/vite-plugin-react-router
```
Add `netlifyReactRouter()` to Vite plugins. Default target = Serverless Functions.
**Edge (Deno):** needs plugin v2.1.1+, set `edge: true`, and you **must** create `app/entry.server.tsx`:
```typescript
export { default } from 'virtual:netlify-server-entry'
```
Exclude your own function paths: `netlifyReactRouter({ edge: true, excludedPaths: ['/api/*'] })`.
**Moving back to Serverless:** remove `edge: true` AND delete `app/entry.server.tsx`.
Middleware (React Router v7.9.0+, plugin v2.0.0+): opt in via `future.v8_middleware`; import `netlifyRouterContext` from `@netlify/vite-plugin-react-router/serverless` (or `/edge` when `edge: true`); access `context.get(netlifyRouterContext)`.

### Remix
New: `npx create-remix@latest --template netlify/remix-template` (CLI prompts functions vs Edge Functions). Manual (Remix Vite required):
```bash
npm install --save-dev @netlify/remix-adapter
```
Add `netlifyPlugin()` from `@netlify/remix-adapter/plugin` to Vite plugins.

### Nuxt
SSR via Nitro, automatic on Nuxt 3. Local parity via `@netlify/nuxt` (`npx nuxi module add @netlify/nuxt`).
- SSR on Edge Functions requires a different Nitro deployment preset (not auto-detected).
- pnpm + Nuxt 3: set `PNPM_FLAGS=--shamefully-hoist`.
- `nuxt/image` auto-uses Netlify Image CDN; set remote domains in `nuxt.config.ts`.

### SolidStart
SolidStart 2 builds on Vite — **no SolidStart-specific adapter**. Install `@netlify/vite-plugin`:
```ts
import netlify from "@netlify/vite-plugin";
import { solidStart } from "@solidjs/start/config";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [solidStart(), netlify({ build: { enabled: true } })],
});
```
Publish `dist/client`. SSR routes, server functions, middleware → Netlify Functions, zero extra config.
**Nitro alternative:** add `nitro()`, use plain `netlify()` (no `build.enabled`), publish `dist`.
SolidStart 1: Nitro auto-configures; optionally set `preset: "netlify"` in `app.config.ts`; `vinxi build` / `dist`.

### TanStack Start
React (and Solid.js) full-stack; SSR/Server Routes/Server Functions/middleware → serverless functions.
```bash
npm install -D @netlify/vite-plugin-tanstack-start
```
Add `netlify()` to Vite plugins alongside `tanstackStart()`; `vite build` / `dist/client` (1.132.0+). Netlify CLI deploys require netlify-cli 17.31+. Older versions: see `references/tanstack.md`.

### Gatsby
- **5.12.0+ (adapter):** auto-detects and installs `gatsby-adapter-netlify` (zero-config). Generates functions `SSR`, `DSG`. No Essential Gatsby plugin needed.
- **5.11.0 or earlier (Essential Gatsby plugin):** auto-installs `@netlify/plugin-gatsby`; also manually install `gatsby-plugin-netlify` (required for SSR, Gatsby redirects, asset caching). Generates `__api`, `__ssr`, `__dsg`, `__ipx`. Skip via `NETLIFY_SKIP_GATSBY_FUNCTIONS` (all) / `NETLIFY_SKIP_API_FUNCTION` / `NETLIFY_SKIP_SSR_FUNCTION` / `NETLIFY_SKIP_DSG_FUNCTION`.
- Gatsby 5 requires Node 18.
- Large sites: set `GATSBY_EXCLUDE_DATASTORE_FROM_BUNDLE` to load datastore from CDN (avoids max function deploy size; slower first SSR/DSG load).
- Image CDN: set `NETLIFY_IMAGE_CDN=true` (Contentful/Drupal/WordPress source plugins). **Not supported on 5.12.x with adapter — upgrade to 5.13.0+.**
- `StaticImage` and `gatsby-transformer-sharp` don't work for SSR/DSG — host images on a CDN.

### Angular
SSR auto-configured via an Edge Function. Suggested dev: `ng serve` / `4200`.
- **SSR pages are NOT subject to `_redirects` or `netlify.toml` redirects** — SSR uses Edge Functions that run before redirects. Use Angular's built-in redirects.
- Access `Request`/`Context` in SSR via `netlify.request` / `netlify.context` providers (from `@netlify/edge-functions`); unavailable client-side or during prerendering. Test locally with `netlify serve`.
- `NgOptimizedImage` auto-uses Image CDN; set `remote_images` (array of regex) under `[images]` in `netlify.toml`.

### Express
Node 18.14.0+. Deploy as a Netlify Function via `serverless-http`:
```bash
npm i express serverless-http @netlify/functions @types/express
```
```ts
// netlify/functions/api.ts
import express, { Router } from "express";
import serverless from "serverless-http";
const api = express();
const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));
api.use("/api/", router);
export const handler = serverless(api);
```
```toml
[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"
[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"
```
No frontend: set a placeholder build command (e.g. `echo Building Functions`). All Function limits apply; not recommended as background/scheduled functions.

### Hydrogen
Shopify stack on React Router 7. **SSR only on Netlify Edge Functions — Netlify Functions NOT officially supported.** Node 24+. Use the starter:
```bash
npm create @shopify/hydrogen@latest -- --template https://github.com/netlify/hydrogen-template
cp .env.example .env && npm run dev
```

## Static-site gotchas

### Hugo
Set `HUGO_VERSION` (any release after 0.19) in `[build.environment]` — a missing/mismatched version causes `exit code: 255`. Install themes as **git submodules** (`git submodule add ...`), not `git clone`.

### Eleventy
`eleventy` / `_site`. **Build plugins require editing `.gitignore`: change `node_modules` to `**/node_modules/**`** — otherwise Netlify plugins and Eleventy collide on `.netlify/plugins/node_modules/` and the build errors.

## Vite meta-framework support matrix
Astro (auto on 5.12+), Nuxt (via `@netlify/nuxt`), TanStack Start (via `@netlify/vite-plugin-tanstack-start`), React Router, SolidStart — all **full**. SvelteKit — **experimental**.

## Deploy via CLI (Express, Nuxt, React, Vite)
```sh
npm install netlify-cli -g
netlify init
```
Follow prompts to create/link the site and set build settings.

<!-- Node version floors (18.14.0+) are stated per-framework where documented; no cross-framework build-image default is given in sources. -->

<!-- system: agent-context/frameworks/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (frameworks)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. Per-framework deep guides live in this skill: `references/astro.md`,
   `references/nextjs.md`, `references/nuxt.md`, `references/sveltekit.md`,
   `references/tanstack.md`, `references/vite.md` — route framework-specific
   work there before improvising.
2. Next.js: modern runtime (v5, Next ≥13.5) only — treat the legacy adapter
   as read-only history, never a recommendation.
3. Remove any SPA catch-all (`/* → /index.html 200`) when adopting an SSR
   adapter — user redirects beat adapter-generated routes, so a leftover
   catch-all silently serves static `index.html` for SSR pages and API routes.
4. Any env var change — client- or server-side — requires a redeploy. Values
   are injected at build time; editing one in the UI/CLI does not reach the
   live site or already-deployed functions until a new build runs.
5. `netlify dev` with both a custom `command` and a `targetPort` requires
   `framework = "#custom"` in the `[dev]` block — otherwise the detector runs
   and the custom command is silently ignored.
6. Never use a client prefix (`VITE_`, `NEXT_PUBLIC_`, `PUBLIC_`,
   `NUXT_PUBLIC_`, `REACT_APP_`, `GATSBY_`, `VUE_APP_`) for secrets —
   client-prefixed vars are inlined into the browser bundle.
7. Next.js skew protection is version-conditional: below Next 14.1.4 the
   `NETLIFY_NEXT_SKEW_PROTECTION` env var is not sufficient on its own —
   `experimental.useDeploymentId` (plus `useDeploymentIdServerActions` when
   server actions are used) must also go in `next.config.js`. Always ask for
   or state the version condition; never present the env var as the whole
   setup.
8. Client `fetch` calls are not covered by Next.js skew protection by default.
   Give both options. Next.js 15.4+ has an experimental `useSkewCookie` flag
   that carries the deployment identifier in a cookie so it rides along on
   client `fetch` calls; Netlify supports it, but say it is not
   production-ready and that it holds visitors on the older deploy until the
   cookie clears. The other option, on any version, is adding
   `x-deployment-id` with `process.env.NEXT_DEPLOYMENT_ID` per call.
