import openpyxl

wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb.active

targets = {}
for r in range(2, 170):
    val_id = sheet.cell(r, 2).value
    if val_id:
        tgt_inst = str(sheet.cell(r, 7).value or '').strip()
        tgt_id = str(sheet.cell(r, 8).value or '').strip()
        tgt_rincian = str(sheet.cell(r, 9).value or '').strip()
        if tgt_id not in targets:
            targets[tgt_id] = {'inst': tgt_inst, 'rincian': tgt_rincian}

with open('scratch/target_details.txt', 'w', encoding='utf-8') as out:
    for tid in sorted(targets.keys()):
        inst = targets[tid]['inst']
        rincian = targets[tid]['rincian']
        out.write(f"=== {tid} | {inst} ===\n{rincian}\n\n")

print(f"Saved {len(targets)} targets to scratch/target_details.txt")

