/**
 * ============================================================================
 * NETLIFY FUNCTION: get-pemetaan-instansi
 * Endpoint: /.netlify/functions/get-pemetaan-instansi (atau /api/pemetaan-instansi)
 * Single Source of Truth: Google Sheets Pemetaan Peran Tematik K/L
 * ============================================================================
 */

const https = require("https");
const crypto = require("crypto");

const DEFAULT_SPREADSHEET_ID = "1ZCatB26raLZnT81bJK8_KaFldD3JAexFwNQsHkazxk8";

// Urutan tab resmi + alias nama sheet (untuk deteksi GID dinamis agar tahan re-import/rename).
// GID di bawah adalah snapshot terbaru; runtime selalu mendeteksi GID live dari Google Sheets.
const THEMATIC_SHEETS = [
  { key: "Kemiskinan", label: "Kemiskinan", aliases: ["kemiskinan"], sheetName: "Kemiskinan", gid: "1888818258" },
  { key: "Investasi", label: "Investasi", aliases: ["investasi"], sheetName: "Investasi", gid: "1515604165" },
  { key: "Hilirisasi", label: "Hilirisasi", aliases: ["hilirisasi", "hirilisasi"], sheetName: "Hirilisasi", gid: "109386080" },
  { key: "Ketahanan Pangan", label: "Ketahanan Pangan", aliases: ["ketahanan pangan"], sheetName: "Ketahanan Pangan", gid: "329037697" },
  { key: "Pendidikan", label: "Pendidikan", aliases: ["pendidikan"], sheetName: "Pendidikan", gid: "2000502288" },
  { key: "Kesehatan", label: "Kesehatan", aliases: ["kesehatan"], sheetName: "Kesehatan", gid: "690304310" }
];

const CACHE_TTL_MS = 60 * 1000;
const responseCache = new Map();

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function httpsRequest(optionsOrUrl, postData = null, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const urlObj = typeof optionsOrUrl === "string"
      ? new URL(optionsOrUrl)
      : new URL(`https://${optionsOrUrl.hostname || "sheets.googleapis.com"}${optionsOrUrl.path || "/"}`);

    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: (typeof optionsOrUrl === "object" && optionsOrUrl.method) || (postData ? "POST" : "GET"),
      headers: (typeof optionsOrUrl === "object" && optionsOrUrl.headers) || {}
    };

    const req = https.request(reqOptions, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && maxRedirects > 0) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith("http")) {
          redirectUrl = new URL(redirectUrl, `https://${reqOptions.hostname}`).toString();
        }
        return httpsRequest(redirectUrl, postData, maxRedirects - 1).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });

    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    if (postData) req.write(postData);
    req.end();
  });
}

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let curVal = "";
  const src = String(text || "").replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    const next = src[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        curVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      row.push(curVal);
      curVal = "";
    } else if ((c === "\r" || c === "\n") && !inQuotes) {
      if (c === "\r" && next === "\n") i++;
      row.push(curVal);
      lines.push(row);
      row = [];
      curVal = "";
    } else {
      curVal += c;
    }
  }
  if (curVal !== "" || row.length > 0) {
    row.push(curVal);
    lines.push(row);
  }
  return lines;
}

function splitTokens(raw) {
  if (raw === null || raw === undefined) return [];
  const s = String(raw).trim();
  if (s === "") return [];
  return s
    .split(/\s*[,;]\s*/)
    .map((part) => part.trim())
    .filter((part) => part !== "");
}

/**
 * Normalisasi nilai Level tanpa pernah memperlakukan angka 0 sebagai kosong.
 * - 0 atau "0" atau "L0" / "Level 0" -> "0"
 * - "" / null / undefined / "-" / "—" -> ""
 */
function normalizeLevel(raw) {
  if (raw === null || raw === undefined) return "";
  const s = String(raw).trim();
  if (s === "" || s === "-" || s === "—") return "";
  const tokens = splitTokens(s).map((tok) => {
    const match = tok.match(/^(?:L|Level\s*)\s*(\d+)$/i);
    return match ? match[1] : tok;
  });
  return tokens.filter((t) => t !== "").join(", ");
}

function normalizeText(raw) {
  if (raw === null || raw === undefined) return "";
  return String(raw).replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function detectColumns(headerRow) {
  const headers = (headerRow || []).map((h) => String(h || "").trim().toLowerCase());
  const findIdx = (pred, fallback) => {
    const idx = headers.findIndex(pred);
    return idx !== -1 ? idx : fallback;
  };
  return {
    no: findIdx((h) => h === "no" || h === "no.", 0),
    instansi: findIdx((h) => h.includes("instansi"), 1),
    level: findIdx((h) => h === "level" || h.startsWith("level"), 2),
    desc: findIdx((h) => h.includes("deskripsi") || h.includes("peran"), 3),
    type: findIdx((h) => h.includes("jenis") || h.includes("proses"), 4)
  };
}

/**
 * Parse baris CSV/API satu sheet tematik menjadi daftar instansi terkelompok.
 * Menangani merge cells pada kolom NO & Instansi dan mengabaikan baris kosong.
 */
function parseThematicSheet(rows) {
  if (!Array.isArray(rows) || rows.length < 2) {
    return [];
  }

  const cols = detectColumns(rows[0]);
  const groups = [];
  let current = null;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!Array.isArray(r) || r.length === 0) continue;

    const no = normalizeText(r[cols.no]);
    const instansi = normalizeText(r[cols.instansi]);
    const level = normalizeLevel(r[cols.level]);
    const desc = normalizeText(r[cols.desc]);
    const type = normalizeText(r[cols.type]);

    const hasRoleData = level !== "" || desc !== "" || type !== "";

    if (no === "" && instansi === "" && !hasRoleData) {
      continue;
    }

    if (instansi !== "") {
      current = {
        no: no !== "" ? no : String(groups.length + 1),
        name: instansi,
        roles: []
      };
      groups.push(current);
      if (hasRoleData) {
        current.roles.push({ level, desc, type });
      }
    } else if (current) {
      if (!hasRoleData) continue;
      current.roles.push({ level, desc, type });
    }
  }

  for (const g of groups) {
    if (g.roles.length === 0) {
      g.roles.push({ level: "", desc: "", type: "" });
    }
  }

  return groups;
}

/**
 * Deteksi daftar tab & GID aktual langsung dari Google Sheets (/htmlview)
 * agar tidak pernah salah mengambil tab pertama ketika GID berubah pasca re-import.
 */
function parseTabsFromHtmlView(html) {
  const tabs = [];
  const regex = /items\.push\(\{name:\s*"([^"]+)",[^}]*gid:\s*"(\d+)"/g;
  let match;
  while ((match = regex.exec(String(html || ""))) !== null) {
    tabs.push({ name: match[1], gid: match[2] });
  }
  return tabs;
}

async function discoverSpreadsheetTabs(spreadsheetId) {
  const res = await httpsRequest(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/htmlview`);
  if (res.statusCode !== 200) {
    throw new Error(`Gagal mendeteksi daftar tab Google Sheets: HTTP ${res.statusCode}`);
  }
  const tabs = parseTabsFromHtmlView(res.body);
  if (tabs.length === 0) {
    throw new Error("Daftar tab Google Sheets tidak ditemukan pada htmlview");
  }
  return tabs;
}

function resolveTabMapping(spec, liveTabs) {
  const aliases = (spec.aliases || [spec.sheetName, spec.key]).map((a) => String(a).trim().toLowerCase());
  const matched = liveTabs.find((t) => aliases.includes(String(t.name || "").trim().toLowerCase()));
  if (!matched) {
    throw new Error(`Tab Google Sheets untuk tematik "${spec.label}" tidak ditemukan. Tab tersedia: ${liveTabs.map((t) => t.name).join(", ")}`);
  }
  return {
    ...spec,
    sheetName: matched.name,
    gid: matched.gid
  };
}

async function getGoogleAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64url(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  }));
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${claimSet}`);
  sign.end();
  const jwt = `${header}.${claimSet}.${base64url(sign.sign(privateKey))}`;
  const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const res = await httpsRequest({
    hostname: "oauth2.googleapis.com",
    path: "/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData)
    }
  }, postData);
  if (res.statusCode !== 200) throw new Error(`Gagal memperoleh OAuth token: HTTP ${res.statusCode}`);
  return JSON.parse(res.body).access_token;
}

async function fetchSheetRowsAPI(spreadsheetId, sheetName, token, apiKey) {
  const encodedRange = encodeURIComponent(`'${sheetName}'!A1:E`);
  let requestPath = `/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}?valueRenderOption=FORMATTED_VALUE`;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  else if (apiKey) requestPath += `&key=${apiKey}`;
  const res = await httpsRequest({ hostname: "sheets.googleapis.com", path: requestPath, method: "GET", headers });
  if (res.statusCode !== 200) throw new Error(`Google Sheets API error (${sheetName}): HTTP ${res.statusCode}`);
  return JSON.parse(res.body).values || [];
}

async function fetchSheetRowsCSV(spreadsheetId, resolvedSpec) {
  const isValidCsv = (r) => r && r.statusCode === 200 && r.body && r.body.length > 20 && !r.body.trim().startsWith("<!");
  // Gunakan hanya GID aktual hasil deteksi live; jangan fallback ke URL tanpa GID valid yang berisiko mengembalikan tab pertama
  const urls = [
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${resolvedSpec.gid}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${resolvedSpec.gid}`
  ];
  for (const url of urls) {
    const res = await httpsRequest(url);
    if (isValidCsv(res)) {
      return parseCSV(res.body);
    }
  }
  throw new Error(`Gagal membaca CSV Google Sheets untuk tab ${resolvedSpec.label} (gid=${resolvedSpec.gid})`);
}

async function loadThematicData(spreadsheetId, targetSpecs, env) {
  const clientEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = env.GOOGLE_PRIVATE_KEY;
  const apiKey = env.GOOGLE_API_KEY;
  if (privateKey) privateKey = privateKey.replace(/\\n/g, "\n");

  let fetchMethod = "public_csv";
  let token = null;

  if (clientEmail && privateKey) {
    fetchMethod = "service_account";
    token = await getGoogleAccessToken(clientEmail, privateKey);
  } else if (apiKey) {
    fetchMethod = "api_key";
  }

  // Selalu deteksi nama tab & GID aktual langsung dari Google Sheets
  const liveTabs = await discoverSpreadsheetTabs(spreadsheetId);
  const resolvedSpecs = targetSpecs.map((spec) => resolveTabMapping(spec, liveTabs));

  const results = await Promise.all(
    resolvedSpecs.map(async (spec) => {
      const rows = token || apiKey
        ? await fetchSheetRowsAPI(spreadsheetId, spec.sheetName, token, apiKey)
        : await fetchSheetRowsCSV(spreadsheetId, spec);
      const groups = parseThematicSheet(rows);
      return { spec, groups };
    })
  );

  const themes = {};
  const meta = {};
  for (const { spec, groups } of results) {
    themes[spec.key] = groups;
    meta[spec.key] = {
      sheetName: spec.sheetName,
      gid: spec.gid,
      totalInstansi: groups.length,
      mappedInstansi: groups.filter((g) => g.roles.some((r) => r.desc !== "")).length,
      totalRoles: groups.reduce((acc, g) => acc + g.roles.filter((r) => r.desc !== "").length, 0)
    };
  }

  return { fetchMethod, themes, meta };
}

exports.THEMATIC_SHEETS = THEMATIC_SHEETS;
exports.parseCSV = parseCSV;
exports.splitTokens = splitTokens;
exports.normalizeLevel = normalizeLevel;
exports.parseThematicSheet = parseThematicSheet;
exports.parseTabsFromHtmlView = parseTabsFromHtmlView;
exports.resolveTabMapping = resolveTabMapping;

exports.handler = async function (event) {
  const qs = (event && event.queryStringParameters) || {};
  const forceRefresh = qs.refresh === "1" || qs.refresh === "true";
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": forceRefresh ? "no-store, no-cache, must-revalidate" : "public, max-age=60, s-maxage=60"
  };

  if (event && event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const spreadsheetId = process.env.PEMETAAN_INSTANSI_SPREADSHEET_ID || DEFAULT_SPREADSHEET_ID;
  const requestedTheme = (qs.theme || "").trim();
  const targetSpecs = requestedTheme
    ? THEMATIC_SHEETS.filter((s) => s.key.toLowerCase() === requestedTheme.toLowerCase())
    : THEMATIC_SHEETS;

  if (targetSpecs.length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: `Tematik tidak dikenal: ${requestedTheme}` })
    };
  }

  const cacheKey = `${spreadsheetId}:${requestedTheme || "ALL"}`;
  const cached = responseCache.get(cacheKey);
  if (!forceRefresh && cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: cached.body
    };
  }

  try {
    const { fetchMethod, themes, meta } = await loadThematicData(spreadsheetId, targetSpecs, process.env);
    const body = JSON.stringify({
      success: true,
      source: "google_sheets",
      method: fetchMethod,
      spreadsheetId,
      tabOrder: THEMATIC_SHEETS.map((s) => s.key),
      updatedAt: new Date().toISOString(),
      meta,
      themes
    });
    responseCache.set(cacheKey, { ts: Date.now(), body });
    return { statusCode: 200, headers: corsHeaders, body };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { ...corsHeaders, "Cache-Control": "no-store" },
      body: JSON.stringify({
        success: false,
        error: `Gagal mengambil data dari Google Sheets: ${err.message}`
      })
    };
  }
};
