import openpyxl, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb.active

kk_indicators = {}
for r in range(2, 170):
    src_id = sheet.cell(r, 2).value
    if src_id:
        src_id = str(src_id).strip()
        if src_id not in kk_indicators:
            kk_indicators[src_id] = {
                'aspek': sheet.cell(r, 3).value,
                'kelompok': sheet.cell(r, 4).value,
                'indikator': sheet.cell(r, 5).value,
                'def': sheet.cell(r, 6).value
            }

for k in sorted(kk_indicators.keys()):
    v = kk_indicators[k]
    print(f"{k} | Aspek: {v['aspek']} | Kelompok: {v['kelompok']} | Ind: {v['indikator']}")

