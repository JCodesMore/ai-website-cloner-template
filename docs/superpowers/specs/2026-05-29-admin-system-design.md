# Admin System Design

## Architecture

Three-layer: Next.js App Router pages under `/admin`, API routes under `/api/admin`, PostgreSQL via Drizzle ORM.

```
/admin/login          →  Super admin login (env vars)
/admin/products       →  Product list + search + CRUD
/admin/institutions   →  Institution list + search + CRUD
/admin/comments       →  Comment list + approve/delete
/admin/articles       →  Article list + CRUD
```

## Auth

- Single super-admin account via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars.
- Session cookie (`bbxin_admin_session`), same pattern as existing `auth.ts` but separate namespace.
- Middleware on `/api/admin/*` checks session before processing.
- No registration; no user management UI for now.

## Tech Stack

- **DB:** PostgreSQL
- **ORM:** Drizzle (type-safe, lightweight, schema-first)
- **Auth:** Cookie-based, same `next/headers` pattern as existing `src/lib/auth.ts`
- **Frontend:** Server components + minimal client interactivity (forms, confirm dialogs). Reuses existing layui CSS classes.
- **Migration:** One-off script `scripts/migrate-to-pg.mjs` that reads all JSON files under `src/data/` and inserts into PG tables.

## Database Tables

```sql
users (id, username, password, role, created_at)
products (id, category, name, image, institution, institution_full_name,
          institution_href, max_amount, term, rate, repayment,
          advantages, summary, intro_html, created_at, updated_at)
institutions (id, name, full_name, logo, website, intro_html,
              products, created_at, updated_at)
comments (id, author, content, product_name, product_href,
          images, date, status, created_at)
articles (id, title, body, date, view_count, category_id, created_at, updated_at)
```

## API Routes

Standard REST for each resource:

| Method | Path | Action |
|--------|------|--------|
| GET | /api/admin/products | List (with pagination + search) |
| POST | /api/admin/products | Create |
| PUT | /api/admin/products/[id] | Update |
| DELETE | /api/admin/products/[id] | Delete |

Same pattern for institutions, comments, articles.

All routes verify admin session via shared `requireAdmin()` helper.

All routes validate input with Zod.

## Frontend Pages

Each list page follows the same pattern:
1. Server component fetches data from API (or directly queries PG in server component)
2. Table display with search bar, pagination
3. "New" button → form page or modal
4. Edit/Delete actions per row with confirmation

Admin layout: sidebar navigation + top bar showing admin username.

## Data Migration

`scripts/migrate-to-pg.mjs`:
1. Read all JSON files under `src/data/`
2. Map fields to PG column names (snake_case)
3. INSERT INTO via Drizzle
4. Verify row counts match
5. One-time run before deploying admin

JSON files remain as read-only reference; admin writes go to PG directly.

## What Stays Unchanged

- Public-facing pages (products, institutions, comments, articles) continue reading from JSON files during migration phase.
- After migration is verified, public pages switch to reading from PG.
- Existing auth (user login/register) stays as-is for now.
