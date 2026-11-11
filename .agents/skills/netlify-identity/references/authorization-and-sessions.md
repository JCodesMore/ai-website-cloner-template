# Netlify Identity — authorization and session gotchas

Where role-based access actually gets enforced, and why a role change doesn't take effect immediately.

## Admin operations run only in the Functions runtime

Identity's admin API — creating users, updating a user's roles or metadata, deleting users (the `admin.*` operations) — requires a privileged admin token that is available **only in the Netlify Functions runtime**. It is not exposed to browser code and is not available in Edge Functions. Do all role assignment and user administration from inside a modern v2 Function (or an Identity event function), never from the client and never from an edge function. A "promote this user to admin" button in the UI must call a Function endpoint that performs the change server-side — it cannot call the admin API directly from the browser.

You don't configure or read the admin token yourself — the Netlify Functions runtime provides it automatically to `admin.*` calls made inside a Function, so there is no env var to set and no `Netlify.env.get(...)` to call for it. Run the `admin.*` operations server-side in a Function; never hardcode an admin token, ship one in the client bundle, or expose the admin operations to the browser. Exposing an admin capability client-side would let any visitor grant themselves the `admin` role.

## Redirect gating only covers CDN document requests

`conditions = { Role = [...] }` redirects are enforced by the CDN **only when it serves a document (navigation) request** — a fresh HTTP request for the path. They are a coarse page-level perimeter, not real authorization:

- **SPA client-side navigation bypasses them.** When a client-side router (React, Vue, SvelteKit, etc.) navigates to `/admin` in the browser, no new document request reaches the CDN, so the redirect rule never runs and the route renders regardless of the user's role.
- **Anything in the client bundle is downloadable by anyone.** Role-gated content compiled into the JavaScript bundle ships to every visitor who can load the page; hiding a component behind a client-side role check does not protect the data inside it.

So use redirect gating for coarse routing only. Enforce anything sensitive **server-side on every request** — a Netlify Function (or the API it calls) that resolves the user with `getUser()` and checks the server-controlled `app_metadata.roles` — never a client-side route guard or a hidden UI element as the only gate.

## Role changes don't affect live sessions until the JWT refreshes

Roles are baked into the `nf_jwt` when the token is issued, and that JWT stays valid until it expires (about an hour). Changing a user's roles — via the dashboard, the admin API, or an Identity event function — does **not** update tokens already held by signed-in users. A user you just promoted keeps seeing the old view, and a user whose role you just revoked keeps their access, until their token refreshes (`AUTH_EVENTS.TOKEN_REFRESH`) or they log out and log back in. Both redirect `Role` conditions and function-side `app_metadata.roles` checks read the current token, so both see the stale roles until then.

Don't expect a role change to take effect mid-session. When it needs to apply right away, direct the user to log out and back in (or otherwise refresh their token) so a new `nf_jwt` carrying the updated roles is issued.
