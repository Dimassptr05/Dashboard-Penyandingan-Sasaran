import json, openpyxl, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("=== APPLYING FINAL SASARAN 4 IMPLEMENTATION ===")

# 1. Read Excel
excel_path = 'data-final-sasaran4/Kerja Kelompok 1 (3).xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)
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

rows_data = []
count_a = 0
count_b = 0
count_c = 0

for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if not val_id:
        continue
    src_id = str(val_id).strip()
    tgt_id = str(sheet.cell(r, 8).value).strip()
    tgt_inst_raw = str(sheet.cell(r, 7).value or '').strip()
    tgt_inst = INST_MAP.get(tgt_inst_raw, tgt_inst_raw)
    
    jenis_raw = str(sheet.cell(r, 10).value or '').strip()
    if jenis_raw.lower() == 'tidak langsung':
        jenis = 'Tidak Langsung'
    else:
        jenis = jenis_raw

    col_l = sheet.cell(r, 12).value
    col_r = sheet.cell(r, 18).value

    # Specific rule for Column L
    if not col_l or not str(col_l).strip():
        alasan = ""
        cond = "C"
        count_c += 1
    else:
        text_l = str(col_l).strip()
        m = re.search(r'hasil\s*analisis\s*ai\s*[:=]\s*', text_l, re.IGNORECASE)
        if m:
            alasan = text_l[m.end():].strip()
            cond = "A"
            count_a += 1
        else:
            alasan = text_l
            cond = "B"
            count_b += 1

    rekom = str(col_r or '').strip()

    rows_data.append({
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

print(f"Total rows extracted: {len(rows_data)}")
print(f"  - Kondisi A (Hasil analisis AI): {count_a}")
print(f"  - Kondisi B (Seluruh isi Kolom L): {count_b}")
print(f"  - Kondisi C (Kolom L kosong): {count_c}")
assert len(rows_data) == 168
assert count_a == 24
assert count_b == 144
assert count_c == 0

# 2. Build sasaran4Justifikasi for data/jenis-keterkaitan.js
new_s4_justifikasi = {}
for r in rows_data:
    key = f"{r['src_id']}_{r['tgt_id']}"
    new_s4_justifikasi[key] = {
        "jenis": r['jenis'],
        "alasan": r['alasan'],
        "rekomendasi": r['rekom']
    }

print(f"Total keys in sasaran4Justifikasi: {len(new_s4_justifikasi)}")

# Update data/jenis-keterkaitan.js
with open('data/jenis-keterkaitan.js', 'r', encoding='utf-8') as f:
    jk_text = f.read()

s4_start = jk_text.find('sasaran4Justifikasi: {')
s5_start = jk_text.find('sasaran5Justifikasi: {')
assert s4_start != -1 and s5_start != -1

formatted_json = json.dumps(new_s4_justifikasi, ensure_ascii=False, indent=4)
indented_json = "\n".join("    " + line if idx > 0 else line for idx, line in enumerate(formatted_json.split("\n")))

new_jk_text = jk_text[:s4_start] + "sasaran4Justifikasi: " + indented_json + ",\n" + jk_text[s5_start:]

with open('data/jenis-keterkaitan.js', 'w', encoding='utf-8') as f:
    f.write(new_jk_text)

print("Updated data/jenis-keterkaitan.js successfully.")

# 3. Update data-sasaran.js relations
with open('data-sasaran.js', 'r', encoding='utf-8') as f:
    ds_text = f.read()

ds_prefix = 'window.RB_SASARAN_DATA = '
ds_data = json.loads(ds_text.split(ds_prefix)[1].rsplit(';', 1)[0].strip())

# Filter out old S4 internal relations
preserved_relations = [r for r in ds_data['relations'] if not (r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 4)]

# Build 168 relations
new_s4_relations = []
for r in rows_data:
    new_s4_relations.append({
        "scope": "INTERNAL",
        "source": r['src_id'],
        "target": r['tgt_id'],
        "sourceCell": f"Kerja Kelompok 1 (3).xlsx!B{r['row']}",
        "relationColumn": "Informasi Keterkaitan",
        "sourceSasaran": 4,
        "targetSasaran": 4,
        "sourceInstrument": "KK",
        "targetInstrument": r['tgt_inst'],
        "strengthVariants": [],
        "strength": None
    })

ds_data['relations'] = preserved_relations + new_s4_relations
ds_data['metadata']['relasiInternalPerSasaran']['4'] = 168
ds_data['metadata']['totalRelasiInternal'] = sum(1 for r in ds_data['relations'] if r.get('scope') == 'INTERNAL')
ds_data['metadata']['totalRelasiEksplisit'] = len(ds_data['relations'])
ds_data['metadata']['totalRelasiInternalDitampilkan'] = ds_data['metadata']['totalRelasiInternal']

new_ds_text = f"/* DATA TERPADU PETA RELASI RB - Sasaran 4 diperbarui dari Kerja Kelompok 1 (3).xlsx (168 relasi final) */\nwindow.RB_SASARAN_DATA = {json.dumps(ds_data, ensure_ascii=False)};\n"
with open('data-sasaran.js', 'w', encoding='utf-8') as f:
    f.write(new_ds_text)

print("Updated data-sasaran.js successfully.")

# 4. Bump cache in index.html to 20261109_v7
with open('index.html', 'r', encoding='utf-8') as f:
    html_text = f.read()

html_text = re.sub(r'v=20261105_v6', 'v=20261109_v7', html_text)
html_text = re.sub(r'v=20261104_v5', 'v=20261109_v7', html_text)
html_text = re.sub(r'v=20261103_v4', 'v=20261109_v7', html_text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_text)

print("Updated index.html cache versions successfully.")
print("=== IMPLEMENTATION COMPLETED ===")

