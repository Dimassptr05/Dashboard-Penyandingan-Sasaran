import openpyxl, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

wb = openpyxl.load_workbook('data-final-sasaran4/Kerja Kelompok 1 (3).xlsx', data_only=True)
sheet = wb['Sheet1']

last_aspek = None
last_kelompok = None

kk_ind_map = {}

for r in range(2, 170):
    src_id = sheet.cell(r, 2).value
    if not src_id: continue
    src_id = str(src_id).strip()
    
    aspek_val = sheet.cell(r, 3).value
    if aspek_val and str(aspek_val).strip():
        last_aspek = str(aspek_val).strip()
    
    kelompok_val = sheet.cell(r, 4).value
    if kelompok_val and str(kelompok_val).strip():
        last_kelompok = str(kelompok_val).strip()

    ind_val = str(sheet.cell(r, 5).value or '').strip()

    if src_id not in kk_ind_map:
        kk_ind_map[src_id] = {
            'aspek': last_aspek,
            'kelompok': last_kelompok,
            'indikator': ind_val,
            'rows': 0
        }
    kk_ind_map[src_id]['rows'] += 1

print(f"Total unique KK indicators: {len(kk_ind_map)}")
print("\nMapping of 24 KK Indicators:")
for k, v in sorted(kk_ind_map.items()):
    print(f"  {k} -> Aspek: '{v['aspek']}' | Kelompok: '{v['kelompok']}' | Indikator: '{v['indikator']}' ({v['rows']} rows)")

from collections import Counter
aspek_ind_count = Counter(v['aspek'] for v in kk_ind_map.values())
kelompok_ind_count = Counter(v['kelompok'] for v in kk_ind_map.values())

print("\nKK Indicators per Aspek:")
for asp, cnt in aspek_ind_count.items():
    print(f"  {asp}: {cnt} indikator (x 7 instrumen = {cnt * 7} relasi)")

print(f"\nTotal unique Aspek: {len(aspek_ind_count)}")
print(f"Total unique Kelompok: {len(kelompok_ind_count)}")

