---
name: netlify-caching
description: Cache dynamic and static responses on Netlify's CDN from Functions, Edge Functions, and proxies. Use when you add caching or cache-control headers to a function response, tune cache TTL or stale-while-revalidate, set up the durable cache, vary a cache key by query/header/cookie/country/language, purge or invalidate the cache by site or cache tag, use the programmatic Cache API (caches.open/match/put) or @netlify/cache helpers (fetchWithCache/cacheHeaders/getCacheStatus), speed up an expensive API call, add ISR or on-demand revalidation, or debug why a response is or isn't cached via the Cache-Status header.
---

# Netlify caching

## Cache-control header to reach for

Dynamic responses (Functions, Edge Functions, proxies) are **NOT cached by default** — you must opt in. Set `Netlify-CDN-Cache-Control` on the response:

```ts
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  return new Response("Hello world", {
    headers: {
      'Netlify-CDN-Cache-Control': 'public, durable, max-age=60, stale-while-revalidate=120'
    }
  });
};
```

Header choice (most specific wins; `CDN-Cache-Control`/`Cache-Control` always pass downstream):
- `Netlify-CDN-Cache-Control` — Netlify CDN only. **Reach for this.**
- `CDN-Cache-Control` — all CDNs that support it.
- `Cache-Control` — any CDN or the browser.

**Legacy path to avoid:** On-demand Builders do **not** support these headers or `Netlify-Vary` — they use a TTL pattern and key on URL path only. Don't reach for ODBs in new code.

## Footguns (read first)

- **Only `GET` is cached.** POST/PUT/etc. are never cached regardless of headers — expose cacheable data on a GET route (inputs in the URL or query string).
- **`netlify dev` does not emulate the CDN cache.** A local cache miss every time is expected. Verify caching on a deployed URL (Deploy Preview or production) via its `Cache-Status` header.
- **Without `Netlify-Vary: query=...`, the full query string is the cache key** — every distinct query string (`utm_*`, `fbclid`, …) is a separate cache entry. Enumerate only the params that change the response.
- **Static assets are fresh for up to a year** — a shorter `max-age` is ignored. They change only on a new deploy or manual purge.
- **basic-auth on ANY page disables caching for the ENTIRE site.**
- **`durable` is serverless-only** — it has no effect on Edge Function responses.
- Never opt sensitive content out of automatic invalidation — it can stay publicly cached after deploys/firewall changes.

## Directives

- `public` cache it / `private` browser-only, not Netlify's shared cache / `no-store` don't cache.
- `s-maxage=N` seconds in Netlify's shared cache (overrides `max-age` there).
- `max-age=N` seconds in any cache.
- `stale-while-revalidate=N` serve stale for N seconds after expiry while revalidating in background.
- `durable` (serverless only) store in Netlify's durable cache so other edge nodes reuse it instead of re-invoking the function.

Defaults when no header is set — static: `Netlify-CDN-Cache-Control: public, s-maxage=31536000, must-revalidate`; dynamic: `Cache-Control: public, max-age=0, must-revalidate`.

## Cache key variation — `Netlify-Vary`

Comma-delimited instructions on the response; pipe-delimited value lists:

```
Netlify-Vary: query=item_id|page, country=es+de|us, cookie=ab_test|is_logged_in
```

- `query=a|b` subset, or bare `query` for all params. Keys case-sensitive; param order irrelevant.
- `header=Device-Type|App-Version` — custom + most standard headers.
- `language=en|es+pt` — `+` groups; checked against `Accept-Language` with quality weighting.
- `country=us|es+pt` — GeoIP, ISO 3166-1 two-letter codes; `+` groups.
- `cookie=ab_test|is_logged_in` — target specific keys, not the whole `Cookie` header.

**Cannot vary by header on:** `Accept*`, `Cache-Control`, `Connection`, `Content-Length`, `Cookie`, `Host`, `If-*`, `Range`, `Referer`, `Upgrade`, `User-Agent`. For language/cookie/format use `Vary: Accept-Language`/`Vary: Cookie` or the specific `Netlify-Vary` instruction.

**Consistency rule:** a URL must return the same `Netlify-Vary` on every response — the first cached response's instructions win and later ones are ignored. `Netlify-Vary` + standard `Vary` are both respected (use `Vary` for format/encoding, and to pass instructions to an upstream CDN like Cloudflare).

## Cache tags & opt-out

Tag responses for taggable purging:

```
Netlify-Cache-Tag: tag1,tag2,tag3
```

- `Netlify-Cache-Tag` (Netlify CDN) wins over `Cache-Tag` (passed downstream). Some providers strip `Cache-Tag` — set both when proxying through them.
- Constraints: case-insensitive, UTF-8 only, ≤1024 chars/tag, ≤500 tags/response.

Opt a response out of automatic atomic-deploy invalidation with `Netlify-Cache-ID` (comma-separated; auto-registered as cache tags for purging; separate 500-ID limit):

```
Netlify-Cache-ID: cms-proxy,product,image
```

After opting out, purge on-demand after relevant changes (e.g. redirect/proxy or function changes behind a `Netlify-Cache-ID`).

## On-demand invalidation (purge)

Purge from a **deployed function** with `purgeCache` (site ID is passed automatically):

```ts
import { purgeCache } from "@netlify/functions";

export default async () => {
  await purgeCache(); // no args = purge everything for the site
  return new Response("Purged!", { status: 202 });
};
```

Purge by tag, optionally targeting a deploy/subdomain:

```ts
import { purgeCache } from "@netlify/functions";

export default async (req: Request) => {
  const cacheTag = new URL(req.url).searchParams.get("tag");
  if (!cacheTag) return;
  await purgeCache({
    tags: [cacheTag],
    deployAlias: "deploy-preview-11",
    domain: "early-access.company.com",
  });
  return new Response("Purged!", { status: 202 });
};
```

**Ambient credentials only work inside a deployed function.** From CI, local scripts, or the build, pass `token` (a personal access token read from an env var — never hardcoded) and `siteID`.

**Lambda-compatible functions** use the legacy `module.exports.handler = async (event, context) => {…}` signature and must pass `context.clientContext.custom.purge_api_token`:

```ts
import { purgeCache } from "@netlify/functions";

module.exports.handler = async (event, context) => {
  const token = context.clientContext.custom.purge_api_token;
  await purgeCache({ tags: ["tag1", "tag2"], token });
  return { body: "Purged!", statusCode: 202 };
};
```

Direct API (from outside a function) — `POST https://api.netlify.com/api/v1/purge` with `Authorization: Bearer <personal_access_token>` and `Content-Type: application/json`:

```sh
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <personal_access_token>" \
  --data '{"site_slug": "mysitename", "cache_tags": ["news"], "deploy_alias": "deploy-preview-11", "domain": "early-access.company.com"}' \
  'https://api.netlify.com/api/v1/purge'
```

- Purge by site: `site_id` or `site_slug`. By tag: `cache_tags` + site. Omitting `cache_tags` purges the whole site; an **empty** `cache_tags` list purges NOTHING.
- Identifier mapping: in the UI (Project configuration > General > Project details), **Project ID** = `site_id`, **Project name** = `site_slug`. See https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api#get-site.
- **Rate limit:** each tag or site can be purged only twice per 5s — exceeding returns `429`.

## Cache API (`caches` global)

Programmatic read/write of HTTP responses from Functions/Edge Functions. Use for caching individual components of a route or arbitrary fetches, alongside header-based route caching.

**Scope rule:** `caches.open()` anywhere, but `match`/`put`/`delete` **only inside the request handler** — doing them at module/global scope throws.

```ts
import type { Config, Context } from "@netlify/functions";

const cache = await caches.open("my-cache"); // ok in global scope

export default async (req: Request, context: Context) => {
  const request = new Request("https://example.com/expensive-api");
  const cached = await cache.match(request);
  if (cached) return cached;

  const fresh = await fetch(request);
  if (fresh.ok) {
    cache.put(request, fresh.clone()).catch((error) => {
      console.error("Failed to add to the cache:", error);
    });
  }
  return fresh;
};

export const config: Config = { path: "/cache-api-example" };
```

`CacheStorage` subset:
- `caches.match(request)` → `Response` from any cache, or `undefined`.
- `caches.open(name)` → `Cache`. Distinct names fragment the cache and lower hit ratio — use few, meaningful names.

`Cache` methods (all require `caches.open()`):
- `cache.match(request)` → `Response` | `undefined`.
- `cache.put(request, response)` → adds a response.
- `cache.add(request)` / `cache.addAll(requests)` → fetch + store.
- `cache.delete(request)` → `true`.
- `keys()` is **not implemented** — no way to list contents.

Consistency: reads/writes strongly consistent; **deletes eventually consistent** (a deleted entry may still return briefly).

**Cannot cache:** partial responses (206), `Vary: *`, or non-`GET` methods. Responses need a cache-control header with `max-age`/`s-maxage` ≥ 1s, `public` (not `private`/`no-cache`/`no-store`), and a 2xx status — otherwise storage errors. For responses you don't control, rewrite headers with `fetchWithCache`.

**Limits per invocation:** 100 lookups, 20 insertions/deletions. Exceeding: further lookups return nothing; writes/deletes no-op. Limits are shared across edge functions in a request but separate between serverless and edge functions. Cache data is per-region (not replicated), auto-invalidated on redeploy and on `max-age`/`s-maxage` expiry.

## `@netlify/cache` module

Install to get helpers, time constants (`MINUTE`/`HOUR`/`DAY`), and a `caches` export for local dev:

```
npm install @netlify/cache
```

**Local-dev workaround:** the `caches` global isn't part of Node.js. Netlify provides it in its Functions/Edge runtimes (live and under `netlify dev`), but if you run your framework's own dev server the global is undefined and throws — import it instead:

```ts
import { caches } from "@netlify/cache";
const cache = await caches.open("my-cache");
```

Requires Netlify CLI 20.0.3+; nothing persists locally (lookups return nothing, writes/deletes don't mutate). No functional change from the global.

### `cacheHeaders(settings)` → header object

```ts
import { cacheHeaders, DAY } from "@netlify/cache";

const headers = {
  "x-custom-header": "some value",
  ...cacheHeaders({
    ttl: 2 * DAY,          // s-maxage
    swr: HOUR,             // stale-while-revalidate
    durable: true,
    tags: ["product", "sale"],
    overrideDeployRevalidation: ["tag"], // opt out of atomic-deploy invalidation
    vary: {
      cookie: ["ab_test_name", "ab_test_bucket"],
      query: ["item_id", "page"], // or true for all
      country: ["us", ["es", "pt"]], // nested = OR
      language: ["en"],
      header: ["Device-Type"],
    },
  }),
};
```

For only generic (non-Netlify) headers, use the `cdn-cache-control` npm module instead.

### `fetchWithCache(resource, options?, cacheSettings?)`

Drop-in `fetch` that returns a cached response or fetches, stores, and returns. `cacheSettings` override conflicting response headers; with `swr`, background revalidation is handled automatically.

```ts
import { fetchWithCache, DAY } from "@netlify/cache";

const response = await fetchWithCache("https://example.com/expensive-api", {
  ttl: 2 * DAY,
  tags: ["product", "sale"],
  vary: { cookie: ["ab_test_name"], query: ["item_id", "page"] },
});
```

### `getCacheStatus(response | headers | headerString)`

Returns `{ hit, caches: { durable: { hit, stale, stored, ttl }, edge: { hit, stale } } }`.

```ts
const { hit, edge, durable } = getCacheStatus(response);
```

### `needsRevalidation(response)` → boolean

Only needed when calling `cache.match`/`cache.put` directly (not with `fetchWithCache`+`swr`). True when a Cache-API response is stale within its SWR window — return it, then revalidate in `context.waitUntil` and `cache.put` the fresh copy:

```ts
if (cached) {
  if (needsRevalidation(cached)) {
    context.waitUntil(
      fetch(request).then((fresh) => {
        const response = new Response(fresh.body, {
          headers: { ...Object.fromEntries(fresh.headers), ...cacheHeaders({ ttl: MINUTE, swr: HOUR }) },
        });
        return cache.put(request, response);
      })
    );
  }
  return cached;
}
```

## Durable cache

Add `durable` (serverless only) so edge nodes lacking a local copy check the shared durable cache before invoking the function — fewer invocations, better cache-miss latency. Eventually consistent, so multiple regions may still invoke the function a few times per version. Co-located with the site's functions region. Works with `Netlify-Vary`, SWR, and on-demand invalidation. **Next.js:** Next Runtime 5.5.0+ uses the durable cache automatically.

## Debugging with `Cache-Status`

Netlify sets `Cache-Status` (RFC 9211) on all responses. Check it on a **deployed** URL. Look for values starting `"Netlify Edge"` or `"Netlify Durable"`:

- `"Netlify Edge"; fwd=miss` — nothing cached.
- `"Netlify Edge"; hit` — served from cache.
- `"Netlify Edge"; hit; fwd=stale` — stale served while revalidating (SWR).
- Durable stored on miss: `"Netlify Durable"; fwd=uri-miss; stored=true; ttl=3600`.
- Durable hit: `"Netlify Durable"; hit; ttl=1234`.

`ttl` negative = seconds since expiry. Each request may hit a different cache instance — without production traffic or `durable`, expect several empty caches before a hit; repeat requests to warm one.

<!-- Gaps: package/method inconsistency in @netlify/cache local-dev docs (caches import shown with cache.set, not the documented cache.put) resolved to cache.put per Cache API surface. -->

<!-- system: agent-context/caching/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (caching)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. Only `GET` responses are cached by the CDN. `POST`/`PUT`/etc. are never
   cached regardless of headers — expose cacheable data on a `GET` route
   (put the inputs in the URL or query string).
2. Without `Netlify-Vary: query=...`, the full query string is the cache key —
   every distinct query string (`utm_*`, `fbclid`, ...) is a separate cache
   entry. Enumerate only the params that actually change the response.
3. `netlify dev` does not emulate the CDN cache — a cache miss every time
   locally is expected, not a bug. Verify caching behavior on a deployed URL
   (Deploy Preview or production) via its `Cache-Status` header.
4. `purgeCache()` has ambient credentials only inside a deployed function.
   From CI, local scripts, or the build, pass `token` (a personal access
   token read from an env var, never hardcoded) and `siteID`.
