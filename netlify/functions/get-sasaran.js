const https = require("https");
const crypto = require("crypto");

const SASARAN_SHEETS = {
  1: { sheetName: "sasaran1.js", sheetGid: "1769541411" },
  2: { sheetName: "sasaran2.js", sheetGid: "973478513" },
  3: { sheetName: "sasaran3.js", sheetGid: "1009479719" },
  4: { sheetName: "sasaran4.js", sheetGid: "1944797946" },
  5: { sheetName: "sasaran5.js", sheetGid: "26975224" }
};

let fallbackBaseline = null;
try {
  fallbackBaseline = require("../../data/sasaran-relations.js");
} catch (e) {
  fallbackBaseline = null;
}

function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
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
        if (!redirectUrl.startsWith("http")) redirectUrl = new URL(redirectUrl, `https://${reqOptions.hostname}`).toString();
        return httpsRequest(redirectUrl, postData, maxRedirects - 1).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on("error", reject);
    req.setTimeout(12000, () => {
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
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === "\"") {
      if (inQuotes && next === "\"") {
        curVal += "\"";
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
  if (curVal || row.length > 0) {
    row.push(curVal);
    lines.push(row);
  }
  return lines;
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
  if (res.statusCode !== 200) throw new Error(`Gagal memperoleh OAuth token: ${res.body}`);
  return JSON.parse(res.body).access_token;
}

async function fetchSheetRows(spreadsheetId, sheetName, token, apiKey) {
  const encodedSheet = encodeURIComponent(sheetName);
  let requestPath = `/v4/spreadsheets/${spreadsheetId}/values/${encodedSheet}!A1:DA?valueRenderOption=UNFORMATTED_VALUE`;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  else if (apiKey) requestPath += `&key=${apiKey}`;
  const res = await httpsRequest({
    hostname: "sheets.googleapis.com",
    path: requestPath,
    method: "GET",
    headers
  });
  if (res.statusCode !== 200) throw new Error(`Google Sheets API error: HTTP ${res.statusCode} - ${res.body}`);
  return JSON.parse(res.body).values || [];
}

function cell(row, index) {
  return String(row && row[index] != null ? row[index] : "").replace(/\s+/g, " ").trim();
}

function sasaranFromCode(code) {
  const match = String(code || "").match(/^SS([1-5])-/);
  return match ? Number(match[1]) : null;
}

function findBlocks(rows) {
  const blocks = [];
  for (let headerRow = 0; headerRow < Math.min(2, rows.length); headerRow++) {
    const row = rows[headerRow] || [];
    for (let start = 0; start < row.length - 12; start++) {
      if (cell(row, start) === "No" &&
          cell(row, start + 1) === "Kelompok Sumber (Level 1)" &&
          cell(row, start + 9) === "Jenis Keterkaitan" &&
          !blocks.some(b => b.start === start)) {
        blocks.push({ start, headerRow });
      }
    }
  }
  return blocks.sort((a, b) => a.start - b.start);
}

function getBlockScope(rows, block) {
  if (cell(rows[0], block.start) === "No") return "internal";
  let label = "";
  for (let i = 0; i <= block.start; i++) {
    const value = cell(rows[0], i);
    if (value === "Internal" || value === "Eksternal") label = value;
  }
  return label === "Eksternal" ? "external" : "internal";
}

function parseSheetRows(rows, sasaranId) {
  if (!rows || rows.length < 2) return null;
  const blocks = findBlocks(rows);
  if (!blocks.length) return null;

  const internal = [];
  const external = [];

  for (const block of blocks) {
    const scope = getBlockScope(rows, block);
    const target = scope === "external" ? external : internal;
    for (let r = block.headerRow + 1; r < rows.length; r++) {
      const row = rows[r] || [];
      const no = parseInt(cell(row, block.start), 10);
      if (!Number.isFinite(no)) continue;
      const sourceId = cell(row, block.start + 3);
      const destId = cell(row, block.start + 7);
      if (!sourceId || !destId) continue;
      const sourceSasaran = sasaranFromCode(sourceId) || sasaranId;
      const destSasaran = sasaranFromCode(destId) || (scope === "internal" ? sasaranId : (sourceSasaran === 1 ? 2 : 1));
      target.push({
        id: `REL-S${sasaranId}-${scope}-${no}`,
        no,
        scope,
        sasaran: sasaranId,
        sourceSasaran,
        targetSasaran: destSasaran,
        sourceKelompok: cell(row, block.start + 1),
        sourceIndex: cell(row, block.start + 2),
        sourceId,
        sourceName: cell(row, block.start + 4),
        destKelompok: cell(row, block.start + 5),
        destIndex: cell(row, block.start + 6),
        destId,
        destName: cell(row, block.start + 8),
        jenisKeterkaitan: cell(row, block.start + 9),
        risikoRedundansi: cell(row, block.start + 10),
        alasanSubstantif: cell(row, block.start + 11),
        rekomendasi: cell(row, block.start + 12)
      });
    }
  }

  return { internal, external };
}

function scoped(data, scope) {
  if (scope === "internal") return data.internal;
  if (scope === "external") return data.external;
  return [...data.internal, ...data.external];
}

function payload(params) {
  const data = params.data;
  return {
    success: true,
    source: params.source,
    isFallback: params.isFallback === true,
    configured: true,
    method: params.method,
    spreadsheetId: params.spreadsheetId,
    sheetName: params.sheetName,
    sheetGid: params.sheetGid,
    sasaran: params.sasaran,
    scope: params.scope,
    updatedAt: new Date().toISOString(),
    totalRelations: params.relations.length,
    relations: params.relations,
    internalCount: data.internal.length,
    externalCount: data.external.length,
    data: {
      internal: data.internal,
      external: data.external
    }
  };
}

exports.parseCSV = parseCSV;
exports.parseSheetRows = parseSheetRows;
exports.SASARAN_SHEETS = SASARAN_SHEETS;

exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders, body: "" };

  const query = event.queryStringParameters || {};
  const pathMatch = String(event.path || "").match(/sasaran([1-5])(?:-|$|\/)/);
  const sasaranId = Number(query.sasaran || (pathMatch ? pathMatch[1] : (query.source || 1)));
  const sheet = SASARAN_SHEETS[sasaranId];
  if (!sheet) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Sasaran tidak dikenal." })
    };
  }

  const pathScope = /external/i.test(String(event.path || "")) ? "external" : (/internal/i.test(String(event.path || "")) ? "internal" : "all");
  const scope = ["internal", "external", "all"].includes(query.scope) ? query.scope : pathScope;
  const spreadsheetId = process.env.SPREADSHEET_ID || "1LVXNqK7ehp2fLtrFstnTcM2jiyOeWCPhR1CdC14jwDs";
  const sheetName = process.env[`SHEET_NAME_SASARAN${sasaranId}`] || sheet.sheetName;
  const sheetGid = process.env[`SHEET_GID_SASARAN${sasaranId}`] || sheet.sheetGid;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const apiKey = process.env.GOOGLE_API_KEY;
  if (privateKey) privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    let rows = [];
    let method = "public_export";
    if (clientEmail && privateKey) {
      method = "service_account";
      const token = await getGoogleAccessToken(clientEmail, privateKey);
      rows = await fetchSheetRows(spreadsheetId, sheetName, token, null);
    } else if (apiKey) {
      method = "api_key";
      rows = await fetchSheetRows(spreadsheetId, sheetName, null, apiKey);
    } else {
      const gidUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetGid}`;
      let res = await httpsRequest(gidUrl);
      if (res.statusCode === 200 && res.body) rows = parseCSV(res.body);
      if (!rows.length) {
        method = "public_gviz";
        const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
        res = await httpsRequest(csvUrl);
        if (res.statusCode === 200 && res.body) rows = parseCSV(res.body);
      }
    }

    const data = parseSheetRows(rows, sasaranId);
    if (!data || (data.internal.length === 0 && data.external.length === 0)) {
      throw new Error(`Tidak ada relasi valid pada sheet ${sheetName}.`);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(payload({
        source: "google_sheets",
        method,
        spreadsheetId,
        sheetName,
        sheetGid,
        sasaran: sasaranId,
        scope,
        data,
        relations: scoped(data, scope)
      }))
    };
  } catch (err) {
    const fallback = fallbackBaseline && fallbackBaseline[String(sasaranId)];
    if (fallback) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(payload({
          source: "verified_baseline_fallback",
          isFallback: true,
          method: "baseline",
          spreadsheetId,
          sheetName,
          sheetGid,
          sasaran: sasaranId,
          scope,
          data: fallback,
          relations: scoped(fallback, scope)
        }))
      };
    }
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
