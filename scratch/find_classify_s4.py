with open('data/jenis-keterkaitan.js', 'r', encoding='utf-8') as f:
    text = f.read()

pos = text.find('classifySasaran4')
print(f"Found classifySasaran4 at position: {pos}")
print(text[pos:pos+1500])

