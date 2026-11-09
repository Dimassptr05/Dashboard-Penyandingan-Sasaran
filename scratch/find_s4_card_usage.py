import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

print("--- Around 44701 ---")
print(text[44400:46500])

print("--- Around 128172 ---")
print(text[127800:130000])

