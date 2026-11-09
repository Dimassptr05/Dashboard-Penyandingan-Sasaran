import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('// 4. Render Kartu Tujuan (Kanan)')
if pos == -1:
    pos = text.find('destPairs')
print(text[pos:pos+1500])

