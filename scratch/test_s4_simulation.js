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

const appCode = fs.readFileSync('app.js', 'utf-8');

// Test listRawRelations simulation specifically for S4
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

const s4Rels = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4 && r.scope === "INTERNAL");
console.log("Total S4 raw relations:", s4Rels.length);
if (s4Rels.length !== 168) {
  throw new Error(`Expected 168 S4 raw relations, got ${s4Rels.length}`);
}

const classified = [];
for (const r of s4Rels) {
  const src = indicatorMap.get(r.source);
  const dst = indicatorMap.get(r.target);
  const subSrc = getSubstansi(r.source);
  const subDst = getSubstansi(r.target);
  const srcGroup = getKKGroup(r.source);
  const dstInst = dst ? dst.instrumentCode : r.target.split(".")[0].replace("SS4-", "");
  
  const meta = jk.classifySasaran4(srcGroup, dstInst, "", r.source, r.target);
  classified.push({
    source: r.source,
    target: r.target,
    srcGroup,
    dstInst,
    jenis: meta.jenis,
    alasan: meta.alasan,
    rekom: meta.rekomendasi,
    hasSubSrc: !!subSrc,
    hasSubDst: !!subDst
  });
}

const typeCounter = {};
const instCounter = {};
const groupCounter = {};

for (const c of classified) {
  typeCounter[c.jenis] = (typeCounter[c.jenis] || 0) + 1;
  instCounter[c.dstInst] = (instCounter[c.dstInst] || 0) + 1;
  groupCounter[c.srcGroup] = (groupCounter[c.srcGroup] || 0) + 1;
  if (!c.hasSubSrc) throw new Error(`Missing subSrc for ${c.source}`);
  if (!c.hasSubDst) throw new Error(`Missing subDst for ${c.target}`);
  if (!c.alasan) throw new Error(`Missing alasan for ${c.source}_${c.target}`);
  if (!c.rekom) throw new Error(`Missing rekomendasi for ${c.source}_${c.target}`);
}

console.log("\nType Breakdown in app simulation:");
console.log(typeCounter);
console.log("\nComparator Index Breakdown (each should be 24):");
console.log(instCounter);
console.log("\nKK Group Breakdown:");
console.log(groupCounter);

if (typeCounter['Mendukung'] !== 97 || typeCounter['Langsung'] !== 61 || typeCounter['Tidak Langsung'] !== 10) {
  throw new Error("Classification breakdown does not match user requirements!");
}

for (const inst of ["IPPN", "CKKP", "SPIP", "SAKIP", "ELPPD", "IKPA", "IPA"]) {
  if (instCounter[inst] !== 24) {
    throw new Error(`Expected 24 relations for ${inst}, got ${instCounter[inst]}`);
  }
}

console.log("\n=> ALL S4 APP SIMULATION TESTS PASSED PERFECTLY!");

