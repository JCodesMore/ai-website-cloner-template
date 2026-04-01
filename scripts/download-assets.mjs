import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { basename, join, dirname } from "path";

const CONCURRENCY = 4;

const images = [
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/679b87e287adc05bcf330ed3_preloader-circle.webp", name: "preloader-circle.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/67adffc6358805a297d9c000_Frame.webp", name: "blue-blur.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/67f54ef18fdc9ec9836cd548_heroimgnew.webp", name: "hero-image.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/6797d9d5f4cd6297b8725de6_stone-hero.webp", name: "stone-hero.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/67989e709c74971ca63a24d4_mirror.webp", name: "mirror.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/6798b305512bd48671e401f6_border.webp", name: "capabilities-border.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/67c02a0839a023fb310e719a_mobborder.webp", name: "capabilities-border-mobile.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/68012d9c8be55ad39e727f91_project5.webp", name: "project-8.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/68012da8466c7e5c600751df_project6.webp", name: "project-1.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/68012dae1ff818fd6b747019_project8.webp", name: "project-2.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/68012db659a4fa7a3bba811b_project7.webp", name: "project-3.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/68012dbde900ec0d7111e9c5_project1.webp", name: "project-4.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/68012dc53f97262d25c2023a_project2.webp", name: "project-5.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/68012de65dc1bfe348e6e31e_project3.webp", name: "project-6.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/68012ded952101eed410753a_project4.webp", name: "project-7.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/679a233176a06e720b33e915_flowerimage.webp", name: "flower-image.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/679a5f3906eb048b00164535_review-border.webp", name: "review-border.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/679a639edbaf8e27fa7386f9_author-border_mob.webp", name: "author-border-mobile.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/679a60975bd451baf413563e_author-border.webp", name: "author-border.webp" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/679a63e868f8d8d3ff9994df_review-border_mob.webp", name: "review-border-mobile.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/680a750a99a890adaa3d092a_author6.webp", name: "author-1.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/680a74e95fd208b2d6641336_author3.webp", name: "author-2.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/680a74f23bf38cfa68958a4f_author4.webp", name: "author-3.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/680a750137c68e3fa91ee951_author5.webp", name: "author-4.webp" },
  { url: "https://cdn.prod.website-files.com/679a163695df82360ca0d26f/680a753a7bfabc35d6f7d32f_author2.webp", name: "author-5.webp" },
];

const videos = [
  { url: "https://18dccfa619686586.cdn.express/naya/finalrock_output.webm", name: "hero-rock.webm" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3%2F67e2a17041cc3c172863d5a8_naya-blur-transcode.mp4", name: "blur-bg.mp4" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3%2F67e2a17041cc3c172863d5a8_naya-blur-transcode.webm", name: "blur-bg.webm" },
  { url: "https://18dccfa619686586.cdn.express/naya/orch_vid_0001-0085.webm", name: "orchid-video.webm" },
];

const bgImages = [
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3%2F67e2a17041cc3c172863d5a8_naya-blur-poster-00001.jpg", name: "blur-poster.jpg" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/67f3657b59baabea4578d295_noise%20GIF.gif", name: "noise.gif" },
];

const fonts = [
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/679746d009ffc6f5cca76c84_CarlBrown.woff2", name: "CarlBrown.woff2" },
];

const favicons = [
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/6836fa898401ff727ef1a18d_Favicon_small.png", name: "favicon.png" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/6836f9d2acfa10ee5087b513_Favicon.png", name: "apple-touch-icon.png" },
  { url: "https://cdn.prod.website-files.com/679742110fb07950530154b3/683d8a73007113a61ae3aa5c_Opengraph.png", name: "og-image.png" },
];

async function downloadFile(url, destPath) {
  try {
    const dir = dirname(destPath);
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAIL ${res.status}: ${url}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(destPath, buf);
    console.log(`OK: ${destPath} (${(buf.length / 1024).toFixed(1)}KB)`);
    return true;
  } catch (e) {
    console.error(`ERROR: ${url} -> ${e.message}`);
    return false;
  }
}

async function downloadBatch(items, baseDir) {
  let ok = 0, fail = 0;
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(item => downloadFile(item.url, join(baseDir, item.name)))
    );
    ok += results.filter(Boolean).length;
    fail += results.filter(r => !r).length;
  }
  return { ok, fail };
}

async function main() {
  console.log("Downloading assets...\n");

  const results = await Promise.all([
    downloadBatch(images, "public/images").then(r => ({ ...r, type: "images" })),
    downloadBatch(videos, "public/videos").then(r => ({ ...r, type: "videos" })),
    downloadBatch(bgImages, "public/images").then(r => ({ ...r, type: "bg-images" })),
    downloadBatch(fonts, "public/fonts").then(r => ({ ...r, type: "fonts" })),
    downloadBatch(favicons, "public/seo").then(r => ({ ...r, type: "favicons" })),
  ]);

  console.log("\n--- Summary ---");
  for (const r of results) {
    console.log(`${r.type}: ${r.ok} ok, ${r.fail} failed`);
  }
  const totalOk = results.reduce((s, r) => s + r.ok, 0);
  const totalFail = results.reduce((s, r) => s + r.fail, 0);
  console.log(`Total: ${totalOk} ok, ${totalFail} failed`);
}

main();
