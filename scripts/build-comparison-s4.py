"""Extract the isolated comparison dataset. Read-only Excel input; no fuzzy ID joins.

Run: python scripts/build-comparison-s4.py
Requires openpyxl. Paths are relative to the repository, not the caller.
"""
import hashlib
import json
from collections import Counter
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
FILES = {
    'gpt': 'Matriks_Terpadu_Penyandingan_KK_dan_Analisis_Redundansi_Sasaran4.xlsx',
    'claude': 'Relasional_Internal_Sasaran4 (1).xlsx',
    'reference': 'Bahan paparan Kamis (30092026) (1).xlsx',
}
INDICES = ['IPPN', 'CKKP', 'SPIP', 'SAKIP', 'ELPPD', 'IKPA', 'IPA']


def expanded(sheet):
    """Inherit values only from actual merged cells, never arbitrary blank rows."""
    values = [list(row) for row in sheet.values]
    for area in sheet.merged_cells.ranges:
        value = values[area.min_row - 1][area.min_col - 1]
        for row in range(area.min_row - 1, area.max_row):
            for col in range(area.min_col - 1, area.max_col):
                values[row][col] = value
    return values


def index_of(code):
    return code.split('-')[1].split('.')[0]


def build():
    books = {key: openpyxl.load_workbook(ROOT / name, data_only=True) for key, name in FILES.items()}
    reference = books['reference']['Sasaran 4']
    rows = expanded(reference)
    # Fields follow the actual worksheet headings and merged hierarchy.
    layouts = {
        'KK': (0, [('Aspek', 1), ('Indikator', 2), ('Pernyataan', 4)]),
        'IPPN': (8, [('Indikator', 9), ('Subindikator', 10), ('Status Penilaian TA 2026', 11)]),
        'CKKP': (14, [('Kategori', 15), ('Indikator', 16), ('Komponen Penilaian Evaluasi K/L', 17), ('Hasil Penilaian Evaluasi K/L', 18)]),
        'SPIP': (21, [('Penetapan Tujuan', 22), ('Struktur dan Proses', 24), ('Pencapaian Tujuan SPIP', 27)]),
        'SAKIP': (30, [('Komponen', 31), ('Sub-Komponen 1 Keberadaan (20%)', 32), ('Sub-Komponen 2 Kualitas (30%)', 33), ('Sub-Komponen 3 Pemanfaatan (50%)', 34), ('Total Bobot', 35)]),
        'ELPPD': (38, [('Aspek', 39), ('Kinerja Makro', 41), ('Kinerja Penyelenggaraan Urusan Pemerintahan', 42)]),
        'IKPA': (45, [('Aspek', 46), ('Indikator', 48), ('Bobot Satker/Unit Eselon I/Kementerian Negara/Lembaga', 50), ('Bobot KPPN dan Kanwil DJPb sebagai Kuasa BUN', 51)]),
        'IPA': (53, [('Sasaran Strategis Indeks', 54), ('Parameter', 56), ('Bobot', 58)]),
    }
    indicators = {}
    for index, (id_col, fields) in layouts.items():
        for row_no, row in enumerate(rows[2:], 3):
            # IDs are read from the unexpanded cell: a merged ID is not a new leaf ID.
            code = reference.cell(row_no, id_col + 1).value
            if not isinstance(code, str) or not code.startswith('SS4-'):
                continue
            code = code.strip()
            assert code not in indicators, f'Duplicate reference ID: {code}'
            detail = [[label, row[col]] for label, col in fields if row[col] is not None]
            indicators[code] = {'id': code, 'index': index, 'fields': detail, 'row': row_no, 'verified': True}

    # Column F identifies the primary dashboard sources, not the comparison scope.
    source_ids = [code for code, item in indicators.items() if item['index'] == 'KK']
    primary_source_ids = [code for code in source_ids if reference.cell(indicators[code]['row'], 6).value]
    groups = {}
    for code in source_ids:
        name = dict(indicators[code]['fields'])['Indikator'].split('. ', 1)[-1]
        # Display spelling used by Relasi Internal; the workbook text stays intact.
        name = {'Departemensi (Pembidangan)': 'Departementasi (Pembidangan)'}.get(name, name)
        key = 'group:' + code.rsplit('.', 1)[0]
        group = groups.setdefault(key, {'id': key, 'ids': [], 'name': name, 'primary': False})
        group['ids'].append(code)
        group['primary'] = group['primary'] or code in primary_source_ids
    source_groups = sorted(groups.values(), key=lambda group: (not group['primary'], group['name']))

    catalog = {}
    for row_no, row in enumerate(expanded(books['gpt']['Katalog Indikator Pembanding'])[1:], 2):
        if row[1]:
            catalog[row[1].strip()] = {'fields': [[label, row[col]] for label, col in
                [('Komponen/aspek', 2), ('Subkomponen/unsur', 3), ('Indikator/rincian', 4),
                 ('Definisi operasional/keterangan', 5), ('Catatan kelengkapan', 6)] if row[col] is not None], 'row': row_no}
    claude_names = {row[3]: row[4] for row in list(books['claude']['Relasional per ID'].values)[1:] if row[3]}
    records = {'gpt': [], 'claude': []}
    gpt_rows = list(books['gpt']['Matriks Gabungan'].values)
    for row_no, row in enumerate(gpt_rows[1:], 2):
        if row[1] is None:
            continue
        records['gpt'].append({'source': row[1].strip(), 'target': row[7].strip(), 'type': row[9],
            'reason': row[10], 'recommendation': row[16], 'row': row_no, 'sheet': 'Matriks Gabungan',
            'original': dict(zip(gpt_rows[0], row))})
    claude_rows = list(books['claude']['Matriks Relasi (Detail)'].values)
    for row_no, row in enumerate(claude_rows[1:], 2):
        if not row[1] or not row[3]:
            continue
        source, target = row[1].strip(), row[3].strip()
        if not (source.startswith('SS4-KK.') or target.startswith('SS4-KK.')):
            continue
        reverse = target.startswith('SS4-KK.')
        if reverse:
            source, target = target, source
        records['claude'].append({'source': source, 'target': target, 'type': row[5], 'reason': row[6],
            'recommendation': row[7], 'row': row_no, 'sheet': 'Matriks Relasi (Detail)',
            'reversed': reverse, 'original': dict(zip(claude_rows[0], row))})

    pairs = {}
    for provider, items in records.items():
        for record in items:
            source, target = record['source'], record['target']
            assert source.startswith('SS4-KK.') and index_of(target) in INDICES
            key = source + '|' + target
            pair = pairs.setdefault(key, {'id': key, 'source': source, 'target': target,
                'index': index_of(target), 'gpt': [], 'claude': []})
            pair[provider].append(record)
            for code in (source, target):
                if code not in indicators:
                    indicators[code] = {'id': code, 'index': index_of(code), 'verified': False,
                        'fields': catalog.get(code, {}).get('fields', []),
                        'catalogRow': catalog.get(code, {}).get('row'),
                        'claudeName': claude_names.get(code)}
    for pair in pairs.values():
        missing = [code for code in (pair['source'], pair['target']) if not indicators[code]['verified']]
        pair['mappingIssues'] = [f'{code}: ID tidak tercantum pada Excel acuan; struktur/tingkat rincian belum dapat disetarakan.' for code in missing]
        pair['presence'] = 'both' if pair['gpt'] and pair['claude'] else ('gpt' if pair['gpt'] else 'claude')
        pair['status'] = 'mapping' if missing else pair['presence']
        pair['classificationDiffers'] = bool(pair['gpt'] and pair['claude'] and
            {r['type'] for r in pair['gpt']} != {r['type'] for r in pair['claude']})
    audit = {
        'sourceRows': {p: len(items) for p, items in records.items()},
        'uniquePairs': {p: sum(bool(pair[p]) for pair in pairs.values()) for p in records},
        'claudeAllRelations': len([r for r in claude_rows[1:] if r[1] and r[3]]),
        'claudeReversedKK': sum(r['reversed'] for r in records['claude']),
        'union': len(pairs), 'exactIdOverlap': sum(p['presence'] == 'both' for p in pairs.values()),
        'verifiedOverlap': sum(p['status'] == 'both' for p in pairs.values()),
        'onlyGpt': sum(p['presence'] == 'gpt' for p in pairs.values()),
        'onlyClaude': sum(p['presence'] == 'claude' for p in pairs.values()),
        'classificationDifferences': sum(p['classificationDiffers'] for p in pairs.values()),
        'statuses': dict(Counter(p['status'] for p in pairs.values())),
        'unmappedIds': [key for key, item in indicators.items() if not item['verified']],
        'byIndex': {index: {**{p: sum(bool(pair[p]) for pair in pairs.values() if pair['index'] == index)
                           for p in records}, 'both': sum(pair['presence'] == 'both' for pair in pairs.values() if pair['index'] == index)} for index in INDICES},
    }
    scoped_pairs = [pair for pair in pairs.values() if pair['source'] in source_ids]
    assert len(scoped_pairs) == len(pairs), 'Comparison scope must retain every audited KK pair'
    audit['activeScope'] = {
        'sourceIds': source_ids,
        'sourceGroups': [group['name'] for group in source_groups],
        'union': len(scoped_pairs),
        'gpt': sum(bool(pair['gpt']) for pair in scoped_pairs),
        'claude': sum(bool(pair['claude']) for pair in scoped_pairs),
        'both': sum(pair['presence'] == 'both' for pair in scoped_pairs),
        'statuses': dict(Counter(pair['status'] for pair in scoped_pairs)),
    }
    dataset = {'files': {key: {'name': name, 'sha256': hashlib.sha256((ROOT / name).read_bytes()).hexdigest()}
                         for key, name in FILES.items()}, 'indices': INDICES, 'indicators': indicators,
               'pairs': list(pairs.values()), 'audit': audit,
               'scope': {'sourceIds': source_ids, 'groups': source_groups,
                         'primarySourceIds': primary_source_ids, 'mode': 'all-audited-kk-pairs'}}
    out = ROOT / 'data' / 'perbandingan-sasaran4.js'
    out.write_text('// Generated by scripts/build-comparison-s4.py; isolated from primary datasets.\nwindow.RB_COMPARISON_S4 = ' +
                   json.dumps(dataset, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    (ROOT / 'data' / 'perbandingan-sasaran4-audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(audit, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    build()
