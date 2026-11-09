import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Original length of app.js:", len(content))

# 1. Check helper functions for S4
# Find getKKGroup
print("Has getKKGroup:", "function getKKGroup(" in content)

# Let's inspect where getKKGroup is defined
match_kkgroup = re.search(r'function getKKGroup\(code\) \{.*?return "Lainnya";\s*\}', content, re.DOTALL)
if match_kkgroup:
    print("Found getKKGroup definition:")
    print(match_kkgroup.group(0)[:150])

# Find sourceComponents
match_src_comps = re.search(r'const sId = Number\(state\.internalSasaranId\);\s*if \(sId === 4\) \{.*?return kkComps\.map\(.*?\);\s*\}', content, re.DOTALL)
if match_src_comps:
    print("Found sourceComponents sId === 4:")
    print(match_src_comps.group(0)[:200])

# Find groupRelations
match_grp = re.search(r'function groupRelations\(rows\) \{.*?return \[\.\.\.byPair\.values\(\)\];\s*\}', content, re.DOTALL)
if match_grp:
    print("Found groupRelations:")
    print(match_grp.group(0)[:200])

# Find renderInternalMatrix
match_rim = re.search(r'function renderInternalMatrix\(\) \{.*?function renderSasaran3Matrix', content, re.DOTALL)
if match_rim:
    print("Found renderInternalMatrix:")
    print(match_rim.group(0)[:200])

