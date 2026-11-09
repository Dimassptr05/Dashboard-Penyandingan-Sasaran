import openpyxl, re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb['Sheet1']

print("Checking all 168 rows for any pattern containing 'ai' or 'hasil' or 'analisis'...")

all_ai_mentions = []
for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if not val_id: continue
    no = sheet.cell(r, 1).value
    src = str(val_id).strip()
    tgt = str(sheet.cell(r, 8).value).strip()
    text = str(sheet.cell(r, 12).value or '').strip()
    
    # search for variations of "hasil analisis ai"
    m = re.search(r'hasil\s*analisis\s*ai', text, re.IGNORECASE)
    if m:
        # inspect around match
        start = max(0, m.start() - 20)
        end = min(len(text), m.end() + 30)
        all_ai_mentions.append((r, no, src, tgt, text[start:end], m.start(), m.end()))
    else:
        # check if word "AI" appears anywhere as a separate word
        m2 = re.search(r'\bAI\b', text)
        if m2:
            print(f"Row {r} (No {no}) has standalone 'AI': {text[max(0, m2.start()-20):min(len(text), m2.end()+20)]}")

print(f"\nTotal 'hasil analisis ai' occurrences: {len(all_ai_mentions)}")
for r, no, src, tgt, snippet, s, e in all_ai_mentions:
    print(f"Row {r:3d} (No {no:4.1f}) | {src} -> {tgt} | Snippet: {repr(snippet)}")

