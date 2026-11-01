import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/server/auth";
import { UPLOADS_DIR } from "@/lib/server/db";

const MAX_BYTES = 10 * 1024 * 1024;

/** Recognise the image from its first bytes rather than trusting the browser's type. */
function sniff(b: Buffer): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpg";
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return "webp";
  if (b.subarray(0, 3).toString() === "GIF") return "gif";
  if (b.subarray(4, 12).toString() === "ftypavif") return "avif";
  return null;
}

export async function POST(request: NextRequest) {
  if (!verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) {
    return Response.json({ error: "Not signed in." }, { status: 401 });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file received." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Images must be 10 MB or smaller." }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = sniff(bytes);
  if (!ext) return Response.json({ error: "Use a JPG, PNG, WebP, GIF or AVIF image." }, { status: 415 });

  const now = new Date();
  const folder = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const base =
    path
      .parse(file.name)
      .name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "image";
  const name = `${base}-${randomBytes(4).toString("hex")}.${ext}`;
  await mkdir(path.join(UPLOADS_DIR, folder), { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, folder, name), bytes);
  return Response.json({ url: `/media/${folder}/${name}` });
}
