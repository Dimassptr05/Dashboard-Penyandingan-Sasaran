// Browser E2E test: Analisis Indeks Score 2025 di dalam Portal Relasi RB + Regresi Sasaran 4/3/5/Eksternal
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on("pageerror", err => pageErrors.push(err.message));

  try {
    const fileUrl = pathToFileURL(path.resolve(__dirname, "../index.html")).href;
    await page.goto(fileUrl, { waitUntil: "domcontentloaded" });

    // 1. Pastikan hanya ada 1 menu Analisis Indeks Score (tidak duplikat)
    assert.equal(await page.locator("#menuAnalysisScore").count(), 1, "Menu Analisis Indeks Score tidak boleh duplikat");
    await page.locator("#menuAnalysisScore").click();
    await page.waitForSelector("#analysisScoreView:not([hidden])");

    const frame = page.frameLocator("#analysisScoreView iframe");
    await frame.locator("#kpis .card").first().waitFor({ timeout: 15000 });

    // 2. Verifikasi 642 instansi & 20 indikator + source badge
    const badgeText = (await frame.locator("#dataSourceBadge").textContent()).trim();
    assert.ok(badgeText.length > 5, "Badge sumber data harus tampil");
    const kpiVals = await frame.locator("#kpis .kpi-value").allTextContents();
    assert.equal(kpiVals[0].trim(), "642", `KPI cakupan evaluasi harus 642, dapat: ${kpiVals[0]}`);
    assert.equal(kpiVals[1].trim(), "20", `KPI jumlah indikator harus 20, dapat: ${kpiVals[1]}`);

    // 3. Tab 01: Filter kategori instansi, urutan, detail, sorting nilai, pagination, CSV
    await frame.locator("#selectInstType").selectOption("Kementerian");
    assert.equal(await frame.locator("#instTable tr").count(), 49, "Filter Kementerian harus 49 instansi");

    await frame.locator("#selectInstType").selectOption("Provinsi");
    assert.equal(await frame.locator("#instTable tr").count(), 38, "Filter Provinsi harus 38 instansi");

    await frame.locator("#filterStatus").selectOption("high");
    await frame.locator("#instTable tr button.btn").first().click();
    const detailRows = await frame.locator("#detailTable tr").count();
    assert.equal(detailRows, 20, "Detail instansi harus menampilkan 20 indikator");

    await frame.locator("#detailSortButton").click();
    assert.ok((await frame.locator("#detailSortArrow").textContent()).includes("↑"), "Sort nilai detail harus berubah ke ascending");

    await frame.locator("#distributionPagination button", { hasText: "Berikutnya" }).click();
    assert.ok((await frame.locator("#distributionPagination").textContent()).includes("Halaman 2"), "Pagination distribusi harus berpindah ke Halaman 2");

    const csvLines = await frame.locator("body").evaluate(() => window.__indeksScore.buildCSVContent().split("\n").length);
    assert.equal(csvLines, 643, `Ekspor CSV harus 643 baris (header + 642 instansi), dapat: ${csvLines}`);

    // 4. Tab 02: Analisis per Indikator, dropdown kategori/provinsi/kab-kota, rincian, perbandingan + pagination
    await frame.locator("#tabInd").click();
    await frame.locator("#panelInd.active").waitFor();

    const provCount = await frame.locator("#selectIndProvince option").count();
    const regCount = await frame.locator("#selectIndRegency option").count();
    assert.equal(provCount, 39, `Dropdown provinsi harus 38 + 1 semua, dapat ${provCount}`);
    assert.equal(regCount, 509, `Dropdown kab/kota harus 508 + 1 semua, dapat ${regCount}`);

    await frame.locator("#selectInd").selectOption("Indeks Pelayanan Publik");
    const goodCountText = await frame.locator("#goodInstCount").textContent();
    const belowCountText = await frame.locator("#belowInstCount").textContent();
    assert.ok(goodCountText.includes("instansi") && belowCountText.includes("instansi"), "Rincian instansi per indikator harus terisi");

    await frame.locator("#comparisonPagination button", { hasText: "Berikutnya" }).click();
    assert.ok((await frame.locator("#comparisonPagination").textContent()).includes("Halaman 2"), "Pagination perbandingan harus berpindah ke Halaman 2");

    // 5. Uji responsif viewport mobile (375x812)
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 1440, height: 1000 });

    // 6. Regresi Sasaran 4 (494 relasi), Sasaran 5, Sasaran 3, Relasi Eksternal
    await page.locator("#menuInternal").click();
    await page.locator("#selectInternalSasaran").selectOption("4");
    await page.waitForSelector(".matrix-table-s4dev");
    assert.equal((await page.locator(".matrix-grand-total").textContent()).trim(), "494", "Sasaran 4 harus tetap 494 relasi");

    await page.locator("#selectInternalSasaran").selectOption("5");
    assert.ok((await page.locator("#matrixTableContainer table").count()) > 0, "Sasaran 5 harus tetap berfungsi");
    await page.locator("#selectInternalSasaran").selectOption("3");
    assert.ok((await page.locator("#matrixTableContainer table").count()) > 0, "Sasaran 3 harus tetap berfungsi");
    await page.locator("#menuExternal").click();
    assert.ok((await page.locator("#matrixTableContainer table").count()) > 0, "Relasi Eksternal harus tetap berfungsi");

    assert.equal(pageErrors.length, 0, `Ditemukan JS error: ${pageErrors.join(" | ")}`);
    console.log(JSON.stringify({
      status: "PASS",
      indeksScore: { instansi: 642, indicators: 20, csvLines, provinces: provCount - 1, regencies: regCount - 1, badge: badgeText },
      sasaran4Relations: 494,
      regressions: ["Sasaran 4", "Sasaran 5", "Sasaran 3", "Relasi Eksternal"],
      jsErrors: pageErrors.length
    }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error("❌ E2E INDEKS SCORE GAGAL:", err);
  process.exit(1);
});
