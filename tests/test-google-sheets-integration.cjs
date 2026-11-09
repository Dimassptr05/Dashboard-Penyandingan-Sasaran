/**
 * ============================================================================
 * TEST INTEGRASI GOOGLE SHEETS & NETLIFY FUNCTIONS - ALL SASARAN (1 s.d. 5)
 * ============================================================================
 */

const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("=== MEMULAI TEST INTEGRASI GOOGLE SHEETS ALL SASARAN (1 s.d. 5) ===");

const s3Fn = require("../netlify/functions/get-sasaran3.js");
const s4Fn = require("../netlify/functions/get-sasaran4.js");
const s5Fn = require("../netlify/functions/get-sasaran5.js");
const extFn = require("../netlify/functions/get-external.js");

async function runTests() {
  // Test 1: Sasaran 3 Handler
  const res3 = await s3Fn.handler({ httpMethod: "GET" }, {});
  assert.strictEqual(res3.statusCode, 200, "S3 handler harus return 200");
  const p3 = JSON.parse(res3.body);
  assert.strictEqual(p3.success, true, "S3 success harus true");
  assert.strictEqual(p3.totalRelations, 72, "S3 total harus 72");
  console.log("✔ Test 1 Berhasil: Sasaran 3 Netlify Function mengembalikan tepat 72 relasi");

  // Test 2: Sasaran 4 Handler
  const res4 = await s4Fn.handler({ httpMethod: "GET" }, {});
  assert.strictEqual(res4.statusCode, 200, "S4 handler harus return 200");
  const p4 = JSON.parse(res4.body);
  assert.strictEqual(p4.success, true, "S4 success harus true");
  assert.strictEqual(p4.totalRelations, 168, "S4 total harus 168");
  console.log("✔ Test 2 Berhasil: Sasaran 4 Netlify Function mengembalikan tepat 168 relasi");

  // Test 3: Sasaran 5 Handler
  const res5 = await s5Fn.handler({ httpMethod: "GET" }, {});
  assert.strictEqual(res5.statusCode, 200, "S5 handler harus return 200");
  const p5 = JSON.parse(res5.body);
  assert.strictEqual(p5.success, true, "S5 success harus true");
  assert.ok(p5.totalRelations >= 100, "S5 total harus terisi relasi lengkap");
  console.log(`✔ Test 3 Berhasil: Sasaran 5 Netlify Function mengembalikan ${p5.totalRelations} relasi`);

  // Test 4: External / Sasaran 1 Handler
  const resExt = await extFn.handler({ httpMethod: "GET" }, {});
  assert.strictEqual(resExt.statusCode, 200, "Ext handler harus return 200");
  const pExt = JSON.parse(resExt.body);
  assert.strictEqual(pExt.success, true, "Ext success harus true");
  assert.strictEqual(pExt.totalRelations, 1631, "Ext total harus 1631");
  console.log("✔ Test 4 Berhasil: Relasi Eksternal Netlify Function mengembalikan tepat 1.631 relasi");

  // Test 5: Verifikasi integritas data baseline offline
  global.window = global;
  eval(fs.readFileSync(path.resolve(__dirname, "../data/data-sasaran.js"), "utf8"));
  eval(fs.readFileSync(path.resolve(__dirname, "../data/data-relasi-internal.js"), "utf8"));
  eval(fs.readFileSync(path.resolve(__dirname, "../data/rb-relasi-eksternal-terbaru.js"), "utf8"));

  assert.strictEqual(window.RB_RELASI_INTERNAL.sasaran3.relasi.length, 72, "Sasaran 3 baseline harus 72");
  assert.strictEqual(window.RB_RELASI_INTERNAL.sasaran5.length, 1947, "Sasaran 5 baseline harus 1947");
  assert.strictEqual(window.RB_EXTERNAL_LATEST.relations.length, 1631, "External baseline harus 1631");
  console.log("✔ Test 5 Berhasil: Seluruh dataset baseline lokal 100% utuh dan sinkron");

  console.log("\n============================================================");
  console.log("   SELURUH PENGUJIAN INTEGRASI GOOGLE SHEETS BERHASIL (PASS)  ");
  console.log("============================================================");
}

runTests().catch(err => {
  console.error("❌ TEST GAGAL:", err);
  process.exit(1);
});
