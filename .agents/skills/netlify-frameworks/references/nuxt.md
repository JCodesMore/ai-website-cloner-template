# Nuxt on Netlify

Nuxt 3 is built on **Nitro**, which has first-class Netlify support. **No Netlify adapter or module install is required.** When you build on Netlify, Nitro auto-detects the platform and selects its `netlify` preset, emitting Netlify Functions and Edge Functions for SSR and server routes. You do not add an adapter to `nuxt.config` the way you would with some other frameworks, and there is no separate Netlify adapter package to install.

## Setup

Deploy a standard Nuxt project as-is — Netlify auto-detects Nuxt and configures the build (typically `nuxt build`). You generally do not need to set the publish directory manually; the Nitro `netlify` preset writes the static assets and functions where Netlify expects them.

```toml
# netlify.toml (optional — Netlify auto-detects Nuxt)
[build]
command = "nuxt build"
```

## Server Routes

Nuxt server routes under `server/api/` and `server/routes/` are compiled into Netlify Functions by Nitro automatically. Do **not** hand-author raw Netlify Functions under `netlify/functions/` for them.

## Environment Variables

Client-exposed values use the `NUXT_PUBLIC_` prefix and are read via `useRuntimeConfig().public`. Server-only values are read via `useRuntimeConfig()` (private keys) or standard runtime env access. As with any framework, client-exposed values are baked in at build time, so changing them requires a redeploy.

## Local Development

```bash
npm run dev    # nuxt dev
```

For Netlify platform primitives (Blobs, DB, env vars) during local dev, use `netlify dev`.
