---
name: netlify-identity
description: Add user authentication to a Netlify site with @netlify/identity — signup/login/logout, Google/GitHub/GitLab/Bitbucket OAuth, server-side getUser() checks, role-based access control, and Identity event functions. Use it when a task involves adding a login or signup form, gating content to members or roles, "auth middleware" or verifying users in Netlify Functions or Edge Functions, handling OAuth or email-confirmation callbacks, assigning roles at signup, or customizing Identity emails. For locking a whole site to your company or employees-only access, use netlify-access-control instead.
---

# Netlify Identity

Use `@netlify/identity` (npm). For new projects it replaces the legacy `netlify-identity-widget` and `gotrue-js` — do not reach for those.

```bash
npm install @netlify/identity
```

Framework examples (Next.js/Astro/Remix/SvelteKit) and the full API reference are in the [`@netlify/identity` README on npm](https://www.npmjs.com/package/@netlify/identity).

> **Identity does not run under `netlify dev`.** Test all auth flows on a deploy — Deploy Previews work. Local dev will not complete signup/login/OAuth.

> **Identity config is dashboard-only — there is no public API.** Never curl `api.netlify.com` to flip or read Identity settings, never read tokens from local Netlify config, never probe undocumented endpoints. Enable and configure Identity at `https://app.netlify.com/projects/{site_name}/identity`.

> **Never build a from-scratch OAuth flow alongside Identity.** No provider app registration in code, no `client_id`/`secret` in source, no custom callback token exchange. Use `oauthLogin()` + `handleAuthCallback()`. Raw OAuth beside Identity is the most common source of rework.

## Client auth (browser)

```ts
import { signup, login, logout, getUser, oauthLogin, handleAuthCallback } from '@netlify/identity'

// Register — confirmation email sent by default (unless autoconfirm is on)
const user = await signup('jane@example.com', 'securepassword', { full_name: 'Jane Doe' })

// Log in / out
await login('jane@example.com', 'securepassword')
await logout()

// Current user or null
const current = await getUser()
if (current) console.log(`Logged in as ${current.email}`)

// External provider — redirects the browser; provider is one of
// 'google' | 'github' | 'gitlab' | 'bitbucket'
oauthLogin('github')
```

> **`handleAuthCallback()` is mandatory on your landing page.** Without it, OAuth redirects, email-confirmation links, password-recovery links, and invite links never complete. Call it on page load:

```ts
import { handleAuthCallback } from '@netlify/identity'

const result = await handleAuthCallback() // falsy if no token in URL hash
if (result) console.log(result.type, result.user.email) // confirmation | invite | recovery | email change
```

Alternatives for a single token type: `recoverPassword()` (recovery), `acceptInvite()` (invite). Refresh a session with `refreshSession()`.

Don't hard-code which providers exist. Call `getSettings()` at startup and render the signup form and OAuth buttons from what it returns.

## Server-side auth (Netlify Functions & Edge Functions)

Server-side `getUser()`/`login()`/`admin.*` require modern **v2 functions** (`export default`). The v1 `export { handler }` form is not supported.

`getUser()` works in both runtimes. **`admin.*` runs ONLY in Netlify Functions — not the browser, not Edge Functions.**

```ts
// netlify/functions/me.ts — verify user
import { getUser } from '@netlify/identity'
import type { Context } from '@netlify/functions'

export default async (req: Request, context: Context) => {
  const user = await getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })
  return Response.json({ id: user.id, email: user.email })
}
```

Edge Function form is identical but imports `Context` from `@netlify/edge-functions`.

### Role checks

```ts
// netlify/functions/admin-users.ts
import { getUser, admin } from '@netlify/identity'
import type { Context } from '@netlify/functions'

export default async (req: Request, context: Context) => {
  const user = await getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })
  if (!user.roles.includes('admin')) return new Response('Forbidden', { status: 403 })
  const users = await admin.listUsers()
  return Response.json({ users })
}
```

### CSRF: required for server-side auth endpoints

> Any endpoint that runs `login()`, `signup()`, or `logout()` server-side **must** call `verifyRequestOrigin(req)` at the top of the handler. It throws a 403 on origin mismatch.

```ts
// netlify/functions/login.ts
import { login, verifyRequestOrigin } from '@netlify/identity'
import type { Context } from '@netlify/functions'

export default async (req: Request, context: Context) => {
  verifyRequestOrigin(req)
  const { email, password } = await req.json()
  await login(email, password)
  return new Response(null, { status: 302, headers: { Location: '/dashboard' } })
}
```

## Identity event functions

The platform calls your handler when an Identity event occurs. Export a default object with a method per event. File: `netlify/functions/identity.mts`.

> Typed handlers (`UserSignupEvent`, `event.deny()`) require `@netlify/functions` ≥ 5.2.0. Older installs must use the legacy filename convention (`identity-signup.ts`, etc.) — see `references/authorization-and-sessions.md`.

| Handler | Fires when |
|---|---|
| `userValidate` | Signup attempt, before account creation. Block bad signups here. |
| `userSignup` | Signup completes (after email confirmation if enabled). Assign roles, sync, welcome. |
| `userLogin` | User logs in. Track/last-seen/block. |
| `userModified` | Profile updated. |
| `userDeleted` | User deleted (notification only). |

Event `user` fields are camelCase (`appMetadata`, `userMetadata`, `confirmedAt`).

```typescript
// netlify/functions/identity.mts — deny a signup
import type { UserValidateEvent } from "@netlify/functions"

export default {
  userValidate(event: UserValidateEvent) {
    if (!event.user.email?.endsWith("@example.com")) return event.deny()
  },
}
```

```typescript
// netlify/functions/identity.mts — assign roles at signup
import type { UserSignupEvent } from "@netlify/functions"

export default {
  userSignup(event: UserSignupEvent) {
    return { user: { ...event.user, appMetadata: { ...event.user.appMetadata, roles: ["member"] } } }
  },
}
```

- `event.deny()` — rejects the action; end user gets `401`, no observability error. First handler to call it aborts the chain; later subscribers are not invoked. (Legacy filename functions signal denial with a non-2xx `Response` instead.)
- Return `{ user: {...} }` to modify the record before persistence (canonical way to set roles at signup). Roles ride in the JWT, so a role change takes effect on the user's **next login or token refresh, not immediately** — see Roles & the JWT below.
- Background mode: `export const config: Config = { background: true }` — action completes immediately, handler runs async.

## Roles & the JWT

- `user.roles` is read from `app_metadata.roles`, carried in the JWT (cookie `nf_jwt`; refresh via `nf_refresh`).
- `user_metadata` — user-editable profile (`full_name`, `email`). `app_metadata` — app data incl. `roles`, not user-editable.

> **Role changes are NOT immediate.** They take effect on next login or token refresh. Changing roles does not invalidate the current JWT. Force it with `refreshSession()`.

Set roles for existing users via `admin.updateUser()` in a Netlify Function; at signup via the `userSignup` event handler above.

Deep guides for SSR/session hydration and authorization live in `references/advanced-patterns.md` and `references/authorization-and-sessions.md`.

## CDN-edge RBAC (redirect rules)

Enforced at the edge with no origin round trip. A mismatched role gets a 404 unless you add a fallback — **always pair a role-gated rule with a fallback.**

`_redirects`:
```
/admin/*  /admin/:splat  200!  Role=admin
/admin/*  /login         401!
# Multiple roles chained with commas:
/private/* /private/:splat 200! Role=editor,admin
```

`netlify.toml`:
```toml
[[redirects]]
  from = "/admin/*"
  to = "/admin/:splat"
  force = true
  status = 200
  conditions = {Role = ["editor", "admin"]}
```

Use redirect rules for path-based gating; use function-based `user.roles` checks for custom authorization logic.

## Configuration (dashboard-only)

Base: `https://app.netlify.com/projects/{site_name}/identity`. Enable with **Enable Identity**. Identity requires HTTPS — set up SSL before integrating on a custom domain.

- **Registration** (`?tab=registration#registration-preferences`): **Open** (default, anyone can sign up) or **Invite only** (all users, including external-provider logins, must be invited first).
- **Confirmation / autoconfirm** (`?tab=emails#confirmation-template`): check the box to skip email verification.
- **External providers** (`?tab=registration#external-providers`): Google/GitHub/GitLab/Bitbucket. For branded OAuth (your app name instead of "Netlify Identity"), register your app with the provider, get client ID + secret, and enter them **in the Netlify settings UI** — not in code.
- **Invitations** (`?tab=users`): enter addresses to send invites; link carries `invite_token`.
- **Password recovery**: user page → **Send reset password email**; link carries `recovery_token`.

### Emails (Pro plans or higher)

Default sender is `no-reply@netlify.com`. Custom SMTP sender and custom templates both require **Pro plans or higher**.

Template variables (Go syntax): `{{ .Email }}`, `{{ .NewEmail }}` (email-change only), `{{ .SiteURL }}`, `{{ .ConfirmationURL }}`, `{{ .Token }}`.

Custom-link hash fragments per action:
```
{{ .SiteURL }}/path/#invite_token={{ .Token }}
{{ .SiteURL }}/path/#confirmation_token={{ .Token }}
{{ .SiteURL }}/path/#recovery_token={{ .Token }}
{{ .SiteURL }}/path/#email_change_token={{ .Token }}
```

Custom template constraints: inline CSS only; absolute image links; **no `<html>`/`<head>`/`<body>` tags**; ensure your build doesn't alter Go template variables.

### Audit log (Pro plans or higher)

`?tab=audit-log`. Search with a scoped term: `author:[string]` or `action:[string]`. Action names: `login`, `logout`, `user_signedup`, `user_deleted`, `user_modified`, `token_revoked`, `token_refreshed`, `user_recovery_requested`, `user_invited`.

## External JWT providers (Enterprise)

Available on **Enterprise plans**. You may use Netlify Identity OR an external JWT provider — **not both at once**; you cannot authenticate third-party JWTs while Netlify Identity is enabled.

- Roles path: Netlify Identity `app_metadata.roles`; external provider `app_metadata.authorization.roles`. Custom path → contact support.
- JWT header must be `{"alg": "HS256", "typ": "JWT"}` (HS256 required). Payload `exp` is required and must be a future Unix Epoch time.
- Set the JWT secret at `Project configuration > General > Visitor access > JWT secret`. Project-level overrides team-level defaults.

## On failure — stop, don't guess

If callbacks 404, `/.netlify/identity/*` is unreachable, or an OAuth flow never returns: surface the error, the dashboard URL (`https://app.netlify.com/projects/{site_name}/identity`), and the setting to check (registration preference, external provider config, confirmation/autoconfirm). Then stop. Do not invent recovery commands. Remember: Identity does not work under `netlify dev` — confirm you are testing on a deploy.

Site-gating requests ("lock this site to my company", employees-only) route to the netlify-access-control skill first — Identity is the app-level user layer only.

<!-- gap: getSettings() is referenced by house rules for provider discovery but its signature/return shape is not documented in the intermediate. -->

<!-- system: agent-context/identity/system.md — human-owned, merged by ctx-gen; edit system.md, not this section -->
# Netlify house rules (identity)

These are org conventions, not docs facts — merged into the rendered skill by
ctx-gen and never generated. Owned by the skills maintainer.

1. Deep guides live in this skill: `references/advanced-patterns.md`
   (SSR/session hydration) and `references/authorization-and-sessions.md`.
2. Identity does not work under `netlify dev` — test auth flows on deploys
   (Deploy Previews work).
3. Identity configuration has no public API — it is dashboard-only. Never curl
   `api.netlify.com` to flip or inspect Identity settings, never read auth
   tokens from `~/Library/Preferences/netlify/config.json`, never probe for
   undocumented endpoints.
4. On failure (callback 404s, `/.netlify/identity/*` unreachable, OAuth flow
   doesn't return), surface the error, the dashboard URL, and the setting to
   check — then stop. Do not invent recovery commands.
5. Never build a from-scratch third-party OAuth flow when Identity is in play —
   no provider app registration, no `client_id`/`secret` in code, no custom
   callback token exchange. Use `oauthLogin()` + `handleAuthCallback()`;
   raw OAuth beside Identity is the single most common source of rework.
6. Server-side `getUser()`/`login()`/`admin.*` require modern v2 functions
   (`export default`) — v1 `export { handler }` is not supported. Typed
   Identity event handlers (`UserSignupEvent`, `event.deny()`) require
   `@netlify/functions` ≥ 5.2.0; older installs use the legacy filenames.
7. Don't hard-code which auth providers exist — call `getSettings()` at
   startup and render the signup form and OAuth buttons from what it returns.
8. Site-gating requests ("lock this site to my company", employees-only)
   route to the netlify-access-control skill first — Identity is the
   app-level user layer only.
9. Any answer that assigns or changes roles — at signup, via `admin.*`, or in
   the dashboard — must say the change takes effect on the user's next login
   or token refresh, not immediately. Keep that sentence next to the code that
   sets the role, not only in a separate JWT section: an agent answering a
   signup question reads the signup example and stops, and it has shipped
   answers that omit the delay.
