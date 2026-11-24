const fs = require("fs");
const path = require("path");
const { handler } = require("../netlify/functions/get-sasaran.js");

async function run() {
  const result = {};
  for (let sasaran = 1; sasaran <= 5; sasaran++) {
    const res = await handler({ httpMethod: "GET", queryStringParameters: { sasaran: String(sasaran), scope: "all" } }, {});
    const payload = JSON.parse(res.body);
    if (!payload.success || payload.isFallback) throw new Error(`Gagal mengambil baseline Sasaran ${sasaran}: ${payload.error || "fallback"}`);
    result[String(sasaran)] = payload.data;
  }
  const output = `(function (root, data) {\n  root.RB_SASARAN_RELATIONS = data;\n  if (typeof module !== "undefined" && module.exports) module.exports = data;\n})(typeof globalThis !== "undefined" ? globalThis : this, ${JSON.stringify(result)});\n`;
  fs.writeFileSync(path.resolve(__dirname, "../data/sasaran-relations.js"), output, "utf8");
  console.log("Baseline sasaran-relations.js berhasil dibuat.");
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
