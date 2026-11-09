import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'\b50\b', text)]
print(f"Total '50' matches in app.js: {len(matches)}")
for m in matches:
    print(text[m-30:m+60].replace('\n', ' '))

with open('index.html', 'r', encoding='utf-8') as f:
    i_text = f.read()

matches2 = [m.start() for m in re.finditer(r'\b50\b', i_text)]
print(f"\nTotal '50' matches in index.html: {len(matches2)}")
for m in matches2:
    print(i_text[m-30:m+60].replace('\n', ' '))

