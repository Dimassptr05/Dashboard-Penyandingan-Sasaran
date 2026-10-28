/**
 * ============================================================================
 * DASHBOARD RELASI ANTAR-SASARAN REFORMASI BIROKRASI
 * Integrasi Data Relasi Eksternal Terbaru & Pengelompokan Komponen Analitis
 * 100% Statis (HTML + CSS + JS), Tanpa Database / Backend / API
 * Kompatibel Protokol file://
 * Sumber: Bahan paparan Kamis (30092026).xlsx
 * ============================================================================
 */

(function () {
  "use strict";

  // 1. Data Sumber
  const sasaranData = window.RB_SASARAN_DATA || { sasaran: [], instrumen: [], indikator: [], kelompok_s4: [] };
  const relasiInternal = window.RB_RELASI_INTERNAL || { sasaran3: { relasi: [], placeholders: [] }, sasaran4: [], sasaran5: [] };
  const relasiEksternalLama = window.RB_RELASI_EKSTERNAL || { matriks_5x5: [], relasi: [] };
  const revisiData = window.RB_DATA || null;
  const extLatest = window.RB_EXTERNAL_LATEST || null;

  // Nama resmi instrumen untuk tooltip & label
  const instLabels = {
    KK: "Kapabilitas Kelembagaan",
    IPPN: "Indeks Perencanaan Pembangunan Nasional",
    CKKP: "Capaian Kontribusi Kinerja Pembangunan",
    SPIP: "Sistem Pengendalian Intern Pemerintah",
    SAKIP: "Sistem Akuntabilitas Kinerja Instansi Pemerintah",
    ELPPD: "Evaluasi Laporan Penyelenggaraan Pemda",
    IKPA: "Indikator Kinerja Pelaksanaan Anggaran",
    IPA: "Indeks Pengelolaan Aset",
    IPP: "Indeks Pelayanan Publik",
    OP: "Opini Pengawasan Pelayanan Publik",
    IKK: "Indeks Kualitas Kebijakan",
    ZI: "Zona Integritas",
    PEMDI: "Pemerintah Digital",
    SM: "Sistem Merit",
    IIIP: "Instrumen Pengumpulan Data Survei Indeks Inovasi Instansi Pemerintah (IIIP)",
    DIIIP: "Desain Indeks Inovasi Instansi Pemerintah (IIIP)",
    SPI: "Survei Penilaian Integritas (Historis Nonaktif)"
  };
  const instName = code => instLabels[code] || code;

  // Normalisasi Kode Singkat Instrumen
  function getInstrumentShortCode(codeOrGroup, instNameParam) {
    if (!codeOrGroup) return instNameParam || "";
    if (codeOrGroup.startsWith("SS2-SM")) return "SM";
    if (codeOrGroup.startsWith("SS3-DIIIP")) return "DIIIP";
    if (codeOrGroup.startsWith("SS3-IIIP")) return "IIIP";
    if (codeOrGroup.startsWith("SS3-SPI")) return "SPI";
    if (codeOrGroup.startsWith("SS4-KK")) return "KK";
    if (codeOrGroup.startsWith("SS4-IPPN")) return "IPPN";
    if (codeOrGroup.startsWith("SS4-SAKIP")) return "SAKIP";
    if (codeOrGroup.startsWith("SS4-ELPPD")) return "ELPPD";
    if (codeOrGroup.startsWith("SS5-IPP")) return "IPP";
    if (codeOrGroup.startsWith("SS5-OP")) return "OP";
    if (codeOrGroup.startsWith("SS5-IKK")) return "IKK";
    if (codeOrGroup.startsWith("SS5-ZI")) return "ZI";
    if (codeOrGroup.startsWith("SS1-PEMDI")) return "PEMDI";
    return instNameParam || codeOrGroup;
  }

  // Lookup Substansi Resmi Indikator dari Bahan Paparan Kamis
  function getSubstansi(code) {
    if (!code) return null;
    const db = window.RB_SUBSTANSI_INDIKATOR;
    if (!db) return null;
    if (db[code]) return db[code];
    for (const k in db) {
      if (k.startsWith(code + ".") || code.startsWith(k + ".")) {
        return db[k];
      }
    }
    return null;
  }

  // Katalog Indikator Terbaru untuk Lookup Penjelasan / Deskripsi Resmi
  const extCatalogMap = new Map();
  if (extLatest && extLatest.catalog) {
    extLatest.catalog.forEach(item => extCatalogMap.set(item.code, item));
  }

  // Helper untuk Mendapatkan Nama / Deskripsi Kelompok Kode Teknis (Tanpa Kode Teknis)
  function getComponentGroupName(groupKey) {
    if (!groupKey) return "";
    const sub = getSubstansi(groupKey);
    if (sub && sub.indikator) {
      return sub.indikator;
    }
    if (extLatest && extLatest.catalog) {
      const match = extLatest.catalog.find(c => c.component_key === groupKey || c.code === groupKey);
      if (match && match.description) {
        const firstLine = match.description.split("\n")[0].trim();
        return firstLine.length > 90 ? firstLine.slice(0, 87) + "..." : firstLine;
      }
    }
    return groupKey;
  }

  // Map Sasaran
  const sasaranMap = {};
  if (sasaranData.sasaran) {
    sasaranData.sasaran.forEach(s => { sasaranMap[s.id] = s; });
  }

  // Metadata Lengkap Sasaran Strategis RB 1 s.d. 5
  const sasaranInfo = {
    1: {
      kode: "Sasaran 1",
      nama: "Transformasi Digital",
      nama_singkat: "Transformasi Digital",
      pembina: "Pemerintah Digital (PEMDI)"
    },
    2: {
      kode: "Sasaran 2",
      nama: "Aparatur Negara",
      nama_singkat: "Sistem Merit",
      pembina: "Sistem Merit (SM)"
    },
    3: {
      kode: "Sasaran 3",
      nama: "Perilaku Birokrasi & Integritas",
      nama_singkat: "Integritas & Inovasi",
      pembina: "Instrumen Pengumpulan Data IIIP & Desain IIIP"
    },
    4: {
      kode: "Sasaran 4",
      nama: "Kapabilitas Kelembagaan",
      nama_singkat: "Kapabilitas Kelembagaan",
      pembina: "Kapabilitas Kelembagaan (KK)"
    },
    5: {
      kode: "Sasaran 5",
      nama: "Pelayanan Publik",
      nama_singkat: "Pelayanan Publik",
      pembina: "IPP, OP, IKK, ZI"
    }
  };
  function getSasaranInfo(id) {
    const num = Number(id);
    return sasaranInfo[num] || {
      kode: `Sasaran ${num}`,
      nama: `Sasaran ${num}`,
      nama_singkat: `Sasaran ${num}`,
      pembina: ""
    };
  }

  // Map Indikator dari Data Sasaran
  const indicatorMap = new Map();
  if (sasaranData.indikators) {
    sasaranData.indikators.forEach(item => indicatorMap.set(item.code, item));
  }

  // 2. State Aplikasi
  const state = {
    activeMenu: "internal",        // "internal" | "external"
    activeStage: "matrix",         // "matrix" | "graph" | "list"
    internalSasaranId: 5,          // 5 (default Sasaran 5), 4, atau 3
    extDirection: "ALL",           // "ALL" | "1_2" | "1_3" | "1_4" | "1_5"
    extSrcSasaran: 1,              // Sasaran sumber terpilih pada mode eksternal (1: PEMDI)
    extDstSasaran: "ALL",          // "ALL" | 2 | 3 | 4 | 5
    source: "IPP",                 // Filter indeks sumber
    component: "",                 // Filter indikator sumber
    dest: "",                      // Filter indeks pembanding
    rtype: "",                     // Filter jenis keterkaitan
    search: "",                    // Pencarian bebas
    chosenSrc: "",                 // Indikator sumber terpilih saat klik matriks
    chosenInst: "",                // Indeks pembanding terpilih saat klik matriks
    chosenDest: "",                // Indikator tujuan terpilih saat klik kartu peta
    focusRelation: null,           // Relasi spesifik terpilih
    extInstFilter: "ALL",          // Filter tab instrumen pada Peta Relasi Eksternal
    graphMode: "focus",            // "focus" atau "all" untuk garis diagram
    s3Compact: true,               // Sasaran 3: tampilkan satu indikator Desain IIIP per peta
    s3SelectedIndicator: "",       // Kode indikator Desain IIIP yang dipilih
    s3SelectedSurveyQuestion: "",  // Jika filter sumber berupa pertanyaan survei
    s3GraphPickedIndicator: false, // Pilihan eksplisit dari dropdown tahap 2
    listTypeFilters: []           // Tahap 3: daftar jenis keterkaitan yang aktif; kosong = semua
  };

  // 3. Referensi Elemen DOM
  const dom = {
    // Menu Sidebar
    menuInternal: document.getElementById("menuInternal"),
    menuExternal: document.getElementById("menuExternal"),
    sidebarScopeTitle: document.getElementById("sidebarScopeTitle"),
    sidebarScopeDesc: document.getElementById("sidebarScopeDesc"),
    btnOpenArchitectureModal: document.getElementById("btnOpenArchitectureModal"),

    // Topbar & Stepper
    bcMenu: document.getElementById("bcMenu"),
    bcScope: document.getElementById("bcScope"),
    bcStage: document.getElementById("bcStage"),
    btnGlobalBack: document.getElementById("btnGlobalBack"),
    btnGlobalBackText: document.getElementById("btnGlobalBackText"),
    topbarSummaryText: document.getElementById("topbarSummaryText"),

    step1Btn: document.getElementById("step1Btn"),
    step2Btn: document.getElementById("step2Btn"),
    step3Btn: document.getElementById("step3Btn"),
    stepLine1: document.getElementById("stepLine1"),
    stepLine2: document.getElementById("stepLine2"),

    // Filter Bar
    mainFilterBar: document.getElementById("mainFilterBar"),
    groupInternalSasaranSelect: document.getElementById("groupInternalSasaranSelect"),
    selectInternalSasaran: document.getElementById("selectInternalSasaran"),
    groupExtSourceSasaranSelect: document.getElementById("groupExtSourceSasaranSelect"),
    selectExtSourceSasaran: document.getElementById("selectExtSourceSasaran"),
    labelExtSourceSasaran: document.getElementById("labelExtSourceSasaran"),
    groupExtDestSasaranSelect: document.getElementById("groupExtDestSasaranSelect"),
    selectExtDestSasaran: document.getElementById("selectExtDestSasaran"),
    labelExtDestSasaran: document.getElementById("labelExtDestSasaran"),
    groupSourceSelect: document.getElementById("groupSourceSelect"),
    selectSource: document.getElementById("selectSource"),
    labelSourceSelect: document.getElementById("labelSourceSelect"),
    groupComponentSelect: document.getElementById("groupComponentSelect"),
    selectComponent: document.getElementById("selectComponent"),
    labelComponentSelect: document.getElementById("labelComponentSelect"),
    groupDestinationSelect: document.getElementById("groupDestinationSelect"),
    selectDestination: document.getElementById("selectDestination"),
    labelDestinationSelect: document.getElementById("labelDestinationSelect"),
    groupRelationTypeSelect: document.getElementById("groupRelationTypeSelect"),
    selectRelationType: document.getElementById("selectRelationType"),
    inputSearchFree: document.getElementById("inputSearchFree"),
    btnResetFilters: document.getElementById("btnResetFilters"),
    logicNote: document.getElementById("logicNote"),
    contextBanner: document.getElementById("contextBanner"),
    contextTag: document.getElementById("contextTag"),
    contextText: document.getElementById("contextText"),
    contextActions: document.getElementById("contextActions"),

    // Tahap 1: Matriks
    stageMatrix: document.getElementById("stageMatrix"),
    matrixTitle: document.getElementById("matrixTitle"),
    matrixDesc: document.getElementById("matrixDesc"),
    pairCount: document.getElementById("pairCount"),
    pairUnit: document.getElementById("pairUnit"),
    btnExportPdfMatrix: document.getElementById("btnExportPdfMatrix"),
    matrixTableContainer: document.getElementById("matrixTableContainer"),
    matrixFineprint: document.getElementById("matrixFineprint"),
    sasaran3NoticeBox: document.getElementById("sasaran3NoticeBox"),
    btnToggleS3Clarifications: document.getElementById("btnToggleS3Clarifications"),
    s3ClarificationsContainer: document.getElementById("s3ClarificationsContainer"),
    externalAuditNoticeBox: document.getElementById("externalAuditNoticeBox"),
    btnToggleExternalReview: document.getElementById("btnToggleExternalReview"),
    btnToggleExternalDuplicates: document.getElementById("btnToggleExternalDuplicates"),
    externalReviewContainer: document.getElementById("externalReviewContainer"),
    externalDuplicatesContainer: document.getElementById("externalDuplicatesContainer"),

    // Tahap 2: Peta Relasi
    stageGraph: document.getElementById("stageGraph"),
    graphToolbar: document.getElementById("graphToolbar"),
    graphInstTabs: document.getElementById("graphInstTabs"),
    btnGraphModeFocus: document.getElementById("btnGraphModeFocus"),
    btnGraphModeAll: document.getElementById("btnGraphModeAll"),
    graphTitle: document.getElementById("graphTitle"),
    graphDesc: document.getElementById("graphDesc"),
    mapTotal: document.getElementById("mapTotal"),
    mapUnit: document.getElementById("mapUnit"),
    btnBackToMatrixFromGraph: document.getElementById("btnBackToMatrixFromGraph"),
    btnExportPdfGraph: document.getElementById("btnExportPdfGraph"),
    btnGoToListFromGraph: document.getElementById("btnGoToListFromGraph"),
    diagramViewport: document.getElementById("diagramViewport"),
    diagramSvg: document.getElementById("diagramSvg"),
    svgPathGroup: document.getElementById("svgPathGroup"),
    colSourceTitle: document.getElementById("colSourceTitle"),
    colSourceCount: document.getElementById("colSourceCount"),
    containerSourceCards: document.getElementById("containerSourceCards"),
    colDestTitle: document.getElementById("colDestTitle"),
    colDestCount: document.getElementById("colDestCount"),
    containerDestCards: document.getElementById("containerDestCards"),

    // Tahap 3: Daftar Relasi
    stageList: document.getElementById("stageList"),
    listTitle: document.getElementById("listTitle"),
    listDesc: document.getElementById("listDesc"),
    listVisibleCount: document.getElementById("listVisibleCount"),
    listCountSummary: document.getElementById("listCountSummary"),
    listTypeOptions: document.getElementById("listTypeOptions"),
    btnBackToGraphFromList: document.getElementById("btnBackToGraphFromList"),
    btnBackToMatrixFromList: document.getElementById("btnBackToMatrixFromList"),
    btnExportPdfList: document.getElementById("btnExportPdfList"),
    btnExportCsv: document.getElementById("btnExportCsv"),
    focusRelationCard: document.getElementById("focusRelationCard"),
    detailIntroNotice: document.getElementById("detailIntroNotice"),
    tableRelationBody: document.getElementById("tableRelationBody"),
    tableMoreNotice: document.getElementById("tableMoreNotice"),
    listEmptyState: document.getElementById("listEmptyState"),
    btnEmptyReset: document.getElementById("btnEmptyReset"),

    // Modal
    modalArchitecture: document.getElementById("modalArchitecture"),
    btnCloseModal: document.getElementById("btnCloseModal"),
    btnDismissModal: document.getElementById("btnDismissModal")
  };

  // 4. Utilitas Helper
  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  function csvCell(s) {
    return '"' + String(s ?? "").replaceAll('"', '""') + '"';
  }

  function fillSelect(el, items, val, allLabel) {
    if (!el) return;
    el.innerHTML = (allLabel ? `<option value="">${esc(allLabel)}</option>` : "") +
      items.map(item => `<option value="${esc(item.value)}">${esc(item.label)}</option>`).join("");
    el.value = val;
  }

  // 5. Query Instrumen & Komponen Sumber
  function listSources() {
    if (state.activeMenu === "external") {
      return ["PEMDI"];
    }
    const sId = Number(state.internalSasaranId);
    if (sId === 4) return ["KK"];
    if (sId === 5) return ["IPP", "OP", "IKK", "ZI"];
    if (sId === 3) return ["ALL", "IIIP", "DIIIP"];
    return ["KK"];
  }

  function sourceComponents() {
    if (state.activeMenu === "external") {
      if (!extLatest || !extLatest.relations) return [];
      const matched = new Set();
      const list = [];
      for (const r of extLatest.relations) {
        if (state.extDstSasaran && state.extDstSasaran !== "ALL") {
          if (r.source_sasaran !== Number(state.extDstSasaran)) continue;
        }
        const dstInst = getInstrumentShortCode(r.source_group, r.source_instrument);
        if (state.dest && dstInst !== state.dest) continue;
        if (!matched.has(r.target_group)) {
          matched.add(r.target_group);
          const nameDesc = getComponentGroupName(r.target_group);
          list.push({
            id: r.target_group,
            inst: "PEMDI",
            sasaran: 1,
            name: nameDesc,
            groupTitle: nameDesc
          });
        }
      }
      return list.sort((a, b) => a.id.localeCompare(b.id, "id"));
    }

    const sId = Number(state.internalSasaranId);
    if (sId === 4) {
      const kkComps = [
        "Departementasi (Pembidangan)",
        "Mandat (Core Function)",
        "Pengendalian Risiko",
        "Proses Perencanaan",
        "Rentang Kendali"
      ];
      return kkComps.map(name => ({
        id: name,
        inst: "KK",
        name: name
      }));
    }
    if (sId === 5) {
      if (revisiData && revisiData.s5 && revisiData.s5.codes) {
        const groups = new Set(
          Object.values(revisiData.s5.codes)
            .filter(c => c.inst === state.source)
            .map(c => c.group)
        );
        return [...groups]
          .sort((a, b) => a.localeCompare(b, "id"))
          .map(g => ({ id: g, inst: state.source, name: g }));
      }
      return [];
    }
    if (sId === 3) {
      const s3Rels = relasiInternal.sasaran3?.relasi || [];
      const currentSrc = state.source || "IIIP";
      const isAll = currentSrc === "ALL";
      const matched = new Set();
      const list = [];
      for (const r of s3Rels) {
        for (const side of ["asal", "tujuan"]) {
          const inst = r[side + "_instrumen"];
          if (!isAll && inst !== currentSrc) continue;
          const id = r[side + "_kode"];
          const name = r[side + "_nama"];
          if (id && !matched.has(id)) {
            matched.add(id);
            list.push({ id, inst, name });
          }
        }
      }
      return list.sort((a, b) => (a.inst === b.inst ? a.name.localeCompare(b.name, "id", { numeric: true }) : a.inst.localeCompare(b.inst)));
    }
    return [];
  }

  function listDestinations() {
    if (state.activeMenu === "external") {
      const dstSasaran = state.extDstSasaran;
      if (dstSasaran === 2 || state.extDirection === "1_2") return ["SM"];
      if (dstSasaran === 3 || state.extDirection === "1_3") return ["IIIP", "DIIIP"];
      if (dstSasaran === 4 || state.extDirection === "1_4") return ["KK", "IPPN", "SAKIP", "ELPPD"];
      if (dstSasaran === 5 || state.extDirection === "1_5") return ["IPP", "OP", "IKK", "ZI"];
      return ["SM", "IIIP", "DIIIP", "KK", "IPPN", "SAKIP", "ELPPD", "IPP", "OP", "IKK", "ZI"];
    }
    const sId = Number(state.internalSasaranId);
    if (sId === 4) {
      return ["IPPN", "CKKP", "SPIP", "SAKIP", "ELPPD", "IKPA", "IPA"];
    }
    if (sId === 5) {
      return ["IPP", "OP", "IKK", "ZI"].filter(i => i !== state.source);
    }
    if (sId === 3) {
      return state.source === "ALL" ? ["IIIP", "DIIIP"]
        : ["IIIP", "DIIIP"].filter(i => i !== (state.source || "IIIP"));
    }
    return [];
  }

  // 6. Pengambilan & Normalisasi Relasi
  function listRawRelations() {
    const matched = [];
    const jk = window.RB_JENIS_KETERKAITAN;

    if (state.activeMenu === "external") {
      if (!extLatest || !extLatest.relations) return [];
      const rels = extLatest.relations;

      for (const r of rels) {
        // Pada Tahap 1 Matriks, semua arah sasaran (1->2, 1->3, 1->4, 1->5) harus selalu dihitung untuk mengisi sel-sel matriks
        if (state.activeStage !== "matrix" && state.extDstSasaran && state.extDstSasaran !== "ALL") {
          if (r.source_sasaran !== Number(state.extDstSasaran)) continue;
        }

        const externalInst = getInstrumentShortCode(r.source_group, r.source_instrument);
        const srcInst = "PEMDI";
        const dstInst = externalInst;

        if (state.source && srcInst !== state.source) continue;
        if (state.dest && dstInst !== state.dest) continue;

        const subExt = getSubstansi(r.source);
        const subPemdi = getSubstansi(r.target);

        const extCat = extCatalogMap.get(r.source);
        const pemdiCat = extCatalogMap.get(r.target);
        const extDesc = (subExt && subExt.indikator) ? subExt.indikator : (extCat ? extCat.description.split("\n")[0].trim() : "");
        const pemdiDesc = (subPemdi && subPemdi.indikator) ? subPemdi.indikator : (pemdiCat ? pemdiCat.description.split("\n")[0].trim() : "");

        const meta = jk ? jk.getKlasifikasi(r.source_group, r.target_group, r.source, r.target, extDesc, pemdiDesc) : {
          jenis: "Mendukung",
          status: "USULAN / Perlu validasi",
          alasan: (extDesc && pemdiDesc ? `"${pemdiDesc}" berkaitan dengan "${extDesc}".` : "")
        };

        if (state.rtype && meta.jenis !== state.rtype) continue;

        const srcSasaranName = "Sasaran 1 — Transformasi Digital";
        const dstSasaranName = (subExt && subExt.sasaran_name) ? subExt.sasaran_name : `Sasaran ${r.source_sasaran}`;

        const srcInstName = "Pemerintah Digital (PEMDI)";
        const dstInstName = (subExt && subExt.instrument_name) ? subExt.instrument_name : instName(dstInst);

        const srcAspek = (subPemdi && subPemdi.aspek) ? subPemdi.aspek : "";
        const dstAspek = (subExt && subExt.aspek) ? subExt.aspek : "";

        const srcIndikator = (subPemdi && subPemdi.indikator) ? subPemdi.indikator : (pemdiDesc || r.target_group);
        const dstIndikator = (subExt && subExt.indikator) ? subExt.indikator : (extDesc || r.source_group);

        const srcSubindikator = (subPemdi && subPemdi.subindikator) ? subPemdi.subindikator : "";
        const dstSubindikator = (subExt && subExt.subindikator) ? subExt.subindikator : "";

        matched.push({
          id: `${r.target}_${r.source}_${r.reference_cell}`,
          sasaran: `Sasaran 1 → Sasaran ${r.source_sasaran}`,
          sourceSasaran: 1,
          targetSasaran: r.source_sasaran,
          sourceSasaranName: srcSasaranName,
          destSasaranName: dstSasaranName,
          sourceInst: srcInst,
          sourceInstName: srcInstName,
          destInst: dstInst,
          destInstName: dstInstName,
          source: r.target_group,
          sourceName: srcIndikator,
          sourceAspek: srcAspek,
          sourceIndikator: srcIndikator,
          sourceSubindikator: srcSubindikator,
          dest: r.source_group,
          destName: dstIndikator,
          destAspek: dstAspek,
          destIndikator: dstIndikator,
          destSubindikator: dstSubindikator,
          type: meta.jenis,
          level: meta.status || "USULAN / Perlu validasi",
          tingkat: null,
          codes: [[r.target, r.source]],
          sourceCode: r.target,
          destCode: r.source,
          sourceQuestion: pemdiDesc,
          destQuestion: extDesc,
          reason: meta.alasan || (pemdiDesc && extDesc ? `"${pemdiDesc}" berkaitan dengan "${extDesc}".` : "Keterkaitan operasional antar-indikator sasaran strategis."),
          refs: [`Sheet: ${r.sheet}; Sel Rujukan: ${r.reference_cell}; Sel Sumber: ${r.source_cell}`]
        });
      }
      return matched;
    }

    const sId = Number(state.internalSasaranId);

    if (sId === 4) {
      // Sasaran 4: 50 Hubungan Internal sesuai data resmi data-sasaran.js
      function getKKGroup(code) {
        if (code.startsWith("SS4-KK.KF")) return "Mandat (Core Function)";
        if (code.startsWith("SS4-KK.KU.1")) return "Rentang Kendali";
        if (code.startsWith("SS4-KK.KU.2")) return "Departementasi (Pembidangan)";
        if (code.startsWith("SS4-KK.KP.3")) return "Proses Perencanaan";
        if (code.startsWith("SS4-KK.TK.3")) return "Pengendalian Risiko";
        return "Lainnya";
      }

      const s4SourceRels = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4);
      for (const r of s4SourceRels) {
        const src = indicatorMap.get(r.source);
        const dst = indicatorMap.get(r.target);

        const subSrc = getSubstansi(r.source);
        const subDst = getSubstansi(r.target);

        const srcGroup = getKKGroup(r.source);
        const dstInst = dst ? dst.instrumentCode : r.target.split(".")[0].replace("SS4-", "");
        const dstGroup = dst ? (dst.label.split("—")[0].trim().replace(/^\d+\.\s*/, "") || r.target) : r.target;
        const dstLabel = dst ? dst.label : r.target;
        const srcLabel = src ? src.label : r.source;

        const srcSasaranName = "Sasaran 4 — Kapabilitas Kelembagaan";
        const dstSasaranName = "Sasaran 4 — Kapabilitas Kelembagaan";

        const srcInstName = "Kapabilitas Kelembagaan (KK)";
        const dstInstName = (subDst && subDst.instrument_name) ? subDst.instrument_name : instName(dstInst);

        const srcAspek = (subSrc && subSrc.aspek) ? subSrc.aspek : "Ketepatan Fungsi";
        const dstAspek = (subDst && subDst.aspek) ? subDst.aspek : "";

        const srcIndikator = (subSrc && subSrc.indikator) ? subSrc.indikator : srcGroup;
        const dstIndikator = (subDst && subDst.indikator) ? subDst.indikator : dstLabel.replace(/^SS4-[^—]+—\s*/, "");

        const srcSubindikator = (subSrc && subSrc.subindikator) ? subSrc.subindikator : "";
        const dstSubindikator = (subDst && subDst.subindikator) ? subDst.subindikator : "";

        const metaS4 = (jk && typeof jk.classifySasaran4 === "function")
          ? jk.classifySasaran4(srcGroup, dstInst, dstGroup, r.source, r.target, srcIndikator, dstIndikator)
          : {
              jenis: "Mendukung",
              status: null,
              alasan: `"${srcIndikator}" berkaitan dengan "${dstIndikator}".`
            };

        if (state.rtype && metaS4.jenis !== state.rtype) continue;

        matched.push({
          id: `${r.source}_${r.target}_${r.sourceCell || ""}`,
          sasaran: "Sasaran 4",
          sourceSasaran: 4,
          targetSasaran: 4,
          sourceSasaranName: srcSasaranName,
          destSasaranName: dstSasaranName,
          sourceInst: "KK",
          sourceInstName: srcInstName,
          source: srcGroup,
          sourceName: srcIndikator,
          sourceAspek: srcAspek,
          sourceIndikator: srcIndikator,
          sourceSubindikator: srcSubindikator,
          destInst: dstInst,
          destInstName: dstInstName,
          dest: r.target,
          destName: dstIndikator,
          destAspek: dstAspek,
          destIndikator: dstIndikator,
          destSubindikator: dstSubindikator,
          type: metaS4.jenis,
          level: "Tervalidasi Substantif",
          tingkat: null,
          codes: [[r.source, r.target]],
          sourceCode: r.source,
          destCode: r.target,
          sourceQuestion: srcLabel,
          destQuestion: dstLabel,
          reason: metaS4.alasan || `"${srcIndikator}" berkaitan dengan "${dstIndikator}".`,
          refs: [`Sel: ${r.sourceCell}; Kolom: ${r.relationColumn}`]
        });
      }
      return matched;
    }

    if (sId === 5) {
      // Sasaran 5: 2.205 pasangan kode unik dinormalisasi berdasarkan indeks sumber terpilih
      if (revisiData && revisiData.s5 && revisiData.s5.relations) {
        for (const l of revisiData.s5.relations) {
          const a = revisiData.s5.codes[l.s];
          const b = revisiData.s5.codes[l.t];
          if (!a || !b) continue;

          let src = a, dst = b;
          if (a.inst !== state.source && b.inst === state.source) {
            src = b; dst = a;
          } else if (a.inst !== state.source) {
            continue;
          }

          if (src.inst === dst.inst) continue;

          const subSrc = getSubstansi(src.code);
          const subDst = getSubstansi(dst.code);

          const srcSasaranName = "Sasaran 5 — Pelayanan Publik";
          const dstSasaranName = "Sasaran 5 — Pelayanan Publik";

          const srcInstName = (subSrc && subSrc.instrument_name) ? subSrc.instrument_name : instName(src.inst);
          const dstInstName = (subDst && subDst.instrument_name) ? subDst.instrument_name : instName(dst.inst);

          const srcAspek = (subSrc && subSrc.aspek) ? subSrc.aspek : src.group;
          const dstAspek = (subDst && subDst.aspek) ? subDst.aspek : dst.group;

          const srcIndikator = (subSrc && subSrc.indikator) ? subSrc.indikator : (src.question || src.group);
          const dstIndikator = (subDst && subDst.indikator) ? subDst.indikator : (dst.question || dst.group);

          const srcSubindikator = (subSrc && subSrc.subindikator) ? subSrc.subindikator : "";
          const dstSubindikator = (subDst && subDst.subindikator) ? subDst.subindikator : "";

          const metaS5 = (jk && typeof jk.classifySasaran5 === "function")
            ? jk.classifySasaran5(src.group, dst.group, src.inst, dst.inst, src.code, dst.code, src.question, dst.question)
            : {
                jenis: "Mendukung",
                status: null,
                alasan: (src.question && dst.question ? `"${src.question}" berkaitan dengan "${dst.question}".` : "")
              };

          if (state.rtype && metaS5.jenis !== state.rtype) continue;

          matched.push({
            id: l.id,
            sasaran: "Sasaran 5",
            sourceSasaran: 5,
            targetSasaran: 5,
            sourceSasaranName: srcSasaranName,
            destSasaranName: dstSasaranName,
            sourceInst: src.inst,
            sourceInstName: srcInstName,
            source: src.group,
            sourceName: srcIndikator,
            sourceAspek: srcAspek,
            sourceIndikator: srcIndikator,
            sourceSubindikator: srcSubindikator,
            destInst: dst.inst,
            destInstName: dstInstName,
            dest: dst.group,
            destName: dstIndikator,
            destAspek: dstAspek,
            destIndikator: dstIndikator,
            destSubindikator: dstSubindikator,
            type: metaS5.jenis,
            level: "Tervalidasi Substantif",
            tingkat: l.level.join(", "),
            codes: [[src.code, dst.code]],
            sourceCode: src.code,
            destCode: dst.code,
            sourceQuestion: src.question,
            destQuestion: dst.question,
            reason: metaS5.alasan || (src.question && dst.question ? `"${src.question}" berkaitan dengan "${dst.question}".` : (src.question ? `"${src.question}"` : (dst.question ? `"${dst.question}"` : `Keterkaitan substantif antara ${src.group} dan ${dst.group}.`))),
            refs: l.cells || []
          });
        }
      }
      return matched;
    }

    if (sId === 3) {
      // Sasaran 3: 72 relasi internal resmi sesuai sheet Copy of Sasaran 3 dari Bahan paparan Kamis (30092026) (1).xlsx
      const s3Rels = relasiInternal.sasaran3?.relasi || [];
      // Pilihan "Semua Indeks" memakai orientasi tunggal agar satu pasangan
      // tidak terhitung dua kali. Jika indeks pembanding ditetapkan, gunakan
      // arah sebaliknya supaya pilihan tersebut tetap bermakna.
      const currentSrc = state.source === "ALL"
        ? (state.dest === "DIIIP" ? "IIIP" : "DIIIP")
        : (state.source || "IIIP");

      for (const r of s3Rels) {
        let srcCode = r.asal_kode;
        let dstCode = r.tujuan_kode;
        let srcInst = r.asal_instrumen;
        let dstInst = r.tujuan_instrumen;
        let srcName = r.asal_nama;
        let dstName = r.tujuan_nama;
        let srcAspek = r.asal_aspek || r.asal_domain || "";
        let dstAspek = r.tujuan_aspek || r.tujuan_domain || "";

        // Orientasi berdasarkan indeks sumber yang sedang dipilih
        if (srcInst !== currentSrc && dstInst === currentSrc) {
          srcCode = r.tujuan_kode;
          dstCode = r.asal_kode;
          srcInst = r.tujuan_instrumen;
          dstInst = r.asal_instrumen;
          srcName = r.tujuan_nama;
          dstName = r.asal_nama;
          srcAspek = r.tujuan_aspek || r.tujuan_domain || "";
          dstAspek = r.asal_aspek || r.asal_domain || "";
        } else if (srcInst !== currentSrc) {
          continue;
        }

        if (state.dest && dstInst !== state.dest) continue;
        if (state.rtype && r.jenis !== state.rtype) continue;

        const subSrc = getSubstansi(srcCode);
        const subDst = getSubstansi(dstCode);

        // Pada instrumen survei IIIP, "indikator" pada katalog adalah nama BLOK,
        // sedangkan butir yang dipetakan ialah PERTANYAAN (subindikator).
        // Pertahankan judul indikator desain DIIIP pada sisi desain.
        const srcIndikator = srcInst === "IIIP"
          ? ((subSrc && subSrc.subindikator) || srcName)
          : ((subSrc && subSrc.indikator) || srcName);
        const dstIndikator = dstInst === "IIIP"
          ? ((subDst && subDst.subindikator) || dstName)
          : ((subDst && subDst.indikator) || dstName);

        matched.push({
          id: r.id,
          sasaran: "Sasaran 3",
          sourceSasaran: 3,
          targetSasaran: 3,
          sourceSasaranName: "Sasaran 3 — Perilaku Birokrasi & Integritas",
          destSasaranName: "Sasaran 3 — Perilaku Birokrasi & Integritas",
          sourceInst: srcInst,
          sourceInstName: instName(srcInst),
          source: srcCode,
          sourceName: srcIndikator,
          sourceAspek: srcAspek,
          sourceIndikator: srcIndikator,
          sourceSubindikator: "",
          destInst: dstInst,
          destInstName: instName(dstInst),
          dest: dstCode,
          destName: dstIndikator,
          destAspek: dstAspek,
          destIndikator: dstIndikator,
          destSubindikator: "",
          type: r.jenis || "Mendukung",
          level: "Tervalidasi Substantif",
          tingkat: r.tingkat || "KUAT",
          codes: [[srcCode, dstCode]],
          sourceCode: srcCode,
          destCode: dstCode,
          sourceQuestion: srcName,
          destQuestion: dstName,
          reason: r.alasan || `Indikator "${srcName}" berkaitan dengan "${dstName}".`,
          refs: [r.sumber || "Bahan paparan Kamis (30092026) (1).xlsx, Copy of Sasaran 3"]
        });
      }
      return matched;
    }

    return matched;
  }

  function filteredRelations() {
    const q = state.search.toLowerCase().trim();
    return listRawRelations().filter(x => {
      if (state.component) {
        const allS3 = state.activeMenu === "internal" &&
          Number(state.internalSasaranId) === 3 && state.source === "ALL";
        if (x.source !== state.component && (!allS3 || x.dest !== state.component)) return false;
      }
      if (state.dest && x.destInst !== state.dest) return false;
      if (!q) return true;
      return [
        x.sourceName,
        x.destName,
        x.destInst,
        x.sourceCode,
        x.destCode,
        x.reason,
        x.level,
        x.type,
        x.sourceQuestion,
        x.destQuestion,
        x.sourceAspek,
        x.destAspek,
        x.sourceIndikator,
        x.destIndikator,
        x.sourceSubindikator,
        x.destSubindikator
      ].some(y => String(y || "").toLowerCase().includes(q));
    });
  }

  // Pengelompokan Pasangan Komponen Substantif / Kelompok Teknis (Canonical Grouping)
  function groupRelations(rows) {
    const byPair = new Map();
    for (const r of rows) {
      const key = `${r.source}\u241f${r.destInst}\u241f${r.dest}`;
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
  }

  // 7. Sinkronisasi Dropdown & Filter Controls
  function populateFilters() {
    const sources = listSources();
    if (state.source && !sources.includes(state.source)) {
      state.source = sources[0] || "";
    } else if (!state.source && state.activeMenu !== "external") {
      state.source = sources[0] || "";
    }

    fillSelect(
      dom.selectSource,
      sources.map(i => ({
        value: i,
        label: i === "ALL" ? "Semua Indeks Sumber"
          : `${i} — ${instName(i)}`
      })),
      state.source,
      state.activeMenu === "external" ? "Semua Instrumen Sumber" : null
    );

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

    const dests = listDestinations();
    fillSelect(
      dom.selectDestination,
      dests.map(i => ({ value: i, label: `${i} — ${instName(i)}` })),
      state.dest,
      state.activeMenu === "external" ? "Semua Instrumen Tujuan" : "Semua Indeks Pembanding"
    );

    const standardTypes = [
      "Mendukung",
      "Saling Melengkapi",
      "Beririsan Substansi",
      "Potensi Tumpang Tindih",
      "Keselarasan Perencanaan"
    ];
    fillSelect(
      dom.selectRelationType,
      standardTypes.map(t => ({ value: t, label: t })),
      state.rtype,
      "Semua Jenis Keterkaitan"
    );

    if (dom.selectInternalSasaran) {
      dom.selectInternalSasaran.value = state.internalSasaranId;
    }
    if (dom.selectExtSourceSasaran) {
      dom.selectExtSourceSasaran.value = "1";
    }
    if (dom.selectExtDestSasaran) {
      dom.selectExtDestSasaran.value = (state.extDstSasaran !== undefined && state.extDstSasaran !== null) ? String(state.extDstSasaran) : "ALL";
    }
    if (dom.labelSourceSelect) {
      dom.labelSourceSelect.textContent = state.activeMenu === "external" ? "Instrumen Sumber:" : "Indeks Sumber:";
    }
    if (dom.labelDestinationSelect) {
      dom.labelDestinationSelect.textContent = state.activeMenu === "external" ? "Instrumen Tujuan:" : "Indeks Pembanding:";
    }
    if (dom.labelComponentSelect) {
      dom.labelComponentSelect.textContent = state.activeMenu === "internal" && Number(state.internalSasaranId) === 3
        ? (state.source === "ALL" ? "Indikator / Pertanyaan:" : state.source === "IIIP" ? "Pertanyaan Survei:" : "Indikator Desain:")
        : "Indikator:";
    }
    if (dom.inputSearchFree) {
      dom.inputSearchFree.value = state.search;
    }

    // Perbarui Hint Penjelasan Logika Agregasi
    updateLogicNote();
  }

  function updateLogicNote() {
    if (!dom.logicNote) return;

    if (state.activeMenu === "external") {
      dom.logicNote.innerHTML = `<strong>Relasi Eksternal Antar-Sasaran:</strong> Memetakan hubungan keterkaitan indikator dari <b>Sasaran 1 (Pemerintah Digital) menuju Sasaran 2, 3, 4, dan 5</b>. Pasangan indikator yang telah ditelaah diklasifikasikan ke dalam lima jenis keterkaitan standar. Klik angka pada sel matriks untuk membuka Peta Relasi.`;
      return;
    }

    const sId = Number(state.internalSasaranId);
    if (sId === 5) {
      const totalPairs = revisiData?.metadata?.count_group_pairs || 128;
      dom.logicNote.innerHTML = `<strong>Cara membaca matriks Sasaran 5:</strong> Satu angka pada sel menunjukkan banyaknya <b>indikator tujuan yang berbeda</b> yang mempunyai setidaknya satu rujukan kode resmi. Kode skala penilaian (1–5) dihitung sebagai satu indikator tujuan dan tidak dijumlahkan berulang. Terdapat <b>${totalPairs} pasangan indikator unik</b> pada keseluruhan Sasaran 5 (<strong>49 pasangan</strong> saat indeks sumber IPP).`;
    } else if (sId === 4) {
      dom.logicNote.innerHTML = `<strong>Cara membaca matriks Sasaran 4:</strong> Angka menunjukkan banyaknya relasi indikator sesuai <b>50 hubungan keterkaitan resmi Sasaran 4</b> antara Kapabilitas Kelembagaan dan 7 indeks pembanding.`;
    } else if (sId === 3) {
      dom.logicNote.innerHTML = `<strong>Status Data Sasaran 3:</strong> Menggunakan sheet <b>Copy of Sasaran 3</b> dari file <code>Bahan paparan Kamis (30092026) (1).xlsx</code> dengan 2 indeks aktif: <b>Instrumen Pengumpulan Data IIIP</b> (92 pertanyaan) dan <b>Desain IIIP</b> (34 indikator), memetakan <b>72 relasi internal aktual</b> (72 pasangan unik).`;
    }
  }

  // 8. TAHAP 1: RENDER MATRIKS RELASI
  function renderStageMatrix() {
    dom.stageMatrix.classList.remove("hidden");
    dom.stageGraph.classList.add("hidden");
    dom.stageList.classList.add("hidden");

    if (state.activeMenu === "external") {
      renderExternalMatrix();
    } else {
      renderInternalMatrix();
    }
    updateContextBanner();
  }

  function renderInternalMatrix() {
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

    dom.matrixTitle.textContent = sId === 4
      ? "Matriks Relasi Internal Sasaran 4 — Kapabilitas Kelembagaan"
      : "Matriks Relasi Internal Sasaran 5 — Pelayanan Publik";

    dom.matrixDesc.textContent = sId === 4
      ? "Memetakan 50 hubungan keterkaitan resmi antara Kapabilitas Kelembagaan dengan 7 indeks pengukuran kinerja & perencanaan. Klik angka > 0 untuk membuka Peta Relasi."
      : `Sumber: ${state.source} — ${instName(state.source)}. Sel menghitung jumlah indikator tujuan unik yang berelasi, bukan kombinasi kode skala penilaian.`;

    dom.pairCount.textContent = pairs.length.toLocaleString("id-ID");
    dom.pairUnit.textContent = sId === 4 ? "hubungan keterkaitan" : "pasangan indikator";

    // Header Kolom Matriks
    const headerColsHtml = dests.map(code => `
      <th title="${esc(instName(code))}">
        <div style="font-weight: 700; color: var(--navy-dark); font-size: 12px;">${esc(code)}</div>
        <div style="font-weight: normal; font-size: 9.5px; color: var(--ink-muted); margin-top: 2px; line-height: 1.2;">
          ${esc(instName(code))}
        </div>
      </th>
    `).join("");

    // Baris Matriks Indikator Sumber
    const rowsHtml = comps.map(comp => {
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
            <div>${esc(comp.name)}</div>
            <div class="row-inst-meta">${esc(comp.inst)} · Sasaran ${sId}</div>
          </td>
          ${cellsHtml}
          <td style="font-weight: 700; color: var(--navy-dark); background: #f8fafc;">${rowTotal}</td>
        </tr>
      `;
    }).join("");

    // Baris Total Kolom
    const totalColsHtml = dests.map(dstCode => {
      const colTotal = pairs.filter(p => p.destInst === dstCode).length;
      return `<td style="font-weight:700; background:#f8fafc; color:var(--navy-dark);">${colTotal}</td>`;
    }).join("");

    dom.matrixTableContainer.innerHTML = `
      <table class="matrix-table">
        <thead>
          <tr>
            <th class="col-corner">Indikator Sumber (Baris) \\ Indeks Pembanding (Kolom)</th>
            ${headerColsHtml}
            <th style="background:#f1f5f9; color:var(--navy-dark); width: 45px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="background:#f1f5f9; font-weight:700;">
            <td class="row-header" style="background:#e2e8f0; color:var(--navy-dark);">
              <div>TOTAL INDIKATOR TUJUAN</div>
              <div class="row-inst-meta">Total Agregasi Unik</div>
            </td>
            ${totalColsHtml}
            <td style="font-weight:800; background:#dbeafe; color:#1e40af; font-size:15px;">${pairs.length}</td>
          </tr>
        </tbody>
      </table>
    `;

    // Pasang Event Handler Klik Sel Matriks
    dom.matrixTableContainer.querySelectorAll("[data-mapsrc]").forEach(btn => {
      btn.onclick = () => {
        state.chosenSrc = btn.dataset.mapsrc;
        state.chosenInst = btn.dataset.mapinst;
        state.chosenDest = "";
        state.focusRelation = null;
        setStage("graph");
      };
    });

    dom.topbarSummaryText.textContent = sId === 4
      ? `Sasaran 4: ${pairs.length} Hubungan Keterkaitan Aktif`
      : `Sasaran 5: ${pairs.length} Pasangan Indikator (${state.source})`;
  }

  function renderSasaran3Matrix() {
    dom.matrixTitle.textContent = "Matriks Relasi Internal Sasaran 3 — Indeks Inovasi Instansi Pemerintah (IIIP)";
    dom.matrixDesc.textContent = "Format 2×2 menyandingkan Instrumen Pengumpulan Data IIIP dan Desain IIIP berdasarkan sheet Copy of Sasaran 3 dari file Bahan paparan Kamis (30092026) (1).xlsx. Klik angka > 0 untuk membuka Peta Relasi.";

    // Selalu hitung sesuai indikator/pertanyaan, jenis, indeks, dan kata kunci yang
    // dipilih pengguna. 72 merupakan total database, bukan angka konstan matriks.
    const s3Rels = filteredRelations();
    const s3AllCount = relasiInternal.sasaran3?.relasi?.length || 0;
    const s3UniqueCount = new Set(s3Rels.map(r => r.id)).size;
    dom.pairCount.textContent = s3UniqueCount.toLocaleString("id-ID");
    dom.pairUnit.textContent = state.component || state.search || state.rtype || state.dest
      ? "relasi sesuai filter" : "pasangan relasi unik";
    dom.matrixDesc.textContent = s3UniqueCount === s3AllCount
      ? "Format 2×2 menyandingkan Instrumen Pengumpulan Data IIIP dan Desain IIIP berdasarkan sheet Copy of Sasaran 3. Klik angka > 0 untuk membuka Peta Relasi."
      : `Menampilkan ${s3UniqueCount} dari ${s3AllCount} pasangan relasi sesuai filter. Angka matriks ikut berubah saat indikator atau pertanyaan dipilih.`;

    const insts = [
      {
        code: "IIIP",
        name: "Instrumen Pengumpulan Data Survei Indeks Inovasi Instansi Pemerintah (IIIP)",
        shortName: "Instrumen Pengumpulan Data IIIP",
        pembina: "LAN RI",
        itemCount: 92
      },
      {
        code: "DIIIP",
        name: "Desain Indeks Inovasi Instansi Pemerintah (IIIP)",
        shortName: "Desain IIIP",
        pembina: "LAN RI",
        itemCount: 34
      }
    ];

    const relCount = s3UniqueCount; // dihitung dinamis dari filter aktif
    const filteredDesignCode = state.component &&
      (state.source === "DIIIP" || (state.source === "ALL" && state.component.startsWith("SS3-DIIIP"))) ? state.component : "";
    const filteredSurveyCode = state.component &&
      (state.source === "IIIP" || (state.source === "ALL" && state.component.startsWith("SS3-IIIP"))) ? state.component : "";

    const headerColsHtml = insts.map(inst => `
      <th title="${esc(inst.name)}">
        <div style="font-weight: 700; color: var(--navy-dark); font-size: 12px;">${inst.code}</div>
        <div style="font-weight: normal; font-size: 9.5px; color: var(--ink-muted); margin-top:2px; line-height: 1.2;">
          ${esc(inst.shortName)}
        </div>
      </th>
    `).join("");

    const rowsHtml = insts.map(srcInst => {
      const cells = insts.map(dstInst => {
        if (srcInst.code === dstInst.code) {
          return `<td class="matrix-cell-diag" title="Diagonal: Indeks yang sama">—</td>`;
        }
        if (relCount === 0) return `<td><span class="matrix-cell-zero">0</span></td>`;
        return `
          <td class="matrix-cell-active">
            <div class="matrix-cell-btn" data-s3-src="${srcInst.code}" data-s3-dst="${dstInst.code}" role="button" tabindex="0" title="Buka Peta Relasi ${srcInst.code} → ${dstInst.code} (${relCount} relasi tersaring)">
              <span class="cell-num">${relCount}</span>
            </div>
          </td>
        `;
      }).join("");

      return `
        <tr>
          <td class="row-header">
            <div style="font-weight:700; color:var(--navy-dark); font-size:12px;">${srcInst.code} — ${esc(srcInst.shortName)}</div>
            <div class="row-inst-meta" style="font-size:10px; color:var(--ink-muted);">${esc(srcInst.pembina)} · ${srcInst.itemCount} Indikator/Pertanyaan</div>
          </td>
          ${cells}
          <td style="font-weight:700; color:var(--navy-dark); background:#f8fafc; font-size:13px;">${relCount}</td>
        </tr>
      `;
    }).join("");

    const totalColsHtml = insts.map(() => `
      <td style="font-weight:700; background:#f8fafc; color:var(--navy-dark); font-size:13px;">${relCount}</td>
    `).join("");

    dom.matrixTableContainer.innerHTML = `
      <table class="matrix-table">
        <thead>
          <tr>
            <th class="col-corner">Indeks Sumber (Baris) \\ Indeks Pembanding (Kolom)</th>
            ${headerColsHtml}
            <th style="background:#f1f5f9; color:var(--navy-dark); width: 45px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="background:#f1f5f9; font-weight:700;">
            <td class="row-header" style="background:#e2e8f0; color:var(--navy-dark);">
              <div>TOTAL INDIKATOR TUJUAN</div>
              <div class="row-inst-meta">Total Agregasi Pasangan Unik</div>
            </td>
            ${totalColsHtml}
            <td style="font-weight:800; background:#dbeafe; color:#1e40af; font-size:15px;">${relCount}</td>
          </tr>
        </tbody>
      </table>
    `;

    // Pasang Event Klik Sel Matriks S3
    dom.matrixTableContainer.querySelectorAll("[data-s3-src]").forEach(btn => {
      btn.onclick = () => {
        // Pertahankan konteks filter, termasuk saat pengguna mengeklik sisi
        // matriks berlawanan. Peta Ringkas selalu berorientasi Desain → Survei.
        if (filteredDesignCode) {
          state.s3SelectedIndicator = filteredDesignCode;
          state.s3SelectedSurveyQuestion = "";
        } else if (filteredSurveyCode) {
          state.s3SelectedSurveyQuestion = filteredSurveyCode;
          const relatedDesign = s3Rels.find(r => r.sourceInst === "DIIIP");
          if (relatedDesign) state.s3SelectedIndicator = relatedDesign.source;
        } else {
          state.s3SelectedSurveyQuestion = "";
        }
        // Pertahankan pilihan "Semua Indeks Sumber" ketika masuk Peta.
        // Diagram ringkas tetap menggunakan orientasi Desain → Survei.
        if (state.source !== "ALL") state.source = "DIIIP";
        state.component = filteredDesignCode || "";
        state.dest = "IIIP";
        state.chosenSrc = filteredDesignCode || "";
        state.chosenInst = "IIIP";
        state.chosenDest = "";
        state.focusRelation = null;
        populateFilters();
        setStage("graph");
      };
    });

    dom.topbarSummaryText.textContent = `Sasaran 3: ${relCount} dari ${s3AllCount} Relasi Internal (Copy of Sasaran 3)`;
  }

  // Render Matriks Relasi Eksternal
  function renderExternalMatrix() {
    if (dom.sasaran3NoticeBox) dom.sasaran3NoticeBox.classList.add("hidden");
    if (dom.externalAuditNoticeBox) dom.externalAuditNoticeBox.classList.add("hidden");

    dom.matrixTitle.textContent = "Matriks Relasi Eksternal";
    dom.matrixDesc.textContent = "Pilih pasangan yang memiliki relasi untuk melihat peta dan rincian indikator.";

    const sasarans = [1, 2, 3, 4, 5].map(id => {
      const meta = getSasaranInfo(id);
      const raw = (sasaranData.sasaran || []).find(x => x.id === id) || {};
      return {
        id,
        kode: meta.kode,
        nama: raw.nama || `${meta.kode}: ${meta.nama_singkat}`,
        nama_singkat: meta.nama_singkat,
        pembina: meta.pembina
      };
    });

    // Pasangan kelompok komponen dan relasi dihitung secara dinamis dari filter aktif
    const allFiltered = filteredRelations();
    const pairs = groupRelations(allFiltered);
    const groupCounts = {};
    const itemCounts = {};
    for (const p of pairs) {
      const key = `${p.sourceSasaran}_${p.destSasaran}`;
      groupCounts[key] = (groupCounts[key] || 0) + 1;
      itemCounts[key] = (itemCounts[key] || 0) + (p.items ? p.items.length : 1);
    }

    // Sasaran Asal (Baris): Sasaran 1 (Transformasi Digital)
    const activeSrcSasarans = sasarans.filter(s => s.id === 1);

    // Sasaran Tujuan (Kolom): Sasaran 2, 3, 4, 5
    let activeDstSasarans = sasarans.filter(s => s.id !== 1);
    if (state.extDstSasaran && state.extDstSasaran !== "ALL") {
      activeDstSasarans = sasarans.filter(s => s.id === Number(state.extDstSasaran));
    }

    const headerColsHtml = activeDstSasarans.map(s => `
      <th title="${esc(s.nama)}">
        <div style="font-weight: 700; color: var(--navy-dark); font-size: 12px;">${esc(s.kode)}</div>
        <div style="font-weight: normal; font-size: 9.5px; color: var(--ink-muted); margin-top: 2px; line-height: 1.2;">
          ${esc(s.nama_singkat)}
        </div>
      </th>
    `).join("");

    const rowsHtml = activeSrcSasarans.map(src => {
      let rowSumItems = 0;
      let rowSumGroups = 0;
      const cells = activeDstSasarans.map(dst => {
        if (src.id === dst.id) {
          return `<td class="matrix-cell-diag" title="Diagonal: Relasi internal sasaran diakses melalui menu Relasi Internal">-</td>`;
        }

        const key = `${src.id}_${dst.id}`;
        const cntGroups = groupCounts[key] || 0;
        const cntItems = itemCounts[key] || 0;
        rowSumItems += cntItems;
        rowSumGroups += cntGroups;

        if (cntItems > 0) {
          return `
            <td class="matrix-cell-active">
              <div class="matrix-cell-btn" data-matrix-ext-src="${src.id}" data-matrix-ext-dst="${dst.id}" role="button" tabindex="0" title="Buka Peta Relasi ${src.kode} ke ${dst.kode}: ${cntItems} relasi rujukan indikator">
                <span class="cell-num">${cntItems.toLocaleString("id-ID")}</span>
              </div>
            </td>
          `;
        }
        return `<td title="Tidak ada rujukan eksternal tercatat dari ${src.kode} ke ${dst.kode}"><span class="matrix-cell-zero">0</span></td>`;
      }).join("");

      return `
        <tr>
          <td class="row-header">
            <div style="font-weight: 700; color: var(--navy-dark); font-size: 12px;">${esc(src.kode)} — ${esc(src.nama_singkat)}</div>
            <div class="row-inst-meta" style="font-size: 10px; color: var(--ink-muted);">${esc(src.pembina)}</div>
          </td>
          ${cells}
          <td style="font-weight: 700; color: var(--navy-dark); background: #f8fafc; font-size: 13px;">
            <div>${rowSumItems.toLocaleString("id-ID")}</div>
          </td>
        </tr>
      `;
    }).join("");

    const totalColsHtml = activeDstSasarans.map(dst => {
      const colSumItems = activeSrcSasarans.reduce((sum, src) => sum + (itemCounts[`${src.id}_${dst.id}`] || 0), 0);
      if (colSumItems > 0) {
        return `
          <td style="font-weight:700; background:#f8fafc; color:var(--navy-dark); font-size:13px;">
            <div>${colSumItems.toLocaleString("id-ID")}</div>
          </td>
        `;
      }
      return `<td style="font-weight:700; background:#f8fafc; color:var(--ink-muted);">0</td>`;
    }).join("");

    const totalAllItems = pairs.reduce((sum, p) => sum + (p.items ? p.items.length : 1), 0);

    dom.matrixTableContainer.innerHTML = `
      <table class="matrix-table">
        <thead>
          <tr>
            <th class="col-corner">Sasaran Asal (Baris) \\ Sasaran Tujuan (Kolom)</th>
            ${headerColsHtml}
            <th style="background:#f1f5f9; color:var(--navy-dark); width: 45px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="background:#f1f5f9; font-weight:700;">
            <td class="row-header" style="background:#e2e8f0; color:var(--navy-dark);">
              <div>TOTAL INDIKATOR TUJUAN</div>
              <div class="row-inst-meta">Total Agregasi Unik</div>
            </td>
            ${totalColsHtml}
            <td style="font-weight:800; background:#dbeafe; color:#1e40af; font-size:15px;">
              <div>${totalAllItems.toLocaleString("id-ID")}</div>
            </td>
          </tr>
        </tbody>
      </table>
    `;

    dom.pairCount.textContent = totalAllItems.toLocaleString("id-ID");
    dom.pairUnit.textContent = "relasi indikator";
    if (dom.topbarSummaryText) {
      dom.topbarSummaryText.textContent = `Eksternal: ${totalAllItems.toLocaleString("id-ID")} Relasi Indikator`;
    }

    if (dom.matrixFineprint) {
      dom.matrixFineprint.innerHTML = `
        <span class="fineprint-text">
          ℹ <strong>Keterangan Matriks Eksternal:</strong> Seluruh rujukan relasi eksternal berorientasi dari <strong>Sasaran 1 (Pemerintah Digital)</strong> menuju sasaran tujuan (Sasaran 2 s.d. 5). Baris menunjukkan Sasaran Asal (Sasaran 1) dan Kolom menunjukkan Sasaran Tujuan (Sasaran 2: 17, Sasaran 3: 120, Sasaran 4: 76, Sasaran 5: 1.418). Total 1.631 relasi rujukan aktif. Klik sel berwarna biru untuk membuka Peta Relasi.
        </span>
      `;
    }

    // Pasang Event Handler Klik Sel Matriks Eksternal
    dom.matrixTableContainer.querySelectorAll("[data-matrix-ext-src]").forEach(btn => {
      btn.onclick = () => {
        const srcId = btn.dataset.matrixExtSrc;
        const dstId = btn.dataset.matrixExtDst;
        state.extDirection = `${srcId}_${dstId}`;
        state.extSrcSasaran = Number(srcId);
        state.extDstSasaran = Number(dstId);
        if (dom.selectExtSourceSasaran) {
          dom.selectExtSourceSasaran.value = "1";
        }
        if (dom.selectExtDestSasaran) {
          dom.selectExtDestSasaran.value = String(dstId);
        }
        state.source = "PEMDI";
        state.component = "";
        state.dest = "";
        state.chosenInst = "";
        state.chosenSrc = "";
        state.chosenDest = "";
        state.focusRelation = null;
        populateFilters();
        setStage("graph");
      };
    });
  }

  // 9. TAHAP 2: RENDER PETA RELASI (HANYA KARTU DENGAN HUBUNGAN TERCATAT)
  let currentActivePairs = [];

  function highlightSourceCard(srcId) {
    if (!srcId) return;
    const srcEl = document.getElementById(`card_src_${srcId}`);
    if (srcEl) srcEl.classList.add("card-source-highlighted");

    const curves = dom.svgPathGroup ? dom.svgPathGroup.querySelectorAll(".relation-curve") : [];
    const connectedDestIds = new Set();
    curves.forEach(curve => {
      if (curve.dataset.src === srcId) {
        curve.classList.add("highlighted");
        curve.classList.remove("dimmed");
        curve.setAttribute("stroke", "#0284c7");
        curve.setAttribute("stroke-opacity", "1");
        curve.setAttribute("stroke-width", "3.5");
        curve.setAttribute("marker-end", "url(#arrowActive)");
        if (curve.dataset.dst) connectedDestIds.add(curve.dataset.dst);
      } else {
        const isS3HoverOnly = state.activeMenu === "internal" && Number(state.internalSasaranId) === 3;
        // Jangan beri kelas dimmed (CSS abu-abu) pada Sasaran 3.
        curve.classList.toggle("dimmed", !isS3HoverOnly);
        curve.classList.remove("highlighted");
        curve.setAttribute("stroke-opacity", isS3HoverOnly ? "0" : "0.06");
        curve.setAttribute("stroke-width", "1");
        curve.setAttribute("marker-end", "none");
      }
    });

    connectedDestIds.forEach(dstId => {
      const dstEl = document.getElementById(`card_dst_${dstId}`);
      if (dstEl) dstEl.classList.add("card-dest-highlighted");
    });
  }

  function highlightDestCard(dstId) {
    if (!dstId) return;
    const dstEl = document.getElementById(`card_dst_${dstId}`);
    if (dstEl) dstEl.classList.add("card-dest-highlighted");

    const curves = dom.svgPathGroup ? dom.svgPathGroup.querySelectorAll(".relation-curve") : [];
    const connectedSrcIds = new Set();
    curves.forEach(curve => {
      if (curve.dataset.dst === dstId) {
        curve.classList.add("highlighted");
        curve.classList.remove("dimmed");
        curve.setAttribute("stroke", "#0284c7");
        curve.setAttribute("stroke-opacity", "1");
        curve.setAttribute("stroke-width", "3.5");
        curve.setAttribute("marker-end", "url(#arrowActive)");
        if (curve.dataset.src) connectedSrcIds.add(curve.dataset.src);
      } else {
        const isS3HoverOnly = state.activeMenu === "internal" && Number(state.internalSasaranId) === 3;
        curve.classList.toggle("dimmed", !isS3HoverOnly);
        curve.classList.remove("highlighted");
        curve.setAttribute("stroke-opacity", isS3HoverOnly ? "0" : "0.06");
        curve.setAttribute("stroke-width", "1");
        curve.setAttribute("marker-end", "none");
      }
    });

    connectedSrcIds.forEach(srcId => {
      const srcEl = document.getElementById(`card_src_${srcId}`);
      if (srcEl) srcEl.classList.add("card-source-highlighted");
    });
  }

  function unhighlightAll() {
    if (dom.containerSourceCards) {
      dom.containerSourceCards.querySelectorAll(".card-source-highlighted").forEach(el => {
        el.classList.remove("card-source-highlighted");
      });
    }
    if (dom.containerDestCards) {
      dom.containerDestCards.querySelectorAll(".card-dest-highlighted").forEach(el => {
        el.classList.remove("card-dest-highlighted");
      });
    }
    drawCurves(currentActivePairs);
  }

  let currentExternalInstList = [];

  function highlightMacroRelation(code) {
    if (!code) return;
    const paths = dom.svgPathGroup ? dom.svgPathGroup.querySelectorAll(".relation-curve") : [];
    paths.forEach(p => {
      if (p.dataset.dstInst === code) {
        p.setAttribute("stroke", "#0d9488");
        p.setAttribute("stroke-width", "3.6");
        p.setAttribute("stroke-opacity", "1");
        p.setAttribute("marker-end", "url(#arrowMacroExternalHover)");
        if (dom.svgPathGroup) dom.svgPathGroup.appendChild(p);
      } else {
        p.setAttribute("stroke", "#0f766e");
        p.setAttribute("stroke-width", "1.4");
        p.setAttribute("stroke-opacity", "0.2");
        p.setAttribute("marker-end", "none");
      }
    });

    const srcCard = document.getElementById("card_src_PEMDI");
    if (srcCard) srcCard.classList.add("card-source-highlighted");

    const dstCard = document.getElementById(`card_dst_${code}`);
    if (dstCard) dstCard.classList.add("card-dest-highlighted");
  }

  function unhighlightMacroRelation() {
    const paths = dom.svgPathGroup ? dom.svgPathGroup.querySelectorAll(".relation-curve") : [];
    paths.forEach(p => {
      const code = p.dataset.dstInst;
      const instObj = (currentExternalInstList || []).find(i => i.code === code);
      const w = instObj ? Math.min(3.2, Math.max(2.0, 1.8 + Math.log2(instObj.relCount + 1) * 0.12)) : 2.4;
      p.setAttribute("stroke", "#0f766e");
      p.setAttribute("stroke-width", String(w));
      p.setAttribute("stroke-opacity", "0.8");
      p.setAttribute("marker-end", "url(#arrowMacroExternal)");
    });

    const srcCard = document.getElementById("card_src_PEMDI");
    if (srcCard) srcCard.classList.remove("card-source-highlighted");

    if (dom.containerDestCards) {
      dom.containerDestCards.querySelectorAll(".card-dest-highlighted").forEach(el => {
        el.classList.remove("card-dest-highlighted");
      });
    }
  }

  function drawExternalMacroCurves(instList) {
    currentExternalInstList = instList || [];
    const svgGroup = dom.svgPathGroup;
    if (!svgGroup || !dom.diagramSvg || typeof dom.diagramSvg.getBoundingClientRect !== "function") return;

    svgGroup.innerHTML = "";
    const svgRect = dom.diagramSvg.getBoundingClientRect();
    if (!svgRect || svgRect.width === 0 || svgRect.height === 0) return;

    // Pin Sumber: PEMDI di Kiri
    const pinSrc = document.getElementById("pin_src_PEMDI");
    if (!pinSrc || typeof pinSrc.getBoundingClientRect !== "function") return;
    const rectSrc = pinSrc.getBoundingClientRect();

    const x1 = rectSrc.left + rectSrc.width / 2 - svgRect.left;
    const y1 = rectSrc.top + rectSrc.height / 2 - svgRect.top;

    const pathsHtml = [];

    (instList || []).forEach((inst) => {
      // Pin Tujuan: inst di Kanan
      const pinDst = document.getElementById(`pin_dst_${inst.code}`);
      if (!pinDst || typeof pinDst.getBoundingClientRect !== "function") return;
      const rectDst = pinDst.getBoundingClientRect();

      const x2 = rectDst.left + rectDst.width / 2 - svgRect.left;
      const y2 = rectDst.top + rectDst.height / 2 - svgRect.top;

      const dx = Math.max(60, Math.abs(x2 - x1) * 0.45);
      const arrowTipX = x2 - 2;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${arrowTipX} ${y2}`;
      const width = Math.min(3.2, Math.max(2.0, 1.8 + Math.log2(inst.relCount + 1) * 0.12));

      pathsHtml.push(`
        <path d="${d}"
              class="relation-curve"
              id="curve_macro_${esc(inst.code)}"
              data-dst-inst="${esc(inst.code)}"
              stroke="#0f766e"
              stroke-width="${width}"
              fill="none"
              stroke-opacity="0.85"
              style="cursor:pointer;"
              title="PEMDI → ${esc(inst.name)} (${inst.relCount} relasi). Klik untuk rincian di Tahap 3" />
        <polygon points="${arrowTipX},${y2} ${arrowTipX - 9},${y2 - 5} ${arrowTipX - 9},${y2 + 5}"
                 fill="#0f766e"
                 class="macro-arrow-head"
                 id="arrow_head_${esc(inst.code)}" />
      `);
    });

    svgGroup.innerHTML = pathsHtml.join("");

    // Event Klik & Hover Garis
    svgGroup.querySelectorAll("[data-dst-inst]").forEach(path => {
      const code = path.dataset.dstInst;
      path.onclick = () => {
        state.source = "PEMDI";
        state.component = "";
        state.dest = code;
        state.rtype = "";
        state.chosenSrc = "";
        state.chosenDest = "";
        state.focusRelation = null;
        populateFilters();
        setStage("list");
      };
      path.onmouseenter = () => highlightMacroRelation(code);
      path.onmouseleave = () => unhighlightMacroRelation();
    });
  }

  function renderStageGraphExternal() {
    dom.stageMatrix.classList.add("hidden");
    dom.stageGraph.classList.remove("hidden");
    dom.stageList.classList.add("hidden");

    if (dom.graphToolbar) {
      dom.graphToolbar.style.display = "none";
    }

    const allRels = (extLatest && extLatest.relations) ? extLatest.relations : [];
    const rels = allRels.filter(r => {
      if (state.extDstSasaran && state.extDstSasaran !== "ALL") {
        if (r.source_sasaran !== Number(state.extDstSasaran)) return false;
      }
      return true;
    });

    const dstSasaranNum = state.extDstSasaran && state.extDstSasaran !== "ALL" ? Number(state.extDstSasaran) : (rels[0] ? rels[0].source_sasaran : 5);
    const dstMeta = getSasaranInfo(dstSasaranNum);
    const totalRelCount = rels.length;

    // Grouping relasi per instrumen tujuan (di kanan)
    const instMap = new Map();
    for (const r of rels) {
      const code = getInstrumentShortCode(r.source_group || r.source, r.source_instrument);
      if (!instMap.has(code)) {
        let fullName = instName(code);
        if (code === "OP") fullName = "Opini Pengawasan";
        if (code === "IPP") fullName = "Indeks Pelayanan Publik (IPP)";
        if (code === "IKK") fullName = "Indeks Kualitas Kebijakan (IKK)";
        if (code === "ZI") fullName = "Zona Integritas (ZI)";

        instMap.set(code, {
          code: code,
          name: fullName,
          sasaran: r.source_sasaran,
          sasaranName: `Sasaran ${r.source_sasaran}`,
          srcIndicators: new Set(),
          dstIndicators: new Set(),
          relCount: 0
        });
      }
      const item = instMap.get(code);
      item.relCount++;
      item.srcIndicators.add(r.target); // PEMDI indicator
      item.dstIndicators.add(r.source); // Destination indicator
    }

    const instList = Array.from(instMap.values());
    currentExternalInstList = instList;
    const allPemdiIndicators = new Set(rels.map(r => r.target));

    // Judul & deskripsi diagram
    if (state.extDstSasaran && state.extDstSasaran !== "ALL") {
      dom.graphTitle.textContent = `Peta Relasi Eksternal — Sasaran 1 (Transformasi Digital) → ${dstMeta.kode} (${dstMeta.nama_singkat})`;
      dom.colSourceTitle.textContent = `INSTRUMEN SUMBER`;
      dom.colSourceCount.textContent = `Sasaran 1: Transformasi Digital`;
      dom.colDestTitle.textContent = `INSTRUMEN TUJUAN`;
      dom.colDestCount.textContent = `Sasaran ${dstSasaranNum}: ${dstMeta.nama}`;
    } else {
      dom.graphTitle.textContent = `Peta Relasi Eksternal — Sasaran 1 (Transformasi Digital) → Seluruh Sasaran`;
      dom.colSourceTitle.textContent = `INSTRUMEN SUMBER`;
      dom.colSourceCount.textContent = `Sasaran 1: Transformasi Digital`;
      dom.colDestTitle.textContent = `INSTRUMEN TUJUAN`;
      dom.colDestCount.textContent = `Seluruh Instrumen Sasaran 2 s.d. 5`;
    }

    dom.graphDesc.textContent = `Menampilkan peta arsitektur instrumen/indeks. Klik kotak instrumen untuk langsung membuka penyandingan rincian di Tahap 3 (Daftar Relasi).`;
    dom.mapTotal.textContent = totalRelCount.toLocaleString("id-ID");
    dom.mapUnit.textContent = `relasi (${instList.length} instrumen tujuan)`;

    // Render Kartu Instrumen Sumber (Kolom Kiri: PEMDI)
    dom.containerSourceCards.innerHTML = `
      <div class="relation-node-card card-source"
           id="card_src_PEMDI"
           data-inst="PEMDI"
           style="cursor:pointer;"
           title="Klik untuk membuka seluruh rincian relasi di Tahap 3 (Daftar Relasi)">
        <span class="node-kicker">SUMBER · PEMDI</span>
        <span class="node-title">Pemerintah Digital (PEMDI)</span>
        <span class="node-code">Sasaran 1 · PEMDI</span>
        <span class="node-count">${allPemdiIndicators.size} indikator · ${totalRelCount} relasi</span>
        <div class="connection-pin" id="pin_src_PEMDI" style="right:-9px; background:#0f766e; border:2px solid #ffffff;"></div>
      </div>
    `;

    // Render Kartu Instrumen Tujuan (Kolom Kanan: Instrumen Sasaran 2-5)
    dom.containerDestCards.innerHTML = instList.map(inst => {
      return `
        <div class="relation-node-card card-dest"
             id="card_dst_${esc(inst.code)}"
             data-inst="${esc(inst.code)}"
             style="cursor:pointer;"
             title="Klik untuk membuka rincian penyandingan ${esc(inst.name)} di Tahap 3 (Daftar Relasi)">
          <div class="connection-pin" id="pin_dst_${esc(inst.code)}" style="left:-9px; background:#0284c7; border:2px solid #ffffff;"></div>
          <span class="node-kicker">TUJUAN · ${esc(inst.code)}</span>
          <span class="node-title">${esc(inst.name)}</span>
          <span class="node-code">Sasaran ${inst.sasaran} · ${esc(inst.code)}</span>
          <span class="node-count">${inst.dstIndicators.size} indikator · ${inst.relCount} relasi</span>
        </div>
      `;
    }).join("");

    // Event Klik Kartu Sumber -> Buka Seluruh Rincian di Tahap 3
    const srcCard = dom.containerSourceCards.querySelector("#card_src_PEMDI");
    if (srcCard) {
      srcCard.onclick = () => {
        state.source = "PEMDI";
        state.component = "";
        state.dest = "";
        state.rtype = "";
        state.chosenSrc = "";
        state.chosenDest = "";
        state.focusRelation = null;
        populateFilters();
        setStage("list");
      };
    }

    // Event Klik Kartu Tujuan -> Buka Tahap 3 untuk instrumen tersebut
    dom.containerDestCards.querySelectorAll("[data-inst]").forEach(card => {
      const code = card.dataset.inst;
      card.onclick = () => {
        state.source = "PEMDI";
        state.component = "";
        state.dest = code;
        state.rtype = "";
        state.chosenSrc = "";
        state.chosenDest = "";
        state.focusRelation = null;
        populateFilters();
        setStage("list");
      };
      card.onmouseenter = () => highlightMacroRelation(code);
      card.onmouseleave = () => unhighlightMacroRelation();
    });

    // Gambar kurva penghubung antar pin
    requestAnimationFrame(() => {
      drawExternalMacroCurves(instList);
    });

    updateContextBanner();
  }

  function renderStageGraph() {
    dom.stageMatrix.classList.add("hidden");
    dom.stageGraph.classList.remove("hidden");
    dom.stageList.classList.add("hidden");

    if (state.activeMenu === "external") {
      renderStageGraphExternal();
      return;
    }

    // Pada Sasaran 3, default peta yang dibaca atasan adalah SATU indikator desain
    // dan pertanyaan survei terkait, bukan 33 + 72 kartu sekaligus.
    const isS3 = state.activeMenu === "internal" && Number(state.internalSasaranId) === 3;
    if (isS3 && state.s3Compact) {
      if (state.source !== "DIIIP" && state.source !== "ALL") {
        // Pertanyaan survei terpilih dipertahankan sesudah orientasi dibalik.
        if (state.source === "IIIP" && state.component) state.s3SelectedSurveyQuestion = state.component;
        state.source = "DIIIP";
        state.component = "";
      } else if (state.source === "ALL" && state.component.startsWith("SS3-IIIP")) {
        state.s3SelectedSurveyQuestion = state.component;
        state.component = "";
      }
      state.dest = "IIIP";
      state.chosenInst = "IIIP";
      populateFilters();
    }
    const allFiltered = filteredRelations().filter(r =>
      !isS3 || !state.s3SelectedSurveyQuestion || r.dest === state.s3SelectedSurveyQuestion
    );
    let pairs = groupRelations(allFiltered);
    const s3DesignOptions = isS3 ? [...new Map((relasiInternal.sasaran3?.relasi || []).map(r => [
      r.tujuan_kode,
      { id: r.tujuan_kode, name: r.tujuan_nama }
    ])).values()].sort((a, b) => a.name.localeCompare(b.name, "id", { numeric: true })) : [];
    if (isS3 && state.s3Compact) {
      const available = new Set(pairs.map(p => p.source));
      if (!available.has(state.s3SelectedIndicator)) {
        const next = s3DesignOptions.find(x => available.has(x.id));
        state.s3SelectedIndicator = next ? next.id : "";
      }
      state.chosenSrc = state.s3SelectedIndicator;
    }

    // Toolbar Pengaturan Tampilan & Filter Indeks Tab (Khusus Relasi Internal)
    if (dom.graphToolbar) {
      dom.graphToolbar.style.display = "flex";
      const lineModeControls = dom.graphToolbar.querySelector(".graph-display-mode-group");
      // Khusus S3 garis hanya tampak saat hover; tombol 'Semua Garis'
      // disembunyikan agar tidak berlawanan dengan perilaku ini.
      if (lineModeControls) lineModeControls.style.display = isS3 ? "none" : "flex";
    }

    if (dom.btnGraphModeFocus && dom.btnGraphModeAll) {
      if (state.graphMode === "focus") {
        dom.btnGraphModeFocus.classList.add("active");
        dom.btnGraphModeAll.classList.remove("active");
      } else {
        dom.btnGraphModeFocus.classList.remove("active");
        dom.btnGraphModeAll.classList.add("active");
      }
    }

    if (state.activeMenu === "external") {
      // Hitung rincian per instrumen sumber untuk tab
      const instCounts = new Map();
      let totalAllCount = 0;
      for (const p of pairs) {
        const inst = p.sourceInst || "Lainnya";
        const count = (p.items ? p.items.length : 1);
        totalAllCount += count;
        instCounts.set(inst, (instCounts.get(inst) || 0) + count);
      }

      if (dom.graphInstTabs) {
        if (instCounts.size > 1) {
          dom.graphInstTabs.style.display = "flex";
          const tabsHtml = [];
          const isAllActive = (!state.extInstFilter || state.extInstFilter === "ALL");
          tabsHtml.push(`
            <span class="graph-inst-tabs-label">Filter Indeks Sumber:</span>
            <button class="btn-inst-tab ${isAllActive ? 'active' : ''}" data-inst="ALL">
              Semua Indeks (${totalAllCount.toLocaleString("id-ID")})
            </button>
          `);
          for (const [instCode, cnt] of instCounts.entries()) {
            const isActive = state.extInstFilter === instCode;
            const fullTitle = instName(instCode);
            tabsHtml.push(`
              <button class="btn-inst-tab ${isActive ? 'active' : ''}" data-inst="${esc(instCode)}" title="${esc(fullTitle)}">
                ${esc(instCode)} (${cnt.toLocaleString("id-ID")})
              </button>
            `);
          }
          dom.graphInstTabs.innerHTML = tabsHtml.join("");

          dom.graphInstTabs.querySelectorAll("[data-inst]").forEach(tabBtn => {
            tabBtn.onclick = () => {
              state.extInstFilter = tabBtn.dataset.inst;
              state.chosenSrc = "";
              renderStageGraph();
            };
          });
        } else {
          dom.graphInstTabs.innerHTML = "";
          dom.graphInstTabs.style.display = "none";
        }
      }

      // Terapkan filter tab jika dipilih
      if (state.extInstFilter && state.extInstFilter !== "ALL") {
        pairs = pairs.filter(p => p.sourceInst === state.extInstFilter);
      }
    } else {
      if (dom.graphInstTabs) {
        if (isS3) {
          const n = relasiInternal.sasaran3?.relasi?.length || 0;
          dom.graphInstTabs.style.display = "flex";
          dom.graphInstTabs.innerHTML = `
            <div class="s3-layout-controls">
              <div class="s3-layout-buttons">
                <button type="button" class="btn btn-sm ${state.s3Compact ? 'btn-primary' : 'btn-outline-primary'}" data-s3-layout="compact">☑ Ringkas per indikator</button>
                <button type="button" class="btn btn-sm ${!state.s3Compact ? 'btn-primary' : 'btn-outline-secondary'}" data-s3-layout="all">Lihat semua (${n} relasi)</button>
              </div>
              ${state.s3Compact ? `
                <label class="s3-select-wrap" for="s3DesignSelector">
                  <span>Indikator Desain IIIP</span>
                  <select id="s3DesignSelector" class="select-input" aria-label="Pilih indikator desain IIIP">
                    ${s3DesignOptions.map(opt => `<option value="${esc(opt.id)}" ${opt.id === state.s3SelectedIndicator ? 'selected' : ''}>${esc(opt.name)}</option>`).join("")}
                  </select>
                </label>` : '<span class="s3-view-caption">Klik kartu untuk menyorot hubungan tertentu.</span>'}
            </div>`;
          dom.graphInstTabs.querySelectorAll("[data-s3-layout]").forEach(btn => {
            btn.onclick = () => {
              const wantCompact = btn.dataset.s3Layout === "compact";
              state.s3Compact = wantCompact;
              state.chosenSrc = "";
              state.component = "";
              state.s3SelectedSurveyQuestion = "";
              state.s3GraphPickedIndicator = false;
              state.search = "";
              // Tampilan semua juga menggunakan orientasi desain→pertanyaan, lebih mudah dibaca.
              if (state.source !== "DIIIP" && state.source !== "ALL") state.source = "DIIIP";
              state.dest = "IIIP";
              state.chosenInst = "IIIP";
              populateFilters();
              renderStageGraph();
            };
          });
          const s3Selector = dom.graphInstTabs.querySelector("#s3DesignSelector");
          if (s3Selector) s3Selector.onchange = () => {
            state.s3SelectedIndicator = s3Selector.value;
            state.s3GraphPickedIndicator = true;
            state.s3SelectedSurveyQuestion = "";
            state.component = "";
            state.chosenSrc = s3Selector.value;
            renderStageGraph();
          };
        } else {
          dom.graphInstTabs.innerHTML = "";
          dom.graphInstTabs.style.display = "none";
        }
      }
    }

    // Tentukan pasangan aktif berdasarkan pilihan sel matriks (state.chosenSrc dan/atau state.chosenInst)
    let activePairs = pairs;
    if (state.chosenSrc || state.chosenInst) {
      const filtered = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );
      if (filtered.length > 0) {
        activePairs = filtered;
      }
    }
    currentActivePairs = activePairs;

    // Grouping indikator sumber:
    const srcMap = new Map();
    const pairsForSource = (state.chosenSrc || state.chosenInst) ? activePairs : pairs;
    for (const p of pairsForSource) {
      if (!srcMap.has(p.source)) {
        srcMap.set(p.source, {
          id: p.source,
          name: p.sourceName,
          inst: p.sourceInst,
          sasaran: p.sourceSasaran,
          totalItems: 0,
          destPairs: []
        });
      }
      const entry = srcMap.get(p.source);
      entry.totalItems += (p.items ? p.items.length : 1);
      entry.destPairs.push(p);
    }
    const sourceList = [...srcMap.values()].sort((a, b) => a.name.localeCompare(b.name, "id"));

    // Grouping indikator tujuan yang terhubung dengan pasangan aktif
    const dstMap = new Map();
    for (const p of activePairs) {
      if (!dstMap.has(p.dest)) {
        dstMap.set(p.dest, {
          id: p.dest,
          name: p.destName,
          inst: p.destInst,
          sasaran: p.destSasaran,
          totalItems: 0,
          pairs: []
        });
      }
      const entry = dstMap.get(p.dest);
      entry.totalItems += (p.items ? p.items.length : 1);
      entry.pairs.push(p);
    }
    const destList = [...dstMap.values()].sort((a, b) => a.name.localeCompare(b.name, "id"));

    // Hitung total keterkaitan pada lingkup tampilan saat ini
    const totalRelationsCount = activePairs.reduce((sum, p) => sum + (p.items ? p.items.length : 1), 0);
    dom.mapTotal.textContent = totalRelationsCount.toLocaleString("id-ID");
    dom.mapUnit.textContent = "relasi indikator";

    if (state.activeMenu === "external") {
      const srcSasaranNum = state.extSrcSasaran || (pairs[0] ? pairs[0].sourceSasaran : 2);
      const srcMeta = getSasaranInfo(srcSasaranNum);
      if (state.chosenSrc) {
        const activeSrcObj = srcMap.get(state.chosenSrc);
        dom.graphTitle.textContent = `${activeSrcObj ? activeSrcObj.name : state.chosenSrc} × Pemerintah Digital`;
      } else {
        dom.graphTitle.textContent = `${srcMeta.kode} (${srcMeta.nama_singkat}) → Sasaran 1 (Pemerintah Digital)`;
      }
      const filterNote = (state.extInstFilter && state.extInstFilter !== "ALL")
        ? `[Filter Indeks: ${instName(state.extInstFilter)}] `
        : "";
      dom.graphDesc.textContent = `${filterNote}Menampilkan ${totalRelationsCount} relasi rujukan indikator. Arahkan kursor pada kartu untuk menyorot garis relasi, klik kartu sumber untuk memfokuskan, atau klik kartu tujuan untuk membuka rincian di Tahap 3.`;
    } else {
      const sId = Number(state.internalSasaranId);
      if (state.chosenSrc && state.chosenInst) {
        dom.graphTitle.textContent = `${state.chosenSrc} × ${instName(state.chosenInst)}`;
        dom.graphDesc.textContent = `Menampilkan ${totalRelationsCount} relasi rujukan indikator antara ${state.chosenSrc} dan ${instName(state.chosenInst)}. Klik kartu tujuan untuk melihat rincian di Tahap 3.`;
      } else if (state.chosenSrc) {
        dom.graphTitle.textContent = `${state.chosenSrc} × ${instName(state.source)}`;
        dom.graphDesc.textContent = `Menampilkan ${totalRelationsCount} relasi rujukan indikator. Klik kartu tujuan untuk melihat rincian di Tahap 3.`;
      } else {
        dom.graphTitle.textContent = `Peta Relasi Internal Sasaran ${sId}`;
        dom.graphDesc.textContent = `Total ${totalRelationsCount} relasi terdata. Klik kartu tujuan untuk melihat rincian di Tahap 3.`;
      }
    }

    const srcInstLabel = state.source || (activePairs[0] ? activePairs[0].sourceInst : "Sumber");
    const dstInstLabel = state.chosenInst || (activePairs[0] ? activePairs[0].destInst : "Pembanding");

    dom.colSourceTitle.textContent = isS3
      ? (srcInstLabel === "DIIIP" ? "Indikator Desain IIIP" : "Pertanyaan Survei IIIP")
      : `Indeks / Indikator Sumber (${esc(instName(srcInstLabel))})`;
    dom.colSourceCount.textContent = `${sourceList.length} ${isS3 && srcInstLabel === "IIIP" ? "Pertanyaan" : "Indikator"}`;

    dom.colDestTitle.textContent = isS3
      ? (dstInstLabel === "IIIP" ? "Pertanyaan Survei IIIP yang Berelasi" : "Indikator Desain IIIP")
      : `Indeks / Indikator Pembanding (${esc(instName(dstInstLabel))})`;
    dom.colDestCount.textContent = `${destList.length} ${isS3 && dstInstLabel === "IIIP" ? "Pertanyaan" : "Indikator"}`;

    if (isS3 && state.s3Compact) {
      dom.graphTitle.textContent = "Peta Relasi Sasaran 3 — Ringkas per Indikator";
      dom.graphDesc.textContent = `Menampilkan ${totalRelationsCount} pertanyaan survei terkait satu indikator desain. Garis biru penghubung langsung terlihat dan dapat disorot. Total basis data ${relasiInternal.sasaran3?.relasi?.length || 0} relasi.`;
      dom.mapUnit.textContent = "pertanyaan terkait";
    }

    // Render Kartu Sumber (Kiri)
    if (sourceList.length === 0) {
      dom.containerSourceCards.innerHTML = `
        <div class="empty-state" style="padding:24px;">Tidak ada indikator sumber pada filter saat ini.</div>
      `;
    } else {
      dom.containerSourceCards.innerHTML = sourceList.map(src => {
        const isSelected = state.chosenSrc === src.id;
        const sasaranLabel = state.activeMenu === "external"
          ? (src.sasaran ? `Sasaran ${src.sasaran}` : "Sasaran Asal")
          : `Sasaran ${state.internalSasaranId}`;
        const activeStyle = isSelected
          ? "border: 2px solid #0284c7; background: #f0f9ff; box-shadow: 0 4px 10px rgba(2,132,199,0.18);"
          : "border-left: 4px solid var(--blue-primary);";

        const sourceTag = isS3 ? (src.inst === "IIIP" ? "Pertanyaan Survei IIIP" : "Indikator Desain IIIP") : instName(src.inst || state.source);
        return `
          <div class="diagram-card card-source" id="card_src_${esc(src.id)}" data-srcgroup="${esc(src.id)}" style="${activeStyle}" title="Arahkan kursor untuk menyorot relasi, atau klik untuk memfokuskan hubungan ini">
            <div class="card-top-meta">
              <span class="card-inst-tag">${esc(sourceTag)} · ${sasaranLabel}</span>
              <span class="card-rel-count">${src.totalItems} ${isS3 ? "pertanyaan terkait" : `rujukan kode (${src.destPairs.length} tujuan)`}</span>
            </div>
            <div class="card-title" style="font-size:14px; font-weight:700; color:var(--navy-dark);">${esc(src.name)}</div>
            <div style="font-size:11px; color:#64748b; margin-top:6px;">
              ${isS3 && state.s3Compact ? "Indikator terpilih · pilih indikator lain melalui daftar di atas" : (isSelected ? "✓ Sedang difokuskan (klik lagi untuk lepas)" : "Arahkan kursor / klik untuk fokus →")}
            </div>
            <div class="connection-pin" id="pin_src_${esc(src.id)}"></div>
          </div>
        `;
      }).join("");
    }

    // Pasang Event Klik & Hover Kartu Sumber
    dom.containerSourceCards.querySelectorAll("[data-srcgroup]").forEach(card => {
      const groupId = card.dataset.srcgroup;
      card.onclick = () => {
        if (isS3 && state.s3Compact) {
          state.s3SelectedIndicator = groupId;
          state.chosenSrc = groupId;
        } else {
          state.chosenSrc = state.chosenSrc === groupId ? "" : groupId;
        }
        renderStageGraph();
      };
      card.onmouseenter = () => {
        highlightSourceCard(groupId);
      };
      card.onmouseleave = () => {
        unhighlightAll();
      };
    });

    // Render Kartu Tujuan (Kanan - HANYA YANG BERHUBUNGAN)
    if (destList.length === 0) {
      dom.containerDestCards.innerHTML = `
        <div class="empty-state" style="padding:24px;">Tidak ada indikator tujuan pada pasangan ini dengan filter aktif.</div>
      `;
    } else {
      dom.containerDestCards.innerHTML = destList.map(dst => {
        const dstSasaranLabel = state.activeMenu === "external" ? "Sasaran 1" : `Sasaran ${state.internalSasaranId}`;
        const destTag = isS3 ? (dst.inst === "IIIP" ? "Pertanyaan Survei IIIP" : "Indikator Desain IIIP") : instName(dst.inst);
        return `
          <div class="diagram-card card-dest" id="card_dst_${esc(dst.id)}" data-destgroup="${esc(dst.id)}" style="cursor:pointer; border-left: 4px solid #10b981;" title="Arahkan kursor untuk menyorot sumber, atau klik untuk melihat rincian di Tahap 3">
            <div class="connection-pin" id="pin_dst_${esc(dst.id)}"></div>
            <div class="card-top-meta">
              <span class="card-inst-tag" style="color:#059669;">${esc(destTag)} · ${dstSasaranLabel}</span>
              <span class="card-rel-count">${dst.totalItems} ${isS3 && dst.inst === "IIIP" ? "relasi" : "rujukan kode"}</span>
            </div>
            <div class="card-title" style="font-size:14px; font-weight:700; color:var(--navy-dark);">${esc(dst.name)}</div>
            <div style="font-size:11px; color:#64748b; margin-top:6px;">Arahkan kursor untuk sorot · Klik rincian di Tahap 3 →</div>
          </div>
        `;
      }).join("");
    }

    // Pasang Event Klik & Hover Kartu Tujuan
    dom.containerDestCards.querySelectorAll("[data-destgroup]").forEach(card => {
      const destGroupId = card.dataset.destgroup;
      card.onclick = () => {
        state.chosenDest = destGroupId;
        state.focusRelation = null;
        setStage("list");
      };
      card.onmouseenter = () => {
        highlightDestCard(destGroupId);
      };
      card.onmouseleave = () => {
        unhighlightAll();
      };
    });

    // Gambar Garis Kurva SVG Bezier Antar Kartu
    requestAnimationFrame(() => {
      drawCurves(activePairs);
    });

    updateContextBanner();
  }

  function drawCurves(pairsToDraw) {
    const svgGroup = dom.svgPathGroup;
    if (!svgGroup || !dom.diagramSvg || typeof dom.diagramSvg.getBoundingClientRect !== "function") return;

    svgGroup.innerHTML = "";
    const svgRect = dom.diagramSvg.getBoundingClientRect();
    if (!svgRect || svgRect.width === 0 || svgRect.height === 0) return;

    const pathsHtml = [];
    const isFocusMode = (state.graphMode === "focus");
    const isS3Diagram = state.activeMenu === "internal" && Number(state.internalSasaranId) === 3;
    const isS3HoverOnly = isS3Diagram && !state.s3Compact;
    const isS3CompactVisible = isS3Diagram && state.s3Compact;

    (pairsToDraw || []).forEach((p, idx) => {
      const pinSrc = document.getElementById(`pin_src_${p.source}`);
      const pinDst = document.getElementById(`pin_dst_${p.dest}`);
      if (!pinSrc || !pinDst || typeof pinSrc.getBoundingClientRect !== "function" || typeof pinDst.getBoundingClientRect !== "function") return;

      const rectSrc = pinSrc.getBoundingClientRect();
      const rectDst = pinDst.getBoundingClientRect();

      const x1 = rectSrc.left + rectSrc.width / 2 - svgRect.left;
      const y1 = rectSrc.top + rectSrc.height / 2 - svgRect.top;
      const x2 = rectDst.left + rectDst.width / 2 - svgRect.left;
      const y2 = rectDst.top + rectDst.height / 2 - svgRect.top;

      const dx = (x2 - x1) * 0.5;
      const arrowTipX = x2 - 2;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${arrowTipX} ${y2}`;

      const isCardSelected = state.chosenSrc && (state.chosenSrc === p.source);

      let strokeColor = "#0284c7";
      let strokeOpacity = "0.55";
      let strokeWidth = "2";
      let markerEnd = "url(#arrowActive)";

      if (isS3HoverOnly) {
        // Mode lengkap Sasaran 3: tanpa garis sebelum hover; saat hover hanya garis biru.
        strokeOpacity = "0";
        strokeWidth = "2";
        markerEnd = "none";
      } else if (isS3CompactVisible) {
        // Mode ringkas: koneksi sedikit, sehingga garis biru langsung ditampilkan.
        strokeColor = "#0284c7";
        strokeOpacity = "0.86";
        strokeWidth = "2.5";
        markerEnd = "url(#arrowActive)";
      } else if (isFocusMode) {
        if (state.chosenSrc) {
          if (isCardSelected) {
            strokeColor = "#0284c7";
            strokeOpacity = "1";
            strokeWidth = "3.5";
            markerEnd = "url(#arrowActive)";
          } else {
            strokeColor = "#cbd5e1";
            strokeOpacity = "0.06";
            strokeWidth = "1";
            markerEnd = "none";
          }
        } else {
          // Default di Mode Fokus: kurva dibuat tipis dan halus agar bebas dari benang kusut
          strokeColor = "#94a3b8";
          strokeOpacity = "0.15";
          strokeWidth = "1.5";
          markerEnd = "none";
        }
      }

      pathsHtml.push(`
        <path d="${d}"
              class="relation-curve"
              id="curve_${idx}"
              data-src="${esc(p.source)}"
              data-dst="${esc(p.dest)}"
              stroke="${strokeColor}"
              stroke-width="${strokeWidth}"
              fill="none"
              stroke-opacity="${strokeOpacity}"
              marker-end="${markerEnd}"
              ${isS3HoverOnly ? 'pointer-events="none"' : ''} />
        ${isS3HoverOnly ? '' : `<polygon points="${arrowTipX},${y2} ${arrowTipX - 8},${y2 - 4.5} ${arrowTipX - 8},${y2 + 4.5}"
                 fill="${strokeColor}"
                 fill-opacity="${strokeOpacity}" />`}
      `);
    });

    svgGroup.innerHTML = pathsHtml.join("");
  }

  function renderTypeBadge(type) {
    if (!type) {
      return `<span class="badge badge-unassigned">Belum ditetapkan</span>`;
    }
    const map = {
      "Mendukung": "badge-mendukung",
      "Saling Melengkapi": "badge-melengkapi",
      "Beririsan Substansi": "badge-beririsan",
      "Potensi Tumpang Tindih": "badge-tumpangtindih",
      "Keselarasan Perencanaan": "badge-selaras"
    };
    const cls = map[type] || "badge-unassigned";
    return `<span class="badge ${cls}">${esc(type)}</span>`;
  }

  // Jenis keterkaitan yang dipilih di Tahap 3, diterapkan sesudah lingkup pasangan/indikator.
  // Data sumber tidak diubah; filter ini juga dipakai oleh PDF dan CSV daftar.
  function applyListTypeFilters(items) {
    const chosen = state.listTypeFilters || [];
    if (!chosen.length) return items;
    return items.filter(item => chosen.includes(String(item.type || "Belum ditetapkan")));
  }

  function renderListTypeToolbar(allScopedItems) {
    const baseItems = allScopedItems || [];
    const countByType = new Map();
    baseItems.forEach(item => {
      const type = String(item.type || "Belum ditetapkan");
      countByType.set(type, (countByType.get(type) || 0) + 1);
    });
    const chosen = state.listTypeFilters || [];
    const displayedCount = applyListTypeFilters(baseItems).length;
    const nf = n => Number(n).toLocaleString("id-ID");
    if (dom.listVisibleCount) dom.listVisibleCount.textContent = nf(displayedCount);
    if (dom.listCountSummary) dom.listCountSummary.textContent = `dari ${nf(baseItems.length)} catatan pada lingkup ini`;
    if (!dom.listTypeOptions) return;

    const order = ["Mendukung", "Saling Melengkapi", "Beririsan Substansi", "Potensi Tumpang Tindih", "Keselarasan Perencanaan"];
    const types = [...countByType.keys()].sort((a,b) => {
      const ia = order.indexOf(a), ib = order.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b, "id");
    });
    const allActive = chosen.length === 0;
    dom.listTypeOptions.innerHTML = `
      <button type="button" class="list-type-chip ${allActive ? 'active' : ''}" data-list-type-all="true" aria-pressed="${allActive}">Semua <span>${nf(baseItems.length)}</span></button>
      ${types.map(type => {
        const active = chosen.includes(type);
        return `<button type="button" class="list-type-chip ${active ? 'active' : ''}" data-list-type="${esc(type)}" aria-pressed="${active}" title="${esc(type)} — ${nf(countByType.get(type))} relasi">
          ${active ? '<span class="type-tick">✓</span>' : ''}${esc(type)} <span>${nf(countByType.get(type))}</span>
        </button>`;
      }).join("")}`;
    dom.listTypeOptions.querySelector('[data-list-type-all]').onclick = () => {
      state.listTypeFilters = [];
      state.focusItem = null;
      renderStageList();
    };
    dom.listTypeOptions.querySelectorAll('[data-list-type]').forEach(btn => {
      btn.onclick = () => {
        const val = btn.dataset.listType;
        const next = new Set(state.listTypeFilters || []);
        if (next.has(val)) next.delete(val);
        else next.add(val);
        state.listTypeFilters = [...next];
        state.focusItem = null;
        renderStageList();
      };
    });
  }

  function renderStatusBadge(status) {
    if (!status || status === "Rujukan Tercatat" || status === "Tercatat") return "";
    const isUsulan = String(status).toUpperCase().includes("USULAN");
    const cls = isUsulan ? "badge-status-usulan" : "badge-status-perlu";
    return `<span class="badge ${cls}">${esc(status)}</span>`;
  }

  function renderTingkatBadge(tingkat) {
    if (!tingkat) return "";
    const isKuat = tingkat.toUpperCase().includes("KUAT");
    const cls = isKuat ? "badge-tingkat-kuat" : "badge-tingkat-sedang";
    return `<span class="badge ${cls}">Tingkat: ${esc(tingkat)}</span>`;
  }

  // Render Kartu Penyandingan Dua Kolom (Executive Detail View)
  function renderFocusRelationCard(r) {
    if (!dom.focusRelationCard) return;
    if (!r) {
      dom.focusRelationCard.innerHTML = "";
      dom.focusRelationCard.classList.add("hidden");
      return;
    }

    const titleText = (r.sourceInstName && r.destInstName && r.sourceInstName !== r.destInstName)
      ? `${r.sourceInstName} ⟷ ${r.destInstName}`
      : `${r.sourceName || r.sourceIndikator} ⟷ ${r.destName || r.destIndikator}`;

    dom.focusRelationCard.classList.remove("hidden");
    dom.focusRelationCard.innerHTML = `
      <div class="executive-compare-card">
        <div class="compare-card-header">
          <div class="compare-card-title-group">
            <span class="compare-card-tag">Penyandingan Substansi Indikator</span>
            <h3 class="compare-card-title">${esc(titleText)}</h3>
          </div>
          <button class="btn btn-sm btn-secondary btn-close-detail" id="btnCloseDetailCard" title="Tutup Detail">
            <span>✕ Tutup Detail</span>
          </button>
        </div>

        <div class="compare-columns-grid">
          <!-- Kolom Kiri: Indikator Sumber -->
          <div class="compare-col compare-col-source">
            <div class="compare-col-header">
              <span class="compare-col-badge">Indikator Sumber</span>
              <span class="compare-col-sasaran">${esc(r.sourceSasaranName)}</span>
            </div>
            <div class="compare-info-list">
              <div class="compare-info-item">
                <span class="info-label">Sasaran Strategis</span>
                <div class="info-val info-sasaran">${esc(r.sourceSasaranName)}</div>
              </div>
              <div class="compare-info-item">
                <span class="info-label">Indeks Sumber</span>
                <div class="info-val info-indeks">${esc(r.sourceInstName)}</div>
              </div>
              <div class="compare-info-item">
                <span class="info-label">Aspek</span>
                <div class="info-val info-aspek">${esc(r.sourceAspek || "-")}</div>
              </div>
              <div class="compare-info-item">
                <span class="info-label">Indikator</span>
                <div class="info-val info-indikator">${esc(r.sourceIndikator)}</div>
              </div>
              <div class="compare-info-item">
                <span class="info-label">ID Pelacakan Data</span>
                <div class="info-val info-code" style="font-family:monospace; font-size:11px; color:#475569; font-weight:600;">${esc(r.sourceCode || "-")}</div>
              </div>
              ${r.sourceSubindikator ? `
              <div class="compare-info-item">
                <span class="info-label">Subindikator / Kondisi</span>
                <div class="info-val info-subindikator">${esc(r.sourceSubindikator)}</div>
              </div>` : ""}
            </div>
          </div>

          <!-- Kolom Kanan: Indikator Pembanding -->
          <div class="compare-col compare-col-dest">
            <div class="compare-col-header">
              <span class="compare-col-badge">Indikator Pembanding</span>
              <span class="compare-col-sasaran">${esc(r.destSasaranName)}</span>
            </div>
            <div class="compare-info-list">
              <div class="compare-info-item">
                <span class="info-label">Sasaran Strategis Tujuan</span>
                <div class="info-val info-sasaran">${esc(r.destSasaranName)}</div>
              </div>
              <div class="compare-info-item">
                <span class="info-label">Indeks Pembanding</span>
                <div class="info-val info-indeks">${esc(r.destInstName)}</div>
              </div>
              <div class="compare-info-item">
                <span class="info-label">Aspek</span>
                <div class="info-val info-aspek">${esc(r.destAspek || "-")}</div>
              </div>
              <div class="compare-info-item">
                <span class="info-label">Indikator</span>
                <div class="info-val info-indikator">${esc(r.destIndikator)}</div>
              </div>
              <div class="compare-info-item">
                <span class="info-label">ID Pelacakan Data</span>
                <div class="info-val info-code" style="font-family:monospace; font-size:11px; color:#475569; font-weight:600;">${esc(r.destCode || "-")}</div>
              </div>
              ${r.destSubindikator ? `
              <div class="compare-info-item">
                <span class="info-label">Subindikator / Kondisi</span>
                <div class="info-val info-subindikator">${esc(r.destSubindikator)}</div>
              </div>` : ""}
            </div>
          </div>
        </div>

        <!-- Informasi Keterkaitan & Alasan (Menyatu dalam 1 Card di Bawah Kolom) -->
        <div class="compare-keterkaitan-unified">
          <div class="keterkaitan-header-row">
            <div class="keterkaitan-badges-group">
              <span class="keterkaitan-label">Informasi Keterkaitan:</span>
              ${renderTypeBadge(r.type)}
              <span class="badge badge-status">${esc(r.level || "Tervalidasi Substantif")}</span>
              ${r.tingkat ? renderTingkatBadge(r.tingkat) : ""}
            </div>
          </div>
          <div class="keterkaitan-reason-box">
            <span class="info-label">Alasan atau Justifikasi Substantif:</span>
            <p class="keterkaitan-reason-text">${esc(r.reason)}</p>
          </div>
        </div>
      </div>
    `;

    const btnClose = dom.focusRelationCard.querySelector("#btnCloseDetailCard");
    if (btnClose) {
      btnClose.onclick = () => {
        state.focusItem = null;
        dom.focusRelationCard.classList.add("hidden");
      };
    }
  }

  // 10. TAHAP 3: RENDER DAFTAR RELASI
  function renderStageList() {
    dom.stageMatrix.classList.add("hidden");
    dom.stageGraph.classList.add("hidden");
    dom.stageList.classList.remove("hidden");

    const allFiltered = filteredRelations();
    const pairs = groupRelations(allFiltered);
    let itemsToDisplay = [];

    if (state.chosenDest) {
      const activePair = pairs.find(p => p.dest === state.chosenDest && (!state.chosenSrc || p.source === state.chosenSrc));
      if (activePair) {
        itemsToDisplay = activePair.items;
        dom.listTitle.textContent = `Detail Relasi: ${activePair.sourceName} → ${activePair.destName}`;
        dom.listDesc.textContent = `${itemsToDisplay.length} catatan keterkaitan pada pasangan indikator ini. Menampilkan keterangan substantif dan jenis keterkaitan.`;
      } else {
        itemsToDisplay = allFiltered;
        dom.listTitle.textContent = `Daftar Seluruh Relasi Terfilter`;
        dom.listDesc.textContent = `Menampilkan keterkaitan pada filter saat ini. Total ${itemsToDisplay.length} catatan keterkaitan terdata.`;
      }
    } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
      const matchedPairs = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );
      if (matchedPairs.length > 0) {
        itemsToDisplay = matchedPairs.flatMap(p => p.items);
        const srcLabel = state.activeMenu === "internal" && Number(state.internalSasaranId) === 3
          ? (matchedPairs[0]?.sourceName || "Indikator Terpilih")
          : (state.chosenSrc || (matchedPairs[0] ? matchedPairs[0].sourceName : "Indikator Terpilih"));
        const dstLabel = state.chosenInst ? instName(state.chosenInst) : (matchedPairs[0] ? instName(matchedPairs[0].destInst) : "Indeks Pembanding");
        dom.listTitle.textContent = `Detail Relasi: ${srcLabel} → ${dstLabel}`;
        dom.listDesc.textContent = `${itemsToDisplay.length} catatan keterkaitan antara ${srcLabel} dengan ${dstLabel}. Menampilkan keterangan substantif dan jenis keterkaitan.`;
      } else {
        itemsToDisplay = allFiltered;
        dom.listTitle.textContent = `Daftar Seluruh Relasi Terfilter`;
        dom.listDesc.textContent = `Menampilkan keterkaitan pada filter saat ini. Total ${itemsToDisplay.length} catatan keterkaitan terdata.`;
      }
    } else {
      itemsToDisplay = allFiltered;
      dom.listTitle.textContent = `Daftar Seluruh Relasi Terfilter`;
      dom.listDesc.textContent = `Menampilkan keterkaitan pada filter saat ini. Total ${itemsToDisplay.length} catatan keterkaitan terdata.`;
    }

    // Ringkasan jumlah ditempatkan di bagian atas; opsi hanya jenis yang benar-benar ada.
    const allScopedItems = itemsToDisplay;
    renderListTypeToolbar(allScopedItems);
    itemsToDisplay = applyListTypeFilters(allScopedItems);
    dom.listDesc.textContent = "Rincian hubungan indikator sesuai lingkup terpilih. Gunakan pilihan jenis keterkaitan untuk menyaring tabel dan hasil ekspor.";
    // Cegah kartu detail lama tetap tampil setelah jenis keterkaitan diganti.
    if (state.focusItem && !itemsToDisplay.some(r => r.id === state.focusItem.id)) state.focusItem = null;

    // Auto-focus if user came from clicking a card in Stage 2 or if only a single pair is selected
    if (state.chosenDest && itemsToDisplay.length > 0 && !state.focusItem) {
      state.focusItem = itemsToDisplay[0];
    }

    if (state.focusItem) {
      renderFocusRelationCard(state.focusItem);
    } else if (dom.focusRelationCard) {
      dom.focusRelationCard.innerHTML = "";
      dom.focusRelationCard.classList.add("hidden");
    }

    // Intro Notice
    if (dom.detailIntroNotice) {
      if (state.activeMenu === "external") {
        dom.detailIntroNotice.innerHTML = `<strong>Keterangan Relasi Eksternal:</strong> Menampilkan penyandingan substansi indikator dari Sasaran 1 (Pemerintah Digital) menuju sasaran tujuan (Sasaran 2 s.d. 5). Pilih <em>Lihat Detail</em> untuk menelaah justifikasi dan komparasi substansial secara utuh.`;
      } else if (Number(state.internalSasaranId) === 5) {
        dom.detailIntroNotice.innerHTML = `<strong>Relasi Internal Sasaran 5:</strong> Menampilkan penyandingan substansi indikator antar-indeks pelayanan publik. Pilih <em>Lihat Detail</em> untuk membandingkan aspek, indikator, dan subindikator pendukung.`;
      } else if (Number(state.internalSasaranId) === 3) {
        dom.detailIntroNotice.innerHTML = `<strong>Relasi Internal Sasaran 3:</strong> Menampilkan penyandingan substansi antara Instrumen Pengumpulan Data Survei IIIP dan Desain IIIP berdasarkan sheet <code>Copy of Sasaran 3</code>. Pilih <em>Lihat Detail</em> untuk menelaah rincian indikator, pertanyaan, dan justifikasi keterkaitan secara utuh.`;
      } else {
        dom.detailIntroNotice.innerHTML = `<strong>Relasi Internal Sasaran 4:</strong> Menampilkan 50 hubungan keterkaitan resmi antara Kapabilitas Kelembagaan dan indeks pembanding berdasarkan substansi indikator asli.`;
      }
    }

    // Tabel Rincian
    if (itemsToDisplay.length === 0) {
      dom.tableRelationBody.innerHTML = "";
      dom.listEmptyState.classList.remove("hidden");
      dom.tableMoreNotice.classList.add("hidden");
      return;
    }

    dom.listEmptyState.classList.add("hidden");

    // Batasi 100 entri pada layar untuk kecepatan render DOM
    const maxShow = 100;
    const sample = itemsToDisplay.slice(0, maxShow);

    dom.tableRelationBody.innerHTML = sample.map((r, i) => {
      return `
        <tr>
          <td style="font-weight:700; color:#64748b; text-align:center;">${i + 1}</td>
          <td>
            <div class="table-cell-substance">
              <div class="cell-main-title">${esc(r.sourceIndikator)}</div>
              ${r.sourceAspek ? `<div class="cell-aspek-text">Aspek: ${esc(r.sourceAspek)}</div>` : ""}
              <div class="cell-sub-pills">
                <span class="cell-pill">${esc(r.sourceInstName)}</span>
                <span class="cell-pill-sasaran">${esc(r.sourceSasaranName)}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="table-cell-substance">
              <div class="cell-main-title">${esc(r.destIndikator)}</div>
              ${r.destAspek ? `<div class="cell-aspek-text">Aspek: ${esc(r.destAspek)}</div>` : ""}
              <div class="cell-sub-pills">
                <span class="cell-pill">${esc(r.destInstName)}</span>
                <span class="cell-pill-sasaran">${esc(r.destSasaranName)}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="table-cell-type-col">
              ${renderTypeBadge(r.type)}
              ${renderStatusBadge(r.level)}
              ${r.tingkat ? renderTingkatBadge(r.tingkat) : ""}
            </div>
          </td>
          <td style="text-align: center;">
            <button class="btn btn-sm btn-outline-primary btn-action-detail" data-rel-id="${esc(r.id)}" title="Lihat penyandingan substansi lengkap">
              <span>Lihat Detail</span> 👁
            </button>
          </td>
        </tr>
      `;
    }).join("");

    // Wire Up "Lihat Detail" Click Event
    dom.tableRelationBody.querySelectorAll(".btn-action-detail").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.dataset.relId;
        const targetRel = itemsToDisplay.find(item => item.id === id);
        if (targetRel) {
          state.focusItem = targetRel;
          renderFocusRelationCard(targetRel);
          dom.focusRelationCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    });

    if (itemsToDisplay.length > maxShow) {
      dom.tableMoreNotice.classList.remove("hidden");
      dom.tableMoreNotice.textContent = `Ditampilkan ${maxShow} dari ${itemsToDisplay.length} catatan keterkaitan pada layar agar tampilan tetap responsif. Ekspor hasil terfilter (CSV) memuat seluruh ${itemsToDisplay.length} catatan lengkap.`;
    } else {
      dom.tableMoreNotice.classList.add("hidden");
    }

    updateContextBanner();
  }

  // 11. Context Banner
  function updateContextBanner() {
    if (!dom.contextBanner) return;

    if (state.activeStage === "matrix") {
      dom.contextTag.textContent = "Tahap 1: Matriks";
      dom.contextText.textContent = `Silakan pilih salah satu sel bernilai > 0 pada matriks untuk membedah komponen di Peta Relasi.`;
    } else if (state.activeStage === "graph") {
      dom.contextTag.textContent = "Tahap 2: Peta Relasi";
      if (state.activeMenu === "internal" && Number(state.internalSasaranId) === 3) {
        const current = (currentActivePairs || [])[0];
        dom.contextText.textContent = state.s3Compact
          ? `Indikator Desain: ${current?.sourceName || "Pilih indikator"} · ${(currentActivePairs || []).length} pertanyaan survei terkait. Klik pertanyaan untuk melihat rincian.`
          : `Menampilkan peta lengkap 72 relasi antara indikator desain dan pertanyaan survei. Klik salah satu kartu untuk memfokuskan.`;
      } else {
        dom.contextText.textContent = `Sumber: ${state.chosenSrc} × Pembanding: ${instName(state.chosenInst || "PEMDI")}. Klik salah satu kartu tujuan untuk melihat daftar rincian.`;
      }
    } else {
      dom.contextTag.textContent = "Tahap 3: Daftar Relasi";
      if (state.activeMenu === "internal" && Number(state.internalSasaranId) === 3 && state.chosenDest) {
        dom.contextText.textContent = "Menampilkan rincian hubungan indikator desain IIIP dengan pertanyaan survei terkait.";
      } else {
        dom.contextText.textContent = state.chosenDest
          ? `Menampilkan rincian hubungan ${state.chosenSrc} → ${state.chosenDest}.`
          : `Menampilkan seluruh hubungan terfilter.`;
      }
    }
  }

  // 12. Navigasi Tahapan & Breadcrumbs
  function setStage(stage) {
    const previousStage = state.activeStage;
    state.activeStage = stage;

    // Update Stepper
    [dom.step1Btn, dom.step2Btn, dom.step3Btn].forEach(b => b.classList.remove("active", "completed"));
    dom.stepLine1.classList.remove("active");
    dom.stepLine2.classList.remove("active");

    if (stage === "matrix") {
      if (state.activeMenu === "internal" && Number(state.internalSasaranId) === 3 &&
          previousStage !== "matrix" && state.s3GraphPickedIndicator && state.s3SelectedIndicator) {
        if (state.source !== "ALL") state.source = "DIIIP";
        state.component = state.s3SelectedIndicator;
        state.dest = "IIIP";
        state.s3GraphPickedIndicator = false;
        populateFilters();
      }
      if (dom.mainFilterBar) dom.mainFilterBar.classList.remove("hidden");
      dom.step1Btn.classList.add("active");
      dom.btnGlobalBack.classList.add("hidden");
      state.chosenSrc = "";
      state.chosenInst = "";
      state.chosenDest = "";
      state.focusItem = null;
      if (state.activeMenu === "external") {
        state.extDirection = "ALL";
        state.extSrcSasaran = 1;
        state.extDstSasaran = "ALL";
        state.extInstFilter = "ALL";
        state.source = "PEMDI";
        state.dest = "";
        if (dom.selectExtSourceSasaran) {
          dom.selectExtSourceSasaran.value = "1";
        }
        if (dom.selectExtDestSasaran) {
          dom.selectExtDestSasaran.value = "ALL";
        }
      }
    } else if (stage === "graph") {
      if (dom.mainFilterBar) dom.mainFilterBar.classList.remove("hidden");
      dom.step1Btn.classList.add("completed");
      dom.stepLine1.classList.add("active");
      dom.step2Btn.classList.add("active");
      dom.btnGlobalBack.classList.remove("hidden");
      dom.btnGlobalBackText.textContent = "Kembali ke Matriks";
    } else if (stage === "list") {
      if (dom.mainFilterBar) dom.mainFilterBar.classList.remove("hidden");
      dom.step1Btn.classList.add("completed");
      dom.step2Btn.classList.add("completed");
      dom.stepLine1.classList.add("active");
      dom.stepLine2.classList.add("active");
      dom.step3Btn.classList.add("active");
      dom.btnGlobalBack.classList.remove("hidden");
      dom.btnGlobalBackText.textContent = "Kembali ke Peta";
    }

    updateBreadcrumbs();

    if (stage === "matrix") {
      renderStageMatrix();
    } else if (stage === "graph") {
      renderStageGraph();
    } else if (stage === "list") {
      renderStageList();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateBreadcrumbs() {
    dom.bcMenu.textContent = state.activeMenu === "internal" ? "Relasi Internal" : "Relasi Eksternal";

    if (state.activeMenu === "internal") {
      dom.bcScope.textContent = `Sasaran ${state.internalSasaranId}`;
    } else {
      if (state.activeStage !== "matrix" && state.extDstSasaran && state.extDstSasaran !== "ALL") {
        dom.bcScope.textContent = `Sasaran 1 → Sasaran ${state.extDstSasaran}`;
      } else {
        dom.bcScope.textContent = "Sasaran 1 s.d. 5";
      }
    }

    if (state.activeStage === "matrix") {
      dom.bcStage.textContent = "Tahap 1: Matriks Relasi";
    } else if (state.activeStage === "graph") {
      dom.bcStage.textContent = "Tahap 2: Peta Relasi";
    } else {
      dom.bcStage.textContent = "Tahap 3: Daftar Relasi";
    }
  }

  function setMenu(menu) {
    state.listTypeFilters = [];
    state.activeMenu = menu;
    state.activeStage = "matrix";
    state.chosenSrc = "";
    state.chosenInst = "";
    state.chosenDest = "";
    state.focusRelation = null;
    state.component = "";
    state.dest = "";
    state.rtype = "";
    state.search = "";

    if (menu === "internal") {
      dom.menuInternal.classList.add("active");
      dom.menuExternal.classList.remove("active");
      dom.groupInternalSasaranSelect.classList.remove("hidden");
      if (dom.groupExtSourceSasaranSelect) dom.groupExtSourceSasaranSelect.classList.add("hidden");
      if (dom.groupExtDestSasaranSelect) dom.groupExtDestSasaranSelect.classList.add("hidden");
      if (dom.externalAuditNoticeBox) dom.externalAuditNoticeBox.classList.add("hidden");
      if (dom.sidebarScopeTitle) dom.sidebarScopeTitle.textContent = "Relasi Internal";
      if (dom.sidebarScopeDesc) dom.sidebarScopeDesc.textContent = "Memetakan hubungan antar-indeks dalam sasaran strategis yang sama (Sasaran 3, 4, dan 5).";
      state.source = Number(state.internalSasaranId) === 4 ? "KK" : (Number(state.internalSasaranId) === 5 ? "IPP" : "IIIP");
    } else {
      dom.menuInternal.classList.remove("active");
      dom.menuExternal.classList.add("active");
      dom.groupInternalSasaranSelect.classList.add("hidden");
      if (dom.groupExtSourceSasaranSelect) dom.groupExtSourceSasaranSelect.classList.remove("hidden");
      if (dom.groupExtDestSasaranSelect) dom.groupExtDestSasaranSelect.classList.remove("hidden");
      if (dom.sasaran3NoticeBox) dom.sasaran3NoticeBox.classList.add("hidden");
      if (dom.sidebarScopeTitle) dom.sidebarScopeTitle.textContent = "Relasi Eksternal";
      if (dom.sidebarScopeDesc) dom.sidebarScopeDesc.textContent = "Memetakan hubungan keterkaitan indikator antar-sasaran strategis RB (Sasaran 1 menuju Sasaran 2, 3, 4, dan 5).";
      state.extDirection = "ALL";
      state.extSrcSasaran = 1;
      state.extDstSasaran = "ALL";
      if (dom.selectExtSourceSasaran) dom.selectExtSourceSasaran.value = "1";
      if (dom.selectExtDestSasaran) dom.selectExtDestSasaran.value = "ALL";
      state.source = "PEMDI";
      state.dest = "";
    }

    populateFilters();
    setStage("matrix");
  }

  // 13. Fitur Ekspor CSV Terfilter
  function exportFilteredCsv() {
    let headers = [];
    let rows = [];

    const isDetailExport = state.activeStage === "list" || state.chosenDest;

    if (isDetailExport) {
      headers = [
        "Sasaran",
        "Indeks Sumber",
        "Indikator Sumber",
        "Indeks Pembanding",
        "Indikator Pembanding",
        "Kode Indikator Sumber",
        "Kode Indikator Pembanding",
        "Jenis Keterkaitan",
        "Status Klasifikasi",
        "Tingkat Keterkaitan (Bila Ada)",
        "Alasan / Keterangan Keterkaitan",
        "Referensi Sel Excel (Audit)",
        "Satuan Penghitungan"
      ];

      const allFiltered = filteredRelations();
      const pairs = groupRelations(allFiltered);
      let itemsToExport = [];
      if (state.chosenDest) {
        const activePair = pairs.find(p => p.dest === state.chosenDest && (!state.chosenSrc || p.source === state.chosenSrc));
        itemsToExport = activePair ? activePair.items : allFiltered;
      } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
        const matchedPairs = pairs.filter(p =>
          (!state.chosenSrc || p.source === state.chosenSrc) &&
          (!state.chosenInst || p.destInst === state.chosenInst)
        );
        itemsToExport = matchedPairs.length > 0 ? matchedPairs.flatMap(p => p.items) : allFiltered;
      } else {
        itemsToExport = allFiltered;
      }

      if (state.activeStage === "list") itemsToExport = applyListTypeFilters(itemsToExport);

      rows = itemsToExport.map(r => [
        r.sasaran,
        r.sourceInst,
        r.sourceName,
        r.destInst,
        r.destName,
        r.sourceCode,
        r.destCode,
        r.type || "Belum ditetapkan",
        r.level || "Perlu penilaian",
        r.tingkat || "-",
        r.reason,
        (r.refs || []).join("; "),
        "Pasangan Kode Indikator"
      ]);
    } else {
      headers = [
        "Sasaran",
        "Indeks Sumber",
        "Indikator Sumber",
        "Indeks Pembanding",
        "Indikator Pembanding",
        "Jumlah Pasangan Kode",
        "Satuan Penghitungan"
      ];

      const pairs = groupRelations(filteredRelations()).filter(p =>
        state.activeStage !== "graph" || (p.source === state.chosenSrc && p.destInst === state.chosenInst)
      );

      rows = pairs.map(p => [
        state.activeMenu === "external" ? (p.items[0]?.sasaran || "Relasi Eksternal") : `Sasaran ${state.internalSasaranId}`,
        p.sourceInst || state.source,
        p.sourceName,
        p.destInst,
        p.destName,
        p.items.length,
        "Pasangan Indikator"
      ]);
    }

    const csvContent = [headers, ...rows]
      .map(r => r.map(csvCell).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const scopeName = state.activeMenu === "external"
      ? `eksternal-${state.extDirection}`
      : `internal-sasaran${state.internalSasaranId}`;
    link.download = `relasi-rb-${scopeName}-${state.activeStage}-terfilter.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  // 14. Fitur Ekspor PDF Profesional (100% Offline, Bersih, Proporsional & Tanpa Terpotong)

  // 14. Fitur Ekspor & Preview PDF Profesional (100% Offline, Bersih, Proporsional & Tanpa Terpotong)

  let currentPreviewBlobUrl = null;
  let currentPreviewDoc = null;
  let currentPreviewFileName = "Dokumen_Relasi_Portal_RB.pdf";

  function getFullInstrumentName(code) {
    if (!code) return "";
    const map = {
      PEMDI: "Pemerintah Digital",
      SM: "Sistem Merit",
      DIIIP: "Desain Indeks Inovasi Instansi Pemerintah (IIIP)",
      IIIP: "Instrumen Pengumpulan Data Survei Indeks Inovasi Instansi Pemerintah (IIIP)",
      SPI: "Survei Penilaian Integritas (Historis Nonaktif)",
      KK: "Kapabilitas Kelembagaan",
      IPPN: "Indeks Perencanaan Pembangunan Nasional",
      SAKIP: "Sistem Akuntabilitas Kinerja Instansi Pemerintah",
      ELPPD: "Evaluasi Laporan Penyelenggaraan Pemda",
      SPIP: "Sistem Pengendalian Intern Pemerintah",
      IKPA: "Indikator Kinerja Pelaksanaan Anggaran",
      IPA: "Indeks Pengelolaan Aset",
      CKKP: "Capaian Kontribusi Kinerja Pembangunan",
      IPP: "Indeks Pelayanan Publik",
      OP: "Opini Pengawasan Pelayanan Publik",
      IKK: "Indeks Kualitas Kebijakan",
      ZI: "Zona Integritas"
    };
    return map[code] || instName(code) || code;
  }

  function openPdfPreview(pdfResult) {
    if (!pdfResult || !pdfResult.doc) {
      alert("Gagal memproses dokumen PDF.");
      return;
    }

    if (currentPreviewBlobUrl) {
      URL.revokeObjectURL(currentPreviewBlobUrl);
      currentPreviewBlobUrl = null;
    }

    currentPreviewDoc = pdfResult.doc;
    currentPreviewFileName = pdfResult.fileName || "Dokumen_Relasi_Portal_RB.pdf";

    const blob = pdfResult.doc.output("blob");
    currentPreviewBlobUrl = URL.createObjectURL(blob);

    const modal = document.getElementById("pdfPreviewModal");
    const iframe = document.getElementById("pdfPreviewIframe");
    const titleEl = document.getElementById("pdfPreviewTitle");
    const subtitleEl = document.getElementById("pdfPreviewSubtitle");

    if (titleEl) titleEl.textContent = pdfResult.title || "Preview Dokumen PDF Resmi";
    if (subtitleEl) subtitleEl.textContent = `${pdfResult.subtitle || ""} — [File: ${pdfResult.fileName}]`;

    if (iframe) {
      iframe.src = currentPreviewBlobUrl;
    }

    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  function closePdfPreview() {
    const modal = document.getElementById("pdfPreviewModal");
    const iframe = document.getElementById("pdfPreviewIframe");
    if (modal) modal.classList.add("hidden");
    if (iframe) iframe.src = "about:blank";
    if (currentPreviewBlobUrl) {
      URL.revokeObjectURL(currentPreviewBlobUrl);
      currentPreviewBlobUrl = null;
    }
    currentPreviewDoc = null;
  }

  function downloadCurrentPreviewPdf() {
    if (currentPreviewDoc && currentPreviewFileName) {
      currentPreviewDoc.save(currentPreviewFileName);
    } else if (currentPreviewBlobUrl) {
      const a = document.createElement("a");
      a.href = currentPreviewBlobUrl;
      a.download = currentPreviewFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  function sanitizePdfText(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/[→➔➜➝]/g, "->")
      .replace(/[←]/g, "<-")
      .replace(/[—–]/g, "-")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/…/g, "...")
      .replace(/[•]/g, "*")
      .replace(/[✓✔]/g, "[V]")
      .replace(/[✗✘]/g, "[X]")
      .replace(/ℹ/g, "[i]")
      .replace(/[^\x00-\x7F]/g, " ");
  }

  function getPdfDate() {
    return new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function drawPdfHeader(doc, title, subtitle, metaInfo) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Banner Atas Navy Gelap
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 52, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("PORTAL RELASI KEBIJAKAN REFORMASI BIROKRASI", pageWidth / 2, 24, { align: "center" });

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("KEMENTERIAN PENDAYAGUNAAN APARATUR NEGARA DAN REFORMASI BIROKRASI", pageWidth / 2, 40, { align: "center" });

    // Judul & Subtitle Berada Tepat di Tengah (Bebas dari Pemotongan Sisi Kiri)
    doc.setFontSize(13.5);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizePdfText(title), pageWidth / 2, 78, { align: "center", maxWidth: pageWidth - 80 });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(sanitizePdfText(subtitle), pageWidth / 2, 94, { align: "center", maxWidth: pageWidth - 80 });
    doc.text(sanitizePdfText(metaInfo), pageWidth / 2, 108, { align: "center", maxWidth: pageWidth - 80 });
  }

  function drawPdfFooter(doc) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("Dokumen resmi Portal Relasi Reformasi Birokrasi — KemenPAN-RB", 36, pageHeight - 16);
      doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 36, pageHeight - 16, { align: "right" });
    }
  }

  // TAHAP 1: EKSPOR MATRIKS RELASI (Vektor Asli jsPDF + autoTable, Berada di Tengah, Tanpa Terpotong)
  function exportMatrixPdf() {
    const isExternal = state.activeMenu === "external";
    const fileName = isExternal
      ? "Matriks_Relasi_Eksternal_Portal_RB.pdf"
      : `Matriks_Relasi_Internal_Sasaran_${state.internalSasaranId}_Portal_RB.pdf`;

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("Pustaka jsPDF belum siap.");
      return null;
    }

    const { jsPDF } = window.jspdf;

    const title = isExternal
      ? "LAPORAN MATRIKS RELASI EKSTERNAL"
      : `LAPORAN MATRIKS RELASI INTERNAL — SASARAN ${state.internalSasaranId}`;

    const subtitle = isExternal
      ? "Orientasi: Sasaran 1 (Transformasi Digital - PEMDI) menuju Sasaran Tujuan 2, 3, 4, dan 5"
      : (Number(state.internalSasaranId) === 3
          ? "Matriks Keterkaitan Instrumen Sasaran 3: Integritas & Inovasi (Bahan paparan Kamis (30092026) (1).xlsx)"
          : (Number(state.internalSasaranId) === 4
              ? "Matriks Keterkaitan Kapabilitas Kelembagaan dan Indeks Pembanding"
              : `Relasi Kebijakan Internal pada Sasaran ${state.internalSasaranId}`));

    const totalStr = dom.pairCount ? dom.pairCount.textContent : "1.641";
    const metaInfo = `Tanggal Unduh: ${getPdfDate()} | Total Relasi Terpetakan: ${totalStr} Pasangan Indikator`;

    const tableEl = dom.matrixTableContainer ? dom.matrixTableContainer.querySelector("table") : null;
    let theadRows = [];
    let tbodyRows = [];
    let numCols = 6;

    if (tableEl) {
      theadRows = Array.from(tableEl.querySelectorAll("thead tr")).map(tr =>
        Array.from(tr.children).map(th => sanitizePdfText(th.innerText.trim()))
      );

      tbodyRows = Array.from(tableEl.querySelectorAll("tbody tr")).map((tr, rIdx, trArr) => {
        const isLastRow = rIdx === trArr.length - 1;
        return Array.from(tr.children).map((td, cIdx, tdArr) => {
          const isFirstCol = cIdx === 0;
          const isLastCol = cIdx === tdArr.length - 1;
          const rawVal = td.innerText.trim();
          const num = parseInt(rawVal, 10);
          const hasRel = !isNaN(num) && num > 0;

          let cellStyles = {};
          if (isLastRow) {
            cellStyles = {
              fontStyle: "bold",
              halign: isFirstCol ? "left" : "center",
              fillColor: isLastCol ? [219, 234, 254] : [241, 245, 249],
              textColor: isLastCol ? [30, 64, 175] : [15, 23, 42],
              fontSize: isLastCol ? 10 : 8.5
            };
          } else if (isFirstCol) {
            cellStyles = {
              fontStyle: "bold",
              halign: "left",
              textColor: [15, 23, 42],
              fontSize: 8.5
            };
          } else if (isLastCol) {
            cellStyles = {
              fontStyle: "bold",
              halign: "center",
              fillColor: [248, 250, 252],
              textColor: [15, 23, 42],
              fontSize: 8.5
            };
          } else if (hasRel) {
            cellStyles = {
              fontStyle: "bold",
              halign: "center",
              fillColor: [224, 242, 254],
              textColor: [2, 132, 199],
              fontSize: 9
            };
          } else {
            cellStyles = {
              halign: "center",
              textColor: [148, 163, 184],
              fontSize: 8.5
            };
          }

          return {
            content: sanitizePdfText(rawVal),
            styles: cellStyles
          };
        });
      });

      numCols = theadRows[0] ? theadRows[0].length : 6;
    }

    const isA3 = numCols > 7;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: isA3 ? "a3" : "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();

    drawPdfHeader(doc, title, subtitle, metaInfo);

    if (theadRows.length > 0 && tbodyRows.length > 0) {
      const firstColWidth = isA3 ? 240 : (numCols > 6 ? 200 : 250);
      const totalColWidth = isA3 ? 70 : 65;
      const remainingCols = numCols - 2;
      const maxTableWidth = isA3 ? (pageWidth - 100) : (pageWidth - 80);
      const availableDataWidth = maxTableWidth - firstColWidth - totalColWidth;
      const dataColWidth = remainingCols > 0 ? (availableDataWidth / remainingCols) : 80;

      const colStyles = {
        0: { cellWidth: firstColWidth, halign: "left" }
      };
      for (let c = 1; c < numCols - 1; c++) {
        colStyles[c] = { cellWidth: dataColWidth, halign: "center" };
      }
      colStyles[numCols - 1] = { cellWidth: totalColWidth, halign: "center", fontStyle: "bold" };

      const totalTableWidth = firstColWidth + (remainingCols * dataColWidth) + totalColWidth;
      const leftMargin = Math.max(30, (pageWidth - totalTableWidth) / 2);

      doc.autoTable({
        startY: 125,
        head: theadRows,
        body: tbodyRows,
        theme: "grid",
        tableWidth: totalTableWidth,
        margin: { left: leftMargin, right: leftMargin },
        showHead: "everyPage",
        rowPageBreak: "avoid",
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
          fontSize: numCols > 6 ? 8 : 9,
          cellPadding: 7
        },
        bodyStyles: {
          fontSize: numCols > 6 ? 7.5 : 8.5,
          cellPadding: 7,
          valign: "middle",
          lineColor: [203, 213, 225],
          lineWidth: 0.5
        },
        columnStyles: colStyles
      });

      const finalY = doc.lastAutoTable.finalY || 320;
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 116, 139);
      const fineprintText = dom.matrixFineprint ? dom.matrixFineprint.innerText.replace(/[\n\r]+/g, " ").trim() : "Angka pada sel matriks adalah jumlah indikator tujuan unik yang berelasi.";
      doc.text(sanitizePdfText(fineprintText), leftMargin, finalY + 16, { maxWidth: totalTableWidth });

      if (isExternal) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text("Rincian Distribusi Instrumen per Sasaran Tujuan:", leftMargin, finalY + 36);

        const breakdownData = [
          ["Sasaran 2 (Sistem Merit)", "17 Relasi", "Sistem Merit (SM: 17)"],
          ["Sasaran 3 (Integritas & Inovasi)", "120 Relasi", "IIIP (92), DIIIP (28)"],
          ["Sasaran 4 (Kapabilitas Kelembagaan)", "76 Relasi", "ELPPD (2), IPPN (24), KK (26), SAKIP (24)"],
          ["Sasaran 5 (Pelayanan Publik)", "1.418 Relasi", "IKK (24), IPP (818), OP (490), ZI (86)"]
        ];

        doc.autoTable({
          startY: finalY + 46,
          head: [["Sasaran Tujuan", "Total Relasi", "Daftar Instrumen & Jumlah Pasangan Indikator"]],
          body: breakdownData,
          theme: "striped",
          tableWidth: totalTableWidth,
          margin: { left: leftMargin, right: leftMargin },
          headStyles: {
            fillColor: [71, 85, 105],
            textColor: [255, 255, 255],
            fontSize: 8.5,
            fontStyle: "bold"
          },
          bodyStyles: {
            fontSize: 8.5,
            cellPadding: 6
          },
          columnStyles: {
            0: { cellWidth: 180, fontStyle: "bold" },
            1: { cellWidth: 90, halign: "center" }
          }
        });
      }
    }

    drawPdfFooter(doc);
    return { doc, fileName, title, subtitle };
  }

  // TAHAP 2: EKSPOR PETA RELASI (Layout Khusus Adaptif A3 Landscape, 100% Utuh & Terbaca Jelas)
  async function exportGraphPdf() {
    const isExternal = state.activeMenu === "external";
    let fileName = "Peta_Relasi_Portal_RB.pdf";
    if (isExternal) {
      const dst = (state.extDstSasaran && state.extDstSasaran !== "ALL") ? state.extDstSasaran : "2_5";
      fileName = `Peta_Relasi_Eksternal_Sasaran1_ke_Sasaran${dst}_Portal_RB.pdf`;
    } else {
      fileName = `Peta_Relasi_Internal_Sasaran_${state.internalSasaranId}_Portal_RB.pdf`;
    }

    // 1. Ambil data teks header
    const titleText = sanitizePdfText(dom.graphTitle ? dom.graphTitle.textContent : "PETA RELASI");
    const descText = sanitizePdfText(dom.graphDesc ? dom.graphDesc.textContent : "");
    const countText = dom.mapTotal ? dom.mapTotal.textContent : "0";
    const unitText = dom.mapUnit ? dom.mapUnit.textContent : "relasi indikator";
    const colSourceTitleText = sanitizePdfText(dom.colSourceTitle ? dom.colSourceTitle.textContent : "Indeks / Indikator Sumber");
    const colSourceCountText = sanitizePdfText(dom.colSourceCount ? dom.colSourceCount.textContent : "");
    const colDestTitleText = sanitizePdfText(dom.colDestTitle ? dom.colDestTitle.textContent : "Indeks / Indikator Pembanding");
    const colDestCountText = sanitizePdfText(dom.colDestCount ? dom.colDestCount.textContent : "");

    // 2. Hitung jumlah kartu untuk layout adaptif proporsional
    const sourceCardsCloneHtml = dom.containerSourceCards ? dom.containerSourceCards.innerHTML : "";
    const destCardsCloneHtml = dom.containerDestCards ? dom.containerDestCards.innerHTML : "";

    const srcCardsCount = dom.containerSourceCards ? dom.containerSourceCards.querySelectorAll(".diagram-card, .relation-node-card").length : 1;
    const dstCardsCount = dom.containerDestCards ? dom.containerDestCards.querySelectorAll(".diagram-card, .relation-node-card").length : 1;
    const maxCards = Math.max(srcCardsCount, dstCardsCount);

    // Pengaturan adaptif berdasarkan densitas kartu
    let colWidth = 450;
    let cardMarginBottom = 14;
    let cardPaddingY = 12;
    let cardPaddingX = 16;
    let titleFontSize = 13;
    let metaFontSize = 10.5;

    if (maxCards <= 6) {
      colWidth = 460;
      cardMarginBottom = 20;
      cardPaddingY = 16;
      cardPaddingX = 20;
      titleFontSize = 14;
      metaFontSize = 11;
    } else if (maxCards > 16) {
      colWidth = 450;
      cardMarginBottom = 10;
      cardPaddingY = 10;
      cardPaddingX = 14;
      titleFontSize = 12;
      metaFontSize = 9.5;
    }

    // 3. Buat kontainer khusus ekspor PDF (Fixed position, anti-clipping, lebar 1140px cocok 1:1 A3 Landscape)
    const exportStage = document.createElement("div");
    exportStage.id = "pdfExportGraphContainer";
    exportStage.style.cssText = "position:fixed;top:0;left:0;width:1140px;background:#ffffff;z-index:999999;box-sizing:border-box;padding:28px 36px 36px 36px;margin:0;overflow:visible;";

    exportStage.innerHTML = `
      <div style="background:#0f172a; color:#ffffff; padding:12px 20px; border-radius:6px; margin-bottom:14px; box-sizing:border-box;">
        <div style="font-size:13px; font-weight:bold; letter-spacing:0.5px;">PORTAL RELASI KEBIJAKAN REFORMASI BIROKRASI</div>
        <div style="font-size:8.5px; color:#94a3b8; margin-top:2px;">KEMENTERIAN PENDAYAGUNAAN APARATUR NEGARA DAN REFORMASI BIROKRASI</div>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; border-bottom:2px solid #e2e8f0; padding-bottom:12px; box-sizing:border-box;">
        <div style="flex:1; padding-right:20px;">
          <h1 style="font-size:18px; font-weight:800; color:#0f2e5a; margin:0 0 4px 0; line-height:1.3;">${titleText}</h1>
          <p style="font-size:11px; color:#475569; margin:0; line-height:1.45;">${descText}</p>
        </div>
        <div style="text-align:right; background:#f0f9ff; border:1px solid #bae6fd; padding:8px 14px; border-radius:6px; flex-shrink:0;">
          <div style="font-size:16px; font-weight:800; color:#0284c7;">${countText}</div>
          <div style="font-size:9px; color:#64748b; text-transform:uppercase; font-weight:600;">${unitText}</div>
          <div style="font-size:8px; color:#94a3b8; margin-top:2px;">Tanggal: ${getPdfDate()}</div>
        </div>
      </div>
      <div id="pdfViewportStage" style="position:relative; width:100%; box-sizing:border-box; background:#fafcff; border:1px solid #e2e8f0; border-radius:8px; padding:20px;">
        <svg id="pdfSvgCanvas" style="position:absolute; top:0; left:0; width:100%; pointer-events:none; z-index:25;">
          <g id="pdfSvgPathGroup"></g>
        </svg>
        <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%; position:relative; z-index:15;">
          <div style="width:${colWidth}px; flex:0 0 ${colWidth}px; display:flex; flex-direction:column;">
            <div style="padding:10px 14px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; margin-bottom:14px; font-weight:700; color:#0f2e5a; font-size:12.5px; display:flex; justify-content:space-between; align-items:center;">
              <span>${colSourceTitleText}</span>
              <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:11px; color:#475569;">${colSourceCountText}</span>
            </div>
            <div id="pdfSourceCards" style="display:flex; flex-direction:column; width:100%;">
              ${sourceCardsCloneHtml}
            </div>
          </div>
          <div style="width:${colWidth}px; flex:0 0 ${colWidth}px; display:flex; flex-direction:column;">
            <div style="padding:10px 14px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; margin-bottom:14px; font-weight:700; color:#0f2e5a; font-size:12.5px; display:flex; justify-content:space-between; align-items:center;">
              <span>${colDestTitleText}</span>
              <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:11px; color:#475569;">${colDestCountText}</span>
            </div>
            <div id="pdfDestCards" style="display:flex; flex-direction:column; width:100%;">
              ${destCardsCloneHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(exportStage);

    const pdfViewportStage = exportStage.querySelector("#pdfViewportStage");
    const pdfSvgCanvas = exportStage.querySelector("#pdfSvgCanvas");
    const pdfSvgPathGroup = exportStage.querySelector("#pdfSvgPathGroup");
    const pdfSourceCards = exportStage.querySelector("#pdfSourceCards");
    const pdfDestCards = exportStage.querySelector("#pdfDestCards");

    // Terapkan penataan kartu klon agar seragam, proporsional, dan teks terbaca sempurna
    exportStage.querySelectorAll(".diagram-card, .relation-node-card").forEach(c => {
      c.style.display = "block";
      c.style.width = "100%";
      c.style.background = "#ffffff";
      c.style.boxShadow = "0 1px 4px rgba(15,23,42,0.06)";
      c.style.opacity = "1";
      c.style.visibility = "visible";
      c.style.boxSizing = "border-box";
      c.style.marginBottom = `${cardMarginBottom}px`;
      c.style.padding = `${cardPaddingY}px ${cardPaddingX}px`;
      c.style.borderRadius = "8px";
      c.style.position = "relative";
      c.style.border = "1px solid #cbd5e1";

      if (c.classList.contains("card-source") || c.dataset.srcgroup || c.dataset.inst === "PEMDI") {
        c.style.borderLeft = "5px solid #0284c7";
      } else {
        c.style.borderLeft = "5px solid #0f766e";
      }

      const titleEl = c.querySelector(".card-title, .node-title");
      if (titleEl) {
        titleEl.style.fontSize = `${titleFontSize}px`;
        titleEl.style.lineHeight = "1.4";
        titleEl.style.fontWeight = "700";
        titleEl.style.color = "#0f172a";
        titleEl.style.wordBreak = "break-word";
      }

      const metaEl = c.querySelector(".card-inst-tag, .node-kicker");
      if (metaEl) {
        metaEl.style.fontSize = `${metaFontSize}px`;
        metaEl.style.fontWeight = "600";
      }

      const countEl = c.querySelector(".card-rel-count, .node-count");
      if (countEl) {
        countEl.style.fontSize = `${metaFontSize}px`;
        countEl.style.fontWeight = "600";
        countEl.style.color = "#475569";
      }
    });

    // Sesuaikan pin koneksi pada kartu
    const pinMap = new Map();
    exportStage.querySelectorAll(".connection-pin").forEach(pin => {
      pin.style.display = "block";
      pin.style.visibility = "visible";
      pin.style.position = "absolute";
      pin.style.top = "50%";
      pin.style.transform = "translateY(-50%)";
      pin.style.width = "12px";
      pin.style.height = "12px";
      pin.style.borderRadius = "50%";
      pin.style.border = "2px solid #ffffff";
      pin.style.zIndex = "30";

      if (pin.id && pin.id.startsWith("pin_src_")) {
        pin.style.right = "-6px";
        pin.style.background = "#0284c7";
      } else {
        pin.style.left = "-6px";
        pin.style.background = "#0f766e";
      }

      if (pin.id) {
        pinMap.set(pin.id, pin);
      }
    });

    // Hitung tinggi natural diagram berdasarkan konten kolom
    const leftH = pdfSourceCards ? pdfSourceCards.scrollHeight : 350;
    const rightH = pdfDestCards ? pdfDestCards.scrollHeight : 350;
    const totalDiagramH = Math.max(leftH, rightH, 380) + 50;

    pdfViewportStage.style.height = `${totalDiagramH}px`;
    pdfSvgCanvas.style.height = `${totalDiagramH}px`;
    pdfSvgCanvas.style.width = "100%";
    pdfSvgCanvas.setAttribute("height", String(totalDiagramH));
    pdfSvgCanvas.setAttribute("width", "1068");
    pdfSvgCanvas.setAttribute("viewBox", `0 0 1068 ${totalDiagramH}`);

    // Beri waktu browser menata posisi koordinat kartu
    await new Promise(r => setTimeout(r, 80));

    // Gambar garis koneksi Bezier menghubungkan pin kartu klon via pinMap (Bebas dari error selector CSS pada ID dengan titik)
    if (pdfSvgCanvas && pdfSvgPathGroup) {
      pdfSvgPathGroup.innerHTML = "";
      const svgRect = pdfSvgCanvas.getBoundingClientRect();
      const pathsHtml = [];

      if (isExternal) {
        const pinSrc = pinMap.get("pin_src_PEMDI");
        const listToRender = currentExternalInstList || [];
        listToRender.forEach((inst) => {
          const pinDst = pinMap.get(`pin_dst_${inst.code}`);
          if (!pinSrc || !pinDst) return;

          const sRect = pinSrc.getBoundingClientRect();
          const dRect = pinDst.getBoundingClientRect();
          const x1 = sRect.left + sRect.width / 2 - svgRect.left;
          const y1 = sRect.top + sRect.height / 2 - svgRect.top;
          const x2 = dRect.left + dRect.width / 2 - svgRect.left;
          const y2 = dRect.top + dRect.height / 2 - svgRect.top;

          const dx = Math.max(40, (x2 - x1) * 0.45);
          const arrowTipX = x2 - 2;
          const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${arrowTipX} ${y2}`;

          pathsHtml.push(`
            <path d="${d}" stroke="#0f766e" stroke-width="2.6" fill="none" stroke-opacity="0.88" />
            <polygon points="${arrowTipX},${y2} ${arrowTipX - 8},${y2 - 4.5} ${arrowTipX - 8},${y2 + 4.5}" fill="#0f766e" fill-opacity="0.95" />
          `);
        });
      } else {
        const pairsToDraw = currentActivePairs || [];
        pairsToDraw.forEach((p) => {
          const pinSrc = pinMap.get(`pin_src_${p.source}`);
          const pinDst = pinMap.get(`pin_dst_${p.dest}`);
          if (!pinSrc || !pinDst) return;

          const sRect = pinSrc.getBoundingClientRect();
          const dRect = pinDst.getBoundingClientRect();
          const x1 = sRect.left + sRect.width / 2 - svgRect.left;
          const y1 = sRect.top + sRect.height / 2 - svgRect.top;
          const x2 = dRect.left + dRect.width / 2 - svgRect.left;
          const y2 = dRect.top + dRect.height / 2 - svgRect.top;

          const dx = Math.max(35, (x2 - x1) * 0.45);
          const arrowTipX = x2 - 2;
          const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${arrowTipX} ${y2}`;

          pathsHtml.push(`
            <path d="${d}" stroke="#0284c7" stroke-width="2.2" fill="none" stroke-opacity="0.85" />
            <polygon points="${arrowTipX},${y2} ${arrowTipX - 8},${y2 - 4.5} ${arrowTipX - 8},${y2 + 4.5}" fill="#0284c7" fill-opacity="0.95" />
          `);
        });
      }

      pdfSvgPathGroup.innerHTML = pathsHtml.join("");
    }

    await new Promise(r => setTimeout(r, 60));

    // Catat batas vertikal kartu relatif terhadap container untuk pemotongan halaman yang bersih
    const stageRect = exportStage.getBoundingClientRect();
    const cardBounds = Array.from(exportStage.querySelectorAll(".diagram-card, .relation-node-card")).map(card => {
      const cRect = card.getBoundingClientRect();
      return {
        top: (cRect.top - stageRect.top),
        bottom: (cRect.bottom - stageRect.top)
      };
    });

    // 4. Render ke kanvas menggunakan html2canvas
    window.scrollTo(0, 0);
    const stageH = Math.max(exportStage.scrollHeight, exportStage.offsetHeight, 600);
    const stageW = 1140;

    // html2pdf.bundle.min.js mengemas html2canvas secara internal, bukan sebagai
    // window.html2canvas. Gunakan Worker.toCanvas() dari bundle lokal agar
    // ekspor tetap bekerja tanpa CDN, termasuk melalui file://.
    let canvas = null;
    const renderOptions = {
      scale: 1.5,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: stageW,
      height: stageH,
      windowWidth: stageW,
      windowHeight: stageH,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0
    };

    try {
      if (typeof window.html2canvas === "function") {
        canvas = await window.html2canvas(exportStage, renderOptions);
      } else if (typeof window.html2pdf === "function") {
        const worker = window.html2pdf()
          .set({ html2canvas: renderOptions, pagebreak: { mode: [] } })
          .from(exportStage);
        await worker.toCanvas();
        canvas = await worker.get("canvas");
      } else {
        throw new Error("Pustaka html2pdf/html2canvas tidak dimuat. Periksa vendor/html2pdf.bundle.min.js.");
      }
      if (!canvas || !canvas.width || !canvas.height) {
        throw new Error("Hasil rendering kanvas kosong.");
      }
    } catch (renderError) {
      console.error("Rendering Peta Relasi ke PDF gagal:", {
        error: renderError,
        stageWidth: stageW,
        stageHeight: stageH,
        html2canvasAvailable: typeof window.html2canvas === "function",
        html2pdfAvailable: typeof window.html2pdf === "function"
      });
      throw new Error(`Tidak dapat merender diagram PDF: ${renderError.message || renderError}`);
    } finally {
      // Selalu bersihkan kontainer sementara, termasuk saat terjadi error.
      if (exportStage.parentNode) exportStage.parentNode.removeChild(exportStage);
    }

    // 5. Susun dokumen jsPDF format A3 Landscape (1190.55 pt x 841.89 pt)
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a3" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginX = 36;
    const marginY = 32;
    const maxW = pageWidth - marginX * 2; // 1118.55 pt
    const maxH = pageHeight - marginY * 2 - 28; // 749.89 pt

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const ptPerCanvasPx = maxW / canvasW;
    const maxPageCanvasH = maxH / ptPerCanvasPx;

    if (canvasH <= maxPageCanvasH) {
      // 1 Halaman Utuh
      const renderH = Math.max(20, canvasH * ptPerCanvasPx);
      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      doc.addImage(imgData, "JPEG", marginX, marginY, maxW, renderH);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text("Dokumen resmi Portal Relasi Reformasi Birokrasi — KemenPAN-RB", marginX, pageHeight - 16);
      doc.text("Halaman 1 dari 1 (Format Eksekutif A3 Landscape)", pageWidth - marginX, pageHeight - 16, { align: "right" });
    } else {
      // Pembagian Halaman Cerdas (Menghindari pemotongan di tengah kartu)
      let currentCanvasY = 0;
      const slices = [];
      const totalCanvasH = canvasH;

      while (currentCanvasY < totalCanvasH) {
        let targetCutCanvasY = currentCanvasY + maxPageCanvasH;

        if (targetCutCanvasY < totalCanvasH) {
          for (const cb of cardBounds) {
            const cardTopCanvas = cb.top * 1.5;
            const cardBottomCanvas = cb.bottom * 1.5;
            if (targetCutCanvasY > cardTopCanvas && targetCutCanvasY < cardBottomCanvas) {
              targetCutCanvasY = cardTopCanvas - 14 * 1.5;
              break;
            }
          }
        } else {
          targetCutCanvasY = totalCanvasH;
        }

        let sliceH = targetCutCanvasY - currentCanvasY;
        if (sliceH <= 50) {
          sliceH = Math.min(totalCanvasH - currentCanvasY, maxPageCanvasH);
        }

        slices.push({
          startY: currentCanvasY,
          height: Math.min(sliceH, totalCanvasH - currentCanvasY)
        });

        currentCanvasY += sliceH;
      }

      const totalPages = slices.length;
      slices.forEach((sl, idx) => {
        if (idx > 0) {
          doc.addPage("a3", "landscape");
        }

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvasW;
        sliceCanvas.height = sl.height;
        const sliceCtx = sliceCanvas.getContext("2d");
        sliceCtx.drawImage(
          canvas,
          0, sl.startY, canvasW, sl.height,
          0, 0, canvasW, sl.height
        );

        const sliceRenderH = Math.max(20, sl.height * ptPerCanvasPx);
        const sliceImgData = sliceCanvas.toDataURL("image/jpeg", 0.98);
        doc.addImage(sliceImgData, "JPEG", marginX, marginY, maxW, sliceRenderH);

        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(148, 163, 184);
        doc.text("Dokumen resmi Portal Relasi Reformasi Birokrasi — KemenPAN-RB", marginX, pageHeight - 16);
        doc.text(`Halaman ${idx + 1} dari ${totalPages} (Format Eksekutif A3 Landscape)`, pageWidth - marginX, pageHeight - 16, { align: "right" });
      });
    }

    return { doc, fileName, title: titleText, subtitle: descText };
  }

  // TAHAP 3: EKSPOR DAFTAR RELASI (Vektor Asli jsPDF + autoTable, 4 Kolom Bersih, Nama Lengkap Indeks Dinamis)
  function exportListPdf() {
    const isExternal = state.activeMenu === "external";
    let fileName = "Daftar_Relasi_Portal_RB.pdf";

    // 1. Tentukan Nama Lengkap Indeks Sumber dan Pembanding Secara Dinamis
    let srcCode = "PEMDI";
    let dstCode = state.dest || (state.extDstSasaran && state.extDstSasaran !== "ALL" ? `Sasaran${state.extDstSasaran}` : "Semua");

    if (!isExternal) {
      srcCode = state.source || (Number(state.internalSasaranId) === 3 ? "IIIP" : "KK");
      dstCode = state.chosenInst || state.dest || (Number(state.internalSasaranId) === 3 ? "DIIIP" : "IndeksPembanding");
    }

    const srcFullName = getFullInstrumentName(srcCode);
    const dstFullName = getFullInstrumentName(dstCode);

    let title = "";
    let subtitle = "";

    if (isExternal) {
      fileName = `Daftar_Relasi_Eksternal_${srcCode}_ke_${dstCode}_Portal_RB.pdf`;
      title = "DAFTAR RINCIAN RELASI EKSTERNAL";
      subtitle = `${srcFullName} (${srcCode}) -> ${dstFullName} (${dstCode})`;
    } else {
      fileName = `Daftar_Relasi_Internal_Sasaran_${state.internalSasaranId}_Portal_RB.pdf`;
      title = `DAFTAR RINCIAN RELASI INTERNAL SASARAN ${state.internalSasaranId}`;
      if (Number(state.internalSasaranId) === 3) {
        subtitle = `${srcFullName} (${srcCode}) -> ${dstFullName} (${dstCode}) (Bahan paparan Kamis (30092026) (1).xlsx)`;
      } else if (Number(state.internalSasaranId) === 4) {
        subtitle = "Kapabilitas Kelembagaan (KK) -> Indeks Pembanding Sasaran 4";
      } else if (Number(state.internalSasaranId) === 5) {
        subtitle = "Penyandingan Substansi Antar-Indeks Pelayanan Publik Sasaran 5";
      } else {
        subtitle = `${srcFullName} (${srcCode}) -> ${dstFullName} (${dstCode})`;
      }
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert("Pustaka jsPDF belum siap.");
      return null;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    const allFiltered = filteredRelations();
    const pairs = groupRelations(allFiltered);
    let itemsToExport = allFiltered;

    if (state.chosenDest) {
      const activePair = pairs.find(p => p.dest === state.chosenDest && (!state.chosenSrc || p.source === state.chosenSrc));
      if (activePair && activePair.items.length > 0) {
        itemsToExport = activePair.items;
        subtitle = `${activePair.sourceName} -> ${activePair.destName}`;
      }
    } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
      const matchedPairs = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );
      if (matchedPairs.length > 0) {
        itemsToExport = matchedPairs.flatMap(p => p.items);
      }
    }

    if (state.activeStage === "list") itemsToExport = applyListTypeFilters(itemsToExport);

    const metaInfo = `Tanggal Unduh: ${getPdfDate()} | Total Relasi Terfilter: ${itemsToExport.length.toLocaleString("id-ID")} Pasangan Indikator`;

    drawPdfHeader(doc, title, subtitle, metaInfo);

    // 2. Susun 4 Kolom: No, Indikator Sumber, Indikator Pembanding, Jenis Keterkaitan (Status Rujukan dihapus)
    const rows = itemsToExport.map((r, i) => {
      const srcCodeStr = r.sourceCode ? `[Kode: ${r.sourceCode}]\n` : "";
      const srcTitle = r.sourceIndikator || r.sourceName || "";
      const srcAspek = r.sourceAspek ? `Aspek: ${r.sourceAspek}\n` : "";
      const srcInst = r.sourceInstName || (r.sourceInst ? instName(r.sourceInst) : (r.source || ""));
      const srcSas = r.sourceSasaranName || (isExternal ? "Sasaran 1 - Transformasi Digital" : `Sasaran ${state.internalSasaranId}`);

      const dstCodeStr = r.destCode ? `[Kode: ${r.destCode}]\n` : "";
      const dstTitle = r.destIndikator || r.destName || "";
      const dstAspek = r.destAspek ? `Aspek: ${r.destAspek}\n` : "";
      const dstInst = r.destInstName || (r.destInst ? instName(r.destInst) : (r.dest || ""));
      const dstSas = r.destSasaranName || (r.source_sasaran ? `Sasaran ${r.source_sasaran}` : (isExternal ? "" : `Sasaran ${state.internalSasaranId}`));

      const relType = r.relationType || r.type || r.rtype || "Mendukung";

      return [
        (i + 1).toString(),
        sanitizePdfText(`${srcTitle}\n${srcCodeStr}${srcAspek}[ ${srcInst} ]\n${srcSas}`),
        sanitizePdfText(`${dstTitle}\n${dstCodeStr}${dstAspek}[ ${dstInst} ]\n${dstSas}`),
        sanitizePdfText(relType)
      ];
    });

    // Lebar Halaman A4 Landscape = 841.89 pt. Margin Kiri 30, Kanan 30 -> Lebar Tabel Efektif = 781.89 pt
    // Distribusi 4 Kolom: No (35 pt), Sumber (320 pt), Pembanding (320 pt), Keterkaitan (106 pt)
    doc.autoTable({
      startY: 124,
      head: [["No.", "Indikator Sumber", "Indikator Pembanding", "Jenis Keterkaitan"]],
      body: rows,
      theme: "grid",
      showHead: "everyPage",
      rowPageBreak: "avoid",
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
        cellPadding: 7
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 6,
        valign: "top",
        lineColor: [226, 232, 240],
        lineWidth: 0.5
      },
      columnStyles: {
        0: { cellWidth: 35, halign: "center" },
        1: { cellWidth: 315 },
        2: { cellWidth: 315 },
        3: { cellWidth: 106, halign: "center", fontStyle: "bold", textColor: [2, 132, 199] }
      },
      didDrawPage: function(data) {
        if (data.pageNumber > 1) {
          doc.setFontSize(8);
          doc.setTextColor(100);
          doc.text("Daftar Rincian Relasi Indikator — Portal Relasi Reformasi Birokrasi", 30, 22);
          doc.setDrawColor(203, 213, 225);
          doc.line(30, 26, doc.internal.pageSize.getWidth() - 30, 26);
        }
      },
      margin: { top: 38, bottom: 28, left: 30, right: 30 }
    });

    drawPdfFooter(doc);
    return { doc, fileName, title, subtitle };
  }

  // FUNGSI PENGHUBUNG ALUR: KLIK DOWNLOAD -> GENERATE PDF -> PREVIEW PDF -> DOWNLOAD/TUTUP
  async function exportStageToPdf(stageName) {
    let btn = null;
    if (stageName === "matrix") {
      btn = dom.btnExportPdfMatrix;
    } else if (stageName === "graph") {
      btn = dom.btnExportPdfGraph;
    } else if (stageName === "list") {
      btn = dom.btnExportPdfList;
    }

    const originalHtml = btn ? btn.innerHTML : "";
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = "<span>⏳ Menyiapkan Preview PDF...</span>";
    }

    try {
      let pdfResult = null;
      if (stageName === "matrix") {
        pdfResult = exportMatrixPdf();
      } else if (stageName === "graph") {
        pdfResult = await exportGraphPdf();
      } else if (stageName === "list") {
        pdfResult = exportListPdf();
      }

      if (pdfResult && pdfResult.doc) {
        openPdfPreview(pdfResult);
      } else {
        alert("Gagal memproses dokumen PDF.");
      }
    } catch (err) {
      console.error(`Gagal membuat preview PDF tahap ${stageName}:`, err);
      alert(`Terjadi kesalahan saat memproses dokumen PDF: ${err.message || err}`);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    }
  }

  function fallbackExportPdf(stageName) {
    if (stageName === "matrix") {
      exportMatrixPdf();
    } else if (stageName === "graph") {
      exportGraphPdf();
    } else if (stageName === "list") {
      exportListPdf();
    }
  }

  // 15. Event Listeners
  function initEvents() {
    // Menu Sidebar
    dom.menuInternal.onclick = () => setMenu("internal");
    dom.menuExternal.onclick = () => setMenu("external");

    // Dropdown Sasaran Internal
    if (dom.selectInternalSasaran) {
      dom.selectInternalSasaran.onchange = e => {
        state.listTypeFilters = [];
        state.internalSasaranId = Number(e.target.value);
        state.s3SelectedIndicator = "";
        state.s3SelectedSurveyQuestion = "";
        state.s3GraphPickedIndicator = false;
        state.source = state.internalSasaranId === 4 ? "KK" : (state.internalSasaranId === 5 ? "IPP" : "IIIP");
        state.component = "";
        state.dest = "";
        state.rtype = "";
        state.search = "";
        state.chosenSrc = "";
        state.chosenInst = "";
        state.chosenDest = "";
        populateFilters();
        setStage("matrix");
      };
    }

    // Dropdown Sasaran Sumber Eksternal
    if (dom.selectExtSourceSasaran) {
      dom.selectExtSourceSasaran.onchange = () => {
        state.extSrcSasaran = 1;
        state.source = "PEMDI";
        populateFilters();
      };
    }

    // Dropdown Sasaran Tujuan Eksternal
    if (dom.selectExtDestSasaran) {
      dom.selectExtDestSasaran.onchange = e => {
        const val = e.target.value;
        state.extDstSasaran = val === "ALL" ? "ALL" : Number(val);
        if (state.extDstSasaran === "ALL") {
          state.extDirection = "ALL";
        } else {
          state.extDirection = `1_${state.extDstSasaran}`;
        }
        state.source = "PEMDI";
        state.dest = "";
        state.component = "";
        state.chosenSrc = "";
        state.chosenInst = "";
        state.chosenDest = "";
        state.focusRelation = null;
        populateFilters();
        if (state.activeStage === "graph") {
          renderStageGraph();
        } else if (state.activeStage === "list") {
          renderStageList();
        } else {
          renderStageMatrix();
        }
      };
    }

    // Filter Controls
    dom.selectSource.onchange = e => {
      if (state.activeMenu === "internal" && Number(state.internalSasaranId) === 3) {
        state.s3SelectedIndicator = "";
        state.s3SelectedSurveyQuestion = "";
      }
      state.source = e.target.value;
      state.component = "";
      state.dest = "";
      state.rtype = "";
      state.chosenSrc = "";
      state.chosenInst = "";
      state.chosenDest = "";
      populateFilters();
      setStage("matrix");
    };

    dom.selectComponent.onchange = e => {
      state.component = e.target.value;
      if (state.activeMenu === "internal" && Number(state.internalSasaranId) === 3) {
        if (state.source === "DIIIP" ||
            (state.source === "ALL" && state.component.startsWith("SS3-DIIIP"))) {
          state.s3SelectedIndicator = state.component;
          state.s3GraphPickedIndicator = false;
          state.s3SelectedSurveyQuestion = "";
        } else {
          state.s3SelectedSurveyQuestion = state.component;
          state.s3GraphPickedIndicator = false;
          state.s3SelectedIndicator = "";
        }
      }
      setStage("matrix");
    };

    dom.selectDestination.onchange = e => {
      state.dest = e.target.value;
      setStage("matrix");
    };

    dom.selectRelationType.onchange = e => {
      state.rtype = e.target.value;
      setStage("matrix");
    };

    dom.inputSearchFree.oninput = e => {
      state.search = e.target.value;
      if (state.activeStage === "matrix") {
        renderStageMatrix();
      } else if (state.activeStage === "graph") {
        renderStageGraph();
      } else {
        renderStageList();
      }
    };

    dom.btnResetFilters.onclick = () => {
      state.listTypeFilters = [];
      state.s3SelectedIndicator = "";
      state.s3SelectedSurveyQuestion = "";
      state.s3GraphPickedIndicator = false;
      state.component = "";
      state.dest = "";
      state.rtype = "";
      state.search = "";
      if (state.activeMenu === "external") {
        state.extDirection = "ALL";
        state.extSrcSasaran = 1;
        state.extDstSasaran = "ALL";
        state.source = "PEMDI";
        state.dest = "";
        if (dom.selectExtSourceSasaran) dom.selectExtSourceSasaran.value = "1";
        if (dom.selectExtDestSasaran) dom.selectExtDestSasaran.value = "ALL";
      } else {
        state.source = state.internalSasaranId === 4 ? "KK" : (state.internalSasaranId === 5 ? "IPP" : "IIIP");
      }
      dom.inputSearchFree.value = "";
      populateFilters();
      setStage("matrix");
    };

    if (dom.btnEmptyReset) {
      dom.btnEmptyReset.onclick = () => {
        state.listTypeFilters = [];
        state.s3SelectedIndicator = "";
        state.s3SelectedSurveyQuestion = "";
        state.s3GraphPickedIndicator = false;
        state.component = "";
        state.dest = "";
        state.rtype = "";
        state.search = "";
        if (state.activeMenu === "external") {
          state.extDirection = "ALL";
          state.extSrcSasaran = 1;
          state.extDstSasaran = "ALL";
          state.source = "PEMDI";
          state.dest = "";
          if (dom.selectExtSourceSasaran) dom.selectExtSourceSasaran.value = "1";
          if (dom.selectExtDestSasaran) dom.selectExtDestSasaran.value = "ALL";
        } else {
          state.source = state.internalSasaranId === 4 ? "KK" : (state.internalSasaranId === 5 ? "IPP" : "IIIP");
        }
        dom.inputSearchFree.value = "";
        populateFilters();
        setStage("matrix");
      };
    }

    // Stepper Button Clicks
    dom.step1Btn.onclick = () => setStage("matrix");
    dom.step2Btn.onclick = () => {
      const pairs = groupRelations(filteredRelations());
      if (pairs.length > 0 || state.chosenSrc || state.activeStage === "graph" || state.activeStage === "list") {
        setStage("graph");
      }
    };
    dom.step3Btn.onclick = () => {
      const pairs = groupRelations(filteredRelations());
      if (pairs.length > 0 || state.chosenSrc || state.activeStage === "graph" || state.activeStage === "list") {
        setStage("list");
      }
    };

    // Global Back Button
    dom.btnGlobalBack.onclick = () => {
      if (state.activeStage === "list") {
        setStage("graph");
      } else if (state.activeStage === "graph") {
        setStage("matrix");
      }
    };

    // Stage Back Buttons
    dom.btnBackToMatrixFromGraph.onclick = () => setStage("matrix");
    dom.btnGoToListFromGraph.onclick = () => {
      state.chosenDest = "";
      setStage("list");
    };
    dom.btnBackToGraphFromList.onclick = () => setStage("graph");
    dom.btnBackToMatrixFromList.onclick = () => setStage("matrix");

    // Ekspor CSV
    dom.btnExportCsv.onclick = exportFilteredCsv;

    // Ekspor PDF (Tahap 1: Matriks, Tahap 2: Peta, Tahap 3: Daftar)
    if (dom.btnExportPdfMatrix) {
      dom.btnExportPdfMatrix.onclick = () => exportStageToPdf("matrix");
    }
    if (dom.btnExportPdfGraph) {
      dom.btnExportPdfGraph.onclick = () => exportStageToPdf("graph");
    }
    if (dom.btnExportPdfList) {
      dom.btnExportPdfList.onclick = () => exportStageToPdf("list");
    }

    // Modal Preview PDF (Download / Tutup)
    const btnPdfPreviewClose = document.getElementById("btnPdfPreviewClose");
    const btnPdfPreviewDownload = document.getElementById("btnPdfPreviewDownload");
    const pdfPreviewModal = document.getElementById("pdfPreviewModal");

    if (btnPdfPreviewClose) {
      btnPdfPreviewClose.onclick = closePdfPreview;
    }
    if (btnPdfPreviewDownload) {
      btnPdfPreviewDownload.onclick = downloadCurrentPreviewPdf;
    }
    if (pdfPreviewModal) {
      pdfPreviewModal.onclick = e => {
        if (e.target === pdfPreviewModal) {
          closePdfPreview();
        }
      };
    }
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closePdfPreview();
      }
    });

    // Modal Arsitektur & Metadata
    if (dom.btnOpenArchitectureModal) {
      dom.btnOpenArchitectureModal.onclick = () => {
        dom.modalArchitecture.classList.add("active");
      };
    }
    dom.btnCloseModal.onclick = () => {
      dom.modalArchitecture.classList.remove("active");
    };
    dom.btnDismissModal.onclick = () => {
      dom.modalArchitecture.classList.remove("active");
    };
    dom.modalArchitecture.onclick = e => {
      if (e.target === dom.modalArchitecture) {
        dom.modalArchitecture.classList.remove("active");
      }
    };

    // Mode Tampilan Garis Peta Relasi (Fokus Bersih vs Semua Garis)
    if (dom.btnGraphModeFocus) {
      dom.btnGraphModeFocus.onclick = () => {
        state.graphMode = "focus";
        dom.btnGraphModeFocus.classList.add("active");
        if (dom.btnGraphModeAll) dom.btnGraphModeAll.classList.remove("active");
        drawCurves(currentActivePairs);
      };
    }
    if (dom.btnGraphModeAll) {
      dom.btnGraphModeAll.onclick = () => {
        state.graphMode = "all";
        dom.btnGraphModeAll.classList.add("active");
        if (dom.btnGraphModeFocus) dom.btnGraphModeFocus.classList.remove("active");
        drawCurves(currentActivePairs);
      };
    }

    if (dom.diagramViewport) {
      dom.diagramViewport.addEventListener("scroll", () => {
        if (state.activeStage === "graph") {
          if (state.activeMenu === "external") {
            drawExternalMacroCurves(currentExternalInstList);
          } else {
            drawCurves(currentActivePairs);
          }
        }
      }, { passive: true });
    }

    // Re-draw diagram lines on window resize
    window.addEventListener("resize", () => {
      if (state.activeStage === "graph") {
        renderStageGraph();
      }
    });
    // Ekspos ke window untuk inspeksi konsol dan automated test
    window.__portalRB = {
      state,
      dom,
      renderStageMatrix,
      renderStageGraph,
      drawCurves,
      groupRelations,
      filteredRelations,
      applyListTypeFilters,
      setStage,
      exportGraphPdf,
      exportMatrixPdf,
      exportListPdf,
      exportStageToPdf
    };
  }

  // 15. Inisialisasi Aplikasi Saat Halaman Dimuat
  function initApp() {
    initEvents();
    populateFilters();
    setStage("matrix");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
