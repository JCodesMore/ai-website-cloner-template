import puppeteer from 'puppeteer';
const b = await puppeteer.launch({
  headless: 'shell',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu']
});
const p = await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto('https://animesaga.net', {waitUntil:'networkidle2', timeout:45000});
const title = await p.title();
const info = await p.evaluate(() => ({
  h: document.body.scrollHeight,
  bodyBg: getComputedStyle(document.body).backgroundColor,
  bodyFont: getComputedStyle(document.body).fontFamily,
  imgs: document.querySelectorAll('img').length,
  links: document.querySelectorAll('a').length,
  scripts: document.querySelectorAll('script[src]').length
}));
await p.screenshot({path:'docs/design-references/animesaga.net/smoke-desktop.png', fullPage:false});
console.log('TITLE:', title);
console.log('INFO:', JSON.stringify(info));
await b.close();
console.log('SMOKE OK');
