import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'indikatorMap|lookupIndicator|indikators\.find|allIndicators', text)]
for idx, m in enumerate(matches[:10]):
    print(f"Match {idx} at {m}:")
    print(text[m-50:m+200])

