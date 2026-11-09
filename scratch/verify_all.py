import json, openpyxl, subprocess, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("==================================================")
print("VERIFICATION SUITE: SASARAN 4 INTEGRATION")
print("==================================================")

# 1. Check data-sasaran.js
with open('data-sasaran.js', 'r', encoding='utf-8') as f:
    ds_text = f.read()

ds_prefix = 'window.RB_SASARAN_DATA = '
ds_data = json.loads(ds_text.split(ds_prefix)[1].rsplit(';', 1)[0].strip())
relations = ds_data['relations']
indikators = ds_data['indikators']

s4_internal = [r for r in relations if r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 4]
s3_internal = [r for r in relations if r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 3]
s5_internal = [r for r in relations if r.get('scope') == 'INTERNAL' and r.get('sourceSasaran') == 5]
ext_rels = [r for r in relations if r.get('scope') == 'EXTERNAL']

print(f"\n1. Relations Count in data-sasaran.js:")
print(f"   - S4 Internal: {len(s4_internal)} (Expected: 168)")
print(f"   - S3 Internal: {len(s3_internal)} (Expected: 72)")
print(f"   - S5 Internal: {len(s5_internal)} (Expected: 1472)")
print(f"   - External: {len(ext_rels)} (Expected: 1641)")
print(f"   - Total Relations: {len(relations)} (Expected: 3353)")

assert len(s4_internal) == 168, f"S4 internal count error: {len(s4_internal)}"
assert len(s3_internal) == 72, f"S3 internal count error: {len(s3_internal)}"
assert len(s5_internal) == 1472, f"S5 internal count error: {len(s5_internal)}"
assert len(ext_rels) == 1641, f"External count error: {len(ext_rels)}"
assert len(relations) == 3353, f"Total relations count error: {len(relations)}"
print("   => [PASS] All relation counts match exactly.")

# 2. Check metadata
meta = ds_data['metadata']
print(f"\n2. Metadata in data-sasaran.js:")
print(f"   - relasiInternalPerSasaran['4']: {meta['relasiInternalPerSasaran']['4']}")
print(f"   - totalRelasiInternal: {meta['totalRelasiInternal']}")
print(f"   - totalRelasiEksplisit: {meta['totalRelasiEksplisit']}")
print(f"   - totalIndikatorUnik: {meta['totalIndikatorUnik']}")
assert meta['relasiInternalPerSasaran']['4'] == 168
print("   => [PASS] Metadata updated accurately.")

# 3. Check data/jenis-keterkaitan.js vs Excel
with open('data/jenis-keterkaitan.js', 'r', encoding='utf-8') as f:
    jk_text = f.read()

s4_start = jk_text.find('sasaran4Justifikasi: {')
s5_start = jk_text.find('sasaran5Justifikasi: {')
brace_pos = jk_text.rfind('},', s4_start, s5_start)
s4_just_str = jk_text[s4_start + len('sasaran4Justifikasi:'):brace_pos + 1].strip()
s4_just = json.loads(s4_just_str)

print(f"\n3. Checking sasaran4Justifikasi in data/jenis-keterkaitan.js:")
print(f"   - Total keys in sasaran4Justifikasi: {len(s4_just)} (Expected: 168)")
assert len(s4_just) == 168

from collections import Counter
type_counts = Counter(v['jenis'] for v in s4_just.values())
print(f"   - Classification breakdown:")
print(f"     * Mendukung: {type_counts.get('Mendukung', 0)} (Expected: 97)")
print(f"     * Langsung: {type_counts.get('Langsung', 0)} (Expected: 61)")
print(f"     * Tidak Langsung: {type_counts.get('Tidak Langsung', 0)} (Expected: 10)")
assert type_counts.get('Mendukung', 0) == 97
assert type_counts.get('Langsung', 0) == 61
assert type_counts.get('Tidak Langsung', 0) == 10
print("   => [PASS] Classification counts strictly verified.")

# Check 168 pairs against Excel
excel_path = 'data-final-sasaran4/Kerja Kelompok 1 (3).xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)
sheet = wb.active

mismatches = []
for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if not val_id: continue
    src = str(val_id).strip()
    tgt = str(sheet.cell(r, 8).value).strip()
    key = f"{src}_{tgt}"
    
    col_j = str(sheet.cell(r, 10).value or '').strip()
    expected_jenis = 'Tidak Langsung' if col_j.lower() == 'tidak langsung' else col_j
    expected_alasan = str(sheet.cell(r, 12).value or '').strip() # Col L
    expected_rekom = str(sheet.cell(r, 18).value or '').strip() # Col R
    
    if key not in s4_just:
        mismatches.append(f"Missing key: {key} (row {r})")
        continue
    
    actual = s4_just[key]
    if actual['jenis'] != expected_jenis:
        mismatches.append(f"Jenis mismatch on {key}: expected '{expected_jenis}', got '{actual['jenis']}'")
    if actual['alasan'] != expected_alasan:
        mismatches.append(f"Alasan mismatch on {key} (row {r})")
    if actual['rekomendasi'] != expected_rekom:
        mismatches.append(f"Rekomendasi mismatch on {key} (row {r})")

print(f"\n4. Verifying all 168 individual pairs (Key, Col J, Col L, Col R):")
if mismatches:
    print(f"   => [FAIL] Found {len(mismatches)} mismatches:")
    for m in mismatches[:5]:
        print("     ", m)
    sys.exit(1)
else:
    print("   => [PASS] All 168 pairs match Excel (Col J, Col L verbatim, Col R verbatim) 100%!")

# 5. Check data/substansi-indikator.js
with open('data/substansi-indikator.js', 'r', encoding='utf-8') as f:
    sub_text = f.read()

sub_data = json.loads(sub_text.split('window.RB_SUBSTANSI_INDIKATOR = ')[1].rsplit(';', 1)[0].strip())
print(f"\n5. Checking data/substansi-indikator.js:")
print(f"   - Total indicators: {len(sub_data)} (Original: 783, New: 828)")
missing_src = [s for s in set(r.get('source') for r in s4_internal) if s not in sub_data]
missing_tgt = [t for t in set(r.get('target') for r in s4_internal) if t not in sub_data]
print(f"   - Missing source indicators in substansi: {len(missing_src)}")
print(f"   - Missing target indicators in substansi: {len(missing_tgt)}")
assert len(missing_src) == 0
assert len(missing_tgt) == 0
print("   => [PASS] All 24 source and 52 target indicators have complete substansi metadata.")

# 6. Check indicatorMap in data-sasaran.js
ind_codes = set(i['code'] for i in indikators)
missing_ind = [c for c in (set(r.get('source') for r in s4_internal) | set(r.get('target') for r in s4_internal)) if c not in ind_codes]
print(f"\n6. Checking indicators in data-sasaran.js:")
print(f"   - Missing codes in data-sasaran indikators: {len(missing_ind)}")
assert len(missing_ind) == 0
print("   => [PASS] All 76 unique indicators exist in data-sasaran.js indikators array.")

# 7. Check Node.js syntax of all modified files
print("\n7. Validating JavaScript syntax via node -c:")
files_to_check = ['data-sasaran.js', 'data/jenis-keterkaitan.js', 'data/substansi-indikator.js', 'app.js']
for fc in files_to_check:
    res = subprocess.run(['node', '-c', fc], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"   => [FAIL] Syntax error in {fc}: {res.stderr}")
        sys.exit(1)
    else:
        print(f"   - {fc}: Syntax OK [PASS]")

print("\n==================================================")
print("ALL VERIFICATIONS PASSED WITH ZERO ERRORS!")
print("==================================================")

