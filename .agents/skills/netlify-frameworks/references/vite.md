# Vite + React on Netlify

## Setup

> **Check current versions before pinning.** Knowledge cutoffs lag behind npm, and guessing a version tends to fail (`npm install` rejects it, or worse, installs something incompatible). Before pinning `@netlify/vite-plugin`, `vite`, `@vitejs/plugin-react`, or any other package in `package.json`, run `npm view <pkg> version` to get the current `latest`. Or omit explicit pins and let `npm install` pick them up. If that check itself fails (no network, registry unreachable), still don't fall back to a guessed exact pin — install without a version (or with `@latest`) and tell the user live verification wasn't possible so they should confirm the installed versions. Never present an unverified `x.y.z` as the current release.

Install the Netlify Vite plugin as a dev dependency (it's a build/dev-time tool, not a runtime dependency):

```bash
npm install -D @netlify/vite-plugin
```

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import netlify from "@netlify/vite-plugin";

export default defineConfig({
  plugins: [react(), netlify()],
});
```

## What the Plugin Does

- Enables Netlify Functions, Blobs, DB, and environment variables in local dev
- Handles build output for Netlify deployment
- No need for `netlify dev` — run `npm run dev` directly

## SPA Routing

For client-side routing (React Router, etc.), add the catch-all redirect:

```toml
# netlify.toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

## Netlify Functions

Write functions in `netlify/functions/` as usual. The Vite plugin makes them available during local dev at their configured paths.

```typescript
// netlify/functions/api.ts
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  return Response.json({ message: "Hello from API" });
};

export const config: Config = { path: "/api/hello" };
```

## Forms (AJAX Pattern)

Since Vite + React renders forms client-side, include a hidden HTML form for Netlify to detect, and submit via AJAX:

```tsx
// In your React component
function ContactForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    });
  };

  return (
    <form name="contact" method="POST" data-netlify="true" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="contact" />
      {/* fields */}
    </form>
  );
}
```

Also add a hidden form in `index.html`:

```html
<form name="contact" netlify hidden>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message"></textarea>
</form>
```

## Local Dev

```bash
npm run dev   # Uses Vite plugin — Netlify primitives available
```

No `netlify dev` wrapper needed. Functions, Blobs, DB, and environment variables all work.

## Build and Deploy

```toml
# netlify.toml
[build]
command = "npm run build"
publish = "dist"
```
