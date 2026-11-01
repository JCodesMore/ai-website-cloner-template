# Migrations

Netlify Database uses a file-based migration system. Migrations live in `netlify/database/migrations/` and are applied automatically by Netlify: on every deploy preview before the preview is published, and on production immediately before publish. A failing migration blocks the deploy.

Prefer Drizzle Kit for generating migrations. Manual SQL migration files are an edge case — only hand-write one when Drizzle Kit can't express the change (for example, a Postgres-specific DDL or a targeted DML operation).

## Never apply migrations to a hosted database yourself

The platform applies migrations to every Netlify-hosted database (preview branches and production) automatically on deploy. You never run `drizzle-kit migrate` against `NETLIFY_DB_URL` from a preview or production context. For local, use `netlify database migrations apply` — it targets the local development database only.

`drizzle-kit push` is not used in this workflow at all — always generate a migration file and let the deploy apply it. And never run DDL through `netlify database connect`, `psql`, or any other direct connection: schema changes out-of-band cause drift between the migration history and the actual database.

## Schema migration workflow

1. Edit `db/schema.ts`
2. `npm run db:generate` (runs `drizzle-kit generate`) — writes a new file into `netlify/database/migrations/`
3. Review the generated SQL
4. `npm run db:migrate` (runs `netlify database migrations apply`) — applies to the local dev DB for testing
5. Commit schema changes and the migration file together
6. Push — Netlify applies the migration to the preview branch, then to production on publish

Recommended `package.json` scripts:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "netlify database migrations apply"
  }
}
```

`netlify database migrations apply` always targets the local dev DB. Running `drizzle-kit migrate` directly (especially with `NETLIFY_DB_URL` pointing at a hosted branch) is the wrong path — that's the deploy's job.

## File layout and naming

Migrations go in `netlify/database/migrations/`. Two layouts are supported and can be mixed within a project:

- **Flat:** one `.sql` file per migration — `20260417143022_create_items.sql`
- **Subdirectory:** a folder containing `migration.sql` — `20260417143022_create_items/migration.sql` (this is what `netlify database migrations new` and Drizzle Kit's default layout produce)

Files apply lexicographically. Timestamp prefixes are the default for both `drizzle-kit generate` and `netlify database migrations new`, and they keep filenames unique when two pieces of work generate migrations in parallel — common on teams and for solo developers iterating across branches.

If a project is already established on sequential prefixes (`0000_`, `0001_`, …), leave it alone — the CLI's `migrations new` auto-detects the scheme — but expect collisions when working in parallel and resolve them by reset + regenerate.

```
netlify/database/migrations/
  20260417143022_create_items.sql
  20260418091500_add_items_is_active/
    migration.sql
```

## Iterating on a migration you haven't shipped yet

If you generated a migration and realize it needs to change, what you do depends on whether it's been applied anywhere.

- **Already applied** to any database (local dev DB, preview branch, or production) → treat as immutable. Roll forward with a new migration.
- **Only on disk** → don't edit the SQL or snapshot files by hand. Run `netlify database migrations reset` to delete the unapplied files, update `db/schema.ts`, then re-run `npm run db:generate`. Hand-editing desyncs Drizzle Kit's internal state and tends to produce broken migrations on the next generate.

`netlify database migrations reset` only removes files that have not yet been applied — it's safe, and it cannot undo an applied migration. Use `netlify database status` to see what's applied vs pending before deciding. Pass `--branch <name>` to either command to target a remote preview branch instead of the local dev DB.

## Recovering from drift with `migrations pull`

When local migration history has drifted from a remote branch — typically because another contributor (or another agent run) shipped a migration you don't have — pull the canonical files down:

```bash
netlify database migrations pull              # from production
netlify database migrations pull --branch staging
```

`migrations pull` overwrites local migration files with the ones from the target branch, so commit any local-only work first. After pulling, run `netlify database migrations apply` to bring the local dev DB up to date.

## Preview branching

Each deploy preview runs against its own isolated database branch, forked from production data. This means:

- Migrations run against the preview branch first — failures fail the preview, not production
- Schema and data changes in a preview do not affect production until the branch is merged and published
- Agents and developers can test destructive migrations (drops, renames, type changes) without risk to production data

Ad-hoc edits made inside a preview (for example, through the Netlify UI's data browser) stay on that branch. They **do not propagate to production**. Always express production changes as migrations committed to the branch.

## Breaking changes — expand and contract

For anything that could break running code (renaming a column, dropping a column, changing a type), use the expand-and-contract pattern so preview and production can coexist during the transition:

1. **Expand**: add the new shape alongside the old (new column, new table, nullable default). Deploy.
2. **Migrate**: backfill data and update application code to read/write both shapes, or switch to the new shape. Deploy.
3. **Contract**: drop the old shape once nothing reads or writes to it. Deploy.

Never combine these steps into a single migration that renames or drops in one shot while application code still depends on the old shape — the preview may pass, and production will break at cutover.

## Production data changes — write a DML migration

When the user asks for data changes that should land in production (seed data, backfills, CSV imports, one-off cleanups, fixing a bad row), **do not connect to the production database directly** and do not run the change ad-hoc in a preview. Instead, generate a SQL migration file in `netlify/database/migrations/` containing the DML.

```sql
-- netlify/database/migrations/20260417143022_backfill_item_slugs.sql
UPDATE items
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
```

After creating the migration:

- Tell the user, in plain language, that you created a data migration and that merging the branch will apply it to production
- Suggest they verify the result in the deploy preview (which runs against a forked copy of production data) before merging
- For large or risky backfills, recommend wrapping in a transaction or batching

**Never take a shortcut** — running the change directly in the Netlify UI data browser on production, or against the production connection string from a local shell, bypasses the migration history and creates drift between what the repo says the schema/data are and what production actually has.

**One exception: initial data seed when switching database providers.** When switching from an external database (including the legacy extension) to Netlify Database, production data must be imported via a direct connection — committing a full data dump to git is not appropriate. This one-time import is documented in `references/migration-from-extension.md`. Once the switch is complete, resume using DML migrations for all production data changes.

If the request is ambiguous ("fix the broken row for user X"), ask the user to confirm they want a production-bound migration rather than a one-off preview edit. When an agent is the one asking for data changes on behalf of a user, the default should be to **not** create a data migration unless the user has explicitly asked for production to change.

## Admin interfaces instead of repeated DML migrations

If the user keeps needing to load or edit data (for example, "add a new teacher every week"), a one-off data migration each time is the wrong answer. Build them an admin interface — a page or CLI that uses the normal Drizzle client — so they can manage data through the application rather than through migrations. Gate it behind Netlify Identity or another auth mechanism (see `netlify-identity/SKILL.md`).

## Manual SQL migrations

If you need to write a SQL migration by hand (for example, creating an extension, adding a check constraint Drizzle Kit won't emit, or a targeted DML statement), scaffold the file via the CLI:

```bash
netlify database migrations new -d "enable pgvector extension"
```

This creates `netlify/database/migrations/<prefix>_<slug>/migration.sql` using the existing project's numbering scheme (or prompts for one). Open it and write the SQL. The flat layout (`<prefix>_<slug>.sql` directly in the migrations directory) also works if you prefer to write the file by hand.

Keep the SQL idempotent where possible (`CREATE ... IF NOT EXISTS`, guarded `UPDATE`s) so re-running against a half-migrated state is safe.

After adding a manual file in a Drizzle project, run the schema generate step anyway so Drizzle Kit's snapshot stays in sync with the current state of the database.
