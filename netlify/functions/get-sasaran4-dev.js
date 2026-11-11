/**
 * ============================================================================
 * NETLIFY FUNCTION: get-sasaran4-dev
 * Endpoint: /.netlify/functions/get-sasaran4-dev (atau /api/sasaran4-dev)
 * Single Source of Truth: Google Sheets "sasaran 4 -dev"
 * Dataset: 447 Relasi Multi-Indeks (3 Kelompok, 8 Indeks Sumber/Pembanding)
 * ============================================================================
 */

const https = require("https");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Load baseline backup jika ada masalah koneksi Google Sheets
let fallbackBaseline = null;
try {
  const baselinePath = path.resolve(__dirname, "../../data/sasaran4-dev-verified-baseline.json");
  if (fs.existsSync(baselinePath)) {
    fallbackBaseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  }
} catch (e) {
  // Silent catch
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function httpsRequest(optionsOrUrl, postData = null, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    let urlObj;
    if (typeof optionsOrUrl === "string") {
      urlObj = new URL(optionsOrUrl);
    } else {
      urlObj = new URL(`https://${optionsOrUrl.hostname || "sheets.googleapis.com"}${optionsOrUrl.path || "/"}`);
    }

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
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on("error", (err) => reject(err));
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    if (postData) {
      req.write(postData);
    }
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
  if (curVal || row.length > 0) {
    row.push(curVal);
    lines.push(row);
  }
  return lines;
}

async function getGoogleAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    })
  );

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${claimSet}`);
  sign.end();
  const signature = base64url(sign.sign(privateKey));
  const jwt = `${header}.${claimSet}.${signature}`;

  const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
  const res = await httpsRequest(
    {
      hostname: "oauth2.googleapis.com",
      path: "/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData)
      }
    },
    postData
  );

  if (res.statusCode !== 200) {
    throw new Error(`Gagal memperoleh OAuth token: ${res.body}`);
  }

  const tokenData = JSON.parse(res.body);
  return tokenData.access_token;
}

async function fetchSheetRows(spreadsheetId, sheetName, token, apiKey) {
  const encodedSheet = encodeURIComponent(sheetName);
  let requestPath = `/v4/spreadsheets/${spreadsheetId}/values/${encodedSheet}!A1:V?valueRenderOption=UNFORMATTED_VALUE`;
  const headers = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (apiKey) {
    requestPath += `&key=${apiKey}`;
  }

  const res = await httpsRequest({
    hostname: "sheets.googleapis.com",
    path: requestPath,
    method: "GET",
    headers
  });

  if (res.statusCode !== 200) {
    throw new Error(`Google Sheets API error: HTTP ${res.statusCode} - ${res.body}`);
  }

  const body = JSON.parse(res.body);
  return body.values || [];
}

function parseSheetRows(rows) {
  if (!rows || rows.length < 2) return null;

  // Header pada baris 0
  const dataRows = rows.slice(1).filter(r => r.length > 3 && r[0] && String(r[0]).trim());
  const relations = [];

  const jenisCounts = {};
  const risikoCounts = {};
  const groupSourceCounts = {};
  const indexSourceCounts = {};
  const indexDestCounts = {};

  for (let idx = 0; idx < dataRows.length; idx++) {
    const r = dataRows[idx];
    const no = parseInt(r[0], 10) || (idx + 1);
    const kelSrc = (r[1] || "").toString().trim();
    const indSrc = (r[2] || "").toString().trim();
    const idSrc = (r[3] || "").toString().trim();
    const nameSrc = (r[4] || "").toString().trim();

    const kelDst = (r[5] || "").toString().trim();
    const indDst = (r[6] || "").toString().trim();
    const idDst = (r[7] || "").toString().trim();
    const nameDst = (r[8] || "").toString().trim();

    const jenis = (r[9] || "").toString().trim();
    const risiko = (r[10] || "").toString().trim();
    const alasan = (r[11] || "").toString().trim();
    const rekomendasi = (r[12] || "").toString().trim();

    const jenisAsli = (r[13] || "").toString().trim();
    const alasanAsli = (r[14] || "").toString().trim();
    const dasarKlasifikasi = (r[15] || "").toString().trim();
    const dasarRisiko = (r[16] || "").toString().trim();
    const jejak = (r[17] || "").toString().trim();
    const statusValidasi = (r[18] || "").toString().trim();
    const indSrcAsli = (r[19] || "").toString().trim();
    const indDstAsli = (r[20] || "").toString().trim();
    const intiRisiko = (r[21] || "").toString().trim();

    jenisCounts[jenis] = (jenisCounts[jenis] || 0) + 1;
    risikoCounts[risiko] = (risikoCounts[risiko] || 0) + 1;
    groupSourceCounts[kelSrc] = (groupSourceCounts[kelSrc] || 0) + 1;
    indexSourceCounts[indSrc] = (indexSourceCounts[indSrc] || 0) + 1;
    indexDestCounts[indDst] = (indexDestCounts[indDst] || 0) + 1;

    relations.push({
      no,
      sourceKelompok: kelSrc,
      sourceIndex: indSrc,
      sourceId: idSrc,
      sourceName: nameSrc,
      destKelompok: kelDst,
      destIndex: indDst,
      destId: idDst,
      destName: nameDst,
      jenisKeterkaitan: jenis,
      risikoRedundansi: risiko,
      alasanSubstantif: alasan,
      rekomendasi: rekomendasi,
      jenisPenyandinganAsli: jenisAsli,
      alasanAsli: alasanAsli,
      dasarKlasifikasi: dasarKlasifikasi,
      dasarRisiko: dasarRisiko,
      jejakSumber: jejak,
      statusValidasi: statusValidasi,
      indeksSumberAsli: indSrcAsli,
      indeksTerkaitAsli: indDstAsli,
      intiRisiko: intiRisiko
    });
  }

  return {
    totalRelations: relations.length,
    relations,
    summary: {
      jenisKeterkaitan: jenisCounts,
      risikoRedundansi: risikoCounts,
      kelompokSumber: groupSourceCounts,
      indeksSumber: indexSourceCounts,
      indeksPembanding: indexDestCounts
    }
  };
}

exports.handler = async function (event, context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const spreadsheetId = process.env.SPREADSHEET_ID || "1LVXNqK7ehp2fLtrFstnTcM2jiyOeWCPhR1CdC14jwDs";
  const sheetName = process.env.SHEET_NAME_SASARAN4_DEV || "sasaran 4 -dev";
  const sheetGid = process.env.SHEET_GID_SASARAN4_DEV || "1144784169";
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  try {
    let rows = [];
    let fetchMethod = "unknown";

    if (clientEmail && privateKey) {
      fetchMethod = "service_account";
      const token = await getGoogleAccessToken(clientEmail, privateKey);
      rows = await fetchSheetRows(spreadsheetId, sheetName, token, null);
    } else if (apiKey) {
      fetchMethod = "api_key";
      rows = await fetchSheetRows(spreadsheetId, sheetName, null, apiKey);
    } else {
      fetchMethod = "public_gviz";
      let csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${sheetGid}`;
      let res = await httpsRequest(csvUrl);
      if (res.statusCode !== 200 || !res.body || res.body.length < 500) {
        csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
        res = await httpsRequest(csvUrl);
      }
      if (res.statusCode === 200 && res.body) {
        rows = parseCSV(res.body);
      } else {
        throw new Error(`Gagal membaca Google Sheets publik (HTTP ${res.statusCode}).`);
      }
    }

    const parsedData = parseSheetRows(rows);
    if (!parsedData || parsedData.totalRelations === 0) {
      throw new Error("Tidak ada baris relasi Sasaran 4-dev yang valid ditemukan.");
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        source: "google_sheets",
        method: fetchMethod,
        configured: true,
        spreadsheetId,
        sheetName,
        updatedAt: new Date().toISOString(),
        totalRelations: parsedData.totalRelations,
        relations: parsedData.relations,
        summary: parsedData.summary
      })
    };
  } catch (err) {
    if (fallbackBaseline) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          source: "verified_baseline_fallback",
          configured: true,
          warning: `Gagal membaca Google Sheets: ${err.message}. Menggunakan dataset baseline terverifikasi.`,
          updatedAt: new Date().toISOString(),
          totalRelations: fallbackBaseline.total,
          relations: fallbackBaseline.relations,
          summary: fallbackBaseline.summary
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
};

