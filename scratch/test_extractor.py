import openpyxl, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb['Sheet1']

def extract_alasan(col_l_val):
    if not col_l_val or not str(col_l_val).strip():
        return "", "C"
    text = str(col_l_val).strip()
    m = re.search(r'hasil\s*analisis\s*ai\s*[:=]\s*', text, re.IGNORECASE)
    if m:
        cleaned = text[m.end():].strip()
        return cleaned, "A"
    return text, "B"

results = []
for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if not val_id: continue
    no = sheet.cell(r, 1).value
    src = str(val_id).strip()
    tgt = str(sheet.cell(r, 8).value).strip()
    col_l = sheet.cell(r, 12).value
    col_r = sheet.cell(r, 18).value
    
    alasan, cond = extract_alasan(col_l)
    rekom = str(col_r or '').strip()
    
    results.append({
        'row': r,
        'no': no,
        'src': src,
        'tgt': tgt,
        'cond': cond,
        'alasan': alasan,
        'rekom': rekom,
        'has_marker_in_output': 'hasil analisis ai' in alasan.lower()
    })

cond_a = [r for r in results if r['cond'] == 'A']
cond_b = [r for r in results if r['cond'] == 'B']
cond_c = [r for r in results if r['cond'] == 'C']
has_marker = [r for r in results if r['has_marker_in_output']]
empty_alasan = [r for r in results if not r['alasan']]
empty_rekom = [r for r in results if not r['rekom']]

print(f"Total results: {len(results)}")
print(f"Kondisi A (Extracted after marker): {len(cond_a)}")
print(f"Kondisi B (Used entire Column L): {len(cond_b)}")
print(f"Kondisi C (Empty Column L): {len(cond_c)}")
print(f"Any output still has marker: {len(has_marker)}")
print(f"Any empty alasan: {len(empty_alasan)}")
print(f"Any empty rekomendasi: {len(empty_rekom)}")

print("\n--- SAMPLE KONDISI A (FIRST 3) ---")
for r in cond_a[:3]:
    print(f"\nRow {r['row']} (No {r['no']}) | {r['src']} -> {r['tgt']}")
    print(f"Alasan ({len(r['alasan'])} chars): {r['alasan']}")
    print(f"Rekom ({len(r['rekom'])} chars): {r['rekom']}")

print("\n--- SAMPLE KONDISI B (FIRST 3) ---")
for r in cond_b[:3]:
    print(f"\nRow {r['row']} (No {r['no']}) | {r['src']} -> {r['tgt']}")
    print(f"Alasan ({len(r['alasan'])} chars): {r['alasan']}")
    print(f"Rekom ({len(r['rekom'])} chars): {r['rekom']}")

