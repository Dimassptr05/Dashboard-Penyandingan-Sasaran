import json, openpyxl, re, subprocess, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("=================================================================")
print("COMPREHENSIVE FINAL VALIDATION SUITE — RELASI INTERNAL SASARAN 4")
print("=================================================================")

# 1. Load Excel
excel_path = 'data-final-sasaran4/Kerja Kelompok 1 (3).xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)
sheet = wb['Sheet1']

excel_rows = []
for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if not val_id: continue
    no = sheet.cell(r, 1).value
    src = str(val_id).strip()
    tgt = str(sheet.cell(r, 8).value).strip()
    col_j = str(sheet.cell(r, 10).value or '').strip()
    jenis = 'Tidak Langsung' if col_j.lower() == 'tidak langsung' else col_j
    
    col_l = sheet.cell(r, 12).value
    col_r = sheet.cell(r, 18).value

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
    excel_rows.append({
        'row': r,
        'no': no,
        'src': src,
        'tgt': tgt,
        'key': f"{src}_{tgt}",
        'jenis': jenis,
        'cond': cond,
        'alasan': alasan,
        'rekom': rekom
    })

print(f"\n1. Excel Dataset Summary:")
print(f"   - Total rows: {len(excel_rows)}")
from collections import Counter
c_jenis = Counter(r['jenis'] for r in excel_rows)
c_cond = Counter(r['cond'] for r in excel_rows)
print(f"   - Jenis Keterkaitan: {dict(c_jenis)}")
print(f"   - Kondisi Kolom L: {dict(c_cond)}")
assert len(excel_rows) == 168
assert c_jenis['Mendukung'] == 97
assert c_jenis['Langsung'] == 61
assert c_jenis['Tidak Langsung'] == 10
assert c_cond['A'] == 24
assert c_cond['B'] == 144
assert c_cond.get('C', 0) == 0

# 2. Check data/jenis-keterkaitan.js
with open('data/jenis-keterkaitan.js', 'r', encoding='utf-8') as f:
    jk_text = f.read()

s4_start = jk_text.find('sasaran4Justifikasi: {')
s5_start = jk_text.find('sasaran5Justifikasi: {')
brace_pos = jk_text.rfind('},', s4_start, s5_start)
s4_just = json.loads(jk_text[s4_start + len('sasaran4Justifikasi:'):brace_pos + 1].strip())

print(f"\n2. Checking data/jenis-keterkaitan.js (sasaran4Justifikasi):")
print(f"   - Total keys in sasaran4Justifikasi: {len(s4_just)}")
assert len(s4_just) == 168

mismatches = []
has_marker_in_alasan = []

for r in excel_rows:
    k = r['key']
    if k not in s4_just:
        mismatches.append(f"Missing key in sasaran4Justifikasi: {k} (row {r['row']})")
        continue
    actual = s4_just[k]
    if actual['jenis'] != r['jenis']:
        mismatches.append(f"Jenis mismatch on {k}: expected '{r['jenis']}', got '{actual['jenis']}'")
    if actual['alasan'] != r['alasan']:
        mismatches.append(f"Alasan mismatch on {k} (row {r['row']})")
    if actual['rekomendasi'] != r['rekom']:
        mismatches.append(f"Rekomendasi mismatch on {k} (row {r['row']})")
    if 'hasil analisis ai' in actual['alasan'].lower():
        has_marker_in_alasan.append(k)

print(f"   - Pair mismatches count: {len(mismatches)}")
print(f"   - Pairs still having marker in alasan: {len(has_marker_in_alasan)}")
assert len(mismatches) == 0
assert len(has_marker_in_alasan) == 0
print("   => [PASS] All 168 pairs in data/jenis-keterkaitan.js match Excel rules with 100% precision.")

# 3. Check data-sasaran.js
with open('data-sasaran.js', 'r', encoding='utf-8') as f:
    ds_text = f.read()

ds_data = json.loads(ds_text.split('window.RB_SASARAN_DATA = ')[1].rsplit(';', 1)[0].strip())
rels = ds_data['relations']
s4_int = [r for r in rels if r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 4]
s3_int = [r for r in rels if r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 3]
s5_int = [r for r in rels if r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 5]
ext = [r for r in rels if r.get('scope') == 'EXTERNAL']

print(f"\n3. Checking data-sasaran.js:")
print(f"   - S4 Internal relations: {len(s4_int)} (Expected: 168)")
print(f"   - S3 Internal relations: {len(s3_int)} (Expected: 72)")
print(f"   - S5 Internal relations: {len(s5_int)} (Expected: 1472)")
print(f"   - External relations: {len(ext)} (Expected: 1641)")
print(f"   - Total relations: {len(rels)} (Expected: 3353)")

assert len(s4_int) == 168
assert len(s3_int) == 72
assert len(s5_int) == 1472
assert len(ext) == 1641
assert len(rels) == 3353
print("   => [PASS] All relations counts in data-sasaran.js are strictly preserved and verified.")

# Check all indicator codes in data-sasaran.js
ind_codes = set(ind['code'] for ind in ds_data['indikators'])
missing_s4_codes = [r['src'] for r in excel_rows if r['src'] not in ind_codes] + [r['tgt'] for r in excel_rows if r['tgt'] not in ind_codes]
print(f"   - Missing S4 codes in data-sasaran indikators: {len(missing_s4_codes)}")
assert len(missing_s4_codes) == 0

# 4. Check data/substansi-indikator.js
with open('data/substansi-indikator.js', 'r', encoding='utf-8') as f:
    sub_text = f.read()
sub_data = json.loads(sub_text.split('window.RB_SUBSTANSI_INDIKATOR = ')[1].rsplit(';', 1)[0].strip())
missing_substansi = [r['src'] for r in excel_rows if r['src'] not in sub_data] + [r['tgt'] for r in excel_rows if r['tgt'] not in sub_data]
print(f"\n4. Checking data/substansi-indikator.js:")
print(f"   - Total indicators registered: {len(sub_data)}")
print(f"   - Missing S4 indicators in substansi: {len(missing_substansi)}")
assert len(missing_substansi) == 0
print("   => [PASS] Complete metadata exists for all 24 source and 52 comparator indicators.")

# 5. Check JS Syntax
print(f"\n5. Syntax verification via node -c:")
files = ['data-sasaran.js', 'data/jenis-keterkaitan.js', 'data/substansi-indikator.js', 'app.js']
for f in files:
    res = subprocess.run(['node', '-c', f], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"   => [FAIL] Syntax error in {f}: {res.stderr}")
        sys.exit(1)
    else:
        print(f"   - {f}: OK [PASS]")

print("\n=================================================================")
print("ALL 168 RELATIONS FULLY VALIDATED AND READY!")
print("=================================================================")

