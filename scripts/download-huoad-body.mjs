// Downloads homepage-body assets from huoad.com CDN into public/images/huoad/.
// Usage: node scripts/download-huoad-body.mjs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "images", "huoad");

const CAT = "https://static.huoad.com/images/";
const files = [
  // category icons (25×25 display, 200×200 natural)
  ["cat/instagram.png", CAT + "nspuq1koftggd1pyvhmtb0rf4.png"],
  ["cat/facebook.png", CAT + "grzr00e1j3qiry1pezgn6ynf0.png"],
  ["cat/tiktok.png", CAT + "kn1x238uojabccf0ielsxuog1.png"],
  ["cat/twitter.png", CAT + "tz264zzpovd22acruol9ak3ap.png"],
  ["cat/telegram.png", CAT + "hr1kypres1uf0vv4tvii22es8.png"],
  ["cat/google.png", CAT + "w48it5wwe4pzok64f9sslvygd.png"],
  ["cat/quora.png", CAT + "dub13hjm5lfyvtlxuhp6axee9.png"],
  ["cat/snapchat.png", CAT + "gcm2x0cdefzlljzoxxtpy409s.png"],
  ["cat/vkontakte.png", CAT + "kksqfup81fs9775rdg37m4hz4.png"],
  ["cat/reddit.png", CAT + "smhw9jxavl7z8l2dmqqc4eu9m.png"],
  ["cat/discord.jpg", CAT + "b7gwo111uyjrdq3e2xo4tcust.jpg"],
  ["cat/appleid.png", CAT + "ntb7x4w8ubq4rxo0ikoousuud.png"],
  ["cat/linkedin.jpeg", CAT + "zuaxg8esr2gw4w4k55gedyp1e.jpeg"],
  ["cat/line.png", CAT + "j0pjle6m5d8htjbtr82gc5iam.png"],
  ["cat/pinterest.png", CAT + "so1c8ifd8to2yoxbfwd9bde9m.png"],
  ["cat/vcc.png", CAT + "ddb5a57ca53a6816705fcca2dfc06b72.png"],
  // product covers (100×100 display, 200×200 natural)
  ["products/ig-1.jpg", CAT + "tydblmfhoeai6l1ts4i6uyuec.jpg"],
  ["products/ig-2.jpg", CAT + "s3u2wjci7gu0qrre4t4m8h82b.jpg"],
  ["products/ig-3.jpg", CAT + "13bfcc854cec2ff1c03eb5bb5c8cfc0c.jpg"],
  ["products/ig-4.jpg", CAT + "k9k67lvxggapb86p0jhtns8gv.jpg"],
  ["products/ig-5.jpg", CAT + "bdc1e584e196e6ca299e54d53a8ebb7e.jpg"],
  ["products/ig-6.jpg", CAT + "1e3ed9e3739467c7c6263adeaa6acdb0.jpg"],
  // floating chat button icon
  ["online-chat.svg", "https://www.huoad.com/_next/static/media/online-chat.00p_-z1kh3v1u.svg"],
];

async function download([dest, url]) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = path.join(ROOT, dest);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, buf);
  console.log(`ok  ${dest}  (${buf.length} bytes)`);
}

const queue = [...files];
const workers = Array.from({ length: 4 }, async () => {
  while (queue.length) await download(queue.shift());
});
await Promise.all(workers);
console.log("done");
