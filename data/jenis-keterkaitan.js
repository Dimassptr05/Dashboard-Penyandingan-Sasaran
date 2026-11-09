/**
 * ============================================================================
 * KLASIFIKASI JENIS KETERKAITAN & JUSTIFIKASI SUBSTANTIF ANTAR-INDIKATOR RB
 * Seluruh Alasan & Rekomendasi Tindak Lanjut disesuaikan secara ketat dengan
 * pasangan Indikator Sumber (Kiri) dan Indikator Pembanding (Kanan) pada kartu.
 * ============================================================================
 */
(function () {
  "use strict";

  const IPP_GROUP_TOPICS = {
    "SS5-IPP.FT.1": "implementasi Standar Pelayanan dan Maklumat Pelayanan berdasarkan perjalanan pengguna (user journey)",
    "SS5-IPP.FT.2": "pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan",
    "SS5-IPP.FT.3": "evaluasi kinerja SDM/SKP, penerapan penghargaan/sanksi, dan pengembangan kompetensi SDM pelayanan",
    "SS5-IPP.FT.4": "pengarahan anggaran pelayanan untuk menyelesaikan bottleneck dan menghasilkan outcome layanan",
    "SS5-IPP.AI.1": "ketersediaan, kemutakhiran, dan kemudahan akses informasi pelayanan termasuk bagi kelompok rentan",
    "SS5-IPP.AI.2": "keberfungsian sarana dan prasarana dalam mengurangi hambatan penyelenggaraan pelayanan",
    "SS5-IPP.AI.3": "penyediaan Akomodasi yang Layak (AyL) bagi kelompok rentan dalam mengakses pelayanan",
    "SS5-IPP.AI.4": "ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan",
    "SS5-IPP.KM.1": "kecepatan waktu tindak lanjut aspirasi dan pengaduan masyarakat",
    "SS5-IPP.KM.2": "pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR!",
    "SS5-IPP.KM.3": "pelaksanaan Rencana Tindak Lanjut (RTL) Forum Konsultasi Publik (FKP) untuk menghasilkan perubahan pelayanan yang terukur",
    "SS5-IPP.KM.4": "pemanfaatan dan pelaksanaan Rencana Tindak Lanjut (RTL) hasil Survei Kepuasan Masyarakat (SKM)",
    "SS5-IPP.EP.1": "pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan",
    "SS5-IPP.EP.2": "evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik"
};

  function cleanLabel(text) {
  if (!text || typeof text !== "string") return "";
  let s = text.trim();
  s = s.replace(/^SS\d+-[A-Za-z0-9_.]+\s*[—:\-]\s*/i, "");
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace(/^(?:SS\d+\.|P\d+\.|\d+(?:\.[a-zA-Z0-9]+)*\.?|\([0-9a-zA-Z]+\)|[a-zA-Z]\.|[A-D]\d+\s*:)\s+/, "").trim();
  }
  s = s.replace(/\s*\(\s*Bobot\s*[^)]+\)/gi, "").trim();
  s = s.replace(/\s*\(\s*\d+(?:[.,]\d+)?%\s*\)/gi, "").trim();
  return s;
}
  function lowerFirst(s) {
  if (!s) return "";
  if (/^(ASN|SPBE|BMN|SOP|SKP|RKP|RPJMN|RPJMD|Renstra|Renja|RKA|DIPA|UP|TUP|IKU|IKSS|IKP|KRO|RO|IPM|OPD|BPS|WBK|WBBM|SPIP|SAKIP|SIPPN|SP4N|FKP|SKM|AyL|Pemdi|K\/L|UU|PP|BUMN|PTN|KPPN|BAST|SPM|PNBP|BPK|LHKPN|LHKASN|KTI|SKJ|Ombudsman)\b/.test(s)) {
    return s;
  }
  return s.charAt(0).toLowerCase() + s.slice(1);
}
  function stripTrailingPunct(s) {
  if (!s) return "";
  return s
    .trim()
    .replace(/;\s*dan\/atau\s*$/i, "")
    .replace(/;\s*dan\s*$/i, "")
    .replace(/;\s*atau\s*$/i, "")
    .replace(/[.?!:;]+$/, "")
    .trim();
}
  function fixTyposAndSpacing(s) {
  if (!s) return "";
  return s
    .replace(/SatuanOutput/g, "Satuan Output")
    .replace(/PrioritasdalamRenja/g, "Prioritas dalam Renja")
    .replace(/SesuaidenganTarget/g, "Sesuai dengan Target")
    .replace(/Sesuaidengan/g, "Sesuai dengan")
    .replace(/ProyekPrioritasdi/g, "Proyek Prioritas di")
    .replace(/KoridorKegiatanPrioritasUtama/g, "Koridor Kegiatan Prioritas Utama")
    .replace(/\(KPU\) RK$/g, "(KPU) RKP")
    .replace(/Sasaran\(strategis/g, "Sasaran (strategis")
    .replace(/\bmonitoring\s+dan\s+dan\s+evaluasi\b/gi, "monitoring dan evaluasi")
    .replace(/\bmenangangi\b/gi, "menangani")
    .replace(/\btelah\s+telah\b/gi, "telah")
    .replace(/\bdtindaklanjuti\b/gi, "ditindaklanjuti")
    .replace(/\binspriasi\b/gi, "inspirasi")
    .replace(/\bOuput\b/g, "Output")
    .replace(/\(\(Kerangka/g, "(Kerangka");
}
  function cleanSurveyQuestion(q) {
  if (!q) return "";
  let s = fixTyposAndSpacing(stripTrailingPunct(q));
  s = s.replace(/^Bagaimana\s+(?:pendapat|penilaian)\s+Saudara\s+terhadap\s+pernyataan\s*:\s*/i, "");
  s = s.replace(/^Pada\s+tahun\s+\d+\s*,\s*seberapa\s+sering\s*,?\s*/i, "frekuensi ");
  s = s.replace(/^Pada\s+tahun\s+\d+\s*,\s*seberapa\s+optimal\s*,?\s*/i, "tingkat keoptimalan ");
  s = s.replace(/^Mengacu\s+pada\s+inovasi\s+yang\s+Saudara\s+sebutkan\s*,\s*menurut\s+Saudara\s+bagaimana\s+/i, "");
  s = s.replace(/^Mengacu\s+pada\s+inovasi\s+yang\s+Saudara\s+sebutkan\s*,\s*bagaimana\s+penilaian\s+Saudara\s+terhadap\s+pernyataan\s*:\s*/i, "");
  s = s.replace(/^Mengacu\s+pada\s+inovasi\s+yang\s+Saudara\s+sebutkan\s*,\s*bagaimana\s+penilaian\s+Saudara\s+terhadap\s+/i, "");
  s = s.replace(/^Mengacu\s+pada\s+inovasi\s+yang\s+Saudara\s+sebutkan\s*,\s*sepengetahuan\s+Saudara\s+seberapa\s+luas\s+/i, "luasnya ");
  s = s.replace(/^Mengacu\s+pada\s+inovasi\s+yang\s+Saudara\s+sebutkan\s*,\s*seberapa\s+sering\s+/i, "frekuensi ");
  s = s.replace(/^Di\s+instansi\s+Saudara\s+memiliki\b/i, "keberadaan");
  s = s.replace(/^Di\s+instansi\s+Saudara\s+inovasi\b/i, "inovasi di instansi");
  s = s.replace(/\bSaudara\s+atau\s+pegawai\b/gi, "pegawai");
  s = s.replace(/\bSaudara\s+atau\s+rekan\s+kerja\b/gi, "pegawai dan rekan kerja");
  s = s.replace(/\bdi\s+unit\s+kerja\s+atau\s+instansi\s+Saudara\b/gi, "di unit kerja atau instansi");
  s = s.replace(/\bunit\s+kerja\s+atau\s+instansi\s+Saudara\b/gi, "unit kerja atau instansi");
  s = s.replace(/\bdi\s+instansi\s+Saudara\b/gi, "di instansi");
  s = s.replace(/\binstansi\s+Saudara\b/gi, "instansi");
  s = s.replace(/\bIde\s+inovasi\s+Saudara\b/gi, "ide inovasi pegawai");
  s = s.replace(/\bSaudara\b/gi, "pegawai");
  s = s.replace(/\bfrekuensi\s+Pimpinan\b/g, "frekuensi pimpinan");
  s = s.replace(/\bfrekuensi\s+Inovasi\b/g, "frekuensi inovasi");
  s = s.replace(/\bfrekuensi\s+Pegawai\b/g, "frekuensi pegawai");
  s = s.replace(/\bfrekuensi\s+Data\b/g, "frekuensi data");
  s = s.replace(/\btingkat\s+keoptimalan\s+Pelaksana\b/g, "tingkat keoptimalan pelaksana");
  s = s.replace(/\binovasi\s+tersebut\b/gi, "inovasi yang diterapkan");
  s = s.replace(/\bJARANG\b/g, "jarang");
  s = s.replace(/\bKURANG\s+TERBUKA\b/g, "kurang terbuka");
  s = s.replace(/\bMERASA\s+KURANG\s+DIDUKUNG\b/g, "merasa kurang didukung");
  return lowerFirst(s.trim());
}
  function cleanSurveyAction(q) {
  let s = cleanSurveyQuestion(q);
  s = s.replace(/^pegawai\s+di\s+instansi\s+jarang\s+mencari\s+dan\s+mempelajari\s+praktik\s+baik\s+\(best\s+practice\)\s+dari\s+tempat\s+lain\s+sebagai\s+sumber\s+inspirasi\s+ide\s+inovasi$/i,
    "penguatan perilaku pegawai dalam mencari dan mempelajari praktik baik (best practice) sebagai sumber inspirasi ide inovasi");
  s = s.replace(/^frekuensi\s+pegawai\s+merasa\s+bahwa\s+di\s+instansi\s+kurang\s+terbuka\s+terhadap\s+usulan\s+ide\s+inovasi$/i,
    "evaluasi dan peningkatan keterbukaan instansi terhadap usulan ide inovasi pegawai");
  s = s.replace(/^frekuensi\s+pegawai\s+dan\s+rekan\s+kerja\s+merasa\s+kurang\s+didukung\s+oleh\s+pegawai\s+lain\s+dalam\s+mengembangkan\s+dan\s+menerapkan\s+inovasi$/i,
    "penguatan dukungan sosial dan kerja sama antarpegawai dalam mengembangkan serta menerapkan inovasi");
  return s;
}
  function cleanIppSub(sub, code) {
  if (!sub) return "";
  let s = fixTyposAndSpacing(stripTrailingPunct(cleanLabel(sub)));
  s = s.replace(/^Kondisi\s+nilai\s+\d+\s+terpenuhi\s*,?\s*(?:dan|serta)?\s*/i, "");
  if (code && code.startsWith("SS5-IPP.KM.3") && /\bRTL\b/.test(s) && !/FKP/.test(s)) {
    s = s.replace(/\bRTL\b/, "Rencana Tindak Lanjut (RTL) Forum Konsultasi Publik (FKP)");
  }
  if (code && code.startsWith("SS5-IPP.KM.4") && /\bRTL\b/.test(s) && !/SKM/.test(s)) {
    s = s.replace(/\bRTL\b/, "Rencana Tindak Lanjut (RTL) Survei Kepuasan Masyarakat (SKM)");
  }
  return lowerFirst(s.trim());
}
  function cleanIppAction(sub, code, topic) {
  let s = cleanIppSub(sub, code);
  if (/^(tidak\s+tersedia|belum\s+tersedia|tidak\s+terdapat|belum\s+terdapat)/i.test(s) || /\bbelum\s+ditetapkan\b|\bbelum\s+diukur\b|\bbelum\s+dilakukan\s+evaluasi\b|\bbelum\s+ditindaklanjuti\b/i.test(s)) {
    return `peningkatan pemenuhan parameter ${topic} (terkait kondisi: ${s})`;
  }
  return `pemenuhan parameter ${s}`;
}
  function cleanIkkQuestion(ind) {
  if (!ind) return "";
  let s = fixTyposAndSpacing(stripTrailingPunct(cleanLabel(ind)));
  s = s.replace(/^Apakah\s+ada\s+/i, "keberadaan ");
  s = s.replace(/^Apakah\s+/i, "");
  return lowerFirst(s.trim());
}
  function cleanZiSub(sub, ind) {
  if (!sub) return lowerFirst(cleanLabel(ind || ""));
  let s = fixTyposAndSpacing(stripTrailingPunct(cleanLabel(sub)));
  s = s.replace(/^-\s*/, "").trim();
  s = s.replace(/^Apakah\s+terdapat\s+/i, "ketersediaan ");
  s = s.replace(/\s+-\s+Jumlah\s+.*$/i, "").trim();
  s = s.replace(/:\s*1\.\s*/g, " (mencakup: ").replace(/\s+\d+[.]?\s+/g, ", ");
  if (s.includes("(mencakup:") && !s.endsWith(")")) s += ")";
  if (/^jumlah\s+/i.test(s) && ind) {
    s = `pencatatan dan evaluasi ${lowerFirst(s)} pada ${lowerFirst(cleanLabel(ind))}`;
  }
  return lowerFirst(s);
}
  function describeCardItem(code, d) {
  const catalog = (typeof window !== "undefined" && window.RB_SUBSTANSI_INDIKATOR) ? window.RB_SUBSTANSI_INDIKATOR : db;
  if (!d && code && catalog) {
    d = catalog[code];
    if (!d) {
      for (const k in catalog) {
        if (k.startsWith(code + ".") || code.startsWith(k + ".")) {
          d = catalog[k];
          break;
        }
      }
    }
  }
  d = d || {};
  const inst = d.instrument_code || (code ? code.split("-")[1]?.split(".")[0] : "");

  if (inst === "PEMDI") {
    const aspek = cleanLabel(d.aspek || "Data");
    const ind = cleanLabel(d.indikator || "");
    const sub = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(cleanLabel(d.subindikator || d.sub_indikator || d.description || ind))));
    return {
      inst: "PEMDI",
      title: `indikator ${ind} (aspek ${aspek}) pada Pemerintah Digital (PEMDI)`,
      shortTitle: `indikator ${ind} (PEMDI)`,
      substance: `kriteria penilaian mengenai ${sub}`,
      actionFocus: `pemenuhan kriteria ${sub}`
    };
  }
  if (inst === "SM") {
    const aspek = cleanLabel(d.aspek || "");
    const ind = cleanLabel(d.indikator || "");
    const sub = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(cleanLabel(d.subindikator || d.sub_indikator || ind))));
    return {
      inst: "SM",
      title: `indikator ${ind} (aspek ${aspek}) pada Sistem Merit (SM)`,
      shortTitle: `indikator ${ind} (Sistem Merit)`,
      substance: `sub-indikator mengenai ${sub}`,
      actionFocus: `pelaksanaan sub-indikator ${sub}`
    };
  }
  if (inst === "DIIIP") {
    const aspek = cleanLabel(d.aspek || d.dimensi || "");
    const ind = cleanLabel(d.indikator || "");
    const sub = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(cleanLabel(d.subindikator || d.sub_indikator || ind))));
    return {
      inst: "DIIIP",
      title: `indikator desain ${ind} (${aspek}) pada Desain IIIP`,
      shortTitle: `indikator desain ${ind} (DIIIP)`,
      substance: `sub-indikator mengenai ${sub}`,
      actionFocus: `penguatan sub-indikator ${sub}`
    };
  }
  if (inst === "IIIP") {
    const aspek = cleanLabel(d.aspek || d.blok || "");
    const ind = cleanLabel(d.indikator || "");
    const sub = cleanSurveyQuestion(d.subindikator || d.sub_indikator || d.pertanyaan || ind);
    const act = cleanSurveyAction(d.subindikator || d.sub_indikator || d.pertanyaan || ind);
    return {
      inst: "IIIP",
      title: `indikator survei ${ind} (${aspek}) pada Survei IIIP`,
      shortTitle: `indikator survei ${ind} (IIIP)`,
      substance: `pertanyaan survei mengenai ${sub}`,
      actionFocus: `tindak lanjut hasil survei terkait ${act}`
    };
  }
  if (inst === "KK") {
    const aspek = cleanLabel(d.aspek || "");
    const ind = cleanLabel(d.indikator || "");
    const pern = cleanLabel(d.pernyataan || "");
    const defOp = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(d.definisi_operasional || pern)));
    return {
      inst: "KK",
      title: `indikator ${ind} — pernyataan ${pern} (aspek ${aspek}) pada Kapabilitas Kelembagaan (KK)`,
      shortTitle: `indikator ${ind} — ${pern} (KK)`,
      substance: `pernyataan ${lowerFirst(pern)} (${defOp})`,
      actionFocus: `penataan ${lowerFirst(pern)} (${defOp})`
    };
  }
  if (inst === "SPIP") {
    const komp = cleanLabel(d.komponen || d.aspek || "");
    const unsur = cleanLabel(d.unsur || "Unsur SPIP");
    const subUraian = cleanLabel(d.sub_uraian || d.indikator || "");
    const defOp = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(d.definisi_operasional || subUraian)));
    return {
      inst: "SPIP",
      title: `sub uraian ${subUraian} (komponen ${komp}) pada SPIP`,
      shortTitle: `sub uraian ${subUraian} (SPIP)`,
      substance: `${defOp} melalui penerapan ${unsur}`,
      actionFocus: `penerapan ${unsur} untuk mewujudkan ${lowerFirst(subUraian)}`
    };
  }
  if (inst === "IPPN") {
    const ind = fixTyposAndSpacing(cleanLabel(d.indikator || ""));
    const subInd = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(cleanLabel(d.sub_indikator || ind))));
    return {
      inst: "IPPN",
      title: `indikator ${ind} pada IPPN`,
      shortTitle: `indikator ${ind} (IPPN)`,
      substance: `sub-indikator mengenai ${subInd}`,
      actionFocus: `pemenuhan sub-indikator ${subInd}`
    };
  }
  if (inst === "CKKP") {
    const kat = cleanLabel(d.kategori || "");
    const ind = cleanLabel(d.indikator || "");
    const cak = lowerFirst(fixTyposAndSpacing(stripTrailingPunct((d.cakupan || "").replace(/\s*\n\s*/g, ", ").replace(/^-\s*/, "").replace(/,\s*-\s*/g, ", "))));
    return {
      inst: "CKKP",
      title: `indikator ${ind} (kategori ${kat}) pada CKKP`,
      shortTitle: `indikator ${ind} (CKKP)`,
      substance: `cakupan penilaian atas ${cak}`,
      actionFocus: `pencapaian cakupan ${cak}`
    };
  }
  if (inst === "SAKIP") {
    const komp = cleanLabel(d.komponen || "");
    const subKomp = cleanLabel(d.sub_komponen || "");
    const kritList = Array.isArray(d.kriteria_evaluasi) ? d.kriteria_evaluasi.map(k => lowerFirst(fixTyposAndSpacing(stripTrailingPunct(cleanLabel(k))))) : [];
    const kritText = kritList.length > 0 ? kritList.slice(0, 3).join("; ") : lowerFirst(subKomp);
    return {
      inst: "SAKIP",
      title: `komponen ${komp} (sub-komponen "${subKomp}") pada SAKIP`,
      shortTitle: `komponen ${komp} (SAKIP)`,
      substance: `pemenuhan kriteria evaluasi (${kritText})`,
      actionFocus: `pemenuhan ${lowerFirst(subKomp)} beserta kriteria evaluasinya`
    };
  }
  if (inst === "ELPPD") {
    const kel = cleanLabel(d.kelompok_penilaian || d.aspek || "");
    const ind = cleanLabel(d.indikator || "");
    const butir = cleanLabel(d.butir_penilaian || ind);
    const makro = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(d.kinerja_makro || "")));
    const urusan = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(d.kinerja_urusan || "")));
    return {
      inst: "ELPPD",
      title: `butir penilaian ${butir} (kelompok penilaian ${kel}) pada ELPPD`,
      shortTitle: `butir penilaian ${butir} (ELPPD)`,
      substance: `penilaian kinerja makro (${makro}) dan kinerja penyelenggaraan urusan pemerintahan (${urusan})`,
      actionFocus: `pencapaian ${lowerFirst(butir)} (${makro} serta ${urusan})`
    };
  }
  if (inst === "IKPA") {
    const aspek = cleanLabel(d.aspek || "");
    const ind = cleanLabel(d.indikator || "");
    const defOp = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(d.definisi_operasional || ind)));
    return {
      inst: "IKPA",
      title: `indikator ${ind} (aspek ${aspek}) pada IKPA`,
      shortTitle: `indikator ${ind} (IKPA)`,
      substance: defOp,
      actionFocus: `pengendalian ${lowerFirst(ind)} (${defOp})`
    };
  }
  if (inst === "IPA") {
    const sas = cleanLabel(d.sasaran_strategis || "");
    const param = cleanLabel(d.parameter || "");
    const subParam = cleanLabel(d.sub_parameter || "");
    const penj = lowerFirst(fixTyposAndSpacing(stripTrailingPunct(d.isi_penjelasan || param)));
    return {
      inst: "IPA",
      title: `parameter ${param} (sub-parameter ${subParam}, sasaran strategis ${sas}) pada IPA`,
      shortTitle: `parameter ${param} (IPA)`,
      substance: penj,
      actionFocus: `pemenuhan ${lowerFirst(param)} (${penj})`
    };
  }
  if (inst === "IPP") {
    const aspekRaw = cleanLabel(d.aspek || "");
    const aspek = aspekRaw.replace(/^ASPEK\s+/i, "Aspek ").replace(/\b([A-Z])([A-Z]+)\b/g, (m, a, b) => a + b.toLowerCase());
    const grp = code ? code.split(".").slice(0, 3).join(".") : "";
    const topic = IPP_GROUP_TOPICS[grp] || lowerFirst(fixTyposAndSpacing(stripTrailingPunct(cleanLabel(d.indikator || aspek))));
    const sub = cleanIppSub(d.subindikator || d.sub_indikator || d.indikator, code || "");
    const act = cleanIppAction(d.subindikator || d.sub_indikator || d.indikator, code || "", topic);
    return {
      inst: "IPP",
      title: `indikator terkait ${topic} (${aspek}) pada Indeks Pelayanan Publik (IPP)`,
      shortTitle: `indikator terkait ${topic} (IPP)`,
      substance: `parameter penilaian mengenai ${sub}`,
      actionFocus: act
    };
  }
  if (inst === "OP") {
    const aspek = fixTyposAndSpacing(cleanLabel(d.aspek || d.dimensi || ""));
    let ind = fixTyposAndSpacing(stripTrailingPunct(cleanLabel(d.indikator || "")));
    if (code === "SS5-OP.PN.1.2") ind = "pelaksanaan kewajiban dalam pengelolaan pengaduan";
    const isMaladmin = (code && code.includes(".P.2")) || /maladministrasi/i.test(aspek);
    return {
      inst: "OP",
      title: `variabel penilaian "${ind}" (dimensi ${aspek}) pada Opini Ombudsman (OP)`,
      shortTitle: `variabel "${ind}" (OP)`,
      substance: isMaladmin && !/pengetahuan/i.test(aspek)
        ? `pengawasan dan pencegahan maladministrasi terkait ${lowerFirst(ind)}`
        : `indikator kepatuhan mengenai ${lowerFirst(ind)}`,
      actionFocus: isMaladmin && !/pengetahuan/i.test(aspek)
        ? `pencegahan maladministrasi terkait ${lowerFirst(ind)} pada dimensi ${aspek}`
        : `pemenuhan kepatuhan atas ${lowerFirst(ind)} pada dimensi ${aspek}`
    };
  }
  if (inst === "IKK") {
    const aspek = cleanLabel(d.aspek || "");
    const qSub = cleanIkkQuestion(d.indikator || d.subindikator || "");
    return {
      inst: "IKK",
      title: `indikator kebijakan pada dimensi ${aspek} dalam Indeks Kualitas Kebijakan (IKK)`,
      shortTitle: `dimensi ${aspek} (IKK)`,
      substance: `pertanyaan evaluasi mengenai ${qSub}`,
      actionFocus: `pelaksanaan evaluasi kebijakan terkait ${qSub}`
    };
  }
  if (inst === "ZI") {
    const aspek = cleanLabel(d.aspek || "");
    const ind = cleanLabel(d.indikator || "");
    const sub = cleanZiSub(d.subindikator || d.sub_indikator || ind, ind);
    return {
      inst: "ZI",
      title: `program/sub-komponen "${ind}" (${aspek}) pada Zona Integritas (ZI)`,
      shortTitle: `program "${ind}" (ZI)`,
      substance: `kriteria penilaian mengenai ${sub}`,
      actionFocus: `pemenuhan kriteria ${sub}`
    };
  }
  return {
    inst,
    title: cleanLabel(d.indikator || code),
    shortTitle: cleanLabel(d.indikator || code),
    substance: lowerFirst(fixTyposAndSpacing(stripTrailingPunct(cleanLabel(d.subindikator || d.indikator || code)))),
    actionFocus: lowerFirst(fixTyposAndSpacing(stripTrailingPunct(cleanLabel(d.subindikator || d.indikator || code))))
  };
}
  function buildCardPairJustifikasi(srcCode, dstCode, jenis, subSrc, subDst) {
  const left = describeCardItem(srcCode, subSrc);
  const right = describeCardItem(dstCode, subDst);
  const j = jenis || "Mendukung";

  if (j === "Mendukung") {
    return {
      alasan: `Penilaian ${left.substance} pada ${left.title} mendukung pengukuran ${right.substance} pada ${right.title}.`,
      rekomendasi: `Disarankan menyelaraskan ${left.actionFocus} pada ${left.shortTitle} guna memperkuat ${right.actionFocus} pada ${right.shortTitle}.`
    };
  }
  if (j === "Saling Melengkapi") {
    return {
      alasan: `Penilaian ${left.substance} pada ${left.title} saling melengkapi dengan pengukuran ${right.substance} pada ${right.title}.`,
      rekomendasi: `Disarankan menyinkronkan ${left.actionFocus} pada ${left.shortTitle} dengan ${right.actionFocus} pada ${right.shortTitle} agar kedua instrumen saling melengkapi secara terpadu.`
    };
  }
  if (j === "Beririsan Substansi") {
    return {
      alasan: `Penilaian ${left.substance} pada ${left.title} beririsan substansi dengan pengukuran ${right.substance} pada ${right.title}.`,
      rekomendasi: `Disarankan menyelaraskan pemenuhan dan bukti dukung antara ${left.actionFocus} pada ${left.shortTitle} dan ${right.actionFocus} pada ${right.shortTitle} agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi.`
    };
  }
  if (j === "Potensi Tumpang Tindih") {
    return {
      alasan: `Penilaian ${left.substance} pada ${left.title} berpotensi tumpang tindih dengan pengukuran ${right.substance} pada ${right.title} karena kesamaan fokus evaluasi.`,
      rekomendasi: `Disarankan menyatukan pemanfaatan data dan bukti dukung antara ${left.actionFocus} pada ${left.shortTitle} dan ${right.actionFocus} pada ${right.shortTitle} guna menghindari duplikasi pemenuhan evaluasi.`
    };
  }
  if (j === "Keselarasan Perencanaan") {
    return {
      alasan: `Penilaian ${left.substance} pada ${left.title} memiliki keselarasan perencanaan dengan pengukuran ${right.substance} pada ${right.title}.`,
      rekomendasi: `Disarankan menyelaraskan ${left.actionFocus} pada ${left.shortTitle} dengan ${right.actionFocus} pada ${right.shortTitle} agar dokumen serta target perencanaan tetap konsisten.`
    };
  }
  return {
    alasan: `Penilaian ${left.substance} pada ${left.title} berkaitan langsung dengan pengukuran ${right.substance} pada ${right.title}.`,
    rekomendasi: `Disarankan menyelaraskan ${left.actionFocus} pada ${left.shortTitle} dengan ${right.actionFocus} pada ${right.shortTitle}.`
  };
}

  window.RB_JENIS_KETERKAITAN = {
    kategori: [
      {
            "id": "Mendukung",
            "label": "Mendukung",
            "deskripsi": "Sumber berperan sebagai dukungan atau prasyarat pelaksanaan/pencapaian tujuan; bukan sekadar menyebut topik sama."
      },
      {
            "id": "Saling Melengkapi",
            "label": "Saling Melengkapi",
            "deskripsi": "Dua indikator mengukur dimensi berbeda namun bersama-sama memberi informasi yang lebih menyeluruh."
      },
      {
            "id": "Beririsan Substansi",
            "label": "Beririsan Substansi",
            "deskripsi": "Beberapa objek, materi, atau aspek penilaian serupa, tetapi konsep/rubrik tidak identik."
      },
      {
            "id": "Potensi Tumpang Tindih",
            "label": "Potensi Tumpang Tindih",
            "deskripsi": "Terdapat indikasi kesamaan substansi/kriteria/bukti dukung yang mungkin menyebabkan pengulangan pengukuran; BELUM berarti duplikasi telah terbukti."
      },
      {
            "id": "Keselarasan Perencanaan",
            "label": "Keselarasan Perencanaan",
            "deskripsi": "Hubungan eksplisit dalam sasaran, rencana kerja, output, penganggaran, atau keselarasan dokumen perencanaan."
      }
],
    rules: {
      "SS2-SM.DMA.8 -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran sub-indikator mengenai tersedianya data manajemen ASN yang berkualitas dalam bentuk digital dan terintegrasi, serta dimanfaatkan untuk mendukung proses manajerial dan pengambilan keputusan pada indikator Data Manajemen ASN (aspek Digitalisasi Manajemen ASN) pada Sistem Merit (SM).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat pelaksanaan sub-indikator tersedianya data manajemen ASN yang berkualitas dalam bentuk digital dan terintegrasi, serta dimanfaatkan untuk mendukung proses manajerial dan pengambilan keputusan pada indikator Data Manajemen ASN (Sistem Merit)."
      },
      "SS2-SM.DMA.8 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran sub-indikator mengenai tersedianya data manajemen ASN yang berkualitas dalam bentuk digital dan terintegrasi, serta dimanfaatkan untuk mendukung proses manajerial dan pengambilan keputusan pada indikator Data Manajemen ASN (aspek Digitalisasi Manajemen ASN) pada Sistem Merit (SM).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) guna memperkuat pelaksanaan sub-indikator tersedianya data manajemen ASN yang berkualitas dalam bentuk digital dan terintegrasi, serta dimanfaatkan untuk mendukung proses manajerial dan pengambilan keputusan pada indikator Data Manajemen ASN (Sistem Merit)."
      },
      "SS2-SM.DMA.8 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran sub-indikator mengenai tersedianya data manajemen ASN yang berkualitas dalam bentuk digital dan terintegrasi, serta dimanfaatkan untuk mendukung proses manajerial dan pengambilan keputusan pada indikator Data Manajemen ASN (aspek Digitalisasi Manajemen ASN) pada Sistem Merit (SM).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) guna memperkuat pelaksanaan sub-indikator tersedianya data manajemen ASN yang berkualitas dalam bentuk digital dan terintegrasi, serta dimanfaatkan untuk mendukung proses manajerial dan pengambilan keputusan pada indikator Data Manajemen ASN (Sistem Merit)."
      },
      "SS2-SM.DMA.8 -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran sub-indikator mengenai tersedianya data manajemen ASN yang berkualitas dalam bentuk digital dan terintegrasi, serta dimanfaatkan untuk mendukung proses manajerial dan pengambilan keputusan pada indikator Data Manajemen ASN (aspek Digitalisasi Manajemen ASN) pada Sistem Merit (SM).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat pelaksanaan sub-indikator tersedianya data manajemen ASN yang berkualitas dalam bentuk digital dan terintegrasi, serta dimanfaatkan untuk mendukung proses manajerial dan pengambilan keputusan pada indikator Data Manajemen ASN (Sistem Merit)."
      },
      "SS2-SM.PK.4 -> SS1-PEMDI.P.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) mendukung pengukuran sub-indikator mengenai tersedianya Standar Kompetensi Jabatan (SKJ) yang sesuai dengan peraturan perundang-undangan untuk seluruh jabatan, ditetapkan oleh PPK, dan digunakan sebagai dasar pemenuhan syarat dan pengukuran kompetensi ASN dalam rangka pengembangan talenta dan karier pada indikator Standar Kompetensi Jabatan (SKJ) (aspek Pengembangan Kompetensi) pada Sistem Merit (SM).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) guna memperkuat pelaksanaan sub-indikator tersedianya Standar Kompetensi Jabatan (SKJ) yang sesuai dengan peraturan perundang-undangan untuk seluruh jabatan, ditetapkan oleh PPK, dan digunakan sebagai dasar pemenuhan syarat dan pengukuran kompetensi ASN dalam rangka pengembangan talenta dan karier pada indikator Standar Kompetensi Jabatan (SKJ) (Sistem Merit)."
      },
      "SS3-DIIIP.D1.4 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran sub-indikator mengenai dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dengan penguatan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (DIIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-DIIIP.D1.4 -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran sub-indikator mengenai dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan penguatan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (DIIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.D.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran sub-indikator mengenai akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) dan penguatan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (DIIIP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.D.3": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran sub-indikator mengenai akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) dan penguatan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (DIIIP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Potensi Tumpang Tindih",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) berpotensi tumpang tindih dengan pengukuran sub-indikator mengenai akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP karena kesamaan fokus evaluasi.",
            "rekomendasi": "Disarankan menyatukan pemanfaatan data dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dan penguatan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (DIIIP) guna menghindari duplikasi pemenuhan evaluasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran sub-indikator mengenai akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) dan penguatan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (DIIIP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.TP.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran sub-indikator mengenai akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) dan penguatan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (DIIIP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.TP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran sub-indikator mengenai akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) dan penguatan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (DIIIP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS3-DIIIP.D2.2 -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran sub-indikator mengenai jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan penguatan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (DIIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-DIIIP.D2.4 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran sub-indikator mengenai keterlibatan dalam kegiatan uji coba/pilot proyek inovasi pada indikator desain Uji coba inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) guna memperkuat penguatan sub-indikator keterlibatan dalam kegiatan uji coba/pilot proyek inovasi pada indikator desain Uji coba inovasi (DIIIP)."
      },
      "SS3-DIIIP.D3.1 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran sub-indikator mengenai tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan pada indikator desain Tingkat kebaruan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) guna memperkuat penguatan sub-indikator tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan pada indikator desain Tingkat kebaruan inovasi (DIIIP)."
      },
      "SS3-DIIIP.D3.1 -> SS1-PEMDI.P.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) mendukung pengukuran sub-indikator mengenai tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan pada indikator desain Tingkat kebaruan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) guna memperkuat penguatan sub-indikator tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan pada indikator desain Tingkat kebaruan inovasi (DIIIP)."
      },
      "SS3-DIIIP.D3.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran sub-indikator mengenai persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan penguatan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (DIIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B3.A -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai pegawai di instansi bebas mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan tindak lanjut hasil survei terkait pegawai di instansi bebas mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B3.B -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan tindak lanjut hasil survei terkait pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B3.B -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan tindak lanjut hasil survei terkait pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B3.C -> SS1-PEMDI.KLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai pegawai di instansi mengomunikasikan ide inovasi secara terbuka kepada rekan kerja tanpa khawatir idenya ditiru pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) guna memperkuat tindak lanjut hasil survei terkait pegawai di instansi mengomunikasikan ide inovasi secara terbuka kepada rekan kerja tanpa khawatir idenya ditiru pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (IIIP)."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.KLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) guna memperkuat tindak lanjut hasil survei terkait keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (IIIP)."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat tindak lanjut hasil survei terkait keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (IIIP)."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat tindak lanjut hasil survei terkait keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (IIIP)."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat tindak lanjut hasil survei terkait keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (IIIP)."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.TKM.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) guna memperkuat tindak lanjut hasil survei terkait keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (IIIP)."
      },
      "SS3-IIIP.B4.D -> SS1-PEMDI.KLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dengan tindak lanjut hasil survei terkait instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B4.D -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan tindak lanjut hasil survei terkait instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (IIIP)."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.D.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) guna memperkuat tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (IIIP)."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.KLDP.4": {
            "jenis": "Potensi Tumpang Tindih",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) berpotensi tumpang tindih dengan pengukuran pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP karena kesamaan fokus evaluasi.",
            "rekomendasi": "Disarankan menyatukan pemanfaatan data dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dan tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (IIIP) guna menghindari duplikasi pemenuhan evaluasi."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.TKM.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) dengan tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (IIIP)."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (IIIP)."
      },
      "SS3-IIIP.B5.B -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B5.B -> SS1-PEMDI.D.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) dengan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS3-IIIP.B5.B -> SS1-PEMDI.KLDP.4": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) pada Survei IIIP.",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dengan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (IIIP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS4-ELPPD.SD -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran penilaian kinerja makro (data makro daerah (BPS dan OPD terkait)) dan kinerja penyelenggaraan urusan pemerintahan (data capaian kinerja urusan dari masing-masing OPD) pada butir penilaian Data Makro Daerah & Kinerja OPD (kelompok penilaian Sumber Data) pada ELPPD.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat pencapaian data Makro Daerah & Kinerja OPD (data makro daerah (BPS dan OPD terkait) serta data capaian kinerja urusan dari masing-masing OPD) pada butir penilaian Data Makro Daerah & Kinerja OPD (ELPPD)."
      },
      "SS4-ELPPD.SD -> SS1-PEMDI.D.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran penilaian kinerja makro (data makro daerah (BPS dan OPD terkait)) dan kinerja penyelenggaraan urusan pemerintahan (data capaian kinerja urusan dari masing-masing OPD) pada butir penilaian Data Makro Daerah & Kinerja OPD (kelompok penilaian Sumber Data) pada ELPPD.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) guna memperkuat pencapaian data Makro Daerah & Kinerja OPD (data makro daerah (BPS dan OPD terkait) serta data capaian kinerja urusan dari masing-masing OPD) pada butir penilaian Data Makro Daerah & Kinerja OPD (ELPPD)."
      },
      "SS4-IPPN.1.a -> SS1-PEMDI.TKM.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran sub-indikator mengenai muatan dalam Renstra K/L Sesuai dengan Muatan (sasaran, target, satuan target) di dalam RPJMN pada indikator Kepatuhan Renstra K/L terhadap RPJMN pada IPPN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan pemenuhan sub-indikator muatan dalam Renstra K/L Sesuai dengan Muatan (sasaran, target, satuan target) di dalam RPJMN pada indikator Kepatuhan Renstra K/L terhadap RPJMN (IPPN) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-IPPN.1.b -> SS1-PEMDI.TKM.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran sub-indikator mengenai muatan (Sasaran (strategis, program, kegiatan), target dan satuan target) dalam Renja K/L Konsisten dengan Muatan di dalam Renstra K/L pada indikator Konsistensi Renja K/L terhadap Renstra K/L pada IPPN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan pemenuhan sub-indikator muatan (Sasaran (strategis, program, kegiatan), target dan satuan target) dalam Renja K/L Konsisten dengan Muatan di dalam Renstra K/L pada indikator Konsistensi Renja K/L terhadap Renstra K/L (IPPN) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-IPPN.1.c -> SS1-PEMDI.TKM.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran sub-indikator mengenai output Prioritas dalam Renja K/L Sesuai dengan Output Proyek Prioritas di dalam Koridor Kegiatan Prioritas Utama (KPU) RKP pada indikator Kepatuhan Renja K/L terhadap RKP pada IPPN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan pemenuhan sub-indikator output Prioritas dalam Renja K/L Sesuai dengan Output Proyek Prioritas di dalam Koridor Kegiatan Prioritas Utama (KPU) RKP pada indikator Kepatuhan Renja K/L terhadap RKP (IPPN) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-IPPN.1.c -> SS1-PEMDI.D.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran sub-indikator mengenai output Prioritas dalam Renja K/L Sesuai dengan Output Proyek Prioritas di dalam Koridor Kegiatan Prioritas Utama (KPU) RKP pada indikator Kepatuhan Renja K/L terhadap RKP pada IPPN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) dengan pemenuhan sub-indikator output Prioritas dalam Renja K/L Sesuai dengan Output Proyek Prioritas di dalam Koridor Kegiatan Prioritas Utama (KPU) RKP pada indikator Kepatuhan Renja K/L terhadap RKP (IPPN) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-IPPN.1.c -> SS1-PEMDI.D.3": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran sub-indikator mengenai output Prioritas dalam Renja K/L Sesuai dengan Output Proyek Prioritas di dalam Koridor Kegiatan Prioritas Utama (KPU) RKP pada indikator Kepatuhan Renja K/L terhadap RKP pada IPPN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) dengan pemenuhan sub-indikator output Prioritas dalam Renja K/L Sesuai dengan Output Proyek Prioritas di dalam Koridor Kegiatan Prioritas Utama (KPU) RKP pada indikator Kepatuhan Renja K/L terhadap RKP (IPPN) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-IPPN.3.a.1 -> SS1-PEMDI.TKM.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran sub-indikator mengenai indikator Sasaran PN/PP/KP yang ditugaskan Menjadi IKU Instansi Terkait pada indikator Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait pada IPPN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan pemenuhan sub-indikator indikator Sasaran PN/PP/KP yang ditugaskan Menjadi IKU Instansi Terkait pada indikator Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait (IPPN) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-IPPN.3.a.1 -> SS1-PEMDI.D.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran sub-indikator mengenai indikator Sasaran PN/PP/KP yang ditugaskan Menjadi IKU Instansi Terkait pada indikator Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait pada IPPN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) dengan pemenuhan sub-indikator indikator Sasaran PN/PP/KP yang ditugaskan Menjadi IKU Instansi Terkait pada indikator Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait (IPPN) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-IPPN.3.a.1 -> SS1-PEMDI.D.3": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran sub-indikator mengenai indikator Sasaran PN/PP/KP yang ditugaskan Menjadi IKU Instansi Terkait pada indikator Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait pada IPPN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) dengan pemenuhan sub-indikator indikator Sasaran PN/PP/KP yang ditugaskan Menjadi IKU Instansi Terkait pada indikator Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait (IPPN) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-KK.KP.1 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pernyataan keterhubungan Proses Internal (keterpaduan dan integrasi alur proses kerja antar-unit di dalam instansi yang tertuang dalam peta proses bisnis instansi pemerintah) pada indikator Proses Bisnis — pernyataan Keterhubungan Proses Internal (aspek Ketepatan Proses) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dengan penataan keterhubungan Proses Internal (keterpaduan dan integrasi alur proses kerja antar-unit di dalam instansi yang tertuang dalam peta proses bisnis instansi pemerintah) pada indikator Proses Bisnis — Keterhubungan Proses Internal (KK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS4-KK.KP.1 -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pernyataan keterhubungan Proses Internal (keterpaduan dan integrasi alur proses kerja antar-unit di dalam instansi yang tertuang dalam peta proses bisnis instansi pemerintah) pada indikator Proses Bisnis — pernyataan Keterhubungan Proses Internal (aspek Ketepatan Proses) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan penataan keterhubungan Proses Internal (keterpaduan dan integrasi alur proses kerja antar-unit di dalam instansi yang tertuang dalam peta proses bisnis instansi pemerintah) pada indikator Proses Bisnis — Keterhubungan Proses Internal (KK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS4-KK.KP.3 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pernyataan shared-Outcomes Internal (penyusunan sasaran dan target kinerja bersama (shared outcomes) yang melibatkan kolaborasi lintas unit kerja di lingkungan internal instansi) pada indikator Proses Perencanaan — pernyataan Shared-Outcomes Internal (aspek Ketepatan Proses) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dengan penataan shared-Outcomes Internal (penyusunan sasaran dan target kinerja bersama (shared outcomes) yang melibatkan kolaborasi lintas unit kerja di lingkungan internal instansi) pada indikator Proses Perencanaan — Shared-Outcomes Internal (KK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS4-KK.KP.3 -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pernyataan shared-Outcomes Internal (penyusunan sasaran dan target kinerja bersama (shared outcomes) yang melibatkan kolaborasi lintas unit kerja di lingkungan internal instansi) pada indikator Proses Perencanaan — pernyataan Shared-Outcomes Internal (aspek Ketepatan Proses) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan penataan shared-Outcomes Internal (penyusunan sasaran dan target kinerja bersama (shared outcomes) yang melibatkan kolaborasi lintas unit kerja di lingkungan internal instansi) pada indikator Proses Perencanaan — Shared-Outcomes Internal (KK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS4-KK.KP.3 -> SS1-PEMDI.TKM.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran pernyataan shared-Outcomes Internal (penyusunan sasaran dan target kinerja bersama (shared outcomes) yang melibatkan kolaborasi lintas unit kerja di lingkungan internal instansi) pada indikator Proses Perencanaan — pernyataan Shared-Outcomes Internal (aspek Ketepatan Proses) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan penataan shared-Outcomes Internal (penyusunan sasaran dan target kinerja bersama (shared outcomes) yang melibatkan kolaborasi lintas unit kerja di lingkungan internal instansi) pada indikator Proses Perencanaan — Shared-Outcomes Internal (KK) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-KK.TK.1 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pernyataan kebijakan (ketersediaan regulasi dan pedoman tata kelola sistem kerja baru yang adaptif, fleksibel, kolaboratif, dan berbasis fungsional) pada indikator Sistem Kerja — pernyataan Kebijakan (aspek Tata Kelola) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dengan penataan kebijakan (ketersediaan regulasi dan pedoman tata kelola sistem kerja baru yang adaptif, fleksibel, kolaboratif, dan berbasis fungsional) pada indikator Sistem Kerja — Kebijakan (KK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS4-KK.TK.1 -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pernyataan kebijakan (ketersediaan regulasi dan pedoman tata kelola sistem kerja baru yang adaptif, fleksibel, kolaboratif, dan berbasis fungsional) pada indikator Sistem Kerja — pernyataan Kebijakan (aspek Tata Kelola) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan penataan kebijakan (ketersediaan regulasi dan pedoman tata kelola sistem kerja baru yang adaptif, fleksibel, kolaboratif, dan berbasis fungsional) pada indikator Sistem Kerja — Kebijakan (KK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.D.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai penerapan tata kelola dan teknis PDP masih bersifat ad-hoc (tanpa arah kebijakan organisasi implementasi PDP) pada indikator Tingkat Kematangan Pelindungan Data Pribadi (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran pernyataan implementasi (penerapan manajemen risiko terintegrasi dalam setiap perencanaan dan pelaksanaan kegiatan guna memitigasi hambatan pencapaian tujuan organisasi) pada indikator Pengendalian Risiko — pernyataan Implementasi (aspek Tata Kelola) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria penerapan tata kelola dan teknis PDP masih bersifat ad-hoc (tanpa arah kebijakan organisasi implementasi PDP) pada indikator Tingkat Kematangan Pelindungan Data Pribadi (PEMDI) guna memperkuat penataan implementasi (penerapan manajemen risiko terintegrasi dalam setiap perencanaan dan pelaksanaan kegiatan guna memitigasi hambatan pencapaian tujuan organisasi) pada indikator Pengendalian Risiko — Implementasi (KK)."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.KP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pernyataan implementasi (penerapan manajemen risiko terintegrasi dalam setiap perencanaan dan pelaksanaan kegiatan guna memitigasi hambatan pencapaian tujuan organisasi) pada indikator Pengendalian Risiko — pernyataan Implementasi (aspek Tata Kelola) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (PEMDI) guna memperkuat penataan implementasi (penerapan manajemen risiko terintegrasi dalam setiap perencanaan dan pelaksanaan kegiatan guna memitigasi hambatan pencapaian tujuan organisasi) pada indikator Pengendalian Risiko — Implementasi (KK)."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.KP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pernyataan implementasi (penerapan manajemen risiko terintegrasi dalam setiap perencanaan dan pelaksanaan kegiatan guna memitigasi hambatan pencapaian tujuan organisasi) pada indikator Pengendalian Risiko — pernyataan Implementasi (aspek Tata Kelola) pada Kapabilitas Kelembagaan (KK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (PEMDI) guna memperkuat penataan implementasi (penerapan manajemen risiko terintegrasi dalam setiap perencanaan dan pelaksanaan kegiatan guna memitigasi hambatan pencapaian tujuan organisasi) pada indikator Pengendalian Risiko — Implementasi (KK)."
      },
      "SS4-SAKIP -> SS1-PEMDI.TKM.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran pemenuhan kriteria evaluasi (terdapat pedoman teknis perencanaan kinerja; terdapat dokumen perencanaan kinerja jangka panjang; terdapat dokumen perencanaan kinerja jangka menengah) pada komponen Perencanaan Kinerja (sub-komponen \"Dokumen Perencanaan Kinerja telah tersedia\") pada SAKIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan pemenuhan dokumen Perencanaan Kinerja telah tersedia beserta kriteria evaluasinya pada komponen Perencanaan Kinerja (SAKIP) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS4-SAKIP -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran pemenuhan kriteria evaluasi (terdapat pedoman teknis perencanaan kinerja; terdapat dokumen perencanaan kinerja jangka panjang; terdapat dokumen perencanaan kinerja jangka menengah) pada komponen Perencanaan Kinerja (sub-komponen \"Dokumen Perencanaan Kinerja telah tersedia\") pada SAKIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat pemenuhan dokumen Perencanaan Kinerja telah tersedia beserta kriteria evaluasinya pada komponen Perencanaan Kinerja (SAKIP)."
      },
      "SS4-SAKIP -> SS1-PEMDI.D.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran pemenuhan kriteria evaluasi (terdapat pedoman teknis perencanaan kinerja; terdapat dokumen perencanaan kinerja jangka panjang; terdapat dokumen perencanaan kinerja jangka menengah) pada komponen Perencanaan Kinerja (sub-komponen \"Dokumen Perencanaan Kinerja telah tersedia\") pada SAKIP.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) guna memperkuat pemenuhan dokumen Perencanaan Kinerja telah tersedia beserta kriteria evaluasinya pada komponen Perencanaan Kinerja (SAKIP)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.D.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai dengan substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah, serta Arsitektur Keamanan Pemdi dan Arsitektur Teknologi Pemdi pada indikator Tingkat Kematangan Pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai dengan substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah, serta Arsitektur Keamanan Pemdi dan Arsitektur Teknologi Pemdi pada indikator Tingkat Kematangan Pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan dievaluasi untuk perbaikan berkelanjutan pada indikator kebijakan pada dimensi Evaluasi dan Keberlanjutan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan dievaluasi untuk perbaikan berkelanjutan pada dimensi Evaluasi dan Keberlanjutan Kebijakan (IKK)."
      },
      "SS5-IKK.IK.1 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan evaluasi mengenai kebijakan memiliki kejelasan koordinasi dan komunikasi dalam pelaksanaannya pada indikator kebijakan pada dimensi Implementasi Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dengan pelaksanaan evaluasi kebijakan terkait kebijakan memiliki kejelasan koordinasi dan komunikasi dalam pelaksanaannya pada dimensi Implementasi Kebijakan (IKK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IKK.IK.1 -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan evaluasi mengenai kebijakan memiliki kejelasan koordinasi dan komunikasi dalam pelaksanaannya pada indikator kebijakan pada dimensi Implementasi Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan pelaksanaan evaluasi kebijakan terkait kebijakan memiliki kejelasan koordinasi dan komunikasi dalam pelaksanaannya pada dimensi Implementasi Kebijakan (IKK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IKK.IK.1 -> SS1-PEMDI.D.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan evaluasi mengenai kebijakan memiliki kejelasan koordinasi dan komunikasi dalam pelaksanaannya pada indikator kebijakan pada dimensi Implementasi Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) dengan pelaksanaan evaluasi kebijakan terkait kebijakan memiliki kejelasan koordinasi dan komunikasi dalam pelaksanaannya pada dimensi Implementasi Kebijakan (IKK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IKK.PK.1 -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan disusun berdasarkan data dan informasi yang valid (kajian / telaahan / penelitian / analisis kebijakan) pada indikator kebijakan pada dimensi Perencanaan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan disusun berdasarkan data dan informasi yang valid (kajian / telaahan / penelitian / analisis kebijakan) pada dimensi Perencanaan Kebijakan (IKK)."
      },
      "SS5-IKK.PK.1 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran pertanyaan evaluasi mengenai kebijakan disusun berdasarkan data dan informasi yang valid (kajian / telaahan / penelitian / analisis kebijakan) pada indikator kebijakan pada dimensi Perencanaan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) guna memperkuat pelaksanaan evaluasi kebijakan terkait kebijakan disusun berdasarkan data dan informasi yang valid (kajian / telaahan / penelitian / analisis kebijakan) pada dimensi Perencanaan Kebijakan (IKK)."
      },
      "SS5-IKK.PK.1 -> SS1-PEMDI.TKM.1": {
            "jenis": "Keselarasan Perencanaan",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) memiliki keselarasan perencanaan dengan pengukuran pertanyaan evaluasi mengenai kebijakan disusun berdasarkan data dan informasi yang valid (kajian / telaahan / penelitian / analisis kebijakan) pada indikator kebijakan pada dimensi Perencanaan Kebijakan dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan pelaksanaan evaluasi kebijakan terkait kebijakan disusun berdasarkan data dan informasi yang valid (kajian / telaahan / penelitian / analisis kebijakan) pada dimensi Perencanaan Kebijakan (IKK) agar dokumen serta target perencanaan tetap konsisten."
      },
      "SS5-IKK.TPP.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan evaluasi mengenai informasi kebijakan dapat diakses oleh publik pada indikator kebijakan pada dimensi Transparansi dan Partisipasi Publik dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pelaksanaan evaluasi kebijakan terkait informasi kebijakan dapat diakses oleh publik pada dimensi Transparansi dan Partisipasi Publik (IKK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IKK.TPP.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pertanyaan evaluasi mengenai informasi kebijakan dapat diakses oleh publik pada indikator kebijakan pada dimensi Transparansi dan Partisipasi Publik dalam Indeks Kualitas Kebijakan (IKK).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pelaksanaan evaluasi kebijakan terkait informasi kebijakan dapat diakses oleh publik pada dimensi Transparansi dan Partisipasi Publik (IKK) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.AI.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai informasi pelayanan yang terdiri dari 6 komponen service delivery Standar Pelayanan belum tersedia atau hanya tersedia sebagian dan informasi sulit ditemukan atau sulit diakses oleh Pengguna Layanan pada indikator terkait ketersediaan, kemutakhiran, dan kemudahan akses informasi pelayanan termasuk bagi kelompok rentan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan parameter informasi pelayanan yang terdiri dari 6 komponen service delivery Standar Pelayanan belum tersedia atau hanya tersedia sebagian dan informasi sulit ditemukan atau sulit diakses oleh Pengguna Layanan pada indikator terkait ketersediaan, kemutakhiran, dan kemudahan akses informasi pelayanan termasuk bagi kelompok rentan (IPP)."
      },
      "SS5-IPP.AI.2 -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai sarana dan prasarana yang ada ≤50% berfungsi dalam proses penyelenggaraan pelayanan pada indikator terkait keberfungsian sarana dan prasarana dalam mengurangi hambatan penyelenggaraan pelayanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat pemenuhan parameter sarana dan prasarana yang ada ≤50% berfungsi dalam proses penyelenggaraan pelayanan pada indikator terkait keberfungsian sarana dan prasarana dalam mengurangi hambatan penyelenggaraan pelayanan (IPP)."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KLDP.3": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (PEMDI) dengan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP)."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP)."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.D.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.D.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.D.4": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai penerapan tata kelola dan teknis PDP masih bersifat ad-hoc (tanpa arah kebijakan organisasi implementasi PDP) pada indikator Tingkat Kematangan Pelindungan Data Pribadi (aspek Data) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria penerapan tata kelola dan teknis PDP masih bersifat ad-hoc (tanpa arah kebijakan organisasi implementasi PDP) pada indikator Tingkat Kematangan Pelindungan Data Pribadi (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KP.3": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan penerapan teknologi kriptografi untuk keamanan data, sesuai dengan peraturan perundang-undangan pada indikator Tingkat Kematangan Penerapan Kriptografi untuk Keamanan Data (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam tahap penyiapan penerapan teknologi kriptografi untuk keamanan data, sesuai dengan peraturan perundang-undangan pada indikator Tingkat Kematangan Penerapan Kriptografi untuk Keamanan Data (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.TKM.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.TKM.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) dan pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP)."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (Aspek Aksesibilitas Dan Inklusivitas) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat pemenuhan parameter tersedia salah 1 (satu) kanal pelayanan fisik atau digital untuk seluruh jenis pelayanan pada indikator terkait ketersediaan pilihan kanal pelayanan fisik dan digital sebagai alternatif akses pengguna layanan (IPP)."
      },
      "SS5-IPP.EP.1 -> SS1-PEMDI.D.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai inovasi sudah diterapkan tapi tidak ada baseline, tidak ada target dan belum diukur dampaknya pada indikator terkait pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (Aspek Efektivitas Pemerintahan) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) guna memperkuat peningkatan pemenuhan parameter pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (terkait kondisi: inovasi sudah diterapkan tapi tidak ada baseline, tidak ada target dan belum diukur dampaknya) pada indikator terkait pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (IPP)."
      },
      "SS5-IPP.EP.1 -> SS1-PEMDI.KP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai inovasi sudah diterapkan tapi tidak ada baseline, tidak ada target dan belum diukur dampaknya pada indikator terkait pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (Aspek Efektivitas Pemerintahan) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (PEMDI) guna memperkuat peningkatan pemenuhan parameter pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (terkait kondisi: inovasi sudah diterapkan tapi tidak ada baseline, tidak ada target dan belum diukur dampaknya) pada indikator terkait pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (IPP)."
      },
      "SS5-IPP.EP.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai inovasi sudah diterapkan tapi tidak ada baseline, tidak ada target dan belum diukur dampaknya pada indikator terkait pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (Aspek Efektivitas Pemerintahan) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat peningkatan pemenuhan parameter pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (terkait kondisi: inovasi sudah diterapkan tapi tidak ada baseline, tidak ada target dan belum diukur dampaknya) pada indikator terkait pengukuran dampak perubahan layanan (baseline dan target) serta pelembagaan inovasi pelayanan (IPP)."
      },
      "SS5-IPP.EP.2 -> SS1-PEMDI.D.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai pelaksanaan inovasi sudah didokumentasikan namun belum dilakukan evaluasi pada indikator terkait evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (Aspek Efektivitas Pemerintahan) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) guna memperkuat peningkatan pemenuhan parameter evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (terkait kondisi: pelaksanaan inovasi sudah didokumentasikan namun belum dilakukan evaluasi) pada indikator terkait evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (IPP)."
      },
      "SS5-IPP.EP.2 -> SS1-PEMDI.KP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai pelaksanaan inovasi sudah didokumentasikan namun belum dilakukan evaluasi pada indikator terkait evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (Aspek Efektivitas Pemerintahan) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (PEMDI) guna memperkuat peningkatan pemenuhan parameter evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (terkait kondisi: pelaksanaan inovasi sudah didokumentasikan namun belum dilakukan evaluasi) pada indikator terkait evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (IPP)."
      },
      "SS5-IPP.EP.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai pelaksanaan inovasi sudah didokumentasikan namun belum dilakukan evaluasi pada indikator terkait evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (Aspek Efektivitas Pemerintahan) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat peningkatan pemenuhan parameter evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (terkait kondisi: pelaksanaan inovasi sudah didokumentasikan namun belum dilakukan evaluasi) pada indikator terkait evaluasi, pembelajaran, diseminasi, dan replikasi inovasi pelayanan publik (IPP)."
      },
      "SS5-IPP.FT.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tersedia Standar Pelayanan dan Maklumat Pelayanan namun belum ditetapkan dan/atau tidak sesuai dengan ketentuan peraturan perundang-undangan yang berlaku pada indikator terkait implementasi Standar Pelayanan dan Maklumat Pelayanan berdasarkan perjalanan pengguna (user journey) (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat peningkatan pemenuhan parameter implementasi Standar Pelayanan dan Maklumat Pelayanan berdasarkan perjalanan pengguna (user journey) (terkait kondisi: tersedia Standar Pelayanan dan Maklumat Pelayanan namun belum ditetapkan dan/atau tidak sesuai dengan ketentuan peraturan perundang-undangan yang berlaku) pada indikator terkait implementasi Standar Pelayanan dan Maklumat Pelayanan berdasarkan perjalanan pengguna (user journey) (IPP)."
      },
      "SS5-IPP.FT.1 -> SS1-PEMDI.KLDP.3": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai tersedia Standar Pelayanan dan Maklumat Pelayanan namun belum ditetapkan dan/atau tidak sesuai dengan ketentuan peraturan perundang-undangan yang berlaku pada indikator terkait implementasi Standar Pelayanan dan Maklumat Pelayanan berdasarkan perjalanan pengguna (user journey) (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (PEMDI) dengan peningkatan pemenuhan parameter implementasi Standar Pelayanan dan Maklumat Pelayanan berdasarkan perjalanan pengguna (user journey) (terkait kondisi: tersedia Standar Pelayanan dan Maklumat Pelayanan namun belum ditetapkan dan/atau tidak sesuai dengan ketentuan peraturan perundang-undangan yang berlaku) pada indikator terkait implementasi Standar Pelayanan dan Maklumat Pelayanan berdasarkan perjalanan pengguna (user journey) (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tidak tersedia data kinerja berupa data penyelesaian pelayanan pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat peningkatan pemenuhan parameter pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (terkait kondisi: tidak tersedia data kinerja berupa data penyelesaian pelayanan) pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (IPP)."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tidak tersedia data kinerja berupa data penyelesaian pelayanan pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat peningkatan pemenuhan parameter pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (terkait kondisi: tidak tersedia data kinerja berupa data penyelesaian pelayanan) pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (IPP)."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai tidak tersedia data kinerja berupa data penyelesaian pelayanan pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) dengan peningkatan pemenuhan parameter pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (terkait kondisi: tidak tersedia data kinerja berupa data penyelesaian pelayanan) pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.D.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tidak tersedia data kinerja berupa data penyelesaian pelayanan pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) guna memperkuat peningkatan pemenuhan parameter pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (terkait kondisi: tidak tersedia data kinerja berupa data penyelesaian pelayanan) pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (IPP)."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai tidak tersedia data kinerja berupa data penyelesaian pelayanan pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dengan peningkatan pemenuhan parameter pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (terkait kondisi: tidak tersedia data kinerja berupa data penyelesaian pelayanan) pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai tidak tersedia data kinerja berupa data penyelesaian pelayanan pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan peningkatan pemenuhan parameter pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (terkait kondisi: tidak tersedia data kinerja berupa data penyelesaian pelayanan) pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.TKM.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai tidak tersedia data kinerja berupa data penyelesaian pelayanan pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan peningkatan pemenuhan parameter pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (terkait kondisi: tidak tersedia data kinerja berupa data penyelesaian pelayanan) pada indikator terkait pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi hambatan (bottleneck/disparitas/pain point) dan perbaikan layanan (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.FT.3 -> SS1-PEMDI.P.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai belum terdapat evaluasi kinerja SDM yang terkait dengan pelayanan; atau evaluasi kinerja/SKP telah dilakukan tetapi hasilnya belum digunakan untuk perbaikan kinerja pelayanan pada indikator terkait evaluasi kinerja SDM/SKP, penerapan penghargaan/sanksi, dan pengembangan kompetensi SDM pelayanan (Aspek Fondasi Teknis) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) dengan peningkatan pemenuhan parameter evaluasi kinerja SDM/SKP, penerapan penghargaan/sanksi, dan pengembangan kompetensi SDM pelayanan (terkait kondisi: belum terdapat evaluasi kinerja SDM yang terkait dengan pelayanan; atau evaluasi kinerja/SKP telah dilakukan tetapi hasilnya belum digunakan untuk perbaikan kinerja pelayanan) pada indikator terkait evaluasi kinerja SDM/SKP, penerapan penghargaan/sanksi, dan pengembangan kompetensi SDM pelayanan (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.KM.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai belum tersedia data waktu penyelesaian atau telah tersedia Rata-rata Tindak Lanjut lebih dari 10 hari kerja melalui berbagai kanal pada indikator terkait kecepatan waktu tindak lanjut aspirasi dan pengaduan masyarakat (Aspek Keterlibatan Masyarakat) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan peningkatan pemenuhan parameter kecepatan waktu tindak lanjut aspirasi dan pengaduan masyarakat (terkait kondisi: belum tersedia data waktu penyelesaian atau telah tersedia Rata-rata Tindak Lanjut lebih dari 10 hari kerja melalui berbagai kanal) pada indikator terkait kecepatan waktu tindak lanjut aspirasi dan pengaduan masyarakat (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.KM.2 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai aspirasi dan pengaduan masyarakat dikelola melalui berbagai kanal pengaduan pada indikator terkait pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR! (Aspek Keterlibatan Masyarakat) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan parameter aspirasi dan pengaduan masyarakat dikelola melalui berbagai kanal pengaduan pada indikator terkait pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR! (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.KM.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai aspirasi dan pengaduan masyarakat dikelola melalui berbagai kanal pengaduan pada indikator terkait pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR! (Aspek Keterlibatan Masyarakat) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan parameter aspirasi dan pengaduan masyarakat dikelola melalui berbagai kanal pengaduan pada indikator terkait pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR! (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.KM.2 -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai aspirasi dan pengaduan masyarakat dikelola melalui berbagai kanal pengaduan pada indikator terkait pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR! (Aspek Keterlibatan Masyarakat) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat pemenuhan parameter aspirasi dan pengaduan masyarakat dikelola melalui berbagai kanal pengaduan pada indikator terkait pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR! (IPP)."
      },
      "SS5-IPP.KM.2 -> SS1-PEMDI.TKM.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai aspirasi dan pengaduan masyarakat dikelola melalui berbagai kanal pengaduan pada indikator terkait pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR! (Aspek Keterlibatan Masyarakat) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) guna memperkuat pemenuhan parameter aspirasi dan pengaduan masyarakat dikelola melalui berbagai kanal pengaduan pada indikator terkait pengelolaan, tindak lanjut substantif, dan pemanfaatan aspirasi serta pengaduan masyarakat melalui SP4N-LAPOR! (IPP)."
      },
      "SS5-IPP.KM.3 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai tidak terdapat Rencana Tindak Lanjut (RTL) FKP; atau RTL tersedia, tetapi tindak lanjut belum dilaksanakan pada indikator terkait pelaksanaan Rencana Tindak Lanjut (RTL) Forum Konsultasi Publik (FKP) untuk menghasilkan perubahan pelayanan yang terukur (Aspek Keterlibatan Masyarakat) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan peningkatan pemenuhan parameter pelaksanaan Rencana Tindak Lanjut (RTL) Forum Konsultasi Publik (FKP) untuk menghasilkan perubahan pelayanan yang terukur (terkait kondisi: tidak terdapat Rencana Tindak Lanjut (RTL) FKP; atau RTL tersedia, tetapi tindak lanjut belum dilaksanakan) pada indikator terkait pelaksanaan Rencana Tindak Lanjut (RTL) Forum Konsultasi Publik (FKP) untuk menghasilkan perubahan pelayanan yang terukur (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-IPP.KM.3 -> SS1-PEMDI.P.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) mendukung pengukuran parameter penilaian mengenai tidak terdapat Rencana Tindak Lanjut (RTL) FKP; atau RTL tersedia, tetapi tindak lanjut belum dilaksanakan pada indikator terkait pelaksanaan Rencana Tindak Lanjut (RTL) Forum Konsultasi Publik (FKP) untuk menghasilkan perubahan pelayanan yang terukur (Aspek Keterlibatan Masyarakat) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) guna memperkuat peningkatan pemenuhan parameter pelaksanaan Rencana Tindak Lanjut (RTL) Forum Konsultasi Publik (FKP) untuk menghasilkan perubahan pelayanan yang terukur (terkait kondisi: tidak terdapat Rencana Tindak Lanjut (RTL) FKP; atau RTL tersedia, tetapi tindak lanjut belum dilaksanakan) pada indikator terkait pelaksanaan Rencana Tindak Lanjut (RTL) Forum Konsultasi Publik (FKP) untuk menghasilkan perubahan pelayanan yang terukur (IPP)."
      },
      "SS5-IPP.KM.4 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran parameter penilaian mengenai tidak terdapat RTL hasil SKM atau tidak ada tindak lanjut; atau RTL tersedia, tetapi tindak lanjut belum dilaksanakan secara nyata pada indikator terkait pemanfaatan dan pelaksanaan Rencana Tindak Lanjut (RTL) hasil Survei Kepuasan Masyarakat (SKM) (Aspek Keterlibatan Masyarakat) pada Indeks Pelayanan Publik (IPP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan peningkatan pemenuhan parameter pemanfaatan dan pelaksanaan Rencana Tindak Lanjut (RTL) hasil Survei Kepuasan Masyarakat (SKM) (terkait kondisi: tidak terdapat RTL hasil SKM atau tidak ada tindak lanjut; atau RTL tersedia, tetapi tindak lanjut belum dilaksanakan secara nyata) pada indikator terkait pemanfaatan dan pelaksanaan Rencana Tindak Lanjut (RTL) hasil Survei Kepuasan Masyarakat (SKM) (IPP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.I.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai pengetahuan tentang lembaga Ombudsman pada variabel penilaian \"Pengetahuan tentang lembaga Ombudsman\" (dimensi Input — Pengetahuan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kepatuhan atas pengetahuan tentang lembaga Ombudsman pada dimensi Input — Pengetahuan pada variabel \"Pengetahuan tentang lembaga Ombudsman\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.I.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai pengetahuan tentang lembaga Ombudsman pada variabel penilaian \"Pengetahuan tentang lembaga Ombudsman\" (dimensi Input — Pengetahuan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kepatuhan atas pengetahuan tentang lembaga Ombudsman pada dimensi Input — Pengetahuan pada variabel \"Pengetahuan tentang lembaga Ombudsman\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.I.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai pemanfaatan Hasil Penilaian Ombudsman masuk dalam indikator kinerja pada variabel penilaian \"Pemanfaatan Hasil Penilaian Ombudsman masuk dalam indikator kinerja\" (dimensi Input — Perencanaan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kepatuhan atas pemanfaatan Hasil Penilaian Ombudsman masuk dalam indikator kinerja pada dimensi Input — Perencanaan pada variabel \"Pemanfaatan Hasil Penilaian Ombudsman masuk dalam indikator kinerja\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.I.2 -> SS1-PEMDI.D.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran indikator kepatuhan mengenai pemanfaatan Hasil Penilaian Ombudsman masuk dalam indikator kinerja pada variabel penilaian \"Pemanfaatan Hasil Penilaian Ombudsman masuk dalam indikator kinerja\" (dimensi Input — Perencanaan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) guna memperkuat pemenuhan kepatuhan atas pemanfaatan Hasil Penilaian Ombudsman masuk dalam indikator kinerja pada dimensi Input — Perencanaan pada variabel \"Pemanfaatan Hasil Penilaian Ombudsman masuk dalam indikator kinerja\" (OP)."
      },
      "SS5-OP.KMT.1 -> SS1-PEMDI.D.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran indikator kepatuhan mengenai integritas pada variabel penilaian \"Integritas\" (dimensi Kepercayaan Masyarakat — Faktor Kepercayaan Masyarakat) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) guna memperkuat pemenuhan kepatuhan atas integritas pada dimensi Kepercayaan Masyarakat — Faktor Kepercayaan Masyarakat pada variabel \"Integritas\" (OP)."
      },
      "SS5-OP.KMT.1 -> SS1-PEMDI.P.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) mendukung pengukuran indikator kepatuhan mengenai integritas pada variabel penilaian \"Integritas\" (dimensi Kepercayaan Masyarakat — Faktor Kepercayaan Masyarakat) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) guna memperkuat pemenuhan kepatuhan atas integritas pada dimensi Kepercayaan Masyarakat — Faktor Kepercayaan Masyarakat pada variabel \"Integritas\" (OP)."
      },
      "SS5-OP.KMT.1 -> SS1-PEMDI.KP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai dengan substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah, serta Arsitektur Keamanan Pemdi dan Arsitektur Teknologi Pemdi pada indikator Tingkat Kematangan Pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran indikator kepatuhan mengenai integritas pada variabel penilaian \"Integritas\" (dimensi Kepercayaan Masyarakat — Faktor Kepercayaan Masyarakat) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai dengan substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah, serta Arsitektur Keamanan Pemdi dan Arsitektur Teknologi Pemdi pada indikator Tingkat Kematangan Pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (PEMDI) guna memperkuat pemenuhan kepatuhan atas integritas pada dimensi Kepercayaan Masyarakat — Faktor Kepercayaan Masyarakat pada variabel \"Integritas\" (OP)."
      },
      "SS5-OP.O.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai IPM (Pemerintah Daerah) pada variabel penilaian \"IPM (Pemerintah Daerah)\" (dimensi Output — Hasil penilaian eksternal) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kepatuhan atas IPM (Pemerintah Daerah) pada dimensi Output — Hasil penilaian eksternal pada variabel \"IPM (Pemerintah Daerah)\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai dasar hukum pada variabel penilaian \"Dasar hukum\" (dimensi Proses — Standar Pelayanan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kepatuhan atas dasar hukum pada dimensi Proses — Standar Pelayanan pada variabel \"Dasar hukum\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai dasar hukum pada variabel penilaian \"Dasar hukum\" (dimensi Proses — Standar Pelayanan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kepatuhan atas dasar hukum pada dimensi Proses — Standar Pelayanan pada variabel \"Dasar hukum\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran indikator kepatuhan mengenai dasar hukum pada variabel penilaian \"Dasar hukum\" (dimensi Proses — Standar Pelayanan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (PEMDI) guna memperkuat pemenuhan kepatuhan atas dasar hukum pada dimensi Proses — Standar Pelayanan pada variabel \"Dasar hukum\" (OP)."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.D.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai dasar hukum pada variabel penilaian \"Dasar hukum\" (dimensi Proses — Standar Pelayanan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) dengan pemenuhan kepatuhan atas dasar hukum pada dimensi Proses — Standar Pelayanan pada variabel \"Dasar hukum\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.D.3": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai dasar hukum pada variabel penilaian \"Dasar hukum\" (dimensi Proses — Standar Pelayanan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) dengan pemenuhan kepatuhan atas dasar hukum pada dimensi Proses — Standar Pelayanan pada variabel \"Dasar hukum\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai dasar hukum pada variabel penilaian \"Dasar hukum\" (dimensi Proses — Standar Pelayanan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) dengan pemenuhan kepatuhan atas dasar hukum pada dimensi Proses — Standar Pelayanan pada variabel \"Dasar hukum\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai dasar hukum pada variabel penilaian \"Dasar hukum\" (dimensi Proses — Standar Pelayanan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dengan pemenuhan kepatuhan atas dasar hukum pada dimensi Proses — Standar Pelayanan pada variabel \"Dasar hukum\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.P.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) mendukung pengukuran indikator kepatuhan mengenai dasar hukum pada variabel penilaian \"Dasar hukum\" (dimensi Proses — Standar Pelayanan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) guna memperkuat pemenuhan kepatuhan atas dasar hukum pada dimensi Proses — Standar Pelayanan pada variabel \"Dasar hukum\" (OP)."
      },
      "SS5-OP.P.2 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran pengawasan dan pencegahan maladministrasi terkait perilaku atau perbuatan melawan hukum pada variabel penilaian \"Perilaku atau perbuatan melawan hukum\" (dimensi Proses — Maladministrasi) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pencegahan maladministrasi terkait perilaku atau perbuatan melawan hukum pada dimensi Proses — Maladministrasi pada variabel \"Perilaku atau perbuatan melawan hukum\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.PN.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai penyelenggara pelayanan melaksanakan kewajiban pada variabel penilaian \"Penyelenggara pelayanan melaksanakan kewajiban\" (dimensi Pengaduan — Pengelolaan pengaduan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kepatuhan atas penyelenggara pelayanan melaksanakan kewajiban pada dimensi Pengaduan — Pengelolaan pengaduan pada variabel \"Penyelenggara pelayanan melaksanakan kewajiban\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.PN.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran indikator kepatuhan mengenai penyelenggara pelayanan melaksanakan kewajiban pada variabel penilaian \"Penyelenggara pelayanan melaksanakan kewajiban\" (dimensi Pengaduan — Pengelolaan pengaduan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kepatuhan atas penyelenggara pelayanan melaksanakan kewajiban pada dimensi Pengaduan — Pengelolaan pengaduan pada variabel \"Penyelenggara pelayanan melaksanakan kewajiban\" (OP) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-OP.PN.1 -> SS1-PEMDI.D.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran indikator kepatuhan mengenai penyelenggara pelayanan melaksanakan kewajiban pada variabel penilaian \"Penyelenggara pelayanan melaksanakan kewajiban\" (dimensi Pengaduan — Pengelolaan pengaduan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) guna memperkuat pemenuhan kepatuhan atas penyelenggara pelayanan melaksanakan kewajiban pada dimensi Pengaduan — Pengelolaan pengaduan pada variabel \"Penyelenggara pelayanan melaksanakan kewajiban\" (OP)."
      },
      "SS5-OP.PN.1 -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran indikator kepatuhan mengenai penyelenggara pelayanan melaksanakan kewajiban pada variabel penilaian \"Penyelenggara pelayanan melaksanakan kewajiban\" (dimensi Pengaduan — Pengelolaan pengaduan) pada Opini Ombudsman (OP).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat pemenuhan kepatuhan atas penyelenggara pelayanan melaksanakan kewajiban pada dimensi Pengaduan — Pengelolaan pengaduan pada variabel \"Penyelenggara pelayanan melaksanakan kewajiban\" (OP)."
      },
      "SS5-ZI.MP.1 -> SS1-PEMDI.D.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai agen perubahan telah membuat perubahan yang konkret di Instansi (dalam, tahun) pada program/sub-komponen \"Komitmen dalam perubahan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) guna memperkuat pemenuhan kriteria agen perubahan telah membuat perubahan yang konkret di Instansi (dalam, tahun) pada program \"Komitmen dalam perubahan\" (ZI)."
      },
      "SS5-ZI.MP.1 -> SS1-PEMDI.KP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai agen perubahan telah membuat perubahan yang konkret di Instansi (dalam, tahun) pada program/sub-komponen \"Komitmen dalam perubahan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (PEMDI) guna memperkuat pemenuhan kriteria agen perubahan telah membuat perubahan yang konkret di Instansi (dalam, tahun) pada program \"Komitmen dalam perubahan\" (ZI)."
      },
      "SS5-ZI.MP.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai agen perubahan telah membuat perubahan yang konkret di Instansi (dalam, tahun) pada program/sub-komponen \"Komitmen dalam perubahan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria agen perubahan telah membuat perubahan yang konkret di Instansi (dalam, tahun) pada program \"Komitmen dalam perubahan\" (ZI)."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.D.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program/sub-komponen \"Komitmen Pimpinan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) guna memperkuat pemenuhan kriteria pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program \"Komitmen Pimpinan\" (ZI)."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program/sub-komponen \"Komitmen Pimpinan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) guna memperkuat pemenuhan kriteria pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program \"Komitmen Pimpinan\" (ZI)."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program/sub-komponen \"Komitmen Pimpinan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) guna memperkuat pemenuhan kriteria pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program \"Komitmen Pimpinan\" (ZI)."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program/sub-komponen \"Komitmen Pimpinan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) guna memperkuat pemenuhan kriteria pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program \"Komitmen Pimpinan\" (ZI)."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.TKM.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program/sub-komponen \"Komitmen Pimpinan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) guna memperkuat pemenuhan kriteria pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program \"Komitmen Pimpinan\" (ZI)."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.TKM.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program/sub-komponen \"Komitmen Pimpinan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program \"Komitmen Pimpinan\" (ZI)."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program/sub-komponen \"Komitmen Pimpinan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat pemenuhan kriteria pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program \"Komitmen Pimpinan\" (ZI)."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program/sub-komponen \"Komitmen Pimpinan\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat pemenuhan kriteria pimpinan memiliki komitmen terhadap pelaksanaan reformasi birokrasi, dengan adanya target capaian reformasi yang jelas di dokumen perencanaan pada program \"Komitmen Pimpinan\" (ZI)."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program/sub-komponen \"Membangun Budaya Kerja\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) guna memperkuat pemenuhan kriteria instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program \"Membangun Budaya Kerja\" (ZI)."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program/sub-komponen \"Membangun Budaya Kerja\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) guna memperkuat pemenuhan kriteria instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program \"Membangun Budaya Kerja\" (ZI)."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.TKM.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program/sub-komponen \"Membangun Budaya Kerja\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) guna memperkuat pemenuhan kriteria instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program \"Membangun Budaya Kerja\" (ZI)."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.TKM.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program/sub-komponen \"Membangun Budaya Kerja\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program \"Membangun Budaya Kerja\" (ZI)."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program/sub-komponen \"Membangun Budaya Kerja\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat pemenuhan kriteria instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program \"Membangun Budaya Kerja\" (ZI)."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program/sub-komponen \"Membangun Budaya Kerja\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat pemenuhan kriteria instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program \"Membangun Budaya Kerja\" (ZI)."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.KP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai dengan substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah, serta Arsitektur Keamanan Pemdi dan Arsitektur Teknologi Pemdi pada indikator Tingkat Kematangan Pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program/sub-komponen \"Membangun Budaya Kerja\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai dengan substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah, serta Arsitektur Keamanan Pemdi dan Arsitektur Teknologi Pemdi pada indikator Tingkat Kematangan Pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (PEMDI) guna memperkuat pemenuhan kriteria instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program \"Membangun Budaya Kerja\" (ZI)."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.KP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program/sub-komponen \"Membangun Budaya Kerja\" (Pengungkit — Manajemen Perubahan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (PEMDI) guna memperkuat pemenuhan kriteria instansi membangun budaya kerja positif dan menerapkan nilai-nilai organisasi dalam pelaksanaan tugas sehari-hari pada program \"Membangun Budaya Kerja\" (ZI)."
      },
      "SS5-ZI.PA.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai dokumen perencanaan kinerja sudah ada pada program/sub-komponen \"Pengelolaan Akuntabilitas Kinerja\" (Pengungkit — Penguatan Akuntabilitas) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria dokumen perencanaan kinerja sudah ada pada program \"Pengelolaan Akuntabilitas Kinerja\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PA.4 -> SS1-PEMDI.KP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai dengan substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah, serta Arsitektur Keamanan Pemdi dan Arsitektur Teknologi Pemdi pada indikator Tingkat Kematangan Pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah dibangun lingkungan pengendalian pada program/sub-komponen \"Penerapan Sistem Pengendalian Intern Pemerintah (SPIP)\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria instansi Pemerintah telah membentuk Tim Audit dan Perencanaan Audit sesuai dengan substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah, serta Arsitektur Keamanan Pemdi dan Arsitektur Teknologi Pemdi pada indikator Tingkat Kematangan Pelaksanaan Audit Keamanan Pemdi dan Teknologi Pemdi (PEMDI) guna memperkuat pemenuhan kriteria telah dibangun lingkungan pengendalian pada program \"Penerapan Sistem Pengendalian Intern Pemerintah (SPIP)\" (ZI)."
      },
      "SS5-ZI.PA.4 -> SS1-PEMDI.KP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah dibangun lingkungan pengendalian pada program/sub-komponen \"Penerapan Sistem Pengendalian Intern Pemerintah (SPIP)\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (PEMDI) guna memperkuat pemenuhan kriteria telah dibangun lingkungan pengendalian pada program \"Penerapan Sistem Pengendalian Intern Pemerintah (SPIP)\" (ZI)."
      },
      "SS5-ZI.PA.5 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai kebijakan Pengaduan masyarakat telah diimplementasikan pada program/sub-komponen \"Pengaduan Masyarakat\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria kebijakan Pengaduan masyarakat telah diimplementasikan pada program \"Pengaduan Masyarakat\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PA.5 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai kebijakan Pengaduan masyarakat telah diimplementasikan pada program/sub-komponen \"Pengaduan Masyarakat\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria kebijakan Pengaduan masyarakat telah diimplementasikan pada program \"Pengaduan Masyarakat\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai terdapat kebijakan standar pelayanan pada program/sub-komponen \"Standar Pelayanan\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria terdapat kebijakan standar pelayanan pada program \"Standar Pelayanan\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.2 -> SS1-PEMDI.P.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah dilakukan berbagai upaya peningkatan kemampuan dan/atau kompetensi tentang penerapan budaya pelayanan prima pada program/sub-komponen \"Budaya Pelayanan Prima\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) guna memperkuat pemenuhan kriteria telah dilakukan berbagai upaya peningkatan kemampuan dan/atau kompetensi tentang penerapan budaya pelayanan prima pada program \"Budaya Pelayanan Prima\" (ZI)."
      },
      "SS5-ZI.PKPP.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah dilakukan berbagai upaya peningkatan kemampuan dan/atau kompetensi tentang penerapan budaya pelayanan prima pada program/sub-komponen \"Budaya Pelayanan Prima\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria telah dilakukan berbagai upaya peningkatan kemampuan dan/atau kompetensi tentang penerapan budaya pelayanan prima pada program \"Budaya Pelayanan Prima\" (ZI)."
      },
      "SS5-ZI.PKPP.2 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah dilakukan berbagai upaya peningkatan kemampuan dan/atau kompetensi tentang penerapan budaya pelayanan prima pada program/sub-komponen \"Budaya Pelayanan Prima\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria telah dilakukan berbagai upaya peningkatan kemampuan dan/atau kompetensi tentang penerapan budaya pelayanan prima pada program \"Budaya Pelayanan Prima\" (ZI)."
      },
      "SS5-ZI.PKPP.3 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai terdapat media pengaduan dan konsultasi pelayanan yang terintegrasi dengan SP4N-Lapor pada program/sub-komponen \"Pengelolaan Pengaduan\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria terdapat media pengaduan dan konsultasi pelayanan yang terintegrasi dengan SP4N-Lapor pada program \"Pengelolaan Pengaduan\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.3 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai terdapat media pengaduan dan konsultasi pelayanan yang terintegrasi dengan SP4N-Lapor pada program/sub-komponen \"Pengelolaan Pengaduan\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria terdapat media pengaduan dan konsultasi pelayanan yang terintegrasi dengan SP4N-Lapor pada program \"Pengelolaan Pengaduan\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.4 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah dilakukan survey kepuasan masyarakat terhadap pelayanan pada program/sub-komponen \"Penilaian Kepuasan terhadap Pelayanan\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria telah dilakukan survey kepuasan masyarakat terhadap pelayanan pada program \"Penilaian Kepuasan terhadap Pelayanan\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) dan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.3": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.TKM.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.TKM.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI)."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI)."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.D.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.P.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.P.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.D.3": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KP.4": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai telah menerapkan teknologi informasi dalam memberikan pelayanan pada program/sub-komponen \"Pemanfaatan Teknologi Informasi\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyiapan untuk Penanganan Insiden Siber pada Layanan Digital Pemerintah pada indikator Tingkat Kematangan Kapabilitas Penanganan Insiden Siber (PEMDI) dengan pemenuhan kriteria telah menerapkan teknologi informasi dalam memberikan pelayanan pada program \"Pemanfaatan Teknologi Informasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program/sub-komponen \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) guna memperkuat pemenuhan kriteria telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (ZI)."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program/sub-komponen \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) guna memperkuat pemenuhan kriteria telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (ZI)."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.TKM.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program/sub-komponen \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) guna memperkuat pemenuhan kriteria telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (ZI)."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.TKM.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program/sub-komponen \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (ZI)."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program/sub-komponen \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat pemenuhan kriteria telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (ZI)."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.TP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program/sub-komponen \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) guna memperkuat pemenuhan kriteria telah disusun peta proses bisnis dengan adanya penyederhanaan jabatan pada program \"Peta Proses Bisnis Mempengaruhi Penyederhanaan Jabatan\" (ZI)."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) dan pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KLDP.3": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dan pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI)."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI)."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.P.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) dan pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.TKM.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dan pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.TKM.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) dan pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.TP.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) dan pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.TP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) dan pemenuhan kriteria implementasi SPBE telah terintegrasi dan mampu mendorong pelaksanaan pelayanan publik yang lebih cepat dan efisien pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE) yang Terintegrasi\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PPP.6 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai nilai Persepsi Kualitas Pelayanan (Survei Eksternal) pada program/sub-komponen \"Penanganan Pengaduan Pelayanan dan Konsultasi\" (Total Pengungkit — Pelayanan Publik yang Prima) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria nilai Persepsi Kualitas Pelayanan (Survei Eksternal) pada program \"Penanganan Pengaduan Pelayanan dan Konsultasi\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PPW.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah dilakukan mekanisme pengendalian aktivitas secara berjenjang pada program/sub-komponen \"Mekanisme Pengendalian\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria telah dilakukan mekanisme pengendalian aktivitas secara berjenjang pada program \"Mekanisme Pengendalian\" (ZI)."
      },
      "SS5-ZI.PPW.1 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai telah dilakukan mekanisme pengendalian aktivitas secara berjenjang pada program/sub-komponen \"Mekanisme Pengendalian\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria telah dilakukan mekanisme pengendalian aktivitas secara berjenjang pada program \"Mekanisme Pengendalian\" (ZI)."
      },
      "SS5-ZI.PPW.2 -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pencatatan dan evaluasi jumlah pengaduan masyarakat yang harus ditindaklanjuti pada mekanisme Pengendalian pada program/sub-komponen \"Mekanisme Pengendalian\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat pemenuhan kriteria pencatatan dan evaluasi jumlah pengaduan masyarakat yang harus ditindaklanjuti pada mekanisme Pengendalian pada program \"Mekanisme Pengendalian\" (ZI)."
      },
      "SS5-ZI.PPW.2 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pencatatan dan evaluasi jumlah pengaduan masyarakat yang harus ditindaklanjuti pada mekanisme Pengendalian pada program/sub-komponen \"Mekanisme Pengendalian\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria pencatatan dan evaluasi jumlah pengaduan masyarakat yang harus ditindaklanjuti pada mekanisme Pengendalian pada program \"Mekanisme Pengendalian\" (ZI)."
      },
      "SS5-ZI.PPW.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai pencatatan dan evaluasi jumlah pengaduan masyarakat yang harus ditindaklanjuti pada mekanisme Pengendalian pada program/sub-komponen \"Mekanisme Pengendalian\" (Pengungkit — Penguatan Pengawasan) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria pencatatan dan evaluasi jumlah pengaduan masyarakat yang harus ditindaklanjuti pada mekanisme Pengendalian pada program \"Mekanisme Pengendalian\" (ZI)."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.P.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) dengan pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.D.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) dengan pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dengan pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) dan pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dan pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.TKM.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.TP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program/sub-komponen \"Upaya dan/atau Inovasi Pelayanan Publik\" (Pengungkit — Peningkatan Kualitas Pelayanan Publik) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) guna memperkuat pemenuhan kriteria upaya dan/atau inovasi telah mendorong perbaikan pelayanan publik pada (mencakup: Kesesuaian Persyaratan, Kemudahan Sistem, Mekanisme, dan Prosedur, Kecepatan Waktu Penyelesaian, Kejelasan Biaya/Tarif, Gratis, Kualitas Produk Spesifikasi Jenis Pelayanan, Kompetensi Pelaksana/Web, Perilaku Pelaksana/Web, Kualitas Sarana dan prasarana, Penanganan Pengaduan, Saran dan Masukan) pada program \"Upaya dan/atau Inovasi Pelayanan Publik\" (ZI)."
      },
      "SS5-ZI.PSM.2 -> SS1-PEMDI.D.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai dalam melakukan pengembangan karier pegawai, telah dilakukan mutasi pegawai antar jabatan pada program/sub-komponen \"Pola Mutasi Internal\" (Pengungkit — Penataan Sistem Manajemen SDM Aparatur) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) guna memperkuat pemenuhan kriteria dalam melakukan pengembangan karier pegawai, telah dilakukan mutasi pegawai antar jabatan pada program \"Pola Mutasi Internal\" (ZI)."
      },
      "SS5-ZI.PSM.3 -> SS1-PEMDI.P.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai unit Kerja melakukan Training Need Analysis Untuk pengembangan kompetensi pada program/sub-komponen \"Pengembangan Pegawai Berbasis Kompetensi\" (Pengungkit — Penataan Sistem Manajemen SDM Aparatur) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) guna memperkuat pemenuhan kriteria unit Kerja melakukan Training Need Analysis Untuk pengembangan kompetensi pada program \"Pengembangan Pegawai Berbasis Kompetensi\" (ZI)."
      },
      "SS5-ZI.PT.1 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai SOP mengacu pada peta proses bisnis instansi pada program/sub-komponen \"Prosedur Operasional Tetap (SOP) Kegiatan Utama\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) guna memperkuat pemenuhan kriteria SOP mengacu pada peta proses bisnis instansi pada program \"Prosedur Operasional Tetap (SOP) Kegiatan Utama\" (ZI)."
      },
      "SS5-ZI.PT.1 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai SOP mengacu pada peta proses bisnis instansi pada program/sub-komponen \"Prosedur Operasional Tetap (SOP) Kegiatan Utama\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria SOP mengacu pada peta proses bisnis instansi pada program \"Prosedur Operasional Tetap (SOP) Kegiatan Utama\" (ZI)."
      },
      "SS5-ZI.PT.1 -> SS1-PEMDI.D.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai SOP mengacu pada peta proses bisnis instansi pada program/sub-komponen \"Prosedur Operasional Tetap (SOP) Kegiatan Utama\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) guna memperkuat pemenuhan kriteria SOP mengacu pada peta proses bisnis instansi pada program \"Prosedur Operasional Tetap (SOP) Kegiatan Utama\" (ZI)."
      },
      "SS5-ZI.PT.1 -> SS1-PEMDI.TKM.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai SOP mengacu pada peta proses bisnis instansi pada program/sub-komponen \"Prosedur Operasional Tetap (SOP) Kegiatan Utama\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria SOP mengacu pada peta proses bisnis instansi pada program \"Prosedur Operasional Tetap (SOP) Kegiatan Utama\" (ZI)."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.D.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (aspek Data) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan untuk Penyelenggara SDI dan dokumentasi dasar terhadap inisiatif tata kelola data sesuai dengan prinsip SDI pada indikator Tingkat Kematangan Tata Kelola Data (PEMDI) guna memperkuat pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI)."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KLDP.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi keterpaduan proses bisnis Pemdi Instansi Pemerintah pada indikator Keterpaduan Proses Bisnis Pemdi Lintas Unit dan Instansi (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KLDP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi integrasi aplikasi Instansi Pemerintah pada indikator Integrasi Aplikasi (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KLDP.3": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Layanan Digital Pemerintah pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan Portal Layanan Digital Pemerintah pada Instansi Pemerintah pada indikator Portal Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KLDP.4": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (aspek Keterpaduan Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Data Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi penerapan interoperabilitas data pada Instansi Pemerintah pada indikator Interoperabilitas Data (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KPLDP.1": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan Fasilitas Dukungan Pengguna Layanan Digital Instansi Pemerintah pada indikator Fasilitas Dukungan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI)."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) guna memperkuat pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI)."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.P.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam persiapan peningkatan kompetensi digital kepada ASN berbasis peta kompetensi untuk mencapai kompetensi digital optimal pada indikator Tingkat Kematangan Sumber Daya Manusia Pemdi (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.P.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (aspek Penyelenggara) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan mengenai kolaborasi antar unit kerja/perangkat daerah di Instansi Pemerintah di lingkungan instansi, dalam rangka peningkatan kualitas pelaksanaan Pemdi yang dilaksanakan secara terarah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Kolaborasi Pemdi (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.TKM.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi untuk perencanaan pada Instansi Pemerintah dalam tahap penyusunan pada indikator Tingkat Kematangan Tata Kelola Pemdi (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.TKM.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (aspek Tata Kelola dan Manajemen) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah masih dalam penyusunan dan Manajemen Layanan Digital Pemerintah dilaksanakan tingkat Instansi Pemerintah sesuai dengan kebutuhan pada indikator Tingkat Kematangan Manajemen Layanan Digital Pemerintah (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.TP.1": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahap penyusunan, sebagai referensi arah pembangunan/pengembangan aplikasi instansi pada indikator Tingkat Kematangan Aplikasi Pemdi (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.TP.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (aspek Teknologi Pemdi) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria substansi Rencana Aksi Nasional Pemdi pada perencanaan Instansi Pemerintah dan Arsitektur Teknologi Pemdi pada tingkat mikro dalam tahapan penyusunan, sebagai referensi pemanfaatan Infrastruktur Pemdi pada indikator Tingkat Kematangan Infrastruktur Pemdi (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.D.2": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (aspek Data) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam tahap penyiapan tata kelola data dan kelembagaan diinisiasi dengan pembentukan tim atau kelompok kerja, dan telah ditugaskan personal penyelenggara IG secara khusus pada indikator Tingkat Kematangan Penyelenggaraan Informasi Geospasial (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.D.3": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (aspek Data) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria dalam proses penyelenggaraan Statistik Sektoral dilakukan oleh seluruh unit kerja pada indikator Tingkat Kematangan Pembangunan Statistik (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.D.4": {
            "jenis": "Beririsan Substansi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai penerapan tata kelola dan teknis PDP masih bersifat ad-hoc (tanpa arah kebijakan organisasi implementasi PDP) pada indikator Tingkat Kematangan Pelindungan Data Pribadi (aspek Data) pada Pemerintah Digital (PEMDI) beririsan substansi dengan pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara pemenuhan kriteria penerapan tata kelola dan teknis PDP masih bersifat ad-hoc (tanpa arah kebijakan organisasi implementasi PDP) pada indikator Tingkat Kematangan Pelindungan Data Pribadi (PEMDI) dan pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI) agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KP.2": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyusunan tata kelola dan manajemen keamanan informasi pada indikator Tingkat Kematangan Keamanan Pemdi (PEMDI) guna memperkuat pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI)."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KP.3": {
            "jenis": "Mendukung",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai dalam tahap penyiapan penerapan teknologi kriptografi untuk keamanan data, sesuai dengan peraturan perundang-undangan pada indikator Tingkat Kematangan Penerapan Kriptografi untuk Keamanan Data (aspek Keamanan Pemdi) pada Pemerintah Digital (PEMDI) mendukung pengukuran kriteria penilaian mengenai sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program/sub-komponen \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan kriteria dalam tahap penyiapan penerapan teknologi kriptografi untuk keamanan data, sesuai dengan peraturan perundang-undangan pada indikator Tingkat Kematangan Penerapan Kriptografi untuk Keamanan Data (PEMDI) guna memperkuat pemenuhan kriteria sistem pengukuran kinerja unit sudah menggunakan teknologi informasi pada program \"Sistem Pemerintahan Berbasis Elektronik (SPBE)\" (ZI)."
      },
      "SS5-ZI.PT.3 -> SS1-PEMDI.KPLDP.2": {
            "jenis": "Saling Melengkapi",
            "status": "USULAN / Perlu validasi",
            "alasan": "Penilaian kriteria penilaian mengenai memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (aspek Kepuasan Pengguna Layanan Digital Pemerintah) pada Pemerintah Digital (PEMDI) saling melengkapi dengan pengukuran kriteria penilaian mengenai kebijakan tentang  keterbukaan informasi publik telah diterapkan pada program/sub-komponen \"Keterbukaan Informasi Publik\" (Pengungkit — Penataan Tatalaksana) pada Zona Integritas (ZI).",
            "rekomendasi": "Disarankan menyinkronkan pemenuhan kriteria memanfaatkan Survei Kepuasan Masyarakat (SKM) Online sesuai dengan Pedoman Menteri tentang pelaksanaan survei kepuasan masyarakat secara daring dalam mengukur tingkat Kepuasan Pengguna Layanan Digital Pemerintah pada indikator Tingkat Pengelolaan Kepuasan Pengguna Layanan Digital Pemerintah (PEMDI) dengan pemenuhan kriteria kebijakan tentang  keterbukaan informasi publik telah diterapkan pada program \"Keterbukaan Informasi Publik\" (ZI) agar kedua instrumen saling melengkapi secara terpadu."
      }
},
    sasaran3Justifikasi: {
      "REL-S3-1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi bebas mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi bebas mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP)."
      },
      "SS3-IIIP.B3.A.1_SS3-DIIIP.D2.1.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi bebas mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi bebas mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP)."
      },
      "SS3-DIIIP.D2.1.1_SS3-IIIP.B3.A.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan didukung oleh pertanyaan survei mengenai pegawai di instansi bebas mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pegawai di instansi bebas mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP)."
      },
      "SS3-IIIP.B3.A.2_SS3-DIIIP.D2.1.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP)."
      },
      "SS3-DIIIP.D2.1.1_SS3-IIIP.B3.A.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan didukung oleh pertanyaan survei mengenai frekuensi pegawai mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai mengidentifikasi berbagai masalah unit kerja atau instansi yang perlu diperbaiki pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi jarang mencari dan mempelajari praktik baik (best practice) dari tempat lain sebagai sumber inspirasi ide inovasi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Pencarian referensi eksternal (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai aktivitas mencari dan memanfaatkan referensi dari luar organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait penguatan perilaku pegawai dalam mencari dan mempelajari praktik baik (best practice) sebagai sumber inspirasi ide inovasi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator aktivitas mencari dan memanfaatkan referensi dari luar organisasi pada indikator desain Pencarian referensi eksternal (Desain IIIP)."
      },
      "SS3-IIIP.B3.A.3_SS3-DIIIP.D2.1.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi jarang mencari dan mempelajari praktik baik (best practice) dari tempat lain sebagai sumber inspirasi ide inovasi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Pencarian referensi eksternal (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai aktivitas mencari dan memanfaatkan referensi dari luar organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait penguatan perilaku pegawai dalam mencari dan mempelajari praktik baik (best practice) sebagai sumber inspirasi ide inovasi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator aktivitas mencari dan memanfaatkan referensi dari luar organisasi pada indikator desain Pencarian referensi eksternal (Desain IIIP)."
      },
      "SS3-DIIIP.D2.1.2_SS3-IIIP.B3.A.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Pencarian referensi eksternal (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur aktivitas mencari dan memanfaatkan referensi dari luar organisasi didukung oleh pertanyaan survei mengenai pegawai di instansi jarang mencari dan mempelajari praktik baik (best practice) dari tempat lain sebagai sumber inspirasi ide inovasi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator aktivitas mencari dan memanfaatkan referensi dari luar organisasi pada indikator desain Pencarian referensi eksternal (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait penguatan perilaku pegawai dalam mencari dan mempelajari praktik baik (best practice) sebagai sumber inspirasi ide inovasi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-4": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai menemukan ide inovasi setelah mempelajari praktik baik (best practice) dalam merancang inovasi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Pencarian referensi eksternal (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai aktivitas mencari dan memanfaatkan referensi dari luar organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai menemukan ide inovasi setelah mempelajari praktik baik (best practice) dalam merancang inovasi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator aktivitas mencari dan memanfaatkan referensi dari luar organisasi pada indikator desain Pencarian referensi eksternal (Desain IIIP)."
      },
      "SS3-IIIP.B3.A.4_SS3-DIIIP.D2.1.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai menemukan ide inovasi setelah mempelajari praktik baik (best practice) dalam merancang inovasi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Pencarian referensi eksternal (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai aktivitas mencari dan memanfaatkan referensi dari luar organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai menemukan ide inovasi setelah mempelajari praktik baik (best practice) dalam merancang inovasi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator aktivitas mencari dan memanfaatkan referensi dari luar organisasi pada indikator desain Pencarian referensi eksternal (Desain IIIP)."
      },
      "SS3-DIIIP.D2.1.2_SS3-IIIP.B3.A.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Pencarian referensi eksternal (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur aktivitas mencari dan memanfaatkan referensi dari luar organisasi didukung oleh pertanyaan survei mengenai frekuensi pegawai menemukan ide inovasi setelah mempelajari praktik baik (best practice) dalam merancang inovasi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator aktivitas mencari dan memanfaatkan referensi dari luar organisasi pada indikator desain Pencarian referensi eksternal (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai menemukan ide inovasi setelah mempelajari praktik baik (best practice) dalam merancang inovasi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-5": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai terlibat dalam pencarian ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai terlibat dalam pencarian ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP)."
      },
      "SS3-IIIP.B3.A.5_SS3-DIIIP.D2.1.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai terlibat dalam pencarian ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai terlibat dalam pencarian ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP)."
      },
      "SS3-DIIIP.D2.1.1_SS3-IIIP.B3.A.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Identifikasi peluang perbaikan (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan didukung oleh pertanyaan survei mengenai frekuensi pegawai terlibat dalam pencarian ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator frekuensi dan kualitas identifikasi masalah/peluang perbaikan dalam pekerjaan pada indikator desain Identifikasi peluang perbaikan (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai terlibat dalam pencarian ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIa. PERILAKU PENCARIAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-6": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.B.1_SS3-DIIIP.D2.2.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.2.1_SS3-IIIP.B3.B.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan didukung oleh pertanyaan survei mengenai pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pegawai di instansi merancang ide inovasi sesuai kebutuhan pengguna layanan atau masyarakat pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-7": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai melibatkan pengguna layanan atau masyarakat dalam proses perancangan ide inovasi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai melibatkan pengguna layanan atau masyarakat dalam proses perancangan ide inovasi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.B.2_SS3-DIIIP.D2.2.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai melibatkan pengguna layanan atau masyarakat dalam proses perancangan ide inovasi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai melibatkan pengguna layanan atau masyarakat dalam proses perancangan ide inovasi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.2.1_SS3-IIIP.B3.B.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan didukung oleh pertanyaan survei mengenai frekuensi pegawai melibatkan pengguna layanan atau masyarakat dalam proses perancangan ide inovasi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai melibatkan pengguna layanan atau masyarakat dalam proses perancangan ide inovasi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-8": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi merancang ide inovasi melalui kerja sama dengan rekan kerja atau pihak lain di luar instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Kolaborasi pengembangan ide (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi merancang ide inovasi melalui kerja sama dengan rekan kerja atau pihak lain di luar instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide pada indikator desain Kolaborasi pengembangan ide (Desain IIIP)."
      },
      "SS3-IIIP.B3.B.3_SS3-DIIIP.D2.2.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi merancang ide inovasi melalui kerja sama dengan rekan kerja atau pihak lain di luar instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Kolaborasi pengembangan ide (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi merancang ide inovasi melalui kerja sama dengan rekan kerja atau pihak lain di luar instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide pada indikator desain Kolaborasi pengembangan ide (Desain IIIP)."
      },
      "SS3-DIIIP.D2.2.2_SS3-IIIP.B3.B.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Kolaborasi pengembangan ide (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide didukung oleh pertanyaan survei mengenai pegawai di instansi merancang ide inovasi melalui kerja sama dengan rekan kerja atau pihak lain di luar instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide pada indikator desain Kolaborasi pengembangan ide (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pegawai di instansi merancang ide inovasi melalui kerja sama dengan rekan kerja atau pihak lain di luar instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-9": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai menghasilkan ide inovasi dari hasil kerja sama dengan rekan kerja atau pihak lain di luar instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Kolaborasi pengembangan ide (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai menghasilkan ide inovasi dari hasil kerja sama dengan rekan kerja atau pihak lain di luar instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide pada indikator desain Kolaborasi pengembangan ide (Desain IIIP)."
      },
      "SS3-IIIP.B3.B.4_SS3-DIIIP.D2.2.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai menghasilkan ide inovasi dari hasil kerja sama dengan rekan kerja atau pihak lain di luar instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Kolaborasi pengembangan ide (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai menghasilkan ide inovasi dari hasil kerja sama dengan rekan kerja atau pihak lain di luar instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide pada indikator desain Kolaborasi pengembangan ide (Desain IIIP)."
      },
      "SS3-DIIIP.D2.2.2_SS3-IIIP.B3.B.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Kolaborasi pengembangan ide (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide didukung oleh pertanyaan survei mengenai frekuensi pegawai menghasilkan ide inovasi dari hasil kerja sama dengan rekan kerja atau pihak lain di luar instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator keterlibatan dalam kolaborasi lintas unit/instansi dalam pengembangan ide pada indikator desain Kolaborasi pengembangan ide (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai menghasilkan ide inovasi dari hasil kerja sama dengan rekan kerja atau pihak lain di luar instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-10": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai terlibat dalam merancang ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai terlibat dalam merancang ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.B.5_SS3-DIIIP.D2.2.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai terlibat dalam merancang ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai terlibat dalam merancang ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.2.1_SS3-IIIP.B3.B.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Penciptaan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan didukung oleh pertanyaan survei mengenai frekuensi pegawai terlibat dalam merancang ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator jumlah dan kualitas ide baru yang diusulkan dalam pekerjaan pada indikator desain Penciptaan ide inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai terlibat dalam merancang ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIb. PERILAKU PENCIPTAAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-11": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi mengomunikasikan ide inovasi secara terbuka kepada rekan kerja tanpa khawatir idenya ditiru pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya menyampaikan ide melalui diskusi, presentasi, atau media lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi mengomunikasikan ide inovasi secara terbuka kepada rekan kerja tanpa khawatir idenya ditiru pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.C.1_SS3-DIIIP.D2.3.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi mengomunikasikan ide inovasi secara terbuka kepada rekan kerja tanpa khawatir idenya ditiru pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya menyampaikan ide melalui diskusi, presentasi, atau media lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi mengomunikasikan ide inovasi secara terbuka kepada rekan kerja tanpa khawatir idenya ditiru pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.3.1_SS3-IIIP.B3.C.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur upaya menyampaikan ide melalui diskusi, presentasi, atau media lain didukung oleh pertanyaan survei mengenai pegawai di instansi mengomunikasikan ide inovasi secara terbuka kepada rekan kerja tanpa khawatir idenya ditiru pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pegawai di instansi mengomunikasikan ide inovasi secara terbuka kepada rekan kerja tanpa khawatir idenya ditiru pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-12": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai mengomunikasikan ide inovasi kepada rekan kerja untuk mendapatkan dukungan pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya menyampaikan ide melalui diskusi, presentasi, atau media lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai mengomunikasikan ide inovasi kepada rekan kerja untuk mendapatkan dukungan pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.C.2_SS3-DIIIP.D2.3.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai mengomunikasikan ide inovasi kepada rekan kerja untuk mendapatkan dukungan pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya menyampaikan ide melalui diskusi, presentasi, atau media lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai mengomunikasikan ide inovasi kepada rekan kerja untuk mendapatkan dukungan pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.3.1_SS3-IIIP.B3.C.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur upaya menyampaikan ide melalui diskusi, presentasi, atau media lain didukung oleh pertanyaan survei mengenai frekuensi pegawai mengomunikasikan ide inovasi kepada rekan kerja untuk mendapatkan dukungan pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai mengomunikasikan ide inovasi kepada rekan kerja untuk mendapatkan dukungan pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-13": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi mudah mengomunikasikan rancangan ide inovasi kepada pimpinan untuk mendapatkan dukungan pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya menyampaikan ide melalui diskusi, presentasi, atau media lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi mudah mengomunikasikan rancangan ide inovasi kepada pimpinan untuk mendapatkan dukungan pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.C.3_SS3-DIIIP.D2.3.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi mudah mengomunikasikan rancangan ide inovasi kepada pimpinan untuk mendapatkan dukungan pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya menyampaikan ide melalui diskusi, presentasi, atau media lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi mudah mengomunikasikan rancangan ide inovasi kepada pimpinan untuk mendapatkan dukungan pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.3.1_SS3-IIIP.B3.C.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Komunikasi ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur upaya menyampaikan ide melalui diskusi, presentasi, atau media lain didukung oleh pertanyaan survei mengenai pegawai di instansi mudah mengomunikasikan rancangan ide inovasi kepada pimpinan untuk mendapatkan dukungan pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator upaya menyampaikan ide melalui diskusi, presentasi, atau media lain pada indikator desain Komunikasi ide inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pegawai di instansi mudah mengomunikasikan rancangan ide inovasi kepada pimpinan untuk mendapatkan dukungan pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-14": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai memperoleh dukungan dan persetujuan dari atasan terhadap ide inovasi yang telah dirancang pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Mobilisasi dukungan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai memperoleh dukungan dan persetujuan dari atasan terhadap ide inovasi yang telah dirancang pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain pada indikator desain Mobilisasi dukungan ide inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.C.4_SS3-DIIIP.D2.3.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai memperoleh dukungan dan persetujuan dari atasan terhadap ide inovasi yang telah dirancang pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Mobilisasi dukungan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai memperoleh dukungan dan persetujuan dari atasan terhadap ide inovasi yang telah dirancang pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain pada indikator desain Mobilisasi dukungan ide inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.3.2_SS3-IIIP.B3.C.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Mobilisasi dukungan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain didukung oleh pertanyaan survei mengenai frekuensi pegawai memperoleh dukungan dan persetujuan dari atasan terhadap ide inovasi yang telah dirancang pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain pada indikator desain Mobilisasi dukungan ide inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai memperoleh dukungan dan persetujuan dari atasan terhadap ide inovasi yang telah dirancang pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-15": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai terlibat dalam proses mencari dukungan atau promosi ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Mobilisasi dukungan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai terlibat dalam proses mencari dukungan atau promosi ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain pada indikator desain Mobilisasi dukungan ide inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.C.5_SS3-DIIIP.D2.3.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai terlibat dalam proses mencari dukungan atau promosi ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Mobilisasi dukungan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai terlibat dalam proses mencari dukungan atau promosi ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain pada indikator desain Mobilisasi dukungan ide inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.3.2_SS3-IIIP.B3.C.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Mobilisasi dukungan ide inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain didukung oleh pertanyaan survei mengenai frekuensi pegawai terlibat dalam proses mencari dukungan atau promosi ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat keberhasilan memperoleh dukungan dari rekan kerja, pimpinan, atau unit lain pada indikator desain Mobilisasi dukungan ide inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai terlibat dalam proses mencari dukungan atau promosi ide inovasi untuk perbaikan prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIIc. PERILAKU PROMOSI IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-16": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi diberikan kebebasan mencoba ide inovasi seperti cara kerja baru dalam menyelesaikan pekerjaan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Uji coba inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai keterlibatan dalam kegiatan uji coba/pilot proyek inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi diberikan kebebasan mencoba ide inovasi seperti cara kerja baru dalam menyelesaikan pekerjaan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan dalam kegiatan uji coba/pilot proyek inovasi pada indikator desain Uji coba inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.D.1_SS3-DIIIP.D2.4.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi diberikan kebebasan mencoba ide inovasi seperti cara kerja baru dalam menyelesaikan pekerjaan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Uji coba inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai keterlibatan dalam kegiatan uji coba/pilot proyek inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi diberikan kebebasan mencoba ide inovasi seperti cara kerja baru dalam menyelesaikan pekerjaan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan dalam kegiatan uji coba/pilot proyek inovasi pada indikator desain Uji coba inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.4.1_SS3-IIIP.B3.D.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Uji coba inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur keterlibatan dalam kegiatan uji coba/pilot proyek inovasi didukung oleh pertanyaan survei mengenai pegawai di instansi diberikan kebebasan mencoba ide inovasi seperti cara kerja baru dalam menyelesaikan pekerjaan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator keterlibatan dalam kegiatan uji coba/pilot proyek inovasi pada indikator desain Uji coba inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pegawai di instansi diberikan kebebasan mencoba ide inovasi seperti cara kerja baru dalam menyelesaikan pekerjaan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-17": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai melakukan atau terlibat dalam mencoba cara kerja baru dalam menyelesaikan tugas pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Uji coba inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai keterlibatan dalam kegiatan uji coba/pilot proyek inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai melakukan atau terlibat dalam mencoba cara kerja baru dalam menyelesaikan tugas pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan dalam kegiatan uji coba/pilot proyek inovasi pada indikator desain Uji coba inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.D.2_SS3-DIIIP.D2.4.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai melakukan atau terlibat dalam mencoba cara kerja baru dalam menyelesaikan tugas pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Uji coba inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai keterlibatan dalam kegiatan uji coba/pilot proyek inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai melakukan atau terlibat dalam mencoba cara kerja baru dalam menyelesaikan tugas pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan dalam kegiatan uji coba/pilot proyek inovasi pada indikator desain Uji coba inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.4.1_SS3-IIIP.B3.D.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Uji coba inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur keterlibatan dalam kegiatan uji coba/pilot proyek inovasi didukung oleh pertanyaan survei mengenai frekuensi pegawai melakukan atau terlibat dalam mencoba cara kerja baru dalam menyelesaikan tugas pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator keterlibatan dalam kegiatan uji coba/pilot proyek inovasi pada indikator desain Uji coba inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai melakukan atau terlibat dalam mencoba cara kerja baru dalam menyelesaikan tugas pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-18": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pemilihan ide inovasi dilakukan melalui prosedur dan kriteria penilaian yang jelas, objektif, dan transparan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pemilihan ide inovasi dilakukan melalui prosedur dan kriteria penilaian yang jelas, objektif, dan transparan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP)."
      },
      "SS3-IIIP.B3.D.3_SS3-DIIIP.D2.4.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pemilihan ide inovasi dilakukan melalui prosedur dan kriteria penilaian yang jelas, objektif, dan transparan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pemilihan ide inovasi dilakukan melalui prosedur dan kriteria penilaian yang jelas, objektif, dan transparan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP)."
      },
      "SS3-DIIIP.D2.4.2_SS3-IIIP.B3.D.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan didukung oleh pertanyaan survei mengenai pemilihan ide inovasi dilakukan melalui prosedur dan kriteria penilaian yang jelas, objektif, dan transparan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pemilihan ide inovasi dilakukan melalui prosedur dan kriteria penilaian yang jelas, objektif, dan transparan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-19": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi ide inovasi pegawai terpilih untuk diterapkan di unit kerja atau instansi pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi ide inovasi pegawai terpilih untuk diterapkan di unit kerja atau instansi pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP)."
      },
      "SS3-IIIP.B3.D.4_SS3-DIIIP.D2.4.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi ide inovasi pegawai terpilih untuk diterapkan di unit kerja atau instansi pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi ide inovasi pegawai terpilih untuk diterapkan di unit kerja atau instansi pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP)."
      },
      "SS3-DIIIP.D2.4.2_SS3-IIIP.B3.D.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan didukung oleh pertanyaan survei mengenai frekuensi ide inovasi pegawai terpilih untuk diterapkan di unit kerja atau instansi pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi ide inovasi pegawai terpilih untuk diterapkan di unit kerja atau instansi pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-20": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi diberikan kemudahan untuk memperbaiki dan mengembangkan inovasi prosedur kerja yang telah diterapkan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penyempurnaan dan pengembangan Inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi diberikan kemudahan untuk memperbaiki dan mengembangkan inovasi prosedur kerja yang telah diterapkan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik pada indikator desain Penyempurnaan dan pengembangan Inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.D.5_SS3-DIIIP.D2.4.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pegawai di instansi diberikan kemudahan untuk memperbaiki dan mengembangkan inovasi prosedur kerja yang telah diterapkan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penyempurnaan dan pengembangan Inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pegawai di instansi diberikan kemudahan untuk memperbaiki dan mengembangkan inovasi prosedur kerja yang telah diterapkan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik pada indikator desain Penyempurnaan dan pengembangan Inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.4.3_SS3-IIIP.B3.D.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Penyempurnaan dan pengembangan Inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik didukung oleh pertanyaan survei mengenai pegawai di instansi diberikan kemudahan untuk memperbaiki dan mengembangkan inovasi prosedur kerja yang telah diterapkan pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik pada indikator desain Penyempurnaan dan pengembangan Inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pegawai di instansi diberikan kemudahan untuk memperbaiki dan mengembangkan inovasi prosedur kerja yang telah diterapkan pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-21": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai melakukan perbaikan dan pembaruan cara kerja dalam menyelesaikan tugas sehari-hari pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penyempurnaan dan pengembangan Inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai melakukan perbaikan dan pembaruan cara kerja dalam menyelesaikan tugas sehari-hari pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik pada indikator desain Penyempurnaan dan pengembangan Inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B3.D.6_SS3-DIIIP.D2.4.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai melakukan perbaikan dan pembaruan cara kerja dalam menyelesaikan tugas sehari-hari pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penyempurnaan dan pengembangan Inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai melakukan perbaikan dan pembaruan cara kerja dalam menyelesaikan tugas sehari-hari pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik pada indikator desain Penyempurnaan dan pengembangan Inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D2.4.3_SS3-IIIP.B3.D.6": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Penyempurnaan dan pengembangan Inovasi (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik didukung oleh pertanyaan survei mengenai frekuensi pegawai melakukan perbaikan dan pembaruan cara kerja dalam menyelesaikan tugas sehari-hari pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator upaya melakukan perbaikan dan pengembangan berdasarkan hasil evaluasi atau umpan balik pada indikator desain Penyempurnaan dan pengembangan Inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai melakukan perbaikan dan pembaruan cara kerja dalam menyelesaikan tugas sehari-hari pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-22": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai terlibat dalam penerapan inovasi seperti prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai terlibat dalam penerapan inovasi seperti prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP)."
      },
      "SS3-IIIP.B3.D.7_SS3-DIIIP.D2.4.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai terlibat dalam penerapan inovasi seperti prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP mendukung pengukuran indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang menilai tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai terlibat dalam penerapan inovasi seperti prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP)."
      },
      "SS3-DIIIP.D2.4.2_SS3-IIIP.B3.D.7": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Penerapan inovasi dalam system kerja (Domain 2: Perilaku Kerja Inovatif (Driving Mechanism)) pada Desain IIIP yang mengukur tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan didukung oleh pertanyaan survei mengenai frekuensi pegawai terlibat dalam penerapan inovasi seperti prosedur kerja atau pelayanan di unit kerja atau instansi pada indikator survei BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (BLOK III. PERILAKU KERJA INOVATIF PEGAWAI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat penerapan ide baru dalam proses kerja, layanan, atau kebijakan pada indikator desain Penerapan inovasi dalam system kerja (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai terlibat dalam penerapan inovasi seperti prosedur kerja atau pelayanan di unit kerja atau instansi pada BLOK IIId. PERILAKU PENERAPAN IDE INOVASI (Survei IIIP)."
      },
      "REL-S3-23": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai inovasi di instansi menjadi prioritas dan komitmen pimpinan unit kerja atau instansi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Integrasi inovasi dalam arah strategis (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait inovasi di instansi menjadi prioritas dan komitmen pimpinan unit kerja atau instansi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja pada indikator desain Integrasi inovasi dalam arah strategis (Desain IIIP)."
      },
      "SS3-IIIP.B4.A.1_SS3-DIIIP.D1.1.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai inovasi di instansi menjadi prioritas dan komitmen pimpinan unit kerja atau instansi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Integrasi inovasi dalam arah strategis (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait inovasi di instansi menjadi prioritas dan komitmen pimpinan unit kerja atau instansi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja pada indikator desain Integrasi inovasi dalam arah strategis (Desain IIIP)."
      },
      "SS3-DIIIP.D1.1.1_SS3-IIIP.B4.A.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Integrasi inovasi dalam arah strategis (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja didukung oleh pertanyaan survei mengenai inovasi di instansi menjadi prioritas dan komitmen pimpinan unit kerja atau instansi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja pada indikator desain Integrasi inovasi dalam arah strategis (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait inovasi di instansi menjadi prioritas dan komitmen pimpinan unit kerja atau instansi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-24": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pimpinan di unit kerja atau instansi mengomunikasikan pentingnya inovasi kepada pegawai pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Integrasi inovasi dalam arah strategis (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pimpinan di unit kerja atau instansi mengomunikasikan pentingnya inovasi kepada pegawai pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja pada indikator desain Integrasi inovasi dalam arah strategis (Desain IIIP)."
      },
      "SS3-IIIP.B4.A.2_SS3-DIIIP.D1.1.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pimpinan di unit kerja atau instansi mengomunikasikan pentingnya inovasi kepada pegawai pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Integrasi inovasi dalam arah strategis (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pimpinan di unit kerja atau instansi mengomunikasikan pentingnya inovasi kepada pegawai pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja pada indikator desain Integrasi inovasi dalam arah strategis (Desain IIIP)."
      },
      "SS3-DIIIP.D1.1.1_SS3-IIIP.B4.A.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Integrasi inovasi dalam arah strategis (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja didukung oleh pertanyaan survei mengenai frekuensi pimpinan di unit kerja atau instansi mengomunikasikan pentingnya inovasi kepada pegawai pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat penetapan inovasi dalam dokumen perencanaan dan kinerja pada indikator desain Integrasi inovasi dalam arah strategis (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pimpinan di unit kerja atau instansi mengomunikasikan pentingnya inovasi kepada pegawai pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-25": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pimpinan di unit kerja atau instansi telah menyediakan forum dimana pegawai diberikan kebebasan mengusulkan ide inovasi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai ruang, waktu, dan dukungan yang diberikan pimpinan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pimpinan di unit kerja atau instansi telah menyediakan forum dimana pegawai diberikan kebebasan mengusulkan ide inovasi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator ruang, waktu, dan dukungan yang diberikan pimpinan pada indikator desain Dukungan pimpinan terhadap inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.A.3_SS3-DIIIP.D1.1.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pimpinan di unit kerja atau instansi telah menyediakan forum dimana pegawai diberikan kebebasan mengusulkan ide inovasi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai ruang, waktu, dan dukungan yang diberikan pimpinan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pimpinan di unit kerja atau instansi telah menyediakan forum dimana pegawai diberikan kebebasan mengusulkan ide inovasi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator ruang, waktu, dan dukungan yang diberikan pimpinan pada indikator desain Dukungan pimpinan terhadap inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.1.2_SS3-IIIP.B4.A.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Dukungan pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur ruang, waktu, dan dukungan yang diberikan pimpinan didukung oleh pertanyaan survei mengenai pimpinan di unit kerja atau instansi telah menyediakan forum dimana pegawai diberikan kebebasan mengusulkan ide inovasi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator ruang, waktu, dan dukungan yang diberikan pimpinan pada indikator desain Dukungan pimpinan terhadap inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pimpinan di unit kerja atau instansi telah menyediakan forum dimana pegawai diberikan kebebasan mengusulkan ide inovasi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-26": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pimpinan di unit kerja atau instansi memberikan kesempatan kepada pegawai untuk mengusulkan ide inovasi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai ruang, waktu, dan dukungan yang diberikan pimpinan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pimpinan di unit kerja atau instansi memberikan kesempatan kepada pegawai untuk mengusulkan ide inovasi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator ruang, waktu, dan dukungan yang diberikan pimpinan pada indikator desain Dukungan pimpinan terhadap inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.A.4_SS3-DIIIP.D1.1.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pimpinan di unit kerja atau instansi memberikan kesempatan kepada pegawai untuk mengusulkan ide inovasi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai ruang, waktu, dan dukungan yang diberikan pimpinan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pimpinan di unit kerja atau instansi memberikan kesempatan kepada pegawai untuk mengusulkan ide inovasi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator ruang, waktu, dan dukungan yang diberikan pimpinan pada indikator desain Dukungan pimpinan terhadap inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.1.2_SS3-IIIP.B4.A.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Dukungan pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur ruang, waktu, dan dukungan yang diberikan pimpinan didukung oleh pertanyaan survei mengenai frekuensi pimpinan di unit kerja atau instansi memberikan kesempatan kepada pegawai untuk mengusulkan ide inovasi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator ruang, waktu, dan dukungan yang diberikan pimpinan pada indikator desain Dukungan pimpinan terhadap inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pimpinan di unit kerja atau instansi memberikan kesempatan kepada pegawai untuk mengusulkan ide inovasi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-27": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pimpinan di unit kerja atau instansi antusias dalam memperjuangkan usulan inovasi pegawai pada forum pimpinan pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Advokasi pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dukungan memperoleh legitimasi/persetujuan di organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pimpinan di unit kerja atau instansi antusias dalam memperjuangkan usulan inovasi pegawai pada forum pimpinan pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator dukungan memperoleh legitimasi/persetujuan di organisasi pada indikator desain Advokasi pimpinan terhadap inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.A.5_SS3-DIIIP.D1.1.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pimpinan di unit kerja atau instansi antusias dalam memperjuangkan usulan inovasi pegawai pada forum pimpinan pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Advokasi pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dukungan memperoleh legitimasi/persetujuan di organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pimpinan di unit kerja atau instansi antusias dalam memperjuangkan usulan inovasi pegawai pada forum pimpinan pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator dukungan memperoleh legitimasi/persetujuan di organisasi pada indikator desain Advokasi pimpinan terhadap inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.1.3_SS3-IIIP.B4.A.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Advokasi pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur dukungan memperoleh legitimasi/persetujuan di organisasi didukung oleh pertanyaan survei mengenai pimpinan di unit kerja atau instansi antusias dalam memperjuangkan usulan inovasi pegawai pada forum pimpinan pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator dukungan memperoleh legitimasi/persetujuan di organisasi pada indikator desain Advokasi pimpinan terhadap inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pimpinan di unit kerja atau instansi antusias dalam memperjuangkan usulan inovasi pegawai pada forum pimpinan pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-28": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi inovasi yang diusulkan pegawai mendapat persetujuan dari pimpinan unit kerja atau instansi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Advokasi pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dukungan memperoleh legitimasi/persetujuan di organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi inovasi yang diusulkan pegawai mendapat persetujuan dari pimpinan unit kerja atau instansi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator dukungan memperoleh legitimasi/persetujuan di organisasi pada indikator desain Advokasi pimpinan terhadap inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.A.6_SS3-DIIIP.D1.1.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi inovasi yang diusulkan pegawai mendapat persetujuan dari pimpinan unit kerja atau instansi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Advokasi pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dukungan memperoleh legitimasi/persetujuan di organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi inovasi yang diusulkan pegawai mendapat persetujuan dari pimpinan unit kerja atau instansi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator dukungan memperoleh legitimasi/persetujuan di organisasi pada indikator desain Advokasi pimpinan terhadap inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.1.3_SS3-IIIP.B4.A.6": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Advokasi pimpinan terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur dukungan memperoleh legitimasi/persetujuan di organisasi didukung oleh pertanyaan survei mengenai frekuensi inovasi yang diusulkan pegawai mendapat persetujuan dari pimpinan unit kerja atau instansi pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator dukungan memperoleh legitimasi/persetujuan di organisasi pada indikator desain Advokasi pimpinan terhadap inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi inovasi yang diusulkan pegawai mendapat persetujuan dari pimpinan unit kerja atau instansi pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-29": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pimpinan di instansi telah mengalokasikan anggaran dan sumberdaya untuk program inovasi dalam jumlah yang memadai pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan sumber daya oleh pimpinan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pimpinan di instansi telah mengalokasikan anggaran dan sumberdaya untuk program inovasi dalam jumlah yang memadai pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya pada indikator desain Dukungan sumber daya oleh pimpinan (Desain IIIP)."
      },
      "SS3-IIIP.B4.A.7_SS3-DIIIP.D1.1.4": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai pimpinan di instansi telah mengalokasikan anggaran dan sumberdaya untuk program inovasi dalam jumlah yang memadai pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan sumber daya oleh pimpinan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait pimpinan di instansi telah mengalokasikan anggaran dan sumberdaya untuk program inovasi dalam jumlah yang memadai pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya pada indikator desain Dukungan sumber daya oleh pimpinan (Desain IIIP)."
      },
      "SS3-DIIIP.D1.1.4_SS3-IIIP.B4.A.7": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Dukungan sumber daya oleh pimpinan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya didukung oleh pertanyaan survei mengenai pimpinan di instansi telah mengalokasikan anggaran dan sumberdaya untuk program inovasi dalam jumlah yang memadai pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya pada indikator desain Dukungan sumber daya oleh pimpinan (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait pimpinan di instansi telah mengalokasikan anggaran dan sumberdaya untuk program inovasi dalam jumlah yang memadai pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-30": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai mendapat anggaran dan sumberdaya untuk penerapan inovasi yang sesuai rencana pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan sumber daya oleh pimpinan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai mendapat anggaran dan sumberdaya untuk penerapan inovasi yang sesuai rencana pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya pada indikator desain Dukungan sumber daya oleh pimpinan (Desain IIIP)."
      },
      "SS3-IIIP.B4.A.8_SS3-DIIIP.D1.1.4": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai mendapat anggaran dan sumberdaya untuk penerapan inovasi yang sesuai rencana pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan sumber daya oleh pimpinan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi pegawai mendapat anggaran dan sumberdaya untuk penerapan inovasi yang sesuai rencana pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya pada indikator desain Dukungan sumber daya oleh pimpinan (Desain IIIP)."
      },
      "SS3-DIIIP.D1.1.4_SS3-IIIP.B4.A.8": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Dukungan sumber daya oleh pimpinan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya didukung oleh pertanyaan survei mengenai frekuensi pegawai mendapat anggaran dan sumberdaya untuk penerapan inovasi yang sesuai rencana pada indikator survei BLOK IVa. KEPEMIMPINAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator ketersediaan anggaran, waktu, fasilitas, dan dukungan lainnya pada indikator desain Dukungan sumber daya oleh pimpinan (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi pegawai mendapat anggaran dan sumberdaya untuk penerapan inovasi yang sesuai rencana pada BLOK IVa. KEPEMIMPINAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-31": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Fungsi pengelola inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai keberadaan dan keaktifan tim/fungsi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator keberadaan dan keaktifan tim/fungsi pada indikator desain Fungsi pengelola inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.1_SS3-DIIIP.D1.2.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Fungsi pengelola inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai keberadaan dan keaktifan tim/fungsi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator keberadaan dan keaktifan tim/fungsi pada indikator desain Fungsi pengelola inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.1_SS3-IIIP.B4.B.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Fungsi pengelola inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur keberadaan dan keaktifan tim/fungsi didukung oleh pertanyaan survei mengenai keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator keberadaan dan keaktifan tim/fungsi pada indikator desain Fungsi pengelola inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait keberadaan bagian/fungsi yang secara khusus mengelola dan bertanggung jawab terhadap program inovasi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-32": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai tingkat keoptimalan pelaksana fungsi program inovasi di unit kerja atau instansi telah menjalankan fungsinya pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Fungsi pengelola inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai keberadaan dan keaktifan tim/fungsi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait tingkat keoptimalan pelaksana fungsi program inovasi di unit kerja atau instansi telah menjalankan fungsinya pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator keberadaan dan keaktifan tim/fungsi pada indikator desain Fungsi pengelola inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.2_SS3-DIIIP.D1.2.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai tingkat keoptimalan pelaksana fungsi program inovasi di unit kerja atau instansi telah menjalankan fungsinya pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Fungsi pengelola inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai keberadaan dan keaktifan tim/fungsi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait tingkat keoptimalan pelaksana fungsi program inovasi di unit kerja atau instansi telah menjalankan fungsinya pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator keberadaan dan keaktifan tim/fungsi pada indikator desain Fungsi pengelola inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.1_SS3-IIIP.B4.B.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Fungsi pengelola inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur keberadaan dan keaktifan tim/fungsi didukung oleh pertanyaan survei mengenai tingkat keoptimalan pelaksana fungsi program inovasi di unit kerja atau instansi telah menjalankan fungsinya pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator keberadaan dan keaktifan tim/fungsi pada indikator desain Fungsi pengelola inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait tingkat keoptimalan pelaksana fungsi program inovasi di unit kerja atau instansi telah menjalankan fungsinya pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-33": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi mudah menyesuaikan prosedur kerja atau layanan sesuai tuntutan kebutuhan pegawai atau pengguna layanan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemampuan mengubah prosedur/mekanisme kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi mudah menyesuaikan prosedur kerja atau layanan sesuai tuntutan kebutuhan pegawai atau pengguna layanan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.3_SS3-DIIIP.D1.2.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi mudah menyesuaikan prosedur kerja atau layanan sesuai tuntutan kebutuhan pegawai atau pengguna layanan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemampuan mengubah prosedur/mekanisme kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi mudah menyesuaikan prosedur kerja atau layanan sesuai tuntutan kebutuhan pegawai atau pengguna layanan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.2_SS3-IIIP.B4.B.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur kemampuan mengubah prosedur/mekanisme kerja didukung oleh pertanyaan survei mengenai instansi mudah menyesuaikan prosedur kerja atau layanan sesuai tuntutan kebutuhan pegawai atau pengguna layanan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi mudah menyesuaikan prosedur kerja atau layanan sesuai tuntutan kebutuhan pegawai atau pengguna layanan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-34": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi mudah menyesuaikan prosedur kerja atau pelayanan ketika terjadi perubahan penerapan teknologi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemampuan mengubah prosedur/mekanisme kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi mudah menyesuaikan prosedur kerja atau pelayanan ketika terjadi perubahan penerapan teknologi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.4_SS3-DIIIP.D1.2.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi mudah menyesuaikan prosedur kerja atau pelayanan ketika terjadi perubahan penerapan teknologi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemampuan mengubah prosedur/mekanisme kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi mudah menyesuaikan prosedur kerja atau pelayanan ketika terjadi perubahan penerapan teknologi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.2_SS3-IIIP.B4.B.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur kemampuan mengubah prosedur/mekanisme kerja didukung oleh pertanyaan survei mengenai instansi mudah menyesuaikan prosedur kerja atau pelayanan ketika terjadi perubahan penerapan teknologi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi mudah menyesuaikan prosedur kerja atau pelayanan ketika terjadi perubahan penerapan teknologi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-35": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi mudah menerima usulan atau masukan perubahan prosedur kerja dari pegawai dan pengguna layanan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap keterbukaan dan responsivitas organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi mudah menerima usulan atau masukan perubahan prosedur kerja dari pegawai dan pengguna layanan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.5_SS3-DIIIP.D1.2.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi mudah menerima usulan atau masukan perubahan prosedur kerja dari pegawai dan pengguna layanan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap keterbukaan dan responsivitas organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi mudah menerima usulan atau masukan perubahan prosedur kerja dari pegawai dan pengguna layanan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.3_SS3-IIIP.B4.B.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi terhadap keterbukaan dan responsivitas organisasi didukung oleh pertanyaan survei mengenai instansi mudah menerima usulan atau masukan perubahan prosedur kerja dari pegawai dan pengguna layanan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi mudah menerima usulan atau masukan perubahan prosedur kerja dari pegawai dan pengguna layanan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-36": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi cepat menyesuaikan prosedur kerja atau pelayanan ketika ada keluhan pengguna pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemampuan mengubah prosedur/mekanisme kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi cepat menyesuaikan prosedur kerja atau pelayanan ketika ada keluhan pengguna pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.6_SS3-DIIIP.D1.2.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi cepat menyesuaikan prosedur kerja atau pelayanan ketika ada keluhan pengguna pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemampuan mengubah prosedur/mekanisme kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi cepat menyesuaikan prosedur kerja atau pelayanan ketika ada keluhan pengguna pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.2_SS3-IIIP.B4.B.6": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur kemampuan mengubah prosedur/mekanisme kerja didukung oleh pertanyaan survei mengenai instansi cepat menyesuaikan prosedur kerja atau pelayanan ketika ada keluhan pengguna pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi cepat menyesuaikan prosedur kerja atau pelayanan ketika ada keluhan pengguna pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-37": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi melakukan penyesuaian prosedur kerja atau pelayanan karena tuntutan kebutuhan pengguna atau perubahan teknologi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemampuan mengubah prosedur/mekanisme kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi melakukan penyesuaian prosedur kerja atau pelayanan karena tuntutan kebutuhan pengguna atau perubahan teknologi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.7_SS3-DIIIP.D1.2.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi melakukan penyesuaian prosedur kerja atau pelayanan karena tuntutan kebutuhan pengguna atau perubahan teknologi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemampuan mengubah prosedur/mekanisme kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi melakukan penyesuaian prosedur kerja atau pelayanan karena tuntutan kebutuhan pengguna atau perubahan teknologi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.2_SS3-IIIP.B4.B.7": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Organisasi yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur kemampuan mengubah prosedur/mekanisme kerja didukung oleh pertanyaan survei mengenai frekuensi instansi melakukan penyesuaian prosedur kerja atau pelayanan karena tuntutan kebutuhan pengguna atau perubahan teknologi pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator kemampuan mengubah prosedur/mekanisme kerja pada indikator desain Organisasi yang fleksibel dan adaptif (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi instansi melakukan penyesuaian prosedur kerja atau pelayanan karena tuntutan kebutuhan pengguna atau perubahan teknologi pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-38": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah melibatkan pengguna atau masyarakat dalam merancang dan menerapkan ide inovasi pelayanan masyarakat pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap keterbukaan dan responsivitas organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah melibatkan pengguna atau masyarakat dalam merancang dan menerapkan ide inovasi pelayanan masyarakat pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.8_SS3-DIIIP.D1.2.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah melibatkan pengguna atau masyarakat dalam merancang dan menerapkan ide inovasi pelayanan masyarakat pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap keterbukaan dan responsivitas organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah melibatkan pengguna atau masyarakat dalam merancang dan menerapkan ide inovasi pelayanan masyarakat pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.3_SS3-IIIP.B4.B.8": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi terhadap keterbukaan dan responsivitas organisasi didukung oleh pertanyaan survei mengenai instansi telah melibatkan pengguna atau masyarakat dalam merancang dan menerapkan ide inovasi pelayanan masyarakat pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi telah melibatkan pengguna atau masyarakat dalam merancang dan menerapkan ide inovasi pelayanan masyarakat pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-39": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi melibatkan pengguna atau masyarakat untuk memperoleh masukan sebelum inovasi diluncurkan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap keterbukaan dan responsivitas organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi melibatkan pengguna atau masyarakat untuk memperoleh masukan sebelum inovasi diluncurkan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP)."
      },
      "SS3-IIIP.B4.B.9_SS3-DIIIP.D1.2.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi melibatkan pengguna atau masyarakat untuk memperoleh masukan sebelum inovasi diluncurkan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap keterbukaan dan responsivitas organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi melibatkan pengguna atau masyarakat untuk memperoleh masukan sebelum inovasi diluncurkan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP)."
      },
      "SS3-DIIIP.D1.2.3_SS3-IIIP.B4.B.9": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi terhadap keterbukaan dan responsivitas organisasi didukung oleh pertanyaan survei mengenai frekuensi instansi melibatkan pengguna atau masyarakat untuk memperoleh masukan sebelum inovasi diluncurkan pada indikator survei BLOK IVb. KEORGANISASIAN INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi terhadap keterbukaan dan responsivitas organisasi pada indikator desain Organisasi yang terbuka dan responsive terhadap perubahan (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi instansi melibatkan pengguna atau masyarakat untuk memperoleh masukan sebelum inovasi diluncurkan pada BLOK IVb. KEORGANISASIAN INOVATIF (Survei IIIP)."
      },
      "REL-S3-40": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah menyediakan prosedur yang jelas bagi pegawai untuk mengusulkan ide inovasi secara terbuka tanpa kendala birokrasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Keterbukaan terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi pegawai terhadap keterbukaan organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah menyediakan prosedur yang jelas bagi pegawai untuk mengusulkan ide inovasi secara terbuka tanpa kendala birokrasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai terhadap keterbukaan organisasi pada indikator desain Keterbukaan terhadap ide (Desain IIIP)."
      },
      "SS3-IIIP.B4.C.1_SS3-DIIIP.D1.3.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah menyediakan prosedur yang jelas bagi pegawai untuk mengusulkan ide inovasi secara terbuka tanpa kendala birokrasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Keterbukaan terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi pegawai terhadap keterbukaan organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah menyediakan prosedur yang jelas bagi pegawai untuk mengusulkan ide inovasi secara terbuka tanpa kendala birokrasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai terhadap keterbukaan organisasi pada indikator desain Keterbukaan terhadap ide (Desain IIIP)."
      },
      "SS3-DIIIP.D1.3.1_SS3-IIIP.B4.C.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Keterbukaan terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi pegawai terhadap keterbukaan organisasi didukung oleh pertanyaan survei mengenai instansi telah menyediakan prosedur yang jelas bagi pegawai untuk mengusulkan ide inovasi secara terbuka tanpa kendala birokrasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi pegawai terhadap keterbukaan organisasi pada indikator desain Keterbukaan terhadap ide (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi telah menyediakan prosedur yang jelas bagi pegawai untuk mengusulkan ide inovasi secara terbuka tanpa kendala birokrasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP)."
      },
      "REL-S3-41": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai merasa bahwa di instansi kurang terbuka terhadap usulan ide inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Keterbukaan terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi pegawai terhadap keterbukaan organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait evaluasi dan peningkatan keterbukaan instansi terhadap usulan ide inovasi pegawai pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai terhadap keterbukaan organisasi pada indikator desain Keterbukaan terhadap ide (Desain IIIP)."
      },
      "SS3-IIIP.B4.C.2_SS3-DIIIP.D1.3.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai merasa bahwa di instansi kurang terbuka terhadap usulan ide inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Keterbukaan terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi pegawai terhadap keterbukaan organisasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait evaluasi dan peningkatan keterbukaan instansi terhadap usulan ide inovasi pegawai pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai terhadap keterbukaan organisasi pada indikator desain Keterbukaan terhadap ide (Desain IIIP)."
      },
      "SS3-DIIIP.D1.3.1_SS3-IIIP.B4.C.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Keterbukaan terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi pegawai terhadap keterbukaan organisasi didukung oleh pertanyaan survei mengenai frekuensi pegawai merasa bahwa di instansi kurang terbuka terhadap usulan ide inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi pegawai terhadap keterbukaan organisasi pada indikator desain Keterbukaan terhadap ide (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait evaluasi dan peningkatan keterbukaan instansi terhadap usulan ide inovasi pegawai pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP)."
      },
      "REL-S3-42": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi cepat memberikan respon positif terhadap ide inovasi yang diusulkan pegawai atau pengguna layanan pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Respons terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi adanya respons/umpan balik terhadap ide.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi cepat memberikan respon positif terhadap ide inovasi yang diusulkan pegawai atau pengguna layanan pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi adanya respons/umpan balik terhadap ide pada indikator desain Respons terhadap ide (Desain IIIP)."
      },
      "SS3-IIIP.B4.C.3_SS3-DIIIP.D1.3.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi cepat memberikan respon positif terhadap ide inovasi yang diusulkan pegawai atau pengguna layanan pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Respons terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi adanya respons/umpan balik terhadap ide.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi cepat memberikan respon positif terhadap ide inovasi yang diusulkan pegawai atau pengguna layanan pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi adanya respons/umpan balik terhadap ide pada indikator desain Respons terhadap ide (Desain IIIP)."
      },
      "SS3-DIIIP.D1.3.2_SS3-IIIP.B4.C.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Respons terhadap ide (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi adanya respons/umpan balik terhadap ide didukung oleh pertanyaan survei mengenai instansi cepat memberikan respon positif terhadap ide inovasi yang diusulkan pegawai atau pengguna layanan pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi adanya respons/umpan balik terhadap ide pada indikator desain Respons terhadap ide (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi cepat memberikan respon positif terhadap ide inovasi yang diusulkan pegawai atau pengguna layanan pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP)."
      },
      "REL-S3-43": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memberikan rasa aman kepada pegawai yang menerapkan ide inovasi, meskipun ada risiko gagal pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Keamanan psikologis dalam berinovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi keamanan dalam mengambil risiko interpersonal.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memberikan rasa aman kepada pegawai yang menerapkan ide inovasi, meskipun ada risiko gagal pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi keamanan dalam mengambil risiko interpersonal pada indikator desain Keamanan psikologis dalam berinovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.C.4_SS3-DIIIP.D1.3.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memberikan rasa aman kepada pegawai yang menerapkan ide inovasi, meskipun ada risiko gagal pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Keamanan psikologis dalam berinovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi keamanan dalam mengambil risiko interpersonal.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memberikan rasa aman kepada pegawai yang menerapkan ide inovasi, meskipun ada risiko gagal pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi keamanan dalam mengambil risiko interpersonal pada indikator desain Keamanan psikologis dalam berinovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.3.3_SS3-IIIP.B4.C.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Keamanan psikologis dalam berinovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi keamanan dalam mengambil risiko interpersonal didukung oleh pertanyaan survei mengenai instansi memberikan rasa aman kepada pegawai yang menerapkan ide inovasi, meskipun ada risiko gagal pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi keamanan dalam mengambil risiko interpersonal pada indikator desain Keamanan psikologis dalam berinovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi memberikan rasa aman kepada pegawai yang menerapkan ide inovasi, meskipun ada risiko gagal pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP)."
      },
      "REL-S3-44": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi menganggap hasil inovasi yang kurang optimal sebagai proses pembelajaran untuk berkembang, bukan semata-mata kelalaian kerja pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Toleransi terhadap kegagalan inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap penerimaan kegagalan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi menganggap hasil inovasi yang kurang optimal sebagai proses pembelajaran untuk berkembang, bukan semata-mata kelalaian kerja pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap penerimaan kegagalan inovasi pada indikator desain Toleransi terhadap kegagalan inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.C.5_SS3-DIIIP.D1.3.4": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi menganggap hasil inovasi yang kurang optimal sebagai proses pembelajaran untuk berkembang, bukan semata-mata kelalaian kerja pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Toleransi terhadap kegagalan inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap penerimaan kegagalan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi menganggap hasil inovasi yang kurang optimal sebagai proses pembelajaran untuk berkembang, bukan semata-mata kelalaian kerja pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap penerimaan kegagalan inovasi pada indikator desain Toleransi terhadap kegagalan inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.3.4_SS3-IIIP.B4.C.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Toleransi terhadap kegagalan inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi terhadap penerimaan kegagalan inovasi didukung oleh pertanyaan survei mengenai instansi menganggap hasil inovasi yang kurang optimal sebagai proses pembelajaran untuk berkembang, bukan semata-mata kelalaian kerja pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi terhadap penerimaan kegagalan inovasi pada indikator desain Toleransi terhadap kegagalan inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi menganggap hasil inovasi yang kurang optimal sebagai proses pembelajaran untuk berkembang, bukan semata-mata kelalaian kerja pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP)."
      },
      "REL-S3-45": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memberikan kesempatan kembali kepada pegawai untuk merancang inovasi meskipun hasil inovasi sebelumnya kurang optimal pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Toleransi terhadap kegagalan inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap penerimaan kegagalan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memberikan kesempatan kembali kepada pegawai untuk merancang inovasi meskipun hasil inovasi sebelumnya kurang optimal pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap penerimaan kegagalan inovasi pada indikator desain Toleransi terhadap kegagalan inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.C.6_SS3-DIIIP.D1.3.4": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memberikan kesempatan kembali kepada pegawai untuk merancang inovasi meskipun hasil inovasi sebelumnya kurang optimal pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Toleransi terhadap kegagalan inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi terhadap penerimaan kegagalan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memberikan kesempatan kembali kepada pegawai untuk merancang inovasi meskipun hasil inovasi sebelumnya kurang optimal pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap penerimaan kegagalan inovasi pada indikator desain Toleransi terhadap kegagalan inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.3.4_SS3-IIIP.B4.C.6": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Toleransi terhadap kegagalan inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi terhadap penerimaan kegagalan inovasi didukung oleh pertanyaan survei mengenai frekuensi instansi memberikan kesempatan kembali kepada pegawai untuk merancang inovasi meskipun hasil inovasi sebelumnya kurang optimal pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi terhadap penerimaan kegagalan inovasi pada indikator desain Toleransi terhadap kegagalan inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi instansi memberikan kesempatan kembali kepada pegawai untuk merancang inovasi meskipun hasil inovasi sebelumnya kurang optimal pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP)."
      },
      "REL-S3-46": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki pegawai yang saling membantu rekan kerja dalam mengembangkan dan menerapkan inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan sosial terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi kerja sama dan kepercayaan rekan kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki pegawai yang saling membantu rekan kerja dalam mengembangkan dan menerapkan inovasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi kerja sama dan kepercayaan rekan kerja pada indikator desain Dukungan sosial terhadap inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.C.7_SS3-DIIIP.D1.3.5": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki pegawai yang saling membantu rekan kerja dalam mengembangkan dan menerapkan inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan sosial terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi kerja sama dan kepercayaan rekan kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki pegawai yang saling membantu rekan kerja dalam mengembangkan dan menerapkan inovasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi kerja sama dan kepercayaan rekan kerja pada indikator desain Dukungan sosial terhadap inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.3.5_SS3-IIIP.B4.C.7": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Dukungan sosial terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi kerja sama dan kepercayaan rekan kerja didukung oleh pertanyaan survei mengenai instansi memiliki pegawai yang saling membantu rekan kerja dalam mengembangkan dan menerapkan inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi kerja sama dan kepercayaan rekan kerja pada indikator desain Dukungan sosial terhadap inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi memiliki pegawai yang saling membantu rekan kerja dalam mengembangkan dan menerapkan inovasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP)."
      },
      "REL-S3-47": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai dan rekan kerja merasa kurang didukung oleh pegawai lain dalam mengembangkan dan menerapkan inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan sosial terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi kerja sama dan kepercayaan rekan kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait penguatan dukungan sosial dan kerja sama antarpegawai dalam mengembangkan serta menerapkan inovasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi kerja sama dan kepercayaan rekan kerja pada indikator desain Dukungan sosial terhadap inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.C.8_SS3-DIIIP.D1.3.5": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi pegawai dan rekan kerja merasa kurang didukung oleh pegawai lain dalam mengembangkan dan menerapkan inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Dukungan sosial terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai persepsi kerja sama dan kepercayaan rekan kerja.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait penguatan dukungan sosial dan kerja sama antarpegawai dalam mengembangkan serta menerapkan inovasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi kerja sama dan kepercayaan rekan kerja pada indikator desain Dukungan sosial terhadap inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.3.5_SS3-IIIP.B4.C.8": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Dukungan sosial terhadap inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur persepsi kerja sama dan kepercayaan rekan kerja didukung oleh pertanyaan survei mengenai frekuensi pegawai dan rekan kerja merasa kurang didukung oleh pegawai lain dalam mengembangkan dan menerapkan inovasi pada indikator survei BLOK IVc. IKLIM ORGANISASI INOVATIF (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi kerja sama dan kepercayaan rekan kerja pada indikator desain Dukungan sosial terhadap inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait penguatan dukungan sosial dan kerja sama antarpegawai dalam mengembangkan serta menerapkan inovasi pada BLOK IVc. IKLIM ORGANISASI INOVATIF (Survei IIIP)."
      },
      "REL-S3-48": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dokumentasi, pembahasan, dan berbagi pembelajaran.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.1_SS3-DIIIP.D1.4.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dokumentasi, pembahasan, dan berbagi pembelajaran.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.1_SS3-IIIP.B4.D.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur dokumentasi, pembahasan, dan berbagi pembelajaran didukung oleh pertanyaan survei mengenai instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi memiliki pegawai dengan pengetahuan dan keahlian khusus untuk kemajuan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-49": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi percaya pada kualitas inovasi yang dihasilkan pegawai atau unit kerja lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dokumentasi, pembahasan, dan berbagi pembelajaran.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi percaya pada kualitas inovasi yang dihasilkan pegawai atau unit kerja lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.2_SS3-DIIIP.D1.4.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi percaya pada kualitas inovasi yang dihasilkan pegawai atau unit kerja lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dokumentasi, pembahasan, dan berbagi pembelajaran.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi percaya pada kualitas inovasi yang dihasilkan pegawai atau unit kerja lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.1_SS3-IIIP.B4.D.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur dokumentasi, pembahasan, dan berbagi pembelajaran didukung oleh pertanyaan survei mengenai instansi percaya pada kualitas inovasi yang dihasilkan pegawai atau unit kerja lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi percaya pada kualitas inovasi yang dihasilkan pegawai atau unit kerja lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-50": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki pegawai dengan berbagai keahlian yang dapat bekerja sama dengan baik dalam mengelola program inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dokumentasi, pembahasan, dan berbagi pembelajaran.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki pegawai dengan berbagai keahlian yang dapat bekerja sama dengan baik dalam mengelola program inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.3_SS3-DIIIP.D1.4.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki pegawai dengan berbagai keahlian yang dapat bekerja sama dengan baik dalam mengelola program inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai dokumentasi, pembahasan, dan berbagi pembelajaran.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki pegawai dengan berbagai keahlian yang dapat bekerja sama dengan baik dalam mengelola program inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.1_SS3-IIIP.B4.D.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur dokumentasi, pembahasan, dan berbagi pembelajaran didukung oleh pertanyaan survei mengenai instansi memiliki pegawai dengan berbagai keahlian yang dapat bekerja sama dengan baik dalam mengelola program inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator dokumentasi, pembahasan, dan berbagi pembelajaran pada indikator desain Spesialisasi, kredibilitas dan koordinasi talenta pegawai (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi memiliki pegawai dengan berbagai keahlian yang dapat bekerja sama dengan baik dalam mengelola program inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-51": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memfasilitasi kerja sama antar pegawai untuk merancang sistem kerja atau pelayanan yang inovatif pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai keterlibatan unit lain dalam pelaksanaan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memfasilitasi kerja sama antar pegawai untuk merancang sistem kerja atau pelayanan yang inovatif pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan unit lain dalam pelaksanaan inovasi pada indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.4_SS3-DIIIP.D1.4.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memfasilitasi kerja sama antar pegawai untuk merancang sistem kerja atau pelayanan yang inovatif pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai keterlibatan unit lain dalam pelaksanaan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memfasilitasi kerja sama antar pegawai untuk merancang sistem kerja atau pelayanan yang inovatif pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan unit lain dalam pelaksanaan inovasi pada indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.3_SS3-IIIP.B4.D.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur keterlibatan unit lain dalam pelaksanaan inovasi didukung oleh pertanyaan survei mengenai frekuensi instansi memfasilitasi kerja sama antar pegawai untuk merancang sistem kerja atau pelayanan yang inovatif pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator keterlibatan unit lain dalam pelaksanaan inovasi pada indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi instansi memfasilitasi kerja sama antar pegawai untuk merancang sistem kerja atau pelayanan yang inovatif pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-52": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki sistem yang memudahkan pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi dengan unit kerja lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai pengetahuan/praktik dibagikan untuk adopsi/replikasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki sistem yang memudahkan pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi dengan unit kerja lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.5_SS3-DIIIP.D1.4.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki sistem yang memudahkan pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi dengan unit kerja lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai pengetahuan/praktik dibagikan untuk adopsi/replikasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki sistem yang memudahkan pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi dengan unit kerja lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.2_SS3-IIIP.B4.D.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur pengetahuan/praktik dibagikan untuk adopsi/replikasi didukung oleh pertanyaan survei mengenai instansi memiliki sistem yang memudahkan pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi dengan unit kerja lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi memiliki sistem yang memudahkan pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi dengan unit kerja lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-53": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memfasilitasi pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi agar inovasi dapat dimanfaatkan atau direplikasi oleh pihak lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai pengetahuan/praktik dibagikan untuk adopsi/replikasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memfasilitasi pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi agar inovasi dapat dimanfaatkan atau direplikasi oleh pihak lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.6_SS3-DIIIP.D1.4.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memfasilitasi pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi agar inovasi dapat dimanfaatkan atau direplikasi oleh pihak lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai pengetahuan/praktik dibagikan untuk adopsi/replikasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memfasilitasi pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi agar inovasi dapat dimanfaatkan atau direplikasi oleh pihak lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.2_SS3-IIIP.B4.D.6": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur pengetahuan/praktik dibagikan untuk adopsi/replikasi didukung oleh pertanyaan survei mengenai frekuensi instansi memfasilitasi pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi agar inovasi dapat dimanfaatkan atau direplikasi oleh pihak lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi instansi memfasilitasi pegawai berbagi pengetahuan, keahlian, metode, dan praktik inovasi agar inovasi dapat dimanfaatkan atau direplikasi oleh pihak lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-54": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi menghasilkan inovasi berdampak yang telah disebarkan dan diterapkan pada unit kerja atau instansi lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai pengetahuan/praktik dibagikan untuk adopsi/replikasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi menghasilkan inovasi berdampak yang telah disebarkan dan diterapkan pada unit kerja atau instansi lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.7_SS3-DIIIP.D1.4.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi menghasilkan inovasi berdampak yang telah disebarkan dan diterapkan pada unit kerja atau instansi lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai pengetahuan/praktik dibagikan untuk adopsi/replikasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi menghasilkan inovasi berdampak yang telah disebarkan dan diterapkan pada unit kerja atau instansi lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.2_SS3-IIIP.B4.D.7": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Difusi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur pengetahuan/praktik dibagikan untuk adopsi/replikasi didukung oleh pertanyaan survei mengenai instansi menghasilkan inovasi berdampak yang telah disebarkan dan diterapkan pada unit kerja atau instansi lain pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator pengetahuan/praktik dibagikan untuk adopsi/replikasi pada indikator desain Difusi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi menghasilkan inovasi berdampak yang telah disebarkan dan diterapkan pada unit kerja atau instansi lain pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-55": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memfasilitasi kegiatan kolaborasi dengan mitra kerja lintas unit dalam melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai keterlibatan unit lain dalam pelaksanaan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memfasilitasi kegiatan kolaborasi dengan mitra kerja lintas unit dalam melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan unit lain dalam pelaksanaan inovasi pada indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.8_SS3-DIIIP.D1.4.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memfasilitasi kegiatan kolaborasi dengan mitra kerja lintas unit dalam melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai keterlibatan unit lain dalam pelaksanaan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memfasilitasi kegiatan kolaborasi dengan mitra kerja lintas unit dalam melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator keterlibatan unit lain dalam pelaksanaan inovasi pada indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.3_SS3-IIIP.B4.D.8": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur keterlibatan unit lain dalam pelaksanaan inovasi didukung oleh pertanyaan survei mengenai frekuensi instansi memfasilitasi kegiatan kolaborasi dengan mitra kerja lintas unit dalam melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator keterlibatan unit lain dalam pelaksanaan inovasi pada indikator desain Kolaborasi lintas unit dalam implementasi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi instansi memfasilitasi kegiatan kolaborasi dengan mitra kerja lintas unit dalam melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-56": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki prosedur yang jelas untuk memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai penerapan penghargaan/pengakuan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki prosedur yang jelas untuk memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.9_SS3-DIIIP.D1.4.4": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi memiliki prosedur yang jelas untuk memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai penerapan penghargaan/pengakuan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi memiliki prosedur yang jelas untuk memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.4_SS3-IIIP.B4.D.9": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur penerapan penghargaan/pengakuan inovasi didukung oleh pertanyaan survei mengenai instansi memiliki prosedur yang jelas untuk memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi memiliki prosedur yang jelas untuk memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-57": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai penerapan penghargaan/pengakuan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.10_SS3-DIIIP.D1.4.4": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai penerapan penghargaan/pengakuan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.4_SS3-IIIP.B4.D.10": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur penerapan penghargaan/pengakuan inovasi didukung oleh pertanyaan survei mengenai frekuensi instansi memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi instansi memberikan penghargaan atau apresiasi kepada pegawai yang aktif melakukan inovasi pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-58": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai unit kerja atau instansi telah memberikan apresiasi kepada pegawai yang aktif melakukan inovasi secara memuaskan pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai penerapan penghargaan/pengakuan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait unit kerja atau instansi telah memberikan apresiasi kepada pegawai yang aktif melakukan inovasi secara memuaskan pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B4.D.11_SS3-DIIIP.D1.4.4": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai unit kerja atau instansi telah memberikan apresiasi kepada pegawai yang aktif melakukan inovasi secara memuaskan pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai penerapan penghargaan/pengakuan inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait unit kerja atau instansi telah memberikan apresiasi kepada pegawai yang aktif melakukan inovasi secara memuaskan pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP) dengan penguatan pemenuhan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D1.4.4_SS3-IIIP.B4.D.11": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Pemanfaatan sistem apresiasi inovasi (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur penerapan penghargaan/pengakuan inovasi didukung oleh pertanyaan survei mengenai unit kerja atau instansi telah memberikan apresiasi kepada pegawai yang aktif melakukan inovasi secara memuaskan pada indikator survei BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator penerapan penghargaan/pengakuan inovasi pada indikator desain Pemanfaatan sistem apresiasi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait unit kerja atau instansi telah memberikan apresiasi kepada pegawai yang aktif melakukan inovasi secara memuaskan pada BLOK IVd. PEMBELAJARAN DAN DIFUSI SOSIAL (Survei IIIP)."
      },
      "REL-S3-59": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai akurasi, kelengkapan, aktualitas, dan relevansi data.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Desain IIIP)."
      },
      "SS3-IIIP.B4.E.1_SS3-DIIIP.D1.5.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai akurasi, kelengkapan, aktualitas, dan relevansi data.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Desain IIIP)."
      },
      "SS3-DIIIP.D1.5.1_SS3-IIIP.B4.E.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur akurasi, kelengkapan, aktualitas, dan relevansi data didukung oleh pertanyaan survei mengenai instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi telah memiliki sistem penjaminan kualitas data yang memastikan data dalam sistem digital tetap valid, relevan, dan mutakhir pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP)."
      },
      "REL-S3-60": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memanfaatkan data dari sistem digital sebagai rujukan dalam menyusun kebijakan ataupun program kerja pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai akurasi, kelengkapan, aktualitas, dan relevansi data.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memanfaatkan data dari sistem digital sebagai rujukan dalam menyusun kebijakan ataupun program kerja pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Desain IIIP)."
      },
      "SS3-IIIP.B4.E.2_SS3-DIIIP.D1.5.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi instansi memanfaatkan data dari sistem digital sebagai rujukan dalam menyusun kebijakan ataupun program kerja pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai akurasi, kelengkapan, aktualitas, dan relevansi data.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi instansi memanfaatkan data dari sistem digital sebagai rujukan dalam menyusun kebijakan ataupun program kerja pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Desain IIIP)."
      },
      "SS3-DIIIP.D1.5.1_SS3-IIIP.B4.E.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Kualitas data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur akurasi, kelengkapan, aktualitas, dan relevansi data didukung oleh pertanyaan survei mengenai frekuensi instansi memanfaatkan data dari sistem digital sebagai rujukan dalam menyusun kebijakan ataupun program kerja pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator akurasi, kelengkapan, aktualitas, dan relevansi data pada indikator desain Kualitas data (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi instansi memanfaatkan data dari sistem digital sebagai rujukan dalam menyusun kebijakan ataupun program kerja pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP)."
      },
      "REL-S3-61": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah menerapkan sistem pelayanan data yang cepat dan mudah diakses untuk mendukung pengembangan inovasi pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Aksesibilitas dan berbagi data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemudahan akses, integrasi, dan pertukaran data antar-sistem.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah menerapkan sistem pelayanan data yang cepat dan mudah diakses untuk mendukung pengembangan inovasi pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemudahan akses, integrasi, dan pertukaran data antar-sistem pada indikator desain Aksesibilitas dan berbagi data (Desain IIIP)."
      },
      "SS3-IIIP.B4.E.3_SS3-DIIIP.D1.5.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah menerapkan sistem pelayanan data yang cepat dan mudah diakses untuk mendukung pengembangan inovasi pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Aksesibilitas dan berbagi data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemudahan akses, integrasi, dan pertukaran data antar-sistem.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah menerapkan sistem pelayanan data yang cepat dan mudah diakses untuk mendukung pengembangan inovasi pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemudahan akses, integrasi, dan pertukaran data antar-sistem pada indikator desain Aksesibilitas dan berbagi data (Desain IIIP)."
      },
      "SS3-DIIIP.D1.5.2_SS3-IIIP.B4.E.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Aksesibilitas dan berbagi data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur kemudahan akses, integrasi, dan pertukaran data antar-sistem didukung oleh pertanyaan survei mengenai instansi telah menerapkan sistem pelayanan data yang cepat dan mudah diakses untuk mendukung pengembangan inovasi pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator kemudahan akses, integrasi, dan pertukaran data antar-sistem pada indikator desain Aksesibilitas dan berbagi data (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi telah menerapkan sistem pelayanan data yang cepat dan mudah diakses untuk mendukung pengembangan inovasi pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP)."
      },
      "REL-S3-62": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi data dalam sistem digital instansi diakses dan dimanfaatkan pegawai atau pihak lain untuk mengembangkan inovasi pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Aksesibilitas dan berbagi data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemudahan akses, integrasi, dan pertukaran data antar-sistem.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi data dalam sistem digital instansi diakses dan dimanfaatkan pegawai atau pihak lain untuk mengembangkan inovasi pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemudahan akses, integrasi, dan pertukaran data antar-sistem pada indikator desain Aksesibilitas dan berbagi data (Desain IIIP)."
      },
      "SS3-IIIP.B4.E.4_SS3-DIIIP.D1.5.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi data dalam sistem digital instansi diakses dan dimanfaatkan pegawai atau pihak lain untuk mengembangkan inovasi pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Aksesibilitas dan berbagi data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai kemudahan akses, integrasi, dan pertukaran data antar-sistem.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi data dalam sistem digital instansi diakses dan dimanfaatkan pegawai atau pihak lain untuk mengembangkan inovasi pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator kemudahan akses, integrasi, dan pertukaran data antar-sistem pada indikator desain Aksesibilitas dan berbagi data (Desain IIIP)."
      },
      "SS3-DIIIP.D1.5.2_SS3-IIIP.B4.E.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Aksesibilitas dan berbagi data (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur kemudahan akses, integrasi, dan pertukaran data antar-sistem didukung oleh pertanyaan survei mengenai frekuensi data dalam sistem digital instansi diakses dan dimanfaatkan pegawai atau pihak lain untuk mengembangkan inovasi pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator kemudahan akses, integrasi, dan pertukaran data antar-sistem pada indikator desain Aksesibilitas dan berbagi data (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi data dalam sistem digital instansi diakses dan dimanfaatkan pegawai atau pihak lain untuk mengembangkan inovasi pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP)."
      },
      "REL-S3-63": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah menerapkan sistem layanan digital yang cepat dan mudah digunakan sesuai perkembangan teknologi dan kebutuhan pengguna, termasuk penggunaan fasilitas awan (cloud) pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Infrastruktur digital yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai pemanfaatan teknologi (cloud, open source, standar terbuka).",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah menerapkan sistem layanan digital yang cepat dan mudah digunakan sesuai perkembangan teknologi dan kebutuhan pengguna, termasuk penggunaan fasilitas awan (cloud) pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator pemanfaatan teknologi (cloud, open source, standar terbuka) pada indikator desain Infrastruktur digital yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-IIIP.B4.E.5_SS3-DIIIP.D1.5.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai instansi telah menerapkan sistem layanan digital yang cepat dan mudah digunakan sesuai perkembangan teknologi dan kebutuhan pengguna, termasuk penggunaan fasilitas awan (cloud) pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP mendukung pengukuran indikator desain Infrastruktur digital yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang menilai pemanfaatan teknologi (cloud, open source, standar terbuka).",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait instansi telah menerapkan sistem layanan digital yang cepat dan mudah digunakan sesuai perkembangan teknologi dan kebutuhan pengguna, termasuk penggunaan fasilitas awan (cloud) pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator pemanfaatan teknologi (cloud, open source, standar terbuka) pada indikator desain Infrastruktur digital yang fleksibel dan adaptif (Desain IIIP)."
      },
      "SS3-DIIIP.D1.5.3_SS3-IIIP.B4.E.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Infrastruktur digital yang fleksibel dan adaptif (Domain 1: Kapasitas Inovasi Organisasi (Enabling Environment)) pada Desain IIIP yang mengukur pemanfaatan teknologi (cloud, open source, standar terbuka) didukung oleh pertanyaan survei mengenai instansi telah menerapkan sistem layanan digital yang cepat dan mudah digunakan sesuai perkembangan teknologi dan kebutuhan pengguna, termasuk penggunaan fasilitas awan (cloud) pada indikator survei BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (BLOK IV. KAPASITAS INOVASI ORGANISASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator pemanfaatan teknologi (cloud, open source, standar terbuka) pada indikator desain Infrastruktur digital yang fleksibel dan adaptif (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait instansi telah menerapkan sistem layanan digital yang cepat dan mudah digunakan sesuai perkembangan teknologi dan kebutuhan pengguna, termasuk penggunaan fasilitas awan (cloud) pada BLOK IVe. INFRASTRUKTUR DIGITAL YANG MENDUKUNG INOVASI (Survei IIIP)."
      },
      "REL-S3-64": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai tingkat perubahan yang dihasilkan inovasi yang diterapkan dibandingkan dengan cara kerja atau inovasi sebelumnya pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Tingkat kebaruan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait tingkat perubahan yang dihasilkan inovasi yang diterapkan dibandingkan dengan cara kerja atau inovasi sebelumnya pada BLOK Va. OUTPUT INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan pada indikator desain Tingkat kebaruan inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B5.A.6_SS3-DIIIP.D3.1.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai tingkat perubahan yang dihasilkan inovasi yang diterapkan dibandingkan dengan cara kerja atau inovasi sebelumnya pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Tingkat kebaruan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait tingkat perubahan yang dihasilkan inovasi yang diterapkan dibandingkan dengan cara kerja atau inovasi sebelumnya pada BLOK Va. OUTPUT INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan pada indikator desain Tingkat kebaruan inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D3.1.1_SS3-IIIP.B5.A.6": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Tingkat kebaruan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan didukung oleh pertanyaan survei mengenai tingkat perubahan yang dihasilkan inovasi yang diterapkan dibandingkan dengan cara kerja atau inovasi sebelumnya pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat kebaruan inovasi yang dihasilkan dalam organisasi, baik dari sisi metode, proses, produk, layanan, maupun kebijakan pada indikator desain Tingkat kebaruan inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait tingkat perubahan yang dihasilkan inovasi yang diterapkan dibandingkan dengan cara kerja atau inovasi sebelumnya pada BLOK Va. OUTPUT INOVASI (Survei IIIP)."
      },
      "REL-S3-65": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai penerapan inovasi yang diterapkan dirasakan lebih mudah, cepat, dan nyaman diakses oleh pegawai atau pengguna dibandingkan cara kerja atau inovasi sebelumnya pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Tingkat penggunaan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait penerapan inovasi yang diterapkan dirasakan lebih mudah, cepat, dan nyaman diakses oleh pegawai atau pengguna dibandingkan cara kerja atau inovasi sebelumnya pada BLOK Va. OUTPUT INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi pada indikator desain Tingkat penggunaan inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B5.A.7_SS3-DIIIP.D3.1.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai penerapan inovasi yang diterapkan dirasakan lebih mudah, cepat, dan nyaman diakses oleh pegawai atau pengguna dibandingkan cara kerja atau inovasi sebelumnya pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Tingkat penggunaan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait penerapan inovasi yang diterapkan dirasakan lebih mudah, cepat, dan nyaman diakses oleh pegawai atau pengguna dibandingkan cara kerja atau inovasi sebelumnya pada BLOK Va. OUTPUT INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi pada indikator desain Tingkat penggunaan inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D3.1.2_SS3-IIIP.B5.A.7": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Tingkat penggunaan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi didukung oleh pertanyaan survei mengenai penerapan inovasi yang diterapkan dirasakan lebih mudah, cepat, dan nyaman diakses oleh pegawai atau pengguna dibandingkan cara kerja atau inovasi sebelumnya pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi pada indikator desain Tingkat penggunaan inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait penerapan inovasi yang diterapkan dirasakan lebih mudah, cepat, dan nyaman diakses oleh pegawai atau pengguna dibandingkan cara kerja atau inovasi sebelumnya pada BLOK Va. OUTPUT INOVASI (Survei IIIP)."
      },
      "REL-S3-66": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi inovasi yang diterapkan dimanfaatkan oleh pegawai atau pengguna pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Tingkat penggunaan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi inovasi yang diterapkan dimanfaatkan oleh pegawai atau pengguna pada BLOK Va. OUTPUT INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi pada indikator desain Tingkat penggunaan inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B5.A.8_SS3-DIIIP.D3.1.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai frekuensi inovasi yang diterapkan dimanfaatkan oleh pegawai atau pengguna pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Tingkat penggunaan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait frekuensi inovasi yang diterapkan dimanfaatkan oleh pegawai atau pengguna pada BLOK Va. OUTPUT INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi pada indikator desain Tingkat penggunaan inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D3.1.2_SS3-IIIP.B5.A.8": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Tingkat penggunaan inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi didukung oleh pertanyaan survei mengenai frekuensi inovasi yang diterapkan dimanfaatkan oleh pegawai atau pengguna pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat implementasi dan penggunaan inovasi dalam unit kerja atau instansi pada indikator desain Tingkat penggunaan inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait frekuensi inovasi yang diterapkan dimanfaatkan oleh pegawai atau pengguna pada BLOK Va. OUTPUT INOVASI (Survei IIIP)."
      },
      "REL-S3-67": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai luasnya cakupan penerapan inovasi yang diterapkan pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Replikasi atau adopsi inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai tingkat adopsi atau replikasi inovasi oleh unit kerja lain, instansi lain, atau organisasi lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait luasnya cakupan penerapan inovasi yang diterapkan pada BLOK Va. OUTPUT INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat adopsi atau replikasi inovasi oleh unit kerja lain, instansi lain, atau organisasi lain pada indikator desain Replikasi atau adopsi inovasi (Desain IIIP)."
      },
      "SS3-IIIP.B5.A.9_SS3-DIIIP.D3.1.3": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai luasnya cakupan penerapan inovasi yang diterapkan pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Replikasi atau adopsi inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai tingkat adopsi atau replikasi inovasi oleh unit kerja lain, instansi lain, atau organisasi lain.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait luasnya cakupan penerapan inovasi yang diterapkan pada BLOK Va. OUTPUT INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator tingkat adopsi atau replikasi inovasi oleh unit kerja lain, instansi lain, atau organisasi lain pada indikator desain Replikasi atau adopsi inovasi (Desain IIIP)."
      },
      "SS3-DIIIP.D3.1.3_SS3-IIIP.B5.A.9": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Replikasi atau adopsi inovasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur tingkat adopsi atau replikasi inovasi oleh unit kerja lain, instansi lain, atau organisasi lain didukung oleh pertanyaan survei mengenai luasnya cakupan penerapan inovasi yang diterapkan pada indikator survei BLOK Va. OUTPUT INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator tingkat adopsi atau replikasi inovasi oleh unit kerja lain, instansi lain, atau organisasi lain pada indikator desain Replikasi atau adopsi inovasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait luasnya cakupan penerapan inovasi yang diterapkan pada BLOK Va. OUTPUT INOVASI (Survei IIIP)."
      },
      "REL-S3-68": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP)."
      },
      "SS3-IIIP.B5.B.1_SS3-DIIIP.D3.2.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP)."
      },
      "SS3-DIIIP.D3.2.1_SS3-IIIP.B5.B.1": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi didukung oleh pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kinerja pegawai atau cakupan layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP)."
      },
      "REL-S3-69": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP)."
      },
      "SS3-IIIP.B5.B.2_SS3-DIIIP.D3.2.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP)."
      },
      "SS3-DIIIP.D3.2.1_SS3-IIIP.B5.B.2": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi didukung oleh pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP)."
      },
      "REL-S3-70": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP)."
      },
      "SS3-IIIP.B5.B.3_SS3-DIIIP.D3.2.1": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP)."
      },
      "SS3-DIIIP.D3.2.1_SS3-IIIP.B5.B.3": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Peningkatan kinerja organisasi (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi didukung oleh pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi pegawai mengenai peningkatan efisiensi proses kerja, penghematan sumber daya, dan peningkatan pencapaian target kinerja akibat inovasi pada indikator desain Peningkatan kinerja organisasi (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait manfaat penerapan inovasi yang diterapkan dalam mengurangi beban biaya bagi pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP)."
      },
      "REL-S3-71": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepuasan pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepuasan pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan pada indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Desain IIIP)."
      },
      "SS3-IIIP.B5.B.4_SS3-DIIIP.D3.2.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepuasan pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepuasan pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan pada indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Desain IIIP)."
      },
      "SS3-DIIIP.D3.2.2_SS3-IIIP.B5.B.4": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan didukung oleh pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepuasan pegawai atau pengguna layanan di instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan pada indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepuasan pegawai atau pengguna layanan di instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP)."
      },
      "REL-S3-72": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepercayaan pegawai atau pengguna layanan kepada instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepercayaan pegawai atau pengguna layanan kepada instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan pada indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Desain IIIP)."
      },
      "SS3-IIIP.B5.B.5_SS3-DIIIP.D3.2.2": {
            "jenis": "Mendukung",
            "alasan": "Pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepercayaan pegawai atau pengguna layanan kepada instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP mendukung pengukuran indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang menilai persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan.",
            "rekomendasi": "Disarankan menyelaraskan tindak lanjut hasil survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepercayaan pegawai atau pengguna layanan kepada instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP) dengan penguatan pemenuhan sub-indikator persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan pada indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Desain IIIP)."
      },
      "SS3-DIIIP.D3.2.2_SS3-IIIP.B5.B.5": {
            "jenis": "Mendukung",
            "alasan": "Indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Domain 3: Performa Inovasi (Results & Impacts)) pada Desain IIIP yang mengukur persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan didukung oleh pertanyaan survei mengenai manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepercayaan pegawai atau pengguna layanan kepada instansi pada indikator survei BLOK Vb. OUTCOME INOVASI (BLOK V. PERFORMA INOVASI) dalam Survei IIIP.",
            "rekomendasi": "Disarankan menyelaraskan penguatan sub-indikator persepsi terhadap peningkatan kualitas layanan serta tingkat kepuasan pengguna setelah inovasi diterapkan pada indikator desain Peningkatan kualitas layanan dan kepuasan pengguna (Desain IIIP) dengan tindak lanjut hasil pengukuran survei terkait manfaat penerapan inovasi yang diterapkan dalam meningkatkan kepercayaan pegawai atau pengguna layanan kepada instansi pada BLOK Vb. OUTCOME INOVASI (Survei IIIP)."
      }
},
    sasaran4Justifikasi: {
        "SS4-KK.KF.1.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan, tetapi mengukur aspek yang berbeda sehingga risiko redundansi relatif rendah hingga sedang. Indikator KK Relevansi menilai kesesuaian mandat dan fungsi instansi dengan kebutuhan organisasi serta hasil yang ingin dicapai, sedangkan IPPN menilai sejauh mana sasaran pembangunan nasional telah diterjemahkan ke dalam target kinerja instansi. Irisan keduanya terletak pada keterhubungan antara fungsi instansi dan sasaran pembangunan nasional. Namun, KK berfokus pada ketepatan fungsi organisasi, sementara IPPN berfokus pada keselarasan perencanaan kinerja. Oleh karena itu, keduanya tetap relevan untuk dipertahankan dengan batas pengukuran yang jelas agar tidak terjadi penghitungan aspek yang sama.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.1.2_SS4-IPPN.3.a.1.a": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki irisan pada penerjemahan tugas dan fungsi instansi ke dalam sasaran kinerja, tetapi belum menunjukkan pengukuran yang sepenuhnya sama. Indikator KK Implementasi menilai sejauh mana tugas dan fungsi benar-benar dijalankan oleh unit organisasi serta mendukung pencapaian target instansi, sedangkan IPPN menilai apakah sasaran dan indikator prioritas pembangunan nasional telah ditetapkan sebagai sasaran kinerja instansi. Dengan demikian, IPPN memastikan keselarasan sasaran dalam perencanaan, sementara KK memastikan fungsi organisasi benar-benar dijalankan untuk mendukung pencapaiannya. Keduanya tetap perlu dipertahankan dengan memperjelas batas pengukuran, yaitu IPPN pada penetapan sasaran kinerja dan KK pada bukti pelaksanaan tugas dan fungsi organisasi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.2.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan secara tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Delegasi Kewenangan menilai apakah pembagian dan pelaksanaan kewenangan pada setiap jenjang organisasi sudah jelas dan sesuai dengan mandatnya, sedangkan IPPN menilai kesesuaian penjabaran sasaran pembangunan nasional ke dalam target kinerja instansi. Irisannya terletak pada keterhubungan antara kewenangan organisasi dan pencapaian sasaran nasional. Namun, KK berfokus pada tata kelola pengambilan keputusan, sementara IPPN berfokus pada keselarasan perencanaan kinerja. Oleh karena itu, keduanya perlu dipertahankan dengan memisahkan penilaian tata kewenangan organisasi dari kesesuaian target kinerja dalam dokumen perencanaan.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi."
        },
        "SS4-KK.KF.2.2_SS4-IPPN.3.a.1.a": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling melengkapi dengan risiko redundansi rendah karena mengukur aspek yang berbeda tetapi saling berkaitan. Indikator KK Implementasi menilai sejauh mana pendelegasian kewenangan benar-benar mendukung kelancaran pelaksanaan tugas, akuntabilitas, dan kinerja organisasi, sedangkan IPPN menilai apakah sasaran dan indikator prioritas pembangunan nasional telah ditetapkan sebagai sasaran kinerja instansi. Irisannya terletak pada hubungan antara pelaksanaan kewenangan organisasi dan pencapaian sasaran nasional. Namun, KK berfokus pada efektivitas pelaksanaan kewenangan, sementara IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap relevan dipertahankan dengan membedakan penilaian atas efektivitas pelaksanaan kewenangan dan kesesuaian sasaran kinerja instansi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.3.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Relevansi Unsur Pembantu Pemimpin menilai apakah fungsi unit pendukung pimpinan sudah tepat dalam membantu koordinasi, perumusan kebijakan, dan pengambilan keputusan, sedangkan IPPN menilai kesesuaian penjabaran sasaran pembangunan nasional ke dalam target kinerja instansi. Keterkaitannya terletak pada peran fungsi pendukung organisasi dalam membantu pencapaian sasaran nasional. Namun, KK berfokus pada ketepatan fungsi organisasi, sementara IPPN berfokus pada keselarasan perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas relevansi fungsi unit pendukung dan kesesuaian target kinerja instansi.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KF.3.2_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Relevansi Unsur Pengawas menilai apakah fungsi pengawasan, pemantauan, reviu, dan evaluasi telah dijalankan secara tepat untuk memastikan tata kelola organisasi berjalan dengan baik, sedangkan IPPN menilai kesesuaian penjabaran sasaran pembangunan nasional ke dalam target kinerja instansi. Keterkaitannya terletak pada peran pengawasan dalam memastikan pelaksanaan program tetap sejalan dengan sasaran yang telah ditetapkan. Namun, KK berfokus pada ketepatan fungsi pengawasan organisasi, sementara IPPN berfokus pada keselarasan perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas fungsi pengawasan dan kesesuaian target kinerja instansi.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi."
        },
        "SS4-KK.KF.3.3_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Relevansi Unsur Pendukung menilai apakah fungsi layanan pendukung, seperti pengelolaan administrasi dan dukungan operasional, sudah sesuai dengan kebutuhan organisasi dan mampu menunjang pelaksanaan tugas utama. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran pembangunan nasional ke dalam target kinerja instansi. Keterkaitannya terletak pada peran layanan pendukung dalam memperlancar pencapaian sasaran organisasi. Namun, KK berfokus pada ketepatan fungsi layanan pendukung, sedangkan IPPN berfokus pada keselarasan perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas relevansi fungsi pendukung dan kesesuaian target kinerja instansi.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan."
        },
        "SS4-KK.KU.1.1_SS4-IPPN.1.c.4": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling melengkapi dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Distribusi Beban Kerja menilai apakah beban pekerjaan telah dibagi secara seimbang antarunit sesuai volume, kompleksitas, dan kebutuhan pekerjaan, sedangkan IPPN menilai kesesuaian target dan satuan output prioritas dalam Renja K/L dengan proyek prioritas nasional dalam RKP. Keterkaitannya terletak pada kebutuhan untuk memastikan kapasitas dan pembagian beban kerja organisasi mampu mendukung pencapaian prioritas pembangunan. Namun, KK berfokus pada kecukupan dan keseimbangan beban kerja, sementara IPPN berfokus pada keselarasan target output dalam perencanaan. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas distribusi beban kerja organisasi dan kesesuaian output prioritas dalam dokumen perencanaan.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan."
        },
        "SS4-KK.KU.1.2_SS4-IPPN.2.b.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki potensi tumpang tindih cukup tinggi karena sama-sama berkaitan dengan pengalokasian anggaran, tetapi fokus pengukurannya masih dapat dibedakan. Indikator KK Alokasi Anggaran menilai apakah anggaran yang tersedia sudah mencukupi kebutuhan dan beban kerja masing-masing unit organisasi, sedangkan IPPN menilai kesesuaian total anggaran dalam RKA K/L dengan yang telah direncanakan dalam Renja K/L. Irisannya terletak pada keselarasan alokasi anggaran dengan kebutuhan dan perencanaan organisasi. Namun, KK berfokus pada kecukupan anggaran untuk menjalankan tugas, sementara IPPN berfokus pada konsistensi anggaran antara dokumen perencanaan dan penganggaran. Oleh karena itu, keduanya masih dapat dipertahankan sepanjang KK mengukur kecukupan anggaran berdasarkan kebutuhan riil unit, sedangkan IPPN mengukur kesesuaian total anggaran RKA K/L dengan Renja K/L, tanpa menggunakan bukti atau perhitungan yang sama untuk kedua indikator.",
            "rekomendasi": "Pisahkan kecukupan alokasi (KK), alignment prioritas (IPPN), anggaran berbasis kinerja (SAKIP), kualitas proses satker (IKPA)."
        },
        "SS4-KK.KU.1.3_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling melengkapi dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Distribusi Sumber Daya Manusia menilai apakah jumlah dan kompetensi pegawai telah sesuai dengan kebutuhan serta beban kerja masing-masing unit organisasi, sedangkan IPPN menilai kesesuaian penjabaran sasaran pembangunan nasional ke dalam target kinerja instansi. Keterkaitannya terletak pada kebutuhan untuk memastikan ketersediaan SDM yang memadai agar instansi mampu mencapai sasaran pembangunan yang menjadi tanggung jawabnya. Namun, KK berfokus pada kecukupan dan pemerataan SDM, sementara IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas kecukupan SDM organisasi dan kesesuaian target kinerja instansi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KU.2.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Penyederhanaan menilai sejauh mana penyederhanaan struktur organisasi mampu memperjelas tanggung jawab, memperpendek koordinasi, mempercepat proses kerja, dan meningkatkan efisiensi organisasi. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran pembangunan nasional ke dalam target kinerja instansi. Keterkaitannya terletak pada peran struktur organisasi yang lebih sederhana dan efektif dalam mendukung pencapaian sasaran pembangunan. Namun, KK berfokus pada efektivitas desain organisasi, sedangkan IPPN berfokus pada keselarasan perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas efektivitas penyederhanaan organisasi dan kesesuaian target kinerja instansi.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KU.2.2_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki irisan pada pemetaan tugas dan fungsi organisasi dengan sasaran pembangunan nasional, tetapi belum menunjukkan pengukuran yang sama. Indikator KK Pengelompokan Tugas dan Fungsi menilai apakah pembagian tugas antarunit sudah tepat, jelas, dan tidak saling tumpang tindih, sedangkan IPPN menilai apakah sasaran dan indikator prioritas pembangunan nasional telah diterjemahkan ke dalam IKU instansi. Keterkaitannya terletak pada pentingnya pembagian fungsi organisasi yang tepat agar setiap unit dapat berkontribusi terhadap pencapaian sasaran nasional. Namun, KK berfokus pada ketepatan pembagian fungsi antarunit, sementara IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas ketepatan pembagian fungsi organisasi dan keterkaitan sasaran nasional dengan IKU instansi.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KP.1.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling melengkapi dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Keterhubungan Proses Internal menilai sejauh mana proses kerja antarunit sudah terintegrasi, memiliki alur koordinasi dan serah-terima pekerjaan yang jelas, serta mampu mengurangi hambatan dan duplikasi pekerjaan. Sementara itu, IPPN menilai apakah sasaran dan indikator prioritas pembangunan nasional telah diterjemahkan ke dalam IKU instansi. Keterkaitannya terletak pada kebutuhan proses kerja yang terpadu agar kontribusi setiap unit dapat mendukung pencapaian sasaran nasional. Namun, KK berfokus pada keterpaduan proses kerja internal, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas integrasi proses kerja antarunit dan kesesuaian sasaran nasional dalam IKU instansi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.1.2_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling melengkapi dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Keterhubungan Proses Eksternal menilai sejauh mana koordinasi antarinstansi, pembagian peran, pertukaran informasi, dan kesinambungan layanan telah berjalan secara terpadu. Sementara itu, IPPN menilai apakah sasaran dan indikator prioritas pembangunan nasional telah diterjemahkan ke dalam IKU instansi. Keterkaitannya terletak pada pentingnya koordinasi lintas instansi agar kontribusi masing-masing pihak selaras dalam mencapai sasaran pembangunan nasional. Namun, KK berfokus pada keterpaduan proses kerja antarinstansi, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas efektivitas koordinasi lintas instansi dan kesesuaian sasaran nasional dalam IKU instansi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.2.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Mekanisme Pengambilan Keputusan Internal menilai apakah proses pengambilan keputusan dalam organisasi sudah memiliki tahapan, kewenangan, dukungan data, koordinasi, dan dokumentasi yang jelas. Sementara itu, IPPN menilai apakah sasaran dan indikator prioritas pembangunan nasional telah diterjemahkan ke dalam IKU instansi. Keterkaitannya terletak pada peran proses pengambilan keputusan yang baik dalam mendukung penetapan dan pencapaian sasaran organisasi. Namun, KK berfokus pada kualitas tata kelola pengambilan keputusan, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas kualitas mekanisme pengambilan keputusan dan kesesuaian sasaran nasional dalam IKU instansi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.2.2_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling melengkapi dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Mekanisme Pengambilan Keputusan Eksternal menilai sejauh mana keputusan yang melibatkan beberapa instansi dilakukan melalui koordinasi, kesepakatan, pembagian kewenangan, dan tindak lanjut yang jelas. Sementara itu, IPPN menilai apakah sasaran dan indikator prioritas pembangunan nasional telah diterjemahkan ke dalam IKU instansi. Keterkaitannya terletak pada pentingnya kesepakatan dan koordinasi lintas instansi agar setiap pihak memiliki arah dan kontribusi yang selaras dalam mencapai sasaran pembangunan. Namun, KK berfokus pada kualitas mekanisme pengambilan keputusan antarinstansi, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas mekanisme keputusan lintas instansi dan kesesuaian sasaran nasional dalam IKU instansi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.3.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki potensi tumpang tindih cukup tinggi karena sama-sama berkaitan dengan penetapan sasaran, indikator, dan target kinerja, tetapi fokus pengukurannya masih dapat dibedakan. Indikator KK Shared-Outcomes Internal menilai sejauh mana unit-unit dalam instansi memiliki sasaran bersama, indikator yang disepakati, dan pembagian kontribusi yang jelas untuk mencapai hasil organisasi. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran dan indikator prioritas pembangunan nasional ke dalam IKU instansi. Irisannya terletak pada penurunan sasaran dan indikator ke dalam target kinerja unit. Namun, KK berfokus pada kolaborasi dan pembagian kontribusi antarunit, sedangkan IPPN berfokus pada keselarasan sasaran nasional dalam dokumen perencanaan. Oleh karena itu, keduanya masih dapat dipertahankan sepanjang KK menilai tata kelola dan realisasi kolaborasi antarunit, sedangkan IPPN menilai kesesuaian formal penurunan target dan indikator nasional ke IKU instansi, tanpa menggunakan daftar IKU yang sama sebagai bukti penilaian ganda.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.KP.3.2_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki potensi tumpang tindih cukup tinggi karena sama-sama berkaitan dengan penetapan target dan indikator kinerja yang melibatkan kontribusi beberapa instansi. Indikator KK Shared-Outcomes Eksternal menilai sejauh mana instansi bersama mitra lintas instansi menetapkan tujuan, target, pembagian kontribusi, dan melaksanakan hasil yang disepakati. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran dan indikator prioritas pembangunan nasional ke dalam IKU instansi. Irisannya terletak pada penetapan target dan indikator bersama untuk mendukung pencapaian prioritas nasional. Namun, KK berfokus pada komitmen dan pelaksanaan kolaborasi lintas instansi, sedangkan IPPN berfokus pada keselarasan formal target dalam dokumen perencanaan. Oleh karena itu, keduanya masih dapat dipertahankan sepanjang KK menilai bukti nyata kolaborasi dan pembagian kontribusi antarinstansi, sedangkan IPPN menilai kesesuaian target dan indikator dalam dokumen perencanaan. Jika KK hanya menilai keberadaan target yang sama, perlu dilakukan penyesuaian agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.KP.3.3_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki potensi tumpang tindih cukup tinggi karena sama-sama menilai keselarasan sasaran, indikator, dan target dalam perencanaan. Indikator KK Sinkronisasi Perencanaan menilai sejauh mana sasaran, program, jadwal, dan sumber daya telah diselaraskan antarunit atau antarinstansi agar pelaksanaan berjalan terpadu. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran dan indikator prioritas pembangunan nasional ke dalam IKU instansi. Irisannya terletak pada upaya memastikan target dan indikator antarperencanaan tidak saling bertentangan dan mendukung prioritas nasional. Namun, KK berfokus pada proses dan mekanisme sinkronisasi perencanaan, sedangkan IPPN berfokus pada kesesuaian formal target dan indikator dalam dokumen perencanaan. Oleh karena itu, keduanya masih dapat dipertahankan sepanjang KK menilai mekanisme koordinasi dan penyelesaian ketidaksinkronan perencanaan, sedangkan IPPN menilai kesesuaian target dan satuan indikator secara formal, tanpa menghitung keselarasan target yang sama dua kali.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.TK.1.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Kebijakan menilai sejauh mana kebijakan internal terkait sistem kerja telah disusun, diterapkan, dan ditindaklanjuti untuk memperbaiki proses bisnis serta SOP organisasi. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran dan indikator prioritas pembangunan nasional ke dalam IKU instansi. Keterkaitannya terletak pada peran kebijakan dan sistem kerja yang baik dalam mendukung pencapaian sasaran pembangunan. Namun, KK berfokus pada kualitas kebijakan dan penerapannya dalam organisasi, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas kualitas penerapan kebijakan sistem kerja dan kesesuaian target kinerja instansi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.TK.1.2_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling melengkapi dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Tim Kerja Internal menilai sejauh mana tim kerja dalam organisasi dibentuk dengan pembagian peran dan tanggung jawab yang jelas, dilaksanakan secara efektif, serta dievaluasi secara berkala. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran dan indikator prioritas pembangunan nasional ke dalam IKU instansi. Keterkaitannya terletak pada peran tim kerja yang efektif dalam memastikan setiap unit dan pegawai berkontribusi terhadap pencapaian sasaran organisasi. Namun, KK berfokus pada efektivitas pembentukan dan pelaksanaan tim kerja, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas efektivitas tim kerja internal dan kesesuaian target kinerja instansi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.TK.1.3_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling melengkapi dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Tim Kerja Lintas Unit Organisasi menilai sejauh mana kerja sama antarunit dibangun melalui pembagian peran yang jelas, koordinasi yang efektif, pencapaian keluaran bersama, dan evaluasi pelaksanaan. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran dan indikator prioritas pembangunan nasional ke dalam IKU instansi. Keterkaitannya terletak pada peran kolaborasi lintas unit dalam menyatukan kontribusi organisasi untuk mencapai sasaran pembangunan. Namun, KK berfokus pada efektivitas kerja sama antarunit, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas efektivitas kolaborasi lintas unit dan kesesuaian target kinerja instansi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.TK.2.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Implementasi Budaya Kerja menilai sejauh mana nilai dan budaya kerja benar-benar diterapkan melalui pembinaan pegawai, keteladanan pimpinan, pengelolaan SDM, dan pembentukan perilaku kerja yang positif. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran dan indikator prioritas pembangunan nasional ke dalam IKU instansi. Keterkaitannya terletak pada peran budaya kerja yang baik dalam mendorong konsistensi dan kualitas pelaksanaan tugas untuk mencapai sasaran organisasi. Namun, KK berfokus pada internalisasi budaya dan perilaku kerja, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas penerapan budaya kerja dan kesesuaian target kinerja instansi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.TK.3.1_SS4-IPPN.3.a.1.b": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan tidak langsung dengan risiko redundansi rendah karena mengukur aspek yang berbeda. Indikator KK Implementasi Pengendalian Risiko menilai sejauh mana organisasi mampu mengidentifikasi, mengantisipasi, memantau, dan menindaklanjuti risiko yang dapat menghambat pelaksanaan tugas dan pencapaian target. Sementara itu, IPPN menilai kesesuaian penjabaran sasaran dan indikator prioritas pembangunan nasional ke dalam IKU instansi. Keterkaitannya terletak pada peran pengendalian risiko dalam menjaga agar pelaksanaan program tetap berjalan sesuai sasaran yang direncanakan. Namun, KK berfokus pada efektivitas pengendalian risiko organisasi, sedangkan IPPN berfokus pada keselarasan sasaran dalam perencanaan kinerja. Oleh karena itu, keduanya tetap perlu dipertahankan dengan membedakan penilaian atas penerapan pengendalian risiko dan kesesuaian target kinerja instansi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.1.1_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai kesesuaian tugas dan fungsi instansi dengan mandat serta kebutuhan organisasi, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Kesesuaian fungsi organisasi menjadi salah satu faktor yang mendukung pencapaian sasaran tersebut, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan capaian CKKP sebagai informasi pendukung, bukan dasar tunggal penilaian KK, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KF.1.2_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam pelaksanaan tugas dan fungsi organisasi, tetapi mengukur aspek yang berbeda. Indikator KK menilai sejauh mana tugas dan fungsi telah dilaksanakan oleh unit organisasi serta keterkaitannya dengan target instansi, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Pelaksanaan tugas dan fungsi yang baik dapat mendukung pencapaian sasaran strategis, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada pelaksanaan tugas dan fungsi, sementara CKKP menilai hasil yang dicapai, sehingga capaian kinerja tidak dihitung kembali dalam penilaian KK.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KF.2.1_SS4-CKKP.KP.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai kesesuaian pelaksanaan keputusan dengan batas dan mekanisme pendelegasian kewenangan, sedangkan CKKP mengukur pencapaian program dan kegiatan prioritas pembangunan. Pembagian kewenangan yang jelas dapat mendukung pelaksanaan program dan pencapaian target, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada tata kelola pendelegasian kewenangan, sementara CKKP menilai hasil kinerja yang dicapai, sehingga tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KF.2.2_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai sejauh mana pendelegasian kewenangan membantu kelancaran pelaksanaan tugas dan menjaga akuntabilitas, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Pendelegasian kewenangan yang berjalan baik dapat mendukung pencapaian sasaran organisasi, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada efektivitas pendelegasian kewenangan, sementara CKKP menilai hasil kinerja yang dicapai, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KF.3.1_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai kesesuaian fungsi unsur pembantu pimpinan dalam mendukung koordinasi, perumusan kebijakan, dan pelaksanaan tugas pimpinan, sedangkan CKKP melihat keberadaan indikator penugasan RKP pada instansi. Fungsi unsur pembantu pimpinan yang berjalan sesuai kebutuhan dapat mendukung pelaksanaan penugasan, tetapi tidak secara langsung menunjukkan pencapaian kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada kesesuaian fungsi unsur pembantu pimpinan, sementara CKKP menilai keberadaan indikator penugasan RKP, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KF.3.2_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai kesesuaian fungsi unsur pembantu pimpinan dalam mendukung koordinasi, perumusan kebijakan, dan pelaksanaan tugas pimpinan, sedangkan CKKP melihat keberadaan indikator penugasan RKP pada instansi. Fungsi unsur pembantu pimpinan yang berjalan sesuai kebutuhan dapat mendukung pelaksanaan penugasan, tetapi tidak secara langsung menunjukkan pencapaian kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada kesesuaian fungsi unsur pembantu pimpinan, sementara CKKP menilai keberadaan indikator penugasan RKP, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KF.3.3_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai kesesuaian fungsi layanan pendukung dengan kebutuhan organisasi dan kelancaran tugas utama, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Layanan pendukung yang sesuai kebutuhan dapat membantu kelancaran pelaksanaan tugas dan mendukung pencapaian sasaran organisasi, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada kesesuaian fungsi layanan pendukung, sementara CKKP menilai hasil kinerja yang dicapai, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KU.1.1_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai keseimbangan pembagian beban kerja antarunit sesuai volume, kompleksitas, dan kebutuhan pekerjaan, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Pembagian beban kerja yang seimbang dapat mendukung kelancaran pelaksanaan tugas dan pencapaian kinerja organisasi, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada keseimbangan beban kerja, sementara CKKP menilai hasil kinerja yang dicapai, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KU.1.2_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai kecukupan anggaran unit kerja dibandingkan dengan beban kerja, target keluaran, dan kebutuhan pelaksanaan tugas. Sementara itu, CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga melalui IKSS. Alokasi anggaran yang memadai dapat mendukung pencapaian kinerja, tetapi tidak secara langsung menunjukkan keberhasilan sasaran strategis. Oleh karena itu, relasi keduanya dikategorikan Mendukung. Penilaian KK perlu berfokus pada kecukupan dan kesesuaian alokasi anggaran, sedangkan CKKP menilai capaian IKSS agar tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "Pisahkan kecukupan alokasi (KK), alignment prioritas (IPPN), anggaran berbasis kinerja (SAKIP), kualitas proses satker (IKPA). CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KU.1.3_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai kesesuaian jumlah dan kompetensi pegawai dengan kebutuhan serta beban kerja setiap unit organisasi. Sementara itu, CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga melalui IKSS. Distribusi SDM yang tepat dapat mendukung pencapaian kinerja organisasi, tetapi tidak secara langsung menunjukkan keberhasilan sasaran strategis. Oleh karena itu, relasi keduanya dikategorikan Mendukung. Penilaian KK perlu berfokus pada kecukupan dan kesesuaian distribusi pegawai, sedangkan CKKP menilai capaian IKSS agar tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KU.2.1_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan, tetapi fokus penilaiannya berbeda. Indikator KK menilai dampak penyederhanaan struktur organisasi terhadap kejelasan tanggung jawab, koordinasi, dan efisiensi kerja. Sementara itu, CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga melalui IKSS. Penyederhanaan struktur yang tepat dapat mendukung peningkatan kinerja organisasi, tetapi tidak otomatis menjamin tercapainya sasaran strategis. Oleh karena itu, relasi keduanya dikategorikan Mendukung. Penilaian KK perlu berfokus pada perubahan struktur dan dampaknya terhadap efektivitas kerja, sedangkan CKKP menilai capaian IKSS, sehingga peningkatan IKSS tidak dihitung kembali sebagai bukti skor penyederhanaan.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KU.2.2_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai ketepatan pembagian tugas dan fungsi antarunit agar tidak terjadi tumpang tindih pekerjaan. Sementara itu, CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga melalui IKSS. Pembagian tugas yang jelas dapat mendukung pencapaian kinerja organisasi, tetapi tidak secara langsung menunjukkan tingkat keberhasilannya. Oleh karena itu, relasi keduanya dikategorikan Mendukung. Penilaian KK perlu berfokus pada ketepatan pembagian tugas dan fungsi, sedangkan CKKP menilai capaian IKSS agar tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KP.1.1_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai keterpaduan proses kerja di dalam instansi, termasuk koordinasi antarunit, pembagian alur kerja, dan kelancaran serah terima pekerjaan. Sementara itu, CKKP menilai keberadaan indikator penugasan RKP pada instansi. Proses kerja internal yang terpadu dapat mendukung pelaksanaan penugasan RKP, tetapi tidak secara langsung menunjukkan keberadaan indikator tersebut. Oleh karena itu, relasi keduanya dikategorikan Mendukung. Penilaian KK perlu berfokus pada keterpaduan dan kelancaran proses kerja antarunit, sedangkan CKKP menilai keberadaan indikator penugasan RKP agar tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KP.1.2_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai keterpaduan proses kerja antarinstansi, termasuk pembagian peran, pertukaran informasi, koordinasi, dan kesinambungan layanan. Sementara itu, CKKP menilai keberadaan indikator penugasan RKP pada instansi. Keterhubungan proses kerja yang baik dapat mendukung pelaksanaan penugasan RKP, tetapi tidak secara langsung menunjukkan keberadaan indikator tersebut. Oleh karena itu, relasi keduanya dikategorikan Mendukung. Penilaian KK perlu berfokus pada kualitas koordinasi dan keterpaduan proses antarinstansi, sedangkan CKKP menilai keberadaan indikator penugasan RKP agar tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KP.2.1_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai kualitas proses pengambilan keputusan di dalam instansi, mulai dari kejelasan kewenangan, penggunaan data, koordinasi, hingga dokumentasi keputusan. Sementara itu, CKKP menilai keberadaan indikator penugasan RKP pada instansi. Mekanisme pengambilan keputusan internal yang baik dapat mendukung pelaksanaan penugasan RKP, tetapi tidak secara langsung menunjukkan keberadaan indikator tersebut. Oleh karena itu, relasi keduanya dikategorikan Mendukung. Penilaian KK perlu didasarkan pada bukti kualitas proses pengambilan keputusan, sedangkan CKKP menilai keberadaan indikator penugasan RKP agar tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KP.2.2_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai mekanisme pengambilan keputusan antarinstansi, termasuk koordinasi, pembagian kewenangan, kesepakatan, dan tindak lanjut keputusan, sedangkan CKKP melihat keberadaan indikator penugasan RKP pada instansi. Mekanisme pengambilan keputusan yang baik dapat mendukung kelancaran pelaksanaan penugasan, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada kualitas koordinasi dan proses pengambilan keputusan antarinstansi, sementara CKKP menilai keberadaan indikator penugasan RKP, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KP.3.1_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai penetapan tujuan bersama dan pembagian kontribusi antarunit dalam mencapai hasil organisasi, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Kesepakatan tujuan dan pembagian peran yang jelas dapat mendukung pencapaian sasaran organisasi, tetapi tidak secara langsung menunjukkan hasil kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada proses kerja sama dan pembagian kontribusi antarunit, sementara CKKP menilai hasil yang dicapai, sehingga angka capaian kinerja tidak digunakan berulang sebagai bukti kedua indikator.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KP.3.2_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang cukup kuat, tetapi mengukur aspek yang berbeda. Indikator KK menilai kesepakatan tujuan, pembagian peran, dan pelaksanaan kerja sama antarinstansi untuk mencapai hasil bersama, sedangkan CKKP melihat keberadaan indikator penugasan RKP pada instansi. Kerja sama yang terencana dan terkoordinasi dapat mendukung pencapaian target bersama, tetapi tidak cukup hanya dibuktikan dengan keberadaan indikator penugasan. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada kualitas kerja sama dan pembagian kontribusi antarinstansi, sementara CKKP menilai keberadaan indikator penugasan RKP, sehingga tidak terjadi penghitungan berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KP.3.3_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam proses perencanaan, tetapi mengukur aspek yang berbeda. Indikator KK menilai keselarasan rencana antarunit, mulai dari sasaran, target, program, hingga sumber daya, sedangkan CKKP melihat keberadaan indikator penugasan RKP pada instansi. Perencanaan yang selaras dapat mendukung pelaksanaan penugasan, tetapi tidak secara langsung menunjukkan keberadaan maupun pencapaian indikator tersebut. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada keselarasan proses perencanaan, sementara CKKP menilai keberadaan indikator penugasan RKP, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.TK.1.1_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai ketersediaan dan penerapan kebijakan sistem kerja, termasuk perbaikan proses kerja dan SOP, sedangkan CKKP melihat keberadaan indikator penugasan RKP pada instansi. Kebijakan sistem kerja yang jelas dan diterapkan dengan baik dapat mendukung kelancaran pelaksanaan penugasan, tetapi tidak secara langsung menunjukkan pencapaian kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada kebijakan dan penerapan sistem kerja, sementara CKKP menilai keberadaan indikator penugasan RKP, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.TK.1.2_SS4-CKKP.KP.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai pembentukan dan pelaksanaan tim kerja internal melalui pembagian peran, pencapaian hasil, dan evaluasi berkala, sedangkan CKKP melihat keberadaan indikator penugasan RKP pada instansi. Tim kerja yang terbentuk dan berjalan dengan baik dapat mendukung pelaksanaan penugasan, tetapi tidak secara langsung menunjukkan pencapaian kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada efektivitas tim kerja internal, sementara CKKP menilai keberadaan indikator penugasan RKP, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.TK.1.3_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai pembentukan dan efektivitas tim lintas unit melalui kejelasan peran, koordinasi, dan hasil kerja, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Kerja sama yang baik antarunit dapat memperlancar pelaksanaan tugas dan mendukung pencapaian sasaran organisasi, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada efektivitas kerja sama lintas unit, sementara CKKP menilai hasil kinerja yang dicapai, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.TK.2.1_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai penerapan budaya kerja melalui pembiasaan perilaku positif, keteladanan pimpinan, dan pengelolaan SDM, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Budaya kerja yang diterapkan secara konsisten dapat mendorong kinerja pegawai dan mendukung pencapaian sasaran organisasi, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada penerapan budaya kerja, sementara CKKP menilai hasil kinerja yang dicapai, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.TK.3.1_SS4-CKKP.KO.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator saling berkaitan, tetapi mengukur aspek yang berbeda. Indikator KK menilai penerapan pengendalian risiko melalui identifikasi, pencegahan, pemantauan, dan tindak lanjut risiko, sedangkan CKKP mengukur pencapaian sasaran strategis Kementerian/Lembaga. Pengendalian risiko yang berjalan baik dapat membantu menjaga kelancaran pelaksanaan tugas dan mendukung pencapaian sasaran organisasi, tetapi tidak secara langsung menunjukkan keberhasilan kinerja. Oleh karena itu, relasi keduanya dikategorikan Mendukung, dengan penilaian KK berfokus pada penerapan pengendalian risiko, sementara CKKP menilai hasil kinerja yang dicapai, sehingga tidak terjadi penilaian berulang terhadap aspek yang sama.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. CKKP mengukur hasil/kontribusi; KK tetap mengukur faktor enabler, bukan mengulang capaian."
        },
        "SS4-KK.KF.1.1_SS4-SPIP.SP.KP.3.6": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam memastikan kejelasan fungsi dan pembagian peran organisasi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Relevansi” (SS4-KK.KF.1.1) menilai kesesuaian tugas dan fungsi instansi dengan mandat serta kebutuhan organisasi, sedangkan indikator SPIP (SS4-SPIP.SP.KP.3.6) menilai pemisahan fungsi untuk mencegah tumpang tindih tugas dan memperkuat pengendalian intern. Kejelasan mandat dan fungsi organisasi dapat mendukung penerapan pemisahan fungsi yang baik, tetapi tidak secara langsung menunjukkan bahwa pemisahan fungsi telah berjalan efektif. Oleh karena itu, keduanya tetap perlu dinilai secara terpisah berdasarkan kriteria masing-masing.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.1.2_SS4-SPIP.SP.LP.1.4": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam memastikan kesesuaian fungsi dan struktur organisasi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Implementasi” (SS4-KK.KF.1.2) menilai sejauh mana tugas dan fungsi telah dijalankan oleh setiap unit organisasi serta kontribusinya terhadap pencapaian target instansi. Sementara itu, indikator SPIP (SS4-SPIP.SP.LP.1.4) menilai kesesuaian struktur organisasi dengan kebutuhan pengendalian. Struktur organisasi yang tepat dapat mendukung pelaksanaan tugas dan fungsi secara efektif, tetapi keberadaan struktur yang sesuai belum tentu menunjukkan bahwa tugas dan fungsi telah dijalankan dengan baik. Oleh karena itu, keduanya perlu dinilai secara terpisah berdasarkan pelaksanaan fungsi dan kesesuaian struktur organisasi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.2.1_SS4-SPIP.SP.LP.1.5": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang sangat erat karena sama-sama menilai pendelegasian wewenang dan tanggung jawab dalam organisasi. Indikator KK “Delegasi Kewenangan” (SS4-KK.KF.2.1) menilai kesesuaian pelaksanaan keputusan pada setiap jenjang dengan batas kewenangan dan mekanisme pendelegasian, sedangkan indikator SPIP (SS4-SPIP.SP.LP.1.5) menilai ketepatan pendelegasian wewenang dan tanggung jawab. Kesamaan fokus tersebut menimbulkan potensi penilaian ganda, terutama jika menggunakan dokumen delegasi atau SOP yang sama. Oleh karena itu, SPIP dapat menjadi acuan penilaian ketepatan pendelegasian sebagai bagian dari pengendalian intern, sedangkan KK difokuskan pada kesesuaian pembagian kewenangan dengan fungsi dan kebutuhan organisasi.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi."
        },
        "SS4-KK.KF.2.2_SS4-SPIP.PT.EE.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam mendukung kelancaran pelaksanaan tugas dan pencapaian tujuan organisasi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Implementasi” (SS4-KK.KF.2.2) menilai sejauh mana pendelegasian kewenangan mendukung kelancaran tugas, pembagian tanggung jawab, dan akuntabilitas. Sementara itu, indikator SPIP (SS4-SPIP.PT.EE.1.1) menilai efektivitas dan efisiensi pencapaian tujuan organisasi. Pendelegasian kewenangan yang tepat dapat mendukung pencapaian tujuan organisasi, tetapi tidak secara langsung menunjukkan bahwa tujuan tersebut telah tercapai secara efektif dan efisien. Oleh karena itu, kedua indikator perlu dinilai secara terpisah sesuai fokus masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.3.1_SS4-SPIP.SP.KP.3.6": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam memastikan kejelasan fungsi dan pembagian peran dalam organisasi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Relevansi Unsur Pembantu Pemimpin” (SS4-KK.KF.3.1) menilai kesesuaian fungsi unsur pembantu pimpinan dalam mendukung koordinasi, perumusan kebijakan, dan pelaksanaan tugas pimpinan. Sementara itu, indikator SPIP (SS4-SPIP.SP.KP.3.6) menilai pemisahan fungsi untuk memperkuat pengendalian intern dan mencegah tumpang tindih tanggung jawab. Pembagian fungsi yang jelas dapat mendukung pemisahan fungsi yang baik, tetapi kesesuaian fungsi unsur pembantu pimpinan tidak secara langsung menunjukkan efektivitas pengendalian intern. Oleh karena itu, kedua indikator perlu dinilai secara terpisah berdasarkan fokus masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KF.3.2_SS4-SPIP.SP.KP.3.6": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam memastikan fungsi pengawasan berjalan dengan baik, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Relevansi Unsur Pengawas” (SS4-KK.KF.3.2) menilai kesesuaian tugas dan kemampuan unsur pengawas dalam melaksanakan pemantauan, reviu, dan evaluasi organisasi. Sementara itu, indikator SPIP (SS4-SPIP.SP.KP.3.6) menilai pemisahan fungsi untuk memastikan pengawasan berjalan secara tepat dan tidak menimbulkan benturan kepentingan. Keberadaan unsur pengawas yang sesuai dengan kebutuhan organisasi dapat mendukung pengendalian intern, tetapi tidak secara langsung menjamin pemisahan fungsi telah berjalan dengan baik. Oleh karena itu, KK perlu berfokus pada kesesuaian tugas dan pelaksanaan fungsi pengawasan, sedangkan SPIP berfokus pada pemisahan fungsi dan kecukupan pengendalian intern.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi."
        },
        "SS4-KK.KF.3.3_SS4-SPIP.PT.EE.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam mendukung kelancaran pelaksanaan tugas dan pencapaian tujuan organisasi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Relevansi Unsur Pendukung” (SS4-KK.KF.3.3) menilai kesesuaian fungsi layanan pendukung dengan kebutuhan organisasi dan pelaksanaan tugas utama. Sementara itu, indikator SPIP (SS4-SPIP.PT.EE.1.1) menilai efektivitas dan efisiensi pencapaian tujuan organisasi. Layanan pendukung yang sesuai dengan kebutuhan organisasi dapat membantu pencapaian tujuan secara lebih baik, tetapi tidak secara langsung menunjukkan bahwa tujuan tersebut telah tercapai secara efektif dan efisien. Oleh karena itu, kedua indikator perlu dinilai secara terpisah sesuai fokus masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan."
        },
        "SS4-KK.KU.1.1_SS4-SPIP.SP.LP.1.8": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang terbatas karena menilai aspek pengelolaan organisasi yang berbeda. Indikator KK “Distribusi Beban Kerja” (SS4-KK.KU.1.1) menilai keseimbangan pembagian beban kerja antarunit berdasarkan volume, tingkat kesulitan, dan kebutuhan pekerjaan. Sementara itu, indikator SPIP (SS4-SPIP.SP.LP.1.8) menilai kualitas hubungan kerja dengan instansi pemerintah terkait. Distribusi beban kerja yang seimbang dapat mendukung kelancaran pelaksanaan tugas organisasi, tetapi tidak secara langsung mencerminkan kualitas hubungan kerja antarinstansi. Oleh karena itu, kedua indikator perlu dinilai secara terpisah berdasarkan bukti yang sesuai dengan fokus masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan."
        },
        "SS4-KK.KU.1.2_SS4-SPIP.SP.LP.1.4": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam memastikan kesiapan organisasi menjalankan tugasnya, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Alokasi Anggaran” (SS4-KK.KU.1.2) menilai kecukupan anggaran setiap unit berdasarkan beban kerja, keluaran, dan kebutuhan pelaksanaan tugas. Sementara itu, indikator SPIP (SS4-SPIP.SP.LP.1.4) menilai kesesuaian struktur organisasi dengan kebutuhan pengendalian. Struktur organisasi yang sesuai dapat mendukung pengelolaan anggaran dan pelaksanaan tugas secara lebih terarah, tetapi tidak secara langsung menunjukkan bahwa anggaran yang tersedia telah mencukupi kebutuhan unit. Oleh karena itu, kedua indikator perlu dinilai secara terpisah berdasarkan kecukupan anggaran dan kesesuaian struktur organisasi agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "Pisahkan kecukupan alokasi (KK), alignment prioritas (IPPN), anggaran berbasis kinerja (SAKIP), kualitas proses satker (IKPA)."
        },
        "SS4-KK.KU.1.3_SS4-SPIP.SP.KP.3.2": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam memastikan ketersediaan dan kemampuan sumber daya manusia untuk mendukung pelaksanaan tugas organisasi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Distribusi Sumber Daya Manusia” (SS4-KK.KU.1.3) menilai kesesuaian jumlah dan kompetensi pegawai dengan kebutuhan serta beban kerja setiap unit. Sementara itu, indikator SPIP (SS4-SPIP.SP.KP.3.2) menilai pembinaan sumber daya manusia untuk mendukung pengendalian intern. Ketersediaan pegawai dengan jumlah dan kompetensi yang sesuai dapat mendukung pembinaan SDM yang efektif, tetapi tidak secara langsung menunjukkan bahwa pembinaan tersebut telah berjalan dengan baik. Oleh karena itu, KK perlu berfokus pada kecukupan dan pemerataan pegawai, sedangkan SPIP berfokus pada pembinaan dan pengembangan kompetensi SDM agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KU.2.1_SS4-SPIP.PT.EE.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam mendorong efisiensi dan efektivitas organisasi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Penyederhanaan” (SS4-KK.KU.2.1) menilai dampak penyederhanaan struktur organisasi terhadap kejelasan tanggung jawab, koordinasi, kecepatan proses, dan pengurangan pekerjaan yang tumpang tindih. Sementara itu, indikator SPIP (SS4-SPIP.PT.EE.1.1) menilai efektivitas dan efisiensi pencapaian tujuan organisasi. Penyederhanaan struktur dapat mendukung peningkatan kinerja organisasi, tetapi perubahan struktur saja belum menjamin tercapainya tujuan secara efektif dan efisien. Oleh karena itu, KK perlu berfokus pada dampak perubahan struktur, sedangkan SPIP menilai hasil pencapaian tujuan organisasi agar tidak terjadi tumpang tindih penilaian.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KU.2.2_SS4-SPIP.SP.KP.3.6": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang erat karena sama-sama menilai pembagian tugas dan fungsi dalam organisasi, tetapi dari sudut pandang yang berbeda. Indikator KK “Pengelompokan Tugas dan Fungsi” (SS4-KK.KU.2.2) menilai ketepatan pengelompokan tugas antarunit agar tidak terjadi tumpang tindih pekerjaan, sedangkan indikator SPIP (SS4-SPIP.SP.KP.3.6) menilai pemisahan fungsi untuk memperkuat pengendalian dan mencegah penyalahgunaan kewenangan. Pembagian tugas yang tepat mendukung pemisahan fungsi yang baik, sehingga keduanya memiliki keterkaitan yang kuat. Namun, KK perlu berfokus pada ketepatan desain pembagian tugas antarunit, sedangkan SPIP berfokus pada pemisahan kewenangan sebagai bentuk pengendalian intern agar tidak terjadi penilaian ganda.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KP.1.1_SS4-SPIP.SP.LP.1.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang terbatas karena menilai aspek yang berbeda dalam tata kelola organisasi. Indikator KK “Keterhubungan Proses Internal” (SS4-KK.KP.1.1) menilai keterpaduan proses kerja antarunit, termasuk alur kerja, pembagian hasil pekerjaan, dan upaya mengurangi hambatan atau pekerjaan berulang. Sementara itu, indikator SPIP (SS4-SPIP.SP.LP.1.1) menilai penerapan integritas dan nilai etika dalam lingkungan kerja. Proses kerja yang terhubung dengan baik dapat mendukung penerapan nilai etika dalam organisasi, tetapi tidak secara langsung menunjukkan bahwa integritas dan etika telah diterapkan. Oleh karena itu, kedua indikator perlu dinilai secara terpisah berdasarkan fokus masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.1.2_SS4-SPIP.SP.LP.1.8": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang erat karena sama-sama menilai hubungan dan koordinasi kerja antarinstansi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Keterhubungan Proses Eksternal” (SS4-KK.KP.1.2) menilai keterpaduan proses kerja lintas instansi, termasuk pembagian peran, pertukaran informasi, dan kesinambungan layanan. Sementara itu, indikator SPIP (SS4-SPIP.SP.LP.1.8) menilai kualitas hubungan kerja dengan instansi pemerintah terkait sebagai bagian dari lingkungan pengendalian. Hubungan kerja yang baik dapat mendukung kelancaran proses lintas instansi, tetapi belum tentu menunjukkan bahwa proses dan layanan telah terintegrasi dengan baik. Oleh karena itu, KK perlu berfokus pada keterpaduan proses kerja lintas instansi, sedangkan SPIP menilai kualitas hubungan kerja untuk mendukung pengendalian intern agar tidak terjadi penilaian ganda.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.2.1_SS4-SPIP.SP.KP.3.11": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam memastikan proses pengambilan keputusan berjalan tertib dan dapat dipertanggungjawabkan, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Mekanisme Pengambilan Keputusan Internal” (SS4-KK.KP.2.1) menilai kejelasan proses pengambilan keputusan, mulai dari tahapan, kewenangan, penggunaan data, koordinasi, hingga pencatatan keputusan. Sementara itu, indikator SPIP (SS4-SPIP.SP.KP.3.11) menilai kelengkapan dokumentasi pengendalian intern, transaksi, dan kejadian penting. Dokumentasi keputusan yang baik dapat mendukung pengendalian intern, tetapi keberadaan dokumen saja belum menunjukkan bahwa proses pengambilan keputusan telah berjalan dengan baik. Oleh karena itu, KK perlu berfokus pada kualitas mekanisme pengambilan keputusan, sedangkan SPIP berfokus pada kecukupan dokumentasi sebagai bukti pengendalian agar tidak terjadi penilaian ganda.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.2.2_SS4-SPIP.PT.KTP.1.2": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan secara kontekstual, tetapi tidak mengukur aspek yang sama. Indikator KK “Mekanisme Pengambilan Keputusan Eksternal” (SS4-KK.KP.2.2) menilai bagaimana proses pengambilan keputusan antarinstansi dilaksanakan, termasuk koordinasi, kesepakatan, pembagian kewenangan, dan tindak lanjut keputusan. Sementara itu, indikator SPIP (SS4-SPIP.PT.KTP.1.2) berfokus pada keterjadian tindak pidana korupsi sebagai gambaran hasil integritas. Mekanisme keputusan eksternal yang tertata dapat mendukung tata kelola yang baik dan mengurangi risiko penyimpangan, tetapi tidak secara langsung menunjukkan ada atau tidaknya tindak pidana korupsi. Oleh karena itu, KK perlu tetap menilai kualitas proses koordinasi dan pengambilan keputusan antarinstansi, sedangkan SPIP menilai kejadian korupsi sebagai hasil integritas, sehingga keduanya tidak digunakan untuk saling menggantikan atau menilai bukti yang sama.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.3.1_SS4-SPIP.SP.KP.3.5": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki kesamaan fokus pada penetapan sasaran dan indikator kinerja, sehingga terdapat potensi tumpang tindih dalam pengukurannya. Indikator KK “Shared-Outcomes Internal” menilai proses penetapan hasil bersama, penyusunan indikator bersama, serta pembagian kontribusi antarunit dalam mencapai sasaran organisasi. Sementara itu, indikator SPIP menilai penetapan dan reviu indikator serta ukuran kinerja sebagai bagian dari pengendalian kinerja. Keduanya berkaitan erat pada aspek penetapan sasaran dan indikator, tetapi memiliki penekanan yang berbeda. Oleh karena itu, KK sebaiknya berfokus pada tata kelola hasil bersama dan kolaborasi antarunit, sedangkan SPIP berfokus pada penetapan serta reviu indikator dan ukuran kinerja. Relasi Langsung ditetapkan karena terdapat kedekatan objek ukur yang berpotensi menimbulkan tumpang tindih, meskipun kesamaan operasionalnya masih perlu diverifikasi melalui rumus, unit analisis, periode, dan sumber bukti yang digunakan.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.KP.3.2_SS4-SPIP.SP.LP.1.8": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam koordinasi antarinstansi, tetapi mengukur aspek yang berbeda. Indikator KK “Shared-Outcomes Eksternal” (SS4-KK.KP.3.2) menilai bagaimana instansi menetapkan tujuan dan target bersama serta membagi kontribusi untuk mencapai hasil lintas instansi. Sementara itu, indikator SPIP menilai kualitas hubungan kerja dengan instansi pemerintah terkait sebagai bagian dari pengendalian intern. Dengan demikian, hubungan kerja yang baik dapat mendukung tercapainya hasil bersama, tetapi tidak serta-merta menunjukkan bahwa tujuan dan target bersama telah tercapai. Kedua indikator tetap perlu dipertahankan karena memiliki fokus pengukuran yang berbeda.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.KP.3.3_SS4-SPIP.SP.KP.3.2": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang terbatas karena berfokus pada aspek yang berbeda. Indikator KK “Sinkronisasi Perencanaan” (SS4-KK.KP.3.3) menilai keselarasan sasaran, target, program, jadwal, dan sumber daya dalam proses perencanaan, sedangkan indikator SPIP (SS4-SPIP.SP.KP.3.2) menilai pembinaan sumber daya manusia. Keterkaitan keduanya hanya terlihat pada aspek keteraturan proses dan pengelolaan organisasi, tetapi pembinaan SDM tidak secara langsung menunjukkan keselarasan perencanaan. Oleh karena itu, kedua indikator perlu dinilai secara terpisah dengan bukti yang sesuai dengan fokus masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.TK.1.1_SS4-SPIP.SP.LP.1.6": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan pada aspek kebijakan internal yang mendukung tata kelola organisasi, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Kebijakan” (SS4-KK.TK.1.1) menilai kualitas kebijakan sistem kerja serta penerapannya dalam mendorong perbaikan proses bisnis dan SOP, sedangkan indikator SPIP (SS4-SPIP.SP.LP.1.6) menilai penyusunan dan penerapan kebijakan pembinaan sumber daya manusia. Kebijakan pembinaan SDM dapat mendukung pelaksanaan sistem kerja yang baik, tetapi tidak secara langsung menunjukkan kematangan kebijakan sistem kerja. Oleh karena itu, keduanya tetap dinilai secara terpisah berdasarkan substansi kebijakan masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.TK.1.2_SS4-SPIP.SP.LP.1.8": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang terbatas karena menilai aspek yang berbeda dalam pengelolaan organisasi. Indikator KK “Tim Kerja Internal” (SS4-KK.TK.1.2) menilai pembentukan tim kerja, pembagian peran, pelaksanaan tugas, serta evaluasi kinerja tim di dalam organisasi. Sementara itu, indikator SPIP (SS4-SPIP.SP.LP.1.8) menilai kualitas hubungan kerja dengan instansi pemerintah lain. Keterkaitan keduanya hanya terlihat pada aspek kerja sama dan koordinasi, tetapi pembentukan tim internal tidak secara langsung mencerminkan kualitas hubungan kerja antarinstansi. Oleh karena itu, keduanya perlu dinilai secara terpisah berdasarkan bukti yang sesuai agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.TK.1.3_SS4-SPIP.SP.LP.1.8": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan dalam aspek koordinasi dan kerja sama, tetapi memiliki fokus penilaian yang berbeda. Indikator KK “Tim Kerja Lintas Unit Organisasi” (SS4-KK.TK.1.3) menilai pembentukan dan efektivitas tim yang melibatkan berbagai unit dalam organisasi, termasuk pembagian peran, koordinasi, dan hasil kerja. Sementara itu, indikator SPIP (SS4-SPIP.SP.LP.1.8) menilai kualitas hubungan kerja dengan instansi pemerintah terkait. Kerja sama yang baik dengan instansi lain dapat mendukung efektivitas tim lintas unit, tetapi tidak secara langsung menunjukkan keberhasilan pembentukan dan pelaksanaan tim tersebut. Oleh karena itu, keduanya perlu dinilai secara terpisah sesuai fokus masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.TK.2.1_SS4-SPIP.SP.LP.1.8": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang terbatas karena berfokus pada aspek pengelolaan organisasi yang berbeda. Indikator KK “Implementasi” (SS4-KK.TK.2.1) menilai penerapan budaya kerja melalui pembinaan, keteladanan pimpinan, pengelolaan SDM, dan pembentukan perilaku kerja. Sementara itu, indikator SPIP (SS4-SPIP.SP.LP.1.8) menilai kualitas hubungan kerja dengan instansi pemerintah terkait. Budaya kerja yang baik dapat mendukung hubungan kerja yang positif, tetapi tidak secara langsung menunjukkan kualitas hubungan antarinstansi. Oleh karena itu, kedua indikator perlu dinilai secara terpisah berdasarkan bukti yang sesuai dengan fokus masing-masing agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.TK.3.1_SS4-SPIP.SP.PR.2.1": {
            "jenis": "Mendukung",
            "alasan": "Kedua indikator memiliki keterkaitan yang sangat erat karena sama-sama menilai penerapan pengendalian risiko dalam organisasi. Indikator KK “Implementasi” (SS4-KK.TK.3.1) menilai penerapan kebijakan pengendalian risiko, mulai dari identifikasi, mitigasi, pemantauan, hingga tindak lanjut risiko. Sementara itu, indikator SPIP (SS4-SPIP.SP.PR.2.1) secara khusus menilai proses identifikasi risiko sebagai bagian dari penilaian risiko. Dengan demikian, terdapat potensi tumpang tindih dalam penggunaan bukti dan penilaian, terutama pada identifikasi serta penanganan risiko. Untuk menghindari penilaian ganda, SPIP sebaiknya menjadi acuan penilaian proses pengelolaan risiko, sedangkan KK difokuskan pada sejauh mana kebijakan risiko telah terintegrasi dalam tata kelola organisasi dan pembagian tanggung jawab pengelolaan risiko.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.1.1_SS4-SAKIP.1.2.9": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan dalam melihat penerapan tugas dan fungsi unit organisasi terhadap target kinerja. Namun, fokus pengukurannya berbeda. Indikator KK menilai sejauh mana tugas dan fungsi telah dilaksanakan oleh unit organisasi, sedangkan indikator SAKIP menilai keterkaitan tugas dan fungsi tersebut dengan strategi, aktivitas, dan target dalam perencanaan kinerja. Penjelasan dan bukti objektif: Keduanya memiliki kesamaan dalam melihat hubungan antara tugas dan fungsi dengan kinerja organisasi. Perbedaannya, KK berfokus pada pelaksanaan fungsi organisasi, sementara SAKIP berfokus pada keterpaduan perencanaan kinerja. Oleh karena itu, keduanya belum dapat dinyatakan mengukur hal yang sama sepenuhnya. Solusi/langkah selanjutnya: Perlu diperjelas batas pengukuran masing-masing indikator. KK mengukur pelaksanaan tugas dan fungsi unit organisasi, sedangkan SAKIP mengukur keterkaitannya dengan perencanaan kinerja. Capaian target SAKIP tidak cukup digunakan sebagai satu-satunya bukti bahwa tugas dan fungsi telah dilaksanakan.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.1.2_SS4-SAKIP.1.2.9": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan dalam melihat hubungan antara pelaksanaan tugas dan fungsi unit organisasi dengan target kinerja, tetapi memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai sejauh mana tugas dan fungsi telah dilaksanakan oleh unit organisasi, sedangkan indikator SAKIP menilai keterkaitan tugas dan fungsi tersebut dengan strategi, aktivitas, dan target dalam perencanaan kinerja. Keduanya memiliki irisan pengukuran, tetapi belum tentu mengukur hal yang sama sepenuhnya. Solusi/langkah selanjutnya: Perlu diperjelas batas pengukuran masing-masing indikator. KK berfokus pada pelaksanaan tugas dan fungsi unit organisasi, sedangkan SAKIP berfokus pada keterpaduan perencanaan kinerja. Capaian target SAKIP tidak dapat dijadikan satu-satunya bukti pelaksanaan tugas dan fungsi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.2.1_SS4-SAKIP.2.1.3": {
            "jenis": "Mendukung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang. Masing-masing tetap memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK mengukur kepatuhan pengambilan keputusan pada setiap jenjang sesuai batas dan mekanisme pelimpahan kewenangan. Sementara itu, indikator SAKIP menilai kejelasan mekanisme pengumpulan data kinerja yang dapat diandalkan. Keterkaitan keduanya berada pada aspek tata kelola organisasi dalam mendukung pencapaian sasaran kinerja, tetapi objek yang diukur tidak sama. Solusi/langkah selanjutnya: KK perlu berfokus pada kejelasan dan pelaksanaan pelimpahan kewenangan, sedangkan SAKIP berfokus pada keandalan mekanisme pengumpulan data kinerja. Pengukuran dan bukti pendukung keduanya perlu dibedakan agar tidak terjadi pengulangan penilaian terhadap aspek yang berbeda.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi."
        },
        "SS4-KK.KF.2.2_SS4-SAKIP.4.3.4": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang, karena masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK mengukur sejauh mana pelimpahan kewenangan mendukung kelancaran pelaksanaan tugas, akuntabilitas, dan kinerja organisasi. Sementara itu, indikator SAKIP mengukur pemanfaatan hasil evaluasi internal untuk meningkatkan efektivitas dan efisiensi kinerja. Keduanya sama-sama berkaitan dengan peningkatan kinerja organisasi, tetapi memiliki aspek yang diukur berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada pelaksanaan pelimpahan kewenangan dalam mendukung tugas dan kinerja organisasi, sedangkan SAKIP berfokus pada pemanfaatan hasil evaluasi untuk perbaikan kinerja. Bukti dan metode pengukuran masing-masing perlu dibedakan agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.3.1_SS4-SAKIP.1.2.9": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan dalam aspek koordinasi dan hubungan kerja antarbidang, tetapi belum dapat dikatakan mengukur hal yang sama sepenuhnya. Penjelasan dan bukti objektif: Indikator KK menilai kesesuaian fungsi unsur pembantu pimpinan dalam mendukung koordinasi, perumusan kebijakan, dan pelaksanaan tugas pimpinan. Sementara itu, indikator SAKIP menilai keterkaitan strategi, kebijakan, aktivitas antarbidang, dan tugas/fungsi dalam perencanaan kinerja. Keduanya memiliki irisan pada peran koordinasi lintas bidang, tetapi berbeda dari segi fokus pengukuran. Solusi/langkah selanjutnya: KK perlu berfokus pada kesesuaian fungsi dan tugas unsur pembantu pimpinan berdasarkan struktur organisasi dan tupoksi, sedangkan SAKIP berfokus pada keterkaitan aktivitas dan target kinerja antarbidang berdasarkan dokumen perencanaan kinerja. Dengan demikian, keduanya dapat dipertahankan dengan bukti pengukuran yang berbeda.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KF.3.2_SS4-SAKIP.1.2.9": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang. Masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai kesesuaian dan pelaksanaan fungsi pengawasan, seperti pemantauan, reviu, dan evaluasi oleh unsur pengawas. Sementara itu, indikator SAKIP menilai keterkaitan kinerja, strategi, kebijakan, dan aktivitas antarbidang dalam perencanaan kinerja. Keduanya berkaitan karena fungsi pengawasan turut mendukung pengelolaan kinerja organisasi, tetapi aspek yang diukur berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada kesesuaian dan pelaksanaan fungsi pengawasan, sedangkan SAKIP berfokus pada keterkaitan aktivitas dan target dalam perencanaan kinerja. Keberadaan unsur pengawas tidak serta-merta membuktikan bahwa perencanaan kinerja telah berjalan dengan baik.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi."
        },
        "SS4-KK.KF.3.3_SS4-SAKIP.1.2.9": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang. Masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai kesesuaian fungsi layanan pendukung dengan kebutuhan organisasi dan kelancaran pelaksanaan tugas utama. Sementara itu, indikator SAKIP menilai keterkaitan strategi, kebijakan, aktivitas antarbidang, dan tugas/fungsi dalam perencanaan kinerja. Keduanya berkaitan dalam mendukung keterpaduan kerja organisasi, tetapi memiliki aspek pengukuran yang berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada kesesuaian layanan unsur pendukung dengan kebutuhan dan tugas utama organisasi, sedangkan SAKIP berfokus pada keterkaitan aktivitas dan strategi dalam perencanaan kinerja. Pengukuran keduanya perlu dipisahkan agar kualitas layanan pendukung tidak tercampur dengan kualitas perencanaan kinerja.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan."
        },
        "SS4-KK.KU.1.1_SS4-SAKIP.1.3.7": {
            "jenis": "Mendukung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang. Masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai keseimbangan pembagian beban kerja antarunit berdasarkan volume, tingkat kesulitan, dan kebutuhan pekerjaan. Sementara itu, indikator SAKIP menilai pemahaman dan komitmen unit kerja dalam mencapai target kinerja yang telah ditetapkan. Keduanya berkaitan dengan kesiapan unit dalam menjalankan tugas dan mencapai target, tetapi aspek yang diukur berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada keseimbangan distribusi beban kerja berdasarkan volume dan kompleksitas pekerjaan, sedangkan SAKIP berfokus pada pemahaman dan komitmen unit terhadap target kinerja. Survei komitmen tidak dapat dijadikan pengganti analisis pembagian beban kerja.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan."
        },
        "SS4-KK.KU.1.2_SS4-SAKIP.1.1.6": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki potensi tumpang tindih yang cukup besar, tetapi belum tentu mengukur hal yang sama karena memiliki fokus penilaian yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai kecukupan anggaran unit dibandingkan dengan beban kerja dan kebutuhan pelaksanaan tugas. Sementara itu, indikator SAKIP menilai ketersediaan dokumen perencanaan anggaran yang mendukung pencapaian kinerja. Keduanya memiliki keterkaitan dalam memastikan dukungan anggaran terhadap kinerja organisasi, tetapi berbeda dari segi aspek yang dinilai. Solusi/langkah selanjutnya: KK perlu berfokus pada kecukupan anggaran berdasarkan beban kerja dan kebutuhan unit, sedangkan SAKIP berfokus pada ketersediaan dokumen penganggaran yang mendukung kinerja. Penilaian KK dapat menggunakan analisis kebutuhan dan beban kerja, sementara SAKIP menggunakan dokumen perencanaan anggaran berbasis kinerja.",
            "rekomendasi": "Pisahkan kecukupan alokasi (KK), alignment prioritas (IPPN), anggaran berbasis kinerja (SAKIP), kualitas proses satker (IKPA)."
        },
        "SS4-KK.KU.1.3_SS4-SAKIP.3.2.8": {
            "jenis": "Mendukung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan dalam aspek penggunaan sumber daya manusia, tetapi belum dapat dikatakan mengukur hal yang sama sepenuhnya. Penjelasan dan bukti objektif: Indikator KK menilai keseimbangan jumlah dan kompetensi pegawai dengan kebutuhan serta beban kerja unit organisasi. Sementara itu, indikator SAKIP menilai sejauh mana efisiensi penggunaan sumber daya dijelaskan dalam dokumen Laporan Kinerja. Keduanya berkaitan dengan pemanfaatan SDM untuk mendukung kinerja organisasi, tetapi memiliki fokus pengukuran yang berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada kecukupan dan pemerataan distribusi pegawai sesuai kebutuhan unit, sedangkan SAKIP berfokus pada efisiensi penggunaan sumber daya dalam pencapaian kinerja. Jumlah dan distribusi pegawai perlu dinilai secara terpisah dari efisiensi penggunaannya agar tidak terjadi pencampuran aspek pengukuran.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KU.2.1_SS4-SAKIP.3.2.8": {
            "jenis": "Mendukung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan dalam aspek efisiensi organisasi, tetapi belum dapat dikatakan mengukur hal yang sama sepenuhnya. Penjelasan dan bukti objektif: Indikator KK menilai dampak penyederhanaan struktur organisasi terhadap kejelasan tanggung jawab, koordinasi, kecepatan proses, dan efisiensi kerja. Sementara itu, indikator SAKIP menilai pengungkapan efisiensi penggunaan sumber daya dalam dokumen Laporan Kinerja. Keduanya berkaitan dengan upaya meningkatkan efisiensi organisasi, tetapi memiliki fokus pengukuran yang berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada perubahan struktur dan proses kerja setelah penyederhanaan organisasi, sedangkan SAKIP berfokus pada efisiensi penggunaan sumber daya dalam pencapaian kinerja. Penilaian KK dapat menggunakan bukti perubahan struktur dan proses kerja, sementara SAKIP menggunakan analisis penggunaan sumber daya dibandingkan dengan hasil yang dicapai.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KU.2.2_SS4-SAKIP.1.2.9": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan dalam aspek keselarasan tugas dan fungsi antarunit, tetapi belum dapat dikatakan mengukur hal yang sama sepenuhnya. Penjelasan dan bukti objektif: Indikator KK menilai ketepatan pengelompokan tugas dan fungsi antarunit serta sejauh mana pembagian tersebut dapat menghindari tumpang tindih pekerjaan. Sementara itu, indikator SAKIP menilai keterkaitan strategi, kebijakan, aktivitas, dan kinerja antarbidang dalam perencanaan kinerja. Keduanya berkaitan dalam memastikan keselarasan kerja antarunit, tetapi memiliki fokus pengukuran yang berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada ketepatan pembagian tugas dan fungsi antarunit, sedangkan SAKIP berfokus pada keterkaitan aktivitas dan strategi antarbidang dalam perencanaan kinerja. Penilaian KK dapat menggunakan peta organisasi dan pembagian tugas, sementara SAKIP menggunakan dokumen perencanaan kinerja yang menunjukkan keterkaitan antarbidang.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian."
        },
        "SS4-KK.KP.1.1_SS4-SAKIP.1.1.7": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan dalam aspek keterpaduan kerja antarunit, tetapi belum dapat dikatakan mengukur hal yang sama sepenuhnya. Penjelasan dan bukti objektif: Indikator KK menilai keterhubungan proses kerja antarunit, termasuk alur kerja, serah-terima hasil pekerjaan, serta upaya mengurangi hambatan dan duplikasi. Sementara itu, indikator SAKIP menilai apakah setiap unit kerja telah menyusun dan menetapkan rencana kinerja. Keduanya berkaitan dalam mendukung keselarasan kerja organisasi, tetapi memiliki fokus pengukuran yang berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada keterpaduan alur proses kerja antarunit, sedangkan SAKIP berfokus pada penyusunan dan penetapan rencana kinerja setiap unit. Penilaian KK dapat menggunakan peta proses bisnis, sementara SAKIP menggunakan dokumen rencana kinerja unit kerja.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.1.2_SS4-SAKIP.1.2.9": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator saling melengkapi dengan risiko tumpang tindih yang rendah karena mengukur aspek yang berbeda, meskipun memiliki keterkaitan secara tidak langsung. Penjelasan dan bukti objektif: Indikator KK menilai koordinasi dan keterpaduan proses kerja antarinstansi, termasuk pembagian peran, pertukaran informasi, dan kesinambungan layanan. Sementara itu, indikator SAKIP menilai keterkaitan strategi, kebijakan, aktivitas, dan tugas antarbidang dalam perencanaan kinerja. Keduanya sama-sama mendukung keterpaduan kerja organisasi, tetapi berbeda dalam cakupan dan objek pengukurannya. Solusi/langkah selanjutnya: KK perlu berfokus pada koordinasi dan keterpaduan proses kerja lintas instansi, sedangkan SAKIP berfokus pada keterkaitan aktivitas antarbidang dalam perencanaan kinerja. Dokumen perencanaan internal SAKIP tidak dapat dijadikan satu-satunya bukti adanya koordinasi atau kolaborasi antarinstansi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.2.1_SS4-SAKIP.2.1.3": {
            "jenis": "Mendukung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang. Masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai kejelasan proses pengambilan keputusan internal, mulai dari tahapan, kewenangan, penggunaan data pendukung, koordinasi, hingga dokumentasi keputusan. Sementara itu, indikator SAKIP menilai kejelasan mekanisme pengumpulan data kinerja yang dapat diandalkan. Keduanya memiliki keterkaitan dalam penggunaan data sebagai dasar pengambilan keputusan, tetapi berbeda dalam aspek yang dinilai. Solusi/langkah selanjutnya: KK perlu berfokus pada keseluruhan mekanisme pengambilan keputusan internal, sedangkan SAKIP berfokus pada keandalan proses pengumpulan data kinerja. Bukti penilaian perlu dibedakan, yaitu dokumen tata cara pengambilan keputusan untuk KK dan prosedur serta mekanisme pengumpulan dan validasi data kinerja untuk SAKIP.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.2.2_SS4-SAKIP.4.3.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator cenderung saling melengkapi dengan risiko tumpang tindih yang rendah. Masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai mekanisme pengambilan keputusan antarinstansi, termasuk koordinasi, kesepakatan, pembagian kewenangan, dan tindak lanjut keputusan. Sementara itu, indikator SAKIP menilai tindak lanjut rekomendasi hasil evaluasi AKIP internal untuk meningkatkan implementasi SAKIP. Keduanya sama-sama melihat tindak lanjut, tetapi konteks dan objek yang dinilai berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada mekanisme koordinasi dan pengambilan keputusan lintas instansi, sedangkan SAKIP berfokus pada tindak lanjut hasil evaluasi AKIP internal. Bukti untuk KK dapat berupa notulen atau kesepakatan lintas instansi, sedangkan SAKIP menggunakan rencana aksi atau dokumen tindak lanjut hasil evaluasi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.KP.3.1_SS4-SAKIP.1.3.5": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan dalam aspek perencanaan hasil bersama, tetapi belum dapat dikatakan mengukur hal yang sama sepenuhnya. Penjelasan dan bukti objektif: Indikator KK menilai penetapan sasaran atau hasil bersama, indikator yang digunakan bersama, serta pembagian kontribusi antarunit internal. Sementara itu, indikator SAKIP menilai perbaikan dokumen perencanaan kinerja berdasarkan hasil analisis kinerja sebelumnya. Keduanya beririsan pada upaya menyelaraskan sasaran dan perencanaan antarunit, tetapi fokus pengukurannya berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada kesepakatan sasaran bersama dan pembagian kontribusi antarunit, sedangkan SAKIP berfokus pada perbaikan dokumen perencanaan berdasarkan evaluasi kinerja sebelumnya. Dokumen perencanaan hanya dapat menjadi bukti KK apabila secara jelas memuat sasaran bersama dan pembagian kontribusi antarunit..",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.KP.3.2_SS4-SAKIP.1.2.4": {
            "jenis": "Mendukung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki potensi tumpang tindih yang cukup besar, tetapi belum tentu mengukur hal yang sama karena fokus penilaiannya berbeda. Penjelasan dan bukti objektif: Indikator KK menilai kesepakatan tujuan dan target bersama, pembagian kontribusi, serta pelaksanaan hasil bersama lintas instansi. Sementara itu, indikator SAKIP menilai kejelasan rumusan tujuan dan sasaran dalam menggambarkan kondisi kinerja yang ingin dicapai. Keduanya beririsan pada perumusan tujuan dan hasil yang ingin dicapai, tetapi KK menekankan kerja sama lintas instansi, sedangkan SAKIP menekankan kualitas rumusan sasaran. Solusi/langkah selanjutnya: KK perlu berfokus pada kesepakatan target, pembagian kontribusi, dan pelaksanaan kolaborasi lintas instansi, sedangkan SAKIP berfokus pada kejelasan rumusan tujuan dan sasaran kinerja. Bukti kesepakatan dan pelaksanaan kolaborasi perlu dipisahkan dari bukti kualitas rumusan tujuan dalam dokumen kinerja.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.KP.3.3_SS4-SAKIP.3.2.8": {
            "jenis": "Mendukung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang. Masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai sejauh mana sasaran, indikator, target, program, jadwal, dan sumber daya telah diselaraskan dalam proses perencanaan. Sementara itu, indikator SAKIP menilai pengungkapan efisiensi penggunaan sumber daya dalam dokumen Laporan Kinerja. Keduanya sama-sama mendukung keterpaduan pengelolaan kinerja, tetapi objek yang diukur berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada sinkronisasi berbagai unsur dalam proses perencanaan, sedangkan SAKIP berfokus pada pengungkapan efisiensi penggunaan sumber daya dalam laporan kinerja. Bukti sinkronisasi perencanaan perlu dipisahkan dari bukti efisiensi penggunaan sumber daya agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian."
        },
        "SS4-KK.TK.1.1_SS4-SAKIP.4.3.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang. Masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai kematangan kebijakan internal sistem kerja, penerapannya, serta tindak lanjut perbaikan proses bisnis dan SOP. Sementara itu, indikator SAKIP menilai tindak lanjut rekomendasi hasil evaluasi AKIP internal untuk meningkatkan implementasi SAKIP. Keduanya beririsan pada upaya memperbaiki tata kerja melalui kebijakan dan tindak lanjut, tetapi aspek yang diukur berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada kematangan dan penerapan kebijakan sistem kerja serta perubahan SOP atau proses bisnis, sedangkan SAKIP berfokus pada tindak lanjut rekomendasi evaluasi AKIP. Bukti kebijakan dan perubahan proses kerja perlu dipisahkan dari bukti rencana aksi serta realisasi tindak lanjut rekomendasi evaluasi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.TK.1.2_SS4-SAKIP.4.3.4": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan yang terbatas dengan risiko tumpang tindih rendah hingga sedang. Masing-masing memiliki fokus pengukuran yang berbeda. Penjelasan dan bukti objektif: Indikator KK menilai pembentukan dan pelaksanaan tim kerja internal, termasuk pembagian peran, hasil kerja, serta evaluasi tim secara berkala. Sementara itu, indikator SAKIP menilai pemanfaatan hasil evaluasi internal untuk meningkatkan efektivitas dan efisiensi kinerja. Keduanya berkaitan dalam upaya meningkatkan efektivitas kerja, tetapi memiliki objek pengukuran yang berbeda. Solusi/langkah selanjutnya: KK perlu berfokus pada pembentukan, pembagian peran, dan evaluasi tim kerja internal, sedangkan SAKIP berfokus pada pemanfaatan hasil evaluasi AKIP untuk perbaikan kinerja. Bukti rapat dan evaluasi tim tidak dapat dijadikan satu-satunya dasar untuk membuktikan bahwa rekomendasi hasil evaluasi AKIP telah ditindaklanjuti.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.TK.1.3_SS4-SAKIP.2.2.4": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki keterkaitan pada aspek koordinasi lintas unit, tetapi mengukur hal yang berbeda sehingga potensi tumpang tindihnya relatif rendah hingga sedang. Penjelasan dan bukti objektif: Indikator menilai pembentukan dan efektivitas kerja sama ant unit melalui pembagian peran, koordinasi, hasil kerja, dan umpan balik. Sementara itu, indikator SAKIP menilai pelaksanaan pengukuran kinerja secara berkala. Keterkaitannya terletak pada peran tim lintas unit dalam mendukung proses pengukuran kinerja. Namun, KK berfokus pada kesiapan dan efektivitas kerja sama tim, sedangkan SAKIP berfokus pada pelaksanaan pengukuran kinerja. Solusi/langkah selanjutnya: Kedua indikator tetap dipertahankan dengan memperjelas batas pengukurannya. KK menggunakan bukti pembentukan tim dan hasil kolaborasi, sedangkan SAKIP menggunakan jadwal dan hasil pengukuran kinerja. Kesamaan rumus, unit analisis, periode, dan sumber bukti tetap perlu diperiksa untuk memastikan tidak terjadi pengukuran ganda.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi."
        },
        "SS4-KK.TK.2.1_SS4-SAKIP.1.3.7": {
            "jenis": "Mendukung",
            "alasan": "Pernyataan langsung: Kedua indikator memiliki potensi tumpang tindih sedang hingga tinggi karena sama-sama berkaitan dengan perilaku dan komitmen pegawai dalam mendukung pencapaian tujuan organisasi. Namun, fokus pengukurannya masih dapat dibedakan. Penjelasan dan bukti objektif: Indikator KK menilai penerapan budaya kerja dalam organisasi, mulai dari pembiasaan, pengelolaan SDM, keteladanan, hingga perilaku kerja. Sementara itu, indikator SAKIP menilai pemahaman, kepedulian, dan komitmen unit dalam mencapai target kinerja. Keduanya beririsan pada aspek perilaku dan komitmen dalam bekerja, tetapi KK mencakup penerapan budaya kerja secara lebih luas, sedangkan SAKIP berfokus pada komitmen terhadap pencapaian target kinerja. Solusi/langkah selanjutnya: Kedua indikator dapat dipertahankan dengan memperjelas batas pengukurannya. KK berfokus pada penerapan budaya kerja, sedangkan SAKIP berfokus pada pemahaman dan komitmen terhadap target kinerja. Penggunaan survei atau bukti perilaku yang sama untuk kedua indikator perlu dihindari agar tidak terjadi penghitungan ganda.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.TK.3.1_SS4-SAKIP.4.3.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Kedua indikator saling melengkapi dengan potensi tumpang tindih yang rendah karena memiliki fokus pengukuran berbeda, meskipun pelaksanaan pengendalian risiko dapat mendukung perbaikan kinerja organisasi. Penjelasan dan bukti objektif: Indikator KK menilai penerapan pengendalian risiko, mulai dari identifikasi, mitigasi, pemantauan, hingga tindak lanjut risiko. Sementara itu, indikator SAKIP menilai tindak lanjut rekomendasi hasil evaluasi AKIP internal. Keterkaitannya terletak pada peran pengendalian risiko dalam membantu organisasi memperbaiki kinerja. Namun, KK berfokus pada upaya mencegah dan mengendalikan risiko, sedangkan SAKIP berfokus pada penyelesaian rekomendasi evaluasi. Solusi/langkah selanjutnya: Kedua indikator tetap dipertahankan dengan membedakan bukti pengukurannya. KK menggunakan bukti identifikasi dan mitigasi risiko, sedangkan SAKIP menggunakan bukti tindak lanjut rekomendasi evaluasi AKIP.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan."
        },
        "SS4-KK.KF.1.1_SS4-ELPPD.2.1.1": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung, karena ELPPD memberikan gambaran tentang pelaksanaan tugas dan pencapaian target yang dapat membantu menjelaskan kesesuaian fungsi instansi. Namun, ELPPD tidak secara langsung menilai kesesuaian mandat maupun kapasitas kelembagaan. Kedua indikator memiliki keterkaitan, tetapi menilai hal yang berbeda. Indikator KK menilai kesesuaian tugas dan fungsi instansi dengan mandat serta kebutuhan organisasi, sedangkan ELPPD menilai pencapaian target program, kegiatan, dan anggaran dalam pelaksanaan tugas pembantuan. Keduanya berkaitan dalam menggambarkan pelaksanaan tugas dan pembagian peran, tetapi hasil pengukurannya tidak dapat disamakan.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KF.1.2_SS4-ELPPD.1.3.6": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena ELPPD memberikan informasi mengenai program dan kegiatan yang menunjang pencapaian target kinerja. Informasi tersebut dapat membantu menjelaskan pelaksanaan tugas dan fungsi organisasi. Namun, ELPPD tidak secara langsung mengukur penerapan tugas dan fungsi oleh unit organisasi. Indikator KK menilai sejauh mana tugas dan fungsi telah diterapkan oleh unit organisasi, sedangkan ELPPD menilai kesesuaian program dan kegiatan dalam mendukung pencapaian target kinerja. Keduanya saling melengkapi dalam memberikan gambaran pelaksanaan tugas, tetapi hasil pengukurannya tidak dapat disamakan.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KF.2.1_SS4-ELPPD.3.1.3": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi pencapaian target dalam ELPPD dapat membantu memberikan gambaran mengenai hasil pelaksanaan tugas organisasi. Kedua indikator memiliki keterkaitan dalam pelaksanaan tugas dan pencapaian target organisasi, tetapi menilai hal yang berbeda. Indikator KK menilai kesesuaian pelimpahan kewenangan dengan batas dan tanggung jawab setiap jenjang organisasi, sedangkan ELPPD menilai pencapaian target pemerintah daerah dibandingkan dengan target yang telah ditetapkan. Keduanya dapat memberikan gambaran mengenai pelaksanaan tugas organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Namun, ELPPD tidak secara langsung menilai ketepatan pembagian dan pelimpahan kewenangan dalam organisasi. Karena itu, kedua indikator perlu tetap dinilai secara terpisah agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KF.2.2_SS4-ELPPD.1.3.6": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai program dan kegiatan dapat membantu menjelaskan pencapaian target organisasi. Kedua indikator memiliki keterkaitan dalam melihat pelaksanaan tugas dan pencapaian target organisasi, tetapi menilai hal yang berbeda. Indikator KK menilai sejauh mana pelimpahan kewenangan membantu kelancaran tugas, memperjelas tanggung jawab, dan meningkatkan kinerja organisasi. Sementara itu, ELPPD menilai sejauh mana program dan kegiatan mendukung pencapaian target kinerja. Keduanya saling melengkapi dalam memberikan gambaran pelaksanaan tugas, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KF.3.1_SS4-ELPPD.2.1.1": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai pencapaian target program dan kegiatan dapat membantu memberikan gambaran tentang pelaksanaan fungsi organisasi. Kedua indikator memiliki keterkaitan dalam melihat pelaksanaan tugas dan pembagian peran, tetapi menilai hal yang berbeda. Indikator KK menilai kesesuaian fungsi unsur pembantu pimpinan dalam mendukung koordinasi, perumusan kebijakan, dan pelaksanaan tugas pimpinan. Sementara itu, ELPPD menilai pencapaian target program, kegiatan, dan anggaran dalam pelaksanaan tugas pembantuan. Keduanya saling melengkapi dalam memberikan gambaran pelaksanaan tugas organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KF.3.2_SS4-ELPPD.2.1.1": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai pencapaian target program dan kegiatan dapat membantu memberikan gambaran tentang pelaksanaan fungsi organisasi. Kedua indikator memiliki keterkaitan dalam melihat pelaksanaan tugas dan pencapaian target organisasi, tetapi menilai hal yang berbeda. Indikator KK menilai kesesuaian fungsi pengawasan dalam memantau, meninjau, dan mengevaluasi pelaksanaan tugas organisasi. Sementara itu, ELPPD menilai pencapaian target program, kegiatan, dan anggaran dalam pelaksanaan tugas pembantuan. Keduanya saling melengkapi dalam memberikan gambaran pelaksanaan tugas organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KF.3.3_SS4-ELPPD.1.3.6": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai program dan kegiatan dapat membantu menjelaskan bagaimana fungsi pendukung berkontribusi terhadap pencapaian target organisasi. Kedua indikator memiliki keterkaitan dalam melihat dukungan terhadap pelaksanaan tugas organisasi, tetapi menilai hal yang berbeda. Indikator KK menilai kesesuaian fungsi unsur pendukung dalam memenuhi kebutuhan organisasi dan memperlancar pelaksanaan tugas utama. Sementara itu, ELPPD menilai sejauh mana program dan kegiatan mendukung pencapaian target kinerja. Keduanya saling melengkapi dalam memberikan gambaran pelaksanaan tugas organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KU.1.1_SS4-ELPPD.3.3": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi Tidak Langsung karena belum ditemukan kesamaan aspek yang dinilai antara kedua indikator. Indikator KK menilai keseimbangan pembagian beban kerja antarunit berdasarkan jumlah, tingkat kesulitan, dan kebutuhan pekerjaan. Sementara itu, ELPPD hanya menunjukkan kategori urusan Pekerjaan Umum yang menjadi bagian dari evaluasi, tanpa menjelaskan beban kerja masing-masing unit. Dengan demikian, keduanya belum dapat dibandingkan secara langsung maupun dinyatakan memiliki pengukuran yang sama. Informasi ELPPD hanya dapat digunakan sebagai konteks pelaksanaan urusan pemerintahan, bukan sebagai bukti penilaian beban kerja dalam KK. Oleh karena itu, perlu dipastikan terlebih dahulu apakah terdapat indikator ELPPD yang benar-benar mengukur beban kerja. Penilaian KK tetap perlu menggunakan bukti analisis beban kerja pada masing-masing unit organisasi.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KU.1.2_SS4-ELPPD.2.2.2": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai realisasi program dan anggaran dapat membantu memberikan gambaran tentang penggunaan anggaran dalam pelaksanaan tugas organisasi. Kedua indikator memiliki keterkaitan dalam melihat pengelolaan anggaran, tetapi menilai aspek yang berbeda. Indikator KK menilai kecukupan anggaran yang dialokasikan untuk memenuhi beban kerja dan kebutuhan masing-masing unit organisasi. Sementara itu, ELPPD menilai sejauh mana target program, kegiatan, dan anggaran telah direalisasikan dalam pelaksanaan tugas pembantuan. Keduanya saling melengkapi dalam memberikan gambaran pengelolaan anggaran, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah dengan membedakan kecukupan anggaran yang dialokasikan dan realisasi penggunaannya agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "Pisahkan kecukupan alokasi (KK), alignment prioritas (IPPN), anggaran berbasis kinerja (SAKIP), kualitas proses satker (IKPA). Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KU.1.3_SS4-ELPPD.1.3.5": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai efisiensi penggunaan sumber daya dapat membantu memberikan gambaran tentang pemanfaatan pegawai dalam mencapai hasil kerja. Kedua indikator memiliki keterkaitan dalam melihat pengelolaan sumber daya organisasi, tetapi menilai aspek yang berbeda. Indikator KK menilai kesesuaian jumlah dan kompetensi pegawai dengan kebutuhan serta beban kerja masing-masing unit organisasi. Sementara itu, ELPPD menilai efisiensi penggunaan sumber daya dalam mendukung pencapaian hasil kinerja. Keduanya saling melengkapi dalam memberikan gambaran pengelolaan sumber daya, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah, dengan menggunakan analisis kebutuhan pegawai untuk KK dan analisis efisiensi penggunaan sumber daya untuk ELPPD, agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KU.2.1_SS4-ELPPD.1.3.5": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai efisiensi penggunaan sumber daya dapat membantu memberikan gambaran tentang efektivitas organisasi dalam mencapai hasil kerja. Kedua indikator memiliki keterkaitan dalam melihat efisiensi organisasi, tetapi menilai aspek yang berbeda. Indikator KK menilai sejauh mana penyederhanaan struktur organisasi berdampak pada kejelasan tanggung jawab, kelancaran koordinasi, dan kecepatan pelaksanaan tugas. Sementara itu, ELPPD menilai efisiensi penggunaan sumber daya dalam mendukung pencapaian kinerja. Keduanya saling melengkapi dalam memberikan gambaran efisiensi organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah dengan membedakan dampak perubahan struktur organisasi dan efisiensi penggunaan sumber daya agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KU.2.2_SS4-ELPPD.1.3.6": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai program dan kegiatan dapat membantu menjelaskan bagaimana pembagian tugas organisasi berkontribusi terhadap pencapaian target kinerja. Kedua indikator memiliki keterkaitan dalam melihat pelaksanaan tugas organisasi, tetapi menilai aspek yang berbeda. Indikator KK menilai ketepatan pengelompokan tugas dan fungsi antarunit agar pembagian tanggung jawab lebih jelas dan tidak terjadi tumpang tindih pekerjaan. Sementara itu, ELPPD menilai sejauh mana program dan kegiatan mendukung pencapaian target kinerja. Keduanya saling melengkapi dalam memberikan gambaran pelaksanaan tugas organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KP.1.1_SS4-ELPPD.3.1.5": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi Tidak Langsung karena kedua indikator memiliki keterkaitan dalam mendukung pelaksanaan pelayanan, tetapi menilai aspek yang berbeda. Indikator KK menilai keterpaduan proses kerja antarunit, termasuk kejelasan alur kerja dan koordinasi agar tidak terjadi hambatan atau pekerjaan berulang. Sementara itu, ELPPD menilai jumlah personel yang terlibat dalam penerapan Standar Pelayanan Minimal (SPM). Keduanya dapat memberikan gambaran mengenai kebutuhan organisasi dalam menjalankan pelayanan, tetapi jumlah personel tidak secara langsung menunjukkan keterpaduan proses kerja. Oleh karena itu, ELPPD hanya dapat digunakan sebagai informasi kontekstual, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah dengan menggunakan bukti alur proses dan koordinasi antarunit untuk KK serta data jumlah personel untuk ELPPD.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KP.1.2_SS4-ELPPD.3.1.5": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi Tidak Langsung karena kedua indikator memiliki keterkaitan dalam mendukung pelaksanaan pelayanan, tetapi menilai aspek yang berbeda. Indikator KK menilai keterpaduan kerja sama antarinstansi, termasuk pembagian tugas, pertukaran informasi, dan kesinambungan pelayanan. Sementara itu, ELPPD menilai jumlah personel yang terlibat dalam penerapan Standar Pelayanan Minimal (SPM). Ketersediaan personel dapat membantu pelaksanaan pelayanan, tetapi tidak secara langsung menunjukkan bahwa koordinasi dan proses kerja antarinstansi telah berjalan dengan baik. Oleh karena itu, ELPPD hanya dapat digunakan sebagai informasi kontekstual, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah dengan menggunakan bukti kerja sama dan koordinasi antarinstansi untuk KK serta data jumlah personel untuk ELPPD.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KP.2.1_SS4-ELPPD.3.1.6": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai permasalahan dan solusi dalam penerapan Standar Pelayanan Minimal (SPM) dapat membantu memberikan gambaran tentang pelaksanaan tugas dan pelayanan organisasi. Kedua indikator memiliki keterkaitan dalam melihat proses pelaksanaan tugas dan penyelesaian permasalahan, tetapi menilai aspek yang berbeda. Indikator KK menilai kejelasan proses pengambilan keputusan internal, mulai dari tahapan, pembagian kewenangan, penggunaan data, hingga koordinasi dan dokumentasi keputusan. Sementara itu, ELPPD menilai permasalahan yang dihadapi serta solusi dalam penerapan dan pencapaian SPM. Keduanya saling melengkapi dalam memberikan gambaran tata kelola organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar tidak terjadi penghitungan aspek yang sama secara berulang.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KP.2.2_SS4-ELPPD.2.4.1": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai saran dan tindak lanjut perbaikan dapat membantu memberikan gambaran tentang proses pengambilan keputusan antarinstansi. Kedua indikator memiliki keterkaitan dalam melihat koordinasi dan penyelesaian persoalan lintas instansi, tetapi menilai aspek yang berbeda. Indikator KK menilai bagaimana keputusan bersama dibentuk melalui koordinasi, kesepakatan, pembagian kewenangan, dan tindak lanjut antarinstansi. Sementara itu, ELPPD menilai saran yang diberikan serta tindak lanjut untuk menyelesaikan masalah dan memperbaiki perencanaan tugas pembantuan. Keduanya saling melengkapi dalam menggambarkan tata kelola kerja sama antarinstansi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar proses pengambilan keputusan tidak tercampur dengan penilaian penyelesaian rekomendasi.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KP.3.1_SS4-ELPPD.3.1.6": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai permasalahan dan solusi dalam pencapaian Standar Pelayanan Minimal (SPM) dapat membantu menjelaskan kondisi yang memengaruhi pencapaian hasil kerja bersama antarunit. Kedua indikator memiliki keterkaitan dalam melihat proses kerja dan pencapaian hasil organisasi, tetapi menilai aspek yang berbeda. Indikator KK menilai bagaimana unit-unit internal menyepakati sasaran bersama, menetapkan ukuran keberhasilan, dan membagi kontribusi untuk mencapai hasil tersebut. Sementara itu, ELPPD menilai permasalahan yang dihadapi serta solusi dalam penerapan dan pencapaian SPM. Keduanya saling melengkapi dalam memberikan gambaran pelaksanaan dan hasil kerja organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar proses penetapan hasil bersama tidak tercampur dengan penilaian permasalahan dan solusi dalam pencapaian SPM.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KP.3.2_SS4-ELPPD.1.3.5": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai efisiensi penggunaan sumber daya dapat membantu menjelaskan sejauh mana hasil kerja organisasi dicapai dengan memanfaatkan sumber daya yang tersedia. Kedua indikator memiliki keterkaitan dalam melihat pencapaian hasil kerja, tetapi menilai aspek yang berbeda. Indikator KK menilai bagaimana beberapa instansi menyepakati tujuan bersama, menetapkan target, membagi kontribusi, dan melaksanakan kerja sama untuk mencapai hasil tersebut. Sementara itu, ELPPD menilai efisiensi penggunaan sumber daya dalam kaitannya dengan hasil kinerja. Keduanya saling melengkapi dalam memberikan gambaran pencapaian kinerja lintas instansi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar kerja sama dalam mencapai hasil bersama tidak tercampur dengan penilaian efisiensi penggunaan sumber daya.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KP.3.3_SS4-ELPPD.1.3.5": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai efisiensi penggunaan sumber daya dapat membantu menjelaskan sejauh mana perencanaan organisasi menghasilkan kinerja yang optimal. Kedua indikator memiliki keterkaitan dalam mendukung pencapaian target organisasi, tetapi menilai aspek yang berbeda. Indikator KK menilai keselarasan sasaran, target, program, jadwal, dan sumber daya agar perencanaan antarbagian berjalan searah. Sementara itu, ELPPD menilai efisiensi penggunaan sumber daya dalam kaitannya dengan hasil kinerja. Keduanya saling melengkapi dalam memberikan gambaran kualitas perencanaan dan pencapaian kinerja, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar keselarasan perencanaan tidak tercampur dengan penilaian efisiensi penggunaan sumber daya.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.TK.1.1_SS4-ELPPD.2.4.1": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai saran dan tindak lanjut perbaikan dapat membantu menjelaskan bagaimana organisasi menangani masalah dalam pelaksanaan tugas. Kedua indikator memiliki keterkaitan dalam mendukung perbaikan sistem kerja, tetapi menilai aspek yang berbeda. Indikator KK menilai sejauh mana kebijakan internal sistem kerja telah disusun, diterapkan, dan diperbaiki melalui penyempurnaan proses kerja atau SOP. Sementara itu, ELPPD menilai saran dan tindak lanjut untuk menyelesaikan masalah serta memperbaiki perencanaan tugas pembantuan. Keduanya saling melengkapi dalam memberikan gambaran perbaikan tata kelola organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar kualitas kebijakan sistem kerja tidak tercampur dengan penilaian tindak lanjut rekomendasi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.TK.1.2_SS4-ELPPD.3.1.6": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai permasalahan dan solusi dalam pencapaian Standar Pelayanan Minimal (SPM) dapat membantu menjelaskan kendala yang dihadapi dalam pelaksanaan tugas organisasi. Kedua indikator memiliki keterkaitan dalam melihat penyelesaian tugas dan perbaikan sistem kerja, tetapi menilai aspek yang berbeda. Indikator KK menilai bagaimana tim kerja internal dibentuk, dibagi peran dan tanggung jawabnya, serta dievaluasi secara berkala. Sementara itu, ELPPD menilai permasalahan yang dihadapi dan solusi dalam penerapan serta pencapaian SPM. Keduanya saling melengkapi dalam memberikan gambaran pelaksanaan dan perbaikan kerja organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar penilaian terhadap pengelolaan tim kerja tidak tercampur dengan penilaian permasalahan dan solusi dalam pencapaian SPM.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.TK.1.3_SS4-ELPPD.2.3.1": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai kendala administrasi, keuangan, dan teknis dapat membantu menjelaskan tantangan yang perlu ditangani dalam pelaksanaan tugas lintas unit. Kedua indikator memiliki keterkaitan dalam upaya menyelesaikan kendala organisasi, tetapi menilai aspek yang berbeda. Indikator KK menilai bagaimana tim lintas unit dibentuk, bagaimana peran dan koordinasi diatur, serta sejauh mana tim mampu menghasilkan keluaran yang diharapkan. Sementara itu, ELPPD menilai kendala yang muncul dalam pelaksanaan tugas pembantuan. Keduanya saling melengkapi dalam memberikan gambaran penyelesaian masalah organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar efektivitas tim lintas unit tidak tercampur dengan penilaian kendala pelaksanaan tugas pembantuan.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.TK.2.1_SS4-ELPPD.3.1.6": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai permasalahan dan solusi dalam pencapaian Standar Pelayanan Minimal (SPM) dapat membantu menjelaskan tantangan yang memengaruhi penerapan budaya kerja organisasi. Kedua indikator memiliki keterkaitan dalam mendukung pelaksanaan tugas dan perbaikan kerja, tetapi menilai aspek yang berbeda. Indikator KK menilai sejauh mana budaya kerja diterapkan melalui pembiasaan, pengelolaan SDM, keteladanan, dan perilaku sehari-hari pegawai. Sementara itu, ELPPD menilai permasalahan yang dihadapi serta solusi dalam penerapan dan pencapaian SPM. Keduanya saling melengkapi dalam memberikan gambaran kondisi organisasi, tetapi hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar penerapan budaya kerja tidak tercampur dengan penilaian permasalahan dan solusi dalam pencapaian SPM.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.TK.3.1_SS4-ELPPD.2.4.1": {
            "jenis": "Mendukung",
            "alasan": "Relasi Mendukung karena informasi ELPPD mengenai saran dan tindak lanjut perbaikan dapat membantu menjelaskan bagaimana organisasi menangani risiko dan masalah dalam pelaksanaan tugas. Kedua indikator memiliki keterkaitan dalam upaya menjaga dan memperbaiki kinerja organisasi, tetapi menilai aspek yang berbeda. Indikator KK menilai bagaimana risiko dikenali, dicegah, dipantau, dan ditindaklanjuti agar tidak mengganggu pelaksanaan tugas. Sementara itu, ELPPD menilai saran dan tindak lanjut untuk menyelesaikan masalah serta memperbaiki perencanaan tugas pembantuan. Keduanya saling melengkapi karena KK berfokus pada upaya mencegah risiko, sedangkan ELPPD melihat perbaikan atas masalah yang ditemukan. Namun, hasil pengukurannya tidak dapat disamakan. Oleh karena itu, ELPPD dapat digunakan sebagai informasi pendukung, bukan sebagai bagian dari penilaian KK. Kedua indikator perlu tetap dinilai secara terpisah agar upaya pencegahan risiko tidak tercampur dengan penilaian tindak lanjut perbaikan.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Batasi klaim pada mandat pembinaan/tugas pembantuan; outcome makro daerah bukan ukuran langsung kapabilitas K/L."
        },
        "SS4-KK.KF.1.1_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena kesesuaian tugas dan fungsi instansi berkaitan dengan kemampuan organisasi mencapai keluaran kegiatan yang direncanakan. Kapabilitas Kelembagaan menilai apakah mandat organisasi sesuai dengan fungsi yang dijalankan dan hasil yang harus dicapai, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian keluaran kegiatan serta ketepatan pelaporannya. Mandat yang jelas membantu pelaksanaan tugas lebih terarah. Namun, tercapainya keluaran anggaran belum otomatis menunjukkan bahwa seluruh tugas dan fungsi organisasi telah sesuai dengan mandat serta kebutuhan instansi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KF.1.2_SS4-IKPA.2.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena pelaksanaan tugas dan fungsi organisasi berkaitan dengan kesiapan kegiatan yang membutuhkan anggaran. Kapabilitas Kelembagaan menilai apakah tugas dan fungsi dijalankan untuk mencapai target organisasi, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai kesesuaian realisasi belanja dengan rencana penyerapan. Keterkaitannya terlihat pada pelaksanaan kegiatan, tetapi fokus penilaiannya berbeda. Penyerapan anggaran sesuai rencana belum cukup untuk memastikan seluruh fungsi organisasi berjalan efektif. Karena itu, bukti pelaksanaan tugas tetap perlu diperiksa secara tersendiri.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KF.2.1_SS4-IKPA.1.2.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena pembagian kewenangan yang jelas membantu pengambilan keputusan tepat waktu dalam pelaksanaan anggaran. Kapabilitas Kelembagaan menilai kesesuaian keputusan dengan mandat dan batas kewenangan, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai kesesuaian penarikan dana bulanan dengan rencana pada Halaman III Daftar Isian Pelaksanaan Anggaran. Hubungannya terletak pada kelancaran proses pelaksanaan kegiatan. Namun, penarikan dana yang sesuai jadwal belum cukup untuk membuktikan bahwa kewenangan telah didelegasikan dan dijalankan dengan tepat.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KF.2.2_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena pelaksanaan kewenangan yang didelegasikan berkaitan dengan pencapaian hasil kegiatan. Kapabilitas Kelembagaan menilai apakah pendelegasian kewenangan memperjelas tanggung jawab dan membantu pencapaian target organisasi, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian dan ketepatan pelaporan keluaran kegiatan dalam Daftar Isian Pelaksanaan Anggaran. Hubungan keduanya terlihat pada hasil pelaksanaan tugas, tetapi sudut penilaiannya berbeda. Capaian keluaran yang baik belum dengan sendirinya menunjukkan bahwa proses pendelegasian kewenangan sudah berjalan efektif.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KF.3.1_SS4-IKPA.1.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena koordinasi dan dukungan unsur pembantu pimpinan berkaitan dengan penyusunan serta penyesuaian rencana anggaran. Kapabilitas Kelembagaan menilai kesesuaian pelaksanaan fungsi unsur pembantu pimpinan dengan mandatnya, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai pengelolaan revisi Daftar Isian Pelaksanaan Anggaran. Keterkaitannya terlihat dalam proses perencanaan kegiatan dan anggaran. Namun, sedikitnya revisi anggaran belum cukup untuk menyimpulkan bahwa fungsi koordinasi dan dukungan kepada pimpinan telah berjalan dengan baik.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KF.3.2_SS4-IKPA.1.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena pengawasan yang berjalan baik dapat membantu mengendalikan perubahan rencana anggaran. Kapabilitas Kelembagaan menilai pelaksanaan tugas unsur pengawas, termasuk pemantauan, penelaahan, dan evaluasi, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai pengelolaan revisi Daftar Isian Pelaksanaan Anggaran. Keduanya berkaitan dalam menjaga ketertiban perencanaan. Namun, banyak atau sedikitnya revisi anggaran bukan ukuran langsung mutu pengawasan. Efektivitas fungsi pengawas tetap perlu dilihat dari hasil pengawasan dan tindak lanjut yang dilakukan.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KF.3.3_SS4-IKPA.2.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena layanan unsur pendukung membantu kelancaran kegiatan organisasi yang membutuhkan anggaran. Kapabilitas Kelembagaan menilai kesesuaian fungsi unsur pendukung dengan kebutuhan organisasi, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai realisasi belanja dibandingkan dengan target penyerapan. Keterkaitannya terlihat pada keberlangsungan pelaksanaan kegiatan, meskipun ukuran keberhasilannya berbeda. Penyerapan anggaran yang baik belum cukup untuk menunjukkan bahwa layanan unsur pendukung sudah sesuai kebutuhan dan benar-benar membantu pelaksanaan tugas utama.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KU.1.1_SS4-IKPA.2.4.1": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi tidak langsung karena pembagian beban kerja antarunit dapat memengaruhi kelancaran pengelolaan Uang Persediaan dan Tambahan Uang Persediaan melalui ketersediaan petugas serta pembagian tugas administrasi. Kapabilitas Kelembagaan menilai keseimbangan jumlah dan tingkat kesulitan pekerjaan antarunit, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai ketertiban penggunaan dan pertanggungjawaban dana tersebut. Hubungan ini muncul melalui pelaksanaan pekerjaan, bukan karena kedua indikator mengukur hal serupa. Administrasi dana yang tertib belum cukup untuk membuktikan bahwa beban kerja telah dibagi secara proporsional.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KU.1.2_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena kecukupan anggaran berkaitan dengan kemampuan unit melaksanakan kegiatan dan mencapai hasil yang direncanakan. Kapabilitas Kelembagaan menilai kesesuaian alokasi anggaran dengan beban kerja serta kebutuhan unit, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian dan pelaporan keluaran kegiatan dalam Daftar Isian Pelaksanaan Anggaran. Keterkaitannya terlihat pada hubungan antara sumber daya yang tersedia dan hasil kegiatan. Namun, tercapainya keluaran belum tentu menunjukkan bahwa pembagian anggaran sudah tepat atau mencukupi kebutuhan setiap unit.",
            "rekomendasi": "Pisahkan kecukupan alokasi (KK), alignment prioritas (IPPN), anggaran berbasis kinerja (SAKIP), kualitas proses satker (IKPA). Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KU.1.3_SS4-IKPA.2.4.1": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi tidak langsung karena penempatan pegawai sesuai kebutuhan dapat membantu kelancaran pengelolaan Uang Persediaan dan Tambahan Uang Persediaan. Kapabilitas Kelembagaan menilai kecukupan serta kesesuaian pegawai dengan beban kerja unit, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai ketepatan penggunaan dan pertanggungjawaban dana tersebut. Hubungan keduanya terjadi melalui kesiapan petugas yang menjalankan pekerjaan administrasi. Oleh karena itu, pengelolaan dana yang tertib belum dapat dijadikan bukti bahwa penempatan pegawai sudah merata dan sesuai kebutuhan organisasi.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KU.2.1_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena penyederhanaan struktur organisasi dapat memperlancar proses kerja dan membantu pencapaian hasil kegiatan. Kapabilitas Kelembagaan menilai pengaruh penyederhanaan terhadap kejelasan tanggung jawab, koordinasi, kecepatan proses, dan efisiensi, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian serta pelaporan keluaran dalam Daftar Isian Pelaksanaan Anggaran. Keterkaitannya tampak pada penyelesaian kegiatan, tetapi aspek yang dinilai berbeda. Capaian keluaran yang baik belum cukup untuk membuktikan bahwa struktur organisasi telah lebih sederhana dan proses kerjanya lebih efisien.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KU.2.2_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena pembagian tugas dan fungsi yang jelas membantu setiap unit menjalankan tanggung jawabnya dalam mencapai hasil kegiatan. Kapabilitas Kelembagaan menilai ketepatan pengelompokan fungsi dan pencegahan tumpang tindih tugas antarunit, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian serta pelaporan keluaran kegiatan dalam Daftar Isian Pelaksanaan Anggaran. Keterkaitannya terlihat pada pelaksanaan target organisasi, tetapi kedua indikator menilai aspek yang berbeda. Tercapainya keluaran belum cukup untuk menunjukkan bahwa pembagian tugas dan fungsi sudah tepat.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KP.1.1_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena proses kerja yang terhubung dengan baik antarunit membantu penyelesaian kegiatan sesuai target. Kapabilitas Kelembagaan menilai kejelasan alur kerja, penyerahan hasil pekerjaan, dan pengurangan hambatan koordinasi, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian serta ketepatan pelaporan keluaran dalam Daftar Isian Pelaksanaan Anggaran. Hubungannya terlihat pada kelancaran pelaksanaan kegiatan. Namun, keluaran yang tercapai belum tentu menunjukkan bahwa proses kerja antarunit sudah tertata baik atau bebas dari pengulangan pekerjaan.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KP.1.2_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena koordinasi proses kerja antarinstansi berkaitan dengan penyelesaian kegiatan yang memerlukan kontribusi beberapa lembaga. Kapabilitas Kelembagaan menilai kejelasan pembagian peran, pertukaran informasi, dan kesinambungan pelaksanaan pekerjaan bersama, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian serta pelaporan keluaran kegiatan pada satuan kerja. Hubungannya terlihat pada pencapaian hasil kegiatan yang melibatkan beberapa instansi. Namun, capaian satu instansi belum cukup untuk menilai mutu koordinasi dan kontribusi seluruh pihak yang terlibat.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KP.2.1_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena mekanisme pengambilan keputusan yang jelas membantu pelaksanaan kegiatan berjalan tepat waktu dan sesuai tujuan. Kapabilitas Kelembagaan menilai tahapan keputusan, batas kewenangan, penggunaan data, koordinasi, dan pencatatan keputusan, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian serta pelaporan keluaran dalam Daftar Isian Pelaksanaan Anggaran. Hubungannya terlihat pada kelancaran pelaksanaan tugas, tetapi yang dinilai berbeda. Keberhasilan mencapai target kegiatan belum cukup untuk membuktikan bahwa seluruh keputusan telah diambil melalui prosedur yang tepat.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KP.2.2_SS4-IKPA.1.2.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena keputusan yang memerlukan koordinasi antarinstansi dapat memengaruhi ketepatan rencana dan pelaksanaan kegiatan. Kapabilitas Kelembagaan menilai kejelasan kesepakatan, pembagian kewenangan, dan tindak lanjut keputusan dengan pihak lain, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai kesesuaian penarikan dana bulanan dengan rencana pada Halaman III Daftar Isian Pelaksanaan Anggaran. Hubungan keduanya terlihat dalam pelaksanaan kegiatan yang memerlukan koordinasi. Namun, penarikan dana yang tepat waktu belum cukup untuk menunjukkan bahwa pengambilan keputusan antarinstansi telah berjalan efektif.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KP.3.1_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena sasaran yang ditetapkan bersama oleh beberapa unit berkaitan dengan keluaran kegiatan yang harus dicapai dan dilaporkan. Kapabilitas Kelembagaan menilai kejelasan tujuan, pembagian kontribusi, dan tanggung jawab setiap unit, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian keluaran dalam Daftar Isian Pelaksanaan Anggaran serta ketepatan pelaporannya. Keterkaitannya terletak pada pencapaian target organisasi. Namun, tingginya capaian keluaran belum cukup untuk memastikan bahwa pembagian kontribusi dan koordinasi antarunit sudah berjalan baik.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KP.3.2_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena tujuan yang disepakati beberapa instansi dapat dijabarkan menjadi kegiatan dan hasil yang perlu dicapai. Kapabilitas Kelembagaan menilai kejelasan tujuan, pembagian kontribusi, dan pelaksanaan kerja sama antarinstansi, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian serta pelaporan keluaran kegiatan pada satuan kerja. Keterkaitannya terlihat pada pencapaian target yang disepakati. Namun, keberhasilan satuan kerja mencapai keluarannya belum cukup untuk menggambarkan keberhasilan kerja sama seluruh instansi yang terlibat.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KP.3.3_SS4-IKPA.1.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena keselarasan sasaran, program, jadwal, dan kebutuhan sumber daya berkaitan dengan mutu perencanaan anggaran. Kapabilitas Kelembagaan menilai apakah rencana antarunit disusun secara selaras sejak awal, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai pengelolaan revisi Daftar Isian Pelaksanaan Anggaran. Keterkaitannya terletak pada konsistensi perencanaan kegiatan. Namun, sedikitnya revisi anggaran belum cukup untuk membuktikan bahwa seluruh unit telah menyusun rencana yang selaras dan terkoordinasi dengan baik.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.TK.1.1_SS4-IKPA.2.4.1": {
            "jenis": "Tidak Langsung",
            "alasan": "Relasi tidak langsung karena kebijakan dan prosedur kerja yang jelas dapat membantu menciptakan ketertiban administrasi, termasuk dalam pengelolaan Uang Persediaan dan Tambahan Uang Persediaan. Kapabilitas Kelembagaan menilai kejelasan, pelaksanaan, serta perbaikan kebijakan kerja internal, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai ketepatan penggunaan dan pertanggungjawaban dana tersebut. Keterkaitannya terletak pada penerapan aturan dalam pekerjaan sehari-hari. Namun, tertibnya administrasi dana belum cukup untuk menyimpulkan bahwa seluruh kebijakan dan prosedur kerja organisasi sudah efektif.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.TK.1.2_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena pembagian peran dan koordinasi tim internal berkaitan dengan kelancaran penyelesaian kegiatan. Kapabilitas Kelembagaan menilai kejelasan tugas, pelaksanaan pekerjaan, serta evaluasi tim, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian keluaran dan ketepatan pelaporannya. Keterkaitannya terlihat pada pelaksanaan target organisasi, tetapi fokus penilaiannya berbeda. Capaian keluaran yang baik belum cukup untuk membuktikan bahwa tim telah bekerja efektif atau setiap anggota memahami dan menjalankan tanggung jawabnya dengan jelas.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.TK.1.3_SS4-IKPA.3.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena koordinasi antarunit membantu penyelesaian kegiatan yang membutuhkan kontribusi beberapa bagian organisasi. Kapabilitas Kelembagaan menilai pembagian peran, kelancaran koordinasi, penyelesaian pekerjaan, dan evaluasi tim yang melibatkan beberapa unit, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai capaian keluaran serta ketepatan pelaporan dalam Daftar Isian Pelaksanaan Anggaran. Hubungannya terlihat pada pencapaian hasil kegiatan, tetapi cakupan penilaiannya berbeda. Keluaran yang tercapai belum tentu membuktikan bahwa koordinasi antarunit sudah efektif dan pembagian tanggung jawab telah berjalan tepat.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.TK.2.1_SS4-IKPA.2.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena budaya kerja yang disiplin dan berorientasi hasil berkaitan dengan ketepatan pelaksanaan kegiatan serta penggunaan anggaran. Kapabilitas Kelembagaan menilai penerapan budaya kerja melalui kebijakan, keteladanan pimpinan, dan perilaku pegawai, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai realisasi belanja dibandingkan dengan target penyerapan. Keterkaitannya terlihat pada disiplin pelaksanaan kegiatan, tetapi aspek yang diukur berbeda. Penyerapan anggaran sesuai rencana belum cukup untuk membuktikan bahwa budaya kerja telah diterapkan secara konsisten.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.TK.3.1_SS4-IKPA.2.1.1": {
            "jenis": "Langsung",
            "alasan": "Relasi langsung karena pengendalian risiko membantu menjaga pelaksanaan kegiatan dan penggunaan anggaran agar tidak menyimpang dari rencana. Kapabilitas Kelembagaan menilai penerapan kebijakan, pengenalan, penanganan, dan pemantauan risiko organisasi, sedangkan Indikator Kinerja Pelaksanaan Anggaran menilai realisasi belanja dibandingkan dengan target penyerapan. Keterkaitannya terlihat pada upaya menjaga kelancaran kegiatan, tetapi kedua indikator tidak menilai hal yang identik. Penyerapan anggaran yang baik belum cukup untuk memastikan bahwa seluruh risiko telah dikenali dan ditangani secara memadai.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. Jangan gunakan penyerapan sebagai proksi tunggal kapabilitas; bedakan alokasi, proses pelaksanaan, dan output."
        },
        "SS4-KK.KF.1.1_SS4-IPA.4.2.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator memiliki hubungan yang saling mendukung, tetapi fokus penilaiannya berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Relevansi menilai kesesuaian tugas dan fungsi instansi dengan mandat organisasi, sedangkan IPA menilai penetapan status penggunaan Barang Milik Negara (BMN). Kejelasan tugas dan kewenangan organisasi dapat mendukung pengelolaan BMN yang baik, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK perlu difokuskan pada kesesuaian tugas dan fungsi organisasi, sedangkan IPA pada penetapan status penggunaan BMN, dengan memastikan tidak terjadi pengulangan aspek penilaian.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KF.1.2_SS4-IPA.4.1.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah hingga sedang. Penjelasan: KK Implementasi menilai sejauh mana unit organisasi menjalankan tugas dan fungsinya untuk mendukung target instansi, sedangkan IPA menilai pencapaian target sertifikasi Barang Milik Negara (BMN). Pelaksanaan tugas dan fungsi yang baik dapat mendukung keberhasilan sertifikasi BMN, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada pelaksanaan tugas dan fungsi unit organisasi dengan bukti pembagian peran dan pelaksanaan fungsi, sedangkan IPA pada hasil sertifikasi BMN dengan bukti pencapaian target dan sertifikat, agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KF.2.1_SS4-IPA.4.2.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Delegasi Kewenangan menilai kesesuaian pengambilan keputusan dengan pembagian kewenangan dalam organisasi, sedangkan IPA menilai kesesuaian penggunaan Barang Milik Negara (BMN) dengan Standar Barang dan Standar Kebutuhan (SBSK). Pembagian kewenangan yang jelas dapat mendukung penggunaan BMN sesuai ketentuan, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada kejelasan pelimpahan kewenangan dan kepatuhan dalam pengambilan keputusan, sedangkan IPA pada kesesuaian penggunaan BMN dengan SBSK, agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KF.2.2_SS4-IPA.4.1.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Implementasi menilai sejauh mana pembagian kewenangan mendukung kelancaran tugas, tanggung jawab, dan kinerja organisasi, sedangkan IPA menilai pencapaian target sertifikasi Barang Milik Negara (BMN). Pelaksanaan kewenangan yang baik dapat mendukung penyelesaian sertifikasi BMN, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada efektivitas pelaksanaan kewenangan dalam mendukung kinerja organisasi, sedangkan IPA pada pencapaian target sertifikasi BMN, dengan memastikan aspek dan bukti penilaian tidak digunakan secara berulang.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KF.3.1_SS4-IPA.4.2.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Relevansi Unsur Pembantu Pemimpin menilai kesesuaian fungsi dalam koordinasi, perumusan kebijakan, dan dukungan kepada pimpinan, sedangkan IPA menilai kesesuaian penggunaan Barang Milik Negara (BMN) dengan Standar Barang dan Standar Kebutuhan (SBSK). Fungsi koordinasi dan dukungan pimpinan yang baik dapat membantu memastikan penggunaan BMN sesuai kebutuhan organisasi, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada kesesuaian fungsi unsur pembantu pimpinan, sedangkan IPA pada kesesuaian penggunaan BMN dengan SBSK, dengan memastikan aspek dan bukti penilaian tidak digunakan secara berulang.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KF.3.2_SS4-IPA.3.1.0": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator memiliki keterkaitan langsung dalam fungsi pengawasan, dengan potensi tumpang tindih sedang hingga tinggi, meskipun fokus penilaiannya berbeda. Penjelasan: KK Relevansi Unsur Pengawas menilai kesesuaian peran, kapasitas, dan pelaksanaan fungsi pengawasan dalam organisasi, sedangkan IPA menilai efektivitas pengawasan dan tindak lanjut pengelolaan Barang Milik Negara (BMN). Keduanya sama-sama berkaitan dengan pengawasan, tetapi KK berfokus pada fungsi pengawasan secara umum, sedangkan IPA pada hasil pengawasan aset. Tindak Lanjut: Penilaian KK difokuskan pada kejelasan peran, independensi, kapasitas, dan pelaksanaan fungsi pengawas, sedangkan IPA pada efektivitas pengawasan serta penyelesaian tindak lanjut pengelolaan BMN, agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "Jadikan SPIP ukuran efektivitas pengendalian; KK fokus pada desain fungsi, independensi, pemilik risiko, dan jalur eskalasi. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KF.3.3_SS4-IPA.4.2.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Relevansi Unsur Pendukung menilai kesesuaian fungsi layanan pendukung dengan kebutuhan organisasi dan kelancaran pelaksanaan tugas, sedangkan IPA menilai kesesuaian penggunaan Barang Milik Negara (BMN) dengan Standar Barang dan Standar Kebutuhan (SBSK). Layanan pendukung yang baik dapat membantu memastikan penggunaan BMN sesuai kebutuhan organisasi, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada kesesuaian fungsi layanan pendukung, sedangkan IPA pada kesesuaian penggunaan BMN dengan SBSK. Gunakan bukti sesuai fokus masing-masing indikator agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KU.1.1_SS4-IPA.4.2.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Relevansi Unsur Pendukung menilai kesesuaian fungsi layanan pendukung dengan kebutuhan organisasi dan kelancaran pelaksanaan tugas, sedangkan IPA menilai kesesuaian penggunaan Barang Milik Negara (BMN) dengan Standar Barang dan Standar Kebutuhan (SBSK). Layanan pendukung yang baik dapat membantu memastikan penggunaan BMN sesuai kebutuhan organisasi, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada kesesuaian fungsi layanan pendukung, sedangkan IPA pada kesesuaian penggunaan BMN dengan SBSK. Gunakan bukti sesuai fokus masing-masing indikator agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK mengukur kecukupan/distribusi kapasitas; SPIP kompetensi untuk kontrol; SAKIP kecukupan evaluator; ELPPD dukungan personel urusan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KU.1.2_SS4-IPA.4.2.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam memastikan kecukupan dan pemanfaatan sumber daya organisasi, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Alokasi Anggaran menilai kecukupan anggaran berdasarkan beban kerja dan kebutuhan pelaksanaan tugas, sedangkan IPA menilai kesesuaian penggunaan Barang Milik Negara (BMN) dengan Standar Barang dan Standar Kebutuhan (SBSK). Alokasi anggaran yang tepat dapat mendukung pemanfaatan BMN sesuai kebutuhan organisasi, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada kecukupan anggaran untuk mendukung pelaksanaan tugas, sedangkan IPA pada kesesuaian penggunaan BMN dengan SBSK, dengan menggunakan bukti sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "Pisahkan kecukupan alokasi (KK), alignment prioritas (IPPN), anggaran berbasis kinerja (SAKIP), kualitas proses satker (IKPA). IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KU.1.3_SS4-IPA.4.2.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Pasangan ini cenderung komplementer dengan risiko redundansi rendah; hubungan sebab-akibat tidak boleh diperlakukan sebagai kesamaan konstruk. Penjelasan dan bukti objektif: indikator KK “Disrtribusi Sumber Daya Manusia” pada kelompok “1. Rentang Kendali” (SS4-KK.KU.1.3) berfungsi sebagai indikator input/kecukupan distribusi SDM dan mengukur keseimbangan jumlah serta kompetensi pegawai dengan kebutuhan dan beban kerja unit organisasi; indikator pembanding Indeks Pengelolaan Aset (IPA) “SS4-IPA.4.2.1” mengukur kesesuaian penggunaan BMN dengan Standar Barang dan Standar Kebutuhan (SBSK). Irisan keduanya berada pada kecukupan sumber daya serta efisiensi pemanfaatan BMN. Perbedaannya: IPA mengukur kepatuhan dan hasil pengelolaan BMN, sedangkan KK mengukur kapasitas organisasi umum, bukan status atau penyelesaian aset. Kesamaan rumus, denominator, unit analisis, periode, dan sumber bukti perlu diverifikasi sebelum redundansi dinyatakan final. Solusi/langkah selanjutnya: Pisahkan KK untuk desain fungsi/kapasitas pengelola dan IPA untuk kinerja/kepatuhan BMN; jangan gunakan status atau penyelesaian aset sebagai skor KK; untuk aspek ini, gunakan bukti spesifik pada Disrtribusi Sumber Daya Manusia dan jangan menilai ulang variabel kesesuaian penggunaan BMN dengan Standar Barang dan Standar Kebutuhan (SBSK).",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KU.2.1_SS4-IPA.4.2.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam meningkatkan efisiensi organisasi dan pemanfaatan sumber daya, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Penyederhanaan menilai dampak penyederhanaan struktur organisasi terhadap kejelasan tanggung jawab, kelancaran koordinasi, dan efisiensi kerja, sedangkan IPA menilai kesesuaian penggunaan Barang Milik Negara (BMN) dengan Standar Barang dan Standar Kebutuhan (SBSK). Penyederhanaan organisasi dapat mendukung penggunaan BMN yang lebih efisien, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada dampak penyederhanaan struktur dan proses kerja organisasi, sedangkan IPA pada kesesuaian penggunaan BMN dengan SBSK, dengan menggunakan bukti sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KU.2.2_SS4-IPA.2.1.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam memperjelas pembagian tugas dan meningkatkan ketertiban pengelolaan aset, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Pengelompokan Tugas dan Fungsi menilai ketepatan pembagian tugas antarunit agar tidak terjadi tumpang tindih tanggung jawab, sedangkan IPA menilai ketepatan waktu dan kelengkapan dokumen Rencana Kebutuhan Barang Milik Negara (RKBMN). Pembagian tugas yang jelas dapat mendukung penyusunan RKBMN yang tertib dan tepat waktu, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada kejelasan pembagian tugas dan fungsi antarunit, sedangkan IPA pada ketepatan waktu dan kelengkapan dokumen RKBMN, dengan menggunakan bukti sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK menilai desain struktur dan ketepatan fungsi; SPIP menilai peran struktur dalam lingkungan pengendalian. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KP.1.1_SS4-IPA.2.1.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam meningkatkan keterpaduan proses kerja dan ketertiban administrasi, dengan potensi tumpang tindih sedang, namun memiliki fokus penilaian yang berbeda. Penjelasan: KK Keterhubungan Proses Internal menilai kelancaran alur kerja dan koordinasi antarunit untuk mengurangi hambatan serta pengulangan pekerjaan, sedangkan IPA menilai ketepatan waktu dan kelengkapan dokumen Rencana Kebutuhan Barang Milik Negara (RKBMN). Keterpaduan proses kerja yang baik dapat mendukung penyusunan RKBMN secara tertib dan tepat waktu, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada keterpaduan alur kerja antarunit dengan bukti peta proses bisnis dan SOP, sedangkan IPA pada ketepatan waktu dan kelengkapan dokumen RKBMN, agar tidak terjadi pengulangan penilaian.`",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KP.1.2_SS4-IPA.1.1.0": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam meningkatkan koordinasi dan akuntabilitas pengelolaan aset, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Keterhubungan Proses Eksternal menilai keterpaduan kerja sama, pembagian peran, dan pertukaran informasi antarinstansi, sedangkan IPA menilai tindak lanjut temuan Laporan Hasil Pemeriksaan (LHP) BPK terkait pengelolaan Barang Milik Negara (BMN). Koordinasi antarinstansi yang baik dapat mendukung penyelesaian temuan pemeriksaan, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada efektivitas koordinasi dan keterpaduan proses kerja antarinstansi, sedangkan IPA pada penyelesaian tindak lanjut temuan LHP BPK terkait BMN, dengan menggunakan bukti sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KP.2.1_SS4-IPA.2.1.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam meningkatkan ketertiban pengambilan keputusan dan pengelolaan administrasi, dengan potensi tumpang tindih sedang, tetapi memiliki fokus penilaian yang berbeda. Penjelasan: KK Mekanisme Pengambilan Keputusan Internal menilai kejelasan prosedur, kewenangan, koordinasi, dan penggunaan data dalam pengambilan keputusan, sedangkan IPA menilai ketepatan waktu dan kelengkapan dokumen Rencana Kebutuhan Barang Milik Negara (RKBMN). Mekanisme pengambilan keputusan yang baik dapat mendukung penyusunan RKBMN secara tertib dan tepat waktu, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada proses dan mekanisme pengambilan keputusan internal, sedangkan IPA pada ketepatan waktu dan kelengkapan dokumen RKBMN, dengan memastikan bukti penilaian sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KP.2.2_SS4-IPA.3.2.0": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam meningkatkan koordinasi pengambilan keputusan dan pengelolaan aset, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Mekanisme Pengambilan Keputusan Eksternal menilai kejelasan koordinasi, pembagian kewenangan, dan tindak lanjut keputusan antarinstansi, sedangkan IPA menilai penyelesaian tindak lanjut atas Barang Milik Negara (BMN) yang rusak berat. Koordinasi dan pengambilan keputusan yang baik dapat mendukung penyelesaian masalah BMN, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada mekanisme koordinasi dan pengambilan keputusan antarinstansi, sedangkan IPA pada penyelesaian tindak lanjut BMN yang rusak berat, dengan menggunakan bukti sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KP.3.1_SS4-IPA.4.2.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Pasangan ini cenderung komplementer dengan risiko redundansi rendah; hubungan sebab-akibat tidak boleh diperlakukan sebagai kesamaan konstruk. Penjelasan dan bukti objektif: indikator KK “Shared-Outcomes Internal” pada kelompok “3. Proses Perencanaan” (SS4-KK.KP.3.1) berfungsi sebagai indikator proses perencanaan dan tata kelola hasil bersama internal dan mengukur penetapan sasaran/hasil bersama, indikator bersama, serta pembagian kontribusi antarunit internal; indikator pembanding Indeks Pengelolaan Aset (IPA) “SS4-IPA.4.2.2” mengukur penetapan status penggunaan Barang Milik Negara (BMN). Irisan keduanya berada pada proses, dokumentasi, keputusan, dan koordinasi pengelolaan aset. Perbedaannya: IPA mengukur kepatuhan dan hasil pengelolaan BMN, sedangkan KK mengukur kapasitas organisasi umum, bukan status atau penyelesaian aset. Kesamaan rumus, denominator, unit analisis, periode, dan sumber bukti perlu diverifikasi sebelum redundansi dinyatakan final. Solusi/langkah selanjutnya: Pisahkan KK untuk desain fungsi/kapasitas pengelola dan IPA untuk kinerja/kepatuhan BMN; jangan gunakan status atau penyelesaian aset sebagai skor KK; untuk aspek ini, gunakan bukti spesifik pada Shared-Outcomes Internal dan jangan menilai ulang variabel penetapan status penggunaan Barang Milik Negara (BMN).",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KP.3.2_SS4-IPA.4.1.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Pasangan ini cenderung komplementer dengan risiko redundansi rendah; hubungan sebab-akibat tidak boleh diperlakukan sebagai kesamaan konstruk. Penjelasan dan bukti objektif: indikator KK “Shared-Outcomes Eksternal” pada kelompok “3. Proses Perencanaan” (SS4-KK.KP.3.2) berfungsi sebagai indikator proses perencanaan dan tata kelola hasil bersama eksternal dan mengukur tujuan, indikator/target, kontribusi para pihak, dan bukti pelaksanaan hasil bersama lintas instansi; indikator pembanding Indeks Pengelolaan Aset (IPA) “SS4-IPA.4.1.2” mengukur penuntasan target sertifikasi BMN. Irisan keduanya berada pada proses, dokumentasi, keputusan, dan koordinasi pengelolaan aset. Perbedaannya: IPA mengukur kepatuhan dan hasil pengelolaan BMN, sedangkan KK mengukur kapasitas organisasi umum, bukan status atau penyelesaian aset. Kesamaan rumus, denominator, unit analisis, periode, dan sumber bukti perlu diverifikasi sebelum redundansi dinyatakan final. Solusi/langkah selanjutnya: Pisahkan KK untuk desain fungsi/kapasitas pengelola dan IPA untuk kinerja/kepatuhan BMN; jangan gunakan status atau penyelesaian aset sebagai skor KK; untuk aspek ini, gunakan bukti spesifik pada Shared-Outcomes Eksternal dan jangan menilai ulang variabel penuntasan target sertifikasi BMN.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.KP.3.3_SS4-IPA.4.1.2": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam meningkatkan koordinasi pengambilan keputusan dan pengelolaan aset, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Mekanisme Pengambilan Keputusan Eksternal menilai kejelasan koordinasi, pembagian kewenangan, dan tindak lanjut keputusan antarinstansi, sedangkan IPA menilai penyelesaian tindak lanjut atas Barang Milik Negara (BMN) yang rusak berat. Koordinasi dan pengambilan keputusan yang baik dapat mendukung penyelesaian masalah BMN, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada mekanisme koordinasi dan pengambilan keputusan antarinstansi, sedangkan IPA pada penyelesaian tindak lanjut BMN yang rusak berat, dengan menggunakan bukti sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK menilai kapasitas desain/peran; IPPN menilai kepatuhan/konsistensi rencana; SAKIP menilai siklus manajemen kinerja; CKKP menilai capaian. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.TK.1.1_SS4-IPA.3.1.0": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Pasangan ini cenderung komplementer dengan risiko redundansi rendah; hubungan sebab-akibat tidak boleh diperlakukan sebagai kesamaan konstruk. Penjelasan dan bukti objektif: indikator KK “Kebijakan” pada kelompok “1. Sistem Kerja” (SS4-KK.TK.1.1) berfungsi sebagai indikator tata kelola kebijakan sistem kerja dan mengukur kematangan kebijakan internal sistem kerja, penerapannya, dan tindak lanjut perbaikan proses bisnis/SOP; indikator pembanding Indeks Pengelolaan Aset (IPA) “SS4-IPA.3.1.0” mengukur efektivitas pengawasan/pengendalian BMN dan tindak lanjut pemanfaatan, pemindahtanganan, atau penghapusan. Irisan keduanya berada pada kebijakan, tim, budaya, dan pengendalian risiko dalam tata kelola BMN. Perbedaannya: IPA mengukur kepatuhan dan hasil pengelolaan BMN, sedangkan KK mengukur kapasitas organisasi umum, bukan status atau penyelesaian aset. Kesamaan rumus, denominator, unit analisis, periode, dan sumber bukti perlu diverifikasi sebelum redundansi dinyatakan final. Solusi/langkah selanjutnya: Pisahkan KK untuk desain fungsi/kapasitas pengelola dan IPA untuk kinerja/kepatuhan BMN; jangan gunakan status atau penyelesaian aset sebagai skor KK; untuk aspek ini, gunakan bukti spesifik pada Kebijakan dan jangan menilai ulang variabel efektivitas pengawasan/pengendalian BMN dan tindak lanjut pemanfaatan, pemindahtanganan, atau penghapusan.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.TK.1.2_SS4-IPA.2.1.1": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam meningkatkan efektivitas kerja tim dan ketertiban pengelolaan aset, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Tim Kerja Internal menilai pembentukan tim, pembagian peran, pelaksanaan tugas, dan evaluasi kinerja tim, sedangkan IPA menilai ketepatan waktu dan kelengkapan dokumen Rencana Kebutuhan Barang Milik Negara (RKBMN). Tim kerja yang terorganisasi dengan baik dapat mendukung penyusunan RKBMN secara tertib dan tepat waktu, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada pembentukan, pelaksanaan, dan evaluasi tim kerja internal, sedangkan IPA pada ketepatan waktu dan kelengkapan dokumen RKBMN, dengan menggunakan bukti sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.TK.1.3_SS4-IPA.1.1.0": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Pasangan ini cenderung komplementer dengan risiko redundansi rendah; hubungan sebab-akibat tidak boleh diperlakukan sebagai kesamaan konstruk. Penjelasan dan bukti objektif: indikator KK “Tim Kerja Lintas Unit Organisasi” pada kelompok “1. Sistem Kerja” (SS4-KK.TK.1.3) berfungsi sebagai indikator proses pembentukan dan pelaksanaan tim lintas unit dan mengukur pembentukan dan efektivitas tim lintas unit melalui kejelasan peran, koordinasi, keluaran, dan umpan balik; indikator pembanding Indeks Pengelolaan Aset (IPA) “SS4-IPA.1.1.0” mengukur akuntabilitas dan produktivitas pengelolaan BMN melalui tindak lanjut temuan LHP BPK. Irisan keduanya berada pada kebijakan, tim, budaya, dan pengendalian risiko dalam tata kelola BMN. Perbedaannya: IPA mengukur kepatuhan dan hasil pengelolaan BMN, sedangkan KK mengukur kapasitas organisasi umum, bukan status atau penyelesaian aset. Kesamaan rumus, denominator, unit analisis, periode, dan sumber bukti perlu diverifikasi sebelum redundansi dinyatakan final. Solusi/langkah selanjutnya: Pisahkan KK untuk desain fungsi/kapasitas pengelola dan IPA untuk kinerja/kepatuhan BMN; jangan gunakan status atau penyelesaian aset sebagai skor KK; untuk aspek ini, gunakan bukti spesifik pada Tim Kerja Lintas Unit Organisasi dan jangan menilai ulang variabel akuntabilitas dan produktivitas pengelolaan BMN melalui tindak lanjut temuan LHP BPK.",
            "rekomendasi": "KK menilai arsitektur proses/kolaborasi; SPIP komunikasi dan risiko; SAKIP crosscutting; CKKP realisasi kontribusi. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.TK.2.1_SS4-IPA.3.1.0": {
            "jenis": "Langsung",
            "alasan": "Pernyataan: Kedua indikator saling mendukung dalam membangun budaya kerja yang baik dan meningkatkan efektivitas pengawasan aset, tetapi memiliki fokus penilaian yang berbeda sehingga risiko tumpang tindih relatif rendah. Penjelasan: KK Implementasi Budaya Kerja menilai penerapan nilai dan perilaku kerja melalui pembinaan, keteladanan, dan pengelolaan SDM, sedangkan IPA menilai efektivitas pengawasan dan tindak lanjut pengelolaan Barang Milik Negara (BMN). Budaya kerja yang baik dapat mendorong kepatuhan dan tanggung jawab dalam pengelolaan BMN, namun keduanya tidak mengukur hal yang sama. Tindak Lanjut: Penilaian KK difokuskan pada penerapan budaya dan perilaku kerja dalam organisasi, sedangkan IPA pada efektivitas pengawasan serta tindak lanjut pemanfaatan, pemindahtanganan, atau penghapusan BMN, dengan menggunakan bukti sesuai fokus masing-masing agar tidak terjadi pengulangan penilaian.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        },
        "SS4-KK.TK.3.1_SS4-IPA.3.1.0": {
            "jenis": "Langsung",
            "alasan": "Pernyataan langsung: Pasangan ini memiliki potensi tumpang tindih konseptual sedang hingga tinggi, tetapi belum otomatis identik secara operasional. Penjelasan dan bukti objektif: indikator KK “Implementasi” pada kelompok “3. Pengendalian Risiko” (SS4-KK.TK.3.1) berfungsi sebagai indikator proses pengendalian risiko dan mengukur penerapan kebijakan pengendalian risiko, identifikasi/mitigasi, pemantauan, dan tindak lanjut risiko; indikator pembanding Indeks Pengelolaan Aset (IPA) “SS4-IPA.3.1.0” mengukur efektivitas pengawasan/pengendalian BMN dan tindak lanjut pemanfaatan, pemindahtanganan, atau penghapusan. Irisan keduanya berada pada pengendalian risiko organisasi beririsan dengan pengawasan/pengendalian risiko khusus pada pengelolaan BMN. Perbedaannya: IPA mengukur kepatuhan dan hasil pengelolaan BMN, sedangkan KK mengukur kapasitas organisasi umum, bukan status atau penyelesaian aset. Kesamaan rumus, denominator, unit analisis, periode, dan sumber bukti perlu diverifikasi sebelum redundansi dinyatakan final. Solusi/langkah selanjutnya: KK mengukur kerangka risiko lintas organisasi dan pemilik risiko; IPA mengukur tindak lanjut pengendalian aset secara spesifik; pertahankan keduanya dengan memisahkan register risiko korporat dari bukti tindak lanjut kasus/temuan BMN.",
            "rekomendasi": "Periksa konstruk, unit analisis, formula, periode, bukti, dan fungsi keputusan sebelum menetapkan perlakuan. IPA menjadi ukuran utama kinerja BMN; KK cukup menilai desain fungsi dan kapasitas pengelola aset."
        }
    },
sasaran5Justifikasi: {
      "IPP.ASPEK FONDASI TEKNIS_OP.Proses": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan oP.Proses pada OP.Proses agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Proses_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Proses pada OP.Proses saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan oP.Proses pada OP.Proses dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK FONDASI TEKNIS_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK FONDASI TEKNIS_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK FONDASI TEKNIS_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Transparansi dan Partisipasi Publik_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IPP.ASPEK FONDASI TEKNIS_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IPP.ASPEK FONDASI TEKNIS_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS."
      },
      "IPP.ASPEK FONDASI TEKNIS_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK FONDASI TEKNIS_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS."
      },
      "IPP.ASPEK FONDASI TEKNIS_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IPP.ASPEK FONDASI TEKNIS_OP.Pengaduan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan oP.Pengaduan pada OP.Pengaduan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Pengaduan_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan oP.Pengaduan pada OP.Pengaduan dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Perencanaan Kebijakan_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar dokumen serta target perencanaan tetap konsisten."
      },
      "IPP.ASPEK FONDASI TEKNIS_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "IKK.Implementasi Kebijakan_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK FONDASI TEKNIS_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK FONDASI TEKNIS_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS."
      },
      "IPP.ASPEK FONDASI TEKNIS_ZI.Penataan Sistem Manajemen SDM Aparatur": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS mendukung pengukuran zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS guna memperkuat zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur."
      },
      "ZI.Penataan Sistem Manajemen SDM Aparatur_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur mendukung pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur guna memperkuat iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS."
      },
      "IPP.ASPEK FONDASI TEKNIS_OP.Kepercayaan Masyarakat": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Kepercayaan Masyarakat_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK FONDASI TEKNIS_ZI.Birokrasi yang Bersih dan Akuntabel": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS saling melengkapi dengan pengukuran zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS dengan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Birokrasi yang Bersih dan Akuntabel_IPP.ASPEK FONDASI TEKNIS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel saling melengkapi dengan pengukuran iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS.",
            "rekomendasi": "Disarankan menyinkronkan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel dengan iPP.ASPEK FONDASI TEKNIS pada IPP.ASPEK FONDASI TEKNIS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_OP.Proses": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS saling melengkapi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dengan oP.Proses pada OP.Proses agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Proses_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Proses pada OP.Proses saling melengkapi dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyinkronkan oP.Proses pada OP.Proses dengan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Transparansi dan Partisipasi Publik_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS saling melengkapi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik saling melengkapi dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyinkronkan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_OP.Pengaduan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS saling melengkapi dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dengan oP.Pengaduan pada OP.Pengaduan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Pengaduan_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan saling melengkapi dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyinkronkan oP.Pengaduan pada OP.Pengaduan dengan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Implementasi Kebijakan_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Perencanaan Kebijakan_IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS agar dokumen serta target perencanaan tetap konsisten."
      },
      "IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS pada IPP.ASPEK AKSESIBILITAS DAN INKLUSIVITAS dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_OP.Pengaduan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan oP.Pengaduan pada OP.Pengaduan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Pengaduan_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan oP.Pengaduan pada OP.Pengaduan dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_OP.Proses": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan oP.Proses pada OP.Proses agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Proses_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Proses pada OP.Proses saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan oP.Proses pada OP.Proses dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Transparansi dan Partisipasi Publik_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Perencanaan Kebijakan_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar dokumen serta target perencanaan tetap konsisten."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "IKK.Implementasi Kebijakan_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_ZI.Pelayanan Publik yang Prima": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Pelayanan Publik yang Prima_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK KETERLIBATAN MASYARAKAT_ZI.Birokrasi yang Bersih dan Akuntabel": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT saling melengkapi dengan pengukuran zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT dengan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Birokrasi yang Bersih dan Akuntabel_IPP.ASPEK KETERLIBATAN MASYARAKAT": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel saling melengkapi dengan pengukuran iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT.",
            "rekomendasi": "Disarankan menyinkronkan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel dengan iPP.ASPEK KETERLIBATAN MASYARAKAT pada IPP.ASPEK KETERLIBATAN MASYARAKAT agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_IPP.ASPEK EFEKTIVITAS PEMERINTAHAN": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN."
      },
      "IPP.ASPEK EFEKTIVITAS PEMERINTAHAN_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IPP.ASPEK EFEKTIVITAS PEMERINTAHAN_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN saling melengkapi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_IPP.ASPEK EFEKTIVITAS PEMERINTAHAN": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik saling melengkapi dengan pengukuran iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN.",
            "rekomendasi": "Disarankan menyinkronkan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK EFEKTIVITAS PEMERINTAHAN_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_IPP.ASPEK EFEKTIVITAS PEMERINTAHAN": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN."
      },
      "IPP.ASPEK EFEKTIVITAS PEMERINTAHAN_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_IPP.ASPEK EFEKTIVITAS PEMERINTAHAN": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Transparansi dan Partisipasi Publik_IPP.ASPEK EFEKTIVITAS PEMERINTAHAN": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IPP.ASPEK EFEKTIVITAS PEMERINTAHAN_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IPP.ASPEK EFEKTIVITAS PEMERINTAHAN_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_IPP.ASPEK EFEKTIVITAS PEMERINTAHAN": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IPP.ASPEK EFEKTIVITAS PEMERINTAHAN_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_IPP.ASPEK EFEKTIVITAS PEMERINTAHAN": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat iPP.ASPEK EFEKTIVITAS PEMERINTAHAN pada IPP.ASPEK EFEKTIVITAS PEMERINTAHAN."
      },
      "IKK.Transparansi dan Partisipasi Publik_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik."
      },
      "OP.Input_ZI.Penataan Sistem Manajemen SDM Aparatur": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur."
      },
      "ZI.Penataan Sistem Manajemen SDM Aparatur_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_ZI.Penguatan Akuntabilitas": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas."
      },
      "ZI.Penguatan Akuntabilitas_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas guna memperkuat oP.Input pada OP.Input."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Implementasi Kebijakan_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_IKK.Implementasi Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan."
      },
      "OP.Input_ZI.Birokrasi yang Bersih dan Akuntabel": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel."
      },
      "ZI.Birokrasi yang Bersih dan Akuntabel_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel guna memperkuat oP.Input pada OP.Input."
      },
      "OP.Input_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Input pada OP.Input mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_OP.Input": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat oP.Input pada OP.Input."
      },
      "IKK.Perencanaan Kebijakan_OP.Input": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran oP.Input pada OP.Input.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan oP.Input pada OP.Input agar dokumen serta target perencanaan tetap konsisten."
      },
      "OP.Input_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian oP.Input pada OP.Input memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Input pada OP.Input dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "OP.Proses_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Potensi Tumpang Tindih",
            "alasan": "Penilaian oP.Proses pada OP.Proses berpotensi tumpang tindih dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik karena kesamaan fokus evaluasi.",
            "rekomendasi": "Disarankan menyatukan pemanfaatan data dan bukti dukung antara oP.Proses pada OP.Proses dan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik guna menghindari duplikasi pemenuhan evaluasi."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_OP.Proses": {
            "jenis": "Potensi Tumpang Tindih",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik berpotensi tumpang tindih dengan pengukuran oP.Proses pada OP.Proses karena kesamaan fokus evaluasi.",
            "rekomendasi": "Disarankan menyatukan pemanfaatan data dan bukti dukung antara zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dan oP.Proses pada OP.Proses guna menghindari duplikasi pemenuhan evaluasi."
      },
      "OP.Proses_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Proses pada OP.Proses saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan oP.Proses pada OP.Proses dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_OP.Proses": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan oP.Proses pada OP.Proses agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_OP.Proses": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat oP.Proses pada OP.Proses."
      },
      "OP.Proses_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Proses pada OP.Proses mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Proses pada OP.Proses guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Implementasi Kebijakan_OP.Proses": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan oP.Proses pada OP.Proses agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Proses_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Proses pada OP.Proses saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan oP.Proses pada OP.Proses dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Proses_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Proses pada OP.Proses mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Proses pada OP.Proses guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_OP.Proses": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat oP.Proses pada OP.Proses."
      },
      "OP.Proses_ZI.Penataan Sistem Manajemen SDM Aparatur": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Proses pada OP.Proses mendukung pengukuran zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur.",
            "rekomendasi": "Disarankan menyelaraskan oP.Proses pada OP.Proses guna memperkuat zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur."
      },
      "ZI.Penataan Sistem Manajemen SDM Aparatur_OP.Proses": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur mendukung pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur guna memperkuat oP.Proses pada OP.Proses."
      },
      "OP.Proses_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Proses pada OP.Proses saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan oP.Proses pada OP.Proses dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_OP.Proses": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan oP.Proses pada OP.Proses agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Proses_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Proses pada OP.Proses mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Proses pada OP.Proses guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_OP.Proses": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat oP.Proses pada OP.Proses."
      },
      "IKK.Transparansi dan Partisipasi Publik_OP.Proses": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan oP.Proses pada OP.Proses agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "OP.Proses_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian oP.Proses pada OP.Proses beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara oP.Proses pada OP.Proses dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IKK.Perencanaan Kebijakan_OP.Proses": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan oP.Proses pada OP.Proses agar dokumen serta target perencanaan tetap konsisten."
      },
      "OP.Proses_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian oP.Proses pada OP.Proses memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Proses pada OP.Proses dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "OP.Proses_ZI.Birokrasi yang Bersih dan Akuntabel": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Proses pada OP.Proses saling melengkapi dengan pengukuran zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel.",
            "rekomendasi": "Disarankan menyinkronkan oP.Proses pada OP.Proses dengan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Birokrasi yang Bersih dan Akuntabel_OP.Proses": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel saling melengkapi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyinkronkan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel dengan oP.Proses pada OP.Proses agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Proses_ZI.Pelayanan Publik yang Prima": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Proses pada OP.Proses saling melengkapi dengan pengukuran zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima.",
            "rekomendasi": "Disarankan menyinkronkan oP.Proses pada OP.Proses dengan zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Pelayanan Publik yang Prima_OP.Proses": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima saling melengkapi dengan pengukuran oP.Proses pada OP.Proses.",
            "rekomendasi": "Disarankan menyinkronkan zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima dengan oP.Proses pada OP.Proses agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_ZI.Birokrasi yang Bersih dan Akuntabel": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Birokrasi yang Bersih dan Akuntabel_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_ZI.Pelayanan Publik yang Prima": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Pelayanan Publik yang Prima_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_OP.Ouput": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat oP.Output pada OP.Ouput."
      },
      "OP.Ouput_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Output pada OP.Ouput mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Output pada OP.Ouput guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Implementasi Kebijakan_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Ouput_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Output pada OP.Ouput mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Output pada OP.Ouput guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_OP.Ouput": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat oP.Output pada OP.Ouput."
      },
      "OP.Ouput_ZI.Penataan Sistem Manajemen SDM Aparatur": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Output pada OP.Ouput mendukung pengukuran zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur.",
            "rekomendasi": "Disarankan menyelaraskan oP.Output pada OP.Ouput guna memperkuat zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur."
      },
      "ZI.Penataan Sistem Manajemen SDM Aparatur_OP.Ouput": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur mendukung pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur guna memperkuat oP.Output pada OP.Ouput."
      },
      "OP.Ouput_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Output pada OP.Ouput saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan oP.Output pada OP.Ouput dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_OP.Ouput": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran oP.Output pada OP.Ouput.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan oP.Output pada OP.Ouput agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Transparansi dan Partisipasi Publik_OP.Pengaduan": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan oP.Pengaduan pada OP.Pengaduan agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "OP.Pengaduan_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara oP.Pengaduan pada OP.Pengaduan dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "OP.Pengaduan_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Pengaduan pada OP.Pengaduan guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_OP.Pengaduan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat oP.Pengaduan pada OP.Pengaduan."
      },
      "OP.Pengaduan_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan saling melengkapi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyinkronkan oP.Pengaduan pada OP.Pengaduan dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_OP.Pengaduan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik saling melengkapi dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyinkronkan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan oP.Pengaduan pada OP.Pengaduan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Pengaduan_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan oP.Pengaduan pada OP.Pengaduan dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_OP.Pengaduan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan oP.Pengaduan pada OP.Pengaduan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Pengaduan_ZI.Penataan Sistem Manajemen SDM Aparatur": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan mendukung pengukuran zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur.",
            "rekomendasi": "Disarankan menyelaraskan oP.Pengaduan pada OP.Pengaduan guna memperkuat zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur."
      },
      "ZI.Penataan Sistem Manajemen SDM Aparatur_OP.Pengaduan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur mendukung pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur guna memperkuat oP.Pengaduan pada OP.Pengaduan."
      },
      "OP.Pengaduan_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan oP.Pengaduan pada OP.Pengaduan dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_OP.Pengaduan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan oP.Pengaduan pada OP.Pengaduan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Implementasi Kebijakan_OP.Pengaduan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan oP.Pengaduan pada OP.Pengaduan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Pengaduan_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan oP.Pengaduan pada OP.Pengaduan dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Pengaduan_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Pengaduan pada OP.Pengaduan guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_OP.Pengaduan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat oP.Pengaduan pada OP.Pengaduan."
      },
      "IKK.Perencanaan Kebijakan_OP.Pengaduan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan oP.Pengaduan pada OP.Pengaduan agar dokumen serta target perencanaan tetap konsisten."
      },
      "OP.Pengaduan_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Pengaduan pada OP.Pengaduan dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_OP.Pengaduan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran oP.Pengaduan pada OP.Pengaduan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat oP.Pengaduan pada OP.Pengaduan."
      },
      "OP.Pengaduan_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Pengaduan pada OP.Pengaduan mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Pengaduan pada OP.Pengaduan guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "OP.Kepercayaan Masyarakat_ZI.Penataan Sistem Manajemen SDM Aparatur": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat mendukung pengukuran zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur.",
            "rekomendasi": "Disarankan menyelaraskan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat guna memperkuat zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur."
      },
      "ZI.Penataan Sistem Manajemen SDM Aparatur_OP.Kepercayaan Masyarakat": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur mendukung pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur guna memperkuat oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat."
      },
      "OP.Kepercayaan Masyarakat_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_OP.Kepercayaan Masyarakat": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat."
      },
      "OP.Kepercayaan Masyarakat_ZI.Birokrasi yang Bersih dan Akuntabel": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat saling melengkapi dengan pengukuran zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel.",
            "rekomendasi": "Disarankan menyinkronkan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat dengan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Birokrasi yang Bersih dan Akuntabel_OP.Kepercayaan Masyarakat": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel saling melengkapi dengan pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyinkronkan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel dengan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Kepercayaan Masyarakat_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat saling melengkapi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyinkronkan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_OP.Kepercayaan Masyarakat": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik saling melengkapi dengan pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyinkronkan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Kepercayaan Masyarakat_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_OP.Kepercayaan Masyarakat": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Kepercayaan Masyarakat_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_OP.Kepercayaan Masyarakat": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Implementasi Kebijakan_OP.Kepercayaan Masyarakat": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Kepercayaan Masyarakat_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_OP.Kepercayaan Masyarakat": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat."
      },
      "OP.Kepercayaan Masyarakat_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "OP.Kepercayaan Masyarakat_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_OP.Kepercayaan Masyarakat": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat oP.Kepercayaan Masyarakat pada OP.Kepercayaan Masyarakat."
      },
      "IKK.Implementasi Kebijakan_OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan."
      },
      "OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan."
      },
      "OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat oP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan pada OP.Kepatuhan terhadap Tindakan Korektif, Saran Perbaikan, dan/atau Saran Penyempurnaan."
      },
      "IKK.Perencanaan Kebijakan_ZI.Penataan Tatalaksana": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar dokumen serta target perencanaan tetap konsisten."
      },
      "ZI.Penataan Tatalaksana_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "IKK.Perencanaan Kebijakan_ZI.Penguatan Akuntabilitas": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar dokumen serta target perencanaan tetap konsisten."
      },
      "ZI.Penguatan Akuntabilitas_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "IKK.Perencanaan Kebijakan_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar dokumen serta target perencanaan tetap konsisten."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "IKK.Perencanaan Kebijakan_ZI.Penguatan Pengawasan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan memiliki keselarasan perencanaan dengan pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan dengan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan agar dokumen serta target perencanaan tetap konsisten."
      },
      "ZI.Penguatan Pengawasan_IKK.Perencanaan Kebijakan": {
            "jenis": "Keselarasan Perencanaan",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan memiliki keselarasan perencanaan dengan pengukuran iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan dengan iKK.Perencanaan Kebijakan pada IKK.Perencanaan Kebijakan agar dokumen serta target perencanaan tetap konsisten."
      },
      "IKK.Implementasi Kebijakan_ZI.Penataan Tatalaksana": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penataan Tatalaksana_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Implementasi Kebijakan_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_IKK.Implementasi Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan."
      },
      "IKK.Implementasi Kebijakan_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Implementasi Kebijakan_ZI.Penguatan Akuntabilitas": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Penguatan Akuntabilitas_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Implementasi Kebijakan_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_IKK.Implementasi Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan."
      },
      "IKK.Implementasi Kebijakan_ZI.Penataan Sistem Manajemen SDM Aparatur": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan mendukung pengukuran zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan guna memperkuat zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur."
      },
      "ZI.Penataan Sistem Manajemen SDM Aparatur_IKK.Implementasi Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur mendukung pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur guna memperkuat iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan."
      },
      "IKK.Implementasi Kebijakan_ZI.Birokrasi yang Bersih dan Akuntabel": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan saling melengkapi dengan pengukuran zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel.",
            "rekomendasi": "Disarankan menyinkronkan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan dengan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel agar kedua instrumen saling melengkapi secara terpadu."
      },
      "ZI.Birokrasi yang Bersih dan Akuntabel_IKK.Implementasi Kebijakan": {
            "jenis": "Saling Melengkapi",
            "alasan": "Penilaian zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel saling melengkapi dengan pengukuran iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan.",
            "rekomendasi": "Disarankan menyinkronkan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel dengan iKK.Implementasi Kebijakan pada IKK.Implementasi Kebijakan agar kedua instrumen saling melengkapi secara terpadu."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_ZI.Penataan Tatalaksana": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana."
      },
      "ZI.Penataan Tatalaksana_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_ZI.Penguatan Akuntabilitas": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas."
      },
      "ZI.Penguatan Akuntabilitas_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_ZI.Birokrasi yang Bersih dan Akuntabel": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel."
      },
      "ZI.Birokrasi yang Bersih dan Akuntabel_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Birokrasi yang Bersih dan Akuntabel pada ZI.Birokrasi yang Bersih dan Akuntabel guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_ZI.Pelayanan Publik yang Prima": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima."
      },
      "ZI.Pelayanan Publik yang Prima_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Pelayanan Publik yang Prima pada ZI.Pelayanan Publik yang Prima guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Evaluasi dan Keberlanjutan Kebijakan_ZI.Penataan Sistem Manajemen SDM Aparatur": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan mendukung pengukuran zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan guna memperkuat zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur."
      },
      "ZI.Penataan Sistem Manajemen SDM Aparatur_IKK.Evaluasi dan Keberlanjutan Kebijakan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur mendukung pengukuran iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penataan Sistem Manajemen SDM Aparatur pada ZI.Penataan Sistem Manajemen SDM Aparatur guna memperkuat iKK.Evaluasi dan Keberlanjutan Kebijakan pada IKK.Evaluasi dan Keberlanjutan Kebijakan."
      },
      "IKK.Transparansi dan Partisipasi Publik_ZI.Penataan Tatalaksana": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "ZI.Penataan Tatalaksana_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara zI.Penataan Tatalaksana pada ZI.Penataan Tatalaksana dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IKK.Transparansi dan Partisipasi Publik_ZI.Peningkatan Kualitas Pelayanan Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "ZI.Peningkatan Kualitas Pelayanan Publik_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara zI.Peningkatan Kualitas Pelayanan Publik pada ZI.Peningkatan Kualitas Pelayanan Publik dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IKK.Transparansi dan Partisipasi Publik_ZI.Manajemen Perubahan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik mendukung pengukuran zI.Manajemen Perubahan pada ZI.Manajemen Perubahan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik guna memperkuat zI.Manajemen Perubahan pada ZI.Manajemen Perubahan."
      },
      "ZI.Manajemen Perubahan_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Manajemen Perubahan pada ZI.Manajemen Perubahan mendukung pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan zI.Manajemen Perubahan pada ZI.Manajemen Perubahan guna memperkuat iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik."
      },
      "IKK.Transparansi dan Partisipasi Publik_ZI.Penguatan Akuntabilitas": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik beririsan substansi dengan pengukuran zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik dan zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "ZI.Penguatan Akuntabilitas_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Beririsan Substansi",
            "alasan": "Penilaian zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas beririsan substansi dengan pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan pemenuhan dan bukti dukung antara zI.Penguatan Akuntabilitas pada ZI.Penguatan Akuntabilitas dan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik agar substansi yang beririsan dikelola secara konsisten tanpa duplikasi."
      },
      "IKK.Transparansi dan Partisipasi Publik_ZI.Penguatan Pengawasan": {
            "jenis": "Mendukung",
            "alasan": "Penilaian iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik mendukung pengukuran zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan.",
            "rekomendasi": "Disarankan menyelaraskan iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik guna memperkuat zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan."
      },
      "ZI.Penguatan Pengawasan_IKK.Transparansi dan Partisipasi Publik": {
            "jenis": "Mendukung",
            "alasan": "Penilaian zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan mendukung pengukuran iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik.",
            "rekomendasi": "Disarankan menyelaraskan zI.Penguatan Pengawasan pada ZI.Penguatan Pengawasan guna memperkuat iKK.Transparansi dan Partisipasi Publik pada IKK.Transparansi dan Partisipasi Publik."
      }
},
    describeCardItem: describeCardItem,
    buildCardPairJustifikasi: buildCardPairJustifikasi,

    // Resolusi Klasifikasi Sasaran 4 (Internal: KK -> 7 Indeks Pembanding)
    classifySasaran4: function (srcGroup, dstInst, dstGroup, srcCode, dstCode, srcLabel, dstLabel, subSrc, subDst) {
      if (srcCode && dstCode && this.sasaran4Justifikasi) {
        const exactKey = `${srcCode}_${dstCode}`;
        const revKey = `${dstCode}_${srcCode}`;
        const found = this.sasaran4Justifikasi[exactKey] || this.sasaran4Justifikasi[revKey];
        if (found) {
          return {
            jenis: found.jenis,
            status: "Perlu Validasi",
            alasan: found.alasan,
            rekomendasi: found.rekomendasi || ""
          };
        }
      }

      const sg = String(srcGroup || "");
      const di = String(dstInst || "");
      const dg = String(dstGroup || "");
      let jenis = "Beririsan Substansi";

      if (di === "IPPN" || (di === "SAKIP" && dg.toLowerCase().includes("perencanaan"))) {
        jenis = "Keselarasan Perencanaan";
      } else if (di === "CKKP" || di === "ELPPD") {
        jenis = "Mendukung";
      } else if (di === "IPA" || di === "SAKIP") {
        jenis = "Saling Melengkapi";
      } else if (di === "IKPA") {
        if (sg.includes("Rentang Kendali")) jenis = "Potensi Tumpang Tindih";
        else jenis = "Mendukung";
      } else if (di === "SPIP") {
        if (sg.includes("Pengendalian")) jenis = "Beririsan Substansi";
        else if (sg.includes("Perencanaan")) jenis = "Keselarasan Perencanaan";
        else jenis = "Mendukung";
      }

      const pair = buildCardPairJustifikasi(srcCode, dstCode, jenis, subSrc, subDst);
      return {
        jenis: jenis,
        status: "Perlu Validasi",
        alasan: pair.alasan,
        rekomendasi: pair.rekomendasi
      };
    },

    // Helper Tema Indikator Sasaran 5
    getS5Theme: function (inst, code, group, question) {
      const c = String(code || "").toUpperCase();
      const q = String(question || "").toLowerCase();
      const g = String(group || "").toLowerCase();

      if (inst === "IPP") {
        if (c.includes(".FT.1") || q.includes("standar pelayanan") || q.includes("maklumat pelayanan")) return "IPP_STANDAR_LAYANAN";
        if (c.includes(".FT.2") || q.includes("data kinerja") || q.includes("bottleneck") || q.includes("pain point")) return "IPP_DATA_KINERJA";
        if (c.includes(".FT.3") || q.includes("kinerja sdm") || q.includes("skp") || q.includes("kompetensi sdm")) return "IPP_SDM_LAYANAN";
        if (c.includes(".FT.4") || q.includes("anggaran pelayanan")) return "IPP_ANGGARAN_LAYANAN";
        if (c.includes(".AI.1") || q.includes("informasi pelayanan") || q.includes("aksesibilitas informasi")) return "IPP_INFO_LAYANAN";
        if (c.includes(".AI.2") || q.includes("sarana dan prasarana")) return "IPP_SARPRAS_LAYANAN";
        if (c.includes(".AI.3") || q.includes("akomodasi yang layak") || q.includes("kelompok rentan")) return "IPP_AKOMODASI_RENTAN";
        if (c.includes(".AI.4") || q.includes("kanal pelayanan") || q.includes("alternatif akses")) return "IPP_KANAL_LAYANAN";
        if (c.includes(".KM.1") || q.includes("waktu yang dibutuhkan") || q.includes("durasi pengaduan")) return "IPP_WAKTU_ADUAN";
        if (c.includes(".KM.2") || q.includes("sp4n-lapor") || q.includes("aspirasi dan pengaduan")) return "IPP_SP4N_LAPOR";
        if (c.includes(".KM.3") || q.includes("forum konsultasi publik") || q.includes("fkp")) return "IPP_FKP";
        if (c.includes(".KM.4") || q.includes("survei kepuasan masyarakat") || q.includes("skm")) return "IPP_SKM";
        if (c.includes(".EP.1") || q.includes("perubahan layanan setelah inovasi") || q.includes("lompatan inovasi")) return "IPP_HASIL_INOVASI";
        if (c.includes(".EP.2") || q.includes("pembelajaran dari inovasi") || q.includes("perluas manfaat")) return "IPP_EVALUASI_INOVASI";
        return "IPP_LAINNYA";
      }

      if (inst === "ZI") {
        if (c.includes(".PT.1") || q.includes("sop") || q.includes("prosedur operasional")) return "ZI_SOP_TATALAKSANA";
        if (c.includes(".PT.2") || c.includes(".PLKS.2") || q.includes("spbe")) return "ZI_SPBE";
        if (c.includes(".PT.3") || q.includes("keterbukaan informasi") || q.includes("kip") || q.includes("ppid")) return "ZI_KETERBUKAAN_INFO";
        if (c.includes(".PLKS.1") || q.includes("peta proses bisnis") || q.includes("penyederhanaan jabatan")) return "ZI_PROSES_BISNIS";
        if (c.includes(".PLKS.3") || q.includes("transformasi digital")) return "ZI_TRANSFORMASI_DIGITAL";
        if (c.includes(".PKPP.1") || q.includes("standar pelayanan") || q.includes("maklumat pelayanan")) return "ZI_STANDAR_LAYANAN";
        if (c.includes(".PKPP.2") || q.includes("budaya pelayanan prima") || q.includes("penghargaan dan sanksi") || q.includes("kompensasi")) return "ZI_BUDAYA_PRIMA";
        if (c.includes(".PKPP.3") || q.includes("pengaduan dan konsultasi") || q.includes("sp4n-lapor")) return "ZI_PENGADUAN";
        if (c.includes(".PKPP.4") || q.includes("survey kepuasan masyarakat")) return "ZI_SKM";
        if (c.includes(".PKPP.5") || q.includes("database pelayanan") || q.includes("teknologi informasi")) return "ZI_TI_LAYANAN";
        if (c.includes(".PA.") || c.includes(".PPW.") || g.includes("pengawasan") || q.includes("pengawasan") || q.includes("wbs") || q.includes("benturan") || q.includes("gratifikasi") || q.includes("lhkpn")) return "ZI_PENGAWASAN";
        if (c.includes(".PSMS.") || g.includes("sdm") || q.includes("kinerja individu") || q.includes("disiplin pegawai")) return "ZI_SDM";
        if (c.includes(".PAK.") || g.includes("akuntabilitas") || q.includes("sasaran kinerja") || q.includes("penjenjangan kinerja")) return "ZI_AKUNTABILITAS";
        if (c.includes(".MP.") || g.includes("manajemen perubahan") || q.includes("agen perubahan") || q.includes("role model")) return "ZI_MANAJEMEN_PERUBAHAN";
        if (c.includes(".BBA.5") || q.includes("persepsi korupsi")) return "ZI_PERSEPSI_KORUPSI";
        if (c.includes(".PPP.6") || q.includes("persepsi kualitas pelayanan")) return "ZI_PERSEPSI_LAYANAN";
        return "ZI_LAINNYA";
      }

      if (inst === "OP") {
        if (c.includes(".I.1") || q.includes("pengetahuan tentang") || q.includes("maladministrasi")) return "OP_INPUT_PENGETAHUAN";
        if (c.includes(".I.2") || q.includes("alokasi anggaran") || q.includes("usulan program") || q.includes("indikator kinerja")) return "OP_INPUT_SUMBERDAYA";
        if (c.includes(".P.1") || g.includes("standar pelayanan") || q.includes("dasar hukum") || q.includes("persyaratan") || q.includes("prosedur") || q.includes("biaya") || q.includes("waktu penyelesaian") || q.includes("sarana")) return "OP_PROSES_STANDAR_LAYANAN";
        if (c.includes(".P.2") || q.includes("melawan hukum") || q.includes("wewenang") || q.includes("kelalaian") || q.includes("penundaan") || q.includes("tidak kompeten") || q.includes("penyimpangan") || q.includes("imbalan")) return "OP_PROSES_MALADMINISTRASI";
        if (c.includes(".O.1") || g.includes("ouput") || q.includes("spm") || q.includes("ikm") || q.includes("ipm")) return "OP_OUTPUT_KINERJA";
        if (c.includes(".PN.") || g.includes("pengaduan") || q.includes("pengelolaan pengaduan") || q.includes("penyelesaian pengaduan")) return "OP_PENGADUAN";
        if (c.includes(".KMT.") || g.includes("kepercayaan") || q.includes("integritas") || q.includes("tata kelola") || q.includes("tindakan korektif")) return "OP_KEPERCAYAAN_PUBLIK";
        return "OP_LAINNYA";
      }

      if (inst === "IKK") {
        if (c.includes(".PK.") || g.includes("perencanaan") || q.includes("data dan informasi yang valid") || q.includes("pemangku kepentingan") || q.includes("dampak kebijakan")) return "IKK_PERENCANAAN_KEBIJAKAN";
        if (c.includes(".IK.") || g.includes("implementasi") || q.includes("koordinasi dan komunikasi") || q.includes("efektif di lapangan")) return "IKK_IMPLEMENTASI_KEBIJAKAN";
        if (c.includes(".EKK.") || g.includes("evaluasi") || q.includes("dievaluasi untuk perbaikan") || q.includes("dampak yang terukur")) return "IKK_EVALUASI_KEBIJAKAN";
        if (c.includes(".TPP.") || g.includes("transparansi") || q.includes("dapat diakses oleh publik") || q.includes("memberikan masukan")) return "IKK_TRANSPARANSI_PARTISIPASI";
        return "IKK_LAINNYA";
      }

      return "LAINNYA";
    },

    // Resolusi Klasifikasi Sasaran 5 (Internal) Berdasarkan Substansi Spesifik Pasangan Indikator
    classifySasaran5: function (srcGroup, dstGroup, srcInst, dstInst, srcCode, dstCode, srcQuestion, dstQuestion, subSrc, subDst) {
      const thA = this.getS5Theme(srcInst, srcCode, srcGroup, srcQuestion);
      const thB = this.getS5Theme(dstInst, dstCode, dstGroup, dstQuestion);

      let t1 = thA, t2 = thB;
      let i1 = srcInst, i2 = dstInst;

      if (srcInst !== "IPP" && dstInst === "IPP") {
        t1 = thB; t2 = thA;
        i1 = dstInst; i2 = srcInst;
      } else if (srcInst === "ZI" && dstInst === "OP") {
        t1 = thB; t2 = thA;
        i1 = dstInst; i2 = srcInst;
      }

      let jenis = "Mendukung";

      // 1. IPP - ZI
      if (i1 === "IPP" && i2 === "ZI") {
        if (t1 === "IPP_INFO_LAYANAN" && t2 === "ZI_KETERBUKAAN_INFO") jenis = "Beririsan Substansi";
        else if (t1 === "IPP_INFO_LAYANAN" && t2 === "ZI_SOP_TATALAKSANA") jenis = "Mendukung";
        else if (t1 === "IPP_STANDAR_LAYANAN" && t2 === "ZI_SOP_TATALAKSANA") jenis = "Mendukung";
        else if (t1 === "IPP_STANDAR_LAYANAN" && t2 === "ZI_STANDAR_LAYANAN") jenis = "Beririsan Substansi";
        else if (t1 === "IPP_SP4N_LAPOR" && (t2 === "ZI_PENGADUAN" || t2 === "ZI_PENGAWASAN")) jenis = "Potensi Tumpang Tindih";
        else if (t1 === "IPP_WAKTU_ADUAN" && (t2 === "ZI_PENGAWASAN" || t2 === "ZI_PENGADUAN")) jenis = "Mendukung";
        else if (t1 === "IPP_SDM_LAYANAN" && t2 === "ZI_SDM") jenis = "Mendukung";
        else if (t1 === "IPP_DATA_KINERJA" && (t2 === "ZI_TI_LAYANAN" || t2 === "ZI_PENGAWASAN")) jenis = "Mendukung";
        else if (t1 === "IPP_KANAL_LAYANAN" && (t2 === "ZI_SPBE" || t2 === "ZI_TRANSFORMASI_DIGITAL")) jenis = "Mendukung";
        else if ((t1 === "IPP_SARPRAS_LAYANAN" || t1 === "IPP_AKOMODASI_RENTAN") && (t2 === "ZI_BUDAYA_PRIMA" || t2 === "ZI_PENGAWASAN")) jenis = "Mendukung";
        else if (t1 === "IPP_SKM" && (t2 === "ZI_SKM" || t2 === "ZI_PERSEPSI_LAYANAN")) jenis = "Beririsan Substansi";
        else if ((t1 === "IPP_HASIL_INOVASI" || t1 === "IPP_EVALUASI_INOVASI") && (t2 === "ZI_TI_LAYANAN" || t2 === "ZI_BUDAYA_PRIMA" || t2 === "ZI_MANAJEMEN_PERUBAHAN")) jenis = "Saling Melengkapi";
        else jenis = "Mendukung";
      }
      // 2. IPP - OP
      else if (i1 === "IPP" && i2 === "OP") {
        if (t1 === "IPP_STANDAR_LAYANAN" && t2 === "OP_PROSES_STANDAR_LAYANAN") jenis = "Potensi Tumpang Tindih";
        else if ((t1 === "IPP_SP4N_LAPOR" || t1 === "IPP_WAKTU_ADUAN") && t2 === "OP_PENGADUAN") jenis = "Beririsan Substansi";
        else if ((t1 === "IPP_SARPRAS_LAYANAN" || t1 === "IPP_AKOMODASI_RENTAN") && (t2 === "OP_INPUT_SUMBERDAYA" || t2 === "OP_PROSES_STANDAR_LAYANAN")) jenis = "Mendukung";
        else if (t1 === "IPP_SKM" && t2 === "OP_OUTPUT_KINERJA") jenis = "Saling Melengkapi";
        else jenis = "Saling Melengkapi";
      }
      // 3. OP - ZI
      else if (i1 === "OP" && i2 === "ZI") {
        if (t1 === "OP_PROSES_MALADMINISTRASI" && t2 === "ZI_PENGAWASAN") jenis = "Saling Melengkapi";
        else if (t1 === "OP_PENGADUAN" && t2 === "ZI_PENGAWASAN") jenis = "Saling Melengkapi";
        else if (t1 === "OP_PROSES_STANDAR_LAYANAN" && t2 === "ZI_STANDAR_LAYANAN") jenis = "Beririsan Substansi";
        else if (t1 === "OP_PROSES_STANDAR_LAYANAN" && t2 === "ZI_SOP_TATALAKSANA") jenis = "Mendukung";
        else if (t1 === "OP_PROSES_MALADMINISTRASI" && t2 === "ZI_SDM") jenis = "Mendukung";
        else jenis = "Mendukung";
      }
      // 4. IKK
      else if (srcInst === "IKK" || dstInst === "IKK") {
        const ikkTh = srcInst === "IKK" ? thA : thB;
        if (ikkTh === "IKK_PERENCANAAN_KEBIJAKAN") jenis = "Keselarasan Perencanaan";
        else if (ikkTh === "IKK_TRANSPARANSI_PARTISIPASI") jenis = "Saling Melengkapi";
        else jenis = "Mendukung";
      }

      const pair = buildCardPairJustifikasi(srcCode, dstCode, jenis, subSrc, subDst);
      return {
        jenis: jenis,
        status: null,
        alasan: pair.alasan,
        rekomendasi: pair.rekomendasi
      };
    },

    // Helper resolusi klasifikasi hubungan (Eksternal: PEMDI sebagai Sumber/Kiri -> Sasaran 2/3/4/5 sebagai Pembanding/Kanan)
    getKlasifikasi: function (sourceGroup, targetGroup, sourceCode, targetCode, sourceDesc, targetDesc, subExt, subPemdi) {
      const pairKey = `${sourceGroup} -> ${targetGroup}`;
      const revPairKey = `${targetGroup} -> ${sourceGroup}`;
      const codeKey = `${sourceCode} -> ${targetCode}`;
      const revCodeKey = `${targetCode} -> ${sourceCode}`;

      const matchedRule = this.rules[pairKey] || this.rules[revPairKey] || this.rules[codeKey] || this.rules[revCodeKey];
      let jenis = matchedRule ? matchedRule.jenis : "Beririsan Substansi";
      let status = matchedRule ? matchedRule.status : "USULAN / Perlu validasi";

      if (!matchedRule) {
        const text = `${sourceGroup || ""} ${targetGroup || ""} ${sourceDesc || ""} ${targetDesc || ""}`.toLowerCase();
        if (text.includes("renstra") || text.includes("renja") || text.includes("rkp") ||
            text.includes("sakip") || text.includes("perencanaan") || text.includes("anggaran") ||
            text.includes("dokumen rencana")) {
          jenis = "Keselarasan Perencanaan";
        } else if ((text.includes("berbagi data") || text.includes("interoperabilitas")) &&
                   (text.includes("inovasi") || text.includes("aplikasi sejenis"))) {
          jenis = "Potensi Tumpang Tindih";
        } else if (text.includes("kompetensi") || text.includes("keamanan") || text.includes("sop") ||
                   text.includes("infrastruktur") || text.includes("pelindungan data") ||
                   text.includes("sumber daya") || text.includes("kapabilitas") || text.includes("data asn")) {
          jenis = "Mendukung";
        } else if (text.includes("evaluasi") || text.includes("pengaduan") || text.includes("kepuasan") ||
                   text.includes("kolaborasi") || text.includes("layanan publik") ||
                   text.includes("survei") || text.includes("monev")) {
          jenis = "Saling Melengkapi";
        }
      }

      // Pada UI Relasi Eksternal: Indikator Sumber (Kiri) = targetCode (PEMDI), Indikator Pembanding (Kanan) = sourceCode (Mitra)
      const leftCode = (targetCode && String(targetCode).startsWith("SS1-PEMDI")) ? targetCode : (sourceCode && String(sourceCode).startsWith("SS1-PEMDI") ? sourceCode : (targetCode || targetGroup));
      const rightCode = (leftCode === targetCode) ? (sourceCode || sourceGroup) : (targetCode || targetGroup);
      const pair = buildCardPairJustifikasi(leftCode, rightCode, jenis, subPemdi, subExt);

      return {
        jenis: jenis,
        status: status,
        alasan: pair.alasan,
        rekomendasi: pair.rekomendasi
      };
    }
  };
})();
