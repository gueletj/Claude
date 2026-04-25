// Drives the running dev server in headless Chrome and saves 5 screenshots.
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const URL = 'http://localhost:5173/';
const OUT = join(process.cwd(), 'screenshots');
mkdirSync(OUT, { recursive: true });

const VIEWPORT = { width: 440, height: 920, deviceScaleFactor: 2 };

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function shot(page, name) {
  // Hide the device frame's outer padding so the screenshot focuses on the phone
  const path = join(OUT, `${name}.png`);
  await page.screenshot({ path, omitBackground: false });
  console.log('saved', path);
}

async function tapByText(page, text) {
  const handle = await page.evaluateHandle((t) => {
    const all = Array.from(document.querySelectorAll('button, [role="button"], a'));
    return all.find(el => (el.textContent || '').trim().toLowerCase().includes(t.toLowerCase()));
  }, text);
  const el = handle.asElement();
  if (!el) throw new Error('Could not find: ' + text);
  await el.click();
  await sleep(900);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await sleep(900);

  // 1) Home screen
  await shot(page, '01-home');

  // 2) Brand Capsules list
  await tapByText(page, 'Capsules');
  await sleep(800);
  await shot(page, '02-capsules');

  // 3) Capsule detail (Milo)
  await tapByText(page, 'Milo');
  await sleep(900);
  await shot(page, '03-capsule-detail');

  // 4) Mood Composer
  await tapByText(page, 'Compose');
  await sleep(900);
  await shot(page, '04-mood-composer');

  // 5) Calendar — navigate back twice then open Calendar
  // Back to Capsule detail then to list
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await sleep(800);
  await tapByText(page, 'Calendar');
  await sleep(900);
  await shot(page, '05-calendar');

  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
