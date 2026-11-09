import json, openpyxl, re, sys, io, os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("=== STARTING FULL MIGRATION FOR SASARAN 4 ===")

# -------------------------------------------------------------
# 1. READ EXCEL DATA
# -------------------------------------------------------------
excel_path = 'data-final-sasaran4/Kerja Kelompok 1 (3).xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)
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

print(f"Loaded {len(rows_data)} rows from Excel.")
from collections import Counter
c = Counter(r['jenis'] for r in rows_data)
print("Breakdown:", c)
assert len(rows_data) == 168
assert c['Mendukung'] == 97
assert c['Langsung'] == 61
assert c['Tidak Langsung'] == 10

# -------------------------------------------------------------
# 2. LOAD RB_COMPARISON_S4 FOR METADATA REFERENCE
# -------------------------------------------------------------
with open('data/perbandingan-sasaran4.js', 'r', encoding='utf-8') as f:
    comp_text = f.read()
s4_comp = json.loads(comp_text.split('window.RB_COMPARISON_S4 = ')[1].rsplit(';', 1)[0].strip())
comp_ind = s4_comp.get('indicators', {})

# Unique target indicators
unique_targets = {}
for r in rows_data:
    tid = r['tgt_id']
    if tid not in unique_targets:
        unique_targets[tid] = {
            'inst': r['tgt_inst'],
            'rincian': r['tgt_rincian']
        }
print(f"Total unique target indicator IDs in Excel: {len(unique_targets)}")

# -------------------------------------------------------------
# 3. UPDATE data/substansi-indikator.js
# -------------------------------------------------------------
with open('data/substansi-indikator.js', 'r', encoding='utf-8') as f:
    substansi_text = f.read()

substansi_prefix = 'window.RB_SUBSTANSI_INDIKATOR = '
substansi_obj_str = substansi_text.split(substansi_prefix)[1].rsplit(';', 1)[0].strip()
substansi_data = json.loads(substansi_obj_str)
orig_substansi_count = len(substansi_data)
print(f"Original substansi count: {orig_substansi_count}")

new_indicators_substansi = {}
new_indicators_sasaran = {}

for tid, tinfo in unique_targets.items():
    inst = tinfo['inst']
    rincian = tinfo['rincian']
    ref = comp_ind.get(tid, {})
    ref_fields = {k: v for k, v in ref.get('fields', [])}
    claude_name = ref.get('claudeName', '')

    if tid in substansi_data:
        continue

    entry = {
        "code": tid,
        "sasaran_id": 4,
        "sasaran_name": "Sasaran 4 — Kapabilitas Kelembagaan",
        "instrument_code": inst,
        "instrument_name": INST_NAME_MAP[inst],
        "pembina": INST_PEMBINA_MAP[inst]
    }
    label = ""

    if inst == 'SPIP':
        komponen = ref_fields.get('Komponen/aspek') or ('PENCAPAIAN TUJUAN' if 'PT.' in tid else 'STRUKTUR DAN PROSES')
        unsur = ref_fields.get('Subkomponen/unsur') or ''
        if not unsur:
            if 'PT.EE' in tid: unsur = 'Efektivitas dan Efisiensi Pencapaian Tujuan Organisasi'
            elif 'PT.KTP' in tid: unsur = 'Keterjadian Tindak Pidana Korupsi'
            elif 'SP.LP' in tid: unsur = 'Lingkungan Pengendalian'
            elif 'SP.PR' in tid: unsur = 'Penilaian Risiko'
            elif 'SP.KP' in tid: unsur = 'Kegiatan Pengendalian'
        sub_uraian = ref_fields.get('Indikator/rincian') or claude_name or rincian
        definisi = ref_fields.get('Definisi operasional/keterangan') or ''
        
        entry['komponen'] = komponen
        entry['unsur'] = unsur
        entry['sub_uraian'] = sub_uraian
        if definisi:
            entry['definisi_operasional'] = definisi
        label = f"{komponen} — {unsur}: {sub_uraian}"

    elif inst == 'SAKIP':
        komponen = "Perencanaan Kinerja"
        sub_komp = "1.1 Pemenuhan Dokumen Perencanaan Kinerja"
        if tid.startswith("SS4-SAKIP.1.2"):
            sub_komp = "1.2 Kualitas Dokumen Perencanaan Kinerja"
        elif tid.startswith("SS4-SAKIP.1.3"):
            sub_komp = "1.3 Pemanfaatan Dokumen Perencanaan Kinerja"
        elif tid.startswith("SS4-SAKIP.2.1"):
            komponen = "Pengukuran Kinerja"
            sub_komp = "2.1 Pemenuhan Pengukuran Kinerja"
        elif tid.startswith("SS4-SAKIP.2.2"):
            komponen = "Pengukuran Kinerja"
            sub_komp = "2.2 Kualitas Pengukuran Kinerja"
        elif tid.startswith("SS4-SAKIP.3.2"):
            komponen = "Pelaporan Kinerja"
            sub_komp = "3.2 Kualitas Laporan Kinerja"
        elif tid.startswith("SS4-SAKIP.4.3"):
            komponen = "Evaluasi Akuntabilitas Kinerja Internal"
            sub_komp = "4.3 Pemanfaatan Hasil Evaluasi AKIP Internal"
        
        kriteria = ref_fields.get('Indikator/rincian') or rincian
        entry['komponen'] = komponen
        entry['sub_komponen'] = sub_komp
        entry['kriteria'] = kriteria
        label = f"{komponen} — {sub_komp}: {kriteria}"

    elif inst == 'ELPPD':
        kelompok = ref_fields.get('Komponen/aspek') or ''
        if not kelompok:
            if tid.startswith('SS4-ELPPD.1'):
                kelompok = 'Capaian Kinerja Makro'
            elif tid.startswith('SS4-ELPPD.2'):
                kelompok = 'CAPAIAN KINERJA PELAKSANAAN TUGAS PEMBANTUAN'
            elif tid.startswith('SS4-ELPPD.3'):
                kelompok = 'Capaian Kinerja Penyelenggaraan Urusan Pemerintahan Daerah'
        
        ind = ref_fields.get('Subkomponen/unsur') or claude_name or ''
        butir = ref_fields.get('Indikator/rincian') or rincian
        if not ind:
            ind = kelompok
        
        entry['aspek'] = kelompok
        entry['kelompok_penilaian'] = kelompok
        entry['indikator'] = ind
        entry['butir_penilaian'] = butir
        label = f"{kelompok} — {ind}: {butir}"

    elif inst == 'IKPA':
        aspek = ref_fields.get('Komponen/aspek') or ''
        if not aspek:
            if tid.startswith('SS4-IKPA.1'): aspek = '1. Kualitas Perencanaan Anggaran'
            elif tid.startswith('SS4-IKPA.2'): aspek = '2. Kualitas Pelaksanaan Anggaran'
            elif tid.startswith('SS4-IKPA.3'): aspek = '3. Kualitas Hasil Pelaksanaan Anggaran'
        aspek = aspek.replace('\n', ' ')
        indikator = ref_fields.get('Subkomponen/unsur') or claude_name
        pernyataan = ref_fields.get('Indikator/rincian') or rincian
        definisi = ref_fields.get('Definisi operasional/keterangan') or ''
        
        entry['aspek'] = aspek
        entry['indikator'] = indikator
        entry['pernyataan'] = pernyataan
        if definisi:
            entry['definisi_operasional'] = definisi
        label = f"{aspek} — {indikator}: {pernyataan}"

    elif inst == 'IPA':
        sasaran_strat = ref_fields.get('Komponen/aspek') or ''
        if not sasaran_strat:
            if tid.startswith('SS4-IPA.1'): sasaran_strat = 'Pengelolaan BMN yang Akuntabel dan Produktif'
            elif tid.startswith('SS4-IPA.2'): sasaran_strat = 'Kepatuhan pengelolaan BMN terhadap peraturan perundang-undangan'
            elif tid.startswith('SS4-IPA.3'): sasaran_strat = 'Pengawasan dan Pengendalian BMN yang efektif'
            elif tid.startswith('SS4-IPA.4'): sasaran_strat = 'Tata Kelola BMN yang Efektif dan Efisien'
        sasaran_strat = sasaran_strat.replace('\n', ' ').strip()
        param = ref_fields.get('Subkomponen/unsur') or claude_name or ''
        sub_param = ref_fields.get('Indikator/rincian') or rincian
        
        entry['sasaran_strategis'] = sasaran_strat
        entry['parameter'] = param
        entry['sub_parameter'] = sub_param
        label = f"{sasaran_strat} — {param}: {sub_param}"

    new_indicators_substansi[tid] = entry
    new_indicators_sasaran[tid] = {
        "code": tid,
        "sasaran": 4,
        "sasaranName": "Kapabilitas Kelembagaan",
        "instrumentCode": inst,
        "instrumentKey": f"4:{inst}",
        "instrumentName": f"{INST_NAME_MAP[inst]} ({inst})",
        "instrumentLabel": f"{inst} — {INST_NAME_MAP[inst]}",
        "label": label,
        "labelVariants": [label],
        "indicatorCell": f"Sasaran 4!{inst}",
        "indicatorCells": [f"Sasaran 4!{inst}"]
    }

substansi_data.update(new_indicators_substansi)
print(f"Updated substansi count: {len(substansi_data)} (added {len(new_indicators_substansi)})")

new_substansi_text = f"/* DATA SUBSTANSI INDIKATOR RB - Sasaran 4 diupdate dari Kerja Kelompok 1 (3).xlsx */\nwindow.RB_SUBSTANSI_INDIKATOR = {json.dumps(substansi_data, ensure_ascii=False, indent=2)};\n"
with open('data/substansi-indikator.js', 'w', encoding='utf-8') as f:
    f.write(new_substansi_text)
print("Successfully wrote data/substansi-indikator.js")

# -------------------------------------------------------------
# 4. UPDATE data-sasaran.js
# -------------------------------------------------------------
with open('data-sasaran.js', 'r', encoding='utf-8') as f:
    ds_text = f.read()

ds_prefix = 'window.RB_SASARAN_DATA = '
ds_obj_str = ds_text.split(ds_prefix)[1].rsplit(';', 1)[0].strip()
ds_data = json.loads(ds_obj_str)

# Filter out old S4 internal relations
old_relations = ds_data['relations']
old_s4_count = sum(1 for r in old_relations if r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 4)
preserved_relations = [r for r in old_relations if not (r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 4)]
print(f"Old S4 internal relations removed: {old_s4_count}")
print(f"Preserved relations: {len(preserved_relations)}")

# Build 168 new relations
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
print(f"New S4 internal relations built: {len(new_s4_relations)}")

# Add 168 relations to preserved
ds_data['relations'] = preserved_relations + new_s4_relations

# Add new indicators to ds_data['indikators']
existing_codes = set(ind['code'] for ind in ds_data['indikators'])
added_ind_count = 0
for tid, ind_obj in new_indicators_sasaran.items():
    if tid not in existing_codes:
        ds_data['indikators'].append(ind_obj)
        existing_codes.add(tid)
        added_ind_count += 1
print(f"Added {added_ind_count} new indicators to data-sasaran.js indikators array.")

# Update metadata
ds_data['metadata']['relasiInternalPerSasaran']['4'] = 168
ds_data['metadata']['totalRelasiInternal'] = ds_data['metadata'].get('totalRelasiInternal', 1522) - old_s4_count + 168
ds_data['metadata']['totalRelasiEksplisit'] = ds_data['metadata'].get('totalRelasiEksplisit', 3163) - old_s4_count + 168
ds_data['metadata']['totalRelasiInternalDitampilkan'] = ds_data['metadata'].get('totalRelasiInternalDitampilkan', 1524) - old_s4_count + 168
ds_data['metadata']['totalIndikatorUnik'] = len(ds_data['indikators'])
ds_data['metadata']['s4_source'] = "Kerja Kelompok 1 (3).xlsx (168 relasi final)"

new_ds_text = f"/* DATA TERPADU PETA RELASI RB - Sasaran 4 diperbarui dari Kerja Kelompok 1 (3).xlsx (168 relasi) */\nwindow.RB_SASARAN_DATA = {json.dumps(ds_data, ensure_ascii=False)};\n"
with open('data-sasaran.js', 'w', encoding='utf-8') as f:
    f.write(new_ds_text)
print("Successfully wrote data-sasaran.js")

# -------------------------------------------------------------
# 5. UPDATE data/jenis-keterkaitan.js
# -------------------------------------------------------------
with open('data/jenis-keterkaitan.js', 'r', encoding='utf-8') as f:
    jk_text = f.read()

# Build dictionary for sasaran4Justifikasi
new_s4_justifikasi = {}
for r in rows_data:
    key = f"{r['src_id']}_{r['tgt_id']}"
    new_s4_justifikasi[key] = {
        "jenis": r['jenis'],
        "alasan": r['alasan'],
        "rekomendasi": r['rekomendasi']
    }
print(f"Built {len(new_s4_justifikasi)} entries for sasaran4Justifikasi.")

# Replace sasaran4Justifikasi block in data/jenis-keterkaitan.js
# Locate sasaran4Justifikasi: { ... }, followed by sasaran5Justifikasi
s4_start = jk_text.find('sasaran4Justifikasi: {')
s5_start = jk_text.find('sasaran5Justifikasi: {')
assert s4_start != -1, "Could not find sasaran4Justifikasi in jenis-keterkaitan.js"
assert s5_start != -1, "Could not find sasaran5Justifikasi in jenis-keterkaitan.js"

# Find the closing brace of sasaran4Justifikasi before s5_start
brace_pos = jk_text.rfind('},', s4_start, s5_start)
assert brace_pos != -1, "Could not find end of sasaran4Justifikasi block"

# Format new sasaran4Justifikasi JSON
formatted_s4_json = json.dumps(new_s4_justifikasi, ensure_ascii=False, indent=4)
# Indent by 4 spaces
indented_s4_json = "\n".join("    " + line if idx > 0 else line for idx, line in enumerate(formatted_s4_json.split("\n")))

new_jk_text = jk_text[:s4_start] + "sasaran4Justifikasi: " + indented_s4_json + ",\n" + jk_text[s5_start:]

with open('data/jenis-keterkaitan.js', 'w', encoding='utf-8') as f:
    f.write(new_jk_text)
print("Successfully wrote data/jenis-keterkaitan.js")

# -------------------------------------------------------------
# 6. UPDATE style.css
# -------------------------------------------------------------
with open('style.css', 'r', encoding='utf-8') as f:
    css_text = f.read()

badge_css_addition = """
.badge-langsung { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-weight: 600; }
.badge-tidak-langsung { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; font-weight: 600; }
"""

if '.badge-langsung' not in css_text:
    css_text = css_text.replace('.badge-mendukung {', badge_css_addition.strip() + '\n.badge-mendukung {')
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css_text)
    print("Successfully added .badge-langsung and .badge-tidak-langsung to style.css")
else:
    print(".badge-langsung already in style.css")

# -------------------------------------------------------------
# 7. UPDATE app.js
# -------------------------------------------------------------
with open('app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

# 7a. Update renderTypeBadge map
old_badge_map = """    const map = {
      "Mendukung": "badge-mendukung",
      "Saling Melengkapi": "badge-melengkapi",
      "Beririsan Substansi": "badge-beririsan",
      "Potensi Tumpang Tindih": "badge-tumpangtindih",
      "Keselarasan Perencanaan": "badge-selaras"
    };"""

new_badge_map = """    const map = {
      "Mendukung": "badge-mendukung",
      "Saling Melengkapi": "badge-melengkapi",
      "Beririsan Substansi": "badge-beririsan",
      "Potensi Tumpang Tindih": "badge-tumpangtindih",
      "Keselarasan Perencanaan": "badge-selaras",
      "Langsung": "badge-langsung",
      "Tidak Langsung": "badge-tidak-langsung",
      "Tidak langsung": "badge-tidak-langsung"
    };"""

if old_badge_map in app_text:
    app_text = app_text.replace(old_badge_map, new_badge_map)
    print("Updated renderTypeBadge map in app.js")

# 7b. Update populateFilters dropdown for relation types
old_populate_types = """    const standardTypes = [
      "Mendukung",
      "Saling Melengkapi",
      "Beririsan Substansi",
      "Potensi Tumpang Tindih",
      "Keselarasan Perencanaan"
    ];
    fillSelect(
      dom.selectRelationType,
      standardTypes.map(t => ({ value: t, label: t })),
      state.rtype,
      "Semua Jenis Keterkaitan"
    );"""

new_populate_types = """    const isS4Internal = (state.activeMenu === "internal" && Number(state.internalSasaranId) === 4);
    const standardTypes = isS4Internal
      ? ["Mendukung", "Langsung", "Tidak Langsung"]
      : [
          "Mendukung",
          "Saling Melengkapi",
          "Beririsan Substansi",
          "Potensi Tumpang Tindih",
          "Keselarasan Perencanaan"
        ];
    fillSelect(
      dom.selectRelationType,
      standardTypes.map(t => ({ value: t, label: t })),
      state.rtype,
      "Semua Jenis Keterkaitan"
    );"""

if old_populate_types in app_text:
    app_text = app_text.replace(old_populate_types, new_populate_types)
    print("Updated populateFilters relation types in app.js")

# 7c. Update renderListTypeToolbar ordering
old_toolbar_order = 'const order = ["Mendukung", "Saling Melengkapi", "Beririsan Substansi", "Potensi Tumpang Tindih", "Keselarasan Perencanaan"];'
new_toolbar_order = 'const order = ["Mendukung", "Langsung", "Tidak Langsung", "Saling Melengkapi", "Beririsan Substansi", "Potensi Tumpang Tindih", "Keselarasan Perencanaan"];'
if old_toolbar_order in app_text:
    app_text = app_text.replace(old_toolbar_order, new_toolbar_order)
    print("Updated renderListTypeToolbar order in app.js")

# 7d. Update sourceComponents for Sasaran 4 to include all 11 Kelompok KK groups
old_s4_comps = """    const sId = Number(state.internalSasaranId);
    if (sId === 4) {
      const kkComps = [
        "Departementasi (Pembidangan)",
        "Mandat (Core Function)",
        "Pengendalian Risiko",
        "Proses Perencanaan",
        "Rentang Kendali"
      ];
      return kkComps.map(name => ({
        id: name,
        inst: "KK",
        name: name
      }));
    }"""

new_s4_comps = """    const sId = Number(state.internalSasaranId);
    if (sId === 4) {
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
      return kkComps.map(name => ({
        id: name,
        inst: "KK",
        name: name
      }));
    }"""

if old_s4_comps in app_text:
    app_text = app_text.replace(old_s4_comps, new_s4_comps)
    print("Updated sourceComponents for Sasaran 4 in app.js")

# 7e. Update getKKGroup mapping in listRawRelations
old_kk_group = """      // Sasaran 4: 50 Hubungan Internal sesuai data resmi data-sasaran.js
      function getKKGroup(code) {
        if (code.startsWith("SS4-KK.KF")) return "Mandat (Core Function)";
        if (code.startsWith("SS4-KK.KU.1")) return "Rentang Kendali";
        if (code.startsWith("SS4-KK.KU.2")) return "Departementasi (Pembidangan)";
        if (code.startsWith("SS4-KK.KP.3")) return "Proses Perencanaan";
        if (code.startsWith("SS4-KK.TK.3")) return "Pengendalian Risiko";
        return "Lainnya";
      }"""

new_kk_group = """      // Sasaran 4: 168 Hubungan Internal sesuai data resmi Kerja Kelompok 1 (3).xlsx
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
      }"""

if old_kk_group in app_text:
    app_text = app_text.replace(old_kk_group, new_kk_group)
    print("Updated getKKGroup in app.js")

# 7f. Update SASARAN4_CONFIG getters for SAKIP and ELPPD
old_sakip_config = """    SAKIP: {
      name: "Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)",
      aspekLabel: "Komponen",
      getAspek: d => d.komponen,
      indikatorLabel: "",
      getIndikator: () => "",
      jenisButir: "Sub-Komponen",
      getNamaButir: d => d.sub_komponen,
      getPenjelasanHtml: (d, esc) => {
        const list = Array.isArray(d.kriteria_evaluasi) ? d.kriteria_evaluasi : [];
        if (list.length === 0) return "";
        return `
          <div class="rincian-kriteria-block">
            <span class="rincian-kriteria-header">Kriteria Evaluasi:</span>
            <ul class="rincian-kriteria-list">
              ${list.map(k => `<li>${esc(cleanLabel(k))}</li>`).join("")}
            </ul>
          </div>
        `;
      }
    },"""

new_sakip_config = """    SAKIP: {
      name: "Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)",
      aspekLabel: "Komponen",
      getAspek: d => (d && d.komponen) ? d.komponen : "",
      indikatorLabel: "Sub-Komponen",
      getIndikator: d => (d && d.sub_komponen) ? d.sub_komponen : "",
      jenisButir: "Kriteria Evaluasi",
      getNamaButir: d => (d && (d.kriteria || d.indikator || d.sub_komponen)) ? (d.kriteria || d.indikator || d.sub_komponen) : "",
      getPenjelasanHtml: (d, esc) => {
        if (!d) return "";
        if (d.definisi_operasional) {
          return `<div class="rincian-isi-penjelasan">${esc(d.definisi_operasional)}</div>`;
        }
        const list = Array.isArray(d.kriteria_evaluasi) ? d.kriteria_evaluasi : [];
        if (list.length === 0) return "";
        return `
          <div class="rincian-kriteria-block">
            <span class="rincian-kriteria-header">Kriteria Evaluasi:</span>
            <ul class="rincian-kriteria-list">
              ${list.map(k => `<li>${esc(cleanLabel(k))}</li>`).join("")}
            </ul>
          </div>
        `;
      }
    },"""

if old_sakip_config in app_text:
    app_text = app_text.replace(old_sakip_config, new_sakip_config)
    print("Updated SAKIP config in app.js")

# 7g. Update hardcoded 50 values for S4
app_text = app_text.replace(
    'dom.heroStatPoints.textContent = sId === 4 ? "50" : (sId === 5 ? "128" : "72");',
    'dom.heroStatPoints.textContent = sId === 4 ? "168" : (sId === 5 ? "128" : "72");'
)

app_text = app_text.replace(
    'dom.heroStatPointsUnit.textContent = sId === 4 ? "Indikator Titik" : (sId === 5 ? "Indikator Titik" : "Pertanyaan Survei");',
    'dom.heroStatPointsUnit.textContent = sId === 4 ? "Hubungan Keterkaitan" : (sId === 5 ? "Indikator Titik" : "Pertanyaan Survei");'
)

app_text = app_text.replace(
    'dom.mapTotal.textContent = "50";',
    'dom.mapTotal.textContent = allFiltered ? allFiltered.length.toString() : "168";'
)

app_text = app_text.replace(
    'sesuai <b>50 hubungan keterkaitan resmi Sasaran 4</b> antara Kapabilitas Kelembagaan dan 7 indeks pembanding.',
    'sesuai <b>168 hubungan keterkaitan resmi Sasaran 4</b> antara Kapabilitas Kelembagaan dan 7 indeks pembanding.'
)

app_text = app_text.replace(
    'dom.topbarSummaryText.textContent = "Sasaran 4: 50 Hubungan";',
    'dom.topbarSummaryText.textContent = "Sasaran 4: 168 Hubungan";'
)

app_text = app_text.replace(
    'Menampilkan 50 hubungan keterkaitan resmi antara Kapabilitas Kelembagaan dan indeks pembanding berdasarkan substansi indikator asli.',
    'Menampilkan 168 hubungan keterkaitan resmi antara Kapabilitas Kelembagaan dan indeks pembanding berdasarkan substansi indikator asli.'
)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_text)
print("Successfully wrote app.js")

# -------------------------------------------------------------
# 8. UPDATE index.html
# -------------------------------------------------------------
with open('index.html', 'r', encoding='utf-8') as f:
    html_text = f.read()

html_text = html_text.replace(
    '<li><strong>Sasaran 4:</strong> 50 hubungan internal terdata secara substantif.</li>',
    '<li><strong>Sasaran 4:</strong> 168 hubungan internal terdata secara substantif.</li>'
)

html_text = html_text.replace(
    '<strong id="mapTotal">50</strong>',
    '<strong id="mapTotal">168</strong>'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_text)
print("Successfully wrote index.html")

print("\n=== MIGRATION COMPLETED SUCCESSFULLY ===")

