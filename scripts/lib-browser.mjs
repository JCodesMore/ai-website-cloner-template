// Shared puppeteer harness for animesaga.net cloning
import puppeteer from 'puppeteer';

export const LAUNCH = {
  headless: 'shell',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1440,900'],
};

export async function withPage(fn, { width = 1440, height = 900, url = 'https://animesaga.net' } = {}) {
  const browser = await puppeteer.launch(LAUNCH);
  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // let lazy content settle
    await page.evaluate(async () => {
      await new Promise((r) => {
        let y = 0; const step = 600;
        const t = setInterval(() => { window.scrollBy(0, step); y += step; if (y >= document.body.scrollHeight) { clearInterval(t); r(); } }, 60);
      });
    });
    await new Promise((r) => setTimeout(r, 1200));
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));
    return await fn(page, browser);
  } finally {
    await browser.close();
  }
}
