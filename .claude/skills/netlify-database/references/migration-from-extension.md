# Switching to Netlify Database

Step-by-step process for switching a project from an external Postgres provider to **Netlify Database** (`@netlify/database`, `NETLIFY_DB_URL`). The steps are provider-agnostic — they apply whether the source is the deprecated Netlify DB extension (`@netlify/neon`), a standalone Neon account, Supabase, RDS, a self-managed instance, or any other hosted Postgres.

> **Terminology.** This document uses "switch" for the provider change and "migration" exclusively for schema migration files. The two are distinct operations that happen to overlap during this process.

> **Brief data-loss window.** This flow trades a small data-loss risk for a much simpler cutover: any writes to the source between the final export and the production deploy will not make it across. For most projects that's a few minutes. High-traffic apps should plan a maintenance window or a dual-write strategy outside the scope of this guide.

## Prerequisites

- A linked Netlify project currently serving from an existing Postgres source
- Netlify CLI 26.0.0+ installed and authenticated
- `pg_dump` and `pg_restore` available locally, with versions matching your source server

## The shape of the switch

Three phases, each independently reversible. The source database keeps serving production traffic until the Phase 2 merge, so any rollback before that has zero user-visible impact.

1. **Phase 1 — Provision** the new database alongside the source. No code or traffic changes.
2. **Phase 2 — Swap the code and rehearse** on a preview deploy with real data.
3. **Phase 3 — Cut over** production with a fresh data move and a merge.

## Phase 1 — Provision the new database

Goal: Netlify Database is online with the correct schema baseline. App still reads from the source.

> **Switching from the Netlify DB extension.** `@netlify/database` and `@netlify/neon` use different env vars (`NETLIFY_DB_URL` vs `NETLIFY_DATABASE_URL`) and don't conflict. Keep `@netlify/neon` installed and the extension configured throughout the switch — cleanup happens at the end.

On a new branch:

1. Run `netlify database init` to install `@netlify/database` and verify the database is reachable. **Decline the sample data prompt** — a separate baseline migration follows in the next step:

    ```bash
    netlify database init
    ```

2. Create the baseline migration:

    ```bash
    netlify database migrations new -d baseline
    ```

3. Populate the new `migration.sql` with a schema-only dump of the source. What matters is that running this migration against an empty database leaves it with the right shape:

    ```bash
    pg_dump --schema-only --no-owner --no-privileges "$SOURCE_DATABASE_URL"
    ```

    If the project already has Drizzle migrations, point `drizzle-kit` at `netlify/database/migrations/` and move them in instead of the schema dump. `pg_dump` 18+ emits `\restrict` / `\unrestrict` psql meta-commands that are not valid SQL — strip them: `... | grep -v -E '^\\(restrict|unrestrict)'`.

    > **Switching from the Netlify DB extension with Neon Auth?** The source contains a `neon_auth` schema with auth tables. Add `--schema=public` to exclude them. If you're switching auth providers too, handle that separately.

4. Push the branch. Netlify detects `@netlify/database`, provisions a preview database branch, and applies the baseline migration. The preview goes live still serving from the source database — app code hasn't changed yet.

5. Confirm the baseline applied cleanly:

    ```bash
    netlify database status --branch <preview-branch>
    ```

6. Merge the branch. Netlify provisions the production database branch and applies the baseline migration there too. Production still serves from the source.

If the baseline fails on the preview, the deploy fails and production is unaffected. Iterate until a clean preview deploy confirms the schema is reproducible from nothing.

## Phase 2 — Swap the code and rehearse on a preview

Goal: the new production code works against Netlify Database, proven on a preview deploy with real data.

On a new branch:

1. Update application code to read and write through `@netlify/database`. Wire Drizzle to the native adapter:

    ```typescript
    // db/index.ts
    import { drizzle } from "drizzle-orm/netlify-db";
    import * as schema from "./schema";

    export const db = drizzle({ schema });
    ```

    > **Switching from the Netlify DB extension.** Replace `import { neon } from "@netlify/neon"` and any direct calls to `neon()` with the Drizzle adapter above. The `NETLIFY_DATABASE_URL` env var from the legacy extension is no longer read.

    > **Not using Drizzle?** The same flow works with any Postgres-compatible driver — see the native-driver section in `SKILL.md`.

2. Update Drizzle config to point at the GA migrations directory:

    ```typescript
    // drizzle.config.ts
    import { defineConfig } from "drizzle-kit";

    export default defineConfig({
      dialect: "postgresql",
      schema: "./db/schema.ts",
      out: "netlify/database/migrations",
    });
    ```

3. Remove old-provider packages and any scripts that ran `drizzle-kit migrate` against explicit staging/production URLs. The GA product auto-applies schema migrations on every deploy.

    > **Switching from the Netlify DB extension.** Remove `@netlify/neon`, `@neondatabase/serverless`, and `@neondatabase/toolkit`. Keep `@neondatabase/neon-js` only if the frontend uses it for Neon Auth and auth is not being switched in this pass.

4. Push the branch. Netlify creates a preview deploy with its own preview database branch, forked from the (currently empty) production Netlify Database.

5. Get the preview branch's connection string with credentials:

    ```bash
    netlify database status --branch <preview-branch> --show-credentials
    ```

6. Copy a snapshot of data from the source into the preview branch. Use `--data-only` because the schema is already in place via the baseline migration, and `--no-acl` because Netlify Database manages its own privileges:

    ```bash
    pg_dump -Fc --data-only "$SOURCE_DATABASE_URL" | pg_restore --no-owner --no-acl --dbname="$PREVIEW_DATABASE_URL"
    ```

7. Exercise the preview URL — click through reads and writes, validate the critical flows end-to-end. If something's off, iterate on the branch and push again. Each push gets a fresh preview branch, so the rehearsal can be repeated until the path is clean.

The rehearsal is the core of this flow. By the time the preview looks right, both the code swap and the data move have been proven against a real deployed environment. The production cutover is a re-run of a path that's already been validated.

## Phase 3 — Cut over production

When the rehearsal is clean:

1. Get the production database connection string with credentials:

    ```bash
    netlify database status --show-credentials
    ```

2. Export data from the source and import into production Netlify Database:

    ```bash
    pg_dump -Fc --data-only "$SOURCE_DATABASE_URL" | pg_restore --no-owner --no-acl --dbname="$PRODUCTION_DATABASE_URL"
    ```

3. Merge the Phase 2 branch to trigger a production deploy. Once it completes, the app reads and writes through Netlify Database.

4. Confirm reads and writes against the new production database.

## Pre-flight: filename ordering for migrated migration files

If existing Drizzle migration files are being moved into `netlify/database/migrations/` rather than baselined from a schema dump, **filename ordering matters**. Netlify applies schema migrations lexicographically by filename. If the project ever changed its Drizzle prefix setting (e.g., `unix` → `timestamp`), the lex order can diverge from `_journal.json`'s `idx` order:

- 10-digit unix prefixes (`1771681020_...`) sort **before** 14-digit timestamp prefixes (`20260214140526_...`) alphabetically
- But the unix files may have been generated **after** the timestamp files chronologically

If lex sort of `netlify/database/migrations/*` does not match `idx` order in `_journal.json`, rename the offending files to timestamp prefixes using the `when` values from `_journal.json`:

```bash
date -u -r <unix_seconds> +%Y%m%d%H%M%S
git mv netlify/database/migrations/<old>_<name>.sql netlify/database/migrations/<new>_<name>.sql
git mv netlify/database/migrations/meta/<old>_snapshot.json netlify/database/migrations/meta/<new>_snapshot.json
# Update the `tag` in _journal.json to match
```

Also walk the snapshot chain (`id` / `prevId` in each `meta/<tag>_snapshot.json`) and patch any broken `prevId`.

## Rolling back

- **Before merging Phase 2** — abandon the Phase 2 branch. Phase 1 left an empty Netlify Database behind a baseline migration; that's harmless.
- **After merging Phase 2** — revert the merge in the Netlify UI. The app redeploys with the previous code, which still reads from the source. Keep the source running and its credentials live until production has been stable on Netlify Database long enough to trust the switch.

## Cleanup

Once production has been stable on Netlify Database long enough to trust the switch:

- Remove the source database client from dependencies and any source connection strings from Netlify environment variables
- Decommission the source database in its hosting provider

> **Switching from the Netlify DB extension.** Run `npm uninstall @netlify/neon`, remove the Neon extension from the site under **Extensions** in the Netlify UI, and drop any remaining `NETLIFY_DATABASE_URL` references from code and environment. Deploy once more to finalize the removal.

## Operational notes for agents

- **Don't commit production data to source control.** Pipe `pg_dump` directly into `pg_restore` rather than writing dumps to disk, or stage them in a gitignored directory (`tmp/`). Even with secrets stripped, PII and operational artifacts don't belong in git.
- **Don't run `drizzle-kit migrate` against the production connection string** during or after the switch. Schema is the deploy's job — running it manually is exactly the kind of out-of-band change the rest of this skill warns against.
- **The data import is the one documented exception** to the rule "never connect to the production database directly." See `references/migrations.md` for the broader rule. Once the switch is complete, resume using DML migrations for all production data changes.
