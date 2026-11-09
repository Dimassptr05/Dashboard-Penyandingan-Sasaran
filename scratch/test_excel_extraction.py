import json, openpyxl, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 1. Load Excel
wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb.active

INST_MAP = {
    'Indeks Perencanaan Pembangunan Nasional (IPPN)': 'IPPN',
    'Capaian Kontribusi Kinerja Pembangunan (CKKP)': 'CKKP',
    'SPIP': 'SPIP',
    'Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)': 'SAKIP',
    'Evaluasi LPPD (ELPPD)': 'ELPPD',
    'Indikator Kinerja Pelaksanaan Anggaran (IKPA)': 'IKPA',
    'Indeks Pengelolaan Aset (IPA)': 'IPA'
}

INST_NAME_MAP = {
    'IPPN': 'Indeks Perencanaan Pembangunan Nasional',
    'CKKP': 'Capaian Kontribusi Kinerja Pembangunan',
    'SPIP': 'Sistem Pengendalian Intern Pemerintah',
    'SAKIP': 'Sistem Akuntabilitas Kinerja Instansi Pemerintah',
    'ELPPD': 'Evaluasi Penyelenggaraan Pemerintahan Daerah',
    'IKPA': 'Indikator Kinerja Pelaksanaan Anggaran',
    'IPA': 'Indeks Pengelolaan Aset'
}

INST_PEMBINA_MAP = {
    'IPPN': 'Kementerian PPN/Bappenas',
    'CKKP': 'Kementerian PPN/Bappenas',
    'SPIP': 'BPKP',
    'SAKIP': 'Kementerian PANRB',
    'ELPPD': 'Kementerian Dalam Negeri',
    'IKPA': 'Kementerian Keuangan',
    'IPA': 'Kementerian Keuangan'
}

rows_data = []
for r in range(2, 170):
    src_id = sheet.cell(r, 2).value
    if not src_id:
        continue
    src_id = str(src_id).strip()
    tgt_inst_raw = str(sheet.cell(r, 7).value or '').strip()
    tgt_inst = INST_MAP.get(tgt_inst_raw, tgt_inst_raw)
    tgt_id = str(sheet.cell(r, 8).value or '').strip()
    tgt_rincian = str(sheet.cell(r, 9).value or '').strip()
    jenis_raw = str(sheet.cell(r, 10).value or '').strip()
    # Normalize 'Tidak langsung' to 'Tidak Langsung'
    if jenis_raw.lower() == 'tidak langsung':
        jenis = 'Tidak Langsung'
    else:
        jenis = jenis_raw
    
    alasan = str(sheet.cell(r, 12).value or '').strip() # Col L verbatim
    rekomendasi = str(sheet.cell(r, 18).value or '').strip() # Col R verbatim
    
    rows_data.append({
        'row': r,
        'no': sheet.cell(r, 1).value,
        'src_id': src_id,
        'src_aspek': sheet.cell(r, 3).value,
        'src_kelompok': sheet.cell(r, 4).value,
        'src_ind': sheet.cell(r, 5).value,
        'src_def': sheet.cell(r, 6).value,
        'tgt_inst_raw': tgt_inst_raw,
        'tgt_inst': tgt_inst,
        'tgt_id': tgt_id,
        'tgt_rincian': tgt_rincian,
        'jenis': jenis,
        'alasan': alasan,
        'rekomendasi': rekomendasi
    })

print(f"Extracted {len(rows_data)} rows from Excel.")
from collections import Counter
counts = Counter(r['jenis'] for r in rows_data)
print("Classification counts:", counts)
assert len(rows_data) == 168, f"Expected 168 rows, got {len(rows_data)}"
assert counts['Mendukung'] == 97, f"Expected 97 Mendukung, got {counts['Mendukung']}"
assert counts['Langsung'] == 61, f"Expected 61 Langsung, got {counts['Langsung']}"
assert counts['Tidak Langsung'] == 10, f"Expected 10 Tidak Langsung, got {counts['Tidak Langsung']}"
print("Count assertions passed perfectly!")

