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
  const revisiData = window.RB_DATA || null;
  const extLatest = window.RB_EXTERNAL_LATEST || null;

  // Utility Pembersihan Nomor & Kode Teknis untuk Tampilan UI
  function cleanLabel(text) {
    if (!text || typeof text !== "string") return "";
    let s = text.trim();
    // Hilangkan prefiks ID teknis jika ada, contoh: "SS4-IPPN.1.c.4 — " atau "SS4-KK.KP.3.1: "
    s = s.replace(/^SS\d+-[A-Za-z0-9_.]+\s*[—:\-]\s*/i, "");
    // Hilangkan prefiks penomoran struktural teknis berulang
    let prev = "";
    while (prev !== s) {
      prev = s;
      s = s.replace(/^(?:SS\d+\.|P\d+\.|\d+(?:\.[a-zA-Z0-9]+)*\.?|\([0-9a-zA-Z]+\)|[a-zA-Z]\.)\s+/, "").trim();
    }
    // Hilangkan sufiks bobot persentase jika ada, contoh: "(Bobot 15%)" atau "(Bobot 5%)"
    s = s.replace(/\s*\(\s*Bobot\s*\d+%\s*\)/gi, "").trim();
    return s;
  }
  window.RB_UTILS = Object.assign(window.RB_UTILS || {}, { cleanLabel });

  // Konfigurasi Tunggal Struktur Indeks Sasaran 4 (Sesuai Struktur Asli Excel)

  const S4_MACRO_INSTRUMENTS = [
    { code: "IPPN", name: "Indeks Perencanaan Pembangunan Nasional", color: "#0284c7" },
    { code: "CKKP", name: "Capaian Kontribusi Kinerja Pembangunan", color: "#16a34a" },
    { code: "SPIP", name: "Sistem Pengendalian Intern Pemerintah", color: "#ea580c" },
    { code: "SAKIP", name: "Sistem Akuntabilitas Kinerja Instansi Pemerintah", color: "#9333ea" },
    { code: "ELPPD", name: "Evaluasi Laporan Penyelenggaraan Pemda", color: "#db2777" },
    { code: "IKPA", name: "Indikator Kinerja Pelaksanaan Anggaran", color: "#0d9488" },
    { code: "IPA", name: "Indeks Pengelolaan Aset", color: "#2563eb" }
  ];

  const definitionHtml = (value, esc) => {
    const definition = String(value || "").trim();
    const text = definition && definition !== "-" ? esc(definition) : "Belum tersedia pada spreadsheet.";
    return `<div class="rincian-isi-penjelasan"><span class="rincian-penjelasan-label">Definisi Operasional</span>${text}</div>`;
  };
  const dataDefinitionHtml = (d, esc) => definitionHtml(
    [d.definisi_operasional, d.isi_penjelasan].find(value => value && String(value).trim() !== "-"),
    esc
  );

  const SASARAN4_CONFIG = {
    KK: {
      name: "Kapabilitas Kelembagaan (KK)",
      aspekLabel: "Aspek",
      getAspek: d => d.aspek,
      indikatorLabel: "Indikator",
      getIndikator: d => d.indikator,
      jenisButir: "Pernyataan",
      getNamaButir: d => d.pernyataan,
      getPenjelasanHtml: (d, esc) => definitionHtml(d.definisi_operasional, esc)
    },
    IPPN: {
      name: "Indeks Perencanaan Pembangunan Nasional (IPPN)",
      aspekLabel: "Indikator",
      getAspek: d => d.indikator,
      indikatorLabel: "",
      getIndikator: () => "",
      jenisButir: "Sub-Indikator",
      getNamaButir: d => d.sub_indikator,
      getPenjelasanHtml: (d, esc) => {
        let html = "";
        html += dataDefinitionHtml(d, esc);
        if (d.status_penilaian && d.status_penilaian !== "-") {
          html += `<div class="rincian-status-tag"><span class="status-tag-label">Status Penilaian:</span> <span class="status-tag-val">${esc(d.status_penilaian)}</span></div>`;
        }
        return html;
      }
    },
    CKKP: {
      name: "Capaian Kontribusi Kinerja Pembangunan (CKKP)",
      aspekLabel: "Kategori",
      getAspek: d => cleanLabel((d && (d.kategori || d.kelompok_penilaian || d.kelompok_indikator)) || ""),
      indikatorLabel: "Indikator",
      getIndikator: d => cleanLabel((d && d.indikator) || ""),
      jenisButir: "Cakupan",
      getNamaButir: d => cleanLabel((d && (d.cakupan || d.komponen_penilaian || d.butir_penilaian)) || ""),
      getPenjelasanHtml: (d, esc) => dataDefinitionHtml(d, esc)
    },
    SPIP: {
      name: "Sistem Pengendalian Intern Pemerintah (SPIP)",
      aspekLabel: "Komponen",
      getAspek: d => d.komponen,
      indikatorLabel: "Unsur",
      getIndikator: d => d.unsur,
      jenisButir: "Sub-Uraian",
      getNamaButir: d => d.sub_uraian,
      getPenjelasanHtml: (d, esc) => dataDefinitionHtml(d, esc)
    },
    SAKIP: {
      name: "Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP)",
      aspekLabel: "Komponen",
      getAspek: d => (d && d.komponen) ? d.komponen : "",
      indikatorLabel: "Sub-Komponen",
      getIndikator: d => (d && d.sub_komponen) ? d.sub_komponen : "",
      jenisButir: "Kriteria Evaluasi",
      getNamaButir: d => (d && (d.kriteria || d.indikator || d.sub_komponen)) ? (d.kriteria || d.indikator || d.sub_komponen) : "",
      getPenjelasanHtml: (d, esc) => {
        if (!d) return "";
        if (d.definisi_operasional) {
          return definitionHtml(d.definisi_operasional, esc);
        }
        const list = Array.isArray(d.kriteria_evaluasi) ? d.kriteria_evaluasi : [];
        if (list.length === 0) return "";
        return `
          <div class="rincian-kriteria-block">
            <span class="rincian-kriteria-header">Kriteria Evaluasi:</span>
            <ul class="rincian-kriteria-list">
              ${list.map(k => `<li>${esc(cleanLabel(k))}</li>`).join("")}
            </ul>
          </div>
        `;
      }
    },
    ELPPD: {
      name: "Evaluasi Laporan Penyelenggaraan Pemerintahan Daerah (ELPPD)",
      aspekLabel: "Aspek",
      getAspek: d => d.aspek || d.kelompok_penilaian,
      indikatorLabel: "Sub-Aspek",
      getIndikator: d => d.sub_aspek,
      jenisButir: "Indikator",
      getNamaButir: d => d.indikator,
      getPenjelasanHtml: (d, esc) => definitionHtml(d.definisi_operasional, esc)
    },
    IKPA: {
      name: "Indikator Kinerja Pelaksanaan Anggaran (IKPA)",
      aspekLabel: "Aspek",
      getAspek: d => d.aspek,
      indikatorLabel: "Indikator",
      getIndikator: d => d.indikator,
      jenisButir: "Pernyataan",
      getNamaButir: d => d.pernyataan,
      getPenjelasanHtml: (d, esc) => definitionHtml(d.definisi_operasional, esc)
    },
    IPA: {
      name: "Indeks Pengelolaan Aset (IPA)",
      aspekLabel: "Sasaran Strategis",
      getAspek: d => d.sasaran_strategis,
      indikatorLabel: "Parameter",
      getIndikator: d => d.parameter,
      jenisButir: d => (d.sub_parameter && d.sub_parameter !== "-" && d.sub_parameter.trim() !== "") ? "Sub-Parameter" : "",
      getNamaButir: d => d.sub_parameter,
      getPenjelasanHtml: (d, esc) => dataDefinitionHtml(d, esc)
    }
  };

  // Konfigurasi Standar Struktur Seluruh Indeks (Mendukung Sasaran 1 PEMDI dan Seluruh Sasaran Mitra)
  const INSTRUMENT_CONFIG = {
    // === SASARAN 1 (Pemerintah Digital) ===
    PEMDI: {
      name: "Pemerintah Digital (PEMDI)",
      aspekLabel: "Domain / Aspek",
      getAspek: d => (d && d.aspek) ? cleanLabel(d.aspek) : "Data",
      indikatorLabel: "Indikator SPBE",
      getIndikator: d => (d && d.indikator) ? cleanLabel(d.indikator) : "",
      jenisButir: "Kriteria Penilaian",
      getNamaButir: d => {
        if (!d) return "";
        return cleanLabel(d.subindikator || d.sub_indikator || d.description || "");
      },
      getPenjelasanHtml: (d, esc) => {
        let html = "";
        if (d && d.pembina && d.pembina !== "-" && d.pembina.trim() !== "") {
          html += `<div class="rincian-status-tag"><span class="status-tag-label">Instansi Pengampu:</span> <span class="status-tag-val">${esc(cleanLabel(d.pembina))}</span></div>`;
        }
        return html;
      }
    },

    // === SASARAN 2 (Sistem Merit) ===
    SM: {
      name: "Sistem Merit (SM)",
      aspekLabel: "Aspek Sistem Merit",
      getAspek: d => cleanLabel((d && d.aspek) || "Digitalisasi Manajemen ASN"),
      indikatorLabel: "Indikator",
      getIndikator: d => cleanLabel((d && d.indikator) || ""),
      jenisButir: "Sub-Indikator",
      getNamaButir: d => cleanLabel((d && (d.subindikator || d.sub_indikator || d.indikator)) || ""),
      getPenjelasanHtml: (d, esc) => {
        let html = "";
        if (d && d.pembina && d.pembina !== "-" && d.pembina.trim() !== "") {
          html += `<div class="rincian-status-tag"><span class="status-tag-label">Instansi Pembina:</span> <span class="status-tag-val">${esc(cleanLabel(d.pembina))}</span></div>`;
        }
        return html;
      }
    },

    // === SASARAN 3 (Integritas & Inovasi) ===
    DIIIP: {
      name: "Desain Indeks Inovasi Instansi Pemerintah (DIIIP)",
      aspekLabel: "Dimensi Inovasi",
      getAspek: d => cleanLabel((d && (d.aspek || d.dimensi)) || ""),
      indikatorLabel: "Indikator Inovasi",
      getIndikator: d => cleanLabel((d && d.indikator) || ""),
      jenisButir: "Sub-Indikator",
      getNamaButir: d => cleanLabel((d && (d.subindikator || d.sub_indikator || d.indikator)) || ""),
      getPenjelasanHtml: () => ""
    },
    IIIP: {
      name: "Survei Indeks Inovasi Instansi Pemerintah (IIIP)",
      aspekLabel: "Blok Survei",
      getAspek: d => cleanLabel((d && (d.aspek || d.blok)) || ""),
      indikatorLabel: "Indikator Survei",
      getIndikator: d => cleanLabel((d && d.indikator) || ""),
      jenisButir: "Pertanyaan Survei",
      getNamaButir: d => cleanLabel((d && (d.subindikator || d.sub_indikator || d.pertanyaan)) || ""),
      getPenjelasanHtml: () => ""
    },

    // === SASARAN 4 (Kapabilitas Kelembagaan & Pembanding) ===
    KK: SASARAN4_CONFIG.KK,
    IPPN: SASARAN4_CONFIG.IPPN,
    CKKP: SASARAN4_CONFIG.CKKP,
    SPIP: SASARAN4_CONFIG.SPIP,
    SAKIP: SASARAN4_CONFIG.SAKIP,
    ELPPD: SASARAN4_CONFIG.ELPPD,
    IKPA: SASARAN4_CONFIG.IKPA,
    IPA: SASARAN4_CONFIG.IPA,

    // === SASARAN 5 (Pelayanan Publik) ===
    IPP: {
      name: "Indeks Pelayanan Publik (IPP)",
      aspekLabel: "Aspek Pelayanan",
      getAspek: d => cleanLabel((d && d.aspek) || ""),
      indikatorLabel: "Indikator Pelayanan",
      getIndikator: d => cleanLabel((d && d.indikator) || ""),
      jenisButir: "Parameter Penilaian",
      getNamaButir: d => cleanLabel((d && (d.subindikator || d.sub_indikator || d.indikator)) || ""),
      getPenjelasanHtml: () => ""
    },
    OP: {
      name: "Opini Pengawasan Pelayanan Publik (Ombudsman)",
      aspekLabel: "Dimensi Penilaian",
      getAspek: d => cleanLabel((d && (d.aspek || d.dimensi)) || ""),
      indikatorLabel: "Variabel Penilaian",
      getIndikator: d => cleanLabel((d && d.indikator) || ""),
      jenisButir: "Indikator Kepatuhan",
      getNamaButir: d => cleanLabel((d && (d.subindikator || d.sub_indikator || d.indikator)) || ""),
      getPenjelasanHtml: () => ""
    },
    IKK: {
      name: "Indeks Kualitas Kebijakan (IKK)",
      aspekLabel: "Dimensi Kebijakan",
      getAspek: d => cleanLabel((d && d.aspek) || ""),
      indikatorLabel: "Indikator Kebijakan",
      getIndikator: d => cleanLabel((d && d.indikator) || ""),
      jenisButir: "Pertanyaan Evaluasi",
      getNamaButir: d => cleanLabel((d && (d.subindikator || d.sub_indikator || d.indikator)) || ""),
      getPenjelasanHtml: () => ""
    },
    ZI: {
      name: "Zona Integritas (ZI)",
      aspekLabel: "Komponen Pengungkit / Hasil",
      getAspek: d => cleanLabel((d && d.aspek) || ""),
      indikatorLabel: "Program / Sub-Komponen",
      getIndikator: d => cleanLabel((d && d.indikator) || ""),
      jenisButir: "Kriteria Penilaian",
      getNamaButir: d => cleanLabel((d && (d.subindikator || d.sub_indikator || d.indikator)) || ""),
      getPenjelasanHtml: () => ""
    }
  };

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
    appLayout: document.querySelector(".app-layout"),
    btnSidebarToggle: document.getElementById("btnSidebarToggle"),
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
    pageHeadingTitle: document.getElementById("pageHeadingTitle"),
    pageHeadingSubtitle: document.getElementById("pageHeadingSubtitle"),
    matrixTitle: document.getElementById("matrixTitle"),
    heroStatPoints: document.getElementById("heroStatPoints"),
    heroStatPointsUnit: document.getElementById("heroStatPointsUnit"),
    heroStatAspects: document.getElementById("heroStatAspects"),
    heroStatAspectsUnit: document.getElementById("heroStatAspectsUnit"),
    heroStatComparators: document.getElementById("heroStatComparators"),
    heroStatComparatorsUnit: document.getElementById("heroStatComparatorsUnit"),
    graphInstCount: document.getElementById("graphInstCount"),
    graphInstCountUnit: document.getElementById("graphInstCountUnit"),
    btnExpandGraph: document.getElementById("btnExpandGraph"),
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

  // 3.5. SVG Icons Helper Dictionary (Pixel-Perfect Executive Design)
  const ICONS = {
    building: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z"/></svg>',
    badge: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><line x1="15" y1="8" x2="17" y2="8"/><line x1="15" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>',
    folder: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>',
    layers: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    target: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    link: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
    list: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
    shield: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    medal: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>',
    users: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    gear: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
    cpu: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
    share: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    chart: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    calc: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"/></svg>',
    box: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    doc: '<svg class="inline-svg-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
  };

  function getInstrumentIcon(code) {
    if (!code) return ICONS.layers;
    const c = String(code).toUpperCase();
    if (c === "OP") return ICONS.shield;
    if (c === "IKK") return ICONS.layers;
    if (c === "ZI") return ICONS.medal;
    if (c === "IPPN") return ICONS.doc;
    if (c === "CKKP") return ICONS.chart;
    if (c === "SPIP") return ICONS.shield;
    if (c === "SAKIP") return ICONS.medal;
    if (c === "ELPPD") return ICONS.doc;
    if (c === "IKPA") return ICONS.calc;
    if (c === "IPA") return ICONS.box;
    if (c === "KK") return ICONS.building;
    if (c === "PEMDI") return ICONS.cpu;
    if (c === "SM") return ICONS.users;
    return ICONS.layers;
  }

  function getAspectIcon(name) {
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
  }

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
      // Hitung aspek, indikator, dan kelompok KK secara dinamis dari relasi Sasaran 4
      const s4Rels = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4);
      const aspectMap = new Map();
      const standardOrder = ["Ketepatan Fungsi", "Ketepatan Ukuran", "Ketepatan Proses", "Tata Kelola"];

      for (const r of s4Rels) {
        const sub = getSubstansi(r.source);
        const aspName = (sub && sub.aspek) ? sub.aspek : getKKAspect(r.source);
        const grpName = (sub && sub.indikator) ? sub.indikator : getKKGroup(r.source);

        if (!aspectMap.has(aspName)) {
          aspectMap.set(aspName, {
            id: aspName,
            name: aspName,
            inst: "KK",
            indicators: new Set(),
            groups: new Set()
          });
        }
        const aspObj = aspectMap.get(aspName);
        aspObj.indicators.add(r.source);
        if (grpName) aspObj.groups.add(grpName);
      }

      if (aspectMap.size === 0) {
        standardOrder.forEach(name => {
          aspectMap.set(name, { id: name, name, inst: "KK", indicators: new Set(), groups: new Set() });
        });
      }

      const sortedAspects = [...aspectMap.values()].sort((a, b) => {
        const idxA = standardOrder.indexOf(a.name);
        const idxB = standardOrder.indexOf(b.name);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return a.name.localeCompare(b.name, "id");
      });

      return sortedAspects.map(a => ({
        id: a.id,
        name: a.name,
        inst: a.inst,
        indikatorCount: a.indicators.size || (a.name.includes("Ukuran") || a.name.includes("Kelola") ? 5 : 7),
        groups: [...a.groups].sort((g1, g2) => g1.localeCompare(g2, "id", { numeric: true }))
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

        const meta = jk ? jk.getKlasifikasi(r.source_group, r.target_group, r.source, r.target, extDesc, pemdiDesc, subExt, subPemdi) : {
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
          sourceData: subPemdi,
          destData: subExt,
          sourceQuestion: pemdiDesc,
          destQuestion: extDesc,
          reason: meta.alasan || (pemdiDesc && extDesc ? `"${pemdiDesc}" berkaitan dengan "${extDesc}".` : "Keterkaitan operasional antar-indikator sasaran strategis."),
          recommendation: meta.rekomendasi || "Disarankan penguatan koordinasi teknis dan pemanfaatan hasil pengukuran ini untuk menyelaraskan implementasi sistem informasi sektoral dengan kerangka arsitektur Pemerintah Digital nasional.",
          refs: [`Sheet: ${r.sheet}; Sel Rujukan: ${r.reference_cell}; Sel Sumber: ${r.source_cell}`]
        });
      }
      return matched;
    }

    const sId = Number(state.internalSasaranId);

    if (sId === 4) {
      // Sasaran 4: Relasi Internal dinamis sesuai data resmi Google Sheets / Kerja Kelompok 1
      function getKKAspect(code) {
        const sub = getSubstansi(code);
        if (sub && sub.aspek) return sub.aspek;
        if (code.startsWith("SS4-KK.KF.")) return "Ketepatan Fungsi";
        if (code.startsWith("SS4-KK.KU.")) return "Ketepatan Ukuran";
        if (code.startsWith("SS4-KK.KP.")) return "Ketepatan Proses";
        if (code.startsWith("SS4-KK.TK.")) return "Tata Kelola";
        return "Lainnya";
      }

      function getKKGroup(code) {
        const sub = getSubstansi(code);
        if (sub && sub.indikator) return sub.indikator;
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

        const srcCfg = SASARAN4_CONFIG["KK"];
        const dstCfg = SASARAN4_CONFIG[dstInst];

        const srcInstName = srcCfg ? srcCfg.name : "Kapabilitas Kelembagaan (KK)";
        const dstInstName = dstCfg ? dstCfg.name : ((subDst && subDst.instrument_name) ? subDst.instrument_name : instName(dstInst));

        const srcAspek = getKKAspect(r.source);
        const dstAspek = (dstCfg && subDst) ? dstCfg.getAspek(subDst) : ((subDst && subDst.aspek) ? subDst.aspek : "");

        const rawSrcIndikator = (srcCfg && subSrc) ? srcCfg.getIndikator(subSrc) : (subSrc && subSrc.indikator ? subSrc.indikator : srcGroup);
        let rawDstIndikator = "";
        if (dstCfg && subDst) {
          rawDstIndikator = dstCfg.getIndikator(subDst) || dstCfg.getNamaButir(subDst);
        } else if (subDst) {
          rawDstIndikator = subDst.indikator || subDst.komponen || dstLabel.replace(/^SS4-[^—]+—\s*/, "");
        } else {
          rawDstIndikator = dstLabel.replace(/^SS4-[^—]+—\s*/, "");
        }

        const cleanSrcInd = cleanLabel(rawSrcIndikator);
        const cleanDstInd = cleanLabel(rawDstIndikator);

        const srcSubindikator = (srcCfg && subSrc) ? cleanLabel(srcCfg.getNamaButir(subSrc)) : "";
        const dstSubindikator = (dstCfg && subDst) ? cleanLabel(dstCfg.getNamaButir(subDst)) : "";

        const metaS4 = (jk && typeof jk.classifySasaran4 === "function")
          ? jk.classifySasaran4(srcGroup, dstInst, dstGroup, r.source, r.target, cleanSrcInd, cleanDstInd, subSrc, subDst)
          : {
            jenis: "Mendukung",
            status: "Perlu Validasi",
            alasan: `"${cleanSrcInd}" berkaitan dengan "${cleanDstInd}".`
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
          sourceName: cleanSrcInd,
          sourceAspek: srcAspek,
          sourceKelompok: srcGroup,
          sourceIndikator: cleanSrcInd,
          sourceSubindikator: srcSubindikator,
          destInst: dstInst,
          destInstName: dstInstName,
          dest: r.target,
          destName: cleanDstInd,
          destAspek: dstAspek,
          destIndikator: cleanDstInd,
          destSubindikator: dstSubindikator,
          type: metaS4.jenis,
          level: "Perlu Validasi",
          tingkat: null,
          codes: [[r.source, r.target]],
          sourceCode: r.source,
          destCode: r.target,
          sourceData: subSrc,
          destData: subDst,
          sourceQuestion: srcLabel,
          destQuestion: dstLabel,
          reason: metaS4.alasan || `"${cleanSrcInd}" berkaitan dengan "${cleanDstInd}".`,
          recommendation: metaS4.rekomendasi || (jk && jk.sasaran4Justifikasi && jk.sasaran4Justifikasi[`${r.source}_${r.target}`]?.rekomendasi) || "",
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
            ? jk.classifySasaran5(src.group, dst.group, src.inst, dst.inst, src.code, dst.code, src.question, dst.question, subSrc, subDst)
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
            sourceData: subSrc,
            destData: subDst,
            sourceQuestion: src.question,
            destQuestion: dst.question,
            reason: metaS5.alasan || (src.question && dst.question ? `"${src.question}" berkaitan dengan "${dst.question}".` : (src.question ? `"${src.question}"` : (dst.question ? `"${dst.question}"` : `Keterkaitan substantif antara ${src.group} dan ${dst.group}.`))),
            recommendation: metaS5.rekomendasi || "Disarankan koordinasi operasional berkelanjutan dan pertukaran informasi hasil evaluasi antar-pengelola instrumen pelayanan publik.",
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
          sourceData: subSrc,
          destData: subDst,
          sourceQuestion: srcName,
          destQuestion: dstName,
          reason: (jk && jk.sasaran3Justifikasi && (jk.sasaran3Justifikasi[`${srcCode}_${dstCode}`]?.alasan || jk.sasaran3Justifikasi[r.id]?.alasan)) || r.alasan || `Indikator "${srcName}" berkaitan dengan "${dstName}".`,
          recommendation: (jk && jk.sasaran3Justifikasi && (jk.sasaran3Justifikasi[`${srcCode}_${dstCode}`]?.rekomendasi || jk.sasaran3Justifikasi[r.id]?.rekomendasi)) || r.rekomendasi || "Disarankan menyelaraskan hasil evaluasi kedua indikator yang dibandingkan.",
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
        if (state.activeMenu === "internal" && Number(state.internalSasaranId) === 4) {
          if (x.sourceAspek !== state.component && x.sourceKelompok !== state.component && x.source !== state.component && x.sourceCode !== state.component) {
            return false;
          }
        } else {
          if (x.source !== state.component && (!allS3 || x.dest !== state.component)) return false;
        }
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
      const isS4 = (r.sourceSasaran === 4 && r.targetSasaran === 4);
      // Untuk Sasaran 4, setiap relasi adalah 1 pasangan unik indikator KK dan indikator pembanding (total 168)
      const key = isS4
        ? `${r.sourceCode}\u241f${r.destCode}`
        : `${r.source}\u241f${r.destInst}\u241f${r.dest}`;
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

    const isS4InternalComp = (state.activeMenu === "internal" && Number(state.internalSasaranId) === 4);
    if (isS4InternalComp) {
      const s4Comps = sourceComponents();
      const s4Relations = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4);
      const s4FilterItems = [];
      s4Comps.forEach(asp => {
        const count = s4Relations.filter(r => {
          const sub = getSubstansi(r.source);
          const aName = (sub && sub.aspek) ? sub.aspek : getKKAspect(r.source);
          return aName === asp.name;
        }).length;
        s4FilterItems.push({ value: asp.name, label: `Aspek: ${asp.name} (${count} relasi)` });
        (asp.groups || []).forEach(grp => {
          s4FilterItems.push({ value: grp, label: `  ↳ ${grp}` });
        });
      });
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
    }

    const dests = listDestinations();
    fillSelect(
      dom.selectDestination,
      dests.map(i => ({ value: i, label: `${i} — ${instName(i)}` })),
      state.dest,
      state.activeMenu === "external" ? "Semua Instrumen Tujuan" : "Semua Indeks Pembanding"
    );

    const isS4Internal = (state.activeMenu === "internal" && Number(state.internalSasaranId) === 4);
    const standardTypes = isS4Internal
      ? ["Mendukung", "Langsung", "Tidak Langsung"]
      : [
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
      const s4Count = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4).length;
      dom.logicNote.innerHTML = `<strong>Cara membaca matriks Sasaran 4:</strong> Angka menunjukkan banyaknya relasi indikator sesuai <b>${s4Count} hubungan keterkaitan resmi Sasaran 4</b> antara Kapabilitas Kelembagaan dan 7 indeks pembanding.`;
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

    dom.matrixTitle.textContent = "Matriks Relasi Internal";
    dom.matrixDesc.textContent = sId === 4
      ? "Sasaran 4 — Kapabilitas Kelembagaan"
      : "Sasaran 5 — Pelayanan Publik";

    const heroKpiGrid = dom.stageMatrix ? dom.stageMatrix.querySelector(".hero-kpi-grid") : null;
    if (sId === 4) {
      const s4Count = pairs.length;
      const s4AspectCount = comps.length;
      const s4KelompokCount = new Set(pairs.map(p => p.sourceKelompok).filter(Boolean)).size;
      const s4IndikatorCount = new Set(pairs.map(p => p.sourceCode).filter(Boolean)).size;
      const s4ComparatorCount = dests.length;

      if (heroKpiGrid) {
        heroKpiGrid.innerHTML = `
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="pairCount">${s4Count.toLocaleString("id-ID")}</strong>
              <small id="pairUnit">Hubungan Keterkaitan</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatAspects">${s4AspectCount}</strong>
              <small id="heroStatAspectsUnit">Aspek KK</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatKelompok">${s4KelompokCount}</strong>
              <small>Kelompok KK</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatIndikator">${s4IndikatorCount}</strong>
              <small>Indikator KK</small>
            </div>
          </div>
          <div class="kpi-mini-card kpi-text-only">
            <div class="kpi-info">
              <strong id="heroStatComparators">${s4ComparatorCount}</strong>
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
                <div class="matrix-row-title-wrap" style="display:flex; align-items:center; gap:6px;">
                  <span class="subrow-tree-icon" style="color:#0284c7; font-weight:700; margin-right:2px;">↳</span>
                  <span class="matrix-subrow-name">${esc(grp)}</span>
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
              <div class="matrix-aspect-header-wrap">
                <div class="matrix-aspect-info">
                  <span class="matrix-row-icon">${getAspectIcon(asp.name)}</span>
                  <span class="matrix-aspect-name">${esc(asp.name.toUpperCase())}</span>
                  <span class="badge-sub-count">${asp.indikatorCount} Indikator</span>
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
                <span>${sId === 4 ? "Aspek KK (Baris) \ Indeks Pembanding (Kolom)" : "Indikator Sumber (Baris) \ Indeks Pembanding (Kolom)"}</span>
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
    const isS4 = state.activeMenu === "internal" && Number(state.internalSasaranId) === 4;
    // Jika dipilih sel tertentu dari matriks (chosenSrc atau chosenInst terisi), langsung tampilkan Peta Detail (Screenshot 1)
    if (isS4 && (state.chosenSrc || state.chosenInst)) {
      state.s4MacroView = false;
    }
    if (isS4 && state.s4MacroView !== false) {
      renderSasaran4MindMap(allFiltered);
      return;
    }

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
            <div class="card-title" style="font-size:14px; font-weight:700; color:var(--navy-dark);">${esc(cleanLabel(src.name))}</div>
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
            <div class="card-title" style="font-size:14px; font-weight:700; color:var(--navy-dark);">${esc(cleanLabel(dst.name))}</div>
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
        const allFilteredNow = filteredRelations();
        const matchingItems = allFilteredNow.filter(r =>
          (r.dest === destGroupId || r.destCode === destGroupId) &&
          (!state.chosenSrc || r.source === state.chosenSrc || r.sourceKelompok === state.chosenSrc || r.sourceAspek === state.chosenSrc || r.sourceCode === state.chosenSrc)
        );
        state.focusItem = matchingItems.length > 0 ? matchingItems[0] : null;
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


  function renderSasaran4MindMap(allFiltered) {
    dom.stageMatrix.classList.add("hidden");
    dom.stageGraph.classList.remove("hidden");
    dom.stageList.classList.add("hidden");

    if (dom.graphToolbar) {
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
    }

    // Set KPI banner stats matching bottom-left screenshot
    const s4RelCount = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4).length;
    dom.mapTotal.textContent = allFiltered ? allFiltered.length.toString() : s4RelCount.toString();
    dom.mapUnit.textContent = "Hubungan";
    if (dom.graphInstCount) {
      dom.graphInstCount.textContent = "8";
      if (dom.graphInstCountUnit) dom.graphInstCountUnit.textContent = "Indeks";
    }
    dom.graphTitle.textContent = "Peta Relasi";
    dom.graphDesc.textContent = "Visualisasi hubungan indikator antar indeks pada Sasaran 4 — Kapabilitas Kelembagaan";

    // Hitung counts per instrumen tujuan
    const instCounts = { IPPN: 0, CKKP: 0, SPIP: 0, SAKIP: 0, ELPPD: 0, IKPA: 0, IPA: 0 };
    allFiltered.forEach(r => {
      let c = r.destInst;
      if (!c && r.destCode) c = r.destCode.split('.')[0].replace('SS4-', '');
      if (!c && r.dest) c = r.dest.split('.')[0].replace('SS4-', '');
      if (c && instCounts.hasOwnProperty(c)) {
        instCounts[c] += (r.items ? r.items.length : 1);
      }
    });

    // Render Kolom Sumber (KK)
    dom.colSourceTitle.textContent = "Indeks Sumber";
    dom.colSourceCount.textContent = "1 Indeks";
    dom.containerSourceCards.innerHTML = `
      <div class="macro-source-card" id="card_src_macro_KK" title="Indeks Sumber: Kapabilitas Kelembagaan (KK)">
        <div class="macro-source-icon-wrap">
          ${ICONS.building}
        </div>
        <div class="macro-source-code">KK</div>
        <div class="macro-source-name">Kapabilitas Kelembagaan</div>
        <div class="macro-source-sub">(Indeks Sumber)</div>
        <div class="connection-pin pin-right" id="pin_src_macro_KK"></div>
      </div>
    `;

    // Render Kolom Tujuan (7 Instrumen Pembanding)
    dom.colDestTitle.textContent = "Indeks Pembanding";
    dom.colDestCount.textContent = "7 Indeks";
    dom.containerDestCards.innerHTML = `
      <div class="macro-dst-list">
        ${S4_MACRO_INSTRUMENTS.map(inst => `
          <div class="macro-dst-card card-dst-${inst.code.toLowerCase()}"
               id="card_dst_${inst.code}"
               data-inst="${inst.code}"
               title="Klik untuk membuka rincian hubungan dengan ${inst.code} di Tahap 3">
            <div class="connection-pin pin-left" id="pin_dst_${inst.code}"></div>
            <div class="macro-dst-body">
              <span class="macro-dst-icon-box">${getInstrumentIcon(inst.code)}</span>
              <span class="macro-dst-title"><strong>${inst.code}</strong> — ${inst.name}</span>
            </div>
            <span class="macro-dst-badge">${instCounts[inst.code] || 0}</span>
          </div>
        `).join("")}
      </div>
    `;

    // Attach click and hover to destination cards
    dom.containerDestCards.querySelectorAll(".macro-dst-card").forEach(card => {
      const instCode = card.dataset.inst;
      card.onclick = () => {
        state.chosenInst = instCode;
        state.focusItem = null;
        setStage("list");
      };
      card.onmouseenter = () => {
        const path = dom.diagramSvg.querySelector(`#curve_macro_${instCode}`);
        if (path) {
          path.setAttribute("stroke-width", "4");
          path.setAttribute("stroke-opacity", "1");
        }
      };
      card.onmouseleave = () => {
        const path = dom.diagramSvg.querySelector(`#curve_macro_${instCode}`);
        if (path) {
          path.setAttribute("stroke-width", "2.5");
          path.setAttribute("stroke-opacity", "0.9");
        }
      };
    });

    // Draw curves
    requestAnimationFrame(() => {
      drawS4MacroCurves();
    });

    updateContextBanner();
  }

  function drawS4MacroCurves() {
    const svgGroup = dom.svgPathGroup;
    if (!svgGroup || !dom.diagramSvg || typeof dom.diagramSvg.getBoundingClientRect !== "function") return;

    svgGroup.innerHTML = "";
    const svgRect = dom.diagramSvg.getBoundingClientRect();
    if (!svgRect || svgRect.width === 0 || svgRect.height === 0) return;

    const pinSrc = document.getElementById("pin_src_macro_KK");
    if (!pinSrc || typeof pinSrc.getBoundingClientRect !== "function") return;
    const rectSrc = pinSrc.getBoundingClientRect();

    const x1 = rectSrc.left + rectSrc.width / 2 - svgRect.left;
    const y1 = rectSrc.top + rectSrc.height / 2 - svgRect.top;

    const pathsHtml = [];
    S4_MACRO_INSTRUMENTS.forEach(inst => {
      const pinDst = document.getElementById(`pin_dst_${inst.code}`);
      if (!pinDst || typeof pinDst.getBoundingClientRect !== "function") return;
      const rectDst = pinDst.getBoundingClientRect();

      const x2 = rectDst.left + rectDst.width / 2 - svgRect.left;
      const y2 = rectDst.top + rectDst.height / 2 - svgRect.top;

      const dx = (x2 - x1) * 0.55;
      const arrowTipX = x2 - 2;
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${arrowTipX} ${y2}`;

      pathsHtml.push(`
        <path d="${d}"
              class="relation-curve-macro"
              id="curve_macro_${inst.code}"
              data-inst="${inst.code}"
              stroke="${inst.color}"
              stroke-width="2.5"
              fill="none"
              stroke-opacity="0.9" />
        <polygon points="${arrowTipX},${y2} ${arrowTipX - 8},${y2 - 4.5} ${arrowTipX - 8},${y2 + 4.5}"
                 fill="${inst.color}"
                 fill-opacity="0.9" />
      `);
    });

    svgGroup.innerHTML = pathsHtml.join("");
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

    // Event Klik Kurva Hubungan -> Buka Detail Relasi di Tahap 3
    svgGroup.querySelectorAll(".relation-curve").forEach(curve => {
      const srcId = curve.dataset.src;
      const dstId = curve.dataset.dst;
      curve.style.cursor = "pointer";
      curve.onclick = (e) => {
        e.stopPropagation();
        state.chosenSrc = srcId;
        state.chosenDest = dstId;
        state.focusRelation = null;
        const allFilteredNow = filteredRelations();
        const matchingItems = allFilteredNow.filter(r =>
          (r.dest === dstId || r.destCode === dstId) &&
          (r.source === srcId || r.sourceKelompok === srcId || r.sourceAspek === srcId || r.sourceCode === srcId)
        );
        state.focusItem = matchingItems.length > 0 ? matchingItems[0] : null;
        setStage("list");
      };
    });
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
      "Keselarasan Perencanaan": "badge-selaras",
      "Langsung": "badge-langsung",
      "Tidak Langsung": "badge-tidak-langsung",
      "Tidak langsung": "badge-tidak-langsung"
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

    const order = ["Mendukung", "Langsung", "Tidak Langsung", "Saling Melengkapi", "Beririsan Substansi", "Potensi Tumpang Tindih", "Keselarasan Perencanaan"];
    const types = [...countByType.keys()].sort((a, b) => {
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

  // Render Kolom Penyandingan Indikator (Dinamis Berdasarkan Struktur Asli Indeks)
  function renderCompareColumn(side, r) {
    const isSource = side === "source";
    const sideClass = isSource ? "compare-col-source" : "compare-col-dest";
    const badgeText = isSource ? "Indikator Sumber" : "Indikator Pembanding";
    const sasaranName = isSource ? r.sourceSasaranName : r.destSasaranName;
    const instCode = isSource ? r.sourceInst : r.destInst;
    const instFullName = isSource ? r.sourceInstName : r.destInstName;
    const itemCode = isSource ? r.sourceCode : r.destCode;
    const subData = (isSource ? r.sourceData : r.destData) || getSubstansi(itemCode);

    // Konfigurasi dinamis instrumen (Mendukung Sasaran 1 PEMDI, Sasaran 4, dan seluruh sasaran mitra)
    const s4Config = (typeof INSTRUMENT_CONFIG !== "undefined" && INSTRUMENT_CONFIG[instCode]) || (typeof SASARAN4_CONFIG !== "undefined" && SASARAN4_CONFIG[instCode]) || null;

    let itemsHtml = `
      <div class="compare-info-item">
        <div class="info-label-with-icon">
          <span class="field-icon">${ICONS.target}</span>
          <span class="info-label">Sasaran Strategis</span>
        </div>
        <div class="info-val info-sasaran">${esc(sasaranName)}</div>
      </div>
      <div class="compare-info-item">
        <div class="info-label-with-icon">
          <span class="field-icon">${ICONS.badge}</span>
          <span class="info-label">${isSource ? "Indeks Sumber" : "Indeks Pembanding"}</span>
        </div>
        <div class="info-val info-indeks">${esc(s4Config ? s4Config.name : (instFullName || instName(instCode)))}</div>
      </div>
    `;

    if (s4Config && subData) {
      // 1. Aspek / Komponen (apabila tersedia)
      const rawAspek = s4Config.getAspek ? s4Config.getAspek(subData) : "";
      if (rawAspek && rawAspek !== "-" && rawAspek !== " - " && String(rawAspek).trim() !== "") {
        const displayAspek = cleanLabel(String(rawAspek).trim());
        itemsHtml += `
          <div class="compare-info-item">
            <div class="info-label-with-icon">
              <span class="field-icon">${ICONS.folder}</span>
              <span class="info-label">${esc(s4Config.aspekLabel || "Aspek / Komponen")}</span>
            </div>
            <div class="info-val info-aspek">${esc(displayAspek)}</div>
          </div>
        `;
      }

      // 2. Indikator (apabila tersedia sebagai kategori tersendiri)
      const rawIndikator = s4Config.getIndikator ? s4Config.getIndikator(subData) : "";
      if (rawIndikator && rawIndikator !== "-" && String(rawIndikator).trim() !== "") {
        const displayIndikator = cleanLabel(String(rawIndikator).trim());
        itemsHtml += `
          <div class="compare-info-item">
            <div class="info-label-with-icon">
              <span class="field-icon">${ICONS.list}</span>
              <span class="info-label">${esc(s4Config.indikatorLabel || "Indikator")}</span>
            </div>
            <div class="info-val info-indikator">${esc(displayIndikator)}</div>
          </div>
        `;
      }

      // 3. Rincian Indikator (Jenis Butir -> Nama Butir -> Isi Penjelasan)
      const jenisButir = typeof s4Config.jenisButir === "function" ? s4Config.jenisButir(subData) : s4Config.jenisButir;
      const rawNamaButir = s4Config.getNamaButir ? s4Config.getNamaButir(subData) : "";
      const namaButir = String(rawNamaButir || "").trim() === "-" ? "" : cleanLabel(String(rawNamaButir || "").trim());
      const isiPenjelasanHtml = s4Config.getPenjelasanHtml ? s4Config.getPenjelasanHtml(subData, esc) : "";

      if (namaButir || isiPenjelasanHtml) {
        itemsHtml += `
          <div class="compare-info-item compare-rincian-section">
            <div class="info-label-with-icon info-rincian-header">
              <span class="field-icon">${isSource ? ICONS.box : ICONS.doc}</span>
              <span class="info-label">Rincian Indikator</span>
            </div>
            <div class="rincian-box-wrapper">
              ${jenisButir ? `<span class="rincian-jenis-badge">${esc(jenisButir.toUpperCase())}</span>` : ""}
              ${namaButir ? `<div class="rincian-nama-butir">${esc(namaButir)}</div>` : ""}
              ${isiPenjelasanHtml}
            </div>
          </div>
        `;
      }
    } else {
      // Fallback untuk Sasaran 1, 2, 3, 5 atau jika metadata belum terdefinisi
      const aspek = isSource ? r.sourceAspek : r.destAspek;
      const rawIndikator = isSource ? r.sourceIndikator : r.destIndikator;
      const subind = isSource ? r.sourceSubindikator : r.destSubindikator;

      if (aspek && aspek !== "-" && aspek.trim() !== "") {
        itemsHtml += `
          <div class="compare-info-item">
            <div class="info-label-with-icon">
              <span class="field-icon">${ICONS.folder}</span>
              <span class="info-label">Aspek / Komponen</span>
            </div>
            <div class="info-val info-aspek">${esc(cleanLabel(aspek))}</div>
          </div>
        `;
      }
      if (rawIndikator && rawIndikator.trim() !== "") {
        itemsHtml += `
          <div class="compare-info-item">
            <div class="info-label-with-icon">
              <span class="field-icon">${ICONS.list}</span>
              <span class="info-label">Indikator</span>
            </div>
            <div class="info-val info-indikator">${esc(cleanLabel(rawIndikator))}</div>
          </div>
        `;
      }

      let rincianFallbackHtml = "";
      if (subind && subind !== "-" && subind.trim() !== "") {
        rincianFallbackHtml += `
          <div class="rincian-item">
            <span class="rincian-item-label">Subindikator / Rincian</span>
            <div class="rincian-item-val">${esc(cleanLabel(subind))}</div>
          </div>
        `;
      }
      if (subData && subData.definisi_operasional && subData.definisi_operasional.trim() !== "" && subData.definisi_operasional !== "-") {
        rincianFallbackHtml += `
          <div class="rincian-item">
            <span class="rincian-item-label">Definisi Operasional</span>
            <div class="rincian-item-val rincian-item-defop">${esc(subData.definisi_operasional.trim())}</div>
          </div>
        `;
      }

      if (rincianFallbackHtml.trim() !== "") {
        itemsHtml += `
          <div class="compare-info-item compare-rincian-section">
            <div class="info-label-with-icon info-rincian-header">
              <span class="field-icon">${isSource ? ICONS.box : ICONS.doc}</span>
              <span class="info-label">Rincian Indikator</span>
            </div>
            <div class="rincian-box-wrapper">
              ${rincianFallbackHtml}
            </div>
          </div>
        `;
      }
    }

    return `
      <div class="compare-col ${sideClass}">
        <div class="compare-col-header">
          <span class="col-hdr-icon">${isSource ? ICONS.layers : ICONS.chart}</span>
          <span class="compare-col-badge">${esc(badgeText.toUpperCase())}</span>
        </div>
        <div class="compare-info-list">
          ${itemsHtml}
        </div>
      </div>
    `;
  }

  // Render Kartu Penyandingan Dua Kolom (Executive Detail View)
  function renderFocusRelationCard(r) {
    if (!dom.focusRelationCard) return;
    if (!r) {
      dom.focusRelationCard.innerHTML = "";
      dom.focusRelationCard.classList.add("hidden");
      return;
    }

    const srcTitle = cleanLabel(r.sourceIndikator || r.sourceName || r.source);
    const dstTitle = cleanLabel(r.destIndikator || r.destName || r.dest);
    const titleText = (r.sourceInstName && r.destInstName && r.sourceInstName !== r.destInstName)
      ? `${r.sourceInstName} ⟷ ${r.destInstName}`
      : `${srcTitle} ⟷ ${dstTitle}`;

    dom.focusRelationCard.classList.remove("hidden");
    dom.focusRelationCard.innerHTML = `
      <div class="executive-compare-card">
        <div class="compare-card-subtitle-bar">
          <span class="compare-card-icon">${ICONS.link}</span>
          <div class="compare-card-sub-info">
            <strong class="compare-card-tag">Penyandingan Substansi Indikator</strong>
            <span class="compare-card-pair-title">${esc(titleText)}</span>
          </div>
          <button class="btn btn-sm btn-secondary btn-close-detail" id="btnCloseDetailCard" title="Tutup Detail" style="margin-left:auto;">
            <span>✕ Tutup Detail</span>
          </button>
        </div>

        <div class="compare-columns-grid">
          ${renderCompareColumn("source", r)}
          ${renderCompareColumn("dest", r)}
        </div>

        <!-- Informasi Keterkaitan & Alasan (Split 2 Box persis screenshot) -->
        <div class="compare-keterkaitan-split">
          <div class="keterkaitan-box-type">
            <div class="keterkaitan-box-header">
              <span class="keterkaitan-icon">${ICONS.link}</span>
              <span class="keterkaitan-title">Informasi Keterkaitan</span>
            </div>
            <div class="keterkaitan-badge-wrap">
              ${renderTypeBadge(r.type)}
            </div>
          </div>
          <div class="keterkaitan-box-reason">
            <div class="keterkaitan-sub-section">
              <div class="keterkaitan-box-header">
                <span class="keterkaitan-icon">${ICONS.target}</span>
                <span class="keterkaitan-title">Alasan / Justifikasi Substantif</span>
              </div>
              <p class="keterkaitan-reason-text">${esc(r.reason || "Keterkaitan substantif terverifikasi.")}</p>
            </div>

            <div class="keterkaitan-sub-section keterkaitan-recom-section">
              <div class="keterkaitan-box-header">
                <span class="keterkaitan-icon">${ICONS.shield}</span>
                <span class="keterkaitan-title">Rekomendasi Tindak Lanjut</span>
              </div>
              <p class="keterkaitan-reason-text keterkaitan-recom-text">${esc(r.recommendation || r.rekomendasi || "Rekomendasi belum tersedia.")}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const btnClose = dom.focusRelationCard.querySelector("#btnCloseDetailCard");
    if (btnClose) {
      btnClose.onclick = () => {
        state.focusItem = null;
        dom.focusRelationCard.classList.add("hidden");
        if (dom.tableRelationBody) {
          dom.tableRelationBody.querySelectorAll("tr").forEach(tr => tr.classList.remove("row-focused"));
          dom.tableRelationBody.querySelectorAll(".btn-action-detail").forEach(b => {
            b.className = "btn btn-sm btn-outline-primary btn-action-detail";
            const span = b.querySelector("span");
            if (span) span.textContent = "Lihat Detail";
          });
        }
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
      const matchingPairs = pairs.filter(p =>
        (p.dest === state.chosenDest || p.destCode === state.chosenDest) &&
        (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc || p.sourceCode === state.chosenSrc)
      );
      if (matchingPairs.length > 0) {
        itemsToDisplay = matchingPairs.flatMap(p => p.items);
        const firstPair = matchingPairs[0];
        const srcLabel = cleanLabel(firstPair.sourceKelompok || firstPair.sourceName || state.chosenSrc);
        const dstLabel = cleanLabel(firstPair.destName || firstPair.destIndikator || state.chosenDest);
        dom.listTitle.textContent = `Detail Relasi: ${srcLabel} → ${dstLabel}`;
        dom.listDesc.textContent = `${itemsToDisplay.length} catatan keterkaitan pada pasangan indikator ini. Menampilkan keterangan substantif dan jenis keterkaitan.`;
      } else {
        itemsToDisplay = allFiltered;
        dom.listTitle.textContent = `Daftar Seluruh Relasi Terfilter`;
        dom.listDesc.textContent = `Menampilkan keterkaitan pada filter saat ini. Total ${itemsToDisplay.length} catatan keterkaitan terdata.`;
      }
    } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
      const matchedPairs = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc || p.sourceCode === state.chosenSrc) &&
        (!state.chosenInst || p.destInst === state.chosenInst)
      );
      if (matchedPairs.length > 0) {
        itemsToDisplay = matchedPairs.flatMap(p => p.items);
        const rawSrc = state.activeMenu === "internal" && Number(state.internalSasaranId) === 3
          ? (matchedPairs[0]?.sourceName || "Indikator Terpilih")
          : (state.chosenSrc || (matchedPairs[0] ? (matchedPairs[0].sourceKelompok || matchedPairs[0].sourceName) : "Indikator Terpilih"));
        const srcLabel = cleanLabel(rawSrc);
        const dstLabel = state.chosenInst ? instName(state.chosenInst) : (matchedPairs[0] ? cleanLabel(matchedPairs[0].destName) : "Indeks Pembanding");
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
        const s4Count = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4).length;
        dom.detailIntroNotice.innerHTML = `<strong>Relasi Internal Sasaran 4:</strong> Menampilkan ${s4Count} hubungan keterkaitan resmi antara Kapabilitas Kelembagaan dan indeks pembanding berdasarkan substansi indikator asli.`;
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
      const isFocused = state.focusItem && state.focusItem.id === r.id;
      return `
        <tr class="${isFocused ? 'row-focused' : ''}">
          <td style="font-weight:700; color:#64748b; text-align:center;">${i + 1}</td>
          <td>
            <div class="table-cell-substance">
              <div class="cell-main-title">${esc(cleanLabel(r.sourceIndikator || r.sourceName))}</div>
              ${r.sourceAspek ? `<div class="cell-aspek-text">Aspek: ${esc(cleanLabel(r.sourceAspek))}</div>` : ""}
              <div class="cell-sub-pills">
                <span class="cell-pill">${esc(r.sourceInstName)}</span>
                <span class="cell-pill-sasaran">${esc(r.sourceSasaranName)}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="table-cell-substance">
              <div class="cell-main-title">${esc(cleanLabel(r.destIndikator || r.destName))}</div>
              ${r.destAspek ? `<div class="cell-aspek-text">${r.destInst === "CKKP" ? "Kategori: " : "Aspek: "}${esc(cleanLabel(r.destAspek))}</div>` : ""}
              <div class="cell-sub-pills">
                <span class="cell-pill">${esc(r.destInstName)}</span>
                <span class="cell-pill-sasaran">${esc(r.destSasaranName)}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="table-cell-type-col">
              ${renderTypeBadge(r.type)}
              ${(Number(r.sourceSasaran) === 4 || Number(r.targetSasaran) === 4 || Number(r.sourceSasaran) === 1 || state.activeMenu === "external") ? "" : renderStatusBadge(r.level)}
              ${r.tingkat ? renderTingkatBadge(r.tingkat) : ""}
            </div>
          </td>
          <td style="text-align: center;">
            <button class="btn btn-sm ${isFocused ? 'btn-primary' : 'btn-outline-primary'} btn-action-detail" data-rel-id="${esc(r.id)}" title="Lihat penyandingan substansi lengkap">
              <span>${isFocused ? 'Sedang Dibuka' : 'Lihat Detail'}</span> 👁
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
          dom.tableRelationBody.querySelectorAll("tr").forEach(tr => tr.classList.remove("row-focused"));
          const tr = btn.closest("tr");
          if (tr) tr.classList.add("row-focused");
          dom.tableRelationBody.querySelectorAll(".btn-action-detail").forEach(b => {
            const isThis = b.dataset.relId === id;
            b.className = `btn btn-sm ${isThis ? 'btn-primary' : 'btn-outline-primary'} btn-action-detail`;
            const span = b.querySelector("span");
            if (span) span.textContent = isThis ? "Sedang Dibuka" : "Lihat Detail";
          });
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
      state.focusItem = null;
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

    if (dom.pageHeadingTitle && dom.pageHeadingSubtitle) {
      if (stage === "matrix") {
        dom.pageHeadingTitle.textContent = state.activeMenu === "internal" ? "Matriks Relasi Internal" : "Matriks Relasi Eksternal";
        dom.pageHeadingSubtitle.textContent = state.activeMenu === "internal"
          ? (getSasaranInfo(state.internalSasaranId)?.kode + " — " + getSasaranInfo(state.internalSasaranId)?.nama_singkat)
          : "Pemetaan Relasi Lintas Sasaran Strategis";
      } else if (stage === "graph") {
        dom.pageHeadingTitle.textContent = "Peta Relasi";
        dom.pageHeadingSubtitle.textContent = state.activeMenu === "internal"
          ? ("Visualisasi hubungan indikator antar indeks pada " + (getSasaranInfo(state.internalSasaranId)?.kode + " — " + getSasaranInfo(state.internalSasaranId)?.nama_singkat))
          : "Visualisasi Alur Rujukan Antar-Sasaran";
      } else if (stage === "list") {
        dom.pageHeadingTitle.textContent = "Detail Relasi";
        dom.pageHeadingSubtitle.textContent = "Rincian hubungan indikator sesuai lingkup terpilih.";
      }
    }

    if (stage === "matrix") {
      renderStageMatrix();
    } else if (stage === "graph") {
      renderStageGraph();
    } else if (stage === "list") {
      renderStageList();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }


  function updateTopbarSummary() {
    if (!dom.topbarSummaryText) return;
    if (typeof updateSyncBadgeDisplay === "function") {
      updateSyncBadgeDisplay();
    }
    if (state.activeMenu === "internal") {
      const sId = Number(state.internalSasaranId);
      if (sId === 5) {
        dom.topbarSummaryText.textContent = "Sasaran 5: 49 Pasangan Indikator (IPP)";
      } else if (sId === 4) {
        const s4Count = (sasaranData.relations || []).filter(r => r.sourceSasaran === 4 && r.targetSasaran === 4).length;
        dom.topbarSummaryText.textContent = `Sasaran 4: ${s4Count} Hubungan Keterkaitan (KK)`;
      } else if (sId === 3) {
        dom.topbarSummaryText.textContent = "Sasaran 3: 72 Relasi (IIIP)";
      } else {
        dom.topbarSummaryText.textContent = "Sasaran " + sId;
      }
    } else {
      dom.topbarSummaryText.textContent = "Sasaran 1: 1.631 Pasangan Relasi (PEMDI)";
    }
  }

  function updateBreadcrumbs() {
    updateTopbarSummary();
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
    if (typeof syncActiveSasaran === "function") {
      syncActiveSasaran(null, false);
    }
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
        "Rekomendasi Tindak Lanjut",
        "Referensi Sel Excel (Audit)",
        "Satuan Penghitungan"
      ];

      const allFiltered = filteredRelations();
      const pairs = groupRelations(allFiltered);
      let itemsToExport = [];
      if (state.chosenDest) {
        const matchingPairs = pairs.filter(p =>
          (p.dest === state.chosenDest || p.destCode === state.chosenDest) &&
          (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc || p.sourceCode === state.chosenSrc)
        );
        itemsToExport = matchingPairs.length > 0 ? matchingPairs.flatMap(p => p.items) : allFiltered;
      } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
        const matchedPairs = pairs.filter(p =>
          (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc) &&
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
        r.reason || "-",
        r.recommendation || r.rekomendasi || "Rekomendasi belum tersedia.",
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
      const matchingPairs = pairs.filter(p =>
        (p.dest === state.chosenDest || p.destCode === state.chosenDest) &&
        (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc || p.sourceCode === state.chosenSrc)
      );
      if (matchingPairs.length > 0) {
        itemsToExport = matchingPairs.flatMap(p => p.items);
        subtitle = `${matchingPairs[0].sourceName} -> ${matchingPairs[0].destName}`;
      }
    } else if ((state.chosenSrc || state.chosenInst) && !state.search) {
      const matchedPairs = pairs.filter(p =>
        (!state.chosenSrc || p.source === state.chosenSrc || p.sourceAspek === state.chosenSrc || p.sourceKelompok === state.chosenSrc) &&
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
      let keterkaitanDetail = `[ ${relType} ]`;
      if (r.reason) {
        keterkaitanDetail += `\n\nAlasan / Justifikasi:\n${r.reason}`;
      }
      const recom = r.recommendation || r.rekomendasi || "";
      if (recom) {
        keterkaitanDetail += `\n\nRekomendasi Tindak Lanjut:\n${recom}`;
      }

      return [
        (i + 1).toString(),
        sanitizePdfText(`${srcTitle}\n${srcCodeStr}${srcAspek}[ ${srcInst} ]\n${srcSas}`),
        sanitizePdfText(`${dstTitle}\n${dstCodeStr}${dstAspek}[ ${dstInst} ]\n${dstSas}`),
        sanitizePdfText(keterkaitanDetail)
      ];
    });

    // Lebar Halaman A4 Landscape = 841.89 pt. Margin Kiri 30, Kanan 30 -> Lebar Tabel Efektif = 781.89 pt
    // Distribusi 4 Kolom: No (35 pt), Sumber (320 pt), Pembanding (320 pt), Keterkaitan (106 pt)
    doc.autoTable({
      startY: 124,
      head: [["No.", "Indikator Sumber", "Indikator Pembanding", "Keterkaitan, Alasan & Rekomendasi"]],
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
        0: { cellWidth: 30, halign: "center" },
        1: { cellWidth: 245 },
        2: { cellWidth: 245 },
        3: { cellWidth: 261, halign: "left" }
      },
      didDrawPage: function (data) {
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
    dom.btnSidebarToggle.onclick = () => {
      const visible = dom.btnSidebarToggle.getAttribute("aria-expanded") !== "true";
      dom.appLayout.classList.toggle("sidebar-hidden", !visible);
      dom.btnSidebarToggle.setAttribute("aria-expanded", String(visible));
      const label = visible ? "Sembunyikan navigasi" : "Tampilkan navigasi";
      dom.btnSidebarToggle.setAttribute("aria-label", label);
      dom.btnSidebarToggle.title = label;
      window.dispatchEvent(new Event("resize"));
    };
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
        if (typeof syncActiveSasaran === "function") {
          syncActiveSasaran(null, false);
        }
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
        if (typeof syncActiveSasaran === "function") {
          syncActiveSasaran(null, false);
        }
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
        state.focusItem = null;
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
      state.focusItem = null;
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
      exportStageToPdf,
      syncSasaran4FromAPI,
      syncActiveSasaran
    };
  }

  // 15. Sinkronisasi Otomatis Google Sheets untuk Seluruh Sasaran (1 s.d. 5)
  const syncStateMap = {
    s3: { lastHash: "", status: null, name: "Sasaran 3" },
    s4: { lastHash: "", status: null, name: "Sasaran 4" },
    s5: { lastHash: "", status: null, name: "Sasaran 5" },
    ext: { lastHash: "", status: null, name: "Relasi Eksternal" }
  };
  let activeSyncIntervalId = null;
  const syncInProgress = new Set();

  function getCurrentSyncTarget() {
    if (state.activeMenu === "external") {
      return { key: "ext", name: "Relasi Eksternal", endpoint: "/api/external", fallback: "/.netlify/functions/get-external" };
    }
    const sId = Number(state.internalSasaranId);
    if (sId === 3) {
      return { key: "s3", name: "Sasaran 3", endpoint: "/api/sasaran3", fallback: "/.netlify/functions/get-sasaran3" };
    }
    if (sId === 4) {
      return { key: "s4", name: "Sasaran 4", endpoint: "/api/sasaran4", fallback: "/.netlify/functions/get-sasaran4" };
    }
    if (sId === 5) {
      return { key: "s5", name: "Sasaran 5", endpoint: "/api/sasaran5", fallback: "/.netlify/functions/get-sasaran5" };
    }
    return { key: `s${sId}`, name: `Sasaran ${sId}`, endpoint: `/api/sasaran${sId}`, fallback: `/.netlify/functions/get-sasaran${sId}` };
  }

  function updateSyncBadgeDisplay() {
    const s4Badge = document.getElementById("s4SyncBadge");
    const s4Text = document.getElementById("s4SyncText");
    if (!s4Badge) return;

    const target = getCurrentSyncTarget();
    const st = syncStateMap[target.key];

    s4Badge.classList.remove("hidden");

    if (!st || !st.status) {
      s4Badge.classList.remove("offline", "synced");
      s4Badge.classList.add("syncing");
      if (s4Text) s4Text.textContent = `Menyinkronkan ${target.name}...`;
      return;
    }

    if (st.status === "syncing") {
      s4Badge.classList.remove("offline", "synced");
      s4Badge.classList.add("syncing");
      if (s4Text) s4Text.textContent = `Menyinkronkan ${target.name}...`;
    } else if (st.status === "synced") {
      s4Badge.classList.remove("syncing", "offline");
      s4Badge.classList.add("synced");
      if (s4Text) {
        s4Text.textContent = `Data diperbarui: ${st.dateStr} ${st.timeStr} (${st.sourceLabel} - ${target.name})`;
      }
    } else if (st.status === "offline") {
      s4Badge.classList.remove("syncing", "synced");
      s4Badge.classList.add("offline");
      if (s4Text) {
        s4Text.textContent = `Mode Offline (Dataset Baseline - ${target.name})`;
      }
    }
  }

  async function syncActiveSasaran(targetKey = null, silent = false) {
    const target = targetKey ? { key: targetKey, ...syncStateMap[targetKey] } : getCurrentSyncTarget();
    if (!target || syncInProgress.has(target.key)) return;

    // Resolve endpoint
    let endpoint = target.endpoint;
    let fallback = target.fallback;
    if (!endpoint) {
      if (target.key === "s3") { endpoint = "/api/sasaran3"; fallback = "/.netlify/functions/get-sasaran3"; }
      else if (target.key === "s4") { endpoint = "/api/sasaran4"; fallback = "/.netlify/functions/get-sasaran4"; }
      else if (target.key === "s5") { endpoint = "/api/sasaran5"; fallback = "/.netlify/functions/get-sasaran5"; }
      else if (target.key === "ext") { endpoint = "/api/external"; fallback = "/.netlify/functions/get-external"; }
    }

    syncInProgress.add(target.key);
    if (!silent) {
      if (syncStateMap[target.key]) syncStateMap[target.key].status = "syncing";
      updateSyncBadgeDisplay();
    }

    try {
      const endpoints = [...new Set([endpoint, fallback].filter(Boolean))];
      let payload = null;
      let lastError = null;
      for (let attempt = 0; attempt < 2 && !payload; attempt++) {
        for (const url of endpoints) {
          try {
            const res = await fetch(url, { cache: "no-cache" });
            if (!res.ok) {
              lastError = new Error(`HTTP ${res.status} dari ${url}`);
              continue;
            }
            const responsePayload = await res.json();
            if (!responsePayload || !responsePayload.success) {
              lastError = new Error(responsePayload?.error || `Respon tidak valid dari ${url}`);
              continue;
            }
            payload = responsePayload;
            break;
          } catch (err) {
            lastError = err;
          }
        }
        if (!payload && attempt === 0) await new Promise(r => setTimeout(r, 1200));
      }

      if (!payload) throw lastError || new Error("Gagal memproses respon");

      const newHash = `${payload.totalRelations}_${payload.updatedAt || ""}`;
      const dataChanged = !syncStateMap[target.key] || (syncStateMap[target.key].lastHash !== newHash);

      if (dataChanged) {
        if (!syncStateMap[target.key]) {
          syncStateMap[target.key] = { lastHash: newHash, name: target.name };
        } else {
          syncStateMap[target.key].lastHash = newHash;
        }

        // Terapkan data ke model in-memory berdasarkan sasaran
        if (target.key === "s3" && Array.isArray(payload.relations)) {
          if (relasiInternal) {
            relasiInternal.sasaran3 = {
              relasi: payload.relations,
              placeholders: payload.placeholders || []
            };
          }
          if (window.RB_RELASI_INTERNAL) {
            window.RB_RELASI_INTERNAL.sasaran3 = relasiInternal.sasaran3;
          }
        } else if (target.key === "s4" && Array.isArray(payload.relations)) {
          if (window.RB_SUBSTANSI_INDIKATOR && payload.catalog) {
            Object.assign(window.RB_SUBSTANSI_INDIKATOR, payload.catalog);
          }

          if (sasaranData && Array.isArray(sasaranData.relations)) {
            const nonS4Relations = sasaranData.relations.filter(
              r => !(r.sourceSasaran === 4 && r.targetSasaran === 4)
            );
            const newS4Relations = payload.relations.map(r => ({
              scope: "INTERNAL",
              source: r.sourceCode,
              target: r.destCode,
              sourceCell: r.sourceCell || `Row ${r.row || 0}`,
              relationColumn: "Informasi Keterkaitan",
              sourceSasaran: 4,
              targetSasaran: 4,
              sourceInstrument: "KK",
              targetInstrument: r.destInst,
              strengthVariants: [],
              strength: null
            }));
            sasaranData.relations = [...nonS4Relations, ...newS4Relations];
          }

          if (window.RB_JENIS_KETERKAITAN && payload.justifikasi) {
            window.RB_JENIS_KETERKAITAN.sasaran4Justifikasi = Object.assign(
              {},
              window.RB_JENIS_KETERKAITAN.sasaran4Justifikasi || {},
              payload.justifikasi
            );
          }

          if (window.RB_SUBSTANSI_INDIKATOR) {
            payload.relations.forEach(r => {
              if (r.sourceCode) {
                const existingSrc = window.RB_SUBSTANSI_INDIKATOR[r.sourceCode] || {};
                window.RB_SUBSTANSI_INDIKATOR[r.sourceCode] = {
                  ...existingSrc,
                  code: r.sourceCode,
                  sasaran_id: 4,
                  sasaran_name: "Sasaran 4 — Kapabilitas Kelembagaan",
                  instrument_code: "KK",
                  instrument_name: "Kapabilitas Kelembagaan",
                  aspek: r.sourceAspek || existingSrc.aspek || "",
                  indikator: r.sourceKelompok || existingSrc.indikator || "",
                  pernyataan: r.sourceIndikator || existingSrc.pernyataan || "",
                  definisi_operasional: r.sourceDefinisi || existingSrc.definisi_operasional || "",
                  pembina: existingSrc.pembina || "Kementerian PANRB"
                };
              }
              if (r.destCode) {
                const existingDst = window.RB_SUBSTANSI_INDIKATOR[r.destCode] || {};
                window.RB_SUBSTANSI_INDIKATOR[r.destCode] = {
                  ...existingDst,
                  code: r.destCode,
                  sasaran_id: 4,
                  sasaran_name: "Sasaran 4 — Kapabilitas Kelembagaan",
                  instrument_code: r.destInst || existingDst.instrument_code || "",
                  instrument_name: instName(r.destInst) || existingDst.instrument_name || "",
                  indikator: existingDst.indikator || r.destRincian || "",
                  sub_indikator: existingDst.sub_indikator || r.destRincian || "",
                  pembina: existingDst.pembina || ""
                };
              }
            });
          }
        } else if (target.key === "s5" && Array.isArray(payload.relations)) {
          if (relasiInternal) {
            relasiInternal.sasaran5 = payload.relations;
          }
          if (window.RB_RELASI_INTERNAL) {
            window.RB_RELASI_INTERNAL.sasaran5 = payload.relations;
          }
        } else if (target.key === "ext" && Array.isArray(payload.relations)) {
          if (window.RB_EXTERNAL_LATEST) {
            window.RB_EXTERNAL_LATEST.relations = payload.relations;
            if (payload.catalog) window.RB_EXTERNAL_LATEST.catalog = payload.catalog;
          }
        }

        // Render ulang tampilan jika sedang aktif membuka target tersebut
        const currentActive = getCurrentSyncTarget();
        if (currentActive.key === target.key) {
          populateFilters();
          if (state.activeStage === "matrix") renderStageMatrix();
          else if (state.activeStage === "graph") renderStageGraph();
          else if (state.activeStage === "list") renderStageList();
        }
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const dateStr = now.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });
      const sourceLabel = payload.source === "google_sheets" ? "Google Sheets" : "Dataset Baseline";

      syncStateMap[target.key] = {
        status: "synced",
        timeStr,
        dateStr,
        sourceLabel,
        lastHash: newHash,
        name: target.name
      };

      updateSyncBadgeDisplay();
    } catch (err) {
      console.warn(`[Sync ${target.name}] Menggunakan dataset lokal baseline:`, err.message);
      syncStateMap[target.key] = {
        status: "offline",
        name: target.name
      };
      updateSyncBadgeDisplay();
    } finally {
      syncInProgress.delete(target.key);
    }
  }

  // Alias kompatibilitas mundur
  const syncSasaran4FromAPI = (silent = false) => syncActiveSasaran("s4", silent);

  function initUniversalAutoSync() {
    // Sinkronkan target aktif pertama kali (Sasaran 5)
    syncActiveSasaran(null, false);

    // Sinkronkan sasaran lainnya di latar belakang secara bertahap
    setTimeout(() => syncActiveSasaran("s4", true), 2000);
    setTimeout(() => syncActiveSasaran("s3", true), 4000);
    setTimeout(() => syncActiveSasaran("ext", true), 6000);

    if (activeSyncIntervalId) clearInterval(activeSyncIntervalId);
    activeSyncIntervalId = setInterval(() => {
      syncActiveSasaran(null, true);
    }, 60000);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        syncActiveSasaran(null, false);
      }
    });
    window.addEventListener("focus", () => {
      syncActiveSasaran(null, false);
    });
  }

  // 16. Inisialisasi Aplikasi Saat Halaman Dimuat
  function initApp() {
    initEvents();
    populateFilters();
    setStage("matrix");
    initUniversalAutoSync();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
