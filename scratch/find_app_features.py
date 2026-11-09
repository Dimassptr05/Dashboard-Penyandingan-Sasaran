import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

keywords = ['renderTypeBadge', 'populateFilters', 'sourceComponents', 'listDestinations', 'renderListTypeToolbar', 'badge-']
for kw in keywords:
    pos = text.find(kw)
    print(f"=== {kw} at {pos} ===")
    if pos != -1:
        print(text[pos:pos+400])
        print("...")

