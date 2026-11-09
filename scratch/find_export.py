import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'export|exportToCsv|exportToPdf|exportCsv|exportPdf', text, re.IGNORECASE)]
print(f"Total export matches: {len(matches)}")
for m in matches[:10]:
    print(text[m-20:m+150])
    print('---')

