// Phase 1 interaction sweep: hover, More Info modal, episode UI, card details
import fs from 'node:fs';
import { withPage } from './lib-browser.mjs';

const OUT_REF = 'docs/design-references/animesaga.net';
const OUT_RES = 'docs/research/animesaga.net';
const findings = {};

await withPage(async (page) => {
  const shot = (n) => page.screenshot({ path: `${OUT_REF}/${n}.png` });

  // --- Card hover state ---
  const cardSel = '[class*="AnimeRow"] [class*="card"], [class*="carouselWrapper"] a, [class*="carouselWrapper"] > div > *';
  const hoverInfo = await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    if (!card) return { error: 'no card' };
    const before = getComputedStyle(card);
    return { classes: card.className?.toString?.() || '', tag: card.tagName,
      transform: before.transform, transition: before.transition, boxShadow: before.boxShadow };
  }, cardSel);
  findings.cardHoverBefore = hoverInfo;

  // --- Open More Info modal (hero button) ---
  let modalOpened = false;
  const buttons = await page.$$('button, a');
  for (const b of buttons) {
    const t = (await page.evaluate((el) => el.textContent?.trim().toLowerCase() || '', b));
    if (t.includes('more info')) {
      await b.click();
      await new Promise((r) => setTimeout(r, 1800));
      modalOpened = true;
      break;
    }
  }
  if (modalOpened) {
    await shot('modal-more-info');
    const modal = await page.evaluate(() => {
      // find the largest dialog/modal-ish element
      const cands = [...document.querySelectorAll('[class*="modal"],[class*="Modal"],[role="dialog"],[class*="overlay"],[class*="Overlay"],[class*="detail"],[class*="Detail"]')]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 400 && r.height > 300; });
      if (!cands.length) return { error: 'no modal found' };
      const el = cands.sort((a, b) => (b.getBoundingClientRect().width * b.getBoundingClientRect().height) - (a.getBoundingClientRect().width * a.getBoundingClientRect().height))[0];
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { classes: el.className?.toString?.() || '', rect: { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) },
        bg: cs.backgroundColor, backdropFilter: cs.backdropFilter, borderRadius: cs.borderRadius, border: cs.border, boxShadow: cs.boxShadow,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 300),
        // enumerate buttons/tabs inside
        controls: [...el.querySelectorAll('button, [class*="tab"], [class*="Tab"]')].slice(0, 25).map((c) => (c.textContent || '').trim().slice(0, 30)).filter(Boolean) };
    });
    findings.moreInfoModal = modal;
    console.log('MODAL:', JSON.stringify(modal, null, 2));

    // --- Look for episode UI inside modal ---
    const epInfo = await page.evaluate(() => {
      const ep = [...document.querySelectorAll('[class*="episode"],[class*="Episode"],[class*="season"],[class*="Season"]')]
        .filter((el) => el.getBoundingClientRect().width > 100);
      if (!ep.length) return { error: 'no episode UI visible' };
      return ep.slice(0, 8).map((el) => ({ cls: el.className?.toString?.().slice(0, 60) || '', tag: el.tagName,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) }));
    });
    findings.episodeUI = epInfo;
    console.log('EPISODE UI:', JSON.stringify(epInfo, null, 2));

    // try clicking an Episodes tab if present
    const tabs = await page.$$('button, [class*="tab"], [role="tab"]');
    for (const tb of tabs) {
      const t = (await page.evaluate((el) => el.textContent?.trim().toLowerCase() || '', tb));
      if (t === 'episodes' || t.includes('episode')) {
        await tb.click();
        await new Promise((r) => setTimeout(r, 1200));
        await shot('modal-episodes');
        console.log('Clicked episodes tab:', t);
        break;
      }
    }
  } else {
    console.log('More Info button not found');
  }
}, { width: 1440, height: 900 });

fs.writeFileSync(`${OUT_RES}/BEHAVIORS.json`, JSON.stringify(findings, null, 2));
console.log('SWEEP COMPLETE');
