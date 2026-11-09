import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = [m.start() for m in re.finditer(r'btnS4MacroToggle|btnS4DetailToggle|s4MacroView', text)]
for m in matches:
    print(text[m-50:m+400])
    print('---')

