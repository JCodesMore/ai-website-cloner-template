---
name: netlify-blobs
description: Store and retrieve unstructured objects, files, and cache-like state on Netlify with the @netlify/blobs module. Use when persisting user file uploads (images/documents), caching computed output from functions or Background Functions, serving downloadable assets, storing JSON blobs keyed by ID, or seeding deploy-specific data. Reach for this for key/value or object storage from Functions, Edge Functions, or Build Plugins — not for per-user, transactional, or relational data (use Netlify DB for that). Triggers include "save an uploaded file", "cache API results", "store generated site map", "key/value store for a function", or "file uploads without a database".
---

# Netlify Blobs

Modern syntax — import from `@netlify/blobs` and open a store, then call methods on the handle:

```ts
import { getStore, getDeployStore, listStores } from "@netlify/blobs";
import type { Context } from "@netlify/functions"; // or "@netlify/edge-functions"
```

In Functions, Edge Functions, and Build Plugins, `siteID`, `deployID`, `token` (and `region` for `getDeployStore`) are injected automatically. Install with `npm install @netlify/blobs`.

**Not a database.** For dynamic, per-user, transactional, or relational data, use Netlify DB. Blobs is for objects, files, and cache-like state, optimized for frequent reads and infrequent writes.

**Store scope is a footgun — read this first.** `getStore` opens a **site-wide store shared across ALL deploy contexts**: code on a deploy preview reads, overwrites, and deletes production data. Never run destructive tests or seed throwaway data from a preview against a site-wide store. Use `getDeployStore()` or a context-specific store name for isolation.

## Choosing a store type

- `getStore(name)` — site-wide, shared across all deploys. Data persists across deploys; previews see production data.
- `getDeployStore(name)` — deploy-specific, scoped to one deploy. Kept in sync on rollback, cleaned up on deploy deletion. Use for isolation and for anything a failed deploy must not corrupt.
- **Build plugins can READ from any of the site's stores, but WRITE only to deploy-specific stores** (`getDeployStore`). File-based uploads also write only to deploy-specific stores.

## Core writes and reads

```ts
const uploads = getStore("file-uploads");

// set: value is ArrayBuffer | Blob | string
await uploads.set(key, file, { metadata: { country: "Spain" } });

// setJSON: any JSON-serializable value
await uploads.setJSON(key, { hello: "world" });

// get: returns value or null. type: text (default) | json | arrayBuffer | blob | stream
const entry = await uploads.get(key);            // string
const obj = await uploads.get(key, { type: "json" });
if (entry === null) { /* 404 */ }
```

`set`/`setJSON` overwrite an existing key. Both return `{ modified, etag }` (`etag` omitted when no new entry was generated).

### Persisting a user upload (Function)

```ts
import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import { v4 as uuid } from "uuid";

export default async (req: Request, context: Context) => {
  const form = await req.formData();
  const file = form.get("file") as File;
  const key = uuid();
  const uploads = getStore("file-uploads");
  await uploads.set(key, file, { metadata: { country: context.geo.country.name } });
  return new Response("Submission saved");
};
```

Edge functions are identical except `import type { Context } from "@netlify/edge-functions";`.

### Reading (Function)

```ts
export default async (req: Request, context: Context) => {
  const { key } = context.params;
  const uploads = getStore("file-uploads");
  const entry = await uploads.get(key);
  if (entry === null) return new Response(`Not found: ${key}`, { status: 404 });
  return new Response(entry);
};
```

## Metadata and conditional reads

```ts
// getWithMetadata: data + metadata + etag; supports conditional reads
const { data, etag, metadata } = await uploads.getWithMetadata(key);

// getMetadata: metadata + etag only, without downloading the blob
const meta = await uploads.getMetadata(key); // { etag, metadata } or null
```

Both return `null` if the key is absent. Both accept `{ consistency, etag, type }`.

**Conditional read:** pass a cached `etag`; if it still matches server-side, `data` is `null` (your copy is fresh). Compare the whole ETag value including surrounding quotes and any weakness prefix.

```ts
const { data, etag } = await uploads.getWithMetadata("my-key", { etag: cachedETag });
if (etag === cachedETag) {
  // data is null — cached copy still fresh
}
```

## Concurrency: atomic conditional writes

**Last write wins — there is no concurrency control.** Do NOT build counters, balances, or read-modify-write logic on a blob key, even with `onlyIfMatch` retries — that is transactional data; use Netlify DB.

`set`/`setJSON` accept `{ onlyIfNew, onlyIfMatch }`:

```ts
// Create only if key does not exist
const { modified } = await emails.set("jane@netlify.com", "Jane Doe", { onlyIfNew: true });
if (!modified) return new Response("Email already exists", { status: 400 });

// Update only if the ETag still matches
const { modified } = await emails.set("jane@netlify.com", "New Jane", { onlyIfMatch: etag });
if (!modified) return new Response("Cached data is stale", { status: 400 });
```

## Listing

```ts
const { blobs } = await uploads.list(); // blobs: [{ etag, key }]
```

`list({ directories, paginate, prefix })`. Group keys hierarchically with `/`:

```ts
const { blobs, directories } = await animals.list({ directories: true });
// directories: ["cats", "dogs"]; blobs: top-level keys only

// Drill in — trailing slash REQUIRED (without it "catsuit" also matches)
const res = await animals.list({ directories: true, prefix: "cats/" });
```

Pagination: `list` returns all pages by default (pages of up to 1,000 entries). Set `paginate: true` for an `AsyncIterator`:

```ts
for await (const page of store.list({ paginate: true })) {
  console.log(page.blobs);
}
```

`listStores({ paginate })` returns `{ stores: string[] }` — **does not include deploy-specific stores** (pages of up to 1,000).

## Deleting

```ts
await uploads.delete(key);                        // resolves undefined
const { deletedBlobs } = await uploads.deleteAll(); // deletes every object = deletes the store
```

## Expiration (no server-side TTL)

Blobs never expire on their own. Store an expiration timestamp in metadata, check it on read, and `delete` when past:

```ts
await uploads.set(key, body, { metadata: { expiration: new Date("2025-01-01").getTime() } });
const entry = await uploads.getWithMetadata(key);
const { expiration } = entry.metadata;
if (expiration && expiration < Date.now()) await uploads.delete(key);
```

## Consistency

Default is **eventual** consistency: writes are globally available immediately, but updates/deletions propagate to all edge locations within 60 seconds. Opt into **strong** consistency per store or per read:

```ts
const store = getStore({ name: "animals", consistency: "strong" }); // whole store
await store.get("dog", { consistency: "strong" });                  // single read
```

Netlify CLI always uses strong consistency.

## Regions

`region` takes an **AWS region code** (not the functions airport code). Supported (any other value throws `InvalidBlobsRegionError` before the request): `ap-southeast-1`, `ap-southeast-2`, `eu-central-1`, `us-east-1`, `us-east-2`.

- **Deploy-specific stores** default to your functions region (auto-injected).
- **Site-wide stores** default to `us-east-2` and do NOT follow your functions region.

**Footgun — site-wide region is per-call:** if you need a site-wide store in a specific region, pass `region` on **every** `getStore` call for that store (reads, writes, deletes). A call that omits it uses `us-east-2` and silently sees no data — no error or warning.

**Footgun — changing a region does not move data:** the store appears empty in the new region while data remains in the old. To migrate, copy each entry to a store opened in the new region, then delete from the old.

```ts
const uploads = getDeployStore({ name: "file-uploads", region: "ap-southeast-2" });
const profiles = getStore({ name: "user-profiles", region: "eu-central-1" });
```

## File-based uploads (no build plugin)

Place files under `.netlify/blobs/deploy` in the base directory; Netlify uploads them (preserving directory structure) to **deploy-specific stores**. Attach metadata with a sibling JSON file named `$<filename>.json` (must be valid JSON or the deploy fails).

```
.netlify/blobs/deploy/
├─ dogs/good-boy.jpg
├─ dogs/$good-boy.jpg.json   # metadata for good-boy.jpg
├─ cat.jpg
└─ mouse.jpg
```

**Caution:** Netlify empties `.netlify/blobs/deploy` before each build. Files committed to your repo are NOT uploaded — create blob files during the build (build command or build plugin).

## Access control (default to private)

Blobs have **no built-in access control** — the serving function is the gate. Blobs are only reachable through your own site's code, encrypted at rest and in transit. When in doubt, default to private: gate reads behind an authenticated function rather than exposing blobs publicly. Do not serve arbitrary user-supplied keys for sensitive data; scope keys with something callers cannot tamper with. Blobs is not part of Netlify's HIPAA-compliant offering.

## Constraints

- Store names: no `/` or `:`, max 64 bytes.
- Keys: non-empty, cannot start with `/`, max 600 bytes, any Unicode (some chars >1 byte).
- Object size max 5 GB; metadata max 2 KB.
- Functions written in **Go cannot access Netlify Blobs**.
- Fetch API required (Node.js 18+); otherwise pass a custom `fetch`: `getStore({ fetch, name: "file-uploads" })`.
- Local dev (Netlify Dev) uses a sandboxed local store: no file-based uploads, cannot read production data.
- File-based uploads require continuous deployment or CLI deploys.

## When an operation fails

Surface the error and read the function logs. Do not invent REST endpoints or side-channel APIs to retry.

## CLI and UI

`netlify blobs:list/get/set/delete` exist for inspection — see the [CLI command reference](https://cli.netlify.com/commands/blobs/). Browse and download in the UI under **Data & Storage > Blobs**.

## Module version migration

If you wrote to site-wide stores with `@netlify/blobs` 6.5.0 or earlier and upgrade, those stores become inaccessible due to a namespacing change. Migrate with the latest CLI, then use module 7.0.0+:

```sh
netlify recipes blobs-migrate YOUR_STORE_NAME
```

## Reference

Full API and background: [Netlify Blobs docs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) and the [data & storage overview](https://docs.netlify.com/build/data-and-storage/overview/).

<!-- system: agent-context/blobs/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (blobs)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. Blobs is not a database. For dynamic, per-user, or transactional data,
   use Netlify DB — Blobs is for objects, files, and cache-like state.
2. When a store operation fails, surface the error and read the function
   logs — do not invent REST endpoints or side-channel APIs to retry.
3. `netlify blobs:list/get/set/delete` exist for inspection; the CLI
   reference is their source of truth — link, don't restate.
4. Blobs have no built-in access control — the serving function is the gate.
   When in doubt, default to private: gate reads behind an authenticated
   function rather than exposing blobs publicly.
5. Site-scoped stores are shared across ALL deploy contexts — code on a
   deploy preview reads, overwrites, and deletes production data. Never run
   destructive tests or seed throwaway data from previews; use
   `getDeployStore()` or a context-specific store name for isolation.
6. Don't build counters, balances, or read-modify-write logic on a blob key —
   even with `onlyIfMatch` retries. That's transactional data; use Netlify DB.
7. Build plugins: state BOTH halves — they can read from any of the site's
   stores, but write only to deploy-specific stores (`getDeployStore`).
