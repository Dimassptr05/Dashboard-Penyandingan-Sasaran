/**
 * ============================================================================
 * NETLIFY FUNCTION: get-sasaran4
 * Endpoint: /.netlify/functions/get-sasaran4 (atau /api/sasaran4)
 * Single Source of Truth: Google Sheets "Kerja Kelompok 1"
 * ============================================================================
 */

const https = require("https");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Load baseline backup jika ada masalah koneksi Google Sheets
let fallbackBaseline = null;
try {
  const baselinePath = path.resolve(__dirname, "../../data/sasaran4-verified-baseline.json");
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

// Request HTTPS yang otomatis mengikuti redirect (301, 302, 307)
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
      // Mengikuti redirect jika ada
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

// Parser CSV mandiri untuk format ekspor Google Sheets
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

// 1. Dapatkan Access Token Google via Service Account (OAuth2 JWT)
async function getGoogleAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    })
  );

  const cleanPrivateKey = privateKey.replace(/\\n/g, "\n");
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = signer
    .sign(cleanPrivateKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${header}.${claim}.${signature}`;
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
    throw new Error(`Gagal autentikasi Service Account: HTTP ${res.statusCode} - ${res.body}`);
  }

  const tokenData = JSON.parse(res.body);
  return tokenData.access_token;
}

// 2. Ambil baris data dari Google Sheets API v4
async function fetchSheetRows(spreadsheetId, sheetName, token, apiKey) {
  const encodedSheet = encodeURIComponent(sheetName);
  let requestPath = `/v4/spreadsheets/${spreadsheetId}/values/${encodedSheet}!A1:CG?valueRenderOption=UNFORMATTED_VALUE`;
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

// 3. Normalisasi teks instrumen pembanding
function normalizeComparatorInst(instStr, dstCode) {
  if (!instStr) {
    if (dstCode && dstCode.startsWith("SS4-")) {
      return dstCode.split(".")[0].replace("SS4-", "");
    }
    return "IPPN";
  }
  const s = String(instStr).toUpperCase();
  if (s.includes("IPPN") || s.includes("PERENCANAAN")) return "IPPN";
  if (s.includes("CKKP") || s.includes("CAPAIAN")) return "CKKP";
  if (s.includes("SPIP") || s.includes("PENGENDALIAN")) return "SPIP";
  if (s.includes("SAKIP") || s.includes("AKUNTABILITAS")) return "SAKIP";
  if (s.includes("ELPPD") || s.includes("LPPD")) return "ELPPD";
  if (s.includes("IKPA") || s.includes("PELAKSANAAN ANGGARAN")) return "IKPA";
  if (s.includes("IPA") || s.includes("PENGELOLAAN ASET")) return "IPA";
  return s.trim();
}

// 4. Ekstraksi dan Pembersihan Alasan (Kolom L) sesuai Aturan Khusus
function extractAlasanSubstantif(rawVal) {
  if (!rawVal) return "";
  const str = String(rawVal).trim();
  if (!str) return "";

  // Kondisi A: Memuat penanda 'Hasil analisis AI =' atau variasi sejenis
  const aiRegex = /Hasil\s+analisis\s+AI\s*[:=]\s*([\s\S]*)/i;
  const match = str.match(aiRegex);
  if (match && match[1]) {
    return match[1].trim();
  }

  // Kondisi B: Tidak ada penanda, gunakan seluruh isi kolom L
  return str;
}

// 5. Validasi Jenis Keterkaitan (Kolom J)
function normalizeJenis(rawJenis) {
  if (!rawJenis) return "Mendukung";
  const s = String(rawJenis).trim().toLowerCase();
  if (s === "langsung") return "Langsung";
  if (s === "mendukung") return "Mendukung";
  if (s.includes("tidak")) return "Tidak Langsung";
  return String(rawJenis).trim();
}

// 6. Parser Baris Data Google Sheets
function parseSheetRows(rows) {
  if (!rows || rows.length < 2) return null;

  // Header detection di baris 0 atau 1
  let headerRowIdx = 0;
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const r = rows[i].map((c) => String(c || "").toLowerCase());
    if (r.some((c) => c.includes("indikator kk") || c.includes("id indikator"))) {
      headerRowIdx = i;
      break;
    }
  }

  const header = rows[headerRowIdx].map((c) => String(c || "").trim().toLowerCase());
  const colMap = {
    src_code: -1,
    src_aspek: -1,
    src_kelompok: -1,
    src_ind: -1,
    src_def: -1,
    dst_inst: -1,
    dst_code: -1,
    dst_rincian: -1,
    jenis: -1,
    alasan_edit: -1,
    rekomendasi: -1
  };

  header.forEach((h, idx) => {
    if (h.includes("id indikator kk")) colMap.src_code = idx;
    else if (h.includes("aspek kk")) colMap.src_aspek = idx;
    else if (h.includes("kelompok kk")) colMap.src_kelompok = idx;
    else if (h.includes("indikator kk")) colMap.src_ind = idx;
    else if (h.includes("definisi operasional")) colMap.src_def = idx;
    else if (h.includes("indeks pembanding")) colMap.dst_inst = idx;
    else if (h.includes("id indikator pembanding")) colMap.dst_code = idx;
    else if (h.includes("indikator / rincian") || h.includes("rincian pembanding")) colMap.dst_rincian = idx;
    else if (h.includes("informasi keterkaitan")) colMap.jenis = idx;
    else if (h.includes("alasan / justifikasi substantif edit")) colMap.alasan_edit = idx;
    else if (h.includes("perlakuan / to-do") || h.includes("rekomendasi")) colMap.rekomendasi = idx;
  });

  // Posisi fallback standar jika header tidak cocok sempurna
  if (colMap.src_code === -1) colMap.src_code = 1;
  if (colMap.src_aspek === -1) colMap.src_aspek = 2;
  if (colMap.src_kelompok === -1) colMap.src_kelompok = 3;
  if (colMap.src_ind === -1) colMap.src_ind = 4;
  if (colMap.src_def === -1) colMap.src_def = 5;
  if (colMap.dst_inst === -1) colMap.dst_inst = 6;
  if (colMap.dst_code === -1) colMap.dst_code = 7;
  if (colMap.dst_rincian === -1) colMap.dst_rincian = 8;
  if (colMap.jenis === -1) colMap.jenis = 9;
  if (colMap.alasan_edit === -1) colMap.alasan_edit = 11;
  if (colMap.rekomendasi === -1) colMap.rekomendasi = 17;

  let lastAspek = "";
  let lastKelompok = "";
  const parsedRelations = [];
  const justifikasiMap = {};
  const aspekCounts = {};
  const kelompokCounts = {};
  const instCounts = {};
  const jenisCounts = { Langsung: 0, Mendukung: 0, "Tidak Langsung": 0 };
  const catalog = {};
  const instrumentColumns = {
    IPPN: { id: 9, fields: { indikator: 10, sub_indikator: 11, status_penilaian: 12, definisi_operasional: 13 }, hierarchy: ["indikator"] },
    CKKP: { id: 17, fields: { kategori: 18, indikator: 19, cakupan: 20, definisi_operasional: 21 }, hierarchy: ["kategori", "indikator", "cakupan"] },
    SPIP: { id: 25, fields: { komponen: 26, unsur: 27, sub_uraian: 28, definisi_operasional: 29 }, hierarchy: ["komponen", "unsur"] },
    SAKIP: { id: 33, fields: { komponen: 34, sub_komponen: 35, kriteria: 36, definisi_operasional: 37 }, hierarchy: ["komponen", "sub_komponen"] },
    ELPPD: { id: 41, fields: { aspek: 42, sub_aspek: 43, indikator: 44, definisi_operasional: 45 }, hierarchy: ["aspek", "sub_aspek"] },
    IKPA: { id: 49, fields: { aspek: 50, indikator: 51, pernyataan: 52, definisi_operasional: 53 }, hierarchy: ["aspek"] },
    IPA: { id: 58, fields: { sasaran_strategis: 59, parameter: 60, sub_parameter: 61, definisi_operasional: 62 }, hierarchy: ["sasaran_strategis", "parameter"] }
  };
  const lastHierarchy = Object.fromEntries(
    Object.entries(instrumentColumns).map(([code, config]) => [code, Object.fromEntries(config.hierarchy.map(field => [field, ""]))])
  );

  for (let rIdx = headerRowIdx + 1; rIdx < rows.length; rIdx++) {
    const r = rows[rIdx];
    if (!r || r.length === 0) continue;

    for (const [instrument, config] of Object.entries(instrumentColumns)) {
      const code = String(r[config.id] || "").trim();
      if (!code.startsWith(`SS4-${instrument}.`)) continue;
      const fields = {};
      for (const [field, col] of Object.entries(config.fields)) {
        const value = String(r[col] || "").trim();
        if (config.hierarchy.includes(field)) {
          if (value) lastHierarchy[instrument][field] = value;
          fields[field] = value || lastHierarchy[instrument][field];
        } else {
          fields[field] = value;
        }
      }
      catalog[code] = fields;
    }

    const rawSrcCode = r[colMap.src_code];
    if (!rawSrcCode) continue;
    const srcCode = String(rawSrcCode).trim();
    if (!srcCode.startsWith("SS4-KK")) continue;

    // Forward fill struktur pengelompokan
    const rawAspek = r[colMap.src_aspek];
    if (rawAspek && String(rawAspek).trim()) {
      lastAspek = String(rawAspek).trim();
    }
    const rawKelompok = r[colMap.src_kelompok];
    if (rawKelompok && String(rawKelompok).trim()) {
      lastKelompok = String(rawKelompok).trim();
    }

    const srcInd = r[colMap.src_ind] ? String(r[colMap.src_ind]).trim() : "";
    const srcDef = r[colMap.src_def] ? String(r[colMap.src_def]).trim() : "";
    const dstInstRaw = r[colMap.dst_inst] ? String(r[colMap.dst_inst]).trim() : "";
    const dstCode = r[colMap.dst_code] ? String(r[colMap.dst_code]).trim() : "";
    const dstInst = normalizeComparatorInst(dstInstRaw, dstCode);
    const dstRincian = r[colMap.dst_rincian] ? String(r[colMap.dst_rincian]).trim() : "";

    const jenis = normalizeJenis(r[colMap.jenis]);
    const alasan = extractAlasanSubstantif(r[colMap.alasan_edit]);
    const rekomendasi = r[colMap.rekomendasi] ? String(r[colMap.rekomendasi]).trim() : "";

    // Agregasi statistik dinamis
    aspekCounts[lastAspek] = (aspekCounts[lastAspek] || 0) + 1;
    kelompokCounts[lastKelompok] = (kelompokCounts[lastKelompok] || 0) + 1;
    instCounts[dstInst] = (instCounts[dstInst] || 0) + 1;
    if (jenisCounts[jenis] !== undefined) {
      jenisCounts[jenis]++;
    } else {
      jenisCounts[jenis] = 1;
    }

    const pairId = `${srcCode}_${dstCode}`;
    parsedRelations.push({
      id: pairId,
      row: rIdx + 1,
      sourceCode: srcCode,
      sourceAspek: lastAspek,
      sourceKelompok: lastKelompok,
      sourceIndikator: srcInd,
      sourceDefinisi: srcDef,
      destInst: dstInst,
      destCode: dstCode,
      destRincian: dstRincian,
      jenis: jenis,
      alasan: alasan,
      rekomendasi: rekomendasi
    });

    justifikasiMap[pairId] = {
      jenis: jenis,
      alasan: alasan,
      rekomendasi: rekomendasi
    };
  }

  return {
    totalRelations: parsedRelations.length,
    relations: parsedRelations,
    justifikasi: justifikasiMap,
    catalog,
    summary: {
      aspekCounts,
      kelompokCounts,
      instCounts,
      jenisCounts
    }
  };
}

exports.parseSheetRows = parseSheetRows;

// 7. Handler Utama Netlify Functions
exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const spreadsheetId = process.env.SPREADSHEET_ID || "1LVXNqK7ehp2fLtrFstnTcM2jiyOeWCPhR1CdC14jwDs";
  const sheetName = process.env.SHEET_NAME || "sasaran4-js";
  const sheetGid = process.env.SHEET_GID || "1944797946";
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const apiKey = process.env.GOOGLE_API_KEY;

  const hasServiceAccount = Boolean(serviceAccountEmail && privateKey);
  const hasApiKey = Boolean(apiKey);
  const hasSpreadsheet = Boolean(spreadsheetId);

  if (!hasSpreadsheet) {
    // Kembalikan baseline dataset terverifikasi dengan instruksi navigasi Netlify Free
    if (fallbackBaseline) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          source: "verified_baseline",
          configured: false,
          updatedAt: new Date().toISOString(),
          message: "SPREADSHEET_ID belum disetel pada Environment Variables Netlify. Dashboard menggunakan dataset baseline terverifikasi.",
          totalRelations: fallbackBaseline.total,
          relations: fallbackBaseline.relations,
          justifikasi: fallbackBaseline.justifikasi,
          setupGuide: {
            step1: "Di Netlify: Buka menu 'Projects' (bukan Team settings)",
            step2: "Pilih website/proyek dashboard Anda -> 'Site configuration' -> 'Environment variables'",
            step3: "Klik tombol 'Add a variable' (100% GRATIS untuk semua akun Netlify Free)",
            step4: "Tambahkan SPREADSHEET_ID dengan ID Google Sheets 'Kerja Kelompok 1'"
          }
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Kredensial Google Sheets belum dikonfigurasi dan dataset baseline tidak ditemukan."
      })
    };
  }

  try {
    let rows = [];
    let fetchMethod = "service_account";

    if (hasServiceAccount) {
      const token = await getGoogleAccessToken(serviceAccountEmail, privateKey);
      rows = await fetchSheetRows(spreadsheetId, sheetName, token, null);
    } else if (hasApiKey) {
      fetchMethod = "api_key";
      rows = await fetchSheetRows(spreadsheetId, sheetName, null, apiKey);
    } else {
      // Akses publik via Google Sheets export CSV / gviz (Zero Setup Google Cloud!)
      fetchMethod = "public_export";

      // 1. Coba fetch dengan SHEET_GID jika disediakan
      if (sheetGid) {
        const gidUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetGid}`;
        const resGid = await httpsRequest(gidUrl);
        if (resGid.statusCode === 200 && resGid.body) {
          rows = parseCSV(resGid.body);
        }
      }

      // 2. Coba fetch dengan SHEET_NAME via gviz
      if (rows.length === 0 && sheetName) {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
        const res = await httpsRequest(csvUrl);
        if (res.statusCode === 200 && res.body) {
          rows = parseCSV(res.body);
        }
      }

      // 3. Fallback ke export CSV umum
      if (rows.length === 0) {
        const altUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
        const resAlt = await httpsRequest(altUrl);
        if (resAlt.statusCode === 200 && resAlt.body) {
          rows = parseCSV(resAlt.body);
        } else {
          throw new Error(`Gagal membaca Google Sheets publik (HTTP ${resAlt.statusCode}). Pastikan akses sheet disetel ke 'Anyone with link can view'.`);
        }
      }
    }

    const parsedData = parseSheetRows(rows);

    if (!parsedData || parsedData.totalRelations === 0) {
      throw new Error("Tidak ada baris relasi Sasaran 4 yang valid ditemukan pada sheet tersebut.");
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        source: "google_sheets",
        method: fetchMethod,
        configured: true,
        spreadsheetId: spreadsheetId,
        sheetName: sheetName,
        updatedAt: new Date().toISOString(),
        totalRelations: parsedData.totalRelations,
        relations: parsedData.relations,
        justifikasi: parsedData.justifikasi,
        catalog: parsedData.catalog,
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
          justifikasi: fallbackBaseline.justifikasi
        })
      };
    }

    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
};
