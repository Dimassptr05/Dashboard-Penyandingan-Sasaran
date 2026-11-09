import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'50 hubungan|Menampilkan 50', text)]
print("In app.js:", len(matches))
for m in matches:
    print(text[m-50:m+150])

with open('index.html', 'r', encoding='utf-8') as f:
    i_text = f.read()

matches2 = [m.start() for m in re.finditer(r'50 hubungan|Menampilkan 50', i_text)]
print("In index.html:", len(matches2))
for m in matches2:
    print(i_text[m-50:m+150])
