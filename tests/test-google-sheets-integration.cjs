const assert = require("assert");
const fs = require("fs");
const path = require("path");

const fn = require("../netlify/functions/get-sasaran.js");
const baseline = require("../data/sasaran-relations.js");

const HEADER = [
  "No",
  "Kelompok Sumber (Level 1)",
  "Indeks Sumber (Level 2)",
  "ID Indikator Sumber",
  "Nama Indikator Sumber",
  "Kelompok Pembanding",
  "Indeks Pembanding",
  "ID Indikator Pembanding",
  "Nama Indikator Pembanding",
  "Jenis Keterkaitan",
  "Risiko Redundansi",
  "Alasan / Justifikasi Substantif",
  "Rekomendasi Tindak Lanjut"
];

function rowAt(start, values) {
  const row = Array(start).fill("");
  values.forEach((value, index) => {
    row[start + index] = value;
  });
  return row;
}

function relationValues(no, sourceIndex, destIndex) {
  return [
    no,
    `Kelompok ${no}`,
    sourceIndex,
    `SS4-${sourceIndex}.1.1`,
    `Indikator ${no}`,
    `Pembanding ${no}`,
    destIndex,
    `SS1-${destIndex}.1.1`,
    `Pembanding Indikator ${no}`,
    "Mendukung",
    "Rendah",
    "Alasan uji",
    "Rekomendasi uji"
  ];
}

console.log("=== MEMULAI TEST FUNCTION SASARAN TERINTEGRASI ===");

assert.deepStrictEqual(fn.SASARAN_SHEETS, {
  1: { sheetName: "sasaran1.js", sheetGid: "1769541411" },
  2: { sheetName: "sasaran2.js", sheetGid: "973478513" },
  3: { sheetName: "sasaran3.js", sheetGid: "1009479719" },
  4: { sheetName: "sasaran4.js", sheetGid: "1944797946" },
  5: { sheetName: "sasaran5.js", sheetGid: "26975224" }
});
console.log("OK mapping 5 tab sasaran.js");

const csv = fn.parseCSV('a,"b,c",d\n1,"x""y",3');
assert.deepStrictEqual(csv, [["a", "b,c", "d"], ["1", 'x"y', "3"]]);
console.log("OK parseCSV");

const firstRow = rowAt(67, HEADER);
firstRow[81] = "Eksternal";
const secondRow = rowAt(67, relationValues(1, "KK", "PEMDI"));
HEADER.forEach((value, index) => {
  secondRow[81 + index] = value;
});
const fixtureRows = [
  firstRow,
  secondRow,
  rowAt(81, relationValues(1, "KK", "PEMDI"))
];
const parsed = fn.parseSheetRows(fixtureRows, 4);
assert.strictEqual(parsed.internal.length, 1);
assert.strictEqual(parsed.external.length, 1);
assert.strictEqual(parsed.internal[0].sourceIndex, "KK");
assert.strictEqual(parsed.external[0].destIndex, "PEMDI");
assert.strictEqual(parsed.external[0].sasaran, 4);
console.log("OK parser blok internal baris 0 dan eksternal baris 1");

const expectedCounts = {
  1: [0, 15],
  2: [0, 15],
  3: [12, 28],
  4: [494, 64],
  5: [44, 48]
};
for (const [id, [internalCount, externalCount]] of Object.entries(expectedCounts)) {
  const entry = baseline[id];
  assert.ok(entry, `baseline sasaran ${id} harus ada`);
  assert.strictEqual(entry.internal.length, internalCount, `internal sasaran ${id}`);
  assert.strictEqual(entry.external.length, externalCount, `external sasaran ${id}`);
  for (const relation of [...entry.internal, ...entry.external]) {
    for (const field of ["sourceSasaran", "targetSasaran", "sourceId", "destId", "sourceIndex", "destIndex", "sourceKelompok", "destKelompok"]) {
      assert.ok(relation[field] !== undefined, `relasi ${relation.id} harus punya ${field}`);
    }
  }
}
console.log("OK baseline terpadu 1 s.d. 5");

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
new Function(appSource);
assert.ok(!html.includes("option-disabled"), "dropdown sumber eksternal tidak boleh punya opsi disabled");
assert.ok(html.includes('data/sasaran-relations.js'), "index.html harus memuat baseline terpadu");
assert.ok(!html.includes("data/data-relasi"), "index.html tidak boleh memuat data lama");
console.log("OK sintaks app.js dan aset index.html");

console.log("SELURUH PENGUJIAN FUNCTION SASARAN BERHASIL (PASS)");
