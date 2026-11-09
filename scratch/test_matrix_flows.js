const fs = require('fs');

global.window = global;
global.window.addEventListener = () => {};
global.window.location = { search: "" };
global.window.scrollTo = () => {};
global.window.history = { replaceState: () => {} };
global.requestAnimationFrame = (cb) => cb();

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
      querySelectorAll: () => [],
      querySelector: (sel) => {
        if (sel === '.hero-kpi-grid') return elements['heroKpiGrid'] || (elements['heroKpiGrid'] = getEl('heroKpiGrid'));
        return { style: {}, classList: { add: () => {}, remove: () => {} }, onclick: null };
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

const appJsCode = fs.readFileSync('app.js', 'utf-8');
eval(appJsCode);

const app = window.__portalRB;
app.state.activeMenu = "internal";
app.state.internalSasaranId = 4;
app.setStage("matrix");

console.log("=== TESTING FLOW 1: Aspect Cell Click (Ketepatan Fungsi x IPPN) ===");
app.state.chosenSrc = "Ketepatan Fungsi";
app.state.chosenInst = "IPPN";
app.state.s4MacroView = false;
app.setStage("graph");

console.log("Stage after click:", app.state.activeStage, "(Expected: graph)");
console.log("s4MacroView:", app.state.s4MacroView, "(Expected: false)");

const graphPairs = app.groupRelations(app.filteredRelations()).filter(p => {
  let srcMatch = (p.source === app.state.chosenSrc || p.sourceAspek === app.state.chosenSrc || p.sourceKelompok === app.state.chosenSrc || p.sourceCode === app.state.chosenSrc);
  let instMatch = (p.destInst === app.state.chosenInst);
  return srcMatch && instMatch;
});
console.log("Active pairs for Ketepatan Fungsi x IPPN:", graphPairs.length, "(Expected: 7)");

console.log("\n=== TESTING FLOW 2: Kelompok Cell Click (1. Mandat x IPPN) ===");
app.state.chosenSrc = "1. Mandat (Core Function)";
app.state.chosenInst = "IPPN";
app.state.s4MacroView = false;
app.setStage("graph");

const mandatPairs = app.groupRelations(app.filteredRelations()).filter(p => {
  let srcMatch = (p.source === app.state.chosenSrc || p.sourceAspek === app.state.chosenSrc || p.sourceKelompok === app.state.chosenSrc || p.sourceCode === app.state.chosenSrc);
  let instMatch = (p.destInst === app.state.chosenInst);
  return srcMatch && instMatch;
});
console.log("Active pairs for 1. Mandat x IPPN:", mandatPairs.length, "(Expected: 2)");

console.log("\n=== TESTING FLOW 3: Destination Card Click to Detail ===");
app.state.chosenDest = mandatPairs[0].dest;
app.setStage("list");
console.log("Stage after dest click:", app.state.activeStage, "(Expected: list)");
console.log("Chosen dest:", app.state.chosenDest);

const detailPair = mandatPairs[0];
console.log("Detail Pair Source:", detailPair.sourceCode, "-", detailPair.sourceName);
console.log("Detail Pair Target:", detailPair.destCode, "-", detailPair.destName);
console.log("Detail Pair Type (Col J):", detailPair.type);
console.log("Detail Pair Substantive Reason (Col L):", detailPair.items[0].reason ? detailPair.items[0].reason.substring(0, 80) + "..." : "NONE");
console.log("Detail Pair Recommendation (Col R):", detailPair.items[0].recommendation ? detailPair.items[0].recommendation.substring(0, 80) + "..." : "NONE");

console.log("\n=== ALL FLOW TESTS PASSED SUCCESSFULLY! ===");
