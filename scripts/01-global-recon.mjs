// Phase 1 global reconnaissance: screenshots + asset/font/color/favicon discovery
import fs from 'node:fs';
import { withPage } from './lib-browser.mjs';

const OUT_REF = 'docs/design-references/animesaga.net';
const OUT_RES = 'docs/research/animesaga.net';
fs.mkdirSync(OUT_REF, { recursive: true });
fs.mkdirSync(OUT_RES, { recursive: true });

// Desktop full page
await withPage(async (page) => {
  await page.screenshot({ path: `${OUT_REF}/full-desktop-1440.png`, fullPage: true });
  const data = await page.evaluate(() => {
    const uniq = (a) => [...new Set(a)];
    const imgs = [...document.querySelectorAll('img')].map((img) => ({
      src: img.src || img.currentSrc, alt: img.alt,
      w: img.naturalWidth, h: img.naturalHeight,
      parentClasses: img.parentElement?.className?.toString?.() || '',
      position: getComputedStyle(img).position, zIndex: getComputedStyle(img).zIndex,
    })).filter((i) => i.src);
    const bgs = uniq([...document.querySelectorAll('*')]
      .map((el) => getComputedStyle(el).backgroundImage)
      .filter((b) => b && b !== 'none' && b.includes('url(')))
      .flatMap((b) => [...b.matchAll(/url\(["']?(.*?)["']?\)/g)].map((m) => m[1]));
    const videos = [...document.querySelectorAll('video')].map((v) => ({
      src: v.src || v.querySelector('source')?.src, poster: v.poster,
      autoplay: v.autoplay, loop: v.loop, muted: v.muted,
    }));
    const fonts = uniq([...document.querySelectorAll('h1,h2,h3,h4,h5,p,span,a,button,body,input,div')]
      .slice(0, 400).map((el) => getComputedStyle(el).fontFamily));
    const favicons = [...document.querySelectorAll('link[rel*="icon"],link[rel*="apple-touch"],link[rel*="manifest"]')]
      .map((l) => ({ rel: l.rel, href: l.href, sizes: l.sizes?.toString?.() || '' }));
    const meta = { title: document.title,
      description: document.querySelector('meta[name=description]')?.content || '',
      ogImage: document.querySelector('meta[property="og:image"]')?.content || '' };
    // key element colors
    const grab = (sel) => { const e = document.querySelector(sel); if (!e) return null; const c = getComputedStyle(e);
      return { color: c.color, bg: c.backgroundColor, font: c.fontFamily, size: c.fontSize, weight: c.fontWeight }; };
    const palette = {
      body: grab('body'), h1: grab('h1'), h2: grab('h2'), h3: grab('h3'),
      a: grab('a'), button: grab('button'), header: grab('header'), nav: grab('nav'),
    };
    const scripts = [...document.querySelectorAll('script[src]')].map((s) => s.src);
    const smoothScroll = { lenis: !!document.querySelector('.lenis, [data-lenis]'),
      locomotive: !!document.querySelector('.locomotive-scroll, [data-scroll-container]') };
    return { imgs, bgs, videos, fonts, favicons, meta, palette, scripts, smoothScroll,
      svgCount: document.querySelectorAll('svg').length,
      pageHeight: document.body.scrollHeight };
  });
  fs.writeFileSync(`${OUT_RES}/global-recon.json`, JSON.stringify(data, null, 2));
  console.log('DESKTOP done. imgs:', data.imgs.length, 'bgs:', data.bgs.length,
    'videos:', data.videos.length, 'svgs:', data.svgCount, 'scripts:', data.scripts.length,
    'height:', data.pageHeight);
  console.log('FONTS:', JSON.stringify(data.fonts));
  console.log('PALETTE:', JSON.stringify(data.palette, null, 2));
  console.log('SMOOTH:', JSON.stringify(data.smoothScroll));
  console.log('FAVICONS:', JSON.stringify(data.favicons, null, 2));
}, { width: 1440, height: 900 });

// Mobile full page
await withPage(async (page) => {
  await page.screenshot({ path: `${OUT_REF}/full-mobile-390.png`, fullPage: true });
  console.log('MOBILE screenshot done.');
}, { width: 390, height: 844 });

console.log('RECON COMPLETE');
