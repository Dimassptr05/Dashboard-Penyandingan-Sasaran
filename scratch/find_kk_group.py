import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('getKKGroup')
if pos != -1:
    print(text[pos - 100:pos + 1200])
else:
    print("getKKGroup not found, searching for KK grouping...")
    import re
    matches = [m.start() for m in re.finditer(r'KK\.KF|Departementasi|Rentang Kendali', text)]
    for m in matches[:5]:
        print(text[m-50:m+200])

