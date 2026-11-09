import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('if (isS4 && state.s4MacroView !== false) {')
if pos != -1:
    print(text[pos:pos+4000])

