# Netlify CLI commands for Netlify Database

The CLI ships a complete database surface under `netlify database` (alias: `netlify db`). Requires CLI 26.0.0+. Most commands accept `--json` for machine-readable output — useful when scripting or reading results from an agent.

## `netlify database init`

Interactive bootstrap: installs `@netlify/database` (and Drizzle if chosen), writes `drizzle.config.ts`, scaffolds and applies a starter migration, and runs a sample query. Use `--yes` for non-interactive mode.

## `netlify database status`

Reports whether the database is enabled, whether `@netlify/database` is installed, the connection string for the active branch, and the applied/pending/missing/out-of-order migrations. **Defaults to the local development database** — pass `--branch <name>` to target a remote preview or production branch.

```bash
netlify database status                          # local
netlify database status --branch my-feature      # remote branch
netlify database status --json
netlify database status --show-credentials       # include username/password in connection string
```

## `netlify database connect`

Connects to the database. Defaults to an interactive REPL — for agent and script use, always pass `--query` for one-shot execution:

```bash
# List tables
netlify database connect --query "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"

# Inspect columns
netlify database connect --query "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'items'"

# JSON output
netlify database connect --query "SELECT * FROM items LIMIT 10" --json

# Get connection details only (no query)
netlify database connect --json
```

**Never run DDL (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`) through `netlify database connect`, `psql`, or any other direct connection.** Schema changes go through migration files — out-of-band DDL drifts the migration history from the actual schema.

## `netlify database migrations new`

Scaffolds a new migration file as `netlify/database/migrations/<prefix>_<slug>/migration.sql`. Auto-detects the numbering scheme from existing files; prompts when undetermined.

```bash
netlify database migrations new -d "add users table"
netlify database migrations new -d "add users table" --scheme timestamp
```

## `netlify database migrations apply`

Applies pending migrations to the **local development database**. The CLI does **not** apply migrations to the local DB automatically when `netlify dev` starts — you run this command yourself when you're ready. Hosted databases (preview branches, production) are handled by the deploy.

```bash
netlify database migrations apply
netlify database migrations apply --to <name>   # apply up to a specific migration
```

## `netlify database migrations pull`

Downloads migration files from a remote branch (defaults to `production`) and overwrites local files. Useful when local migration history has drifted from production — for example, after another contributor shipped a migration you don't have locally.

```bash
netlify database migrations pull                  # from production
netlify database migrations pull --branch staging # from a specific branch
netlify database migrations pull --branch         # from your current local git branch
netlify database migrations pull --force          # skip the overwrite confirmation
```

## `netlify database migrations reset`

Deletes local migration files that have **not yet been applied** to the target database. Applied migrations and their data are left alone — the command can't undo something already applied.

Typical use: you generated a migration, realized it was wrong, and want to start over. Run `reset`, update `db/schema.ts`, then `npm run db:generate` produces a fresh migration.

```bash
netlify database migrations reset                  # against local dev DB
netlify database migrations reset --branch <name>  # against a remote branch
```

## `netlify database reset`

Wipes the local development database — drops all schemas and tables. Only affects the local DB; never touches preview branches or production. Use this when you want to replay all migrations from scratch.

```bash
netlify database reset
```
