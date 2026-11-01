# Two-Layer Pattern: Company-Only Access + Per-User Identity

A common enterprise ask conflates two concerns:

1. **Perimeter** — the deployed app should be reachable only by company employees.
2. **In-app identity** — the app should tell users apart (per-user data, roles).

These are different layers (see the main skill). Below are the four ways to satisfy them on Netlify, ordered from least to most friction, plus why the naive "stack both" approach forces a double login.

## Option A — Invite-only Netlify Identity (best default for "just my team")

Enable Netlify Identity in **invite-only** registration mode and invite only company addresses. Identity becomes the perimeter *and* the in-app identity: no uninvited user can sign in, and every signed-in user is a real Identity user with `nf_jwt` and roles.

- **Plans:** all (free).
- **Logins:** one.
- **Per-user identity:** full (roles via `app_metadata`, role-based redirects via `nf_jwt`).
- **Tradeoffs:** manual invite management; no automatic provisioning from a corporate directory; relies on invite links not being shared. Great for internal tools and small teams; doesn't scale cleanly to thousands of employees.

## Option B — Auth0 extension (best for a real org with an existing IdP)

Use the Netlify **Auth0 extension** instead of (or alongside) Identity. Configure Auth0 to federate with the company's IdP (Okta, Entra, Google Workspace, etc.). Auth0 enforces "company-only" via its connection/organization settings and supplies per-user identity — in a **single** sign-in.

- **Plans:** Auth0 extension (enterprise-oriented); more setup than Identity.
- **Logins:** one (federated SSO).
- **Per-user identity:** full, from the corporate directory; supports auto-provisioning.
- **Tradeoffs:** more moving parts than Identity; requires Auth0 configuration. This is the path when invite-only Identity won't scale. Configured via the Netlify Auth0 extension — see the Netlify docs setup guide for Auth0.

## Option C — Basic Password Protection + Netlify Identity

Put a shared-password gate in front of the site (Pro+) and run Identity inside for per-user accounts. The password keeps the public out; Identity differentiates users.

- **Plans:** Pro+ for the password gate.
- **Logins:** two (shared password, then Identity) — but the first is a single shared secret, not a per-user login, so it's lighter than Option D.
- **Use when:** "keep the public out while we build" plus real user accounts, without an Enterprise plan.
- **Tradeoffs:** the shared password is not per-user and is easily forwarded; it's a soft gate, not real access control.

## Option D — Enterprise team-login perimeter + Netlify Identity (the genuine two-layer, double login)

Enable Team/Org SAML SSO and Password Protection with **team login** (optionally "Only SSO allowed (strict)"), then run Netlify Identity separately for app sessions.

- **Plans:** Enterprise.
- **Logins:** **two** — the CDN-edge perimeter (company SSO) *and* the app's Identity login.
- **Per-user identity:** full, in-app via Identity.
- **Tradeoffs:** the double login (below) and a hidden seat cost — **team login admits only Netlify team members, so every employee who passes it needs a paid Netlify seat.** Choose this only when a true CDN-edge perimeter is a hard requirement and the double login is acceptable.

## Why the double login can't be wired away (today)

When the perimeter gate and Identity are both active, the two sessions are independent:

- The perimeter (Password Protection / SAML SSO) authenticates a **Netlify team member** and issues its own session (SSO tokens via this path expire after ~1 hour).
- Netlify Identity authenticates an **app end user** and issues the `nf_jwt` cookie.

There is **no documented passthrough** — no shared cookie, no forwarded header, no JWT exchange — that turns "passed the perimeter" into "logged in to the app." A perimeter session also represents *team-member* identity, not an app *end-user* record with `app_metadata.roles`, so even a hypothetical bridge wouldn't cleanly become the app's user.

> An unofficial `netlify/netlify-plugin-identity-sso` repo once attempted a bridge, but it is unofficial, dormant (last release 2021), and hardcoded for `@netlify.com` emails. Don't build on it.

Practical takeaway: if single sign-on matters, pick Option A or B. Don't spend iterations trying to fuse the two layers in Option D — it isn't supported.

## What an agent can and can't see

While writing code, an agent **cannot** read whether Identity is enabled, which OAuth providers are configured, or whether Password Protection / SSO is on — none of it is exposed by the Netlify API, CLI, or MCP server; it lives in the dashboard. The one runtime exception is the live Identity provider list:

```typescript
import { getSettings } from '@netlify/identity'
// Returns autoconfirm, disableSignup, and providers — read this from the running app
const settings = await getSettings()
```

`getSettings()` hits `/.netlify/identity/settings` and works against any origin serving the page — including localhost under `netlify dev`, which proxies to the live service — so it helps the running app render the right buttons. It does not help at authoring time (before the app runs), so ask the user what's already configured rather than guessing, and hand off any dashboard changes with an explicit checklist.
