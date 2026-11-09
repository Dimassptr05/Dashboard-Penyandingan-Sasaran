import json, openpyxl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load reference comparison
with open('data/perbandingan-sasaran4.js', 'r', encoding='utf-8') as f:
    text = f.read()
s4_comp = json.loads(text.split('window.RB_COMPARISON_S4 = ')[1].rsplit(';', 1)[0].strip())
comp_ind = s4_comp.get('indicators', {})

# Load existing substansi
with open('data/substansi-indikator.js', 'r', encoding='utf-8') as f:
    s_text = f.read()
substansi_data = json.loads(s_text.split('window.RB_SUBSTANSI_INDIKATOR = ')[1].rsplit(';', 1)[0].strip())

# Load Excel targets
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

excel_targets = {}
for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if val_id:
        tgt_inst_raw = str(sheet.cell(r, 7).value or '').strip()
        tgt_inst = INST_MAP.get(tgt_inst_raw, tgt_inst_raw)
        tgt_id = str(sheet.cell(r, 8).value or '').strip()
        tgt_rincian = str(sheet.cell(r, 9).value or '').strip()
        if tgt_id not in excel_targets:
            excel_targets[tgt_id] = {'inst': tgt_inst, 'rincian': tgt_rincian}

new_substansi_entries = {}
new_indikator_entries = {}

for tid, tinfo in excel_targets.items():
    inst = tinfo['inst']
    rincian = tinfo['rincian']
    ref = comp_ind.get(tid, {})
    ref_fields = {k: v for k, v in ref.get('fields', [])}
    claude_name = ref.get('claudeName', '')

    if tid in substansi_data:
        # Already exists
        continue

    # Build entry based on instrument
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
        # SAKIP code like SS4-SAKIP.1.1.6
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
        # ELPPD
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

    new_substansi_entries[tid] = entry
    new_indikator_entries[tid] = {
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

print(f"Generated {len(new_substansi_entries)} new substansi entries.")
print(f"Generated {len(new_indikator_entries)} new indikator entries.")
assert len(new_substansi_entries) == 45
assert len(new_indikator_entries) == 45
print("Samples:")
for tid in ['SS4-SPIP.PT.EE.1.1', 'SS4-SAKIP.1.1.6', 'SS4-ELPPD.1.3.5', 'SS4-IKPA.1.1.1', 'SS4-IPA.1.1.0']:
    print(f"\n--- {tid} ---")
    print("Substansi:", json.dumps(new_substansi_entries[tid], indent=2))
    print("Indikator:", json.dumps(new_indikator_entries[tid], indent=2))

