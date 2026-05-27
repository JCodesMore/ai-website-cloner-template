#!/usr/bin/env node

/**
 * compare-pixel.mjs
 *
 * Phase 2a: Pixel-level comparison of captured screenshots.
 * Uses PixelMatch to diff local vs remote screenshots for each product x viewport.
 *
 * Usage: node scripts/compare-pixel.mjs
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CAPTURES_DIR = resolve(ROOT, 'docs/compare/captures');
const RESULTS_DIR  = resolve(ROOT, 'docs/compare/results/pixel');

const LOCAL_DIR  = resolve(CAPTURES_DIR, 'local');
const REMOTE_DIR = resolve(CAPTURES_DIR, 'remote');

const VIEWPORTS = ['desktop', 'mobile'];
const DIFF_THRESHOLD = 0.1;
const FAIL_PCT = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

/** Read PNG as RGBA raw pixel buffer */
async function readPng(filePath) {
  const img = sharp(filePath);
  const metadata = await img.metadata();
  const { data } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, width: metadata.width, height: metadata.height };
}

/** Resize image to match target dimensions (white padding) */
async function resizeToMatch(filePath, targetWidth, targetHeight) {
  const img = sharp(filePath);
  const metadata = await img.metadata();

  if (metadata.width === targetWidth && metadata.height === targetHeight) {
    return await readPng(filePath);
  }

  const resized = await img
    .resize(targetWidth, targetHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  return { data: resized.data, width: resized.width, height: resized.height };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Phase 2a: Pixel Comparison ===');
  ensureDir(RESULTS_DIR);

  const scores = [];

  for (const vp of VIEWPORTS) {
    const localVpDir = resolve(LOCAL_DIR, vp);
    const remoteVpDir = resolve(REMOTE_DIR, vp);

    if (!existsSync(localVpDir) || !existsSync(remoteVpDir)) {
      console.warn(`Skipping viewport ${vp}: missing capture directory`);
      continue;
    }

    const localFiles = readdirSync(localVpDir).filter(f => f.endsWith('.png'));
    console.log(`Processing ${vp} — ${localFiles.length} products`);

    for (const file of localFiles) {
      const productId = basename(file, extname(file));
      const localPath = resolve(localVpDir, file);
      const remotePath = resolve(remoteVpDir, file);

      if (!existsSync(remotePath)) {
        console.warn(`  [skip] ${productId}: no remote capture`);
        continue;
      }

      try {
        const localImg = await readPng(localPath);
        const remoteImg = await readPng(remotePath);

        const targetW = Math.max(localImg.width, remoteImg.width);
        const targetH = Math.max(localImg.height, remoteImg.height);

        const local = await resizeToMatch(localPath, targetW, targetH);
        const remote = await resizeToMatch(remotePath, targetW, targetH);

        const diff = new Uint8ClampedArray(local.data.length);
        const diffPixels = pixelmatch(local.data, remote.data, diff, local.width, local.height, {
          threshold: DIFF_THRESHOLD,
        });

        const totalPixels = local.width * local.height;
        const diffPercent = (diffPixels / totalPixels) * 100;

        const diffImg = await sharp(Buffer.from(diff), {
          raw: { width: local.width, height: local.height, channels: 4 },
        }).png().toBuffer();

        const diffPath = resolve(RESULTS_DIR, `${productId}_${vp}_diff.png`);
        writeFileSync(diffPath, diffImg);

        scores.push({
          productId,
          viewport: vp,
          diffPercent: Math.round(diffPercent * 100) / 100,
          verdict: diffPercent > FAIL_PCT ? 'PIXEL_FAIL' : 'PIXEL_PASS',
        });

        process.stdout.write(`\r  ${vp}: ${productId} — ${diffPercent.toFixed(2)}% diff`);
      } catch (err) {
        console.error(`\n  [error] ${productId} (${vp}): ${err.message}`);
        scores.push({
          productId,
          viewport: vp,
          diffPercent: -1,
          verdict: 'ERROR',
          error: err.message,
        });
      }
    }
    console.log();
  }

  const scorePath = resolve(RESULTS_DIR, 'score.json');
  writeFileSync(scorePath, JSON.stringify(scores, null, 2));

  const passed = scores.filter(s => s.verdict === 'PIXEL_PASS').length;
  const failed = scores.filter(s => s.verdict === 'PIXEL_FAIL').length;
  const errors = scores.filter(s => s.verdict === 'ERROR').length;

  console.log(`\nPixel comparison complete.`);
  console.log(`  Pass: ${passed} | Fail: ${failed} | Error: ${errors}`);
  console.log(`  Scores saved to ${scorePath}`);

  if (errors > 0 || failed > 0) process.exitCode = 1;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
