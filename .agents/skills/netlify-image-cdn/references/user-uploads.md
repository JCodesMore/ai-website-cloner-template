# User-Uploaded Images Pipeline

Compose Netlify Functions (upload handler) + Netlify Blobs (storage) + Image CDN (serving/transforming) to build a complete user-uploaded image pipeline.

## Architecture

1. **Upload** — A Netlify Function receives multipart form data, validates, and stores in Blobs
2. **Storage** — Netlify Blobs stores the binary image with metadata
3. **Serve** — A Netlify Function retrieves the blob and serves it at `/uploads/:key`
4. **Transform** — A redirect maps `/img/:key` to `/.netlify/images?url=/uploads/:key` for CDN optimization

## Dependencies

```bash
npm install @netlify/blobs
```

## Upload Handler

```typescript
// netlify/functions/upload.ts
import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const formData = await req.formData();
  const image = formData.get("image") as File;

  if (!image) return Response.json({ error: "No image provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(image.type)) return Response.json({ error: "Invalid type" }, { status: 400 });
  if (image.size > MAX_SIZE) return Response.json({ error: "File too large" }, { status: 400 });

  const extension = image.name.split(".").pop() || "jpg";
  const key = `${randomUUID()}.${extension}`;
  const store = getStore({ name: "images", consistency: "strong" });

  await store.set(key, image, {
    metadata: {
      contentType: image.type,
      originalFilename: image.name,
      uploadedAt: new Date().toISOString(),
    },
  });

  return Response.json({ success: true, key, url: `/img/${key}` });
};

export const config: Config = { path: "/api/upload", method: "POST" };
```

## Serve Handler

```typescript
// netlify/functions/serve-image.ts
import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request, context: Context) => {
  const key = context.params.key;
  const store = getStore({ name: "images", consistency: "strong" });

  const result = await store.getWithMetadata(key, { type: "stream" });
  if (!result) return new Response("Not found", { status: 404 });

  return new Response(result.data, {
    headers: {
      "Content-Type": result.metadata?.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const config: Config = { path: "/uploads/:key" };
```

## CDN Redirect

```toml
# netlify.toml

# Basic optimized URL
[[redirects]]
from = "/img/:key"
to = "/.netlify/images?url=/uploads/:key"
status = 200

# Thumbnail preset
[[redirects]]
from = "/img/thumb/:key"
to = "/.netlify/images?url=/uploads/:key&w=150&h=150&fit=cover"
status = 200

# Hero preset
[[redirects]]
from = "/img/hero/:key"
to = "/.netlify/images?url=/uploads/:key&w=1200&h=675&fit=cover"
status = 200
```

## Client-Side Upload (React Example)

```tsx
function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const { url } = await res.json();
    onUpload(url);
  };

  return <input type="file" accept="image/*" onChange={handleChange} />;
}
```

## Astro Upload (API Route)

```typescript
// src/pages/api/upload.ts
import type { APIRoute } from "astro";
import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const image = formData.get("image") as File;
  if (!image) return new Response("No image", { status: 400 });

  const key = `${randomUUID()}.${image.name.split(".").pop() || "jpg"}`;
  const store = getStore({ name: "images", consistency: "strong" });
  await store.set(key, image, {
    metadata: { contentType: image.type, originalFilename: image.name },
  });

  return redirect(`/gallery?uploaded=${key}`);
};
```

## Key Points

- Always validate file type and size on the server (client validation can be bypassed)
- Use `strong` consistency on Blobs for immediate reads after writes
- The serve handler's `Cache-Control: immutable` means the CDN caches the raw image permanently — Image CDN transformations layer on top
- Without `fm` parameter, Netlify auto-serves AVIF or WebP based on browser support
