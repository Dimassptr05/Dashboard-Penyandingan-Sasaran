/**
 * ============================================================================
 * NETLIFY FUNCTION: get-sasaran4 (Migrasi Final)
 * Endpoint: /.netlify/functions/get-sasaran4 (atau /api/sasaran4)
 *
 * Mendelegasikan langsung ke implementasi final Sasaran 4 (`get-sasaran4-dev.js`)
 * yang membaca Google Sheets "sasaran 4 -dev" (GID: 1144784169) dan fallback
 * ke `data/sasaran4-dev-verified-baseline.json`.
 *
 * Sheet lama `sasaran4-js` dan baseline lama `sasaran4-verified-baseline.json`
 * sudah dinonaktifkan dari alur aktif.
 * ============================================================================
 */

const sasaran4Final = require("./get-sasaran4-dev.js");

exports.parseCSV = sasaran4Final.parseCSV;
exports.parseSheetRows = sasaran4Final.parseSheetRows;
exports.handler = sasaran4Final.handler;
