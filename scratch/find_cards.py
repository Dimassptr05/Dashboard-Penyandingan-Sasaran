import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('Indikator Sumber')
if pos != -1:
    print("Found 'Indikator Sumber' at:", pos)
    print(text[pos - 200:pos + 2000])