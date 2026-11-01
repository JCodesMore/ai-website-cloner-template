# SvelteKit on Netlify

SvelteKit deploys to Netlify via the official **`@sveltejs/adapter-netlify`** adapter. Unlike Nuxt, SvelteKit does **not** auto-detect the platform — you must install the adapter and register it in `svelte.config.js`.

## Setup

> **Check current versions before pinning.** Knowledge cutoffs lag behind npm, and guessing a version tends to fail. Before pinning `@sveltejs/adapter-netlify` or other packages, run `npm view <pkg> version`, install with `@latest`, or omit explicit pins and let `npm install` resolve them. If the version check itself fails (no network, registry unreachable), don't fall back to a guessed exact pin — install with `@latest` (or unpinned) and tell the user live verification wasn't possible so they should confirm the installed versions. Never present an unverified `x.y.z` as the current release.

```bash
npm install -D @sveltejs/adapter-netlify
```

```javascript
// svelte.config.js
import adapter from "@sveltejs/adapter-netlify";

export default {
  kit: {
    adapter: adapter(),
  },
};
```

## What the Adapter Does

- Compiles SvelteKit SSR, server endpoints (`+server.ts`), and hooks into Netlify Functions
- Handles prerendering for static routes
- You do **not** write raw Netlify Functions under `netlify/functions/` for SvelteKit's server endpoints

## Edge Rendering

Pass `edge: true` to deploy the SSR handler as a Netlify **Edge Function** instead of a serverless Function:

```javascript
adapter({ edge: true });
```

## Environment Variables

Client-exposed values use the `PUBLIC_` prefix and are imported from `$env/static/public` (or `$env/dynamic/public`). Server-only values come from `$env/static/private` / `$env/dynamic/private` and never reach the client bundle. Client-exposed values are baked in at build time, so changing them requires a redeploy.

## Local Development

```bash
npm run dev    # vite dev
```

For Netlify platform primitives during local dev, either run `netlify dev` or register `@netlify/vite-plugin` in `vite.config.ts` (see the Local Development section of the parent SKILL.md). Both are valid options.
