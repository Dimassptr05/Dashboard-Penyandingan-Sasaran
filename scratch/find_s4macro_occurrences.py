import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r's4MacroView', text)]
for m in matches:
    print(text[m-30:m+80].replace('\n', ' '))
    print('---')

