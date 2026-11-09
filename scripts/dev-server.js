/**
 * ============================================================================
 * LOCAL DEVELOPMENT SERVER - PORTAL RELASI RB
 * Menjalankan server lokal mandiri (Zero-Dependency Node.js)
 * Mendukung pembacaan statis dan emulasi Netlify Functions
 * Jalankan dengan: node scripts/dev-server.js
 * ============================================================================
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8888;
const ROOT_DIR = path.resolve(__dirname, "..");

// 1. Baca file .env lokal jika tersedia
const envPath = path.join(ROOT_DIR, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val.replace(/^["']|["']$/g, "");
      }
    }
  });
  console.log(" [CONFIG] Memuat konfigurasi dari .env");
}

// 2. MIME Types untuk file statis
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

// 3. Import Netlify Function handler
let sasaran4Handler = null;
try {
  sasaran4Handler = require("../netlify/functions/get-sasaran4.js").handler;
} catch (e) {
  console.error(" [WARN] Gagal memuat handler get-sasaran4:", e.message);
}

// 4. Server HTTP Utama
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Endpoint API Netlify Function Emulation
  if (
    pathname === "/api/sasaran4" ||
    pathname === "/.netlify/functions/get-sasaran4"
  ) {
    if (!sasaran4Handler) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Handler get-sasaran4 tidak tersedia." }));
      return;
    }

    try {
      const event = {
        httpMethod: req.method,
        path: pathname,
        queryStringParameters: Object.fromEntries(parsedUrl.searchParams.entries()),
        headers: req.headers
      };
      const result = await sasaran4Handler(event, {});

      res.writeHead(result.statusCode || 200, result.headers || { "Content-Type": "application/json" });
      res.end(result.body || "");
      console.log(`[API] ${req.method} ${pathname} -> HTTP ${result.statusCode || 200}`);
      return;
    } catch (err) {
      console.error("[API ERROR]", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
  }

  // File Statis
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  if (safePath === "/" || safePath === "\\") {
    safePath = "index.html";
  }

  const filePath = path.join(ROOT_DIR, safePath);

  // Mencegah akses di luar ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache, must-revalidate"
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log("============================================================");
  console.log("   PORTAL RELASI RB - LOCAL DEVELOPMENT SERVER");
  console.log("============================================================");
  console.log(` URL Dashboard : http://localhost:${PORT}`);
  console.log(` API Sasaran 4 : http://localhost:${PORT}/api/sasaran4`);
  console.log(` Netlify Func  : http://localhost:${PORT}/.netlify/functions/get-sasaran4`);
  console.log(" Tekan Ctrl+C untuk menghentikan server.");
  console.log("============================================================");
});

