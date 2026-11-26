const assert = require("assert");
const fn = require("../netlify/functions/get-pemetaan-instansi.js");

// 1. Unit test normalizeLevel (pastikan 0 valid dan kosong tetap kosong)
assert.strictEqual(fn.normalizeLevel(0), "0");
assert.strictEqual(fn.normalizeLevel("0"), "0");
assert.strictEqual(fn.normalizeLevel("L0"), "0");
assert.strictEqual(fn.normalizeLevel("l0"), "0");
assert.strictEqual(fn.normalizeLevel("Level 0"), "0");
assert.strictEqual(fn.normalizeLevel("L1"), "1");
assert.strictEqual(fn.normalizeLevel("1, 2"), "1, 2");
assert.strictEqual(fn.normalizeLevel(""), "");
assert.strictEqual(fn.normalizeLevel("   "), "");
assert.strictEqual(fn.normalizeLevel(null), "");
assert.strictEqual(fn.normalizeLevel(undefined), "");
assert.strictEqual(fn.normalizeLevel("-"), "");
assert.strictEqual(fn.normalizeLevel("—"), "");

// 2. Unit test parseThematicSheet (merge cells, empty continuation rows, Level 0, instansi tanpa peran)
const sampleRows = [
  ["NO", "Instansi", "Level", "Deskripsi Level /Peran", "Jenis Proses"],
  ["1", "Instansi Kosong", "", "", ""],
  ["2", "Instansi Multi", "0", "Peran induk level nol", "Proses Utama"],
  ["2", "", "1", "Peran kedua", "Proses Utama; Dukungan Manajemen"],
  ["2", "", "", "", ""], // empty continuation row (merged NO) -> harus diabaikan
  ["", "", "", "", ""], // completely blank row -> harus diabaikan
  ["3", "Instansi Level Kosong", "", "Peran tanpa level", ""]
];
const parsed = fn.parseThematicSheet(sampleRows);
assert.strictEqual(parsed.length, 3);
assert.strictEqual(parsed[0].name, "Instansi Kosong");
assert.strictEqual(parsed[0].roles.length, 1);
assert.strictEqual(parsed[0].roles[0].level, "");
assert.strictEqual(parsed[0].roles[0].desc, "");

assert.strictEqual(parsed[1].name, "Instansi Multi");
assert.strictEqual(parsed[1].roles.length, 2);
assert.strictEqual(parsed[1].roles[0].level, "0");
assert.strictEqual(parsed[1].roles[1].level, "1");
assert.deepStrictEqual(fn.splitTokens(parsed[1].roles[1].type), ["Proses Utama", "Dukungan Manajemen"]);

assert.strictEqual(parsed[2].name, "Instansi Level Kosong");
assert.strictEqual(parsed[2].roles[0].level, "");
assert.notStrictEqual(parsed[2].roles[0].level, "0");

// 3. Unit test same-row combined filter (Level + Jenis Proses harus cocok di baris peran yang sama)
const combinedMatch = parsed
  .map((g) => ({
    ...g,
    roles: g.roles.filter(
      (r) => fn.splitTokens(r.level).includes("0") && fn.splitTokens(r.type).includes("Dukungan Manajemen")
    )
  }))
  .filter((g) => g.roles.length > 0);
assert.strictEqual(combinedMatch.length, 0, "Level 0 + Dukungan Manajemen tidak boleh cocok lintas baris peran berbeda");

// 4. Live Google Sheets integration test
(async () => {
  const res = await fn.handler({ httpMethod: "GET", queryStringParameters: { refresh: "1" } });
  assert.strictEqual(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.source, "google_sheets");
  assert.deepStrictEqual(body.tabOrder, [
    "Kemiskinan",
    "Investasi",
    "Hilirisasi",
    "Ketahanan Pangan",
    "Pendidikan",
    "Kesehatan"
  ]);

  const expected = {
    Kemiskinan: { total: 98, level0: 1 },
    Investasi: { total: 95, level0: 0 },
    Hilirisasi: { total: 96, level0: 4 },
    "Ketahanan Pangan": { total: 98, level0: 16 },
    Pendidikan: { total: 98, level0: 0 },
    Kesehatan: { total: 66, level0: 19 }
  };

  for (const [theme, exp] of Object.entries(expected)) {
    const groups = body.themes[theme];
    assert.ok(Array.isArray(groups), `Tab ${theme} harus berupa array`);
    assert.strictEqual(groups.length, exp.total, `Jumlah instansi ${theme} harus ${exp.total}, aktual ${groups.length}`);

    // Pastikan tidak ada duplikasi nama instansi
    const names = groups.map((g) => g.name);
    assert.strictEqual(new Set(names).size, names.length, `Duplikasi instansi ditemukan pada ${theme}`);

    // Pastikan Level 0 terbaca tepat dan tidak ada awalan L
    let l0Count = 0;
    for (const g of groups) {
      for (const r of g.roles) {
        assert.ok(!/^L\d/i.test(r.level), `Level masih memakai awalan L pada ${theme}: ${r.level}`);
        if (fn.splitTokens(r.level).includes("0")) l0Count++;
      }
    }
    assert.strictEqual(l0Count, exp.level0, `Jumlah Level 0 pada ${theme} harus ${exp.level0}, aktual ${l0Count}`);
  }

  console.log("PASS: All Pemetaan Per Instansi unit & live Google Sheets tests succeeded!");
  console.log("META:", JSON.stringify(body.meta));
})().catch((err) => {
  console.error("FAIL:", err);
  process.exit(1);
});
