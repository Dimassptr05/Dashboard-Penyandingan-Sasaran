import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('rincian-indikator-card')
if pos == -1:
    pos = text.find('rincian-isi-penjelasan')
if pos != -1:
    print("Found at:", pos)
    print(text[pos - 500:pos + 1500])
else:
    print("Not found")

