import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const origin = 'http://127.0.0.1:8765';
const browser = await chromium.launch({ headless: true });
async function inspect(stage) {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    return route.abort('blockedbyclient'); // No production/API requests or telemetry.
  });
  const page = await context.newPage();
  const errors = [];
  let extractedScriptOK = false;
  page.on('pageerror', error => errors.push(String(error.message)));
  page.on('response', response => {
    if (response.url().includes('/branch/assets/js/app.js') && response.ok()) extractedScriptOK = true;
  });
  const response = await page.goto(origin + '/' + stage + '/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert.ok(response && response.ok(), stage + ': index failed to load');
  await page.waitForTimeout(2500);
  const ui = await page.evaluate(() => {
    const tidy = value => String(value || '').replace(/\s+/g, ' ').trim();
    const texts = selector => [...document.querySelectorAll(selector)].map(node => tidy(node.textContent)).filter(Boolean);
    return {
      title: document.title,
      headings: texts('h1,h2,h3'),
      formCount: document.querySelectorAll('form').length,
      inputCount: document.querySelectorAll('input').length,
      selectCount: document.querySelectorAll('select').length,
      textareaCount: document.querySelectorAll('textarea').length,
      buttonLabels: texts('button'),
      labelTexts: texts('label').slice(0, 120),
      linkCount: document.querySelectorAll('a[href]').length,
      visibleTextSample: tidy(document.body?.innerText).slice(0, 2500)
    };
  });
  const themeLocator = page.locator('#themeToggle, #themeSwitch, #themeBtn, [data-theme-toggle]').first();
  let theme = null;
  if (await themeLocator.count() && await themeLocator.isVisible()) {
    await themeLocator.click({ timeout: 3000 });
    theme = await page.evaluate(() => ({
      htmlClass: document.documentElement.className,
      bodyClass: document.body.className,
      htmlTheme: document.documentElement.getAttribute('data-theme'),
      bodyTheme: document.body.getAttribute('data-theme')
    }));
  }
  await context.close();
  return { ui, errors: errors.sort(), theme, extractedScriptOK };
}
try {
  const before = await inspect('main');
  const after = await inspect('branch');
  assert.ok(after.extractedScriptOK, 'extracted app.js did not load');
  assert.deepEqual(after.ui, before.ui, 'UI changed compared with main');
  assert.deepEqual(after.errors, before.errors, 'new JavaScript errors versus main');
  assert.deepEqual(after.theme, before.theme, 'theme interaction changed');
  console.log('PASS: browser E2E baseline parity, blocked external traffic, script load and theme smoke');
} finally {
  await browser.close();
}
