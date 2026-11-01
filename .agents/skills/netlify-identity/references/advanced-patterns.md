# Advanced Identity Patterns

## Password Recovery

Three-step flow: request recovery email, handle the callback, then set a new password.

```typescript
import { requestPasswordRecovery, handleAuthCallback, updateUser, AuthError } from '@netlify/identity'

// Step 1: Send recovery email
async function handleForgotPassword(email: string) {
  try {
    await requestPasswordRecovery(email)
    showSuccess('Check your email for a password reset link.')
  } catch (error) {
    if (error instanceof AuthError) showError(error.message)
  }
}

// Step 2: handleAuthCallback() returns { type: 'recovery', user } — show password reset form
// (See the handleAuthCallback switch in SKILL.md)

// Step 3: Set new password
async function handlePasswordReset(newPassword: string) {
  try {
    await updateUser({ password: newPassword })
    showSuccess('Password updated.')
  } catch (error) {
    if (error instanceof AuthError) showError(error.message)
  }
}
```

The recovery callback fires a `'recovery'` auth event, not `'login'`. The user is authenticated but should be prompted to set a new password before navigating away.

## Invite Acceptance

When a user clicks an invite link, `handleAuthCallback()` returns `{ type: 'invite', user: null, token }`. Use the token to accept the invite and set a password.

```typescript
import { acceptInvite, AuthError } from '@netlify/identity'

async function handleAcceptInvite(token: string, password: string) {
  try {
    const user = await acceptInvite(token, password)
    showSuccess(`Welcome, ${user.email}! Your account is ready.`)
  } catch (error) {
    if (error instanceof AuthError) showError(error.message)
  }
}
```

## Email Change

When a user verifies an email change, `handleAuthCallback()` returns `{ type: 'email_change', user }` with the change already applied — the returned `user` carries the new email. The user must be logged in when clicking the verification link.

Like recovery (and unlike invite acceptance), there is no token to consume and no follow-up call — `handleAuthCallback()` does the work. Handle it in the `handleAuthCallback()` switch (see SKILL.md) and confirm the new address.

```typescript
// In the handleAuthCallback() switch (see SKILL.md):
case 'email_change':
  showSuccess(`Email updated to ${result.user?.email}`)
  break
```

If you process the verification token yourself instead of letting `handleAuthCallback()` read the URL hash, call `verifyEmailChange(token)` directly — it applies the change and returns the updated user.

## Session Hydration

`hydrateSession()` bridges server-set cookies to the browser session. Call it on page load when using server-side login (e.g., login inside a Netlify Function followed by a redirect).

```typescript
import { hydrateSession } from '@netlify/identity'

const user = await hydrateSession()
if (user) {
  // Browser session is now in sync with server-set cookies
}
```

`getUser()` auto-hydrates from the `nf_jwt` cookie if no browser session exists, so explicit `hydrateSession()` is only needed when you want to restore the full session (including token refresh timers) after a server-side login.

## SSR Integration Patterns

For SSR frameworks, the recommended pattern is:

- **Browser-side** for auth mutations: `login()`, `signup()`, `logout()`, `oauthLogin()`
- **Server-side** for reading auth state: `getUser()`, `getSettings()`, `getIdentityConfig()`

Browser-side auth mutations set the `nf_jwt` cookie and localStorage, and emit `onAuthChange` events. The server reads the cookie on the next request.

The library also supports server-side mutations (`login()`, `signup()`, `logout()` inside Netlify Functions), but these require the Netlify Functions runtime to set cookies. After a server-side mutation, use a full page navigation so the browser sends the new cookie.

Always use `window.location.href` (not framework router navigation) after server-side auth mutations in Next.js, TanStack Start, and SvelteKit. Remix `redirect()` is safe because Remix actions return real HTTP responses.

## Full API Reference

For the complete API reference — all function signatures, type definitions, OAuth helpers, admin operations, session management, auth events, and framework-specific examples — read the package README:

```
node_modules/@netlify/identity/README.md
```

The README is shipped with the npm package and is always in sync with the installed version.
