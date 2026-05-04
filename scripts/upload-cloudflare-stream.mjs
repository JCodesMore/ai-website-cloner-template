#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = "/Users/majovega/Desktop/bajablue-videos";
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_STREAM_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
const chunkSize = Number(process.env.CLOUDFLARE_STREAM_CHUNK_SIZE || 50 * 1024 * 1024);

const uploads = [
  ["home-desktop-hero", "public/videos/hero-4k.mp4"],
  ["home-desktop-tours", "public/videos/tours-4k.mp4"],
  ["home-desktop-season", "public/videos/season-4k.mp4"],
  ["gallery-desktop-hero", "public/videos/gallery-4k.mp4"],
  ["about-desktop-hero", "public/videos/about-4k.mp4"],
  ["tours-desktop-hero", "public/videos/tours-page-4k.mp4"],
  ["mobile-home-hero", "public/videos/mobile/home-hero-4k.mp4"],
  ["mobile-tours-proof", "public/videos/mobile/tours-proof-4k.mp4"],
  ["mobile-season-montage", "public/videos/mobile/season-montage-4k.mp4"],
  ["mobile-gallery-montage", "public/videos/mobile/gallery-montage-4k.mp4"],
  ["mobile-about-story", "public/videos/mobile/about-story-4k.mp4"],
  ["mobile-ocean-safari", "public/videos/mobile/ocean-safari-4k.mp4"],
  ["mobile-blue-expedition", "public/videos/mobile/blue-expedition-4k.mp4"],
  ["mobile-master-seafari", "public/videos/mobile/master-seafari-4k.mp4"],
];

function b64(value) {
  return Buffer.from(value).toString("base64");
}

function usage() {
  console.error("Missing Cloudflare credentials.");
  console.error("Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_STREAM_TOKEN, then rerun:");
  console.error("  CLOUDFLARE_ACCOUNT_ID=... CLOUDFLARE_STREAM_TOKEN=... node scripts/upload-cloudflare-stream.mjs");
  process.exit(1);
}

async function createTusUpload(name, size) {
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream?direct_user=true`;
  const metadata = [
    `name ${b64(name)}`,
    `creator ${b64("bajablue")}`,
    `maxDurationSeconds ${b64("3600")}`,
  ].join(",");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Tus-Resumable": "1.0.0",
      "Upload-Length": String(size),
      "Upload-Metadata": metadata,
    },
  });

  if (!response.ok) {
    throw new Error(`Cloudflare TUS create failed for ${name}: ${response.status} ${await response.text()}`);
  }

  const uploadUrl = response.headers.get("location");
  const uid = response.headers.get("stream-media-id") || uploadUrl?.split("/").filter(Boolean).pop();

  if (!uploadUrl) {
    throw new Error(`Cloudflare did not return a TUS upload URL for ${name}.`);
  }

  return { uploadUrl, uid };
}

async function uploadFile(uploadUrl, file, size) {
  let offset = 0;
  let mediaId = null;

  while (offset < size) {
    const end = Math.min(offset + chunkSize, size) - 1;
    const length = end - offset + 1;

    const response = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        "Tus-Resumable": "1.0.0",
        "Upload-Offset": String(offset),
        "Content-Type": "application/offset+octet-stream",
        "Content-Length": String(length),
      },
      body: createReadStream(file, { start: offset, end }),
      duplex: "half",
    });

    if (!response.ok) {
      throw new Error(`Cloudflare TUS upload failed for ${file}: ${response.status} ${await response.text()}`);
    }

    mediaId = response.headers.get("stream-media-id") || mediaId;
    const nextOffset = Number(response.headers.get("upload-offset"));
    offset = Number.isFinite(nextOffset) && nextOffset > offset ? nextOffset : end + 1;
    console.log(`  ${Math.round((offset / size) * 100)}% ${path.basename(file)}`);
  }

  return mediaId;
}

async function main() {
  if (!accountId || !token) usage();

  const manifest = [];

  for (const [name, relativePath] of uploads) {
    const file = path.join(ROOT, relativePath);
    const { size } = await stat(file);
    console.log(`Uploading ${name} (${Math.round(size / 1024 / 1024)} MB)`);

    const created = await createTusUpload(name, size);
    const uploadedMediaId = await uploadFile(created.uploadUrl, file, size);
    const uid = uploadedMediaId || created.uid;

    manifest.push({
      name,
      file: relativePath,
      uid,
      iframe: uid ? `https://iframe.videodelivery.net/${uid}` : null,
      hls: uid ? `https://videodelivery.net/${uid}/manifest/video.m3u8` : null,
      dash: uid ? `https://videodelivery.net/${uid}/manifest/video.mpd` : null,
    });
  }

  const outputDir = path.join(ROOT, "docs/video-hosting");
  await mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "cloudflare-stream-manifest.json");
  await writeFile(outputPath, `${JSON.stringify({ uploadedAt: new Date().toISOString(), manifest }, null, 2)}\n`);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
