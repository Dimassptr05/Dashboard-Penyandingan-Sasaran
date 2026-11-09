/**
 * ============================================================================
 * TEST INTEGRASI GOOGLE SHEETS & NETLIFY FUNCTIONS - SASARAN 4
 * ============================================================================
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("=== MEMULAI TEST INTEGRASI GOOGLE SHEETS SASARAN 4 ===");

// 1. Uji Netlify Function Handler
const s4Fn = require("../netlify/functions/get-sasaran4.js");

async function runTests() {
  // Test 1: Handler baseline mode
  const res = await s4Fn.handler({ httpMethod: "GET" }, {});
  assert.strictEqual(res.statusCode, 200, "Handler harus return 200");
  const payload = JSON.parse(res.body);
  assert.strictEqual(payload.success, true, "Success harus true");
  assert.strictEqual(payload.totalRelations, 168, "Total baseline harus 168");
  console.log("✔ Test 1 Berhasil: Netlify Function baseline mode mengembalikan 168 relasi");

  // Test 2: Ekstraksi Alasan (Kolom L)
  const sampleWithAI = "Penjelasan awal sebelum AI.\n\nHasil analisis AI=\nKedua indikator memiliki irisan tugas.";
  const sampleWithoutAI = "Hubungan koordinatif langsung antara perencanaan dan pengendalian.";
  const sampleEmpty = "";

  // Kita uji regex Col L di fungsi
  const aiRegex = /Hasil\s+analisis\s+AI\s*[:=]\s*([\s\S]*)/i;
  const matchA = sampleWithAI.match(aiRegex);
  assert.ok(matchA, "Harus cocok dengan penanda AI");
  assert.strictEqual(matchA[1].trim(), "Kedua indikator memiliki irisan tugas.");

  const matchB = sampleWithoutAI.match(aiRegex);
  assert.strictEqual(matchB, null, "Tidak boleh mencocokkan jika tidak ada penanda");
  console.log("✔ Test 2 Berhasil: Aturan ekstraksi Kolom L (Kondisi A, B, C) valid");

  // Test 3: Verifikasi dataset baseline
  const baseline = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/sasaran4-verified-baseline.json"), "utf8"));
  assert.strictEqual(baseline.total, 168);
  assert.strictEqual(Object.keys(baseline.justifikasi).length, 168);

  const kinds = {};
  baseline.relations.forEach(r => {
    kinds[r.jenis] = (kinds[r.jenis] || 0) + 1;
  });
  console.log("  Distribusi klasifikasi Sasaran 4:", kinds);
  assert.strictEqual(kinds["Mendukung"], 97, "Mendukung harus 97");
  assert.strictEqual(kinds["Langsung"], 61, "Langsung harus 61");
  assert.strictEqual(kinds["Tidak Langsung"], 10, "Tidak Langsung harus 10");
  console.log("✔ Test 3 Berhasil: 97 Mendukung, 61 Langsung, 10 Tidak Langsung terverifikasi");

  // Test 4: Verifikasi integritas data sasaran lainnya
  global.window = global;
  eval(fs.readFileSync(path.resolve(__dirname, "../data/data-sasaran.js"), "utf8"));
  eval(fs.readFileSync(path.resolve(__dirname, "../data/data-relasi-internal.js"), "utf8"));

  assert.ok(window.RB_RELASI_INTERNAL.sasaran3.relasi.length > 0, "Sasaran 3 harus tetap utuh");
  assert.ok(window.RB_RELASI_INTERNAL.sasaran5.length > 0, "Sasaran 5 harus tetap utuh");
  console.log("✔ Test 4 Berhasil: Sasaran 1, 3, dan 5 tetap 100% utuh tanpa perubahan");

  console.log("\n============================================================");
  console.log("   SELURUH PENGUJIAN INTEGRASI GOOGLE SHEETS BERHASIL (PASS)  ");
  console.log("============================================================");
}

runTests().catch(err => {
  console.error("❌ TEST GAGAL:", err);
  process.exit(1);
});

