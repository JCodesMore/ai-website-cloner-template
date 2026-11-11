import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/server/db";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

/** Serves images uploaded in the admin (stored under DATA_DIR/uploads, outside the build). */
export async function GET(_request: Request, ctx: RouteContext<"/media/[...path]">) {
  const { path: parts } = await ctx.params;
  if (parts.some((p) => !/^[a-z0-9][a-z0-9._-]*$/i.test(p) || p.includes(".."))) {
    return new Response("Not found", { status: 404 });
  }
  const file = path.join(UPLOADS_DIR, ...parts);
  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(UPLOADS_DIR + path.sep)) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
