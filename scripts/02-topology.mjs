// Map page section topology + capture per-section screenshots
import fs from 'node:fs';
import { withPage } from './lib-browser.mjs';

const OUT_REF = 'docs/design-references/animesaga.net';
const OUT_RES = 'docs/research/animesaga.net';

await withPage(async (page) => {
  const topo = await page.evaluate(() => {
    const vw = window.innerWidth;
    // Collect meaningful block-level regions: header, nav, main direct children, sections, footer
    const roots = [...document.querySelectorAll('body > *, header, nav, main, footer, main > *, [class*="section"], [class*="row"], [class*="hero"], [class*="carousel"]')];
    const seen = new Set();
    const out = [];
    for (const el of roots) {
      const r = el.getBoundingClientRect();
      if (r.width < vw * 0.4 || r.height < 40) continue; // only wide blocks
      const key = Math.round(r.top) + ':' + Math.round(r.height) + ':' + el.tagName;
      if (seen.has(key)) continue; seen.add(key);
      const cs = getComputedStyle(el);
      out.push({
        tag: el.tagName.toLowerCase(),
        classes: (el.className?.toString?.() || '').slice(0, 120),
        top: Math.round(r.top + window.scrollY), height: Math.round(r.height),
        position: cs.position, zIndex: cs.zIndex, display: cs.display,
        bg: cs.backgroundColor,
        childCount: el.children.length,
        textPreview: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90),
      });
    }
    return out.sort((a, b) => a.top - b.top);
  });
  fs.writeFileSync(`${OUT_RES}/topology.json`, JSON.stringify(topo, null, 2));
  console.log('SECTIONS (' + topo.length + '):');
  topo.forEach((s, i) => console.log(
    `#${i} y=${s.top} h=${s.height} <${s.tag}> pos=${s.position} z=${s.zIndex} ch=${s.childCount} | ${s.classes.slice(0,50)} | "${s.textPreview.slice(0,55)}"`));

  // sticky/fixed overlays
  const fixed = await page.evaluate(() => [...document.querySelectorAll('*')]
    .filter((el) => ['fixed', 'sticky'].includes(getComputedStyle(el).position) && el.getBoundingClientRect().width > 200)
    .map((el) => ({ tag: el.tagName.toLowerCase(), cls: (el.className?.toString?.() || '').slice(0, 80),
      pos: getComputedStyle(el).position, z: getComputedStyle(el).zIndex })).slice(0, 15));
  console.log('\nFIXED/STICKY:', JSON.stringify(fixed, null, 2));
}, { width: 1440, height: 900 });
