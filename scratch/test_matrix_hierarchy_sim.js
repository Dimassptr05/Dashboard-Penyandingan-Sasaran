const fs = require('fs');

global.window = global;
global.document = {
  getElementById: () => ({ classList: { add: () => {}, remove: () => {} }, style: {}, addEventListener: () => {} }),
  createElement: () => ({ style: {} }),
  querySelectorAll: () => []
};

require('../data-sasaran.js');
require('../data/jenis-keterkaitan.js');
require('../data/substansi-indikator.js');

const sasaranData = window.RB_SASARAN_DATA;
const indicatorMap = new Map();
sasaranData.indikators.forEach(item => indicatorMap.set(item.code, item));
const getSubstansi = code => (window.RB_SUBSTANSI_INDIKATOR && window.RB_SUBSTANSI_INDIKATOR[code]) || null;
const jk = window.RB_JENIS_KETERKAITAN;

function getKKAspectAndGroup(code) {
  if (code.startsWith("SS4-KK.KF.1")) return { aspek: "Ketepatan Fungsi", kelompok: "1. Mandat (Core Function)" };
  if (code.startsWith("SS4-KK.KF.2")) return { aspek: "Ketepatan Fungsi", kelompok: "2. Distribusi Kewenangan" };
  if (code.startsWith("SS4-KK.KF.3")) return { aspek: "Ketepatan Fungsi", kelompok: "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung" };
  if (code.startsWith("SS4-KK.KU.1")) return { aspek: "Ketepatan Ukuran", kelompok: "1. Rentang Kendali" };
  if (code.startsWith("SS4-KK.KU.2")) return { aspek: "Ketepatan Ukuran", kelompok: "2. Departemensi (Pembidangan)" };
  if (code.startsWith("SS4-KK.KP.1")) return { aspek: "Ketepatan Proses", kelompok: "1. Proses Bisnis" };
  if (code.startsWith("SS4-KK.KP.2")) return { aspek: "Ketepatan Proses", kelompok: "2. Proses Pengambilan Keputusan" };
  if (code.startsWith("SS4-KK.KP.3")) return { aspek: "Ketepatan Proses", kelompok: "3. Proses Perencanaan" };
  if (code.startsWith("SS4-KK.TK.1")) return { aspek: "Tata Kelola", kelompok: "1. Sistem Kerja" };
  if (code.startsWith("SS4-KK.TK.2")) return { aspek: "Tata Kelola", kelompok: "2. Budaya Kerja" };
  if (code.startsWith("SS4-KK.TK.3")) return { aspek: "Tata Kelola", kelompok: "3. Pengendalian Risiko" };
  return { aspek: "Lainnya", kelompok: "Lainnya" };
}

const s4Rels = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4 && r.scope === "INTERNAL");

const rawRows = [];
for (const r of s4Rels) {
  const src = indicatorMap.get(r.source);
  const dst = indicatorMap.get(r.target);
  const { aspek, kelompok } = getKKAspectAndGroup(r.source);
  const dstInst = dst ? dst.instrumentCode : r.target.split(".")[0].replace("SS4-", "");
  rawRows.push({
    source: kelompok,
    sourceCode: r.source,
    sourceAspek: aspek,
    sourceKelompok: kelompok,
    destInst: dstInst,
    dest: r.target,
    destCode: r.target
  });
}

console.log("Total rawRows:", rawRows.length);

// Grouping with unique (sourceCode, destCode) for S4
const byPair = new Map();
for (const r of rawRows) {
  const key = `${r.sourceCode}\u241f${r.destCode}`;
  if (!byPair.has(key)) {
    byPair.set(key, {
      source: r.source,
      sourceCode: r.sourceCode,
      sourceAspek: r.sourceAspek,
      sourceKelompok: r.sourceKelompok,
      destInst: r.destInst,
      dest: r.dest,
      destCode: r.destCode,
      items: []
    });
  }
  byPair.get(key).items.push(r);
}

const pairs = [...byPair.values()];
console.log("Total unique pairs in S4:", pairs.length);

const s4Aspects = [
  {
    id: "Ketepatan Fungsi",
    name: "Ketepatan Fungsi",
    groups: [
      "1. Mandat (Core Function)",
      "2. Distribusi Kewenangan",
      "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung"
    ]
  },
  {
    id: "Ketepatan Ukuran",
    name: "Ketepatan Ukuran",
    groups: [
      "1. Rentang Kendali",
      "2. Departemensi (Pembidangan)"
    ]
  },
  {
    id: "Ketepatan Proses",
    name: "Ketepatan Proses",
    groups: [
      "1. Proses Bisnis",
      "2. Proses Pengambilan Keputusan",
      "3. Proses Perencanaan"
    ]
  },
  {
    id: "Tata Kelola",
    name: "Tata Kelola",
    groups: [
      "1. Sistem Kerja",
      "2. Budaya Kerja",
      "3. Pengendalian Risiko"
    ]
  }
];

const dests = ["IPPN", "CKKP", "SPIP", "SAKIP", "ELPPD", "IKPA", "IPA"];

console.log("\n=== 4 ASPEK MATRIX CALCULATION ===");
let grandTotal = 0;
const colTotals = {};
dests.forEach(d => colTotals[d] = 0);

for (const asp of s4Aspects) {
  let rowTotal = 0;
  const colCounts = [];
  for (const dst of dests) {
    const matches = pairs.filter(p => p.sourceAspek === asp.id && p.destInst === dst);
    const cnt = matches.length;
    rowTotal += cnt;
    colTotals[dst] += cnt;
    colCounts.push(`${dst}: ${cnt}`);
  }
  grandTotal += rowTotal;
  console.log(`Aspek: [${asp.name}] -> Row Total: ${rowTotal} | Cells: ${colCounts.join(", ")}`);
  
  // Also check sub-groups
  for (const grp of asp.groups) {
    let grpRowTotal = 0;
    const grpColCounts = [];
    for (const dst of dests) {
      const cnt = pairs.filter(p => p.sourceKelompok === grp && p.destInst === dst).length;
      grpRowTotal += cnt;
      grpColCounts.push(`${dst}:${cnt}`);
    }
    console.log(`   ↳ Kelompok: ${grp} -> Total: ${grpRowTotal} | (${grpColCounts.join(", ")})`);
  }
}

console.log("\n=== COLUMN TOTALS ===");
for (const dst of dests) {
  console.log(`Column ${dst}: ${colTotals[dst]}`);
}
console.log(`\nGrand Total: ${grandTotal}`);

