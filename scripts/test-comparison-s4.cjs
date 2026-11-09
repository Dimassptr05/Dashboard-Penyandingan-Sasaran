/* Run with NODE_PATH pointing to a Playwright installation. Uses local Chrome. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const repo = path.resolve(__dirname, '..');
  const screenshots = path.join(os.tmpdir(), 'rb-comparison-qa');
  fs.mkdirSync(screenshots, { recursive: true });
  try {
    await page.goto(pathToFileURL(path.join(repo, 'index.html')).href);
    await page.waitForFunction(() => window.__portalRB && window.__comparisonS4);
    const baselineData = await page.evaluate(() => JSON.stringify([window.RB_SASARAN_DATA, window.RB_RELASI_INTERNAL, window.RB_SUBSTANSI_INDIKATOR, window.RB_DATA]));
    const normalizeHTML = html => html.replace(/ style=""/g, ''); // Main resize handler leaves empty inline styles.
    const baselineHTML = normalizeHTML(await page.locator('.main-content:not(.cmp-root)').innerHTML());
    const baselineState = await page.evaluate(() => JSON.stringify(window.__portalRB.state));
    await page.locator('#menuComparisonS4').click();
    assert(await page.locator('#comparisonS4').isVisible());
    assert.deepEqual(await page.locator('[aria-label="Indeks Sumber Perbandingan"] option').allTextContents(), ['KK — Kapabilitas Kelembagaan']);
    assert.equal(await page.locator('[aria-label="Indikator Perbandingan"]').count(), 1);
    assert(!/SS4-/.test(await page.locator('.cmp-filters').innerText()));
    assert.equal(await page.locator('.cmp-cell').count(), 77);
    await page.screenshot({ path: path.join(screenshots, 'matrix.png') });

    // Every matrix cell must route to the same scope and draw only source-backed edges.
    const cellChecks = await page.evaluate(() => {
      const cells = [...document.querySelectorAll('.cmp-cell')].map(el => [el.dataset.source, el.dataset.index]);
      for (const [source, index] of cells) {
        document.querySelector(`.cmp-cell[data-source="${source}"][data-index="${index}"]`).click();
        const expected = window.RB_COMPARISON_S4.pairs.filter(p => window.RB_COMPARISON_S4.scope.sourceIds.includes(p.source) && p.source.slice(0, p.source.lastIndexOf('.')) === source.replace('group:', '') && p.index === index);
        for (const provider of ['gpt', 'claude']) {
          const actual = [...document.querySelectorAll(`[data-provider="${provider}"] [data-edge]`)].map(el => el.dataset.edge).sort();
          const wanted = expected.filter(p => p[provider].length).map(p => p.id).sort();
          if (JSON.stringify(actual) !== JSON.stringify(wanted)) throw new Error(`Edge mismatch: ${source}/${index}/${provider}`);
        }
        document.querySelector('#cmpBack').click();
        document.querySelector('[data-action="reset"]').click();
      }
      return cells.length;
    });
    assert.equal(cellChecks, 77);
    // Clicking the sidebar from a graph or list always starts over at the full matrix.
    for (const stage of ['1', '2']) {
      await page.locator(`.cmp-steps [data-stage="${stage}"]`).click();
      await page.locator('[data-filter="source"]').selectOption('group:SS4-KK.KF.1');
      await page.locator('[data-filter="index"]').selectOption('IPPN');
      await page.locator('#menuComparisonS4').click();
      assert.equal(await page.locator('#comparisonS4').getAttribute('data-comparison-stage'), '0');
      assert.equal(await page.locator('.cmp-cell').count(), 77);
      assert.deepEqual(await page.locator('.cmp-grand-total .cmp-cell-total span').allTextContents(), ['168', '140']);
    }
    const matrixTotals = await page.locator('.cmp-grand-total .cmp-cell-total span').allTextContents();
    assert.deepEqual(matrixTotals, ['168', '140']);
    assert.deepEqual(await page.locator('#cmpSummary strong').allTextContents(), ['168', '140', '14', '154', '126', '294']);
    assert.deepEqual(await page.locator('.cmp-audit-table tbody tr').evaluateAll(rows => rows.map(row => [...row.cells].map(cell => cell.textContent))), [
      ['IPPN', '24', '24', '3'], ['CKKP', '24', '4', '2'], ['SPIP', '24', '34', '6'],
      ['SAKIP', '24', '47', '1'], ['ELPPD', '24', '26', '0'], ['IKPA', '24', '3', '0'], ['IPA', '24', '2', '2']
    ]);
    await page.locator('[data-filter="source"]').selectOption('group:SS4-KK.KF.1');
    await page.locator('.cmp-cell[data-source="group:SS4-KK.KF.1"][data-index="IPPN"]').click();
    await page.locator('#cmpStageTitle').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(screenshots, 'maps.png') });
    assert.equal(await page.locator('[data-provider="gpt"] [data-edge]').count(), 2);
    assert.equal(await page.locator('[data-provider="claude"] [data-edge]').count(), 4);
    assert(!/SS4-/.test(await page.locator('.cmp-maps').innerText()));
    const left = await page.locator('[data-provider="gpt"]').boundingBox();
    const right = await page.locator('[data-provider="claude"]').boundingBox();
    assert(left.x < right.x && Math.abs(left.y - right.y) < 1 && Math.abs(left.width - right.width) < 1);
    await page.locator('[data-provider="claude"] [data-node="SS4-IPPN.1.a.1"]').hover();
    assert(await page.locator('.cmp-dim').count() > 0);
    const edge = page.locator('[data-provider="gpt"] [data-edge]').first();
    await edge.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.cmp-list tbody tr').count(), 1);
    await page.locator('[data-detail]').click();
    assert.equal(await page.locator('#cmpDetail .compare-col').count(), 2);
    assert.match(await page.locator('[data-analysis="claude"]').innerText(), /Tidak ditemukan pada analisis Claude/);
    await page.locator('#cmpBack').click();
    await page.locator('[data-provider="claude"] [data-node="SS4-KK.KF.1.1"]').click();
    assert.equal(await page.locator('.cmp-list tbody tr').count(), 3);

    // Verify all rendered original analyses, both presence cases, ID mapping and classification differences.
    await page.locator('[data-action="reset"]').click();
    const detailChecks = await page.evaluate(() => {
      for (const pair of window.RB_COMPARISON_S4.pairs.filter(p => window.RB_COMPARISON_S4.scope.sourceIds.includes(p.source))) {
        document.querySelector(`[data-detail="${pair.id}"]`).click();
        for (const provider of ['gpt', 'claude']) {
          const values = [...document.querySelectorAll(`[data-analysis="${provider}"] > .compare-info-item .info-val`)].map(el => el.textContent);
          const expected = pair[provider].flatMap(r => [r.type, r.reason, r.recommendation].map(v => v ?? 'Tidak tersedia pada sumber'));
          if (JSON.stringify(values) !== JSON.stringify(expected)) throw new Error(`Verbatim mismatch: ${pair.id}/${provider}`);
        }
        for (const [i, id] of [pair.source, pair.target].entries()) {
          const text = document.querySelectorAll('#cmpDetail .compare-col')[i].textContent;
          for (const [field, value] of window.RB_COMPARISON_S4.indicators[id].fields) {
            const displayed = field.includes('Definisi') ? String(value) : window.RB_UTILS.cleanLabel(String(value));
            if (!text.includes(displayed)) throw new Error(`Missing detail: ${id}/${field}`);
          }
        }
        if (/SS4-/.test(document.querySelector('#cmpDetail').innerText)) throw new Error(`Visible technical code: ${pair.id}`);
      }
      return window.__comparisonS4.filtered().length;
    });
    assert.equal(detailChecks, 294);
    await page.locator('[data-filter="status"]').selectOption('both');
    assert.equal(await page.locator('[data-detail]').count(), 14);
    assert.equal(await page.locator('.cmp-difference').count(), 11);
    assert(await page.locator('.cmp-difference').count() > 0);
    await page.locator('[data-detail]').first().click();
    await page.locator('#cmpDetail').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(screenshots, 'detail.png') });
    await page.locator('.cmp-analysis-title').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(screenshots, 'analysis.png') });
    await page.locator('[data-filter="status"]').selectOption('mapping');
    assert.equal(await page.locator('[data-detail]').count(), 249);
    await page.locator('[data-detail]').first().click();
    assert.match(await page.locator('#cmpDetail').innerText(), /belum dapat dipetakan ke Excel acuan/);
    await page.locator('[data-filter="search"]').fill('no-match-9999999');
    assert.equal(await page.locator('[data-detail]').count(), 0);
    await page.locator('[data-action="reset"]').click();
    await page.locator('[data-filter="type"]').selectOption('Langsung');
    assert.equal(await page.locator('[data-detail]').count(), 61);
    await page.locator('[data-action="reset"]').click();
    await page.locator('.cmp-steps [data-stage="1"]').click();
    assert.equal(await page.locator('[data-provider="gpt"] [data-edge]').count(), 168);
    assert.equal(await page.locator('[data-provider="claude"] [data-edge]').count(), 140);

    // Laptop layout and true zero-source map, plus return navigation.
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.locator('[data-filter="source"]').selectOption('group:SS4-KK.KF.1');
    await page.locator('[data-filter="index"]').selectOption('IKPA');
    assert.equal(await page.locator('[data-provider="claude"] [data-edge]').count(), 0);
    assert.match(await page.locator('[data-provider="claude"]').innerText(), /Tidak ditemukan pada analisis Claude/);
    await page.locator('#cmpStageTitle').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(screenshots, 'laptop-empty-map.png') });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    // Returning directly from a filtered list/detail must restore the entire matrix.
    await page.locator('[data-action="list"]').click();
    await page.locator('[data-detail]').first().click();
    await page.locator('.cmp-list-navigation [data-stage="0"]').click();
    assert.equal(await page.locator('.cmp-cell').count(), 77);
    assert.deepEqual(await page.locator('.cmp-grand-total .cmp-cell-total span').allTextContents(), ['168', '140']);
    assert.equal(await page.locator('[data-filter="source"]').inputValue(), '');
    assert.equal(await page.locator('[data-filter="index"]').inputValue(), '');
    await page.locator('.cmp-steps [data-stage="2"]').click();
    await page.locator('[data-filter="status"]').selectOption('both');
    await page.locator('[data-filter="type"]').selectOption('Mendukung');
    await page.locator('[data-filter="search"]').fill('no-match-9999999');
    await page.locator('.cmp-steps [data-stage="0"]').click();
    assert.deepEqual(await page.locator('.cmp-grand-total .cmp-cell-total span').allTextContents(), ['168', '140']);
    assert.equal(await page.locator('[data-filter="status"]').inputValue(), '');
    assert.equal(await page.locator('[data-filter="type"]').inputValue(), '');
    assert.equal(await page.locator('[data-filter="search"]').inputValue(), '');
    assert.equal(await page.evaluate(() => JSON.stringify(window.__portalRB.state)), baselineState);
    assert.equal(await page.evaluate(() => JSON.stringify([window.RB_SASARAN_DATA, window.RB_RELASI_INTERNAL, window.RB_SUBSTANSI_INDIKATOR, window.RB_DATA])), baselineData);
    assert.equal(normalizeHTML(await page.locator('.main-content:not(.cmp-root)').innerHTML()), baselineHTML);
    await page.locator('#menuInternal').click();
    assert(!(await page.locator('#comparisonS4').isVisible()));
    await page.locator('#selectInternalSasaran').selectOption('4');
    const internalOptions = await page.locator('#selectComponent option').allTextContents();
    assert.deepEqual(await page.locator('[aria-label="Indikator Perbandingan"] optgroup').first().locator('option').allTextContents(), internalOptions.slice(1));
    assert.equal(await page.locator('[aria-label="Indikator Perbandingan"] optgroup').last().locator('option').count(), 6);
    const scopeCheck = await page.evaluate(() => ({
      primary: [...new Set(window.__portalRB.filteredRelations().map(r => r.sourceCode))].sort(),
      comparison: [...window.RB_COMPARISON_S4.scope.primarySourceIds].sort(),
      allSources: window.RB_COMPARISON_S4.scope.sourceIds,
      groupedSources: window.RB_COMPARISON_S4.scope.groups.flatMap(group => group.ids),
      reference: window.RB_COMPARISON_S4.files.reference.name,
      sourceFields: window.RB_COMPARISON_S4.scope.sourceIds.map(id => window.RB_COMPARISON_S4.indicators[id].fields)
    }));
    assert.deepEqual(scopeCheck.primary, scopeCheck.comparison);
    assert.equal(scopeCheck.allSources.length, 24);
    assert.deepEqual(scopeCheck.allSources.sort(), scopeCheck.groupedSources.sort());
    assert.equal(scopeCheck.reference, 'Bahan paparan Kamis (30092026) (1).xlsx');
    assert(scopeCheck.sourceFields.every(fields => !fields.some(([name]) => name === 'Definisi Operasional')));
    const primaryCount = await page.evaluate(() => window.__portalRB.filteredRelations().length);
    assert.equal(primaryCount, 50);
    await page.locator('#step2Btn').click();
    await page.locator('#step3Btn').click();
    await page.locator('#menuExternal').click();
    assert(await page.locator('#stageMatrix').isVisible());
    assert.equal(errors.length, 0, errors.join('\n'));
    console.log(JSON.stringify({ matrixCellsChecked: cellChecks, detailPairsChecked: detailChecks, mainS4Relations: primaryCount, javascriptErrors: errors, screenshots }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
