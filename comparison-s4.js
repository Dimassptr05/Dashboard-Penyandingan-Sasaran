/* Independent comparison module. Never writes to the primary dashboard data/state. */
(function () {
  'use strict';
  const data = window.RB_COMPARISON_S4;
  if (!data) return;
  const statusNames = { both: 'Ditemukan GPT dan Claude', gpt: 'Hanya GPT', claude: 'Hanya Claude', mapping: 'Perlu Pemetaan ID' };
  const stages = ['Matriks Relasi', 'Peta Relasi', 'Daftar Relasi'];
  const indexNames = { KK: 'Kapabilitas Kelembagaan', IPPN: 'Indeks Perencanaan Pembangunan Nasional', CKKP: 'Capaian Kontribusi Kinerja Pembangunan', SPIP: 'Sistem Pengendalian Intern Pemerintah', SAKIP: 'Sistem Akuntabilitas Kinerja Instansi Pemerintah', ELPPD: 'Evaluasi Laporan Penyelenggaraan Pemerintahan Daerah', IKPA: 'Indikator Kinerja Pelaksanaan Anggaran', IPA: 'Indeks Pengelolaan Aset' };
  const state = { stage: 0, source: '', index: '', status: '', type: '', search: '', selection: null, detail: '', focus: true };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const indicator = id => data.indicators[id];
  const cleanText = value => window.RB_UTILS?.cleanLabel(String(value ?? '')) ?? String(value ?? '');
  function label(id) {
    const item = indicator(id);
    const fields = Object.fromEntries(item.fields);
    if (item.index === 'KK') return [fields.Indikator, fields.Pernyataan].filter(Boolean).map(cleanText).join(' — ');
    return cleanText(fields['Kriteria Evaluasi'] || fields['Sub Uraian'] || fields.Cakupan || fields.Subindikator || fields['Sub-Parameter'] || fields.Parameter || fields.Indikator || fields['Indikator/rincian'] || item.claudeName || 'Rincian indikator belum tersedia');
  }
  // All audited KK pairs belong to the comparison, regardless of primary-dashboard coverage.
  const kkIds = data.scope.sourceIds;
  const kkGroups = data.scope.groups;
  const scopedPairs = data.pairs;
  function matchesSource(id, selected = state.source) {
    return !selected || id === selected || Boolean(kkGroups.find(group => group.id === selected)?.ids.includes(id));
  }
  const types = [...new Set(scopedPairs.flatMap(p => [...p.gpt, ...p.claude].map(r => r.type)))].sort();
  const root = document.createElement('main');
  root.id = 'comparisonS4';
  root.className = 'main-content cmp-root';
  root.hidden = true;
  document.querySelector('.app-layout').append(root);
  const primary = document.querySelector('.main-content:not(.cmp-root)');
  const menu = document.getElementById('menuComparisonS4');
  const originalMenus = ['menuInternal', 'menuExternal'].map(id => document.getElementById(id));

  function filtered(includeSelection = true) {
    const query = state.search.trim().toLocaleLowerCase('id');
    return scopedPairs.filter(pair => {
      if (!matchesSource(pair.source)) return false;
      if (state.index && pair.index !== state.index) return false;
      if (state.status === 'mapping' && !pair.mappingIssues.length) return false;
      if (state.status && state.status !== 'mapping' && pair.presence !== state.status) return false;
      if (state.type && ![...pair.gpt, ...pair.claude].some(r => r.type === state.type)) return false;
      if (includeSelection && state.stage === 2 && state.selection) {
        if (state.selection.kind === 'pair' && pair.id !== state.selection.id) return false;
        if (state.selection.kind === 'node' && pair.source !== state.selection.id && pair.target !== state.selection.id) return false;
      }
      return !query || [pair.source, pair.target, pair.index, label(pair.source), label(pair.target),
        ...[...pair.gpt, ...pair.claude].flatMap(r => [r.type, r.reason, r.recommendation])]
        .join(' ').toLocaleLowerCase('id').includes(query);
    });
  }
  function counts(pairs) {
    return { gpt: pairs.filter(p => p.gpt.length).length, claude: pairs.filter(p => p.claude.length).length,
      both: pairs.filter(p => p.presence === 'both').length, single: pairs.filter(p => p.presence !== 'both').length,
      onlyGpt: pairs.filter(p => p.presence === 'gpt').length, onlyClaude: pairs.filter(p => p.presence === 'claude').length,
      union: pairs.length,
      mapping: pairs.filter(p => p.status === 'mapping').length };
  }
  const options = (items, current, empty) => `<option value="">${esc(empty)}</option>` + items.map(([value, text]) => `<option value="${esc(value)}" ${current === value ? 'selected' : ''}>${esc(text)}</option>`).join('');
  const select = (name, title, items, empty) => `<label>${title}<select data-filter="${name}" aria-label="${title}">${options(items, state[name], empty)}</select></label>`;

  function shell() {
    root.innerHTML = `
      <nav class="cmp-breadcrumb" aria-label="Breadcrumb perbandingan">Portal RB <span>›</span> Perbandingan Sasaran 4 <span>›</span> <span id="cmpCrumb"></span></nav>
      <header class="cmp-header"><div><h1 id="cmpHeading">Matriks Perbandingan Sasaran 4</h1><p>Sasaran 4 — Kapabilitas Kelembagaan</p></div><button class="cmp-button" data-action="back" id="cmpBack">Kembali</button></header>
      <nav class="cmp-steps" aria-label="Tahapan perbandingan">${stages.map((title, i) => `<button data-stage="${i}"><span>${i + 1}</span>${title}</button>`).join('')}</nav>
      <section class="cmp-filters" aria-label="Filter perbandingan">
        <div class="cmp-filter-primary">
        <label>Sasaran Strategis<select aria-label="Sasaran Strategis Perbandingan"><option>Sasaran 4 — Kapabilitas Kelembagaan</option></select></label>
        <label>Indeks Sumber<select aria-label="Indeks Sumber Perbandingan"><option value="KK">KK — Kapabilitas Kelembagaan</option></select></label>
        <label>Indikator<select data-filter="source" aria-label="Indikator Perbandingan"><option value="">Semua Indikator</option>${[true, false].map(primary => `<optgroup label="${primary ? 'Kelompok pada Relasi Internal' : 'Kelompok KK lainnya dalam audit'}">${kkGroups.filter(group => group.primary === primary).map(group => `<option value="${esc(group.id)}" ${state.source === group.id ? 'selected' : ''}>${esc(group.name)}</option>`).join('')}</optgroup>`).join('')}</select></label>
        ${select('index', 'Indeks Pembanding', data.indices.map(id => [id, `${id} — ${indexNames[id]}`]), 'Semua Indeks Pembanding')}
        </div><div class="cmp-filter-secondary">
        ${select('type', 'Jenis Keterkaitan', types.map(type => [type, type]), 'Semua jenis (salah satu sumber)')}
        ${select('status', 'Status Perbandingan', Object.entries(statusNames), 'Semua status')}
        <label class="cmp-search">Pencarian Bebas<input type="search" data-filter="search" aria-label="Pencarian Bebas Perbandingan" placeholder="Cari indikator, alasan, atau rekomendasi…" value="${esc(state.search)}"></label>
        <button class="cmp-button" data-action="reset">Reset Filter</button>
        </div>
      </section>
      <div id="cmpSummary" class="cmp-summary" aria-live="polite"></div>
      <details class="cmp-audit"><summary>Sumber data dan hasil pemeriksaan ID</summary>
        <p>GPT: ${esc(data.files.gpt.name)} · Claude: ${esc(data.files.claude.name)}.</p>
        <p>Acuan identitas dan rincian: ${esc(data.files.reference.name)}, sheet Sasaran 4. Seluruh ${kkIds.length} rincian KK dalam ${kkGroups.length} kelompok dicakup. Kelompok pada Relasi Internal ditampilkan lebih dahulu, diikuti kelompok KK lainnya dalam audit.</p>
        <p>Audit lengkap: ${data.audit.uniquePairs.gpt} pasangan GPT, ${data.audit.uniquePairs.claude} pasangan Claude, dan ${data.audit.union} pasangan gabungan. Batas 50 relasi berlaku pada dashboard Relasi Internal, bukan pada perbandingan ini.</p>
        <p>${data.audit.sourceRows.gpt} baris GPT dan ${data.audit.sourceRows.claude} pasangan KK dari ${data.audit.claudeAllRelations} relasi Claude; ${data.audit.exactIdOverlap} kecocokan ID persis. ${data.audit.claudeReversedKK} arah relasi Claude dinormalisasi untuk pencocokan; arah dan teks asli tetap disimpan.</p>
        <p>${data.audit.activeScope.statuses.mapping || 0} pasangan dalam lingkup aktif perlu pemetaan. Beberapa ID pembanding pada file analisis tidak tercantum di acuan pada tingkat rincian yang sama. Rincian yang belum terpetakan ditandai sebagai data katalog analisis, bukan data acuan. Tidak dilakukan pencocokan nama atau penggabungan ke ID induk.</p>
        <p>Kecocokan GPT–Claude dihitung dari pasangan ID persis, terpisah dari pemeriksaan ID terhadap acuan (1). Pasangan yang perlu pemetaan tetap masuk total. Filter “Ditemukan GPT dan Claude” mencakup semua pasangan pada kedua sumber, termasuk yang perlu pemetaan. Dari ${data.audit.exactIdOverlap} pasangan yang sama, ${data.audit.classificationDifferences} memiliki klasifikasi berbeda.</p>
        <table class="cmp-audit-table"><thead><tr><th>Indeks</th><th>GPT</th><th>Claude</th><th>Cocok berdasarkan ID</th></tr></thead><tbody>${data.indices.map(index => `<tr><td>${index}</td><td>${data.audit.byIndex[index].gpt}</td><td>${data.audit.byIndex[index].claude}</td><td>${data.audit.byIndex[index].both}</td></tr>`).join('')}</tbody></table>
      </details>
      <section id="cmpContent" aria-labelledby="cmpStageTitle"></section>`;
    update();
  }
  function update() {
    root.dataset.comparisonStage = state.stage;
    const pairs = filtered();
    const total = counts(pairs);
    root.querySelector('#cmpCrumb').textContent = `Tahap ${state.stage + 1}: ${stages[state.stage]}`;
    root.querySelector('#cmpHeading').textContent = `${['Matriks', 'Peta', 'Daftar Relasi'][state.stage]} Perbandingan Sasaran 4`;
    root.querySelectorAll('[data-stage]').forEach(button => {
      button.classList.toggle('active', Number(button.dataset.stage) === state.stage);
      if (Number(button.dataset.stage) === state.stage) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    const back = root.querySelector('#cmpBack');
    back.hidden = state.stage === 0;
    back.textContent = state.stage === 2 ? 'Kembali ke Peta' : 'Kembali ke Matriks';
    root.querySelector('#cmpSummary').innerHTML = [[total.gpt, 'Relasi GPT'], [total.claude, 'Relasi Claude'], [total.both, 'Kedua sumber'], [total.onlyGpt, 'Hanya GPT'], [total.onlyClaude, 'Hanya Claude'], [total.union, 'Pasangan gabungan']].map(([value, title]) => `<div><strong>${value}</strong><span>${title}</span></div>`).join('');
    root.querySelector('#cmpContent').innerHTML = state.stage === 0 ? matrix(pairs) : state.stage === 1 ? graph(pairs) : list(pairs);
    if (state.stage === 1) {
      const scrollers = [...root.querySelectorAll('.cmp-map-scroll')];
      scrollers.forEach(scroller => scroller.addEventListener('scroll', () => {
        scrollers.forEach(other => { if (other !== scroller && other.scrollTop !== scroller.scrollTop) other.scrollTop = scroller.scrollTop; });
      }));
    }
  }
  function matrix(pairs) {
    const columns = data.indices.filter(index => !state.index || index === state.index);
    const rows = kkGroups.filter(group => group.ids.some(id => matchesSource(id)));
    const totals = subset => {
      const c = counts(subset);
      return `<span class="cmp-cell-total" aria-label="GPT ${c.gpt}, Claude ${c.claude}"><span>${c.gpt}</span><span>${c.claude}</span></span>`;
    };
    return `<div class="cmp-panel cmp-matrix-panel"><h2 id="cmpStageTitle">Tahap 1 — Matriks Relasi</h2>
      <div class="cmp-matrix-guide"><strong>Cara membaca matriks perbandingan:</strong> Jumlah hubungan pada setiap sel ditampilkan <strong>GPT kiri | Claude kanan</strong>. Pilih sel biru untuk membuka Peta Relasi.</div>
      <div class="cmp-table-scroll"><table class="cmp-matrix"><thead><tr><th scope="col">Indikator Sumber (Baris)<br>Indeks Pembanding (Kolom)</th>${columns.map(index => `<th scope="col"><span>${index}</span><span class="cmp-index-name">${esc(indexNames[index])}</span><small>GPT | Claude</small></th>`).join('')}<th scope="col">Total<small>GPT | Claude</small></th></tr></thead><tbody>
      ${rows.map((group, i) => {
        const subset = pairs.filter(pair => group.ids.includes(pair.source));
        const section = i === 0 || rows[i - 1].primary !== group.primary ? `<tr class="cmp-matrix-section"><th colspan="${columns.length + 2}">${group.primary ? 'Kelompok indikator pada Relasi Internal' : 'Kelompok KK lainnya dalam audit — tetap dihitung'}</th></tr>` : '';
        return `${section}<tr><th scope="row">${esc(group.name.replace(/^\d+\.\s*/, ''))}</th>${columns.map(index => {
          const cell = counts(subset.filter(pair => pair.index === index));
          const selected = state.source && !state.source.startsWith('group:') ? state.source : group.id;
          return `<td><button class="cmp-cell" data-source="${esc(selected)}" data-index="${index}" aria-label="${esc(group.name)} · ${index}: GPT ${cell.gpt}, Claude ${cell.claude}"><span class="${cell.gpt ? 'cmp-count-filled' : 'cmp-count-zero'}">${cell.gpt}</span><span class="${cell.claude ? 'cmp-count-filled' : 'cmp-count-zero'}">${cell.claude}</span></button></td>`;
        }).join('')}<td>${totals(subset)}</td></tr>`;
      }).join('')}</tbody><tfoot><tr><th>Total hubungan</th>${columns.map(index => `<td>${totals(pairs.filter(p => p.index === index))}</td>`).join('')}<td class="cmp-grand-total">${totals(pairs)}</td></tr></tfoot></table></div>
      <p class="cmp-matrix-footnote">Semua pasangan dalam audit GPT dan Claude dihitung, termasuk rincian KK yang tidak memiliki relasi pada dashboard utama. File (1) menjadi acuan indikator. Penanda perlu pemetaan tidak mengurangi total; filter aktif dapat mempersempit tampilan.</p>
      ${!pairs.length ? '<p class="cmp-empty">Tidak ada relasi yang sesuai filter. Sel bernilai nol tetap dapat diperiksa.</p>' : ''}</div>`;
  }
  function graph(pairs) {
    const sources = [...new Set(pairs.map(p => p.source))];
    if (state.source) kkIds.filter(id => matchesSource(id)).forEach(id => { if (!sources.includes(id)) sources.push(id); });
    const targets = [...new Set(pairs.map(p => p.target))];
    const height = Math.max(260, Math.max(sources.length, targets.length) * 112 + 24);
    const y = (index, length) => 16 + (height - 112) * (length === 1 ? 0.5 : index / Math.max(1, length - 1));
    function panel(provider) {
      const actual = pairs.filter(pair => pair[provider].length);
      const title = provider.toUpperCase();
      const paths = actual.map(pair => {
        const sy = y(sources.indexOf(pair.source), sources.length) + 42;
        const ty = y(targets.indexOf(pair.target), targets.length) + 42;
        return `<g class="cmp-edge ${pair.presence === 'both' ? 'cmp-shared' : 'cmp-exclusive'}" data-edge="${esc(pair.id)}" data-a="${esc(pair.source)}" data-b="${esc(pair.target)}" role="button" tabindex="0" aria-label="Lihat relasi ${esc(label(pair.source))} ke ${esc(label(pair.target))} pada ${title}"><title>${esc(label(pair.source))} → ${esc(label(pair.target))} · ${esc(statusNames[pair.status])}</title><path class="cmp-edge-hit" d="M 204 ${sy} C 250 ${sy}, 250 ${ty}, 296 ${ty}"/><path class="cmp-edge-line" d="M 204 ${sy} C 250 ${sy}, 250 ${ty}, 296 ${ty}"/></g>`;
      }).join('');
      const nodes = (ids, x) => ids.map((id, i) => {
        const present = actual.some(p => p.source === id || p.target === id);
        return `<foreignObject x="${x}" y="${y(i, ids.length)}" width="196" height="96"><button xmlns="http://www.w3.org/1999/xhtml" class="cmp-node ${present ? '' : 'cmp-node-absent'}" data-node="${esc(id)}" title="${esc(label(id))}" aria-label="Lihat daftar untuk ${esc(label(id))}"><span>${esc(label(id))}</span>${present ? '' : '<small>Relasi tidak ditemukan</small>'}</button></foreignObject>`;
      }).join('');
      return `<article class="cmp-map-panel" data-provider="${provider}"><header><h3>Peta ${title}</h3><span class="cmp-map-count">${actual.length} hubungan</span></header>
        ${!actual.length ? `<p class="cmp-empty">Tidak ditemukan pada analisis ${title === 'GPT' ? 'GPT' : 'Claude'} untuk lingkup ini.</p>` : '<p class="cmp-map-caption">Indikator sumber KK → Indikator pembanding</p>'}
        <div class="cmp-map-scroll"><svg class="cmp-map" viewBox="0 0 500 ${height}" role="group" aria-label="Peta relasi ${title}" style="height:${height}px">${paths}${nodes(sources, 8)}${nodes(targets, 296)}</svg></div></article>`;
    }
    return `<div class="cmp-panel"><div class="cmp-toolbar"><h2 id="cmpStageTitle">Tahap 2 — Peta Relasi</h2><button class="cmp-button" data-action="list">Buka Daftar Relasi (${pairs.length})</button></div>
      <div class="cmp-toolbar"><label class="cmp-focus"><input type="checkbox" data-action="focus" ${state.focus ? 'checked' : ''}> Mode Fokus</label><span class="cmp-hint">Sorot atau fokuskan indikator untuk menonjolkan garis yang sama pada kedua peta.</span></div>
      <p class="cmp-hint">Garis utuh: ditemukan pada kedua sumber. Garis putus-putus: hanya pada sumber ini. Posisi indikator sama pada kedua panel. Klik indikator atau garis untuk membuka Daftar Relasi.</p>
      <div class="cmp-two cmp-maps">${panel('gpt')}${panel('claude')}</div></div>`;
  }
  function list(pairs) {
    return `<div class="cmp-panel"><div class="cmp-toolbar"><h2 id="cmpStageTitle">Tahap 3 — Daftar Relasi</h2><div class="cmp-list-navigation"><button class="cmp-button" data-stage="1">Kembali ke Peta</button><button class="cmp-button" data-stage="0">Kembali ke Matriks</button></div></div>
      <div class="cmp-toolbar"><p><strong>${pairs.length}</strong> pasangan relasi gabungan sesuai lingkup aktif.</p>${state.selection ? `<button class="cmp-button" data-action="clear-selection">Hapus pilihan peta</button>` : ''}</div>
      ${state.selection ? `<p class="cmp-hint">Pilihan peta: ${state.selection.id.split('|').map(id => esc(label(id))).join(' → ')}</p>` : ''}
      <div class="cmp-table-scroll"><table class="cmp-list"><thead><tr>${['No.', 'Indikator Sumber', 'Indikator Pembanding', 'Indeks Pembanding', 'Status Perbandingan', 'Jenis Keterkaitan GPT', 'Jenis Keterkaitan Claude', 'Aksi'].map(text => `<th scope="col">${text}</th>`).join('')}</tr></thead><tbody>
      ${pairs.map((p, i) => `<tr><td>${i + 1}</td><td>${esc(label(p.source))}</td><td>${esc(label(p.target))}</td><td>${p.index}</td><td><span class="cmp-status ${p.status === 'both' ? 'cmp-match' : ''}">${statusNames[p.status]}</span>${p.status === 'mapping' ? `<small>Keberadaan: ${statusNames[p.presence]}</small>` : ''}${p.classificationDiffers ? '<small class="cmp-difference">Klasifikasi berbeda</small>' : ''}</td><td>${esc(p.gpt.map(r => r.type).join('; ') || '—')}</td><td>${esc(p.claude.map(r => r.type).join('; ') || '—')}</td><td><button class="cmp-button" data-detail="${esc(p.id)}" aria-expanded="${state.detail === p.id}">Lihat Detail</button></td></tr>`).join('') || '<tr><td colspan="8" class="cmp-empty">Tidak ada relasi yang sesuai filter.</td></tr>'}
      </tbody></table></div></div><section id="cmpDetail" tabindex="-1">${state.detail && pairs.some(p => p.id === state.detail) ? detail(pairs.find(p => p.id === state.detail)) : ''}</section>`;
  }
  function field(title, value) {
    return `<div class="compare-info-item"><div class="info-label">${esc(title)}</div><div class="info-val cmp-verbatim">${esc(value ?? 'Tidak tersedia pada sumber')}</div></div>`;
  }
  function card(id, source) {
    const item = indicator(id);
    const structureLabels = ['Aspek', 'Kategori', 'Komponen', 'Indikator', 'Unsur', 'Parameter', 'Sasaran Strategis Indeks', 'Komponen/aspek', 'Subkomponen/unsur'];
    const structure = item.fields.filter(([title]) => structureLabels.includes(title));
    const specifics = item.fields.filter(([title]) => !structureLabels.includes(title));
    const cardField = (title, value) => `<div class="cmp-card-field"><div class="info-label">${esc(title)}</div><div class="info-val cmp-verbatim ${['Indikator', 'Unsur', 'Parameter', 'Subkomponen/unsur'].includes(title) ? 'cmp-indicator-value' : ''}">${esc(cleanText(value))}</div></div>`;
    return `<article class="compare-col ${source ? 'compare-col-source' : 'compare-col-dest'}"><div class="compare-col-header"><span class="compare-col-badge">${source ? 'INDIKATOR SUMBER' : 'INDIKATOR PEMBANDING'}</span></div><div class="compare-info-list">
      ${cardField('Sasaran Strategis', 'Sasaran 4 — Kapabilitas Kelembagaan')}${cardField(source ? 'Indeks Sumber' : 'Indeks Pembanding', `${indexNames[item.index]} (${item.index})`)}
      ${!item.verified ? '<p class="cmp-notice">Perlu Pemetaan ID. Rincian berikut berasal dari katalog analisis, belum terverifikasi terhadap ID Excel acuan.</p>' : ''}
      ${structure.map(([title, value]) => cardField(title, value)).join('')}
      <div class="cmp-card-field"><div class="info-label">Rincian Indikator</div><div class="cmp-indicator-details">${specifics.map(([title, value]) => title.includes('Definisi') ? `<div class="cmp-definition"><div class="info-label">${esc(title)}</div><div class="cmp-verbatim">${esc(value)}</div></div>` : `<div class="cmp-detail-item"><span class="cmp-detail-kind">${esc(title)}</span><div class="cmp-verbatim">${esc(cleanText(value))}</div></div>`).join('') || '<p>Rincian tambahan tidak tersedia pada sumber.</p>'}
      ${item.claudeName ? cardField('Uraian singkat pada Claude', item.claudeName) : ''}</div></div>
      <p class="cmp-provenance">${item.verified ? `${esc(data.files.reference.name)} · Sasaran 4 · baris ${item.row}` : item.catalogRow ? `GPT · Katalog Indikator Pembanding · baris ${item.catalogRow}` : 'Indikator belum memiliki rincian pada Excel acuan.'}</p>
      </div></article>`;
  }
  function analysis(provider, pair) {
    const name = provider === 'gpt' ? 'GPT' : 'Claude';
    return `<article class="cmp-analysis" data-analysis="${provider}"><h3>BY ${name.toUpperCase()}</h3>${pair[provider].length ? pair[provider].map(record => `
      ${field('JENIS KETERKAITAN', record.type)}${field('ALASAN / JUSTIFIKASI SUBSTANTIF', record.reason)}${field('REKOMENDASI TINDAK LANJUT', record.recommendation)}
      <p class="cmp-provenance">${esc(data.files[provider].name)} · ${esc(record.sheet)} · baris ${record.row}</p>
      ${record.reversed ? '<p class="cmp-hint">Arah Claude dibalik hanya untuk pencocokan KK → pembanding.</p>' : ''}
      <details class="cmp-raw"><summary>Rincian analisis sumber</summary>${Object.entries(record.original).filter(([title]) => !/^ID\b|^No\.?$/i.test(title)).map(([title, value]) => field(title, value)).join('')}</details>`).join('') : `<p class="cmp-empty">Tidak ditemukan pada analisis ${name}</p>`}</article>`;
  }
  function detail(pair) {
    return `<div class="cmp-panel cmp-detail-panel"><div class="cmp-detail-banner"><h2>Penyandingan Substansi Indikator</h2><span>${esc(indexNames.KK)} (KK) ↔ ${esc(indexNames[pair.index])} (${pair.index})</span><button class="cmp-button" data-action="close-detail">Tutup Detail</button></div>
      <p class="cmp-hint">${statusNames[pair.status]}</p>
      ${pair.mappingIssues.length ? '<p class="cmp-notice">Indikator pembanding belum dapat dipetakan ke Excel acuan pada tingkat rincian yang sama.</p>' : ''}
      <div class="cmp-two cmp-indicators">${card(pair.source, true)}${card(pair.target, false)}</div>
      <h2 class="cmp-analysis-title">Perbandingan Hasil Analisis</h2>${pair.classificationDiffers ? '<p class="cmp-notice">Pasangan ditemukan pada kedua sumber dengan klasifikasi berbeda. Klasifikasi asli masing-masing ditampilkan di bawah.</p>' : ''}
      <div class="cmp-two">${analysis('gpt', pair)}${analysis('claude', pair)}</div></div>`;
  }
  function navigate(stage) {
    state.stage = stage;
    state.detail = '';
    if (stage !== 2) state.selection = null;
    if (stage === 0) {
      Object.assign(state, { source: '', index: '', status: '', type: '', search: '' });
      shell();
      root.querySelector('.cmp-matrix-panel').scrollIntoView({ block: 'start' });
      return;
    }
    update();
  }
  root.addEventListener('click', event => {
    const button = event.target.closest('button, [data-edge]');
    if (!button) return;
    if (button.dataset.stage !== undefined) return navigate(Number(button.dataset.stage));
    if (button.dataset.source) {
      state.source = button.dataset.source;
      state.index = button.dataset.index;
      state.stage = 1;
      state.selection = null;
      state.detail = '';
      return shell();
    }
    if (button.dataset.node || button.dataset.edge) {
      state.selection = { kind: button.dataset.node ? 'node' : 'pair', id: button.dataset.node || button.dataset.edge };
      return navigate(2);
    }
    if (button.dataset.detail) {
      state.detail = button.dataset.detail;
      update();
      root.querySelector('#cmpDetail').focus({ preventScroll: true });
      root.querySelector('#cmpDetail').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    switch (button.dataset.action) {
      case 'back': return navigate(Math.max(0, state.stage - 1));
      case 'list': state.selection = null; return navigate(2);
      case 'clear-selection': state.selection = null; state.detail = ''; return update();
      case 'close-detail': state.detail = ''; return update();
      case 'reset': Object.assign(state, { source: '', index: '', status: '', type: '', search: '', selection: null, detail: '' }); return shell();
    }
  });
  root.addEventListener('keydown', event => {
    if (event.target.matches('[data-edge]') && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      event.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  });
  root.addEventListener('change', event => {
    if (event.target.dataset.action === 'focus') {
      state.focus = event.target.checked;
      highlight(null);
    }
    if (event.target.matches('select[data-filter]')) {
      state[event.target.dataset.filter] = event.target.value;
      state.selection = null;
      state.detail = '';
      update();
    }
  });
  root.addEventListener('input', event => {
    if (event.target.dataset.filter === 'search') {
      state.search = event.target.value;
      state.selection = null;
      state.detail = '';
      update();
    }
  });
  function highlight(id) {
    root.querySelectorAll('[data-edge]').forEach(edge => {
      const dim = state.focus && id && edge.dataset.a !== id && edge.dataset.b !== id;
      edge.classList.toggle('cmp-dim', Boolean(dim));
    });
    root.querySelectorAll('[data-node]').forEach(node => node.classList.toggle('cmp-node-focused', state.focus && node.dataset.node === id));
  }
  root.addEventListener('pointerover', event => highlight(event.target.closest('[data-node]')?.dataset.node));
  root.addEventListener('pointerleave', () => highlight(null));
  root.addEventListener('focusin', event => highlight(event.target.closest('[data-node]')?.dataset.node));
  root.addEventListener('focusout', () => highlight(null));
  menu.addEventListener('click', () => {
    primary.classList.add('cmp-primary-hidden');
    root.hidden = false;
    originalMenus.forEach(button => button.classList.remove('active'));
    menu.classList.add('active');
    navigate(0);
    root.scrollIntoView({ block: 'start' });
  });
  originalMenus.forEach(button => button.addEventListener('click', () => {
    root.hidden = true;
    primary.classList.remove('cmp-primary-hidden');
    menu.classList.remove('active');
  }));
  // Read-only inspection helpers for regression checks, isolated from __portalRB.
  window.__comparisonS4 = { state, filtered, counts, label };
})();
