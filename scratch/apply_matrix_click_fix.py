import sys, io, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open('app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update matrix click handler
old_matrix_click = """    // Pasang Event Handler Klik Sel Matriks
    dom.matrixTableContainer.querySelectorAll("[data-mapsrc]").forEach(btn => {
      btn.onclick = () => {
        state.chosenSrc = btn.dataset.mapsrc;
        state.chosenInst = btn.dataset.mapinst;
        state.chosenDest = "";
        state.focusRelation = null;
        setStage("graph");
      };
    });"""

new_matrix_click = """    // Pasang Event Handler Klik Sel Matriks
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
    });"""

assert old_matrix_click in text, "Could not find old_matrix_click in app.js"
text = text.replace(old_matrix_click, new_matrix_click)
print("1. Updated matrix click handler in app.js")

# 2. Update renderStageGraph check for isS4
old_s4_graph_check = """    const isS4 = state.activeMenu === "internal" && Number(state.internalSasaranId) === 4;
    if (isS4 && state.s4MacroView !== false) {
      renderSasaran4MindMap(allFiltered);
      return;
    }"""

new_s4_graph_check = """    const isS4 = state.activeMenu === "internal" && Number(state.internalSasaranId) === 4;
    // Jika dipilih sel tertentu dari matriks (chosenSrc atau chosenInst terisi), langsung tampilkan Peta Detail (Screenshot 1)
    if (isS4 && (state.chosenSrc || state.chosenInst)) {
      state.s4MacroView = false;
    }
    if (isS4 && state.s4MacroView !== false) {
      renderSasaran4MindMap(allFiltered);
      return;
    }"""

assert old_s4_graph_check in text, "Could not find old_s4_graph_check in app.js"
text = text.replace(old_s4_graph_check, new_s4_graph_check)
print("2. Updated renderStageGraph S4 check in app.js")

# 3. Add toolbar handling in renderStageGraph for S4 when in detail view
old_toolbar_display = """    // Toolbar Pengaturan Tampilan & Filter Indeks Tab (Khusus Relasi Internal)
    if (dom.graphToolbar) {
      dom.graphToolbar.style.display = "flex";
      const lineModeControls = dom.graphToolbar.querySelector(".graph-display-mode-group");
      // Khusus S3 garis hanya tampak saat hover; tombol 'Semua Garis'
      // disembunyikan agar tidak berlawanan dengan perilaku ini.
      if (lineModeControls) lineModeControls.style.display = isS3 ? "none" : "flex";
    }"""

new_toolbar_display = """    // Toolbar Pengaturan Tampilan & Filter Indeks Tab (Khusus Relasi Internal)
    if (dom.graphToolbar) {
      dom.graphToolbar.style.display = "flex";
      const lineModeControls = dom.graphToolbar.querySelector(".graph-display-mode-group");
      // Khusus S3 dan S4 garis terfokus; tombol 'Semua Garis' disembunyikan agar tampilan bersih
      if (lineModeControls) lineModeControls.style.display = (isS3 || isS4) ? "none" : "flex";
    }

    if (isS4 && dom.graphToolbar) {
      dom.graphToolbar.innerHTML = `
        <div class="graph-inst-tabs" style="display:flex; align-items:center; gap:8px;">
          <span class="graph-inst-tabs-label">Tampilan Peta Sasaran 4:</span>
          <button class="btn btn-sm ${state.s4MacroView !== false ? 'btn-primary active' : 'btn-outline-secondary'}" id="btnS4MacroToggle">🌿 Peta Makro (7 Indeks)</button>
          <button class="btn btn-sm ${state.s4MacroView === false ? 'btn-primary active' : 'btn-outline-secondary'}" id="btnS4DetailToggle">🕸 Peta Detail (Indikator)</button>
        </div>
      `;
      const btnMacro = dom.graphToolbar.querySelector("#btnS4MacroToggle");
      const btnDetail = dom.graphToolbar.querySelector("#btnS4DetailToggle");
      if (btnMacro && btnDetail) {
        btnMacro.onclick = () => {
          state.s4MacroView = true;
          state.chosenSrc = "";
          state.chosenInst = "";
          renderStageGraph();
        };
        btnDetail.onclick = () => {
          state.s4MacroView = false;
          renderStageGraph();
        };
      }
    }"""

assert old_toolbar_display in text, "Could not find old_toolbar_display in app.js"
text = text.replace(old_toolbar_display, new_toolbar_display)
print("3. Updated toolbar display in renderStageGraph")

# 4. Update renderSasaran4MindMap toolbar buttons with dynamic active class
old_mindmap_toolbar = """    if (dom.graphToolbar) {
      dom.graphToolbar.style.display = "flex";
      dom.graphToolbar.innerHTML = `
        <div class="graph-inst-tabs" style="display:flex; align-items:center; gap:8px;">
          <span class="graph-inst-tabs-label">Tampilan Peta Sasaran 4:</span>
          <button class="btn btn-sm btn-primary active" id="btnS4MacroToggle">🌿 Peta Makro (7 Indeks)</button>
          <button class="btn btn-sm btn-outline-secondary" id="btnS4DetailToggle">🕸 Peta Detail (Indikator)</button>
        </div>
      `;
      const btnMacro = dom.graphToolbar.querySelector("#btnS4MacroToggle");
      const btnDetail = dom.graphToolbar.querySelector("#btnS4DetailToggle");
      if (btnMacro && btnDetail) {
        btnMacro.onclick = () => {
          state.s4MacroView = true;
          renderStageGraph();
        };
        btnDetail.onclick = () => {
          state.s4MacroView = false;
          renderStageGraph();
        };
      }
    }"""

new_mindmap_toolbar = """    if (dom.graphToolbar) {
      dom.graphToolbar.style.display = "flex";
      dom.graphToolbar.innerHTML = `
        <div class="graph-inst-tabs" style="display:flex; align-items:center; gap:8px;">
          <span class="graph-inst-tabs-label">Tampilan Peta Sasaran 4:</span>
          <button class="btn btn-sm ${state.s4MacroView !== false ? 'btn-primary active' : 'btn-outline-secondary'}" id="btnS4MacroToggle">🌿 Peta Makro (7 Indeks)</button>
          <button class="btn btn-sm ${state.s4MacroView === false ? 'btn-primary active' : 'btn-outline-secondary'}" id="btnS4DetailToggle">🕸 Peta Detail (Indikator)</button>
        </div>
      `;
      const btnMacro = dom.graphToolbar.querySelector("#btnS4MacroToggle");
      const btnDetail = dom.graphToolbar.querySelector("#btnS4DetailToggle");
      if (btnMacro && btnDetail) {
        btnMacro.onclick = () => {
          state.s4MacroView = true;
          state.chosenSrc = "";
          state.chosenInst = "";
          renderStageGraph();
        };
        btnDetail.onclick = () => {
          state.s4MacroView = false;
          renderStageGraph();
        };
      }
    }"""

assert old_mindmap_toolbar in text, "Could not find old_mindmap_toolbar in app.js"
text = text.replace(old_mindmap_toolbar, new_mindmap_toolbar)
print("4. Updated renderSasaran4MindMap toolbar")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Successfully wrote updated app.js")

# 5. Bump index.html cache version to 20261109_v8
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'v=20261109_v7', 'v=20261109_v8', html)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Successfully bumped index.html cache version to 20261109_v8")

