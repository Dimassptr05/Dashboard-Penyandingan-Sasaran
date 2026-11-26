/**
 * ============================================================================
 * PEMETAAN PER INSTANSI — Frontend Controller (Live Google Sheets Integration)
 * ============================================================================
 */
(() => {
  const $ = (id) => document.getElementById(id);
  const ALL = "__all__";
  const BLANK = "__blank__";
  const PAGE_SIZE = 10;
  const TAB_ORDER = [
    "Kemiskinan",
    "Investasi",
    "Hilirisasi",
    "Ketahanan Pangan",
    "Pendidikan",
    "Kesehatan"
  ];
  const CACHE_KEY = "portal_rb_pemetaan_instansi_v1";
  const CACHE_TTL_MS = 5 * 60 * 1000;

  let dataByTheme = {};
  let activeTheme = TAB_ORDER[0];
  let currentPage = 1;
  let isLoading = true;
  let loadError = null;
  let lastUpdatedAt = null;
  let searchableInstansi = null;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const fmt = (n) => new Intl.NumberFormat("id-ID").format(n);

  function isEmptyValue(val) {
    return val === null || val === undefined || String(val).trim() === "";
  }

  function splitTokens(raw) {
    if (isEmptyValue(raw)) return [];
    return String(raw)
      .trim()
      .split(/\s*[,;]\s*/)
      .map((s) => s.trim())
      .filter((s) => s !== "");
  }

  // Normalisasi defensif Level pada frontend agar angka 0 tidak pernah dianggap kosong
  function normalizeLevel(raw) {
    if (isEmptyValue(raw)) return "";
    const s = String(raw).trim();
    if (s === "-" || s === "—") return "";
    return splitTokens(s)
      .map((tok) => {
        const m = tok.match(/^(?:L|Level\s*)\s*(\d+)$/i);
        return m ? m[1] : tok;
      })
      .filter((tok) => tok !== "")
      .join(", ");
  }

  function matchToken(rawValue, filterValue, isLevel) {
    if (filterValue === ALL) return true;
    const normalized = isLevel ? normalizeLevel(rawValue) : (isEmptyValue(rawValue) ? "" : String(rawValue).trim());
    const tokens = splitTokens(normalized);
    if (filterValue === BLANK) {
      return tokens.length === 0;
    }
    return tokens.includes(filterValue);
  }

  function renderChip(rawValue, kind) {
    const normalized = kind === "level" ? normalizeLevel(rawValue) : (isEmptyValue(rawValue) ? "" : String(rawValue).trim());
    const tokens = splitTokens(normalized);
    if (tokens.length === 0) {
      return '<span class="empty">—</span>';
    }
    const typeClassMap = {
      "Proses Utama": "utama",
      "Proses Pendukung": "pendukung",
      "Proses Lainnya": "lainnya",
      "Dukungan Manajemen": "manajemen"
    };
    return tokens
      .map((v) => {
        const cls = kind === "level" ? "level" : (typeClassMap[v] || "");
        return `<span class="chip ${cls}">${esc(v)}</span>`;
      })
      .join("");
  }

  function setSyncState(state, message) {
    const pill = $("syncPill");
    const text = $("syncText");
    const btn = $("btnRefresh");
    pill.classList.remove("is-loading", "is-error");
    if (state === "loading") pill.classList.add("is-loading");
    if (state === "error") pill.classList.add("is-error");
    text.textContent = message;
    btn.disabled = state === "loading";
  }

  function formatTimestamp(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(d);
  }

  /* ---------- Searchable Combobox untuk Dropdown Instansi ---------- */
  function initSearchableInstansi(selectEl) {
    selectEl.classList.add("searchable-native-select");
    selectEl.tabIndex = -1;

    const wrap = document.createElement("div");
    wrap.className = "searchable-select";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "searchable-input";
    input.placeholder = "Semua Instansi (ketik untuk mencari...)";
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-expanded", "false");
    input.setAttribute("aria-label", "Cari dan pilih instansi");

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "searchable-clear";
    clearBtn.textContent = "×";
    clearBtn.title = "Tampilkan semua instansi";
    clearBtn.setAttribute("aria-label", "Hapus pilihan instansi");
    clearBtn.hidden = true;

    const menu = document.createElement("ul");
    menu.className = "searchable-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;

    wrap.append(input, clearBtn, menu);
    selectEl.insertAdjacentElement("afterend", wrap);

    let activeIdx = -1;
    let visibleOptions = [];

    function getOptions() {
      return [...selectEl.options].map((o) => ({ value: o.value, label: o.textContent }));
    }

    function syncDisplay() {
      const cur = selectEl.value;
      const matched = [...selectEl.options].find((o) => o.value === cur);
      input.value = cur && cur !== ALL && matched ? matched.textContent : "";
      clearBtn.hidden = !input.value;
    }

    function closeMenu() {
      menu.hidden = true;
      input.setAttribute("aria-expanded", "false");
      activeIdx = -1;
    }

    function choose(val) {
      selectEl.value = val;
      syncDisplay();
      closeMenu();
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function renderMenu(query) {
      const q = (query || "").trim().toLowerCase();
      const opts = getOptions();
      visibleOptions = q
        ? opts.filter((o) => o.value === ALL || o.label.toLowerCase().includes(q))
        : opts;
      if (q && visibleOptions.some((o) => o.value !== ALL)) {
        visibleOptions = visibleOptions.filter((o) => o.value !== ALL);
      }
      activeIdx = visibleOptions.length ? 0 : -1;
      if (!visibleOptions.length) {
        menu.innerHTML = '<li class="searchable-empty">Instansi tidak ditemukan.</li>';
      } else {
        menu.innerHTML = visibleOptions
          .map((o, i) => {
            const cls = [
              "searchable-option",
              o.value === selectEl.value ? "selected" : "",
              i === activeIdx ? "active" : ""
            ]
              .filter(Boolean)
              .join(" ");
            return `<li class="${cls}" role="option" data-val="${esc(o.value)}">${esc(o.label)}</li>`;
          })
          .join("");
      }
      menu.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    function updateActive() {
      const items = menu.querySelectorAll(".searchable-option");
      items.forEach((el, i) => el.classList.toggle("active", i === activeIdx));
      if (items[activeIdx]) items[activeIdx].scrollIntoView({ block: "nearest" });
    }

    input.addEventListener("focus", () => {
      input.select();
      renderMenu("");
    });
    input.addEventListener("click", () => {
      if (menu.hidden) renderMenu("");
    });
    input.addEventListener("input", () => {
      clearBtn.hidden = !input.value;
      renderMenu(input.value);
      if (!input.value.trim() && selectEl.value !== ALL) {
        selectEl.value = ALL;
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    input.addEventListener("keydown", (e) => {
      if (menu.hidden && (e.key === "ArrowDown" || e.key === "Enter")) {
        renderMenu(input.value);
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (visibleOptions.length) {
          activeIdx = (activeIdx + 1) % visibleOptions.length;
          updateActive();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (visibleOptions.length) {
          activeIdx = (activeIdx - 1 + visibleOptions.length) % visibleOptions.length;
          updateActive();
        }
      } else if (e.key === "Enter") {
        if (!menu.hidden && activeIdx >= 0 && visibleOptions[activeIdx]) {
          e.preventDefault();
          choose(visibleOptions[activeIdx].value);
        }
      } else if (e.key === "Escape") {
        syncDisplay();
        closeMenu();
      }
    });
    menu.addEventListener("mousedown", (e) => {
      const li = e.target.closest(".searchable-option");
      if (!li) return;
      e.preventDefault();
      choose(li.dataset.val);
    });
    clearBtn.addEventListener("click", () => {
      choose(ALL);
      input.focus();
    });
    input.addEventListener("blur", () => {
      setTimeout(() => {
        syncDisplay();
        closeMenu();
      }, 120);
    });

    return { syncDisplay, input };
  }

  /* ---------- Rendering Tabs, Filters, Table, Pagination ---------- */
  function populateSelect(id, values, allLabel, hasBlank) {
    const el = $(id);
    const prev = el.value;
    el.replaceChildren(new Option(allLabel, ALL), ...values.map((v) => new Option(v, v)));
    if (hasBlank) {
      el.add(new Option("Belum Tersedia", BLANK));
    }
    el.value = [...el.options].some((o) => o.value === prev) ? prev : ALL;
    if (id === "instansi" && searchableInstansi) {
      searchableInstansi.syncDisplay();
    }
  }

  function renderTabs() {
    const nav = $("tabs");
    nav.innerHTML = TAB_ORDER.map(
      (t) =>
        `<button class="tab ${t === activeTheme ? "active" : ""}" role="tab" aria-selected="${t === activeTheme}" data-theme="${esc(t)}" type="button">${esc(t)}</button>`
    ).join("");
    nav.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (activeTheme === btn.dataset.theme) return;
        activeTheme = btn.dataset.theme;
        currentPage = 1;
        renderTabs();
        resetFilterValues();
        updateFilterOptions();
        renderTable();
      });
    });
  }

  function resetFilterValues() {
    ["instansi", "level", "jenis"].forEach((id) => {
      $(id).value = ALL;
    });
    if (searchableInstansi) searchableInstansi.syncDisplay();
  }

  function updateFilterOptions() {
    const groups = dataByTheme[activeTheme] || [];
    const roles = groups.flatMap((g) => g.roles || []);

    const uniqueInstansi = [];
    const seenInstansi = new Set();
    for (const g of groups) {
      if (g.name && !seenInstansi.has(g.name)) {
        seenInstansi.add(g.name);
        uniqueInstansi.push(g.name);
      }
    }

    const levelSet = new Set();
    let hasBlankLevel = false;
    for (const r of roles) {
      const toks = splitTokens(normalizeLevel(r.level));
      if (toks.length === 0) hasBlankLevel = true;
      else toks.forEach((tok) => levelSet.add(tok));
    }
    const sortedLevels = [...levelSet].sort((a, b) => a.localeCompare(b, "id", { numeric: true }));

    const typeSet = new Set();
    let hasBlankType = false;
    for (const r of roles) {
      const toks = splitTokens(r.type);
      if (toks.length === 0) hasBlankType = true;
      else toks.forEach((tok) => typeSet.add(tok));
    }
    const sortedTypes = [...typeSet].sort((a, b) => a.localeCompare(b, "id"));

    populateSelect("instansi", uniqueInstansi, "Semua Instansi", false);
    populateSelect("level", sortedLevels, "Semua Level", hasBlankLevel);
    populateSelect("jenis", sortedTypes, "Semua Jenis Proses", hasBlankType);
  }

  function getFilteredGroups() {
    const groups = dataByTheme[activeTheme] || [];
    const selectedInst = $("instansi").value || ALL;
    const selectedLevel = $("level").value || ALL;
    const selectedType = $("jenis").value || ALL;

    return groups
      .filter((g) => selectedInst === ALL || g.name === selectedInst)
      .map((g) => ({
        ...g,
        roles: (g.roles || []).filter(
          (r) => matchToken(r.level, selectedLevel, true) && matchToken(r.type, selectedType, false)
        )
      }))
      .filter((g) => g.roles.length > 0);
  }

  function renderTable() {
    if (isLoading) {
      $("statTotal").textContent = "–";
      $("statMapped").textContent = "–";
      $("statRoles").textContent = "–";
      $("results").textContent = "Memuat data pemetaan...";
      $("pageinfo").textContent = "";
      $("pages").innerHTML = "";
      $("body").innerHTML =
        '<tr><td colspan="5" class="blankstate"><div class="spinner" aria-hidden="true"></div><strong>Memuat data dari Google Sheets...</strong>Sedang mengambil pemetaan peran instansi untuk enam tematik RB.</td></tr>';
      return;
    }

    if (loadError) {
      $("statTotal").textContent = "–";
      $("statMapped").textContent = "–";
      $("statRoles").textContent = "–";
      $("results").textContent = "Gagal memuat data Google Sheets.";
      $("pageinfo").textContent = "";
      $("pages").innerHTML = "";
      $("body").innerHTML = `<tr><td colspan="5" class="blankstate"><strong>Gagal memuat data dari Google Sheets</strong>${esc(loadError)}<br><button class="btn-retry" id="btnRetryLoad" type="button">Coba muat ulang</button></td></tr>`;
      const retry = $("btnRetryLoad");
      if (retry) retry.addEventListener("click", () => fetchData(true));
      return;
    }

    const allGroups = dataByTheme[activeTheme] || [];
    const filtered = getFilteredGroups();

    const mappedCount = filtered.filter((g) => g.roles.some((r) => !isEmptyValue(r.desc))).length;
    const roleDescCount = filtered.reduce((acc, g) => acc + g.roles.filter((r) => !isEmptyValue(r.desc)).length, 0);

    $("statTotal").textContent = fmt(filtered.length);
    $("statMapped").textContent = fmt(mappedCount);
    $("statRoles").textContent = fmt(roleDescCount);
    $("results").innerHTML = `Tematik <b>${esc(activeTheme)}</b> · <b>${fmt(filtered.length)}</b> dari ${fmt(allGroups.length)} instansi`;

    const maxPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, maxPage);
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const subset = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    if (subset.length === 0) {
      $("body").innerHTML =
        '<tr><td colspan="5" class="blankstate"><strong>Tidak ada data yang sesuai</strong>Ubah atau reset filter untuk melihat data lainnya.</td></tr>';
    } else {
      $("body").innerHTML = subset
        .map((g) =>
          g.roles
            .map(
              (r, i) =>
                `<tr class="${i === 0 ? "groupstart" : ""}">${
                  i === 0
                    ? `<td class="no" rowspan="${g.roles.length}">${esc(isEmptyValue(g.no) ? "—" : g.no)}</td><td class="inst" rowspan="${g.roles.length}">${esc(g.name)}</td>`
                    : ""
                }<td>${renderChip(r.level, "level")}</td><td class="desc">${
                  !isEmptyValue(r.desc) ? esc(r.desc) : '<span class="empty">—</span>'
                }</td><td>${renderChip(r.type, "type")}</td></tr>`
            )
            .join("")
        )
        .join("");
    }

    $("pageinfo").textContent = filtered.length
      ? `Menampilkan instansi ${startIdx + 1}–${Math.min(startIdx + PAGE_SIZE, filtered.length)} dari ${filtered.length}`
      : "0 instansi";

    const pagesToShow = [];
    for (let p = 1; p <= maxPage; p++) {
      if (p === 1 || p === maxPage || Math.abs(p - currentPage) <= 1) {
        pagesToShow.push(p);
      }
    }

    let html = `<button type="button" data-p="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""} aria-label="Halaman sebelumnya">‹</button>`;
    pagesToShow.forEach((p, idx) => {
      if (idx > 0 && p - pagesToShow[idx - 1] > 1) {
        html += '<span class="muted">…</span>';
      }
      html += `<button type="button" data-p="${p}" class="${p === currentPage ? "active" : ""}" ${p === currentPage ? 'aria-current="page"' : ""}>${p}</button>`;
    });
    html += `<button type="button" data-p="${currentPage + 1}" ${currentPage === maxPage ? "disabled" : ""} aria-label="Halaman berikutnya">›</button>`;
    $("pages").innerHTML = html;

    $("pages")
      .querySelectorAll("button:not(:disabled)")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          currentPage = Number(btn.dataset.p);
          renderTable();
          $("results").scrollIntoView({ block: "nearest" });
        });
      });
  }

  /* ---------- Live Data Fetching & Session Cache ---------- */
  function readCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.themes || Date.now() - parsed.cachedAt > CACHE_TTL_MS) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  function writeCache(payload) {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          cachedAt: Date.now(),
          updatedAt: payload.updatedAt,
          themes: payload.themes
        })
      );
    } catch {
      // Abaikan bila quota sessionStorage penuh
    }
  }

  function applyPayload(payload, fromCache) {
    dataByTheme = payload.themes || {};
    lastUpdatedAt = payload.updatedAt || null;
    isLoading = false;
    loadError = null;
    const stamp = formatTimestamp(lastUpdatedAt);
    setSyncState("ok", fromCache ? `Tersinkron (cache) · ${stamp}` : `Live Google Sheets · ${stamp}`);
    if (stamp) {
      $("footUpdated").textContent = `Terakhir disinkronkan: ${stamp}`;
    }
    updateFilterOptions();
    renderTable();
  }

  async function fetchData(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = readCache();
      if (cached) {
        applyPayload(cached, true);
        return;
      }
    }

    isLoading = true;
    loadError = null;
    setSyncState("loading", "Memuat data Google Sheets...");
    renderTable();

    const suffix = forceRefresh ? "?refresh=1" : "";
    const endpoints = [
      `/api/pemetaan-instansi${suffix}`,
      `/.netlify/functions/get-pemetaan-instansi${suffix}`
    ];

    let lastErr = "Endpoint Google Sheets tidak dapat dijangkau.";
    for (const url of endpoints) {
      try {
        const res = await fetch(url, { cache: forceRefresh ? "no-store" : "default" });
        if (!res.ok) {
          lastErr = `HTTP ${res.status} saat membaca ${url}`;
          continue;
        }
        const payload = await res.json();
        if (payload && payload.success && payload.themes) {
          writeCache(payload);
          applyPayload(payload, false);
          return;
        }
        lastErr = (payload && payload.error) || "Format respons tidak valid.";
      } catch (err) {
        lastErr = err && err.message ? err.message : "Koneksi jaringan gagal.";
      }
    }

    isLoading = false;
    loadError = lastErr;
    setSyncState("error", "Gagal sinkronisasi");
    renderTable();
  }

  /* ---------- Init ---------- */
  searchableInstansi = initSearchableInstansi($("instansi"));
  renderTabs();

  ["instansi", "level", "jenis"].forEach((id) => {
    $(id).addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });
  });

  $("reset").addEventListener("click", () => {
    resetFilterValues();
    currentPage = 1;
    renderTable();
  });

  $("btnRefresh").addEventListener("click", () => fetchData(true));

  window.__pemetaanInstansi = {
    getState: () => ({
      activeTheme,
      currentPage,
      isLoading,
      loadError,
      lastUpdatedAt,
      themesLoaded: Object.keys(dataByTheme),
      filteredCount: getFilteredGroups().length,
      totalInTheme: (dataByTheme[activeTheme] || []).length
    }),
    refresh: () => fetchData(true)
  };

  fetchData(false);
})();
