import openpyxl, re, json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb['Sheet1']

INST_MAP = {
    'Indeks Perencanaan Pembangunan Nasional (IPPN)': 'IPPN',
    'Capaian Kontribusi Kinerja Pembangunan (CKKP)': 'CKKP',
    'SPIP': 'SPIP',
    'Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)': 'SAKIP',
    'Evaluasi LPPD (ELPPD)': 'ELPPD',
    'Indikator Kinerja Pelaksanaan Anggaran (IKPA)': 'IKPA',
    'Indeks Pengelolaan Aset (IPA)': 'IPA'
}

rows_audit = []
for r in range(2, 170):
    src_id = sheet.cell(r, 2).value
    if not src_id:
        continue
    src_id = str(src_id).strip()
    tgt_id = str(sheet.cell(r, 8).value).strip()
    tgt_inst_raw = str(sheet.cell(r, 7).value or '').strip()
    tgt_inst = INST_MAP.get(tgt_inst_raw, tgt_inst_raw)
    tgt_rincian = str(sheet.cell(r, 9).value or '').strip()
    
    jenis_raw = str(sheet.cell(r, 10).value or '').strip()
    if jenis_raw.lower() == 'tidak langsung':
        jenis = 'Tidak Langsung'
    else:
        jenis = jenis_raw

    col_l = sheet.cell(r, 12).value
    col_r = sheet.cell(r, 18).value

    # Extract Alasan according to rules
    if not col_l or not str(col_l).strip():
        alasan = ""
        cond = "C"
    else:
        text_l = str(col_l).strip()
        m = re.search(r'hasil\s*analisis\s*ai\s*[:=]\s*', text_l, re.IGNORECASE)
        if m:
            alasan = text_l[m.end():].strip()
            cond = "A"
        else:
            alasan = text_l
            cond = "B"

    rekom = str(col_r or '').strip()

    rows_audit.append({
        'row': r,
        'no': sheet.cell(r, 1).value,
        'src_id': src_id,
        'tgt_id': tgt_id,
        'tgt_inst': tgt_inst,
        'jenis': jenis,
        'cond': cond,
        'alasan': alasan,
        'rekom': rekom
    })

print(f"Total extracted rows: {len(rows_audit)}")
from collections import Counter
print("Klasifikasi Jenis (Kolom J):", Counter(r['jenis'] for r in rows_audit))
print("Kondisi Kolom L:", Counter(r['cond'] for r in rows_audit))
print("Per-Instrumen Pembanding:", Counter(r['tgt_inst'] for r in rows_audit))

# Check for any empty fields
empty_alasan = [r for r in rows_audit if not r['alasan']]
empty_rekom = [r for r in rows_audit if not r['rekom']]
print(f"Empty alasan count: {len(empty_alasan)}")
print(f"Empty rekomendasi count: {len(empty_rekom)}")

# Check if any alasan still has marker
still_has_marker = [r for r in rows_audit if 'hasil analisis ai' in r['alasan'].lower()]
print(f"Alasan still containing marker: {len(still_has_marker)}")

