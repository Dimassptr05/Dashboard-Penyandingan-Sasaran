/**
 * Regression test: Migrasi Final Sasaran 4 (sasaran 4 -dev sebagai sumber tunggal)
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

const ROOT = path.resolve(__dirname, "..");
const s4Fn = require("../netlify/functions/get-sasaran4.js");
const s4DevFn = require("../netlify/functions/get-sasaran4-dev.js");

async function run() {
  // 1. Delegasi endpoint konsisten
  assert.strictEqual(s4Fn.handler, s4DevFn.handler, "get-sasaran4.js harus mendelegasikan handler ke get-sasaran4-dev.js");
  assert.strictEqual(s4Fn.parseSheetRows, s4DevFn.parseSheetRows, "parseSheetRows harus identik");
  console.log("✔ [1] Endpoint get-sasaran4.js dan get-sasaran4-dev.js 100% konsisten");

  // 2. Unit test parser 22 kolom final
  const sampleRows = [
    ["No", "Kelompok Sumber", "Indeks Sumber", "ID Sumber", "Nama Sumber", "Kelompok Pembanding", "Indeks Pembanding", "ID Pembanding", "Nama Pembanding", "Jenis", "Risiko", "Alasan", "Rekomendasi", "Jenis Asli", "Alasan Asli", "Dasar Klasifikasi", "Dasar Risiko", "Jejak", "Status", "Src Asli", "Dst Asli", "Inti Risiko"],
    ["1", "Kelembagaan", "KK", "SS4-KK.KF.1.1", "Relevansi Mandat", "Manajemen Kinerja dan Penganggaran", "IPPN", "SS4-IPPN.1.a.1", "Kepatuhan Renstra", "Mendukung", "Rendah", "Alasan 1", "Rekomendasi 1", "Mendukung", "Asli 1", "Dasar 1", "Risiko 1", "Jejak 1", "Valid", "KK", "IPPN", "Inti 1"],
    ["2", "Manajemen Risiko", "SPIP", "SS4-SPIP.1.1", "Lingkungan Pengendalian", "Manajemen Kinerja dan Penganggaran", "SAKIP", "SS4-SAKIP.1.1", "Perencanaan Kinerja", "Langsung", "Tinggi", "Alasan 2", "Rekomendasi 2", "Langsung", "Asli 2", "Dasar 2", "Risiko 2", "Jejak 2", "Valid", "SPIP", "SAKIP", "Inti 2"]
  ];
  const parsed = s4Fn.parseSheetRows(sampleRows);
  assert.equal(parsed.totalRelations, 2);
  assert.equal(parsed.relations[0].sourceIndex, "KK");
  assert.equal(parsed.relations[0].intiRisiko, "Inti 1");
  assert.equal(parsed.relations[1].risikoRedundansi, "Tinggi");
  assert.equal(parsed.summary.jenisKeterkaitan.Mendukung, 1);
  assert.equal(parsed.summary.risikoRedundansi.Tinggi, 1);
  console.log("✔ [2] Parser 22 kolom skema final akurat tanpa kehilangan/duplikasi baris");

  // 3. Guard env legacy: SHEET_NAME=sasaran4-js & SHEET_GID=1944797946 tidak boleh menimpa sumber final
  const prevSheet = process.env.SHEET_NAME;
  const prevGid = process.env.SHEET_GID;
  process.env.SHEET_NAME = "sasaran4-js";
  process.env.SHEET_GID = "1944797946";
  try {
    const res = await s4Fn.handler({ httpMethod: "GET" }, {});
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.success, true);
    assert.equal(body.sheetName, "sasaran 4 -dev");
    assert.equal(body.sheetGid, "1144784169");
    assert.ok(body.totalRelations >= 494, `Expected >= 494 relations, got ${body.totalRelations}`);
    assert.notEqual(body.totalRelations, 165, "Tidak boleh membaca baseline lama 165 relasi");
    assert.notEqual(body.totalRelations, 168, "Tidak boleh membaca baseline lama 168 relasi");
    assert.equal(typeof body.isFallback, "boolean", "Respon harus memiliki flag isFallback eksplisit");
    console.log(`✔ [3] Guard env lama aktif; handler merespons ${body.totalRelations} relasi (source=${body.source}, isFallback=${body.isFallback})`);
  } finally {
    if (prevSheet === undefined) delete process.env.SHEET_NAME; else process.env.SHEET_NAME = prevSheet;
    if (prevGid === undefined) delete process.env.SHEET_GID; else process.env.SHEET_GID = prevGid;
  }

  // 4. Konsistensi baseline JSON vs JS offline
  const jsonBase = JSON.parse(fs.readFileSync(path.join(ROOT, "data/sasaran4-dev-verified-baseline.json"), "utf8"));
  global.window = {};
  eval(fs.readFileSync(path.join(ROOT, "data/sasaran4-dev-baseline.js"), "utf8"));
  const jsBase = global.window.RB_SASARAN4_DEV_BASELINE;
  assert.equal(jsonBase.relations.length, 494);
  assert.equal(jsBase.relations.length, jsonBase.relations.length);
  assert.equal(jsBase.relations[0].sourceId, jsonBase.relations[0].sourceId);
  assert.equal(jsBase.relations[493].destId, jsonBase.relations[493].destId);
  console.log("✔ [4] Baseline JSON dan JS offline 100% sinkron (494 relasi)");

  // 5. Audit HTML & JS frontend
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.ok(!html.includes('value="4-dev"'), "index.html tidak boleh lagi memiliki opsi 4-dev terpisah");
  assert.ok(html.includes('<option value="4">Sasaran 4 — Kapabilitas Kelembagaan</option>'), "index.html harus memiliki opsi tunggal Sasaran 4 — Kapabilitas Kelembagaan");
  const appJs = fs.readFileSync(path.join(ROOT, "assets/js/app.js"), "utf8");
  assert.ok(!appJs.includes("isS4InternalComp"), "app.js tidak boleh mengandung variabel undefined isS4InternalComp");
  assert.ok(!appJs.includes("Rendah (291)"), "app.js tidak boleh men-hardcode jumlah risiko lama (291)");
  assert.ok(!appJs.includes("sasaran4-js"), "app.js tidak boleh mereferensikan sasaran4-js");
  new Function(appJs);
  console.log("✔ [5] Audit index.html & sintaks assets/js/app.js bersih tanpa regresi");

  console.log("\n=== SELURUH REGRESSION TEST MIGRASI FINAL SASARAN 4 PASS ===");
}

run().catch(err => {
  console.error("❌ REGRESSION TEST GAGAL:", err);
  process.exit(1);
});
