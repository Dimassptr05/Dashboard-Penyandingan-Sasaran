const assert = require('node:assert/strict');
const { parseSheetRows } = require('../netlify/functions/get-sasaran4');

const columnIndex = reference => {
  let value = 0;
  for (const char of reference.match(/[A-Z]+/)[0]) value = value * 26 + char.charCodeAt(0) - 64;
  return value - 1;
};
const cell = (row, reference, value) => { row[columnIndex(reference)] = value; };
const row = () => Array(85).fill('');
const headers = row();
for (const [reference, title] of Object.entries({
  BQ: 'ID Indikator KK',
  BR: 'Aspek KK',
  BS: 'Kelompok KK',
  BT: 'Indikator KK',
  BU: 'Definisi Operasional KK',
  BV: 'Indeks Pembanding',
  BW: 'ID Indikator Pembanding',
  BX: 'Indikator / Rincian Pembanding',
  BY: 'Informasi Keterkaitan',
  CA: 'Alasan / Justifikasi Substantif Edit',
  CG: 'Perlakuan / to-do yang disarankan'
})) cell(headers, reference, title);
const first = row();
cell(first, 'BQ', 'SS4-KK.KF.1.1');
cell(first, 'BR', 'Ketepatan Fungsi');
cell(first, 'BS', 'Mandat');
cell(first, 'BT', 'Relevansi');
cell(first, 'BV', 'IPPN');
cell(first, 'BW', 'SS4-IPPN.1.a.1');
cell(first, 'J', 'SS4-IPPN.1.a.1');
cell(first, 'K', 'Kepatuhan Renstra');
cell(first, 'L', 'Muatan sesuai RPJMN');
cell(first, 'N', 'Definisi IPPN');
cell(first, 'R', 'SS4-CKKP.KO.1.1');
cell(first, 'S', 'Kinerja Organisasi');
cell(first, 'T', 'Penilaian kinerja');
cell(first, 'U', 'Capaian IKSS');
cell(first, 'V', 'Definisi CKKP');
cell(first, 'Z', 'SS4-SPIP.SP.LP.1.1');
cell(first, 'AA', 'Struktur dan Proses');
cell(first, 'AB', 'Lingkungan Pengendalian');
cell(first, 'AC', 'Integritas');
cell(first, 'AD', 'Definisi SPIP');
cell(first, 'AH', 'SS4-SAKIP.1.1.1');
cell(first, 'AI', 'Perencanaan Kinerja');
cell(first, 'AJ', 'Dokumen tersedia');
cell(first, 'AK', 'Pedoman teknis');
cell(first, 'AL', 'Definisi SAKIP');
cell(first, 'AP', 'SS4-ELPPD.1.1.1');
cell(first, 'AQ', 'Capaian Kinerja');
cell(first, 'AR', 'Capaian Makro');
cell(first, 'AS', 'IPM');
cell(first, 'AT', 'Definisi ELPPD');
cell(first, 'AX', 'SS4-IKPA.1.1.1');
cell(first, 'AY', 'Kualitas Anggaran');
cell(first, 'AZ', 'Revisi DIPA');
cell(first, 'BA', 'Pernyataan IKPA');
cell(first, 'BB', 'Definisi IKPA');
cell(first, 'BG', 'SS4-IPA.1.1.0');
cell(first, 'BH', 'Pengelolaan BMN');
cell(first, 'BI', 'Tindak lanjut LHP');
cell(first, 'BJ', '-');
cell(first, 'BK', 'Definisi IPA');
const second = row();
cell(second, 'BQ', 'SS4-KK.KF.1.2');
cell(second, 'BR', 'Ketepatan Fungsi');
cell(second, 'BS', 'Mandat');
cell(second, 'BT', 'Implementasi');
cell(second, 'R', 'SS4-CKKP.KO.1.2');
cell(second, 'U', 'Realisasi RO');
cell(second, 'V', 'Definisi cakupan kedua');

const parsed = parseSheetRows([headers, first, second]);
assert.equal(parsed.totalRelations, 2);
for (const instrument of ['IPPN', 'CKKP', 'SPIP', 'SAKIP', 'ELPPD', 'IKPA', 'IPA']) {
  assert(parsed.catalog[`SS4-${instrument}.` + ({
    IPPN: '1.a.1', CKKP: 'KO.1.1', SPIP: 'SP.LP.1.1', SAKIP: '1.1.1',
    ELPPD: '1.1.1', IKPA: '1.1.1', IPA: '1.1.0'
  }[instrument])], `Expected ${instrument} metadata from spreadsheet columns`);
}
assert.equal(parsed.catalog['SS4-IKPA.1.1.1'].definisi_operasional, 'Definisi IKPA');
assert.equal(parsed.catalog['SS4-IPA.1.1.0'].definisi_operasional, 'Definisi IPA');
assert.equal(parsed.catalog['SS4-CKKP.KO.1.2'].kategori, 'Kinerja Organisasi');
assert.equal(parsed.catalog['SS4-CKKP.KO.1.2'].indikator, 'Penilaian kinerja');
assert.equal(parsed.catalog['SS4-CKKP.KO.1.2'].cakupan, 'Realisasi RO');
for (const [instrument, suffix, field, definition] of [
  ['IPPN', '1.a.1', 'sub_indikator', 'Definisi IPPN'],
  ['CKKP', 'KO.1.1', 'cakupan', 'Definisi CKKP'],
  ['SPIP', 'SP.LP.1.1', 'sub_uraian', 'Definisi SPIP'],
  ['SAKIP', '1.1.1', 'kriteria', 'Definisi SAKIP'],
  ['ELPPD', '1.1.1', 'indikator', 'Definisi ELPPD'],
  ['IKPA', '1.1.1', 'pernyataan', 'Definisi IKPA'],
  ['IPA', '1.1.0', 'sub_parameter', 'Definisi IPA']
]) {
  const entry = parsed.catalog[`SS4-${instrument}.${suffix}`];
  assert(entry[field], `Expected ${instrument} level-3 field`);
  assert.equal(entry.definisi_operasional, definition);
}
console.log('Sasaran 4 catalog parser test passed.');
