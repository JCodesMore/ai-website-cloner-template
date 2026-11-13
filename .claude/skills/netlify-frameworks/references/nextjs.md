# Next.js on Netlify

## Setup

> **Check current versions before pinning.** Knowledge cutoffs lag behind npm, and guessing a version tends to fail (`npm install` rejects it, or worse, installs something incompatible). Before pinning `next` or any other package in `package.json`, run `npm view <pkg> version` to get the current `latest`. Or omit explicit pins and let `npm install` pick them up. If that check itself fails (no network, registry unreachable), still don't fall back to a guessed exact pin — install without a version (or with `@latest`) and tell the user live verification wasn't possible so they should confirm the installed versions. Never present an unverified `x.y.z` as the current release.

Next.js on Netlify uses the `@netlify/plugin-nextjs` runtime, which is installed automatically. No manual adapter installation is required — Netlify detects Next.js and configures the build automatically.

The current Next.js Runtime (v5) supports **Next.js 13.5 and later**. A project on an older Next.js version cannot use it — upgrade Next.js to at least 13.5 before deploying.

```toml
# netlify.toml
[build]
command = "next build"
publish = ".next"
```

## What the Runtime Does

- Converts Next.js server-side features (SSR, API routes, middleware, ISR) into Netlify Functions and Edge Functions
- Handles image optimization via Netlify Image CDN
- Maps Next.js routing to Netlify's infrastructure
- Supports App Router and Pages Router

## Key Configuration

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "example.com" },
    ],
  },
};

module.exports = nextConfig;
```

Remote image patterns in `next.config.js` are automatically mapped to Netlify Image CDN's `remote_images` configuration.

### Skew protection

Opt-in. Set `NETLIFY_NEXT_SKEW_PROTECTION` to `true`, then redeploy — env values are injected at build time, so the live deploy is unchanged until a new build runs.

On Next.js **earlier than 14.1.4** the env var is not sufficient on its own; add the deployment-id flags too:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useDeploymentId: true,
    // only needed when using Server Actions
    useDeploymentIdServerActions: true,
  },
};
```

Client `fetch` calls are not covered automatically by default, so those requests hit the current deploy. Two ways to change that:

1. **Experimental, Next.js 15.4+.** Set `experimental.useSkewCookie` in `next.config.js`. Next.js then carries the deployment identifier in a cookie instead of on asset request URLs, so it rides along on client `fetch` calls with no per-call code. Netlify supports this flag, but it is not production-ready, and the cookie keeps visitors on the older deploy until the identifier stops being accepted or the session cookie clears.
2. **Manual, any version.** Send the identifier on the calls that need it with `x-deployment-id: process.env.NEXT_DEPLOYMENT_ID`. Netlify rewrites the request to that deployment.

## API Routes

Next.js API routes work automatically — they are deployed as Netlify Functions:

```typescript
// app/api/items/route.ts (App Router)
export async function GET() {
  return Response.json({ items: [] });
}

export async function POST(request: Request) {
  const data = await request.json();
  return Response.json({ created: data }, { status: 201 });
}
```

## Middleware

Next.js middleware is deployed as a Netlify Edge Function:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Runs at the edge on Netlify
  return NextResponse.next();
}
```

## ISR (Incremental Static Regeneration)

ISR works on Netlify. Pages with `revalidate` are cached and revalidated using Netlify's CDN cache with `stale-while-revalidate`. On-demand revalidation via `revalidatePath` and `revalidateTag` triggers Netlify cache purge.

## Local Development

```bash
npm run dev    # next dev — standard Next.js dev server
```

For Netlify-specific features (environment variables, edge middleware testing), use:

```bash
netlify dev
```

## Known Patterns

- **Static export** (`output: "export"`): Works without the runtime — produces a fully static site
- **Standalone mode** is not required; the Netlify runtime handles deployment automatically
- Environment variables use the `NEXT_PUBLIC_` prefix for client-side access
