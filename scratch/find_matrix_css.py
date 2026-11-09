import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('.matrix-cell-btn')
if pos != -1:
    print(text[pos-50:pos+500])

