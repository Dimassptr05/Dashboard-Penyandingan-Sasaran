import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('const isS4 = state.activeMenu === "internal" && Number(state.internalSasaranId) === 4;')
if pos != -1:
    print(text[pos-100:pos+1500])

