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

// Load app.js functions or simulate listRawRelations & sourceComponents & groupRelations
const sasaranData = window.RB_SASARAN_DATA;
const indicatorMap = new Map();
sasaranData.indikators.forEach(item => indicatorMap.set(item.code, item));
const getSubstansi = code => (window.RB_SUBSTANSI_INDIKATOR && window.RB_SUBSTANSI_INDIKATOR[code]) || null;
const jk = window.RB_JENIS_KETERKAITAN;

function getKKGroup(code) {
  if (code.startsWith("SS4-KK.KF.1")) return "1. Mandat (Core Function)";
  if (code.startsWith("SS4-KK.KF.2")) return "2. Distribusi Kewenangan";
  if (code.startsWith("SS4-KK.KF.3")) return "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung";
  if (code.startsWith("SS4-KK.KU.1")) return "1. Rentang Kendali";
  if (code.startsWith("SS4-KK.KU.2")) return "2. Departemensi (Pembidangan)";
  if (code.startsWith("SS4-KK.KP.1")) return "1. Proses Bisnis";
  if (code.startsWith("SS4-KK.KP.2")) return "2. Proses Pengambilan Keputusan";
  if (code.startsWith("SS4-KK.KP.3")) return "3. Proses Perencanaan";
  if (code.startsWith("SS4-KK.TK.1")) return "1. Sistem Kerja";
  if (code.startsWith("SS4-KK.TK.2")) return "2. Budaya Kerja";
  if (code.startsWith("SS4-KK.TK.3")) return "3. Pengendalian Risiko";
  return "Lainnya";
}

const kkComps = [
  "1. Mandat (Core Function)",
  "2. Distribusi Kewenangan",
  "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung",
  "1. Rentang Kendali",
  "2. Departemensi (Pembidangan)",
  "1. Proses Bisnis",
  "2. Proses Pengambilan Keputusan",
  "3. Proses Perencanaan",
  "1. Sistem Kerja",
  "2. Budaya Kerja",
  "3. Pengendalian Risiko"
];

const dests = ["IPPN", "CKKP", "SPIP", "SAKIP", "ELPPD", "IKPA", "IPA"];

const s4Rels = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4 && r.scope === "INTERNAL");

const rawRows = [];
for (const r of s4Rels) {
  const src = indicatorMap.get(r.source);
  const dst = indicatorMap.get(r.target);
  const srcGroup = getKKGroup(r.source);
  const dstInst = dst ? dst.instrumentCode : r.target.split(".")[0].replace("SS4-", "");
  rawRows.push({
    source: srcGroup,
    destInst: dstInst,
    dest: r.target,
    sourceCode: r.source,
    destCode: r.target
  });
}

// GroupRelations
const byPair = new Map();
for (const r of rawRows) {
  const key = `${r.source}\u241f${r.destInst}\u241f${r.dest}`;
  if (!byPair.has(key)) {
    byPair.set(key, {
      source: r.source,
      destInst: r.destInst,
      dest: r.dest,
      items: []
    });
  }
  byPair.get(key).items.push(r);
}
const pairs = [...byPair.values()];
console.log("Total grouped pairs:", pairs.length);

let matrixTotal = 0;
for (const comp of kkComps) {
  let rowTotal = 0;
  for (const dstCode of dests) {
    const matches = pairs.filter(p => p.source === comp && p.destInst === dstCode);
    const cnt = matches.length;
    rowTotal += cnt;
  }
  console.log(`Comp: ${comp} => rowTotal: ${rowTotal}`);
  matrixTotal += rowTotal;
}
console.log("Matrix Total:", matrixTotal);

