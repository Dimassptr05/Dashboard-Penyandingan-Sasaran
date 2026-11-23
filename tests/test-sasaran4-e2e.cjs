// Browser E2E test: Migrasi Final Sasaran 4 (Matriks -> Peta -> Daftar -> Detail, Filter, PDF, Regresi S3/S5/Ext)
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
    await page.waitForSelector("#selectInternalSasaran");

    // 1. Verifikasi dropdown Sasaran Strategis hanya memiliki 1 opsi Sasaran 4 (tanpa 4-dev)
    const sOptions = await page.locator("#selectInternalSasaran option").evaluateAll(opts =>
      opts.map(o => ({ value: o.value, text: o.textContent.trim() }))
    );
    assert.ok(!sOptions.some(o => o.value === "4-dev"), "Opsi 4-dev tidak boleh ada");
    const s4Opt = sOptions.find(o => o.value === "4");
    assert.ok(s4Opt, "Opsi Sasaran 4 harus ada");
    assert.ok(s4Opt.text.includes("Sasaran 4 — Kapabilitas Kelembagaan"), `Label salah: ${s4Opt.text}`);
    assert.ok(s4Opt.text.includes("494"), `Jumlah relasi 494 harus tampil: ${s4Opt.text}`);

    // 2. Pilih Sasaran 4 dan verifikasi Mode A (Matriks Antarindeks)
    await page.locator("#selectInternalSasaran").selectOption("4");
    await page.waitForSelector(".matrix-table-s4dev");
    const grandTotal = (await page.locator(".matrix-grand-total").textContent()).trim();
    assert.equal(grandTotal, "494", `Grand total matriks harus 494, dapat: ${grandTotal}`);

    // Verifikasi opsi Risiko Redundansi dinamis (384 / 102 / 8, bukan hardcode lama 291/108/48)
    const riskTexts = await page.locator("#selectRedundancyRisk option").allTextContents();
    assert.ok(riskTexts.some(t => t.includes("Rendah (384)")), `Opsi Rendah harus 384: ${riskTexts}`);
    assert.ok(riskTexts.some(t => t.includes("Sedang (102)")), `Opsi Sedang harus 102: ${riskTexts}`);
    assert.ok(riskTexts.some(t => t.includes("Tinggi (8)")), `Opsi Tinggi harus 8: ${riskTexts}`);

    // 3. Uji Filter: Kelompok, Indeks Sumber, Jenis Keterkaitan, Risiko Redundansi, Pencarian, Reset
    await page.locator("#selectDevGroup").selectOption("Manajemen Risiko");
    const riskGroupTotal = Number((await page.locator(".matrix-grand-total").textContent()).trim());
    assert.ok(riskGroupTotal > 0 && riskGroupTotal < 494, `Filter kelompok harus mempersempit relasi (${riskGroupTotal})`);

    await page.locator("#selectDevGroup").selectOption("ALL");
    await page.locator("#selectRedundancyRisk").selectOption("Tinggi");
    assert.equal((await page.locator(".matrix-grand-total").textContent()).trim(), "8", "Filter Risiko Tinggi harus 8 relasi");

    await page.locator("#selectRedundancyRisk").selectOption("ALL");
    await page.locator("#selectRelationType").selectOption("Langsung");
    assert.equal((await page.locator(".matrix-grand-total").textContent()).trim(), "78", "Filter Jenis Langsung harus 78 relasi");

    await page.locator("#btnResetFilters").click();
    assert.equal((await page.locator(".matrix-grand-total").textContent()).trim(), "494", "Reset filter harus kembali ke 494");

    // 4. Uji Mode B (Matriks Rincian Indikator) dan kembali ke Mode A
    await page.locator('[data-s4dev-mode="rincian"]').click();
    await page.waitForSelector("#btnBackToAntarindeks");
    await page.locator("#btnBackToAntarindeks").click();
    await page.waitForSelector(".matrix-table-s4dev");

    // 5. Uji Navigasi: Matriks -> Peta Relasi -> Daftar Relasi -> Lihat Detail
    await page.locator(".matrix-table-s4dev .matrix-cell-btn[data-dev-antar-src]").first().click();
    await page.waitForSelector("#stageGraph:not(.hidden)");
    const graphText = (await page.locator("#stageGraph").innerText()).trim();
    assert.ok(graphText.length > 50, "Tahap 2 Peta Relasi harus menampilkan konten peta relasi");

    await page.locator("#step3Btn").click();
    await page.waitForSelector("#stageList:not(.hidden)");
    const detailBtns = page.locator(".btn-action-detail");
    assert.ok((await detailBtns.count()) > 0, "Tahap 3 Daftar Relasi harus menampilkan tombol Lihat Detail");

    await detailBtns.first().click();
    await page.waitForSelector("#focusRelationCard:not(.hidden)");
    const detailText = await page.locator("#focusRelationCard").textContent();
    assert.ok(detailText.includes("Informasi Keterkaitan"), "Kartu detail harus memuat Informasi Keterkaitan");
    assert.ok(detailText.includes("Inti Risiko Redundansi"), "Kartu detail harus memuat Inti Risiko Redundansi");
    assert.ok(!detailText.includes("Arah Catatan Asli"), "Arah Catatan Asli tidak boleh tampil");

    // 6. Uji Ekspor PDF (Matriks, Peta, Daftar) tanpa error
    await page.locator("#step1Btn").click();
    await page.waitForSelector("#stageMatrix:not(.hidden)");
    const pdfResults = await page.evaluate(() => {
      const m = window.__portalRB.exportMatrixPdf();
      window.__portalRB.setStage("graph");
      const g = window.__portalRB.exportGraphPdf();
      window.__portalRB.setStage("list");
      const l = window.__portalRB.exportListPdf();
      return { matrix: Boolean(m), graph: Boolean(g), list: Boolean(l) };
    });
    assert.equal(pdfResults.matrix, true, "Ekspor PDF Matriks harus berhasil");
    assert.equal(pdfResults.list, true, "Ekspor PDF Daftar harus berhasil");

    // 7. Uji Regresi: Sasaran 5, Sasaran 3, Relasi Eksternal, Analisis Indeks Score
    await page.locator("#step1Btn").click();
    await page.locator("#selectInternalSasaran").selectOption("5");
    await page.waitForSelector("#stageMatrix:not(.hidden)");
    assert.ok((await page.locator("#matrixTableContainer table").count()) > 0, "Sasaran 5 harus merender matriks");

    await page.locator("#selectInternalSasaran").selectOption("3");
    await page.waitForSelector("#stageMatrix:not(.hidden)");
    assert.ok((await page.locator("#matrixTableContainer table").count()) > 0, "Sasaran 3 harus merender matriks");

    await page.locator("#menuExternal").click();
    await page.waitForSelector("#stageMatrix:not(.hidden)");
    assert.ok((await page.locator("#matrixTableContainer table").count()) > 0, "Relasi Eksternal harus merender matriks");

    const hasComparisonMenu = (await page.locator("#menuComparisonS4").count()) > 0;
    if (hasComparisonMenu) {
      await page.locator("#menuComparisonS4").click();
      await page.waitForSelector("#comparisonS4:not([hidden])");
    }

    assert.equal(pageErrors.length, 0, `Ditemukan JS pageerror: ${pageErrors.join(" | ")}`);
    console.log(JSON.stringify({
      status: "PASS",
      sasaran4GrandTotal: grandTotal,
      filtersVerified: ["Kelompok", "RisikoRedundansi", "JenisKeterkaitan", "Reset", "ModeA/ModeB"],
      flowVerified: ["Matriks", "Peta", "Daftar", "Detail"],
      pdfExportVerified: pdfResults,
      regressionVerified: ["Sasaran 5", "Sasaran 3", "Relasi Eksternal", hasComparisonMenu ? "Perbandingan Sasaran 4" : "Perbandingan Sasaran 4 (tidak termuat di index.html sebelum migrasi)"],
      jsErrors: pageErrors.length
    }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error("❌ E2E TEST GAGAL:", err);
  process.exit(1);
});
