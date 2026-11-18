// Smoke test after removing the legacy Sasaran 4 internal page.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
    assert.equal(await page.locator('#selectInternalSasaran option[value="4"]').count(), 0);

    await page.locator('#selectInternalSasaran').selectOption('4-dev');
    const state = await page.evaluate(() => ({
      selected: document.querySelector('#selectInternalSasaran').value,
      scope: window.__portalRB.state.internalSasaranId,
      relations: window.__portalRB.filteredRelations().length
    }));
    assert.equal(state.selected, '4-dev');
    assert.equal(state.scope, '4-dev');
    assert(state.relations > 0);

    assert.equal(errors.length, 0, errors.join('\n'));
    console.log(JSON.stringify({ legacyOptionRemoved: true, ...state, javascriptErrors: errors }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
