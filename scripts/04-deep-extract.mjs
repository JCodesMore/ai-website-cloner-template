// Deep computed-style extraction for foundation tokens + component specs
import fs from 'node:fs';
import { withPage } from './lib-browser.mjs';
const OUT_RES = 'docs/research/animesaga.net';

const PROPS = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color','textTransform','backgroundColor','background','padding','margin','width','height','maxWidth','minWidth','display','flexDirection','justifyContent','alignItems','gap','gridTemplateColumns','borderRadius','border','boxShadow','position','top','left','zIndex','opacity','transform','transition','backdropFilter','objectFit'];

await withPage(async (page) => {
  const data = await page.evaluate((props) => {
    const grab = (el) => { if (!el) return null; const cs = getComputedStyle(el); const o = {};
      props.forEach((p) => { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') o[p] = v; }); return o; };
    const q = (s) => grab(document.querySelector(s));
    // find accent green: sample the Watch Now / play button bg
    const greenEls = [...document.querySelectorAll('button,a,span,div')].map((el) => getComputedStyle(el).backgroundColor)
      .filter((c) => { const m = c.match(/rgba?\((\d+), (\d+), (\d+)/); if (!m) return false; const [r,g,b]=[+m[1],+m[2],+m[3]]; return g > 140 && g > r*1.5 && g > b*1.4; });
    const accentCounts = {}; greenEls.forEach((c) => accentCounts[c] = (accentCounts[c]||0)+1);
    return {
      navbar: q('[class*="Navbar"][class*="navbar"]'),
      searchInput: q('input'),
      hero: q('[class*="Hero"][class*="section"]'),
      heroTitle: q('[class*="Hero"] h1, [class*="Hero"] img'),
      rowSection: q('[class*="AnimeRow"][class*="section"]'),
      rowHeading: q('[class*="AnimeRow"] h2'),
      card: q('[class*="carouselWrapper"] a, [class*="carouselWrapper"] > div > div'),
      footer: q('[class*="Footer"][class*="footer"]'),
      accentCandidates: Object.entries(accentCounts).sort((a,b)=>b[1]-a[1]).slice(0,6),
    };
  }, PROPS);
  fs.writeFileSync(`${OUT_RES}/component-styles.json`, JSON.stringify(data, null, 2));
  console.log('ACCENT GREEN candidates:', JSON.stringify(data.accentCandidates));
  console.log('NAVBAR:', JSON.stringify(data.navbar));
  console.log('HERO:', JSON.stringify(data.hero));
  console.log('ROW HEADING:', JSON.stringify(data.rowHeading));
  console.log('CARD:', JSON.stringify(data.card));
  console.log('FOOTER:', JSON.stringify(data.footer));
}, { width: 1440, height: 900 });
