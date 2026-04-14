// Download HBO Max help center assets (fonts, icons, favicon)
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const assets = [
  // Fonts
  ['https://help.hbomax.com/fonts/HandsetSansUI-Regular.woff2', 'public/fonts/HandsetSansUI-Regular.woff2'],
  ['https://help.hbomax.com/fonts/HandsetSansUI-Bold.woff2', 'public/fonts/HandsetSansUI-Bold.woff2'],
  // Favicon
  ['https://help.hbomax.com/images/hbo-max-favicon.ico', 'public/seo/favicon.ico'],
  // Icons
  ['https://help.hbomax.com/images/icons/NEW_HBO_Max_Logo_Pure_White.svg', 'public/icons/hbo-max-logo-white.svg'],
  ['https://help.hbomax.com/images/icons/world_fff.svg', 'public/icons/world.svg'],
  ['https://help.hbomax.com/images/icons/close-x.svg', 'public/icons/close-x.svg'],
  ['https://help.hbomax.com/images/icons/info_icon_new.svg', 'public/icons/info.svg'],
  ['https://help.hbomax.com/images/icons/search-default.svg', 'public/icons/search.svg'],
  ['https://help.hbomax.com/images/icons/back-to-top-v2.svg', 'public/icons/back-to-top.svg'],
  ['https://help.hbomax.com/images/icons/getstarted_v2.svg', 'public/icons/getstarted.svg'],
  ['https://help.hbomax.com/images/icons/watchmax_v2.svg', 'public/icons/watchmax.svg'],
  ['https://help.hbomax.com/images/icons/accountsignin_v2.svg', 'public/icons/accountsignin.svg'],
  ['https://help.hbomax.com/images/icons/billingsubscription_v2.svg', 'public/icons/billingsubscription.svg'],
  ['https://help.hbomax.com/images/icons/twitter-logo.svg', 'public/icons/twitter.svg'],
];

async function downloadOne([url, dest]) {
  const outPath = path.join(root, dest);
  await mkdir(path.dirname(outPath), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${res.status} ${url}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(outPath, buf);
  console.log(`OK ${dest} (${buf.length} bytes)`);
  return true;
}

async function batch(list, size) {
  for (let i = 0; i < list.length; i += size) {
    const chunk = list.slice(i, i + size);
    await Promise.all(chunk.map(downloadOne));
  }
}

await batch(assets, 4);
console.log('Done.');
