// Downloads assets for a single clone into /public/clones/<slug>/.
//
// Reads its asset manifest from docs/research/<slug>/assets.json. The manifest
// has the schema:
//   { slug, origin, assets: [[path, dest], ...], external: [[url, dest], ...] }
// where `path` is relative to `origin` and `dest` is relative to
// `public/clones/<slug>/`.
//
// Usage:
//   node scripts/download-assets.mjs <slug>            # one clone
//   node scripts/download-assets.mjs --all             # every manifest under docs/research/

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const RESEARCH = path.join(ROOT, "docs", "research");
const PUBLIC_CLONES = path.join(ROOT, "public", "clones");

async function loadManifest(slug) {
  const manifestPath = path.join(RESEARCH, slug, "assets.json");
  const raw = await fs.readFile(manifestPath, "utf8").catch(() => null);
  if (!raw) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Manifest at ${manifestPath} is not valid JSON: ${e.message}`);
  }
  if (!json.slug || json.slug !== slug) {
    throw new Error(`Manifest slug "${json.slug}" does not match folder name "${slug}"`);
  }
  if (!json.origin) throw new Error(`Manifest is missing an "origin" URL`);
  return json;
}

async function ensureDir(p) {
  await fs.mkdir(path.dirname(p), { recursive: true });
}

async function downloadOne([src, dest], targetRoot) {
  const target = path.join(targetRoot, dest);
  const stat = await fs.stat(target).catch(() => null);
  if (stat && stat.size > 0) return { skipped: true, dest };

  await ensureDir(target);
  const res = await fetch(src, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  if (!res.ok) return { error: `${res.status} ${res.statusText}`, dest, src };
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(target, buf);
  return { ok: true, dest, size: buf.length };
}

async function batchedRun(items, targetRoot, concurrency = 4) {
  const out = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const slice = items.slice(i, i + concurrency);
    const r = await Promise.allSettled(
      slice.map((item) => downloadOne(item, targetRoot)),
    );
    for (const rr of r) {
      out.push(rr.status === "fulfilled" ? rr.value : { error: String(rr.reason) });
    }
  }
  return out;
}

async function runForSlug(slug) {
  const manifest = await loadManifest(slug);
  const targetRoot = path.join(PUBLIC_CLONES, slug);
  await fs.mkdir(targetRoot, { recursive: true });

  const full = [
    ...(manifest.assets ?? []).map(([p, d]) => [manifest.origin + p, d]),
    ...(manifest.external ?? []),
  ];

  console.log(
    `[${slug}] downloading ${full.length} assets → public/clones/${slug}/`,
  );
  const results = await batchedRun(full, targetRoot);

  let ok = 0,
    skipped = 0,
    errors = 0;
  for (const r of results) {
    if (r.ok) {
      ok++;
      console.log(`  + ${r.dest} (${r.size} bytes)`);
    } else if (r.skipped) {
      skipped++;
    } else if (r.error) {
      errors++;
      console.error(`  ! ${r.dest || r.src} → ${r.error}`);
    }
  }
  console.log(`[${slug}] done. ok=${ok}, skipped=${skipped}, errors=${errors}`);
  return errors;
}

async function listSlugs() {
  const entries = await fs.readdir(RESEARCH, { withFileTypes: true });
  const slugs = [];
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const has = await fs
      .stat(path.join(RESEARCH, ent.name, "assets.json"))
      .catch(() => null);
    if (has) slugs.push(ent.name);
  }
  return slugs;
}

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    const slugs = await listSlugs();
    console.error("Usage: node scripts/download-assets.mjs <slug>");
    console.error("       node scripts/download-assets.mjs --all");
    if (slugs.length) console.error(`\nKnown slugs: ${slugs.join(", ")}`);
    process.exit(2);
  }

  let totalErrors = 0;
  if (arg === "--all") {
    const slugs = await listSlugs();
    for (const slug of slugs) totalErrors += await runForSlug(slug);
  } else {
    totalErrors = await runForSlug(arg);
  }
  if (totalErrors > 0) process.exitCode = 1;
})();
