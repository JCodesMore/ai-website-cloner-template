---
name: netlify-database
description: Zero-config Postgres for Netlify apps via @netlify/database — querying data from Functions/Edge Functions, writing schema migrations, setting up Drizzle ORM, local dev with netlify dev, database branches for deploy previews, and migrating an existing Postgres project onto Netlify. Use when adding a database, building a contact form or CRUD API, writing SQL migrations, wiring up Drizzle, running netlify database commands, testing with a local Postgres, or switching from Neon/Supabase/RDS to Netlify Database.
---

# Netlify Database

Zero-config managed Postgres. Install `@netlify/database`, write migrations under `netlify/database/migrations/`, deploy — Netlify provisions the DB and applies migrations automatically. Queryable from Functions, Edge Functions, Builds, and Agent Runners.

## Modern client (reach for this)

```ts
import { getDatabase } from "@netlify/database";

const db = getDatabase();               // auto-selects connection for the runtime
const userId = 42;
const users = await db.sql`SELECT * FROM users WHERE id = ${userId}`;  // auto-parameterized
```

Own driver / ORM instead:
```ts
import { getConnectionString } from "@netlify/database";
const connectionString = getConnectionString();  // correct branch for this env
```

**Legacy — do NOT use for new code:** `import { neon } from "@netlify/neon"`. Superseded by `@netlify/database`. Replace `neon()` calls with the Drizzle `netlify-db` adapter or a Postgres driver via `getConnectionString()`. The legacy env var `NETLIFY_DATABASE_URL` is replaced by `NETLIFY_DB_URL`.

## Where things go

| What | Location |
|------|----------|
| Migrations | `netlify/database/migrations/` (SQL files or subdirs with `migration.sql`) |
| Query code | Functions (`netlify/functions/`), Edge Functions |
| Drizzle schema | `db/schema.ts` (convention) |
| Drizzle client | `db/index.ts` (convention) |
| Connection string | `NETLIFY_DB_URL` env var, or `getConnectionString()` |

## Querying

`getDatabase(options?)` returns a client with `sql` and `pool`. `options.connectionString` overrides the auto-provisioned one; `options.debug` enables logging.

```ts
const db = getDatabase();
const active = await db.sql`SELECT * FROM users WHERE active = ${true}`;
await db.sql`INSERT INTO users (name, email) VALUES (${"Ada"}, ${"ada@example.com"})`;
await db.sql`UPDATE users SET name = ${"Ada Lovelace"} WHERE id = ${1}`;
await db.sql`DELETE FROM users WHERE id = ${1}`;

// Type the rows
interface User { id: number; name: string; email: string; }
const typed = await db.sql<User>`SELECT * FROM users`;

// Stream
for await (const row of db.sql`SELECT * FROM users`.stream()) { /* ... */ }
for await (const chunk of db.sql`SELECT * FROM users`.chunked(100)) { /* ... */ }
```

`SQLTemplate` methods: `execute()` → `Promise<T[]>`, `stream()` → `AsyncGenerator<T>`, `chunked(n)` → `AsyncGenerator<T[]>`, `toSQL()` → raw SQL + params without executing.

`sql` helpers:
- `sql.identifier(value)` — safe table/column name. String, string[], or `{ schema, table, column, as }`.
- `sql.values(rows)` — bulk-insert values list from a 2D array.
- `sql.default` — the SQL `DEFAULT` keyword.
- `sql.raw(value)` — **injects unparameterized SQL; bypasses injection protection. Only for trusted constants (e.g. `"DESC"`), never user input.**
- `sql.unsafe(query, params?, { rowMode })` — raw query string with `$1` params; `rowMode` is `"array"` or `"object"`.

### Transactions — use `pool`

`db.pool` is a [`pg.Pool`](https://node-postgres.com/apis/pool). `BEGIN`/queries/`COMMIT` must run on the same connection:
```ts
const client = await db.pool.connect();
try {
  await client.query("BEGIN");
  await client.query("INSERT INTO users (name, email) VALUES ($1, $2)", ["Ada", "ada@example.com"]);
  await client.query("INSERT INTO posts (author_id, title) VALUES ($1, $2)", [1, "First post"]);
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  client.release();
}
```

Own drivers:
```ts
import { getConnectionString } from "@netlify/database";
import pg from "pg";
const pool = new pg.Pool({ connectionString: getConnectionString() });

// or the `postgres` driver via env var
import postgres from "postgres";
const sql = postgres(process.env.NETLIFY_DB_URL);
```

## Drizzle ORM

**Install both packages from `@beta` — required.** `latest` lacks the `drizzle-orm/netlify-db` adapter and will fail.
```bash
npm install @netlify/database drizzle-orm@beta
npm install -D drizzle-kit@beta
```

`drizzle.config.ts` — you **MUST** set `out` to the Netlify migrations directory or Netlify won't apply generated migrations:
```ts title="drizzle.config.ts"
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "netlify/database/migrations",   // NOT the default "drizzle"
});
```

```ts title="db/schema.ts"
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp().defaultNow(),
});
```

```ts title="db/index.ts"
import { drizzle } from "drizzle-orm/netlify-db";  // native adapter, auto-configured
import * as schema from "./schema";
export const db = drizzle({ schema });
```

```ts title="netlify/functions/api.ts"
import { desc } from "drizzle-orm";
import type { Config, Context } from "@netlify/functions";
import { db } from "../../db";
import { users } from "../../db/schema";

export default async (req: Request, context: Context) => {
  if (req.method === "GET") {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return Response.json(allUsers);
  }
  if (req.method === "POST") {
    const { name, email } = await req.json();
    const [user] = await db.insert(users).values({ name, email }).returning();
    return Response.json(user, { status: 201 });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/users" };
```

Generate migrations after editing the schema: `npx drizzle-kit generate`.

**Never run `drizzle-kit push` against a Netlify-hosted database, and never run `drizzle-kit migrate` against `NETLIFY_DB_URL`.** Schema reaches hosted DBs only as committed migration files applied by the deploy. `generate` writes files; the deploy applies them.

## Migrations

Files live in `netlify/database/migrations/`. Two formats:
```text
netlify/database/migrations/20260301143000_create_users.sql          # single SQL file
netlify/database/migrations/20260318091500_add_posts/migration.sql   # subdir form
```

Naming: `<number>_<slug>` — `number` is digits (timestamp or `0001`…) defining order; `slug` is lowercase letters/numbers/hyphens/underscores. Sorted **lexicographically**, applied in order. **Use timestamp prefixes** (`netlify database migrations new` handles this) to avoid out-of-order rejection.

```sql title="netlify/database/migrations/20260425103000_create_comments.sql"
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id),
  author_id INTEGER NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**When applied:**
- Production deploy: applied immediately before publish; a failure blocks publish. With auto-publish off, Netlify waits for manual publish before applying.
- Deploy preview: applied on every deploy before it goes live; a failure fails the deploy.
- Local: **not** automatic — run `netlify database migrations apply` yourself.

**Migration footguns (all detected as drift / rejected):**
- **Never edit an applied migration** — checksum drift: `migration "<name>" has been modified after being applied`. Write a new corrective migration.
- **Never remove an applied migration** — `... has been removed after being applied`. Restore it.
- **Out-of-order:** a prefix ≤ the highest applied version is rejected. Timestamps avoid this.
- Prefer backwards-compatible migrations. Breaking changes (rename/drop column) → expand-and-contract across multiple deploys. New table / nullable column → single migration is fine.

Bring-your-own migration system: pick a directory **other than** `netlify/database/migrations` to avoid automatic detection, and you own applying to preview branches and production.

See `references/migrations.md`.

## Local development

Local is **one** database that all code targets — branches are a deploy-time concept and don't exist locally. It's a real Postgres-compatible engine mirroring production, but single-process (not for load testing); auto-scale/sleep settings don't apply.

Start it — either path, state is interchangeable:
```bash
netlify dev                                    # CLI starts + tears down the local DB
```
Or the Vite plugin:
```ts title="vite.config.ts"
import { defineConfig } from "vite";
import netlify from "@netlify/vite-plugin";
export default defineConfig({ plugins: [netlify()] });
```

Common commands (while local DB is running):
```bash
netlify database migrations apply                        # apply pending locally
netlify database migrations new -d "add users table"     # scaffold new migration
netlify database migrations pull                          # overwrite local migrations from remote
netlify database status                                   # enabled? installed? applied/pending migrations
netlify database connect                                  # interactive SQL REPL
netlify database connect --query "SELECT * FROM users LIMIT 10"
netlify database reset                                    # drop all schemas/tables — LOCAL ONLY
netlify database migrations reset                         # delete unapplied local migration files
```

External tools (works while `netlify dev` runs):
```bash
psql "$(netlify database connect --json | jq -r .connection_string)"
```

See `references/local-dev.md`.

## Setup

New project: describe your app to Agent Runners at https://app.netlify.com/start, or `netlify create "<description>"` locally.

Existing project:
```bash
netlify database init      # installs @netlify/database, picks Drizzle or raw SQL, scaffolds a migration
netlify database init --yes # non-interactive (CI / agents)
netlify dev
```
Manual: `npm install @netlify/database`, write a migration under `netlify/database/migrations/`, write a function, `netlify dev`, deploy.

**If `@netlify/database` is NOT installed, Netlify will NOT auto-provision a database** — you'd have to create one manually from the UI **Data & Storage** > **Database** menu. Install the package.

## CLI reference (`netlify database`)

Prereqs: Node ≥ 20.12.2, Netlify CLI ≥ 26.0.0 (`npm install -g netlify-cli`). All commands support `--json`.

| Command | Purpose | Key flags |
|---------|---------|-----------|
| `init` | Set up DB in project | `-y, --yes` |
| `status` | State: enabled, installed, connection string, applied/pending migrations | `-b, --branch`, `--show-credentials` |
| `connect` | SQL REPL, or `--query` one-shot | `-q, --query`, `--json` |
| `migrations apply` | Apply pending to local DB | `--to <name>` |
| `migrations new` | Scaffold a migration | `-d, --description`, `-s, --scheme sequential\|timestamp` |
| `migrations pull` | Overwrite local files from a branch | `-b, --branch`, `--force` |
| `migrations reset` | Delete unapplied local migration files | `-b, --branch` |
| `reset` | Drop all data/tables — **local only** | — |

See `references/cli-commands.md`.

## REST API

Scoped to a site, rooted at `https://api.netlify.com/api/v1`, OAuth 2. Full reference: https://open-api.netlify.com.

| Method + path | Purpose |
|---------------|---------|
| `POST /sites/{site_id}/database` | Create DB (returns existing conn string if present); `region` optional |
| `GET /sites/{site_id}/database` | Get connection string |
| `POST /sites/{site_id}/database/branch` | Create branch; body `deploy_id` (req), `parent_branch_id` (opt, defaults to production) |
| `GET /sites/{site_id}/database/branch/{deploy_id}` | Get branch conn string (404 if none) |
| `DELETE /sites/{site_id}/database/branch/{deploy_id}` | Delete a deploy's branch |
| `POST /sites/{site_id}/database/snapshot` | Snapshot a branch (defaults production) |
| `GET /sites/{site_id}/database/snapshots` | List snapshots |
| `DELETE /sites/{site_id}/database/snapshot/{snapshot_id}` | Delete a snapshot |
| `POST /sites/{site_id}/database/snapshot/{snapshot_id}/restore` | Restore snapshot to a branch (defaults production) |

**Branch delete and snapshot restore are destructive and require explicit user confirmation first.** Snapshot restore is not a routine production-rollback lever.

## Testing

Bare Postgres for unit/integration tests (no functions):
```ts title="db.test.ts"
import { NetlifyDB } from "@netlify/database-dev";  // npm i -D @netlify/database-dev
import { Client } from "pg";
import { afterAll, beforeAll, expect, test } from "vitest";

let db: NetlifyDB, connectionString: string;
beforeAll(async () => {
  db = new NetlifyDB();
  connectionString = await db.start();
  await db.applyMigrations("./netlify/database/migrations");
});
afterAll(async () => { await db.stop(); });

test("inserts and reads a user", async () => {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query("INSERT INTO users (name) VALUES ($1)", ["Ada"]);
  const { rows } = await client.query("SELECT name FROM users");
  expect(rows).toEqual([{ name: "Ada" }]);
  await client.end();
});
```
`NetlifyDB(options?)`: `directory` (persist to disk; omit = in-memory), `port` (default random), `logger`.

Full Netlify environment (functions/edge functions read `NETLIFY_DB_URL` as in production):
```ts
import { NetlifyDev } from "@netlify/dev";  // npm i -D @netlify/dev
const netlifyDev = new NetlifyDev({ projectRoot: "./fixtures/my-project" });
await netlifyDev.start();  // sets NETLIFY_DB_URL in the runtime
// ...tests...
await netlifyDev.stop();
```

## Database branches (deploy-time)

Production deploys are the only deploys that touch the production database. Each deploy preview gets its own branch, seeded with a copy of production data at preview-creation time; schema/data changes there never affect production. Wired up automatically, no code changes.

**Preview branches can contain production data, including PII — and preview deploy links are public. Warn the user before sharing a preview link.**

## Runtime gotchas

- **`Environment not configured`** (`getDatabase()` can't resolve a connection string): running outside Netlify, on **Functions in Lambda compatibility mode**, or an outdated CLI. Fix: pass `connectionString` explicitly.
  ```ts
  const db = getDatabase({ connectionString: "postgres://..." });
  ```
  Lambda compatibility mode is the one primitive where you must pass `connectionString` yourself.
- **`database feature not available for this account`** — requires a Credit-based plan.
- **`compute customization requires a Pro or higher plan`** — auto-scale / sleep settings need Pro+; Free/Personal use defaults.
- **`branch limit reached: maximum <N> branches...`** — each active deploy preview consumes a branch; delete unneeded branches or upgrade.
- **`database not found`** — no DB provisioned; run `netlify database init`.
- **`cannot reset the production branch`** — reset is non-production only.

## Constraints

- **Plan:** Netlify Database is available on Credit-based plans only; active DBs consume credits for compute and bandwidth. Storage is free until July 1, 2026.
- **Permissions:** only a Team Owner can delete a database; only Team Owners and Developers can view connection strings (`Access Denied` = insufficient role).
- **Secrets:** connection strings contain username + password. Never commit them; store in a secret manager / env var provider.

## Switch an existing Postgres project to Netlify Database

Three phases: provision (baseline schema on a branch), rehearse (swap code, copy data into a preview branch, validate), cut over (import data into production, merge). Works from any Postgres source (Neon, Supabase, RDS, self-managed, legacy `@netlify/neon`). Uses `pg_dump`/`pg_restore` (versions matching the source). There is a brief data-loss window — writes to the source between final export and production deploy don't cross over.

Phase 2/3 code swap (Drizzle):
```ts title="db/index.ts"
import { drizzle } from "drizzle-orm/netlify-db";
import * as schema from "./schema";
export const db = drizzle({ schema });
```

Full step-by-step (dump flags, rollback, cleanup): `references/migration-from-extension.md` and `references/legacy-extension.md`.

<!-- Gaps: plan-tier naming (Credit-based vs Free/Personal/Pro) not reconciled in source; exact plan limits, permission tables, and snapshot UI flows live on pages outside this grouping. -->

<!-- system: agent-context/database/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (database)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. Production data changes are expressed as DML migrations — agents never
   edit rows directly (UI row editing exists for humans; it is not an agent
   surface).
2. Preview branches can contain production data, including PII — and preview
   deploy links are public. Warn before sharing.
3. Use only documented surfaces: no raw psql against internal endpoints, no
   `netlify api` scraping, no reading tokens from local CLI config files.
4. Deep guides live in this skill: `references/operational-footguns.md`,
   `references/migrations.md`, `references/local-dev.md`,
   `references/cli-commands.md`, `references/migration-from-extension.md`,
   `references/legacy-extension.md`.
5. Schema changes reach hosted databases only as committed migration files
   applied by the deploy. Never run `drizzle-kit push` in any form against a
   Netlify-hosted database, never run `drizzle-kit migrate` against
   `NETLIFY_DB_URL`, and never apply DDL via `netlify database connect` or
   any direct connection.
6. When a `netlify` command or a deploy fails, surface the exact error, the
   deploy log URL, and the affected site/branch to the user and stop — do
   not invent recovery commands or escalate to lower-level tools.
7. First-deploy `401 Access Denied` on `createSiteDatabase`: if it happened
   on a `--prod`-first deploy, retry preview-first (`netlify deploy`, no
   `--prod`); if a preview also fails, report and stop. Never curl
   `api.netlify.com`, run `netlify api createSiteDatabase`, or pull tokens
   from local CLI config to work around it.
8. A request to change existing data is ambiguous between production and the
   preview branch — if the prompt didn't say, ask. When acting on someone's
   behalf, default to not touching production.
9. Destructive database operations — REST branch delete, snapshot restore,
   any reset — require explicit user confirmation first. The body must not
   present snapshot restore as a routine production-rollback lever.
10. Pin: `drizzle-orm` and `drizzle-kit` must be installed from `@beta` —
    `latest` lacks the `drizzle-orm/netlify-db` adapter and will fail. The
    body may not soften this to a recommendation.
