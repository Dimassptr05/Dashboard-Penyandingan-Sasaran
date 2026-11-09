import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('// Pasang Event Handler Klik Sel Matriks')
if pos != -1:
    print(text[pos-50:pos+500])

