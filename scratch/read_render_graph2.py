import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('const n = relasiInternal.sasaran3?.relasi?.length || 0;')
if pos != -1:
    print(text[pos:pos+3500])

