# File Uploads via MCP

When a tool needs the agent to supply a file — an image to post, a document to attach — **don't** push the bytes through the tool call. Base64 in a tool argument bloats the model's context, is slow, and hits payload limits. Instead, hand the agent a short-lived **presigned URL** it can `PUT` raw bytes to, then reference the stored file by a stable key in your other tools. Files land in [Netlify Blobs](../../netlify-blobs/SKILL.md).

## The three-step flow

1. **`prepare_upload`** (tool) — the agent declares `filename`, `contentType`, and `size`. You return a short-lived signed URL (≈5 min, single-use) plus an opaque `uploadHandle`. The signature *is* the authorization, so the `PUT` itself needs no bearer header.
2. **Agent `PUT`s the raw bytes** to that URL with the matching `Content-Type`. A second Netlify Function (e.g. `path: "/mcp/upload/:token"`) verifies the signed token, checks the declared content-type and size, and writes the bytes to Blobs.
3. **`finalize_upload`** (tool) — the agent passes the `uploadHandle` back; you confirm the bytes landed and return a stable **blob key**. That key is what the agent then passes to `create_post`, `attach_file`, etc.

This keeps large binaries entirely out of the JSON-RPC channel, and the short single-use URL means a leaked link is near-useless.

## Signing the URL

Sign a small payload (upload id, content-type, size cap, expiry) with HMAC-SHA256 using a secret env var, and verify in constant time on the `PUT`. Never trust an unsigned upload path — without the signature, anyone could write to your store.

```typescript
import { createHmac, timingSafeEqual } from "node:crypto";

const secret = () => Netlify.env.get("MCP_UPLOAD_SIGNING_SECRET")!;

export function signUploadToken(payload: object): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyUploadToken(token: string) {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", secret()).update(body).digest();
  const got = Buffer.from(sig, "base64url");
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString());
  if (Math.floor(Date.now() / 1000) > payload.exp) return null; // expired
  return payload;
}
```

## Guardrails on the PUT endpoint

- **Reject mismatched `Content-Type` or oversize bodies** against what `prepare_upload` declared — don't let the actual upload exceed the cap the signature was issued for.
- **Enforce single-use** by tracking the upload's status (e.g. `pending → uploaded → finalized`) so the same signed URL can't be replayed. Keep that status in a **durable store** (Netlify Blobs or your database), never a module-level in-memory `Set`/`Map` — function instances don't share memory, so an in-memory guard silently lets replays through on another instance.
- **Validate before storing**, then write to Blobs with the content-type as metadata so you can serve it back correctly later.

## Returning files to the agent

To let a tool hand an image *back* to the model, fetch it from Blobs and return it as image content (`{ type: "image", data: <base64>, mimeType }`) — fine for the occasional read. Don't stream large or many files this way; for anything substantial, return a URL the user/agent can open instead.
