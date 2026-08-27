import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://handhold.io";
const OUT = "public/sites/handhold-io-1ee60dfc/root-8a5edab2";

const assets = [
  ["/homepage/Alasdair.png", "images/alasdair.png"],
  ["/homepage/Arthur.png", "images/arthur.png"],
  ["/homepage/Anette.png", "images/anette.png"],
  ["/homepage/demo-bot.webp", "images/demo-bot.webp"],
  ["/homepage/demo-orb.webp", "images/demo-orb.webp"],
  ["/homepage/usecase-overlay-qa-1.svg", "images/usecase-overlay-qa-1.svg"],
  ["/homepage/usecase-overlay-qa-2.svg", "images/usecase-overlay-qa-2.svg"],
  ["/homepage/usecase-overlay-qa-3.svg", "images/usecase-overlay-qa-3.svg"],
  ["/homepage/usecase-overlay-demo-1.svg", "images/usecase-overlay-demo-1.svg"],
  ["/homepage/usecase-overlay-demo-2.svg", "images/usecase-overlay-demo-2.svg"],
  ["/homepage/usecase-overlay-demo-3.svg", "images/usecase-overlay-demo-3.svg"],
  ["/homepage/usecase-overlay-onboarding-1.svg", "images/usecase-overlay-onboarding-1.svg"],
  ["/homepage/usecase-overlay-onboarding-2.svg", "images/usecase-overlay-onboarding-2.svg"],
  ["/homepage/usecase-overlay-onboarding-3.svg", "images/usecase-overlay-onboarding-3.svg"],
  ["/homepage/how-to-get-started.png", "images/how-to-get-started.png"],
  ["/homepage/hand-top-left.webp", "images/hand-top-left.webp"],
  ["/homepage/hand-bottom-right.webp", "images/hand-bottom-right.webp"],
  ["/favicon.v2.svg", "images/favicon.svg"],
  ["/favicon.v2.ico", "images/favicon.ico"],
  ["/safari-pinned-tab.v2.svg", "images/safari-pinned-tab.svg"],
  ["/apple-touch-icon.v2.png", "images/apple-touch-icon.png"],
];

async function downloadOne([src, dest]) {
  const url = src.startsWith("http") ? src : BASE + src;
  const destPath = path.join(OUT, dest);
  await mkdir(path.dirname(destPath), { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(destPath, buf);
    console.log(`OK   ${dest} (${buf.length} bytes)`);
  } catch (err) {
    console.error(`FAIL ${dest}: ${err.message}`);
  }
}

async function run() {
  const queue = [...assets];
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (item) await downloadOne(item);
    }
  });
  await Promise.all(workers);
}

run();
