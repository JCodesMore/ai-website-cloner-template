---
name: netlify-edge-functions
description: Write and configure Netlify Edge Functions — TypeScript/JavaScript handlers running in a Deno runtime at the network edge. Use when adding auth middleware or auth redirects, geolocation or localization logic, A/B testing or personalization, request/response transforms (rewrites/redirects), or edge SSR to a Netlify site. Triggers on tasks like "add an edge function", "auth check at the edge", "redirect visitors by country", "A/B test with cookies", "rewrite requests", "personalize by geo", or "cache an edge response". Covers the config export, path routing, the Context object, response caching, environment variables, and edge-vs-serverless choices. Check the framework's adapter first — only hand-write an edge function when the framework doesn't already generate one.
---

# Netlify Edge Functions

## Modern syntax (reach for this)

Export a default handler plus a `config` object. Import `Config`/`Context` types from `@netlify/edge-functions`; `Request`/`Response`/`URL` are global.

```ts
import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  return new Response("Hello world");
};

export const config: Config = {
  path: "/test",
};
```

**Do not hand-write an edge function when your framework's adapter already generates middleware for the job** — duplicating it causes conflicts. Check the framework adapter/reference first.

**Edge vs serverless:** use edge functions for low-latency request/response manipulation, geolocation logic, auth checks/redirects, and A/B personalization. Use serverless functions for long-running work (up to 15 min), heavy Node.js dependencies, database-heavy operations, background/scheduled tasks, or memory above 512 MB.

## File location

- Default directory: `YOUR_BASE_DIRECTORY/netlify/edge-functions`. Custom: `edge_functions` under `[build]` in `netlify.toml` (path relative to base directory).
- Keep the directory **outside your publish directory** so source files aren't deployed.
- Extensions: `.js`, `.ts`, `.jsx`, `.tsx` (`.jsx`/`.tsx` useful for SSR).
- Same-name conflict: if `my-function.ts` and `my-function.js` both exist, the **TypeScript file is ignored** and the JavaScript one is deployed.

## Routing — required, or the function silently never runs

⚠️ **An edge function without a route (no `config` export and no `netlify.toml` declaration) still deploys but never runs — no build error, no warning.** When "my edge function does nothing", check the route first.

⚠️ **Scope `path` narrowly.** `path: "/*"` intercepts every request including static assets, adding latency and billing an edge invocation for each one.

Edge functions are **not** auto-assigned a URL route. Configure via inline `config` or `netlify.toml`.

`path` is a `URLPattern` expression, must start with `/`, single string or array:

```ts
export const config: Config = {
  path: ["/", "/products/*"],
  excludedPath: ["/*.css", "/*.js"],
};
```

Config properties: `path`, `excludedPath`, `pattern` (regex alternative to `path`), `excludedPattern`, `method`, `header`, `onError`, `cache`.

### netlify.toml declaration

Use `[[edge_functions]]` to declare multiple functions on one path and control order:

```toml
[[edge_functions]]
  path = "/admin"
  function = "auth"

[[edge_functions]]
  path = "/admin"
  function = "injector"
  cache = "manual"

[[edge_functions]]
  pattern = "/products/(.*)"
  excludedPattern = "/products/things/(.*)"
  function = "highlight"
```

Properties: `function`, `path`, `excludedPath`, `pattern`, `excludedPattern`, `header`, `cache`.

**Merge precedence:** if the same function is declared both inline and in `netlify.toml`, configs merge and are treated as inline; inline wins duplicate fields.

### Match by headers

`header` keys are HTTP header names (case-insensitive); values are `true` (present), `false` (absent), or a string regex on the value. Multiple same-name values match against the comma-joined list.

```ts
export const config: Config = {
  header: { "x-required": true, "x-forbidden": false, "user-agent": "(iPhone|Android)" },
  path: "/*",
};
```

### Declaration processing order

Netlify runs the whole declaration order **TWICE**: the first pass runs only edge functions **not** configured for caching; the second pass runs the ones **with** caching configured. Within that:

1. Framework-generated functions declared in a config file.
2. Your `netlify.toml` declarations (top-to-bottom order).
3. Framework/integration-generated functions with inline config.
4. Your inline declarations (**alphabetical by function file name**).

To control order across multiple functions on a path, prefer `netlify.toml` declarations over inline.

After all functions run, Netlify evaluates redirect rules — unless a function returned a response and ended the chain. To customize order, use `netlify.toml`.

**Order caveats:**
- A returned response ends the chain; redirects for that path don't occur.
- An edge function on the **target** of a static rewrite does **not** execute for rewritten requests.
- `fetch()` for internal requests or returning a `URL` starts a **new request chain** and re-runs matching edge functions. Use `context.next()` to avoid re-running them.

## Function signature & return values

Handler receives `(request: Request, context: Context)`. Return one of:
- a `Response` — delivered to the client; **ends the request chain** (declared redirects for that path don't run).
- a `URL` — rewrite to a **same-site** URL with 200 status; address bar unchanged. Same-site only — for other sites use `fetch`.
- `undefined` / empty `return;` — bypass this function, continue the chain.

Modify a response as middleware by awaiting `context.next()`:

```ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  if (url.searchParams.get("method") !== "transform") return;

  const response = await context.next();
  const text = await response.text();
  return new Response(text.toUpperCase(), response);
};
```

Netlify does **not** add headers to edge function requests — use `context` for client request info.

## Common patterns

**Redirect by geo + cookie:**
```ts
export default async (req: Request, { cookies, geo }: Context) => {
  if (geo.city === "Paris" && cookies.get("promo-code") === "15-for-followers") {
    return Response.redirect(new URL("/subscriber-sale", req.url));
  }
};
```

**Rewrite (same-site, 200)** — return a standard `URL` object (see https://docs.netlify.com/build/edge-functions/api#return-a-rewrite):
```ts
export default async (request: Request, { geo }: Context) => {
  if (geo.city === "Paris") return new URL("/subscriber-sale", request.url);
};
```

**Read request body then continue** — a body can only be read once, so pass a new `Request` with an unread body:
```ts
export default async (req: Request, context: Context) => {
  const body = await req.json();
  if (!isValid(body.access_token)) return new Response("forbidden", { status: 403 });
  return context.next(new Request(req, { body: JSON.stringify(body) }));
};
```

**Conditional request:**
```ts
export default async (req: Request, { next }: Context) => {
  const res = await next({ sendConditionalRequest: true });
  if (res.status === 304) return res;
  const text = await res.text();
  return new Response(text.toUpperCase(), res);
};
```

**SSR with React (`.tsx`):**
```tsx
import React from "https://esm.sh/react";
import { renderToReadableStream } from "https://esm.sh/react-dom/server";
import type { Config, Context } from "@netlify/edge-functions";

export default async function handler(req: Request, context: Context) {
  const stream = await renderToReadableStream(
    <html><body><h1>Hello {context.geo.country?.name}</h1></body></html>
  );
  return new Response(stream, { status: 200, headers: { "Content-Type": "text/html" } });
}

export const config: Config = { path: "/hello" };
```

## Context object

- **`geo`** — `city`, `country.{code,name}`, `subdivision.{code,name}`, `latitude`, `longitude`, `timezone`, `postalCode`.
- **`cookies`** — `get(name)`, `set(options)` (CookieStore.set format), `delete(name|options)`. Cross-subdomain cookies need a custom domain — impossible on `netlify.app` (Public Suffix List).
- **`next(options?)`** / **`next(request, options?)`** — invoke the next item in the chain; returns a `Promise<Response>` you can modify. `options.sendConditionalRequest: true` for conditional requests. Only call `next` if you need the response body. Pass an explicit `Request` when you've read the body.
- **`params`** — path params, e.g. path `/pets/:name` + request `/pets/winter` → `{name:"winter"}`. Query string: use `request.url`.
- **`ip`** — client IP string.
- **`requestId`** — Netlify request ID.
- **`account.id`**, **`site.{id,name,url}`**, **`server.region`**, **`deploy.{context,id,published,skewProtectionToken}`**.
- **`waitUntil(promise)`** — extend execution past the response (analytics, logs) without blocking it. Still subject to the CPU limit.

**`Netlify` global:** `Netlify.context` (null outside the handler), `Netlify.env.{get,has,set,delete,toObject}`. `Netlify.env.set`/`delete` are **invocation-scoped only** — they do not persist env vars; use the Netlify env API endpoints.

## Response caching

⚠️ **Caching requires BOTH opting in AND setting headers — it's both or neither.** Setting `Cache-Control` on the returned `Response` does nothing without `cache: "manual"` in config, and vice versa. Default (either missing): every request invokes the function.

1. Opt in: `cache: "manual"` (inline or `netlify.toml`).
2. Set headers **inline in the function code** (not in `netlify.toml`):

```ts
import type { Context, Config } from "@netlify/edge-functions";

export default async (req: Request, context: Context) => {
  return new Response("Hello world", {
    headers: { "cache-control": "public, s-maxage=3600" },
  });
};

export const config: Config = { cache: "manual", path: "/hello" };
```

Supported cache headers: `Cache-Control`, `CDN-Cache-Control`, `Netlify-CDN-Cache-Control`, `Expires` (overridden by `max-age`/`s-maxage`), `Vary`, `Netlify-Vary`. See https://docs.netlify.com/build/caching/caching-overview

**Atomic deploys void the cache:** `s-maxage`/`max-age`/`Expires` are discarded by a new deploy in the same deploy context, even mid-lifetime.

**When to cache:** endpoint responses reusable across clients (e.g. identical SSR HTML). **Do not cache** middleware, routing/transform logic, or per-client personalization.

⚠️ **Caching functions always shadow static files.** A caching function on `/*` serves `/cat.png` instead of the static `cat.png`.

## Error handling (`onError`, inline only)

- **`fail`** (default) — serve a generic error page.
- **`/YOUR_CUSTOM_PATH`** — rewrite to a same-site path (must start with `/`); served without invoking edge functions for that path.
- **`bypass`** — skip the erroring function, continue the chain.

```ts
export const config: Config = { path: "/hello", onError: "/unavailable" };
```

Fail closed for critical logic (auth); fail open (`bypass`) for progressive enhancement (nice-to-have localization).

## Environment variables

- Set via UI/CLI/API; scope **must include Functions** to reach edge runtime.
- **Env vars in `netlify.toml` are NOT available to edge functions.**
- **Build-scope vars are NOT available at edge runtime** — only during the build step. Embed their values at build time if needed.
- Changes require a **new build and deploy**; each deploy freezes values at deploy time.
- Access at runtime with `Netlify.env.get(key)` / `Netlify.env.toObject()`.

```ts
export default async (request: Request, context: Context) => {
  const value = Netlify.env.get("MY_IMPORTANT_VARIABLE");
  return new Response(`Value: ${value}`);
};
```

Next.js Middleware note: with Netlify Edge Functions for Middleware on Next.js, `process.env` also works.

## Runtime & modules

Deno-based. Import modules by:
- **Node built-ins:** `import { randomBytes } from "node:crypto";`
- **Deno/URL imports:** `import React from "https://esm.sh/react";`
- **npm packages (beta):** `npm install` then import by name. ⚠️ Beta — packages using native binaries (Prisma) or runtime dynamic imports (cowsay) may fail. Report bugs to Netlify Support: https://www.netlify.com/support/

**Import maps** (module names instead of URLs) — use a separate import map file, declared in `netlify.toml`:

```toml
[functions]
  deno_import_map = "./path/to/your/import_map.json"
```

Supported Web APIs include `fetch`/`Request`/`Response`/`URL`/`File`/`Blob`, `console`, `atob`/`btoa`, `TextEncoder`/`TextDecoder` (+ stream variants), Web Crypto (`randomUUID`, `getRandomValues`, `SubtleCrypto`), WebSocket, timers, Streams API, URLPattern, `Performance`.

## Local dev & deploy

```bash
npm install netlify-cli -g
netlify dev        # runs edge functions on local requests
# visit http://localhost:8888/test
```

- Debug: `netlify dev` with `--edge-inspect` or `--edge-inspect-brk` (see https://cli.netlify.com/commands/dev/).
- Geo mocking: `--geo=mock` (San Francisco) or `--geo=mock --country=XX`.
- ⚠️ **No local caching** — cache headers are ignored in local testing.
- Manual deploys require **Netlify CLI 12.2.8+** (older versions error).
- Deploys are **atomic** — old deploys keep old behavior until you publish a new production deploy.

**Monitor:** production logs at Netlify UI **Cloud compute > Edge functions**. Each `console.*` log includes the generating function name. Retention ≥ 24h (7 days on some plans). Log Drains on Enterprise.

## Limits & feature gaps

- **Code size:** 20 MB compressed (bundle max).
- **Memory:** 512 MB per set of deployed edge functions.
- **CPU time:** 50 ms per request (excludes wait time; `waitUntil` work still counts).
- **Response header timeout:** 40 s.
- Cached responses do **not** count toward invocations.
- **Split Testing** enabled → edge functions do **not** run.
- **Custom Headers** (incl. basic auth) do **not** apply to edge functions.
- **Prerendering** does not apply to edge-served paths.
- Rewrites are **same-site only** — use `fetch` for other/external sites.
- Multiple framework plugins generating edge functions may collide.
- **Not** supported under HIPAA-compliant hosting.

See the overview at https://docs.netlify.com/build/edge-functions/overview.md and the full example library at https://edge-functions-examples.netlify.app/. For feedback or help, contact Netlify Support: https://www.netlify.com/support/

<!-- system: agent-context/edge-functions/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (edge-functions)

These are org conventions and field-learned guardrails, not docs facts — they
are merged into the rendered skill by ctx-gen and are never generated.
Extracted from the previous hand-written netlify-edge-functions skill; owned
by the skills maintainer.

1. Check the framework's adapter/reference first: a custom edge function that
   duplicates adapter-generated middleware causes conflicts. Only hand-write
   an edge function when the framework doesn't already generate one for the
   job.
2. Scope `path` narrowly. `path: "/*"` intercepts every request — including
   static assets — adding latency to each one and billing an edge invocation
   for it.
3. An edge function without a route (no config export, no netlify.toml
   declaration) still deploys, but silently never runs: no build error, no
   warning. When "my edge function does nothing", check the route first.
4. Choose edge vs serverless by workload shape: edge functions for low-latency
   request/response manipulation, geolocation logic, auth checks/redirects,
   and A/B personalization; serverless functions for long-running work (up to
   15 min), heavy Node.js dependencies, database-heavy operations,
   background/scheduled tasks, or memory needs above 512 MB.
5. Cache headers on an edge response do nothing without `cache: "manual"` in
   config — it's both or neither. Setting `Cache-Control` on the returned
   `Response` has no effect unless the function also opts in.
6. When explaining declaration processing order, state the two-pass loop,
   not just the ordering: Netlify runs the whole declaration order TWICE —
   first pass runs only edge functions not configured for caching, second
   pass runs the ones with caching configured. "Non-cached before cached"
   without the loop framing is an incomplete answer.
