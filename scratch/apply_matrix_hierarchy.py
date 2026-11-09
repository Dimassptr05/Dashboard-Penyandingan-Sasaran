import re, sys

# Read app.js
with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# 1. Update getAspectIcon to include S4 aspects
old_aspect_icon = '''  function getAspectIcon(name) {
    if (!name) return ICONS.folder;
    const n = String(name).toLowerCase();
    if (n.includes("akses") || n.includes("inklusif")) return ICONS.users;
    if (n.includes("efektivitas") || n.includes("pemerintahan") || n.includes("kendali")) return ICONS.gear;
    if (n.includes("teknis") || n.includes("fondasi") || n.includes("data") || n.includes("teknologi")) return ICONS.cpu;
    if (n.includes("keterlibatan") || n.includes("masyarakat") || n.includes("jaringan")) return ICONS.share;
    if (n.includes("mandat") || n.includes("fungsi")) return ICONS.target;
    if (n.includes("bidang") || n.includes("departemen")) return ICONS.folder;
    if (n.includes("rencana") || n.includes("perencanaan")) return ICONS.doc;
    if (n.includes("risiko") || n.includes("kendali")) return ICONS.shield;
    return ICONS.folder;
  }'''

new_aspect_icon = '''  function getAspectIcon(name) {
    if (!name) return ICONS.folder;
    const n = String(name).toLowerCase();
    if (n.includes("fungsi")) return ICONS.target;
    if (n.includes("ukuran")) return ICONS.layers;
    if (n.includes("proses")) return ICONS.gear;
    if (n.includes("tata kelola") || n.includes("kelola")) return ICONS.shield;
    if (n.includes("akses") || n.includes("inklusif")) return ICONS.users;
    if (n.includes("efektivitas") || n.includes("pemerintahan") || n.includes("kendali")) return ICONS.gear;
    if (n.includes("teknis") || n.includes("fondasi") || n.includes("data") || n.includes("teknologi")) return ICONS.cpu;
    if (n.includes("keterlibatan") || n.includes("masyarakat") || n.includes("jaringan")) return ICONS.share;
    if (n.includes("mandat")) return ICONS.target;
    if (n.includes("bidang") || n.includes("departemen")) return ICONS.folder;
    if (n.includes("rencana") || n.includes("perencanaan")) return ICONS.doc;
    if (n.includes("risiko")) return ICONS.shield;
    return ICONS.folder;
  }'''

if old_aspect_icon in app_js:
    app_js = app_js.replace(old_aspect_icon, new_aspect_icon)
    print("1. Replaced getAspectIcon")
else:
    print("WARNING: Could not find old_aspect_icon")

# 2. Add getKKAspect helper and update getKKGroup in listRawRelations
old_kk_group_block = '''      function getKKGroup(code) {
        if (code.startsWith("SS4-KK.KF.1")) return "1. Mandat (Core Function)";
        if (code.startsWith("SS4-KK.KF.2")) return "2. Distribusi Kewenangan";
        if (code.startsWith("SS4-KK.KF.3")) return "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung";
        if (code.startsWith("SS4-KK.KU.1")) return "1. Rentang Kendali";
        if (code.startsWith("SS4-KK.KU.2")) return "2. Departemensi (Pembidangan)";
        if (code.startsWith("SS4-KK.KP.1")) return "1. Proses Bisnis";
        if (code.startsWith("SS4-KK.KP.2")) return "2. Proses Pengambilan Keputusan";
        if (code.startsWith("SS4-KK.KP.3")) return "3. Proses Perencanaan";
        if (code.startsWith("SS4-KK.TK.1")) return "1. Sistem Kerja";
        if (code.startsWith("SS4-KK.TK.2")) return "2. Budaya Kerja";
        if (code.startsWith("SS4-KK.TK.3")) return "3. Pengendalian Risiko";
        return "Lainnya";
      }'''

new_kk_group_block = '''      function getKKAspect(code) {
        if (code.startsWith("SS4-KK.KF.")) return "Ketepatan Fungsi";
        if (code.startsWith("SS4-KK.KU.")) return "Ketepatan Ukuran";
        if (code.startsWith("SS4-KK.KP.")) return "Ketepatan Proses";
        if (code.startsWith("SS4-KK.TK.")) return "Tata Kelola";
        return "Lainnya";
      }

      function getKKGroup(code) {
        if (code.startsWith("SS4-KK.KF.1")) return "1. Mandat (Core Function)";
        if (code.startsWith("SS4-KK.KF.2")) return "2. Distribusi Kewenangan";
        if (code.startsWith("SS4-KK.KF.3")) return "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung";
        if (code.startsWith("SS4-KK.KU.1")) return "1. Rentang Kendali";
        if (code.startsWith("SS4-KK.KU.2")) return "2. Departemensi (Pembidangan)";
        if (code.startsWith("SS4-KK.KP.1")) return "1. Proses Bisnis";
        if (code.startsWith("SS4-KK.KP.2")) return "2. Proses Pengambilan Keputusan";
        if (code.startsWith("SS4-KK.KP.3")) return "3. Proses Perencanaan";
        if (code.startsWith("SS4-KK.TK.1")) return "1. Sistem Kerja";
        if (code.startsWith("SS4-KK.TK.2")) return "2. Budaya Kerja";
        if (code.startsWith("SS4-KK.TK.3")) return "3. Pengendalian Risiko";
        return "Lainnya";
      }'''

if old_kk_group_block in app_js:
    app_js = app_js.replace(old_kk_group_block, new_kk_group_block)
    print("2. Added getKKAspect helper")
else:
    print("WARNING: Could not find old_kk_group_block")

# In listRawRelations, update srcAspek to use getKKAspect(r.source)
old_src_aspek = '''        const srcAspek = (srcCfg && subSrc) ? srcCfg.getAspek(subSrc) : ((subSrc && subSrc.aspek) ? subSrc.aspek : "Ketepatan Fungsi");'''
new_src_aspek = '''        const srcAspek = getKKAspect(r.source);'''
if old_src_aspek in app_js:
    app_js = app_js.replace(old_src_aspek, new_src_aspek)
    print("3. Updated srcAspek in listRawRelations S4")
else:
    print("WARNING: Could not find old_src_aspek")

# In listRawRelations, update sourceKelompok
old_matched_push = '''          source: srcGroup,
          sourceName: cleanSrcInd,
          sourceAspek: srcAspek,
          sourceIndikator: cleanSrcInd,'''

new_matched_push = '''          source: srcGroup,
          sourceName: cleanSrcInd,
          sourceAspek: srcAspek,
          sourceKelompok: srcGroup,
          sourceIndikator: cleanSrcInd,'''
if old_matched_push in app_js:
    app_js = app_js.replace(old_matched_push, new_matched_push)
    print("4. Updated matched.push in listRawRelations S4")
else:
    print("WARNING: Could not find old_matched_push")

# 5. Update sourceComponents for S4
old_s4_comps = '''    const sId = Number(state.internalSasaranId);
    if (sId === 4) {
      const kkComps = [
        "1. Mandat (Core Function)",
        "2. Distribusi Kewenangan",
        "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung",
        "1. Rentang Kendali",
        "2. Departemensi (Pembidangan)",
        "1. Proses Bisnis",
        "2. Proses Pengambilan Keputusan",
        "3. Proses Perencanaan",
        "1. Sistem Kerja",
        "2. Budaya Kerja",
        "3. Pengendalian Risiko"
      ];
      return kkComps.map(name => ({
        id: name,
        inst: "KK",
        name: name
      }));
    }'''

new_s4_comps = '''    const sId = Number(state.internalSasaranId);
    if (sId === 4) {
      const s4Aspects = [
        {
          id: "Ketepatan Fungsi",
          name: "Ketepatan Fungsi",
          inst: "KK",
          indikatorCount: 7,
          groups: [
            "1. Mandat (Core Function)",
            "2. Distribusi Kewenangan",
            "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung"
          ]
        },
        {
          id: "Ketepatan Ukuran",
          name: "Ketepatan Ukuran",
          inst: "KK",
          indikatorCount: 5,
          groups: [
            "1. Rentang Kendali",
            "2. Departemensi (Pembidangan)"
          ]
        },
        {
          id: "Ketepatan Proses",
          name: "Ketepatan Proses",
          inst: "KK",
          indikatorCount: 7,
          groups: [
            "1. Proses Bisnis",
            "2. Proses Pengambilan Keputusan",
            "3. Proses Perencanaan"
          ]
        },
        {
          id: "Tata Kelola",
          name: "Tata Kelola",
          inst: "KK",
          indikatorCount: 5,
          groups: [
            "1. Sistem Kerja",
            "2. Budaya Kerja",
            "3. Pengendalian Risiko"
          ]
        }
      ];
      return s4Aspects;
    }'''

if old_s4_comps in app_js:
    app_js = app_js.replace(old_s4_comps, new_s4_comps)
    print("5. Updated sourceComponents for S4")
else:
    print("WARNING: Could not find old_s4_comps")

# 6. Update groupRelations to preserve all 168 unique pairs for S4
old_grp_rel = '''  function groupRelations(rows) {
    const byPair = new Map();
    for (const r of rows) {
      const key = `${r.source}\\u241f${r.destInst}\\u241f${r.dest}`;
      if (!byPair.has(key)) {
        byPair.set(key, {
          source: r.source,
          sourceName: r.sourceName,
          sourceInst: r.sourceInst,
          sourceSasaran: r.sourceSasaran,
          sourceSasaranName: r.sourceSasaranName,
          sourceInstName: r.sourceInstName,
          sourceAspek: r.sourceAspek,
          sourceIndikator: r.sourceIndikator,
          sourceSubindikator: r.sourceSubindikator,
          destInst: r.destInst,
          dest: r.dest,
          destName: r.destName,
          destSasaran: r.targetSasaran,
          destSasaranName: r.destSasaranName,
          destInstName: r.destInstName,
          destAspek: r.destAspek,
          destIndikator: r.destIndikator,
          destSubindikator: r.destSubindikator,
          type: r.type,
          level: r.level,
          items: []
        });
      }
      byPair.get(key).items.push(r);
    }
    return [...byPair.values()];
  }'''

new_grp_rel = '''  function groupRelations(rows) {
    const byPair = new Map();
    for (const r of rows) {
      const isS4 = (r.sourceSasaran === 4 && r.targetSasaran === 4);
      // Untuk Sasaran 4, setiap relasi adalah 1 pasangan unik indikator KK dan indikator pembanding (total 168)
      const key = isS4
        ? `${r.sourceCode}\\u241f${r.destCode}`
        : `${r.source}\\u241f${r.destInst}\\u241f${r.dest}`;
      if (!byPair.has(key)) {
        byPair.set(key, {
          source: r.source,
          sourceCode: r.sourceCode,
          sourceName: r.sourceName,
          sourceInst: r.sourceInst,
          sourceSasaran: r.sourceSasaran,
          sourceSasaranName: r.sourceSasaranName,
          sourceInstName: r.sourceInstName,
          sourceAspek: r.sourceAspek,
          sourceKelompok: r.sourceKelompok || r.source,
          sourceIndikator: r.sourceIndikator,
          sourceSubindikator: r.sourceSubindikator,
          destInst: r.destInst,
          dest: r.dest,
          destCode: r.destCode,
          destName: r.destName,
          destSasaran: r.targetSasaran,
          destSasaranName: r.destSasaranName,
          destInstName: r.destInstName,
          destAspek: r.destAspek,
          destIndikator: r.destIndikator,
          destSubindikator: r.destSubindikator,
          type: r.type,
          level: r.level,
          items: []
        });
      }
      byPair.get(key).items.push(r);
    }
    return [...byPair.values()];
  }'''

if old_grp_rel in app_js:
    app_js = app_js.replace(old_grp_rel, new_grp_rel)
    print("6. Updated groupRelations")
else:
    print("WARNING: Could not find old_grp_rel")

# 7. Update filteredRelations for S4 component filtering
old_filtered_rel = '''      if (state.component) {
        const allS3 = state.activeMenu === "internal" &&
          Number(state.internalSasaranId) === 3 && state.source === "ALL";
        if (x.source !== state.component && (!allS3 || x.dest !== state.component)) return false;
      }'''

new_filtered_rel = '''      if (state.component) {
        const allS3 = state.activeMenu === "internal" &&
          Number(state.internalSasaranId) === 3 && state.source === "ALL";
        if (state.activeMenu === "internal" && Number(state.internalSasaranId) === 4) {
          if (x.sourceAspek !== state.component && x.sourceKelompok !== state.component && x.source !== state.component && x.sourceCode !== state.component) {
            return false;
          }
        } else {
          if (x.source !== state.component && (!allS3 || x.dest !== state.component)) return false;
        }
      }'''

if old_filtered_rel in app_js:
    app_js = app_js.replace(old_filtered_rel, new_filtered_rel)
    print("7. Updated filteredRelations")
else:
    print("WARNING: Could not find old_filtered_rel")

# 8. Update populateFilters for S4
old_pop_comps = '''    const comps = sourceComponents();
    fillSelect(
      dom.selectComponent,
      comps.map(x => ({
        value: x.id,
        // Pilihan native tidak lagi melebar ekstrem untuk 92 butir kuesioner.
        label: Number(state.internalSasaranId) === 3 && state.activeMenu === "internal"
          ? `${state.source === "ALL" ? x.inst + " · " : ""}${x.name.length > 75 ? x.name.slice(0, 72).trimEnd() + "…" : x.name}`
          : x.name
      })),
      state.component,
      Number(state.internalSasaranId) === 3 && state.activeMenu === "internal"
        ? (state.source === "ALL" ? "Semua Indikator & Pertanyaan Survei"
          : state.source === "IIIP" ? "Semua Pertanyaan Survei" : "Semua Indikator Desain")
        : "Semua Indikator"
    );'''

new_pop_comps = '''    const isS4InternalComp = (state.activeMenu === "internal" && Number(state.internalSasaranId) === 4);
    if (isS4InternalComp) {
      const s4FilterItems = [
        { value: "Ketepatan Fungsi", label: "Aspek: Ketepatan Fungsi (49 relasi)" },
        { value: "1. Mandat (Core Function)", label: "  ↳ 1. Mandat (Core Function)" },
        { value: "2. Distribusi Kewenangan", label: "  ↳ 2. Distribusi Kewenangan" },
        { value: "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung", label: "  ↳ 3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung" },
        { value: "Ketepatan Ukuran", label: "Aspek: Ketepatan Ukuran (35 relasi)" },
        { value: "1. Rentang Kendali", label: "  ↳ 1. Rentang Kendali" },
        { value: "2. Departemensi (Pembidangan)", label: "  ↳ 2. Departemensi (Pembidangan)" },
        { value: "Ketepatan Proses", label: "Aspek: Ketepatan Proses (49 relasi)" },
        { value: "1. Proses Bisnis", label: "  ↳ 1. Proses Bisnis" },
        { value: "2. Proses Pengambilan Keputusan", label: "  ↳ 2. Proses Pengambilan Keputusan" },
        { value: "3. Proses Perencanaan", label: "  ↳ 3. Proses Perencanaan" },
        { value: "Tata Kelola", label: "Aspek: Tata Kelola (35 relasi)" },
        { value: "1. Sistem Kerja", label: "  ↳ 1. Sistem Kerja" },
        { value: "2. Budaya Kerja", label: "  ↳ 2. Budaya Kerja" },
        { value: "3. Pengendalian Risiko", label: "  ↳ 3. Pengendalian Risiko" }
      ];
      fillSelect(dom.selectComponent, s4FilterItems, state.component, "Semua Aspek & Kelompok KK");
    } else {
      const comps = sourceComponents();
      fillSelect(
        dom.selectComponent,
        comps.map(x => ({
          value: x.id,
          // Pilihan native tidak lagi melebar ekstrem untuk 92 butir kuesioner.
          label: Number(state.internalSasaranId) === 3 && state.activeMenu === "internal"
            ? `${state.source === "ALL" ? x.inst + " · " : ""}${x.name.length > 75 ? x.name.slice(0, 72).trimEnd() + "…" : x.name}`
            : x.name
        })),
        state.component,
        Number(state.internalSasaranId) === 3 && state.activeMenu === "internal"
          ? (state.source === "ALL" ? "Semua Indikator & Pertanyaan Survei"
            : state.source === "IIIP" ? "Semua Pertanyaan Survei" : "Semua Indikator Desain")
          : "Semua Indikator"
      );
    }'''

if old_pop_comps in app_js:
    app_js = app_js.replace(old_pop_comps, new_pop_comps)
    print("8. Updated populateFilters for S4")
else:
    print("WARNING: Could not find old_pop_comps")

# 9. Update renderInternalMatrix completely
# Locate renderInternalMatrix function body up to renderSasaran3Matrix
rim_pattern = re.compile(r'  function renderInternalMatrix\(\) \{.*?  \}\s*function renderSasaran3Matrix\(\)', re.DOTALL)
rim_match = rim_pattern.search(app_js)

if rim_match:
    print("Found renderInternalMatrix to replace, length:", len(rim_match.group(0)))
    new_rim = '''  function renderInternalMatrix() {
    if (dom.externalAuditNoticeBox) dom.externalAuditNoticeBox.classList.add("hidden");
    const sId = Number(state.internalSasaranId);

    // Kasus Khusus Sasaran 3: Integritas & Inovasi
    if (sId === 3) {
      renderSasaran3Matrix();
      return;
    }

    if (dom.sasaran3NoticeBox) dom.sasaran3NoticeBox.classList.add("hidden");

    const pairs = groupRelations(filteredRelations());
    const comps = sourceComponents().filter(x => !state.component || x.id === state.component);
    const dests = listDestinations().filter(x => !state.dest || x === state.dest);

    dom.matrixTitle.textContent = "Matriks Relasi Internal";
    dom.matrixDesc.textContent = sId === 4
      ? "Sasaran 4 — Kapabilitas Kelembagaan"
      : "Sasaran 5 — Pelayanan Publik";

    const heroKpiGrid = dom.stageMatrix ? dom.stageMatrix.querySelector(".hero-kpi-grid") : null;
    if (sId === 4) {
      if (heroKpiGrid) {
        heroKpiGrid.innerHTML = `
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="pairCount">${pairs.length.toLocaleString("id-ID")}</strong>
              <small id="pairUnit">Hubungan Keterkaitan</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatAspects">4</strong>
              <small id="heroStatAspectsUnit">Aspek KK</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong>11</strong>
              <small>Kelompok KK</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong>24</strong>
              <small>Indikator KK</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatComparators">7</strong>
              <small id="heroStatComparatorsUnit">Indeks Pembanding</small>
            </div>
          </div>
        `;
      }
      if (dom.matrixFineprint) {
        dom.matrixFineprint.innerHTML = `
          <span class="fineprint-text">
            ℹ <strong>Keterangan Matriks Relasi Internal Sasaran 4:</strong> Baris menunjukkan aspek Kapabilitas Kelembagaan dan kolom menunjukkan indeks pembanding. Angka dalam sel menunjukkan jumlah pasangan relasi.
          </span>
        `;
      }
    } else {
      if (heroKpiGrid) {
        heroKpiGrid.innerHTML = `
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="pairCount">${pairs.length.toLocaleString("id-ID")}</strong>
              <small id="pairUnit">Pasangan Indikator</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatPoints">${sId === 5 ? "128" : "72"}</strong>
              <small id="heroStatPointsUnit">${sId === 5 ? "Indikator Titik" : "Pertanyaan Survei"}</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatAspects">${comps.length}</strong>
              <small id="heroStatAspectsUnit">Aspek</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatComparators">${dests.length}</strong>
              <small id="heroStatComparatorsUnit">Indeks Pembanding</small>
            </div>
          </div>
        `;
      }
      if (dom.matrixFineprint) {
        dom.matrixFineprint.innerHTML = `
          <span class="fineprint-text">
            ℹ <strong>Satuan Penghitungan:</strong> Angka pada sel matriks adalah jumlah <strong>indikator tujuan unik</strong> yang memiliki rujukan tercatat, bukan banyaknya permutasi kombinasi kode indikator skala penilaian.
          </span>
        `;
      }
    }

    // Header Kolom Matriks dengan Icon Instrumen
    const headerColsHtml = dests.map(code => `
      <th title="${esc(instName(code))}">
        <div class="matrix-col-head-wrap">
          <span class="matrix-col-icon">${getInstrumentIcon(code)}</span>
          <div class="matrix-col-code">${esc(code)}</div>
          <div class="matrix-col-sub">${esc(instName(code))}</div>
        </div>
      </th>
    `).join("");

    let rowsHtml = "";

    if (sId === 4) {
      // Khusus Sasaran 4: 4 Aspek Utama dengan Akordeon/Drilldown ke 11 Kelompok KK
      rowsHtml = comps.map((asp, idx) => {
        let rowTotal = 0;
        const cellsHtml = dests.map(dstCode => {
          const matches = pairs.filter(p => p.sourceAspek === asp.id && p.destInst === dstCode);
          const cnt = matches.length;
          rowTotal += cnt;

          if (cnt > 0) {
            return `
              <td class="matrix-cell-active">
                <div class="matrix-cell-btn" data-mapsrc="${esc(asp.id)}" data-mapinst="${esc(dstCode)}" data-maptype="aspek" role="button" tabindex="0" title="${esc(asp.name)} → ${esc(dstCode)}: ${cnt} hubungan keterkaitan">
                  <span class="cell-num">${cnt}</span>
                </div>
              </td>
            `;
          }
          return `<td><span class="matrix-cell-zero">0</span></td>`;
        }).join("");

        // Sub-rows untuk setiap kelompok di bawah aspek ini
        const subRowsHtml = (asp.groups || []).map(grp => {
          let grpRowTotal = 0;
          const grpCellsHtml = dests.map(dstCode => {
            const matches = pairs.filter(p => p.sourceKelompok === grp && p.destInst === dstCode);
            const cnt = matches.length;
            grpRowTotal += cnt;

            if (cnt > 0) {
              return `
                <td class="matrix-cell-active matrix-subcell-active">
                  <div class="matrix-cell-btn matrix-cell-subbtn" data-mapsrc="${esc(grp)}" data-mapinst="${esc(dstCode)}" data-maptype="kelompok" role="button" tabindex="0" title="${esc(grp)} → ${esc(dstCode)}: ${cnt} hubungan keterkaitan">
                    <span class="cell-num">${cnt}</span>
                  </div>
                </td>
              `;
            }
            return `<td><span class="matrix-cell-zero">0</span></td>`;
          }).join("");

          return `
            <tr class="matrix-group-subrow matrix-subrow-${idx} hidden" style="background:#f8fafc;">
              <td class="row-header subrow-header" style="padding-left:26px;">
                <div class="matrix-row-title-wrap">
                  <span class="subrow-tree-icon" style="color:#0284c7; font-weight:700; margin-right:4px;">↳</span>
                  <span class="matrix-subrow-name" style="font-size:11.5px; font-weight:600; color:#334155;">${esc(grp)}</span>
                </div>
              </td>
              ${grpCellsHtml}
              <td class="matrix-row-total subrow-total" style="font-size:12px; font-weight:600; color:#475569;">${grpRowTotal}</td>
            </tr>
          `;
        }).join("");

        return `
          <tr class="matrix-aspect-row" data-aspect-idx="${idx}">
            <td class="row-header aspect-row-header">
              <div class="matrix-row-title-wrap" style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="matrix-row-icon">${getAspectIcon(asp.name)}</span>
                  <span class="matrix-row-name" style="font-weight:700;">${esc(asp.name.toUpperCase())}</span>
                  <span class="badge-sub-count" style="font-size:10px; color:#0369a1; background:#e0f2fe; padding:2px 6px; border-radius:10px; font-weight:600;">${asp.indikatorCount} Indikator</span>
                </div>
                <button class="btn-toggle-subrow" data-toggle-idx="${idx}" type="button" title="Buka/Tutup Rincian ${asp.groups ? asp.groups.length : 0} Kelompok">
                  <span class="toggle-icon">▶</span> Rincian
                </button>
              </div>
            </td>
            ${cellsHtml}
            <td class="matrix-row-total aspect-row-total" style="font-weight:800;">${rowTotal}</td>
          </tr>
          ${subRowsHtml}
        `;
      }).join("");
    } else {
      // Sasaran 5 dan lainnya
      rowsHtml = comps.map(comp => {
        let rowTotal = 0;
        const cellsHtml = dests.map(dstCode => {
          const matches = pairs.filter(p => p.source === comp.id && p.destInst === dstCode);
          const cnt = matches.length;
          rowTotal += cnt;

          if (cnt > 0) {
            return `
              <td class="matrix-cell-active">
                <div class="matrix-cell-btn" data-mapsrc="${esc(comp.id)}" data-mapinst="${esc(dstCode)}" role="button" tabindex="0" title="${esc(comp.name)} → ${esc(dstCode)}: ${cnt} indikator tujuan">
                  <span class="cell-num">${cnt}</span>
                </div>
              </td>
            `;
          }
          return `<td><span class="matrix-cell-zero">0</span></td>`;
        }).join("");

        return `
          <tr>
            <td class="row-header">
              <div class="matrix-row-title-wrap">
                <span class="matrix-row-icon">${getAspectIcon(comp.name)}</span>
                <span class="matrix-row-name">${esc(comp.name.toUpperCase())}</span>
              </div>
            </td>
            ${cellsHtml}
            <td class="matrix-row-total">${rowTotal}</td>
          </tr>
        `;
      }).join("");
    }

    // Baris Total Kolom
    const totalColsHtml = dests.map(dstCode => {
      const colTotal = pairs.filter(p => p.destInst === dstCode).length;
      return `<td class="matrix-col-total-cell" style="font-weight:800;">${colTotal}</td>`;
    }).join("");

    dom.matrixTableContainer.innerHTML = `
      <table class="matrix-table">
        <thead>
          <tr>
            <th class="col-corner">
              <div class="corner-head-wrap">
                <span class="corner-icon">${ICONS.building}</span>
                <span>${sId === 4 ? "Aspek KK (Baris) \\\\ Indeks Pembanding (Kolom)" : "Indikator Sumber (Baris) \\\\ Indeks Pembanding (Kolom)"}</span>
              </div>
            </th>
            ${headerColsHtml}
            <th class="col-total-header">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr class="matrix-footer-total-row">
            <td class="row-header footer-total-header">
              <div class="matrix-row-title-wrap">
                <span class="matrix-row-icon">${ICONS.layers}</span>
                <span>${sId === 4 ? "TOTAL HUBUNGAN KETERKAITAN" : "TOTAL INDIKATOR TUJUAN"}</span>
              </div>
            </td>
            ${totalColsHtml}
            <td class="matrix-grand-total" style="font-weight:800;">${pairs.length}</td>
          </tr>
        </tbody>
      </table>
    `;

    // Pasang Event Handler Toggle Rincian Kelompok
    dom.matrixTableContainer.querySelectorAll(".btn-toggle-subrow").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = btn.dataset.toggleIdx;
        const subrows = dom.matrixTableContainer.querySelectorAll(`.matrix-subrow-${idx}`);
        const isHidden = subrows.length > 0 && subrows[0].classList.contains("hidden");
        subrows.forEach(r => {
          if (isHidden) {
            r.classList.remove("hidden");
          } else {
            r.classList.add("hidden");
          }
        });
        btn.innerHTML = isHidden ? `<span class="toggle-icon">▼</span> Tutup` : `<span class="toggle-icon">▶</span> Rincian`;
        btn.classList.toggle("active", isHidden);
      };
    });

    // Pasang Event Handler Klik Sel Matriks
    dom.matrixTableContainer.querySelectorAll("[data-mapsrc]").forEach(btn => {
      btn.onclick = () => {
        state.chosenSrc = btn.dataset.mapsrc;
        state.chosenInst = btn.dataset.mapinst;
        state.chosenDest = "";
        state.focusRelation = null;
        if (Number(state.internalSasaranId) === 4) {
          state.s4MacroView = false;
        }
        setStage("graph");
      };
    });

    dom.matrixTableContainer.querySelectorAll(".matrix-cell-active").forEach(td => {
      const btn = td.querySelector("[data-mapsrc]");
      if (btn) {
        td.style.cursor = "pointer";
        td.onclick = (e) => {
          if (e.target !== btn && !btn.contains(e.target)) {
            btn.click();
          }
        };
      }
    });

    if (dom.topbarSummaryText) {
      dom.topbarSummaryText.textContent = sId === 4
        ? `Sasaran 4: ${pairs.length} Hubungan Keterkaitan (KK)`
        : `Sasaran 5: ${pairs.length} Pasangan Indikator (${state.source})`;
    }
  }

  function renderSasaran3Matrix()'''

    app_js = rim_pattern.sub(new_rim, app_js)
    print("9. Replaced renderInternalMatrix successfully!")
else:
    print("WARNING: Could not find renderInternalMatrix to replace!")

# 10. Update renderStageGraph activePairs filtering to match sourceAspek / sourceKelompok
old_graph_pair_filter = '''    if (state.chosenSrc || state.chosenInst) {
      const filtered = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );
      if (filtered.length > 0) {
        activePairs = filtered;
      }
    }'''

new_graph_pair_filter = '''    if (state.chosenSrc || state.chosenInst) {
      const filtered = pairs.filter(p => {
        let srcMatch = true;
        if (state.chosenSrc) {
          srcMatch = (p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc || p.sourceCode === state.chosenSrc);
        }
        let instMatch = true;
        if (state.chosenInst) {
          instMatch = (p.destInst === state.chosenInst);
        }
        return srcMatch && instMatch;
      });
      if (filtered.length > 0) {
        activePairs = filtered;
      }
    }'''

if old_graph_pair_filter in app_js:
    app_js = app_js.replace(old_graph_pair_filter, new_graph_pair_filter)
    print("10. Updated renderStageGraph pair filtering")
else:
    print("WARNING: Could not find old_graph_pair_filter")

# 11. Update renderStageList matchedPairs filter
old_list_matched = '''      const matchedPairs = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );'''

new_list_matched = '''      const matchedPairs = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );'''

if old_list_matched in app_js:
    app_js = app_js.replace(old_list_matched, new_list_matched)
    print("11. Updated renderStageList matchedPairs filter")
else:
    print("WARNING: Could not find old_list_matched")

# 12. Update activePair find in renderStageList
old_list_active_pair = '''      const activePair = pairs.find(p => p.dest === state.chosenDest && (!state.chosenSrc || p.source === state.chosenSrc));'''
new_list_active_pair = '''      const activePair = pairs.find(p => p.dest === state.chosenDest && (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc));'''

if old_list_active_pair in app_js:
    app_js = app_js.replace(old_list_active_pair, new_list_active_pair)
    print("12. Updated activePair find in renderStageList")
else:
    print("WARNING: Could not find old_list_active_pair")

# 13. Update export functions filters
old_exp_csv = '''      } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
        const matchedPairs = pairs.filter(p =>
          (!state.chosenSrc || p.source === state.chosenSrc) &&
          (!state.chosenInst || p.destInst === state.chosenInst)
        );'''
new_exp_csv = '''      } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
        const matchedPairs = pairs.filter(p =>
          (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc) &&
          (!state.chosenInst || p.destInst === state.chosenInst)
        );'''

if old_exp_csv in app_js:
    app_js = app_js.replace(old_exp_csv, new_exp_csv)
    print("13. Updated export CSV filter")
else:
    print("WARNING: Could not find old_exp_csv")

old_exp_pdf = '''    } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
      const matchedPairs = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );'''
new_exp_pdf = '''    } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
      const matchedPairs = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );'''

if old_exp_pdf in app_js:
    app_js = app_js.replace(old_exp_pdf, new_exp_pdf)
    print("14. Updated export PDF filter")
else:
    print("WARNING: Could not find old_exp_pdf")

# 15. Update updateTopbarSummary
old_topbar_summary = '''      } else if (sId === 4) {
        dom.topbarSummaryText.textContent = "Sasaran 4: 168 Hubungan";'''
new_topbar_summary = '''      } else if (sId === 4) {
        dom.topbarSummaryText.textContent = "Sasaran 4: 168 Hubungan Keterkaitan (KK)";'''

if old_topbar_summary in app_js:
    app_js = app_js.replace(old_topbar_summary, new_topbar_summary)
    print("15. Updated updateTopbarSummary")
else:
    print("WARNING: Could not find old_topbar_summary")

# Write updated app.js
with open('app.js', 'w', encoding='utf-8') as f:
    f.write(app_js)

print("Successfully wrote updated app.js!")

