# Admin Auth Security Fix

## Trigger

Security review of admin login/logout identified three issues:

1. **Cannot invalidate sessions server-side** — token once issued is valid for 24h regardless of password change. No way to force logout.
2. **Login page doesn't redirect authenticated users** — already-logged-in users visiting `/admin/login` see the form instead of being redirected to dashboard.
3. **CSRF check not wired up** — `checkCsrf()` exists in `api-utils.ts` but login/logout routes don't call it.

## Changes

All changes are confined to existing files — no new tables, no new routes, no new infrastructure.

### 1. Server-side session invalidation

**File:** `src/lib/admin-auth.ts`

Add a module-level epoch timestamp `minValidIssuedAt`. When generating a token, embed the current `iat` (issued-at) in the payload. When verifying a token, reject any whose `iat` is older than `minValidIssuedAt`.

```
minValidIssuedAt = Date.now()  // set on module load
                  ↑ resets on every server restart
```

Expose `invalidateAllSessions()` which sets `minValidIssuedAt = Date.now()`. Call it from the login route whenever credentials change (i.e. on every successful login), and from the logout route.

Effect:
- Server restart → all sessions invalidated (re-login required)
- Password change → not a scenario here (env-var based), but the mechanism exists
- Logout → immediately invalidates the token even if the cookie survives

### 2. Login page redirect

**File:** `src/app/admin/login/page.tsx`

Add a `useEffect` that calls `GET /api/admin/auth/me`. If the response contains a `username`, redirect to `/admin` via `router.replace()`. This runs silently before the form renders.

### 3. CSRF check on auth routes

**File:** `src/app/api/admin/auth/login/route.ts` and `logout/route.ts`

Import `checkCsrf` from `@/lib/api-utils` and call it at the top of the POST handler. Return the 403 response if origin/host mismatch.

## Risk

- **Server restart logs everyone out** — intentional. For a single-admin internal system this is acceptable. If it becomes a problem later, switch to database-backed sessions (方案 B).
- **`minValidIssuedAt` is in-memory** — doesn't survive restart. This is by design (restart = clean slate).
- **No multi-instance support** — same limitation as the existing rate limiter. Acceptable for current deployment.

## Scope

Only admin auth. Public-facing user auth (login/register) is untouched.

## Files changed

| File | Change |
|------|--------|
| `src/lib/admin-auth.ts` | Add `minValidIssuedAt`, `invalidateAllSessions()`, embed `iat` in token, check `iat` on verify |
| `src/app/api/admin/auth/login/route.ts` | Call `invalidateAllSessions()` before issuing new token; add `checkCsrf` |
| `src/app/api/admin/auth/logout/route.ts` | Call `invalidateAllSessions()`; add `checkCsrf` |
| `src/app/admin/login/page.tsx` | Add `useEffect` to check existing session and redirect |
