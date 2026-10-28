/**
 * ============================================================================
 * METADATA LAYER KLASIFIKASI SUBSTANSIAL JENIS KETERKAITAN
 * Sesuai Standar 5 Kategori Analitis Reformasi Birokrasi:
 * 1. Mendukung
 * 2. Saling Melengkapi
 * 3. Beririsan Substansi
 * 4. Potensi Tumpang Tindih
 * 5. Keselarasan Perencanaan
 *
 * Mengacu pada identitas grup / pasangan relasi asli tanpa mengubah dataset mentah.
 * Sumber acuan: Bahan paparan Kamis (30092026).xlsx & Katalog Indikator Resmi
 * ============================================================================
 */

(function () {
  "use strict";

  window.RB_JENIS_KETERKAITAN = {
    // 5 Kategori Standar Analitis
    kategori: [
      {
        id: "Mendukung",
        label: "Mendukung",
        deskripsi: "Sumber berperan sebagai dukungan atau prasyarat pelaksanaan/pencapaian tujuan; bukan sekadar menyebut topik sama."
      },
      {
        id: "Saling Melengkapi",
        label: "Saling Melengkapi",
        deskripsi: "Dua indikator mengukur dimensi berbeda namun bersama-sama memberi informasi yang lebih menyeluruh."
      },
      {
        id: "Beririsan Substansi",
        label: "Beririsan Substansi",
        deskripsi: "Beberapa objek, materi, atau aspek penilaian serupa, tetapi konsep/rubrik tidak identik."
      },
      {
        id: "Potensi Tumpang Tindih",
        label: "Potensi Tumpang Tindih",
        deskripsi: "Terdapat indikasi kesamaan substansi/kriteria/bukti dukung yang mungkin menyebabkan pengulangan pengukuran; BELUM berarti duplikasi telah terbukti."
      },
      {
        id: "Keselarasan Perencanaan",
        label: "Keselarasan Perencanaan",
        deskripsi: "Hubungan eksplisit dalam sasaran, rencana kerja, output, penganggaran, atau keselarasan dokumen perencanaan."
      }
    ],

    // Klasifikasi Relasi Eksternal Berdasarkan Pembandingan Substansial Katalog Indikator
    // Key: `${source_group} -> ${target_group}`
    rules: {
      // 1. Sasaran 2 (Sistem Merit) -> Sasaran 1 (Pemerintah Digital)
      // Seluruh 17 relasi terdata merupakan dukungan pengelolaan kompetensi dan data ASN terhadap transformasi digital
      "SS2-SM.DMA.8 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Pengelolaan data manajemen ASN (Sistem Merit) berperan sebagai dukungan dan prasyarat tata kelola data Pemerintah Digital."
      },
      "SS2-SM.DMA.8 -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Data manajemen ASN mendukung pembangunan statistik ASN terintegrasi pada Pemerintah Digital."
      },
      "SS2-SM.PK.4 -> SS1-PEMDI.KLDP.1": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Pengukuran kompetensi ASN berbasis standar kompetensi jabatan mendukung kesiapan proses bisnis layanan digital pemerintah."
      },
      "SS2-SM.PK.4 -> SS1-PEMDI.KLDP.3": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Pengukuran kompetensi ASN mendukung adopsi dan pemanfaatan portal layanan digital pemerintah."
      },
      "SS2-SM.PK.4 -> SS1-PEMDI.P.1": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Pengukuran kompetensi ASN berbasis SKJ mendukung persiapan peningkatan kompetensi digital ASN secara optimal."
      },

      // 2. Sasaran 4 (Kapabilitas Kelembagaan & Perencanaan) -> Sasaran 1 (Pemerintah Digital)
      "SS4-IPPN.1.a -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN/Perlu validasi",
        alasan: "Muatan Renstra K/L selaras dengan sasaran dan target RPJMN dalam tata kelola Pemerintah Digital."
      },
      "SS4-IPPN.1.b -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN/Perlu validasi",
        alasan: "Muatan sasaran dan target Renja K/L konsisten dengan Renstra untuk perencanaan tata kelola Pemerintah Digital."
      },
      "SS4-IPPN.1.c -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN/Perlu validasi",
        alasan: "Output Prioritas dalam Renja K/L selaras dengan output proyek prioritas RKP pada tata kelola Pemerintah Digital."
      },
      "SS4-IPPN.3.a.1 -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN/Perlu validasi",
        alasan: "Penetapan IKU instansi yang ditugaskan menyelaraskan pencapaian target kinerja tata kelola Pemerintah Digital."
      },
      "SS4-KK.KP.1 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN/Perlu validasi",
        alasan: "Keterhubungan proses internal kelembagaan saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit/instansi."
      },
      "SS4-KK.KP.1 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN/Perlu validasi",
        alasan: "Keterhubungan proses internal kelembagaan saling melengkapi dengan tingkat kematangan kolaborasi layanan digital."
      },
      "SS4-KK.KP.3 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN/Perlu validasi",
        alasan: "Penerapan shared-outcomes internal saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit/instansi."
      },
      "SS4-KK.KP.3 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN/Perlu validasi",
        alasan: "Penerapan shared-outcomes internal saling melengkapi dengan kematangan kolaborasi penyelenggaraan layanan digital."
      },
      "SS4-KK.TK.1 -> SS1-PEMDI.KLDP.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN/Perlu validasi",
        alasan: "Kebijakan tata kelola kelembagaan memiliki kesamaan objek pengaturan dengan kebijakan keterpaduan proses bisnis layanan digital."
      },
      "SS4-KK.TK.1 -> SS1-PEMDI.P.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN/Perlu validasi",
        alasan: "Kebijakan kelembagaan beririsan dengan pengaturan kolaborasi penyelenggaraan Pemerintah Digital."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.D.4": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Implementasi tata kelola kelembagaan mendukung pemenuhan standar pelindungan data pribadi pada unit kerja."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.KP.2": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Implementasi tata kelola kelembagaan mendukung pemenuhan tingkat kematangan keamanan informasi Pemerintah Digital."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.KP.4": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Implementasi kelembagaan mendukung kesiapan kapabilitas penanganan insiden siber pada unit kerja."
      },
      "SS4-SAKIP -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN/Perlu validasi",
        alasan: "Akuntabilitas kinerja perencanaan dan pelaporan (SAKIP) menyelaraskan evaluasi tata kelola Pemerintah Digital."
      },

      // 3. Sasaran 3 (Integritas & Inovasi) -> Sasaran 1 (Pemerintah Digital)
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.KLDP.4": {
        jenis: "Potensi Tumpang Tindih",
        status: "USULAN/Perlu validasi",
        alasan: "Indikator aksesibilitas dan berbagi data inovasi berpotensi memiliki kesamaan kriteria dan bukti dukung dengan standar interoperabilitas data Pemerintah Digital; perlu klarifikasi batas pengukuran."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.KLDP.4": {
        jenis: "Potensi Tumpang Tindih",
        status: "USULAN/Perlu validasi",
        alasan: "Pertanyaan survei terkait pemanfaatan dan berbagi data inovasi berpotensi mengukur aspek serupa dengan instrumen interoperabilitas data SPBE/Pemerintah Digital."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.TP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN/Perlu validasi",
        alasan: "Infrastruktur digital fleksibel/adaptif pada inovasi beririsan materi dengan tingkat kematangan infrastruktur Pemerintah Digital, namun rubrik penilaian berbeda."
      },
      "SS3-DIIIP.D1.4 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN/Perlu validasi",
        alasan: "Kolaborasi lintas unit dalam inovasi saling melengkapi dengan kematangan kolaborasi penyelenggaraan Pemerintah Digital."
      },
      "SS3-SPI.B.2 -> SS1-PEMDI.KLDP.1": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Kejelasan SOP pelaksanaan tugas (SPI KPK) mendukung kepastian dan keterpaduan proses bisnis layanan digital pemerintah."
      },

      // 4. Sasaran 5 (Pelayanan Publik) -> Sasaran 1 (Pemerintah Digital)
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.3": {
        jenis: "Saling Melengkapi",
        status: "USULAN/Perlu validasi",
        alasan: "Penerapan teknologi informasi dalam pelayanan publik pada Zona Integritas saling melengkapi dengan portal layanan digital pemerintah terpadu."
      },
      "SS5-IPP.FT.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN/Perlu validasi",
        alasan: "Implementasi standar pelayanan dan maklumat pelayanan beririsan substansi dengan pemenuhan SLA dan fasilitas dukungan layanan digital."
      },
      "SS5-IKK.PK.1 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN/Perlu validasi",
        alasan: "Penyusunan kebijakan pelayanan berbasis data valid mendukung dan memerlukan tata kelola data yang matang pada Pemerintah Digital."
      },
      "SS5-IKK.IK.1 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN/Perlu validasi",
        alasan: "Kejelasan koordinasi pelaksanaan kebijakan saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas instansi."
      }
    },

    // Resolusi Klasifikasi Sasaran 4 (Internal - 50 Relasi) ke dalam 5 Kategori Standar
    classifySasaran4: function (srcGroup, dstInst, dstGroup, srcCode, dstCode, srcLabel, dstLabel) {
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

      const cleanSrc = (srcLabel || srcCode).replace(/^\d+\.\s*/, "").trim();
      const cleanDst = (dstLabel || dstCode).replace(/^\d+\.\s*/, "").trim();
      const alasan = cleanSrc && cleanDst
        ? `"${cleanSrc}" berkaitan dengan "${cleanDst}".`
        : (cleanSrc ? `"${cleanSrc}"` : (cleanDst ? `"${cleanDst}"` : `Keterkaitan antara ${sg} dan ${di}.`));

      return {
        jenis: jenis,
        status: null,
        alasan: alasan
      };
    },

    // Resolusi Klasifikasi Sasaran 5 (Internal) ke dalam 5 Kategori Standar
    classifySasaran5: function (srcGroup, dstGroup, srcInst, dstInst, srcCode, dstCode, srcQuestion, dstQuestion) {
      const sg = String(srcGroup || "");
      const dg = String(dstGroup || "");

      let jenis = "Beririsan Substansi";

      // 1. Keselarasan Perencanaan
      if (sg.includes("Perencanaan") || dg.includes("Perencanaan") || dg.includes("dokumen perencanaan")) {
        jenis = "Keselarasan Perencanaan";
      }
      // 2. Mendukung (Input Anggaran/Sarpras, SDM, Manajemen Perubahan, Penguatan Pengawasan)
      else if (dg === "Input" || sg === "Input" ||
               sg.includes("SDM") || dg.includes("SDM") ||
               sg.includes("Manajemen Perubahan") || dg.includes("Manajemen Perubahan") ||
               sg.includes("Penguatan Pengawasan") || dg.includes("Penguatan Pengawasan")) {
        jenis = "Mendukung";
      }
      // 3. Potensi Tumpang Tindih (Penilaian kriteria standar & pengaduan pada instrumen berbeda)
      else if ((sg.includes("Peningkatan Kualitas Pelayanan") && dg.includes("FONDASI TEKNIS")) ||
               (sg.includes("Pengaduan") && dg.includes("Peningkatan Kualitas Pelayanan"))) {
        jenis = "Potensi Tumpang Tindih";
      }
      // 4. Saling Melengkapi (Keterlibatan Masyarakat, Pengaduan, Ouput, Efektivitas, Kepercayaan, Hasil Survei)
      else if (sg.includes("KETERLIBATAN MASYARAKAT") || dg.includes("KETERLIBATAN MASYARAKAT") ||
               sg.includes("Pengaduan") || dg.includes("Pengaduan") ||
               sg.includes("Ouput") || dg.includes("Ouput") ||
               sg.includes("EFEKTIVITAS") || dg.includes("EFEKTIVITAS") ||
               sg.includes("Kepercayaan") || dg.includes("Kepercayaan") ||
               sg.includes("Pelayanan Publik yang Prima") || dg.includes("Pelayanan Publik yang Prima") ||
               sg.includes("Akuntabilitas") || dg.includes("Akuntabilitas") ||
               sg.includes("Birokrasi yang Bersih") || dg.includes("Birokrasi yang Bersih")) {
        jenis = "Saling Melengkapi";
      }

      // Alasan substantif langsung dari teks indikator yang berada dalam kutip tanpa kata-kata teknis Excel
      let alasan = "";
      if (srcQuestion && dstQuestion) {
        alasan = `"${srcQuestion}" berkaitan dengan "${dstQuestion}".`;
      } else if (srcQuestion) {
        alasan = `"${srcQuestion}"`;
      } else if (dstQuestion) {
        alasan = `"${dstQuestion}"`;
      } else {
        alasan = `Keterkaitan substantif antara ${sg} dan ${dg}.`;
      }

      return {
        jenis: jenis,
        status: null,
        alasan: alasan
      };
    },

    // Helper resolusi klasifikasi hubungan (Eksternal & Umum)
    getKlasifikasi: function (sourceGroup, targetGroup, sourceCode, targetCode, sourceDesc, targetDesc) {
      const pairKey = `${sourceGroup} -> ${targetGroup}`;
      if (this.rules[pairKey]) {
        return this.rules[pairKey];
      }
      const codeKey = `${sourceCode} -> ${targetCode}`;
      if (this.rules[codeKey]) {
        return this.rules[codeKey];
      }

      // Fallback Klasifikasi Substantif Otomatis ke dalam 5 Kategori Standar
      const text = `${sourceGroup || ""} ${targetGroup || ""} ${sourceDesc || ""} ${targetDesc || ""}`.toLowerCase();
      let jenis = "Beririsan Substansi";

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

      let alasan = "";
      if (sourceDesc && targetDesc) {
        alasan = `"${sourceDesc}" berkaitan dengan "${targetDesc}".`;
      } else if (sourceDesc) {
        alasan = `"${sourceDesc}"`;
      } else if (targetDesc) {
        alasan = `"${targetDesc}"`;
      } else {
        alasan = `Keterkaitan operasional antara ${sourceGroup || "indikator sumber"} dan ${targetGroup || "indikator tujuan"}.`;
      }

      return {
        jenis: jenis,
        status: "USULAN/Perlu validasi",
        alasan: alasan
      };
    }
  };
})();
