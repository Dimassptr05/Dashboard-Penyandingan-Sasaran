const fs = require('fs');

global.window = global;

let toolbarHtml = '';
let mindMapCalled = false;
let detailGraphRendered = false;

// Mock DOM elements
const domMock = {
  stageMatrix: { classList: { add: () => {}, remove: () => {} } },
  stageGraph: { classList: { add: () => {}, remove: () => {} } },
  stageList: { classList: { add: () => {}, remove: () => {} } },
  graphToolbar: {
    style: {},
    querySelector: (sel) => ({
      classList: { add: () => {}, remove: () => {} },
      onclick: null
    }),
    querySelectorAll: () => []
  },
  graphInstTabs: {
    style: {},
    innerHTML: '',
    querySelector: (sel) => ({
      classList: { add: () => {}, remove: () => {} },
      onclick: null
    }),
    querySelectorAll: () => []
  },
  mapTotal: { textContent: '' },
  mapUnit: { textContent: '' },
  graphTitle: { textContent: '' },
  graphDesc: { textContent: '' },
  colSourceTitle: { textContent: '' },
  colSourceCount: { textContent: '' },
  colDestTitle: { textContent: '' },
  colDestCount: { textContent: '' },
  containerSourceCards: { innerHTML: '', querySelectorAll: () => [] },
  containerDestCards: { innerHTML: '', querySelectorAll: () => [] },
  diagramSvg: { querySelector: () => null, innerHTML: '' },
  diagramViewport: { style: {} },
  step1Btn: { classList: { add: () => {}, remove: () => {} } },
  step2Btn: { classList: { add: () => {}, remove: () => {} } },
  step3Btn: { classList: { add: () => {}, remove: () => {} } },
  stepLine1: { classList: { add: () => {}, remove: () => {} } },
  stepLine2: { classList: { add: () => {}, remove: () => {} } },
  btnGlobalBack: { classList: { add: () => {}, remove: () => {} } },
  btnGlobalBackText: { textContent: '' },
  topbarSummaryText: { textContent: '' }
};

global.document = {
  getElementById: (id) => domMock[id] || { classList: { add: () => {}, remove: () => {} }, style: {}, addEventListener: () => {} },
  createElement: () => ({ style: {} }),
  querySelectorAll: () => []
};

global.requestAnimationFrame = (fn) => fn();

require('../data-sasaran.js');
require('../data/jenis-keterkaitan.js');
require('../data/substansi-indikator.js');

console.log("Loaded datasets.");

// Test simulation of clicking matrix cell in S4
const state = {
  activeMenu: "internal",
  activeStage: "matrix",
  internalSasaranId: 4,
  chosenSrc: "",
  chosenInst: "",
  chosenDest: "",
  focusRelation: null,
  s4MacroView: true // was previously in macro view
};

console.log("Initial state before clicking matrix cell:", {
  stage: state.activeStage,
  chosenSrc: state.chosenSrc,
  chosenInst: state.chosenInst,
  s4MacroView: state.s4MacroView
});

// User clicks cell: "1. Mandat (Core Function)" -> "IPPN"
const clickedSrc = "1. Mandat (Core Function)";
const clickedInst = "IPPN";

state.chosenSrc = clickedSrc;
state.chosenInst = clickedInst;
state.chosenDest = "";
state.focusRelation = null;
if (Number(state.internalSasaranId) === 4) {
  state.s4MacroView = false;
}
state.activeStage = "graph";

console.log("\nState after clicking matrix cell:", {
  stage: state.activeStage,
  chosenSrc: state.chosenSrc,
  chosenInst: state.chosenInst,
  s4MacroView: state.s4MacroView
});

// Check condition in renderStageGraph
const isS4 = state.activeMenu === "internal" && Number(state.internalSasaranId) === 4;
if (isS4 && (state.chosenSrc || state.chosenInst)) {
  state.s4MacroView = false;
}

if (isS4 && state.s4MacroView !== false) {
  mindMapCalled = true;
} else {
  detailGraphRendered = true;
}

console.log("\nGraph dispatch check:");
console.log("  mindMapCalled (Screenshot 2):", mindMapCalled);
console.log("  detailGraphRendered (Screenshot 1):", detailGraphRendered);

if (mindMapCalled) {
  throw new Error("FAIL: Still called mindMap (Screenshot 2) instead of detail graph!");
}

if (!detailGraphRendered) {
  throw new Error("FAIL: Detail graph was not rendered!");
}

console.log("\n=> SUCCESS: Clicking matrix cell directly renders Screenshot 1 (Peta Detail)!");

