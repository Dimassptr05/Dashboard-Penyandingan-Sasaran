import re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    app_text = f.read()

# Let's check sourceComponents() for S4
pos = app_text.find('if (sId === 4) {')
print("sourceComponents for sId === 4:")
print(app_text[pos:pos+600])

# Let's check getKKGroup in app.js
pos2 = app_text.find('function getKKGroup(code)')
print("\ngetKKGroup in app.js:")
print(app_text[pos2:pos2+700])

