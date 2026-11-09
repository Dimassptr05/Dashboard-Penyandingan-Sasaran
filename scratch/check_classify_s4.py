with open('data/jenis-keterkaitan.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(4680, 4730):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')

