# Admin Auth Security Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three security issues in admin auth: server-side session invalidation, login-page redirect, and CSRF protection.

**Architecture:** Add module-level `minValidIssuedAt` timestamp to `admin-auth.ts` — token's `iat` field is checked against this on every request. Expose `invalidateAllSessions()` for login/logout routes to call. Wire up existing `checkCsrf()` to auth routes. Add session redirect to login page.

**Tech Stack:** Next.js App Router, cookie-based session (SHA256 HMAC), existing utilities.

**Files modified:**
- `src/lib/admin-auth.ts`
- `src/app/api/admin/auth/login/route.ts`
- `src/app/api/admin/auth/logout/route.ts`
- `src/app/admin/login/page.tsx`

---

### Task 1: Server-side session invalidation in admin-auth.ts

**File:** `src/lib/admin-auth.ts`

- [ ] **Step 1: Add `minValidIssuedAt` and `invalidateAllSessions`**

Add module-level variable and exported function after the existing `const ADMIN_SESSION`:

```ts
// Earliest allowed token issuance timestamp (ms). Set to now on module load.
// Tokens with iat older than this are rejected.
let minValidIssuedAt = Date.now();

/** Invalidate all existing sessions by advancing the minimum-valid-iat. */
export function invalidateAllSessions(): void {
  minValidIssuedAt = Date.now();
  void auditLog("sessions_invalidated", `minValidIssuedAt=${minValidIssuedAt}`);
}
```

- [ ] **Step 2: Add `iat` check to `requireAdmin`**

Modify the existing `requireAdmin` function to parse `iat` from the token payload and reject tokens issued before `minValidIssuedAt`:

```ts
export async function requireAdmin(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION)?.value;
    if (!token) return null;
    const payload = verify(token);
    if (!payload) return null;
    const parts = payload.split(":");
    const username = parts[0];
    const iat = parseInt(parts[1], 10);
    // Reject if token was issued before the last invalidation
    if (isNaN(iat) || iat < minValidIssuedAt) return null;
    return username === process.env.ADMIN_USERNAME ? username : null;
  } catch { return null; }
}
```

- [ ] **Step 3: Run build check**

```bash
npm run typecheck
```

Expected: no type errors. If the `auditLog` async call inside a sync function is an issue, make `invalidateAllSessions` async or use `void auditLog(...)`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/admin-auth.ts
git commit -m "fix: add server-side session invalidation via minValidIssuedAt"
```

---

### Task 2: Wire up invalidateAllSessions and CSRF in login route

**File:** `src/app/api/admin/auth/login/route.ts`

- [ ] **Step 1: Update imports and add `checkCsrf` + `invalidateAllSessions` calls**

Add two new imports at the top:

```ts
import { validateAdminCredentials, auditLog, invalidateAllSessions } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/api-utils";
```

Remove the now-duplicated `getSecret()` function and the inline signing logic — it will be replaced by calling `invalidateAllSessions()` which doesn't directly sign. Wait, actually the login route has its own `getSecret()` and HMAC signing for token generation. That's separate from `invalidateAllSessions`. I should NOT remove the signing — that's the token creation. I just add `invalidateAllSessions()` call and `checkCsrf()`.

Update the `POST` function. Add CSRF check at the top, and call `invalidateAllSessions()` after successful credential validation:

```ts
export async function POST(request: Request) {
  // CSRF check
  const csrfCheck = checkCsrf(request as any);
  if (csrfCheck) return csrfCheck;

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rl = rateLimit(`admin-login:${ip}`, 5, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: "请求过于频繁，请稍后再试" }, { status: 429 });

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ ok: false, error: "请输入账号和密码" }, { status: 400 });
  }

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: "账号或密码错误" }, { status: 401 });
  }

  // Invalidate all previous sessions before issuing a new token
  invalidateAllSessions();

  const cookieStore = await cookies();
  const payload = `${username}:${Date.now()}`;
  const hmac = createHmac("sha256", getSecret());
  hmac.update(payload);
  const token = `${payload}.${hmac.digest("hex").slice(0, 32)}`;
  cookieStore.set("ymq_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  auditLog("admin_login", `user=${username}`);

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Run build check**

```bash
npm run typecheck
```

Expected: no new type errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/auth/login/route.ts
git commit -m "fix: add CSRF check and session invalidation to login route"
```

---

### Task 3: Wire up invalidateAllSessions and CSRF in logout route

**File:** `src/app/api/admin/auth/logout/route.ts`

- [ ] **Step 1: Update imports and add checks**

Replace entire file content:

```ts
import { clearAdminSession, invalidateAllSessions } from "@/lib/admin-auth";
import { checkCsrf } from "@/lib/api-utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const csrfCheck = checkCsrf(request as any);
  if (csrfCheck) return csrfCheck;

  invalidateAllSessions();
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Run build check**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/auth/logout/route.ts
git commit -m "fix: add CSRF check and session invalidation to logout route"
```

---

### Task 4: Redirect authenticated users from login page

**File:** `src/app/admin/login/page.tsx`

- [ ] **Step 1: Add session check useEffect**

Add `useEffect` to existing imports and component:

```tsx
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.username) {
          router.replace("/admin");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f6f8" }}>
        <p style={{ color: "#999", fontSize: 14 }}>检查登录状态...</p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // ... existing handleSubmit unchanged
  }

  // ... existing return/JSX unchanged
}
```

The `checking` state prevents the form from flashing before the session check completes.

- [ ] **Step 2: Run build check**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/login/page.tsx
git commit -m "fix: redirect already-logged-in users from login page to dashboard"
```

---

### Task 5: End-to-end smoke test

- [ ] **Step 1: Start dev server**

```bash
bun run dev -p 3002
```

- [ ] **Step 2: Test login redirect**

Open `http://localhost:3002/admin/login` — should show "检查登录状态..." then show the login form.

- [ ] **Step 3: Test successful login**

Log in with valid credentials. Should redirect to `/admin`.

- [ ] **Step 4: Test session persistence**

Refresh the page while on `/admin`. Should stay logged in (layout checks `/api/admin/auth/me`).

- [ ] **Step 5: Test login redirect when already logged in**

Open `http://localhost:3002/admin/login` in a new tab. Should immediately redirect to `/admin`.

- [ ] **Step 6: Test logout**

Click "退出登录" in sidebar → confirm → should redirect to login page.

- [ ] **Step 7: Test token invalidation after logout**

After logout, manually go to `http://localhost:3002/admin`. Should redirect to login.

- [ ] **Step 8: Test re-login invalidates old session**

Login → get a session token. Logout → login again with browser dev tools verifying the cookie was replaced. (Old cookie value is now invalid even if preserved.)

- [ ] **Step 9: Commit any final tweaks**

```bash
git add -A
git commit -m "chore: final adjustments after smoke test"
```
