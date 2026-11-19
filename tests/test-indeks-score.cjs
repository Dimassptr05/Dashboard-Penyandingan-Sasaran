/**
 * Unit & Integration Test: Analisis Indeks Score Evaluasi 2025
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { spawn } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const fn = require("../netlify/functions/get-indeks-score.js");

async function run() {
  // 1. Unit test parseScoreValue: 0 vs kosong, koma/titik, format tanggal Excel
  assert.equal(fn.parseScoreValue(""), null, "Kosong harus null, bukan 0");
  assert.equal(fn.parseScoreValue("-"), null, "Strip harus null");
  assert.equal(fn.parseScoreValue(null), null);
  assert.equal(fn.parseScoreValue("0"), 0, "Nilai 0 harus tetap 0");
  assert.equal(fn.parseScoreValue("0,00"), 0, "Nilai 0,00 harus tetap 0");
  assert.equal(fn.parseScoreValue("3,42"), 3.42, "Koma desimal Indonesia harus ter-parse");
  assert.equal(fn.parseScoreValue("70.16"), 70.16, "Titik desimal harus ter-parse");
  assert.equal(fn.parseScoreValue("3-Apr"), 3.04, "Format tanggal Excel 3-Apr harus dinormalisasi");
  assert.equal(fn.parseScoreValue("04/03/2025"), 4.03, "Format slash tanggal pada skor harus dinormalisasi");
  assert.ok(fn.parseScoreValue(45750) < 100, "Serial tanggal Excel 45750 tidak boleh dibaca mentah sebagai skor");
  console.log("✔ [1] Normalisasi nilai skor (0 vs kosong, desimal, format tanggal Excel) PASS");

  // 2. Unit test classifyCategory
  assert.equal(fn.classifyCategory("Indeks Pelayanan Publik", "B- - Baik dengan Catatan"), "below");
  assert.equal(fn.classifyCategory("Indeks Pelayanan Publik", "B - Baik"), "good");
  assert.equal(fn.classifyCategory("Survei Penilaian Integritas", "Hijau"), "good");
  assert.equal(fn.classifyCategory("Survei Penilaian Integritas", "Kuning"), "below");
  assert.equal(fn.classifyCategory("Survei Penilaian Integritas", "Merah"), "below");
  assert.equal(fn.classifyCategory("Indeks BerAkhlak", "A - Sehat"), "good");
  assert.equal(fn.classifyCategory("Indeks BerAkhlak", "C - Tidak Sehat"), "below");
  assert.equal(fn.classifyCategory("Tingkat Maturitas SPIP", null), null);
  assert.equal(fn.classifyCategory("Tingkat Maturitas SPIP", ""), null);
  console.log("✔ [2] Klasifikasi kategori (termasuk IPP B-, SPI Hijau, BerAkhlak C, null) PASS");

  // 3. Isolasi env dari Sasaran 4 + verifikasi handler (live atau fallback)
  const prevS4Id = process.env.SPREADSHEET_ID;
  const prevS4Name = process.env.SHEET_NAME_SASARAN4_DEV;
  const prevS4Gid = process.env.SHEET_GID_SASARAN4_DEV;
  process.env.SPREADSHEET_ID = "1LVXNqK7ehp2fLtrFstnTcM2jiyOeWCPhR1CdC14jwDs";
  process.env.SHEET_NAME_SASARAN4_DEV = "sasaran 4 -dev";
  process.env.SHEET_GID_SASARAN4_DEV = "1144784169";
  try {
    const res = await fn.handler({ httpMethod: "GET" }, {});
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.success, true);
    assert.equal(body.spreadsheetId, "1i4kBAqUUpxD6NfBFOPsibPMX902KGFP7Wz3JaJ1nzRQ");
    assert.equal(body.sheetName, "Sheet2");
    assert.equal(body.sheetGid, "860170702");
    assert.equal(body.totalInstansi, 642, "Harus tepat 642 instansi");
    assert.equal(body.totalIndicators, 20, "Harus tepat 20 indikator");
    assert.equal(typeof body.isFallback, "boolean");

    // Cek 87 entri IPP B- - Baik dengan Catatan semuanya 'below'
    const ippIdx = body.indicators.findIndex(x => x.name === "Indeks Pelayanan Publik");
    const ippBMinus = body.rows.filter(r => r[1][ippIdx][1] === "B- - Baik dengan Catatan");
    assert.equal(ippBMinus.length, 87, `IPP B- harus 87 entri, dapat ${ippBMinus.length}`);
    assert.ok(ippBMinus.every(r => r[1][ippIdx][2] === "below"), "Semua 87 entri IPP B- harus berstatus below");

    // Cek tidak ada skor serial tanggal mentah (> 500)
    for (const r of body.rows) {
      for (const cell of r[1]) {
        if (cell[0] !== null) {
          assert.ok(cell[0] >= 0 && cell[0] <= 500, `Skor tidak wajar pada ${r[0]}: ${cell[0]}`);
        }
      }
    }
    console.log(`✔ [3] Handler Indeks Score terisolasi dari Sasaran 4 (${body.totalInstansi} instansi, ${body.totalIndicators} indikator, source=${body.source}, isFallback=${body.isFallback}) PASS`);
  } finally {
    if (prevS4Id === undefined) delete process.env.SPREADSHEET_ID; else process.env.SPREADSHEET_ID = prevS4Id;
    if (prevS4Name === undefined) delete process.env.SHEET_NAME_SASARAN4_DEV; else process.env.SHEET_NAME_SASARAN4_DEV = prevS4Name;
    if (prevS4Gid === undefined) delete process.env.SHEET_GID_SASARAN4_DEV; else process.env.SHEET_GID_SASARAN4_DEV = prevS4Gid;
  }

  // 4. Verifikasi dev-server melayani /api/indeks-score dan /api/sasaran4 secara terpisah
  const port = 18889;
  const proc = spawn(process.execPath, [path.join(ROOT, "scripts/dev-server.js")], {
    env: { ...process.env, PORT: String(port) }
  });
  const getJson = (p) => new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}${p}`, (r) => {
      let d = "";
      r.on("data", c => d += c);
      r.on("end", () => resolve({ status: r.statusCode, body: JSON.parse(d) }));
    }).on("error", reject);
  });
  await new Promise(r => setTimeout(r, 700));
  try {
    const [rIdx, rS4] = await Promise.all([getJson("/api/indeks-score"), getJson("/api/sasaran4")]);
    assert.equal(rIdx.status, 200);
    assert.equal(rIdx.body.totalInstansi, 642);
    assert.equal(rS4.status, 200);
    assert.equal(rS4.body.totalRelations, 494);
    console.log("✔ [4] Local dev-server /api/indeks-score (642) & /api/sasaran4 (494) terpisah dan konsisten PASS");
  } finally {
    proc.kill();
  }

  console.log("\n=== SELURUH TEST INTEGRITAS & API INDEKS SCORE 2025 PASS ===");
}

run().catch(err => {
  console.error("❌ TEST INDEKS SCORE GAGAL:", err);
  process.exit(1);
});
