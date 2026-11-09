import json, openpyxl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('data/perbandingan-sasaran4.js', 'r', encoding='utf-8') as f:
    text = f.read()

s4_comp = json.loads(text.split('window.RB_COMPARISON_S4 = ')[1].rsplit(';', 1)[0].strip())
indicators = s4_comp.get('indicators', {})

wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb.active

excel_targets = {}
for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if val_id:
        tgt_inst = str(sheet.cell(r, 7).value or '').strip()
        tgt_id = str(sheet.cell(r, 8).value or '').strip()
        tgt_rincian = str(sheet.cell(r, 9).value or '').strip()
        if tgt_id not in excel_targets:
            excel_targets[tgt_id] = {'inst': tgt_inst, 'rincian': tgt_rincian}

print(f"Total targets from Excel: {len(excel_targets)}")
for tid in sorted(excel_targets.keys()):
    ref = indicators.get(tid, {})
    fields = {k: v for k, v in ref.get('fields', [])}
    claudeName = ref.get('claudeName', '')
    print(f"\nID: {tid} | Inst: {excel_targets[tid]['inst']}")
    print(f"  Ref Fields: {fields}")
    print(f"  claudeName: {claudeName}")

