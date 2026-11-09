import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('step1Btn.onclick')
if pos == -1:
    pos = text.find('step2Btn.onclick')
if pos == -1:
    pos = text.find('dom.step1Btn.addEventListener')
if pos == -1:
    pos = text.find('step1Btn')
    # search where onclick is assigned
    matches = [m.start() for m in re.finditer(r'step[123]Btn', text)]
    for m in matches[5:]:
        print(text[m-20:m+200])
        print('---')

