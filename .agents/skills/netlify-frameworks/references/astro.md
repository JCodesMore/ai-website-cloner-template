# Astro on Netlify

## Setup

> **Check current versions before pinning.** Knowledge cutoffs lag behind npm, and guessing a version tends to fail (`npm install` rejects it, or worse, installs something incompatible). Before pinning `@astrojs/netlify`, `astro`, or any other package in `package.json`, run `npm view <pkg> version` to get the current `latest`. Or omit explicit pins and let `npm install` pick them up. If that check itself fails (no network, registry unreachable), still don't fall back to a guessed exact pin — install without a version (or with `@latest`) and tell the user live verification wasn't possible so they should confirm the installed versions. Never present an unverified `x.y.z` as the current release.

Install the Netlify adapter:

```bash
npx astro add netlify
```

This installs `@astrojs/netlify` and updates `astro.config.*` automatically.

### Manual Setup

```bash
npm install @astrojs/netlify
```

```typescript
// astro.config.mjs
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "server",  // on-demand (SSR) by default; or "static" (the default) for prerendered
  adapter: netlify(),
});
```

## Output Modes

Astro 5 removed the `"hybrid"` mode — there are now two output modes, and per-route control replaces it. Both modes need the adapter once any route renders on demand.

| Mode | Behavior |
|---|---|
| `"static"` (default) | Prerendered (hybrid-by-default): pages are static HTML at build time. Opt individual routes into on-demand rendering with `export const prerender = false`. |
| `"server"` | On-demand (SSR) by default. Opt individual routes into prerendering with `export const prerender = true`. |

## What the Adapter Does

- Converts Astro server routes into Netlify Functions
- Handles SSR, API routes, and middleware
- Maps Astro's routing to Netlify's function routing
- You do **not** write raw Netlify Functions for Astro's server routes

## API Routes

Astro API routes (in `src/pages/api/`) are handled by the adapter:

```typescript
// src/pages/api/items.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ items: [] }), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  return new Response(JSON.stringify({ created: data }), { status: 201 });
};
```

## Forms (HTML Pattern)

> **Form detection only scans prerendered HTML.** Netlify registers a form by parsing the static HTML produced at **deploy time**. A `data-netlify` form that exists only in an **on-demand (SSR) route** — a page with `export const prerender = false`, or any route under `output: "server"` that hasn't opted back into prerendering — is never in the build output, so Netlify never registers it and its submissions 404. Put the detectable form on a **prerendered** page (in `output: "server"`, add `export const prerender = true` to that route), or include a static hidden detection form on a prerendered page and submit via AJAX.

For a **prerendered** Astro page, the form HTML is in the build output, so Netlify detects it directly:

```astro
---
// src/pages/contact.astro
---
<form name="contact" method="POST" data-netlify="true">
  <label>Name: <input type="text" name="name" /></label>
  <label>Email: <input type="email" name="email" /></label>
  <label>Message: <textarea name="message"></textarea></label>
  <button type="submit">Send</button>
</form>
```

For form submissions that should redirect back with feedback, handle the POST in an API route and redirect:

```typescript
// src/pages/api/contact.ts
export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  // Process form...
  return redirect("/contact?success=true");
};
```

## Custom 404

Create `src/pages/404.astro`. Astro handles this automatically.

## Local Development

**Option A: Astro dev server** (simpler, but no Netlify primitives):

```bash
npm run dev    # astro dev
```

**Option B: netlify dev** (full Netlify environment including functions, env vars):

```bash
netlify dev
```

The Astro adapter's local dev experience with `netlify dev` varies — for Blobs and DB access, `netlify dev` is recommended. If using `@netlify/vite-plugin` alongside Astro, local platform primitives may also be available via the standard dev server, but this integration is less mature than with pure Vite projects.

## Build and Deploy

```toml
# netlify.toml
[build]
command = "astro build"
publish = "dist"
```

The adapter configures the publish directory and function routing automatically.
