import openpyxl, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb['Sheet1']

ai_marker_rows = []
no_marker_rows = []
empty_rows = []

ai_pattern = re.compile(r'hasil\s+analisis\s+ai\s*[:=]\s*', re.IGNORECASE)
general_ai_pattern = re.compile(r'analisis\s+ai', re.IGNORECASE)

for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if not val_id:
        continue
    no = sheet.cell(r, 1).value
    src_id = str(val_id).strip()
    tgt_id = str(sheet.cell(r, 8).value).strip()
    col_l = sheet.cell(r, 12).value
    
    if not col_l or not str(col_l).strip():
        empty_rows.append((r, no, src_id, tgt_id))
        continue
    
    col_l_str = str(col_l).strip()
    m = ai_pattern.search(col_l_str)
    if m:
        before = col_l_str[:m.start()].strip()
        after = col_l_str[m.end():].strip()
        matched_text = m.group(0)
        ai_marker_rows.append((r, no, src_id, tgt_id, matched_text, before, after))
    else:
        # Check if there is any other AI mention
        gen_m = general_ai_pattern.search(col_l_str)
        if gen_m:
            print(f"Row {r} (No {no}) has general AI mention: '{gen_m.group(0)}' in context: '{col_l_str[max(0, gen_m.start()-30):min(len(col_l_str), gen_m.end()+60)]}'")
        no_marker_rows.append((r, no, src_id, tgt_id, col_l_str))

print("\n--- SUMMARY OF COLUMN L SCAN ---")
print(f"Total rows scanned: {len(ai_marker_rows) + len(no_marker_rows) + len(empty_rows)}")
print(f"Kondisi A (Has 'Hasil analisis AI' marker): {len(ai_marker_rows)}")
print(f"Kondisi B (No marker): {len(no_marker_rows)}")
print(f"Kondisi C (Empty): {len(empty_rows)}")

if ai_marker_rows:
    print("\n--- SAMPLE KONDISI A (FIRST 5) ---")
    for r, no, src, tgt, marker, before, after in ai_marker_rows[:5]:
        print(f"\nRow {r} (No {no}) | Pair: {src} -> {tgt}")
        print(f"  Matched marker: '{marker}'")
        print(f"  Before marker ({len(before)} chars): {before[:100]}...")
        print(f"  After marker ({len(after)} chars): {after[:150]}...")

if no_marker_rows:
    print("\n--- SAMPLE KONDISI B (FIRST 5) ---")
    for r, no, src, tgt, text in no_marker_rows[:5]:
        print(f"\nRow {r} (No {no}) | Pair: {src} -> {tgt}")
        print(f"  Text ({len(text)} chars): {text[:150]}...")

