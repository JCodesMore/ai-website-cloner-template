// Downloads all assets from aurora-agency.ovh into public/
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://aurora-agency.ovh';
const ROOT = path.resolve(process.cwd(), 'public');

const fonts = [
  '/_nuxt/AlmarenaDisplayBold.B_zlv4U7.woff2',
  '/_nuxt/AlmarenaDisplayBold.DCayyQ7B.woff',
  '/_nuxt/AlmarenaDisplayRegular.xDodwvgA.woff2',
  '/_nuxt/AlmarenaDisplayRegular.DdBge-y8.woff',
  '/_nuxt/AlmarenaDisplayLight.DGJenzB8.woff2',
  '/_nuxt/AlmarenaDisplayLight.B2fKJkNu.woff',
  '/_nuxt/AlmarenaMonoDisplayBold.BbrPqgE4.woff2',
  '/_nuxt/AlmarenaMonoDisplayBold.DsyVlPh2.woff',
  '/_nuxt/AlmarenaMonoDisplayLight.HMkLUMzG.woff2',
  '/_nuxt/AlmarenaMonoDisplayLight.DtYdzxqU.woff',
];

const images = [
  ...Array.from({ length: 17 }, (_, i) => `/images/home_${i}.webp`),
  ...Array.from({ length: 7 }, (_, i) => `/images/realisations/real_${i}_cover.webp`),
  '/_nuxt/map-france-less-dotted.BJ8qf9St.png',
  '/_nuxt/footer-logo.DGEgvHlG.png',
];

const videos = [
  '/videos/95382adb8d674929153e2bf1b15d8793e2e2a275.mp4',
  '/videos/794268a92b521d929c86cc3157aaa02dfd1f49ba.mp4',
  '/videos/82abac7f4ce5dfc470e9d26b11076edb29aede37.mp4',
  '/videos/70118bbbff3f93dc4870e1d8620b411f897711e2.mp4',
  '/videos/54ddd736eb805dd0cc687c36e16ffed2a96a413d.mp4',
  '/videos/6b41749645d966da9e26fd7de220fbbf92d9d00e.mp4',
];

const seo = [
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  '/og.jpg',
];

// Map remote path -> local destination
const jobs = [
  ...fonts.map(p => ({ url: BASE + p, dest: path.join(ROOT, 'fonts', path.basename(p)) })),
  ...images.map(p => ({ url: BASE + p, dest: path.join(ROOT, p.replace('/_nuxt/', '/images/')) })),
  ...videos.map(p => ({ url: BASE + p, dest: path.join(ROOT, p) })),
  ...seo.map(p => ({ url: BASE + p, dest: path.join(ROOT, 'seo', path.basename(p)) })),
];

async function downloadOne({ url, dest }) {
  try {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    try { await fs.access(dest); console.log('skip ', path.relative(ROOT, dest)); return; } catch {}
    const res = await fetch(url);
    if (!res.ok) { console.error('FAIL', res.status, url); return; }
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    console.log('ok   ', path.relative(ROOT, dest), `(${buf.length} bytes)`);
  } catch (e) {
    console.error('ERR  ', url, e.message);
  }
}

async function runBatched(items, n) {
  const queue = [...items];
  const workers = Array.from({ length: n }, async () => {
    while (queue.length) await downloadOne(queue.shift());
  });
  await Promise.all(workers);
}

await runBatched(jobs, 6);
console.log('done.');
