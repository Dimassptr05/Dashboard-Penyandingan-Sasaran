// Run with Playwright on NODE_PATH. Optional argument: pre-change baseline JSON.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { pathToFileURL } = require('node:url');

(async () => {
  const baseline = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : null;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
    const sidebarToggle = page.locator('#btnSidebarToggle');
    assert.equal(await sidebarToggle.evaluate(el => el.closest('.breadcrumb-nav-bar') !== null), true);
    await sidebarToggle.click();
    assert.equal(await page.locator('.app-layout').evaluate(el => el.classList.contains('sidebar-hidden')), true);
    assert.equal(await page.locator('#primarySidebar').evaluate(el => getComputedStyle(el).display), 'none');
    assert.equal(await sidebarToggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await sidebarToggle.isVisible(), true);
    await sidebarToggle.click();
    assert.equal(await page.locator('.app-layout').evaluate(el => el.classList.contains('sidebar-hidden')), false);
    assert.equal(await sidebarToggle.getAttribute('aria-expanded'), 'true');
    await page.locator('#selectInternalSasaran').selectOption('4');
    const relations = await page.evaluate(() => window.__portalRB.filteredRelations());
    assert.equal(relations.length, 50);
    if (baseline) assert.deepEqual(relations, baseline.s4);
    const datasetBefore = await page.evaluate(() => JSON.stringify(window.RB_RELASI_INTERNAL));
    await page.locator('#step3Btn').click();
    assert.equal(await page.locator('.btn-action-detail').count(), 50);
    const checked = await page.evaluate(() => {
      const records = window.__portalRB.filteredRelations();
      let matched = 0;
      for (const r of records) {
        document.querySelector(`.btn-action-detail[data-rel-id="${r.id}"]`).click();
        const cards = [...document.querySelectorAll('[data-s4-analysis]')];
        if (cards.map(el => el.dataset.s4Analysis).join() !== 'gpt,gemini') throw new Error('Incorrect provider order');
        const expectedGemini = [r.type, r.reason || 'Keterkaitan substantif terverifikasi.', r.recommendation || r.rekomendasi || 'Rekomendasi belum tersedia.'];
        const gemini = [...cards[1].querySelectorAll('.s4-analysis-field p')].map(el => el.textContent);
        if (JSON.stringify(gemini) !== JSON.stringify(expectedGemini)) throw new Error('Existing analysis changed');
        const match = window.RB_COMPARISON_S4.pairs.find(p => p.source === r.sourceCode && p.target === r.destCode);
        const gpt = match?.gpt || [];
        if (gpt.length) {
          matched++;
          const texts = [...cards[0].querySelectorAll('.s4-analysis-field p')].map(el => el.textContent);
          if (JSON.stringify(texts) !== JSON.stringify(gpt.flatMap(record => [record.type, record.reason, record.recommendation]))) throw new Error('GPT text mismatch');
        } else if (!cards[0].textContent.includes('Tidak ditemukan pada Matriks GPT')) throw new Error('Missing absent-source message');
        if (document.querySelectorAll('#focusRelationCard .compare-col').length !== 2) throw new Error('Indicator cards missing');
      }
      return { checked: records.length, matched, absent: records.length - matched };
    });
    const matchedId = await page.evaluate(() => window.__portalRB.filteredRelations().find(r => window.RB_COMPARISON_S4.pairs.some(p => p.source === r.sourceCode && p.target === r.destCode && p.gpt.length)).id);
    await page.locator(`.btn-action-detail[data-rel-id="${matchedId}"]`).click();
    const [left, right] = await page.evaluate(() => ['gpt', 'gemini'].map(provider => {
      const rect = document.querySelector(`[data-s4-analysis="${provider}"]`).getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width };
    }));
    assert(left.x < right.x && Math.abs(left.y - right.y) < 1 && Math.abs(left.width - right.width) < 1);
    const screenshotDir = path.join(os.tmpdir(), 'rb-comparison-qa');
    fs.mkdirSync(screenshotDir, { recursive: true });
    await page.locator('.s4-analysis-section').screenshot({ path: path.join(screenshotDir, 'internal-s4-two-analyses.png') });
    await page.setViewportSize({ width: 1280, height: 800 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('#btnCloseDetailCard').click();
    assert(!(await page.locator('#focusRelationCard').isVisible()));
    assert.equal(await page.evaluate(() => JSON.stringify(window.RB_RELASI_INTERNAL)), datasetBefore);
    for (const scope of ['5', '3', 'external']) {
      if (scope === 'external') await page.locator('#menuExternal').click();
      else {
        await page.locator('#menuInternal').click();
        await page.locator('#selectInternalSasaran').selectOption(scope);
      }
      await page.locator('#step3Btn').click();
      await page.locator('.btn-action-detail').first().click();
      assert.equal(await page.locator('[data-s4-analysis]').count(), 0);
      if (baseline) {
        const normalize = html => html.replace(/>\s+</g, '><').trim();
        assert.equal(normalize(await page.locator('#focusRelationCard').innerHTML()), normalize(baseline.other[scope]));
      }
    }
    await page.locator('#menuComparisonS4').click();
    assert.deepEqual(await page.locator('.cmp-grand-total .cmp-cell-total span').allTextContents(), ['168', '140']);
    assert.equal(errors.length, 0, errors.join('\n'));
    console.log(JSON.stringify({ ...checked, otherScopesUnchanged: ['3', '5', 'external'], javascriptErrors: errors }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
