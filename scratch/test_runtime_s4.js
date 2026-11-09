const fs = require('fs');

// Mock window and document
global.window = global;
global.document = {
  getElementById: () => ({ classList: { add: () => {}, remove: () => {} }, style: {}, addEventListener: () => {} }),
  createElement: () => ({ style: {} }),
  querySelectorAll: () => []
};

// Load scripts in order
require('../data-sasaran.js');
require('../data/jenis-keterkaitan.js');
require('../data/substansi-indikator.js');

console.log("Scripts loaded successfully.");
console.log("RB_SASARAN_DATA relations count:", window.RB_SASARAN_DATA.relations.length);
console.log("RB_SUBSTANSI_INDIKATOR keys count:", Object.keys(window.RB_SUBSTANSI_INDIKATOR).length);
console.log("RB_JENIS_KETERKAITAN sasaran4Justifikasi keys count:", Object.keys(window.RB_JENIS_KETERKAITAN.sasaran4Justifikasi).length);

// Test classifySasaran4 for sample keys
const jk = window.RB_JENIS_KETERKAITAN;
const testPairs = [
  ["SS4-KK.KF.1.1", "SS4-IPPN.1.c.4"],
  ["SS4-KK.KF.1.1", "SS4-CKKP.KO.1.1"],
  ["SS4-KK.KF.1.1", "SS4-SPIP.PT.EE.1.1"],
  ["SS4-KK.KF.1.1", "SS4-SAKIP.1.1.6"],
  ["SS4-KK.KF.1.1", "SS4-ELPPD.1.3.5"],
  ["SS4-KK.KF.1.1", "SS4-IKPA.1.1.1"],
  ["SS4-KK.KF.1.1", "SS4-IPA.1.1.0"]
];

testPairs.forEach(([src, tgt]) => {
  const res = jk.classifySasaran4("", "", "", src, tgt);
  console.log(`\nTest ${src} -> ${tgt}:`);
  console.log(`  Jenis: ${res.jenis}`);
  console.log(`  Alasan (first 60 chars): ${res.alasan.slice(0, 60)}...`);
  console.log(`  Rekomendasi (first 60 chars): ${res.rekomendasi.slice(0, 60)}...`);
  if (!res.jenis || !res.alasan || !res.rekomendasi) {
    throw new Error(`Incomplete classification for ${src} -> ${tgt}`);
  }
});

console.log("\n=> ALL RUNTIME CHECKS PASSED!");

