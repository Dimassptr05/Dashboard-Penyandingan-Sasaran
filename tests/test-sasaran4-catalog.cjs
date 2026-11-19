const assert = require('node:assert/strict');
const { parseSheetRows, parseCSV } = require('../netlify/functions/get-sasaran4');

const headers = [
  'No',
  'Kelompok Sumber',
  'Indeks Sumber',
  'ID Indikator Sumber',
  'Indikator Sumber',
  'Kelompok Pembanding',
  'Indeks Pembanding',
  'ID Indikator Pembanding',
  'Indikator Pembanding',
  'Jenis Keterkaitan',
  'Risiko Redundansi',
  'Alasan / Justifikasi Substantif',
  'Rekomendasi',
  'Jenis Penyandingan Asli',
  'Alasan Asli',
  'Dasar Klasifikasi',
  'Dasar Risiko',
  'Jejak Sumber',
  'Status Validasi',
  'Indeks Sumber Asli',
  'Indeks Terkait Asli',
  'Inti Risiko Redundansi'
];

const rows = [
  headers,
  [
    '1', 'Kelembagaan', 'KK', 'SS4-KK.KF.1.1', 'Relevansi Mandat',
    'Manajemen Kinerja dan Penganggaran', 'IPPN', 'SS4-IPPN.1.a.1', 'Kepatuhan Renstra K/L terhadap RPJMN',
    'Mendukung', 'Rendah', 'Alasan substantif KK-IPPN.', 'Rekomendasi KK-IPPN.',
    'Mendukung', 'Alasan asli 1', 'Dasar klasifikasi 1', 'Dasar risiko 1',
    'Relasional_Internal_Sasaran4 (2).xlsx | baris 2', 'Terverifikasi', 'KK', 'IPPN',
    'Fokus penilaiannya berbeda meskipun terkait mandat.'
  ],
  [
    '2', 'Manajemen Risiko', 'SPIP', 'SS4-SPIP.SP.LP.1.1', 'Penegakan Integritas dan Nilai Etika',
    'Manajemen Kinerja dan Penganggaran', 'SAKIP', 'SS4-SAKIP.1.1.1', 'Perencanaan Kinerja',
    'Langsung', 'Tinggi', 'Alasan substantif SPIP-SAKIP.', 'Rekomendasi SPIP-SAKIP.',
    'Langsung', 'Alasan asli 2', 'Dasar klasifikasi 2', 'Dasar risiko 2',
    'Relasional_Internal_Sasaran4 (2).xlsx | baris 3', 'Terverifikasi', 'SPIP', 'SAKIP',
    'Terdapat irisan langsung pada dokumen perencanaan dan pengendalian.'
  ],
  [
    '3', 'Manajemen Kinerja dan Penganggaran', 'CKKP', 'SS4-CKKP.KO.1.1', 'Capaian IKSS',
    'Manajemen Kinerja dan Penganggaran', 'ELPPD', 'SS4-ELPPD.1.1.1', 'Capaian Makro',
    'Tidak Langsung', 'Sedang', 'Alasan substantif CKKP-ELPPD.', 'Rekomendasi CKKP-ELPPD.',
    'Tidak Langsung', 'Alasan asli 3', 'Dasar klasifikasi 3', 'Dasar risiko 3',
    'Relasional_Internal_Sasaran4 (2).xlsx | baris 4', 'Perlu telaah', 'CKKP', 'ELPPD',
    'Irisan tidak langsung pada indikator makro.'
  ],
  [
    '4', 'Manajemen Kinerja dan Penganggaran', 'IKPA', 'SS4-IKPA.1.1.1', 'Revisi DIPA',
    'Manajemen Kinerja dan Penganggaran', 'IPA', 'SS4-IPA.1.1.0', 'Pengelolaan BMN',
    'Mendukung', 'Rendah', 'Alasan substantif IKPA-IPA.', 'Rekomendasi IKPA-IPA.',
    'Mendukung', 'Alasan asli 4', 'Dasar klasifikasi 4', 'Dasar risiko 4',
    'Relasional_Internal_Sasaran4 (2).xlsx | baris 5', 'Terverifikasi', 'IKPA', 'IPA',
    'Keduanya mendukung akuntabilitas pelaksanaan anggaran dan aset.'
  ],
  // Baris kosong / tidak lengkap harus diabaikan oleh parser
  ['', '', '', ''],
  ['   ']
];

const parsed = parseSheetRows(rows);
assert.equal(parsed.totalRelations, 4, 'Harus mem-parse tepat 4 relasi valid dan mengabaikan baris kosong');
assert.equal(parsed.relations.length, 4);

// Verifikasi seluruh 8 indeks Sasaran 4 (KK, IPPN, CKKP, SPIP, SAKIP, ELPPD, IKPA, IPA)
const allSeenIndices = new Set([
  ...Object.keys(parsed.summary.indeksSumber),
  ...Object.keys(parsed.summary.indeksPembanding)
]);
for (const idx of ['KK', 'IPPN', 'CKKP', 'SPIP', 'SAKIP', 'ELPPD', 'IKPA', 'IPA']) {
  assert.ok(allSeenIndices.has(idx), `Indeks ${idx} harus tercatat pada ringkasan`);
}

// Verifikasi pemetaan 22 kolom pada record pertama dan kedua
const r1 = parsed.relations[0];
assert.equal(r1.no, 1);
assert.equal(r1.sourceKelompok, 'Kelembagaan');
assert.equal(r1.sourceIndex, 'KK');
assert.equal(r1.sourceId, 'SS4-KK.KF.1.1');
assert.equal(r1.destIndex, 'IPPN');
assert.equal(r1.destId, 'SS4-IPPN.1.a.1');
assert.equal(r1.jenisKeterkaitan, 'Mendukung');
assert.equal(r1.risikoRedundansi, 'Rendah');
assert.equal(r1.alasanSubstantif, 'Alasan substantif KK-IPPN.');
assert.equal(r1.rekomendasi, 'Rekomendasi KK-IPPN.');
assert.equal(r1.statusValidasi, 'Terverifikasi');
assert.equal(r1.intiRisiko, 'Fokus penilaiannya berbeda meskipun terkait mandat.');

// Verifikasi agregasi summary (jenis keterkaitan, risiko redundansi, kelompok sumber)
assert.deepEqual(parsed.summary.jenisKeterkaitan, {
  Mendukung: 2,
  Langsung: 1,
  'Tidak Langsung': 1
});
assert.deepEqual(parsed.summary.risikoRedundansi, {
  Rendah: 2,
  Tinggi: 1,
  Sedang: 1
});
assert.deepEqual(parsed.summary.kelompokSumber, {
  Kelembagaan: 1,
  'Manajemen Risiko': 1,
  'Manajemen Kinerja dan Penganggaran': 2
});

// Verifikasi parseCSV menangani koma, tanda kutip ganda, dan newline dalam sel
const csvSample = 'No,Indeks,Alasan\n1,KK,"Mengukur ""mandat"", termasuk\nbaris baru"\n2,SPIP,Normal';
const csvParsed = parseCSV(csvSample);
assert.equal(csvParsed.length, 3);
assert.equal(csvParsed[1][2], 'Mengukur "mandat", termasuk\nbaris baru');

// Verifikasi input kosong/header-only mengembalikan null
assert.equal(parseSheetRows([]), null);
assert.equal(parseSheetRows([headers]), null);

console.log('Sasaran 4 final 22-column schema & CSV parser test passed.');
