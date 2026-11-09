const fs = require('fs');

global.window = global;
global.window.addEventListener = () => {};
global.window.location = { search: "" };
global.window.scrollTo = () => {};
global.window.history = { replaceState: () => {} };

// DOM Mock
const elements = {};
function getEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      innerHTML: '',
      textContent: '',
      classList: {
        _classes: new Set(),
        add: function(c) { this._classes.add(c); },
        remove: function(c) { this._classes.delete(c); },
        contains: function(c) { return this._classes.has(c); },
        toggle: function(c, force) {
          if (force !== undefined) {
            if (force) this.add(c); else this.remove(c);
          } else {
            if (this.contains(c)) this.remove(c); else this.add(c);
          }
        }
      },
      style: {},
      dataset: {},
      value: '',
      appendChild: () => {},
      addEventListener: () => {},
      querySelectorAll: function(sel) {
        // Simple mock queries
        if (sel === '.btn-toggle-subrow' || sel === '[data-mapsrc]' || sel === '.matrix-cell-active') {
          return this._extractedNodes || [];
        }
        return [];
      },
      querySelector: function(sel) {
        if (sel === '.hero-kpi-grid') return elements['heroKpiGrid'] || (elements['heroKpiGrid'] = getEl('heroKpiGrid'));
        return null;
      }
    };
  }
  return elements[id];
}

global.document = {
  getElementById: (id) => getEl(id),
  querySelector: (sel) => {
    if (sel === '#stageMatrix .hero-kpi-grid') return getEl('heroKpiGrid');
    return null;
  },
  querySelectorAll: () => [],
  createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} } }),
  addEventListener: () => {}
};

require('../data-sasaran.js');
require('../data/jenis-keterkaitan.js');
require('../data/substansi-indikator.js');

// Load app.js via evaluation or wrapping
const appJsCode = fs.readFileSync('app.js', 'utf-8');

// Execute app.js in this context
eval(appJsCode);

console.log("=== RUNNING FULL S4 MATRIX VERIFICATION ===");

// 1. Set Menu to Internal, Sasaran to 4
const app = window.__portalRB;
app.state.activeMenu = "internal";
app.state.internalSasaranId = 4;
app.setStage("matrix");

// Call renderInternalMatrix via setStage or directly
// Check matrix Table Container HTML
const matrixHtml = getEl("matrixTableContainer").innerHTML;

console.log("\n1. Checking Table Structure:");
console.log("Matrix HTML length:", matrixHtml.length);

const aspectRows = (matrixHtml.match(/class="matrix-aspect-row"/g) || []).length;
console.log("Total Aspect rows rendered:", aspectRows, "(Expected: 4)");

const groupSubRows = (matrixHtml.match(/class="matrix-group-subrow/g) || []).length;
console.log("Total Group sub-rows rendered:", groupSubRows, "(Expected: 11)");

const toggleBtns = (matrixHtml.match(/class="btn-toggle-subrow"/g) || []).length;
console.log("Total Toggle buttons rendered:", toggleBtns, "(Expected: 4)");

// 2. Check Summary KPI Grid
const kpiHtml = getEl("heroKpiGrid").innerHTML;
console.log("\n2. Checking KPI Grid:");
console.log("KPI Grid contains 'Hubungan Keterkaitan':", kpiHtml.includes("Hubungan Keterkaitan"));
console.log("KPI Grid contains '4 Aspek KK':", kpiHtml.includes("4") && kpiHtml.includes("Aspek KK"));
console.log("KPI Grid contains '11 Kelompok KK':", kpiHtml.includes("11") && kpiHtml.includes("Kelompok KK"));
console.log("KPI Grid contains '24 Indikator KK':", kpiHtml.includes("24") && kpiHtml.includes("Indikator KK"));
console.log("KPI Grid contains '7 Indeks Pembanding':", kpiHtml.includes("7") && kpiHtml.includes("Indeks Pembanding"));

// 3. Check Notice Box (Fineprint)
const fineprintHtml = getEl("matrixFineprint").innerHTML;
console.log("\n3. Checking Notice Box:");
console.log("Notice box HTML:", fineprintHtml.trim());
console.log("Notice contains 'Keterangan Matriks Relasi Internal Sasaran 4':", fineprintHtml.includes("Keterangan Matriks Relasi Internal Sasaran 4"));

// 4. Check Pairs and Totals
const allFiltered = app.filteredRelations();
const pairs = app.groupRelations(allFiltered);
console.log("\n4. Checking Relations and Pairs:");
console.log("filteredRelations count:", allFiltered.length, "(Expected: 168)");
console.log("groupRelations pairs count:", pairs.length, "(Expected: 168)");

// Check aspects and cell counts
const dests = ["IPPN", "CKKP", "SPIP", "SAKIP", "ELPPD", "IKPA", "IPA"];
const aspects = ["Ketepatan Fungsi", "Ketepatan Ukuran", "Ketepatan Proses", "Tata Kelola"];
const expectedRowTotals = {
  "Ketepatan Fungsi": 49,
  "Ketepatan Ukuran": 35,
  "Ketepatan Proses": 49,
  "Tata Kelola": 35
};

console.log("\n5. Checking Row and Cell Counts:");
let allCellsMatch = true;
aspects.forEach(asp => {
  let rowTotal = 0;
  dests.forEach(dst => {
    const cnt = pairs.filter(p => p.sourceAspek === asp && p.destInst === dst).length;
    rowTotal += cnt;
    const expectedCell = (asp === "Ketepatan Fungsi" || asp === "Ketepatan Proses") ? 7 : 5;
    if (cnt !== expectedCell) {
      console.error(`Mismatch for ${asp} x ${dst}: got ${cnt}, expected ${expectedCell}`);
      allCellsMatch = false;
    }
  });
  console.log(`Aspect [${asp}]: Row Total = ${rowTotal} (Expected: ${expectedRowTotals[asp]})`);
  if (rowTotal !== expectedRowTotals[asp]) allCellsMatch = false;
});
console.log("All 28 matrix cells match expected counts:", allCellsMatch);

// Check column totals
console.log("\n6. Checking Column Totals:");
let allColsMatch = true;
dests.forEach(dst => {
  const colTotal = pairs.filter(p => p.destInst === dst).length;
  console.log(`Column [${dst}]: ${colTotal} (Expected: 24)`);
  if (colTotal !== 24) allColsMatch = false;
});
console.log("All 7 columns match 24 count:", allColsMatch);

// Check grand total
console.log(`\nGrand Total: ${pairs.length} (Expected: 168)`);

// 7. Check Sub-group counts
console.log("\n7. Checking 11 Kelompok Sub-group Counts:");
const expectedGroups = {
  "1. Mandat (Core Function)": 14,
  "2. Distribusi Kewenangan": 14,
  "3. Unsur Pembantu Pemimpin, Unsur Pengawas, dan Unsur Pendukung": 21,
  "1. Rentang Kendali": 21,
  "2. Departemensi (Pembidangan)": 14,
  "1. Proses Bisnis": 14,
  "2. Proses Pengambilan Keputusan": 14,
  "3. Proses Perencanaan": 21,
  "1. Sistem Kerja": 21,
  "2. Budaya Kerja": 7,
  "3. Pengendalian Risiko": 7
};

let allGroupsMatch = true;
for (const [grp, expected] of Object.entries(expectedGroups)) {
  const total = pairs.filter(p => p.sourceKelompok === grp).length;
  if (total !== expected) {
    console.error(`Group ${grp}: got ${total}, expected ${expected}`);
    allGroupsMatch = false;
  } else {
    console.log(`  ↳ Group [${grp}]: Total = ${total} (Expected: ${expected})`);
  }
}
console.log("All 11 Kelompok match expected counts:", allGroupsMatch);

console.log("\n=== ALL CHECKS COMPLETED ===");
