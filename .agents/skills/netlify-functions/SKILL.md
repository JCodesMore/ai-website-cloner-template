---
name: netlify-functions
description: Write, configure, and deploy Netlify serverless functions in TypeScript, JavaScript, or Go. Use this when adding an API endpoint or backend route, adding a contact form handler, wiring auth or Identity signup/login hooks, building streaming or AI-proxy responses, scheduling cron jobs, running long background jobs (batch processing/scraping), reacting to deploy or form events, setting up rate limiting or region/memory config, or reading environment variables and secrets inside a function. Covers file locations, the Request/Context/Response handler shape, path routing, config options, and local testing with netlify dev.
---

# Netlify Functions

Reach for the modern default-handler API (`.mts` TypeScript). Export a default async handler taking a web `Request` and a Netlify `Context`, returning a web `Response`. Avoid the legacy AWS Lambda handler shape unless writing Go or migrating old code (see Legacy at the end).

## File locations

- Default directory: `netlify/functions/` (relative to base directory). Keep it **outside** your publish directory or source files ship as static assets.
- A function is one file or a subdirectory whose entry file is named `index` or matches the subdirectory name. All of these create a function `hello`:
  - `netlify/functions/hello.mts`
  - `netlify/functions/hello/hello.mts`
  - `netlify/functions/hello/index.mts`
- Use `.mts` (TS) / `.mjs` (JS) for ES modules. `.cts`/`.cjs` force CommonJS; `.ts`/`.js` follow the nearest `package.json` `"type"`.

## Minimal function

No `config` export. Serves at `/.netlify/functions/hello`.

```ts title="netlify/functions/hello.mts"
import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  return new Response("Hello, world!")
}
```

Install types: `npm install @netlify/functions` (required for TS types; optional for JS).

Read env vars and secrets with `Netlify.env.get()`:

```ts
const apiKey = Netlify.env.get("STRIPE_SECRET_KEY")
```

Never hardcode secrets. For the variable to exist at runtime its scope must include **Functions**. Variables set in `netlify.toml` are NOT available to functions. Values are frozen per deploy — change them and redeploy to apply.

**Response headers are set in code** on the returned `Response`. `[[headers]]` in `netlify.toml`, `_headers`, and redirect header rules apply ONLY to static CDN responses, not function responses. Do not add CORS headers unless explicitly requested.

## Custom path routing

Set `config.path` to route to custom URLs. When set, the function serves ONLY at that path — not at `/.netlify/functions/<name>`.

```ts title="netlify/functions/travel.mts"
import type { Config, Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const { city, country } = context.params
  return new Response(`You're visiting ${city} in ${country}!`)
}

export const config: Config = {
  path: "/travel-guide/:city/:country",
}
```

- Multiple paths: `path: ["/cats", "/dogs"]`.
- Patterns: `path` supports [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API) syntax — `path: ["/sale/*", "/item/:sku"]`. Named groups land on `context.params`. For the query string use `req.url`.
- `excludedPath`: carve exceptions, e.g. `excludedPath: ["/product/*.css"]` with `path: "/product/*"`.
- `preferStatic: true`: let a real static file at the URL win.
- `method`: restrict methods, e.g. `method: ["GET", "POST"]`.

## Fetchable module shape (alternative)

Equivalent to the bare handler; carries `config` inline and lets you add event handlers.

```ts
import type { NetlifyFunction } from "@netlify/functions"

export default {
  fetch: (req, context) => new Response("Hello, world!"),
  config: { path: "/hello" },
} satisfies NetlifyFunction
```

## Context object

Second handler argument (or `getContext()` from `@netlify/functions` when out of handler scope — throws outside a request; wrap in try/catch).

- `context.params` — named path params.
- `context.geo` — `city`, `country.code/name`, `latitude`, `longitude`, `subdivision`, `timezone`, `postalCode`.
- `context.ip` — client IP string.
- `context.cookies` — `get(name)` / `set(options)` / `delete(name|options)`. Cross-subdomain cookies need a custom domain (`netlify.app` is on the Public Suffix List).
- `context.site` — `id`, `name`, `url`. `context.deploy` — `context`, `id`, `published`, `skewProtectionToken`. `context.account.id`. `context.server.region`. `context.requestId`.
- `context.waitUntil(promise)` — run work after the response is sent (analytics, logs) without blocking. Billing/log duration counts until the promise settles. Available for functions deployed on/after 2025-03-20.

⚠️ Under `netlify dev`, `context.geo` and `context.ip` are **mocked** — placeholder values that never change. Don't conclude geo code is broken locally. Exercise branches with `netlify dev --geo=mock --country=DE` and verify on a real deploy.

## Config object

Export `const config` (or the `config` property of a Fetchable module):

- `path` / `excludedPath` — `string | string[]`, must start with `/`.
- `method` — one method or array.
- `preferStatic` — `boolean`.
- `background` — `boolean` (see Background).
- `schedule` — cron string (see Scheduled). Mutually exclusive with `path`/`excludedPath`.
- `rateLimit` — `{ action: 'rate_limit'|'rewrite', aggregateBy: 'domain'|'ip'|[...], to?, windowSize, windowLimit }`.
- `memory` / `vcpu` — see below; mutually exclusive.
- `region` — airport code; see below.

## Integrations

```ts title="netlify/functions/users.mts"
import type { Config } from "@netlify/functions"
import { getDatabase } from "@netlify/database"

const db = getDatabase()

export default async (req: Request) => {
  const users = await db.sql`SELECT id, email FROM users LIMIT 10`
  return Response.json({ users })
}

export const config: Config = { path: "/users" }
```

Blobs: `import { getStore } from "@netlify/blobs"`; `getStore("uploads").set(key, await req.blob())`.

`purgeCache()` from `@netlify/functions` invalidates the edge cache from inside a function:

```ts
import { purgeCache } from "@netlify/functions"

export default async () => {
  await purgeCache({ tags: ["products"] }) // omit tags to purge all
  return new Response("Purged!", { status: 202 })
}
```

## Streaming responses

Return a `ReadableStream` as the `Response` body. Limits: **60s execution, 20 MB response**.

```ts
export default async (req: Request) => {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Netlify.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({ model: "gpt-4o-mini", stream: true, messages: [/* ... */] }),
  })
  return new Response(res.body, { headers: { "content-type": "text/event-stream" } })
}
```

To build a stream manually, `new ReadableStream({ start(controller) { controller.enqueue(...); controller.close() } })`.

## Background functions (long-running)

`config.background: true`. Client gets an immediate `202`; the return value is discarded; runs up to **15 minutes**. No streaming. Retries: on invocation error, retry after 1 min, then again 2 min later. Send results somewhere other than the client.

```ts title="netlify/functions/process.mts"
import type { Config } from "@netlify/functions"

export default async (req: Request) => {
  // Long-running work. Client already has its 202.
}

export const config: Config = { background: true, path: "/process" }
```

Limits: background payload **256 KB**. Legacy `-background` filename suffix still works but prefer `config.background`.

## Scheduled functions (cron)

`config.schedule` with a cron expression, executed in **UTC**. The request body is JSON with `next_run` (ISO-8601). Inline config is TS/JS only — Go must use `netlify.toml`.

Always compute the UTC time for the target local hour. E.g. 9 AM ET → `"0 13 * * *"` UTC (note this shifts by an hour across DST; pick the UTC offset you need). Prefer explicit cron over `@daily`/`@hourly` shortcuts, which can't target a specific local hour.

```ts title="netlify/functions/daily-digest.mts"
import type { Config } from "@netlify/functions"

export default async (req: Request) => {
  const { next_run } = await req.json()
  console.log("Next invocation at:", next_run)
}

export const config: Config = {
  schedule: "0 13 * * *", // 9 AM ET (EST); UTC
}
```

Via `netlify.toml` (all languages):

```toml
[functions."daily-digest"]
  schedule = "0 13 * * *"
```

Constraints: **30s limit** (use background for longer); only fire on **published deploys** (not Deploy Previews/branch deploys — invoke manually with **Run now**); no URL invocation; no streaming; no request payloads/POST data; incompatible with Split Testing. All extensions supported **except** `@reboot` and `@annually`.

## Platform-event functions

Export a default object with handlers named after events. They always run in the background — no response to a client. Combine with `fetch` in the same function. Every handler is fully typed; import event types from `@netlify/functions`.

```ts title="netlify/functions/on-deploy.mts"
import type { DeploySucceededEvent, DeployFailedEvent } from "@netlify/functions"

export default {
  deploySucceeded(event: DeploySucceededEvent) {
    console.log(`Deploy ${event.deploy.id} succeeded for ${event.site.name}`)
  },
  deployFailed(event: DeployFailedEvent) {
    console.log(`Deploy ${event.deploy.id} failed: ${event.deploy.errorMessage}`)
  },
}
```

**Deploy events** (`event.deploy`, `event.site`; return `void`): `deployBuilding`, `deploySucceeded`, `deployFailed`, `deployDeleted`, `deployLocked`, `deployUnlocked`.

**Identity events** (`event.user`, only `id` guaranteed):

| Handler | Can deny? | Can mutate? |
|---|---|---|
| `userValidate` | Yes | Yes |
| `userSignup` | Yes | Yes |
| `userLogin` | Yes | Yes |
| `userModified` | Yes | Yes |
| `userDeleted` | No | No |

- Deny: call `event.deny()` inside the handler → end user gets `401`. First function to deny aborts the chain.
- Mutate: return `{ user: {...} }` to persist changes; return `undefined` to pass through.

**Form events**: `formSubmitted` → `event.data` (object keyed by field name). Return `void`.

Multiple functions can handle the same event (all run). Netlify signs each event (JWS) and verifies before invoking, blocking external requests. Legacy filename convention (file named after the event, payload via `await req.json()` → `payload`) still works but prefer typed handlers.

## Region

⚠️ Do NOT override `config.region` unless the user states a specific reason (co-located DB/backend, data residency, regional audience). The default `cmh` (US East, Ohio) is deliberate.

When justified — e.g. an EU-resident database:

```ts
export const config: Config = { path: "/eu-data", region: "dub" }
```

Airport codes (self-serve): `cmh`, `dub`, `fra`, `gru`, `iad`, `lhr`, `nrt`, `pdx`, `sfo`, `sin`, `syd`, `yul`. Support-assisted: `cdg`, `mxp`. Each function runs in exactly one region (no multi-region geo-routing). Region selection needs Pro/Enterprise. Framework-adapter-generated functions can't take `export const config` — set region at project level in the UI under **Cloud compute > Functions > Region**. After changing region, **redeploy**. Function-level region beats the site-level UI setting.

## Memory / vCPU

⚠️ Do NOT set `config.memory` or `config.vcpu` speculatively — billing scales linearly with size. Raise them only for known memory/compute-intensive work (AI inference, image/PDF, large JSON/CSV) or observed OOM/timeouts caused by the function's own work.

When justified (e.g. observed OOM processing large PDFs):

```ts
export const config: Config = { path: "/heavy", memory: "2gb" } // or memory: 2048
```

- `memory`: 1024–4096 MB. `vcpu`: 0.5–2.0 (0.5 → 1024 MB, 2.0 → 4096 MB). Mutually exclusive; Netlify sizes the other automatically. Needs Credit-based Pro/Enterprise. Via `netlify.toml`: `[functions.heavy]\n  memory = "2gb"`.

## Bundling & files on disk

⚠️ Files read from disk at runtime (`fs.readFile` on templates, JSON, WASM) are **not bundled**: works under `netlify dev`, ENOENT in production. Prefer importing static data as a module. Otherwise declare it in `netlify.toml`:

```toml
[functions]
  included_files = ["files/*.md"]
  external_node_modules = ["package-1"]
```

⚠️ The combined env-var limit is **~4 KB** for ALL functions (they run on AWS Lambda) — no Netlify setting raises it. Keep large payloads (service-account JSON, PEM keys) out of env vars; use a bundled file, Blobs, or a runtime fetch.

JS-only esbuild: `[functions]\n  node_bundler = "esbuild"`.

## Limits (not configurable)

- Synchronous execution: **60s**. Scheduled: **30s**. Background: **15 min**.
- Buffered request/response payload: **6 MB** (binary is Base64-encoded, ~30% overhead → effective **4.5 MB** binary limit).
- Streamed response: **20 MB**. Background payload: **256 KB**.

## Local testing & deploy

- Most frameworks emulate functions in their dev server. Vite frameworks (Astro, Nuxt, TanStack Start, React Router): install `@netlify/vite-plugin` and run the dev server. Next.js and anything else: use the [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/local-development/) (`netlify dev`).
- Scheduled functions don't fire on a schedule locally — invoke once with `netlify functions:invoke <name>`.
- Deploy: push to Git for continuous deployment, or use the Netlify CLI/API.
- Logs & metrics live in the Netlify UI; stream with the CLI. All deployed function versions appear under the **Functions** tab; use the search field at the top of the list to filter functions by name, and the separate filter to select a branch or enter a Deploy Preview number.

## Node runtime version

Runtime follows the build's Node.js version (fallback: Node.js 24). Override by setting env var `AWS_LAMBDA_JS_RUNTIME` (e.g. `nodejs24.x`) via UI/CLI/API — **not** `netlify.toml` — then redeploy. ES modules: `__dirname`/`__filename` unavailable, use `import.meta.url`; named imports of CommonJS packages fail, use a default import.

## Legacy / Go (avoid unless needed)

Go must use the [Lambda-compatible API](https://docs.netlify.com/build/functions/lambda-compatibility/?fn-language=go); Go routing/region/memory are set in `netlify.toml`. For migrating Lambda-style JS/TS, `@netlify/aws-lambda-compat` wraps an AWS handler:

```ts
import { withLambda } from "@netlify/aws-lambda-compat"
import type { HandlerContext, HandlerEvent, HandlerResponse } from "@netlify/aws-lambda-compat"

export default withLambda(async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  const name = event.queryStringParameters?.name ?? "World"
  return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) }
})
```

Lambda-compat mode enforces the 4 KB env-var limit; [upgrade to modern functions](https://developers.netlify.com/guides/migrating-to-the-modern-netlify-functions/) to remove it.

<!-- system: agent-context/functions/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (functions)

These are org conventions, not docs facts — they are merged into the rendered
skill by ctx-gen and are never generated. Extracted from the previous
hand-written netlify-functions skill; owned by the skills maintainer.

1. Use TypeScript (`.mts`) when possible.
2. Access environment variables via `Netlify.env.get()` (prefer it over
   `process.env` for consistency).
3. Never add CORS headers unless explicitly requested.
4. Store secrets in environment variables, never in code.
5. `context.geo` and `context.ip` are mocked under `netlify dev` — placeholder
   values, not the real location or client IP. Don't conclude geo code is
   broken because local values never change; exercise branches with
   `netlify dev --geo=mock --country=DE` and verify on a deploy.
6. Do NOT set `config.memory` or `config.vcpu` speculatively. Raise them only
   for known memory/compute-intensive work or observed OOM/timeouts caused by
   the function's own work — billing scales linearly with size.
7. Do NOT override `config.region` unless the user has stated a specific
   reason (co-located database/backend, data residency, regional audience).
   The `cmh` default is a deliberate choice.
8. Files read from disk at runtime (`fs.readFile` on templates, JSON, WASM)
   are not bundled: works under `netlify dev`, ENOENT in production. Prefer
   importing static data as a module; otherwise declare the file with a
   scoped `included_files` entry in `netlify.toml`.
9. The ~4 KB combined environment-variable limit applies to ALL functions
   (they run on AWS Lambda), not just Lambda-compat mode. Keep large payloads
   (service-account JSON, PEM keys) out of env vars — use a bundled file,
   Blobs, or a runtime fetch. No Netlify setting raises this cap.
10. The body's FIRST function example must be the minimal default: no
    `config` export at all, stating the function serves at
    `/.netlify/functions/<name>`. Custom `path` routing appears only in a
    later example — agents imitate the first example they see.
11. Never demonstrate `memory`, `vcpu`, or `region` in a generic example —
    show them only attached to an explicit stated reason (observed OOM,
    co-located backend, data residency).
12. Scheduled-function examples use a real cron expression with the UTC
    conversion spelled out (e.g. 9 AM ET → `"0 13 * * *"` UTC, noting DST) —
    never only `@hourly`/`@daily` shortcuts, which can't target a specific
    local hour.
13. The body must state that `[[headers]]` in netlify.toml, `_headers`, and
    redirect header rules apply ONLY to static CDN responses — response
    headers for a function are set in code on the returned `Response`.
14. When asked to build a function that performs specific work (generate a
    report, process an upload, send a digest), implement the work — pick a
    real library where one is needed and write the operation end to end.
    Never deliver the core task as a `not implemented` stub behind finished
    plumbing: a function whose central branch throws is not a working
    answer, however complete its config and routing.
15. `config.background: true` is the documented, currently-supported way to
    make a function background (the `-background` filename suffix also still
    works). If a locally installed bundler doesn't recognize the flag,
    suspect version skew first: check and upgrade the local tooling, and
    keep local-compatibility findings separate from claims about platform
    support — never remove the docs-recommended flag from an answer based
    solely on an older installed schema.
