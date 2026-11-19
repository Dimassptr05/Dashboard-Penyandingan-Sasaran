/**
 * ============================================================================
 * NETLIFY FUNCTION: get-indeks-score
 * Endpoint: /.netlify/functions/get-indeks-score (atau /api/indeks-score)
 * Single Source of Truth: Google Sheets Evaluasi Indeks Score 2025
 * Default Tab: "Sheet1" (GID: 0) — 642 Instansi, 26 Indikator (Kolom Biru)
 *
 * TERPISAH TOTAL dari konfigurasi Sasaran 4 (tidak membaca SPREADSHEET_ID,
 * SHEET_NAME_SASARAN4_DEV, atau SHEET_GID_SASARAN4_DEV).
 * ============================================================================
 */

const https = require("https");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// 26 Indikator Penilaian sesuai seluruh kolom biru (#83cceb, kolom E–AX) pada Sheet1.
// 20 indikator memiliki kolom Kategori sumber; 6 indikator lainnya tetap dibaca nilainya dengan status belum terklasifikasi.
const INDICATOR_SPECS = [
  { name: "Persentase Penyederhanaan Struktur Organisasi", catname: null },
  { name: "Tingkat Capaian Sistem Kerja untuk Penyederhanaan Birokrasi", catname: "Kategori Tingkat Capaian Sistem Kerja untuk Penyederhanaan Birokrasi" },
  { name: "Tingkat Maturitas SPIP", catname: "Kategori Tingkat Maturitas SPIP" },
  { name: "Tingkat Keberhasilan Pembangunan ZI", catname: null },
  { name: "Nilai SAKIP", catname: "Kategori Nilai SAKIP" },
  { name: "Indeks Perencanaan Pembangunan", catname: "Kategori Indeks Perencanaan Pembangunan" },
  { name: "Tingkat Implementasi Kebijakan Arsitektur SPBE", catname: "Kategori Tingkat Implementasi Kebijakan Arsitektur SPBE" },
  { name: "Tingkat Digitalisasi Arsip", catname: "Kategori Tingkat Digitalisasi Arsip" },
  { name: "Indikator Kinerja Pelaksanaan Anggaran", catname: "Kategori Indikator Kinerja Pelaksanaan Anggaran" },
  { name: "Indeks Pengelolaan Aset", catname: "Kategori Indeks Pengelolaan Aset" },
  { name: "Tingkat tindak lanjut pengaduan masyarakat (LAPOR) yang sudah diselesaikan", catname: "Kategori Tingkat tindak lanjut pengaduan masyarakat (LAPOR) yang sudah diselesaikan" },
  { name: "Indeks Kualitas Kebijakan", catname: "Kategori Indeks Kualitas Kebijakan" },
  { name: "Indeks Reformasi Hukum", catname: "Kategori Indeks Reformasi Hukum" },
  { name: "Indeks Pembangunan Statistik", catname: "Kategori Indeks Pembangunan Statistik" },
  { name: "Indeks Tata Kelola Pengadaan", catname: "Kategori Indeks Tata Kelola Pengadaan" },
  { name: "Indeks Sistem Merit", catname: "Kategori Indeks Sistem Merit" },
  { name: "Indeks Pelayanan Publik", catname: "Kategori Indeks Pelayanan Publik" },
  { name: "Tingkat Kepatuhan Standar Pelayanan Publik", catname: "Kategori Tingkat Kepatuhan Standar Pelayanan Publik" },
  { name: "Indeks SPBE", catname: null },
  { name: "Capaian Prioritas Nasional", catname: "Kategori Capaian Prioritas Nasional" },
  { name: "Capaian IKU Kementerian/Lembaga", catname: null },
  { name: "Opini BPK", catname: null },
  { name: "Tindak Lanjut Rekomendasi", catname: null },
  { name: "Indeks BerAkhlak", catname: "Kategori Indeks BerAkhlak" },
  { name: "Survei Penilaian Integritas", catname: "Kategori Survei Penilaian Integritas" },
  { name: "Survei Kepuasan Masyarakat", catname: "Kategori Survei Kepuasan Masyarakat" }
];

let fallbackBaseline = null;
try {
  const baselinePath = path.resolve(__dirname, "../../data/indeks-score-2025-verified-baseline.json");
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

const MONTH_MAP = {
  jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6,
  jul: 7, agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10,
  nov: 11, des: 12, dec: 12
};

/**
 * Normalisasi nilai numerik khusus kolom skor indikator.
 * - Kosong / "-" -> null (tidak pernah disamakan dengan 0).
 * - "0" / "0,00" -> 0 (tetap 0).
 * - Koma desimal Indonesia ("3,42") & titik ("3.42") -> 3.42.
 * - Menangani sel skor yang terformat tanggal Excel/Sheets (mis. "3-Apr" / "04/03/2025" / serial 45xxx)
 *   tanpa mengubah angka skor normal (0..500).
 */
function parseScoreValue(raw) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") {
    if (!Number.isFinite(raw)) return null;
    // Serial tanggal Excel (sekitar tahun 2000-2040) tidak boleh dibaca mentah sebagai skor indikator
    if (raw >= 36526 && raw <= 51500) {
      const utcMs = Math.round((raw - 25569) * 86400 * 1000);
      const d = new Date(utcMs);
      const m = d.getUTCMonth() + 1;
      const day = d.getUTCDate();
      return Number(`${m}.${String(day).padStart(2, "0")}`);
    }
    return Math.round(raw * 100) / 100;
  }

  const s = String(raw).trim();
  if (!s || s === "-" || s === "—" || /^n\/?a$/i.test(s)) return null;

  // Format numerik standar (titik atau koma desimal, tanpa ribuan campur)
  if (/^-?\d+([.,]\d+)?$/.test(s)) {
    const n = Number(s.replace(",", "."));
    return Number.isFinite(n) ? parseScoreValue(n) : null;
  }

  // Format tanggal teks seperti "3-Apr", "03-Apr-25", "Apr-03" akibat auto-format Excel pada skor x.xx
  const dmText = s.match(/^(\d{1,2})[-/\s]([A-Za-z]{3,})(?:[-/\s](\d{2,4}))?$/);
  if (dmText) {
    const day = Number(dmText[1]);
    const mon = MONTH_MAP[dmText[2].slice(0, 3).toLowerCase()];
    if (mon && day >= 1 && day <= 31) {
      return Number(`${day}.${String(mon).padStart(2, "0")}`);
    }
  }
  const mdText = s.match(/^([A-Za-z]{3,})[-/\s](\d{1,2})(?:[-/\s](\d{2,4}))?$/);
  if (mdText) {
    const mon = MONTH_MAP[mdText[1].slice(0, 3).toLowerCase()];
    const day = Number(mdText[2]);
    if (mon && day >= 1 && day <= 31) {
      return Number(`${mon}.${String(day).padStart(2, "0")}`);
    }
  }

  // Format tanggal ISO / slash (YYYY-MM-DD atau DD/MM/YYYY) pada kolom skor
  const isoDate = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoDate) {
    const mon = Number(isoDate[2]);
    const day = Number(isoDate[3]);
    return Number(`${mon}.${String(day).padStart(2, "0")}`);
  }
  const slashDate = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slashDate) {
    const a = Number(slashDate[1]);
    const b = Number(slashDate[2]);
    return Number(`${a}.${String(b).padStart(2, "0")}`);
  }

  return null;
}

function inferInstansiType(name) {
  const n = String(name || "").trim();
  if (/^Kementerian\b/i.test(n)) return "Kementerian";
  if (/^(Pemerintah\s+)?Provinsi\b/i.test(n)) return "Provinsi";
  if (/^(Pemerintah\s+)?(Kabupaten|Kab\.)\b/i.test(n)) return "Kabupaten";
  if (/^(Pemerintah\s+)?Kota\b/i.test(n)) return "Kota";
  return "Lembaga";
}

function classifyCategory(indicatorName, rawCategory) {
  if (rawCategory === null || rawCategory === undefined) return null;
  const cat = String(rawCategory).trim();
  if (!cat || cat === "-" || cat === "—") return null;
  const lower = cat.toLowerCase();

  // Aturan khusus berbasis instrumen (terverifikasi terhadap referensi 2025)
  if (indicatorName === "Survei Penilaian Integritas") {
    if (lower === "hijau") return "good";
    if (lower === "kuning" || lower === "merah") return "below";
    return null;
  }

  if (indicatorName === "Indeks Pelayanan Publik") {
    // 87 entri "B- - Baik dengan Catatan" dikelompokkan sebagai "below" sesuai referensi terbaru
    if (lower.startsWith("b-")) return "below";
    if (lower.startsWith("a -") || lower.startsWith("a- -") || lower.startsWith("b -")) return "good";
    return "below";
  }

  if (indicatorName === "Indeks BerAkhlak") {
    if (lower.startsWith("a -")) return "good";
    if (lower.includes("tidak sehat") || lower.includes("cukup sehat") || lower.startsWith("b -") || lower.startsWith("c -") || lower.startsWith("d -")) {
      return "below";
    }
    return null;
  }

  if (indicatorName === "Tingkat Capaian Sistem Kerja untuk Penyederhanaan Birokrasi") {
    const m = lower.match(/^(\d)\s*-/);
    if (m) return Number(m[1]) >= 4 ? "good" : "below";
  }

  if (
    indicatorName === "Tingkat Maturitas SPIP" ||
    indicatorName === "Tingkat Implementasi Kebijakan Arsitektur SPBE"
  ) {
    const m = lower.match(/level\s*(\d)/);
    if (m) return Number(m[1]) >= 3 ? "good" : "below";
  }

  if (indicatorName === "Tingkat tindak lanjut pengaduan masyarakat (LAPOR) yang sudah diselesaikan") {
    const m = lower.match(/^(\d)\s*-/);
    if (m) return Number(m[1]) >= 4 ? "good" : "below";
  }

  if (indicatorName === "Indeks Reformasi Hukum") {
    if (lower.startsWith("aa ") || lower.startsWith("a ") || lower.startsWith("bb ")) return "good";
    return "below";
  }

  if (indicatorName === "Nilai SAKIP") {
    if (lower.startsWith("aa ") || lower.startsWith("a ") || lower.startsWith("bb ") || lower.startsWith("b ")) return "good";
    return "below";
  }

  if (indicatorName === "Tingkat Kepatuhan Standar Pelayanan Publik") {
    if (lower.includes("zona hijau")) return "good";
    return "below";
  }

  if (indicatorName === "Survei Kepuasan Masyarakat") {
    if (lower.startsWith("a ") || lower.startsWith("b ")) return "good";
    return "below";
  }

  // Klasifikasi ordinal umum (periksa label negatif/cukup lebih dulu agar tidak tertukar dengan "Baik")
  if (
    lower.includes("tidak baik") ||
    lower.includes("kurang baik") ||
    lower.includes("cukup baik") ||
    lower.includes("dengan catatan") ||
    lower.includes("prioritas pembinaan") ||
    lower.includes("sangat kurang") ||
    lower.includes("kurang") ||
    lower.includes("cukup") ||
    lower.includes("buruk") ||
    lower.includes("merah") ||
    lower.includes("kuning")
  ) {
    return "below";
  }

  if (
    lower.includes("istimewa") ||
    lower.includes("unggul") ||
    lower.includes("prima") ||
    lower.includes("memuaskan") ||
    lower.includes("sangat baik") ||
    lower.includes("baik") ||
    lower.includes("sehat")
  ) {
    return "good";
  }

  return null;
}

function parseSheetRows(rows) {
  if (!rows || rows.length < 2) return null;

  const headers = rows[0].map((h) => String(h || "").trim());
  const nameIdx = headers.findIndex((h) => h.toLowerCase() === "nama instansi");
  const rbIdx = headers.findIndex((h) => h.toLowerCase() === "indeks rb");
  const typeIdx = headers.findIndex((h) => h.toLowerCase() === "kategori instansi");

  if (nameIdx === -1) {
    throw new Error("Header wajib 'Nama Instansi' tidak ditemukan pada sheet Indeks Score.");
  }

  const indicators = [];
  const missingHeaders = [];
  for (const spec of INDICATOR_SPECS) {
    const v = headers.indexOf(spec.name);
    const c = spec.catname ? headers.indexOf(spec.catname) : -1;
    if (v === -1 || (spec.catname && c === -1)) {
      missingHeaders.push(spec.name);
    } else {
      indicators.push({ v, c, name: spec.name, catname: spec.catname });
    }
  }

  if (indicators.length < INDICATOR_SPECS.length) {
    throw new Error(`Header indikator tidak lengkap (${indicators.length}/${INDICATOR_SPECS.length}). Hilang: ${missingHeaders.join(", ")}`);
  }

  const parsedRows = [];
  let totalGood = 0;
  let totalBelow = 0;
  let totalUnclassified = 0;
  const typeCounts = {};

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r.length) continue;
    const instName = String(r[nameIdx] || "").trim();
    if (!instName) continue;

    const instType = (typeIdx !== -1 && String(r[typeIdx] || "").trim())
      ? String(r[typeIdx]).trim()
      : inferInstansiType(instName);
    const indeksRb = rbIdx !== -1 ? parseScoreValue(r[rbIdx]) : null;

    const cells = indicators.map((ind) => {
      const val = parseScoreValue(r[ind.v]);
      const rawCat = ind.c >= 0 && r[ind.c] !== undefined && r[ind.c] !== null ? String(r[ind.c]).trim() : "";
      const cat = rawCat === "" ? null : rawCat;
      const status = classifyCategory(ind.name, cat);
      if (status === "good") totalGood++;
      else if (status === "below") totalBelow++;
      else totalUnclassified++;
      return [val, cat, status];
    });

    typeCounts[instType] = (typeCounts[instType] || 0) + 1;
    parsedRows.push([instName, cells, instType, indeksRb]);
  }

  if (parsedRows.length === 0) return null;

  return {
    totalInstansi: parsedRows.length,
    totalIndicators: indicators.length,
    indicators,
    rows: parsedRows,
    summary: {
      good: totalGood,
      below: totalBelow,
      unclassified: totalUnclassified,
      classified: totalGood + totalBelow,
      instansiByType: typeCounts
    }
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
  if (res.statusCode !== 200) throw new Error(`Gagal memperoleh OAuth token: ${res.body}`);
  return JSON.parse(res.body).access_token;
}

async function fetchSheetRowsAPI(spreadsheetId, sheetName, token, apiKey) {
  const encodedSheet = encodeURIComponent(sheetName);
  let requestPath = `/v4/spreadsheets/${spreadsheetId}/values/${encodedSheet}!A1:BZ?valueRenderOption=FORMATTED_VALUE`;
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  else if (apiKey) requestPath += `&key=${apiKey}`;
  const res = await httpsRequest({ hostname: "sheets.googleapis.com", path: requestPath, method: "GET", headers });
  if (res.statusCode !== 200) throw new Error(`Google Sheets API error: HTTP ${res.statusCode}`);
  return JSON.parse(res.body).values || [];
}

exports.INDICATOR_SPECS = INDICATOR_SPECS;
exports.parseCSV = parseCSV;
exports.parseScoreValue = parseScoreValue;
exports.inferInstansiType = inferInstansiType;
exports.classifyCategory = classifyCategory;
exports.parseSheetRows = parseSheetRows;

exports.handler = async function (event) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  // Konfigurasi khusus Analisis Indeks Score 2025 (independen dari Sasaran 4)
  const spreadsheetId = process.env.INDEKS_SCORE_SPREADSHEET_ID || "1i4kBAqUUpxD6NfBFOPsibPMX902KGFP7Wz3JaJ1nzRQ";
  const sheetName = process.env.INDEKS_SCORE_SHEET_NAME || "Sheet1";
  const sheetGid = process.env.INDEKS_SCORE_SHEET_GID || "0";
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const apiKey = process.env.GOOGLE_API_KEY;
  if (privateKey) privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    let rows = [];
    let fetchMethod = "unknown";

    if (clientEmail && privateKey) {
      fetchMethod = "service_account";
      const token = await getGoogleAccessToken(clientEmail, privateKey);
      rows = await fetchSheetRowsAPI(spreadsheetId, sheetName, token, null);
    } else if (apiKey) {
      fetchMethod = "api_key";
      rows = await fetchSheetRowsAPI(spreadsheetId, sheetName, null, apiKey);
    } else {
      fetchMethod = "public_csv";
      const isValidCsv = (r) => r && r.statusCode === 200 && r.body && r.body.length >= 1000 && !r.body.trim().startsWith("<!");
      const urls = [
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetGid}`,
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${sheetGid}`,
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
      ];
      for (const u of urls) {
        const res = await httpsRequest(u);
        if (isValidCsv(res)) {
          rows = parseCSV(res.body);
          break;
        }
      }
      if (!rows.length) {
        throw new Error("Gagal membaca CSV Google Sheets Indeks Score 2025.");
      }
    }

    const parsed = parseSheetRows(rows);
    if (!parsed || parsed.totalInstansi === 0) {
      throw new Error("Tidak ada data instansi valid yang ditemukan pada sheet Indeks Score.");
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        source: "google_sheets",
        isFallback: false,
        method: fetchMethod,
        spreadsheetId,
        sheetName,
        sheetGid,
        updatedAt: new Date().toISOString(),
        ...parsed
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
          isFallback: true,
          spreadsheetId,
          sheetName,
          sheetGid,
          warning: `Gagal membaca Google Sheets Indeks Score: ${err.message}. Menggunakan baseline terverifikasi.`,
          updatedAt: fallbackBaseline.generatedAt || new Date().toISOString(),
          totalInstansi: fallbackBaseline.totalInstansi,
          totalIndicators: fallbackBaseline.totalIndicators,
          indicators: fallbackBaseline.indicators,
          rows: fallbackBaseline.rows,
          summary: fallbackBaseline.summary
        })
      };
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
