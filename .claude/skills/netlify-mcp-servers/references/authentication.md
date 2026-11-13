# MCP Server Authentication

Two models. Pick based on **who calls the server**. Both put `Authorization: Bearer <token>` on every request and 401 anything that fails.

## Model 1 — single shared secret (personal / single-user)

One token in an env var, compared in constant time. This is the whole thing — see `checkBearer` in the main SKILL. Generate with `openssl rand -hex 32`, store as a secret env var, hand the same token to your one client. To rotate or revoke: set a new value and update the client.

Use this when the server is just for you (or one trusted script). Don't reach for anything heavier than this until you actually have multiple users.

## Model 2 — per-user API keys (multi-user)

Each person authenticates as themselves with their own revocable key. Netlify Identity protects a web UI where users mint keys; the MCP endpoint itself is authenticated by the key, not by an Identity session (agents have no browser cookie). The two systems are separate on purpose.

Store keys in [Netlify Database](../../netlify-database/SKILL.md). The essential rules:

- **Never store the plaintext key.** Store a SHA-256 hash plus a short non-secret prefix for display.
- **Show the plaintext exactly once**, at creation. If the user loses it, they mint a new one.
- **Tie each key to a user** and support **revocation** (soft-delete) so a leaked key is killable without touching others.

A workable row shape:

```text
api_keys
  id          uuid
  user_email  text        -- who this key acts as
  label       text        -- "laptop", "ci", etc.
  prefix      text        -- first ~11 chars, safe to display
  key_hash    text unique -- sha256(plaintext), hex
  created_at  timestamptz
  last_used_at timestamptz
  revoked_at  timestamptz -- null = active
```

### Generate

```typescript
import { createHash, randomBytes } from "node:crypto";

export function generateApiKey() {
  const plaintext = `mk_${randomBytes(24).toString("base64url")}`;
  return {
    plaintext,                                   // return to the user ONCE
    prefix: plaintext.slice(0, 11),              // store + display
    keyHash: createHash("sha256").update(plaintext).digest("hex"), // store
  };
}
```

### Resolve a key to a user on every request

Hash the incoming token and look up an active row. The hash is unique, so a direct lookup is fine; bump `last_used_at` so users can spot stale keys.

```typescript
export async function resolveApiKey(db, plaintext: string) {
  const keyHash = createHash("sha256").update(plaintext).digest("hex");
  const row = await db.findActiveKeyByHash(keyHash); // WHERE key_hash = ? AND revoked_at IS NULL
  if (!row) return null;
  await db.touchKey(row.id); // last_used_at = now()
  return { id: row.id, userEmail: row.user_email };
}
```

In the function: extract the bearer token, `resolveApiKey`, 401 if null, otherwise pass the resolved user into your server so tools act on their behalf:

```typescript
const user = await resolveApiKey(db, token);
if (!user) return new Response("Unauthorized", { status: 401 });
// build the server with { db, user } in scope; tools read user.userEmail
```

This per-request **user context** is the whole point of the model: a tool that creates a record stamps `user.userEmail` as the author; a tool that lists records can scope to the caller. Stamp the acting user on writes so you have an audit trail.

### Key management UI

Behind Identity-gated routes (`@netlify/identity` — see the **netlify-identity** skill), give users:

- **Create** — `POST` with a label → returns the plaintext **once**; show it with a copy button and a "you won't see this again" note.
- **List** — show `label`, `prefix`, `last_used_at`; never the key.
- **Revoke** — `DELETE` sets `revoked_at = now()`, scoped so a user can only revoke **their own** keys (`WHERE id = ? AND user_email = ?`).

### Scoping

The simplest model is all-or-nothing: a valid key can call every tool, as the user it belongs to. Add per-key scopes only when you genuinely need them — e.g. a read-only key. Keep it simple until a real requirement appears — this holds even when you're asked directly for a full RBAC / role-hierarchy design: start simple and add scopes only against a real, named need, not speculatively.
