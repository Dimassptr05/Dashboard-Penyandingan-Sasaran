/**
 * ============================================================================
 * NETLIFY FUNCTION: get-sasaran3
 * Endpoint: /.netlify/functions/get-sasaran3 (atau /api/sasaran3)
 * Single Source of Truth: Google Sheets "Copy of Sasaran 3"
 * ============================================================================
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Load baseline backup jika ada masalah koneksi Google Sheets
let fallbackBaseline = null;
try {
  const baselinePath = path.resolve(__dirname, "../../data/sasaran3-verified-baseline.json");
  if (fs.existsSync(baselinePath)) {
    fallbackBaseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  }
} catch (e) {
  // Silent catch
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

function parseSasaran3Rows(rows) {
  if (!rows || rows.length < 3) return null;

  // Build Desain IIIP Map dari kolom I-N (index 8-13)
  const desainMap = new Map();
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    const id = (row[8] || "").trim();
    if (id && id.startsWith("SS3-DIIIP.")) {
      desainMap.set(id, {
        kode: id,
        domain: (row[9] || "").trim(),
        dimensi: (row[10] || "").trim(),
        no: (row[11] || "").trim(),
        indikator: (row[12] || "").trim(),
        pertanyaan: (row[13] || "").trim()
      });
    }
  }

  const relations = [];
  let curBlok = "";
  let curSubBlok = "";

  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    const asalKode = (row[0] || "").trim();
    if (row[1] && row[1].trim()) curBlok = row[1].trim();
    if (row[2] && row[2].trim()) curSubBlok = row[2].trim();
    const asalNama = (row[4] || "").trim();
    const relVal = (row[5] || "").trim();

    if (asalKode && relVal && relVal !== "–" && relVal !== "-") {
      const m = relVal.match(/SS3-DIIIP\.[A-Z0-9\.]+/);
      const dstKode = m ? m[0] : "";
      const dstInfo = desainMap.get(dstKode) || {};

      relations.push({
        id: `REL-S3-${relations.length + 1}`,
        sasaran_id: 3,
        asal_instrumen: "IIIP",
        tujuan_instrumen: "DIIIP",
        asal_kode: asalKode,
        asal_nama: asalNama,
        asal_aspek: curSubBlok || curBlok || "Instrumen Pengumpulan Data",
        asal_domain: curBlok,
        tujuan_kode: dstKode,
        tujuan_nama: dstInfo.indikator || "",
        tujuan_aspek: dstInfo.dimensi || "Desain IIIP",
        tujuan_domain: dstInfo.domain || "",
        jenis: "Mendukung",
        tingkat: "KUAT",
        alasan: `Pertanyaan survei "${asalNama}" mendukung pengukuran indikator desain "${dstInfo.indikator || dstKode}".`,
        sumber: `Google Sheets (Copy of Sasaran 3!F${r + 1})`,
        rekomendasi: `Disarankan menyelaraskan tindak lanjut hasil survei terkait "${asalNama}" dengan penguatan indikator "${dstInfo.indikator || dstKode}".`
      });
    }
  }

  return {
    totalRelations: relations.length,
    relations: relations,
    placeholders: []
  };
}

exports.handler = async (event, context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=30, s-maxage=30"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  const spreadsheetId = process.env.SPREADSHEET_ID || "1LVXNqK7ehp2fLtrFstnTcM2jiyOeWCPhR1CdC14jwDs";
  const sheetGid = "1272261367"; // Copy of Sasaran 3
  const sheetName = "Copy of Sasaran 3";

  try {
    let rows = [];
    let fetchMethod = "public_export";

    const gidUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetGid}`;
    const resGid = await httpsRequest(gidUrl);
    if (resGid.statusCode === 200 && resGid.body) {
      rows = parseCSV(resGid.body);
    }

    if (rows.length === 0) {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      const res = await httpsRequest(csvUrl);
      if (res.statusCode === 200 && res.body) {
        rows = parseCSV(res.body);
      }
    }

    const parsedData = parseSasaran3Rows(rows);

    if (!parsedData || parsedData.totalRelations === 0) {
      throw new Error("Tidak ada data relasi Sasaran 3 yang valid ditemukan pada sheet tersebut.");
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
        placeholders: parsedData.placeholders
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
          relations: fallbackBaseline.relasi,
          placeholders: fallbackBaseline.placeholders || []
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
