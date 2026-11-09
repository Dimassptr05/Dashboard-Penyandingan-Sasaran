import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'indikator', text, re.IGNORECASE)]
print(f"Total 'indikator' matches: {len(matches)}")
# find occurrences of .indikators
m2 = [m.start() for m in re.finditer(r'\.indikators', text)]
for m in m2:
    print("--- .indikators at", m, "---")
    print(text[m-50:m+200])

