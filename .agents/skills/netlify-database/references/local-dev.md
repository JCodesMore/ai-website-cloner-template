# Local development

`netlify dev` runs Netlify Database locally against an embedded Postgres-compatible instance — no remote connection, and no risk of writing to production data. Data persists under `.netlify/` in the project directory.

Add `.netlify` to `.gitignore` if it isn't already.

## Running the app

```bash
netlify dev
```

The database is available to functions, edge functions, framework server routes, and any code that calls `getDatabase()` or `getConnectionString()` — same API as production.

For Vite-based projects, install `@netlify/vite-plugin` so the dev server can connect to the local database without launching `netlify dev` as a wrapper.

## Applying migrations locally

`netlify dev` does **not** apply migrations automatically — that's the deploy's job for hosted databases. Locally, you run them yourself:

```bash
netlify database migrations apply             # apply all pending
netlify database migrations apply --to <name> # apply up to a specific migration
```

This targets the local dev DB only. Generating migrations from a Drizzle schema doesn't connect to a database, so plain `npx drizzle-kit generate` works — no wrapper needed.

Do **not** run `drizzle-kit migrate` or `drizzle-kit push` against `NETLIFY_DB_URL` in any context — Netlify applies migrations to hosted databases (preview branches and production) automatically on deploy. See `references/migrations.md`.

## Inspecting the local DB

```bash
netlify database status                                  # applied/pending state
netlify database connect                                 # interactive REPL
netlify database connect --query "SELECT * FROM items"   # one-shot query
netlify database connect --json                          # connection details as JSON
```

For tools that need a bare connection string (`psql`, pgAdmin, DataGrip, TablePlus), pipe `connect --json` through `jq`:

```bash
psql "$(netlify database connect --json | jq -r .connection_string)"
```

## Resetting local data

Use `netlify database reset` to wipe all schemas and tables in the local dev DB. Re-run `netlify database migrations apply` to replay the migration history from scratch.

```bash
netlify database reset
netlify database migrations apply
```

## Common issues

- **"Environment has not been configured"**: install `@netlify/vite-plugin` or run the app via `netlify dev`.
- **Schema drift between local and preview**: confirm every schema change has a matching migration file in `netlify/database/migrations/` committed to the branch. If local migration history has drifted, run `netlify database migrations pull` to sync from a remote branch, or `netlify database migrations reset` to clear unapplied local files.
- **Data not persisting across restarts**: confirm the `.netlify/` directory exists and is writable. A stale lockfile inside it can also cause startup failures — remove it if `netlify dev` won't boot.
