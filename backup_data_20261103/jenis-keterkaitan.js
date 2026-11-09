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
      "SS2-SM.DMA.8 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengelolaan data manajemen ASN menyediakan basis data kepegawaian yang terstandar dan mutakhir, yang menjadi prasyarat penting dalam penguatan tata kelola data terpadu pada penyelenggaraan Pemerintah Digital."
      },
      "SS2-SM.DMA.8 -> SS1-PEMDI.KLDP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Standardisasi format data manajemen ASN memudahkan pertukaran informasi kepegawaian antarinstansi, sehingga secara langsung mendukung interoperabilitas data pada ekosistem Pemerintah Digital."
      },
      "SS2-SM.DMA.8 -> SS1-PEMDI.KLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Layanan digital manajemen ASN yang terstruktur mempermudah konektivitas modul kepegawaian dengan aplikasi layanan internal lainnya, mendukung percepatan integrasi aplikasi layanan pemerintah."
      },
      "SS2-SM.DMA.8 -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penyelenggaraan aplikasi manajemen kepegawaian yang andal mendukung peningkatan kematangan portofolio aplikasi Pemerintah Digital melalui standardisasi arsitektur sistem informasi."
      },
      "SS2-SM.PK.4 -> SS1-PEMDI.P.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran kompetensi ASN berbasis standar jabatan memberikan pemetaan kapabilitas talenta aparatur, yang mendukung perencanaan program peningkatan kapasitas SDM dalam mengoperasikan sistem Pemerintah Digital."
      },
      "SS3-DIIIP.D1.4 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan budaya kolaborasi dan difusi inovasi saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit dan instansi dalam membangun sinergi lintas unit kerja."
      },
      "SS3-DIIIP.D1.4 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan budaya kolaborasi dan difusi inovasi saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital dalam membangun sinergi lintas unit kerja."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.D.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Aspek pembudayaan inovasi instansi pemerintah beririsan substansi dengan tata kelola dan standardisasi data Pemerintah Digital dalam mendorong modernisasi penyelenggaraan birokrasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.D.3": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Aspek pembudayaan inovasi instansi pemerintah beririsan substansi dengan penyelenggaraan statistik sektoral dan analitika data dalam mendorong modernisasi penyelenggaraan birokrasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.KLDP.4": {
        jenis: "Potensi Tumpang Tindih",
        status: "USULAN / Perlu validasi",
        alasan: "Instrumen pemanfaatan dan berbagi data inovasi berpotensi mengukur objek yang beririsan dengan standar interoperabilitas data Pemerintah Digital, sehingga batas cakupan penilaiannya saling melengkapi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.KLDP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Aspek pembudayaan inovasi instansi pemerintah beririsan substansi dengan integrasi dan konektivitas antar-aplikasi layanan pemerintah dalam mendorong modernisasi penyelenggaraan birokrasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.TP.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Aspek pembudayaan inovasi instansi pemerintah beririsan substansi dengan standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital dalam mendorong modernisasi penyelenggaraan birokrasi."
      },
      "SS3-DIIIP.D1.5 -> SS1-PEMDI.TP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Aspek pembudayaan inovasi instansi pemerintah beririsan substansi dengan keandalan infrastruktur komputasi, jaringan, dan pusat data nasional dalam mendorong modernisasi penyelenggaraan birokrasi."
      },
      "SS3-DIIIP.D2.2 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan budaya kolaborasi dan difusi inovasi saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital dalam membangun sinergi lintas unit kerja."
      },
      "SS3-DIIIP.D2.4 -> SS1-PEMDI.KLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung keterpaduan proses bisnis layanan digital lintas unit dan instansi guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-DIIIP.D3.1 -> SS1-PEMDI.KLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung keterpaduan proses bisnis layanan digital lintas unit dan instansi guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-DIIIP.D3.1 -> SS1-PEMDI.P.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-DIIIP.D3.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pencapaian outcome inovasi terhadap kualitas pelayanan saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital sebagai instrumen monitoring persepsi masyarakat."
      },
      "SS3-IIIP.B3.A -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan budaya kolaborasi dan difusi inovasi saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital dalam membangun sinergi lintas unit kerja."
      },
      "SS3-IIIP.B3.B -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pencapaian outcome inovasi terhadap kualitas pelayanan saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital sebagai instrumen monitoring persepsi masyarakat."
      },
      "SS3-IIIP.B3.B -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pencapaian outcome inovasi terhadap kualitas pelayanan saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital sebagai instrumen monitoring persepsi masyarakat."
      },
      "SS3-IIIP.B3.C -> SS1-PEMDI.KLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung keterpaduan proses bisnis layanan digital lintas unit dan instansi guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.KLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung keterpaduan proses bisnis layanan digital lintas unit dan instansi guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung keandalan infrastruktur komputasi, jaringan, dan pusat data nasional guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung pengelolaan survei dan umpan balik kepuasan pengguna layanan digital guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-IIIP.B4.B -> SS1-PEMDI.TKM.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan inovasi dalam sistem tata kelola organisasi mendukung standar manajemen mutu dan tata kelola siklus hidup layanan digital guna mempercepat transformasi alur kerja manual menuju digital."
      },
      "SS3-IIIP.B4.D -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan budaya kolaborasi dan difusi inovasi saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit dan instansi dalam membangun sinergi lintas unit kerja."
      },
      "SS3-IIIP.B4.D -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan budaya kolaborasi dan difusi inovasi saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital dalam membangun sinergi lintas unit kerja."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kesiapan infrastruktur dan kualitas data inovasi didukung oleh tata kelola dan standardisasi data Pemerintah Digital agar data inovasi memenuhi kaidah satu data yang valid."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kesiapan infrastruktur dan kualitas data inovasi didukung oleh penyelenggaraan statistik sektoral dan analitika data agar data inovasi memenuhi kaidah satu data yang valid."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.KLDP.4": {
        jenis: "Potensi Tumpang Tindih",
        status: "USULAN / Perlu validasi",
        alasan: "Instrumen pemanfaatan dan berbagi data inovasi berpotensi mengukur objek yang beririsan dengan standar interoperabilitas data Pemerintah Digital, sehingga batas cakupan penilaiannya saling melengkapi."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penyelenggaraan inovasi digital instansi saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam meningkatkan efektivitas layanan publik."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.TKM.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penyelenggaraan inovasi digital instansi saling melengkapi dengan standar manajemen mutu dan tata kelola siklus hidup layanan digital dalam meningkatkan efektivitas layanan publik."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Dukungan infrastruktur digital pada instrumen inovasi memanfaatkan fondasi standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital untuk menjamin fleksibilitas dan skalabilitas implementasi inovasi."
      },
      "SS3-IIIP.B4.E -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Dukungan infrastruktur digital pada instrumen inovasi memanfaatkan fondasi keandalan infrastruktur komputasi, jaringan, dan pusat data nasional untuk menjamin fleksibilitas dan skalabilitas implementasi inovasi."
      },
      "SS3-IIIP.B5.B -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pencapaian outcome inovasi terhadap kualitas pelayanan saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital sebagai instrumen monitoring persepsi masyarakat."
      },
      "SS3-IIIP.B5.B -> SS1-PEMDI.D.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pencapaian outcome inovasi terhadap kualitas pelayanan saling melengkapi dengan tata kelola dan standardisasi data Pemerintah Digital sebagai instrumen monitoring persepsi masyarakat."
      },
      "SS3-IIIP.B5.B -> SS1-PEMDI.KLDP.4": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pencapaian outcome inovasi terhadap kualitas pelayanan saling melengkapi dengan interoperabilitas data dan pertukaran informasi antar-sistem digital sebagai instrumen monitoring persepsi masyarakat."
      },
      "SS4-ELPPD.SD -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Ketersediaan data capaian urusan dan makro daerah pada evaluasi LPPD memerlukan dukungan tata kelola dan standardisasi data Pemerintah Digital guna memastikan akurasi rekonsiliasi data sektoral pemerintah daerah."
      },
      "SS4-ELPPD.SD -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Ketersediaan data capaian urusan dan makro daerah pada evaluasi LPPD memerlukan dukungan penyelenggaraan statistik sektoral dan analitika data guna memastikan akurasi rekonsiliasi data sektoral pemerintah daerah."
      },
      "SS4-IPPN.1.a -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Muatan dokumen perencanaan pembangunan nasional (1.a Kepatuhan Renstra K/L terhadap RPJMN) selaras dengan penetapan arah kebijakan arsitektur dan tata kelola Pemerintah Digital guna menjamin keterpaduan program kerja instansi."
      },
      "SS4-IPPN.1.b -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Muatan dokumen perencanaan pembangunan nasional (1.b Konsistensi Renja K/L terhadap Renstra K/L) selaras dengan penetapan arah kebijakan arsitektur dan tata kelola Pemerintah Digital guna menjamin keterpaduan program kerja instansi."
      },
      "SS4-IPPN.1.c -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Muatan dokumen perencanaan pembangunan nasional (1.c Kepatuhan Renja K/L terhadap RKP) selaras dengan penetapan arah kebijakan arsitektur dan tata kelola Pemerintah Digital guna menjamin keterpaduan program kerja instansi."
      },
      "SS4-IPPN.1.c -> SS1-PEMDI.D.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Penyelarasan target prioritas pembangunan (1.c Kepatuhan Renja K/L terhadap RKP) membutuhkan dukungan basis data kinerja yang valid dan terintegrasi melalui tata kelola data Pemerintah Digital yang andal."
      },
      "SS4-IPPN.1.c -> SS1-PEMDI.D.3": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Pemantauan kepatuhan target perencanaan pembangunan (1.c Kepatuhan Renja K/L terhadap RKP) selaras dengan penyediaan indikator statistik sektoral yang akurat pada pilar pembangunan statistik Pemerintah Digital."
      },
      "SS4-IPPN.3.a.1 -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Muatan dokumen perencanaan pembangunan nasional (3.a Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait) selaras dengan penetapan arah kebijakan arsitektur dan tata kelola Pemerintah Digital guna menjamin keterpaduan program kerja instansi."
      },
      "SS4-IPPN.3.a.1 -> SS1-PEMDI.D.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Penyelarasan target prioritas pembangunan (3.a Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait) membutuhkan dukungan basis data kinerja yang valid dan terintegrasi melalui tata kelola data Pemerintah Digital yang andal."
      },
      "SS4-IPPN.3.a.1 -> SS1-PEMDI.D.3": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Pemantauan kepatuhan target perencanaan pembangunan (3.a Target dan Sasaran Prioritas Nasional menjadi Target dan Sasaran Kinerja Instansi Terkait) selaras dengan penyediaan indikator statistik sektoral yang akurat pada pilar pembangunan statistik Pemerintah Digital."
      },
      "SS4-KK.KP.1 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penyusunan peta proses bisnis kelembagaan saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit dalam menciptakan alur kerja birokrasi yang terintegrasi dan efisien."
      },
      "SS4-KK.KP.1 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penataan mekanisme koordinasi internal kelembagaan saling melengkapi dengan penguatan budaya kolaborasi penyelenggaraan Pemerintah Digital antar-satuan kerja."
      },
      "SS4-KK.KP.3 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan perencanaan kolaboratif kelembagaan (3. Proses Perencanaan) saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit dan instansi guna mencegah fragmentasi pelaksanaan tugas digital."
      },
      "SS4-KK.KP.3 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan perencanaan kolaboratif kelembagaan (3. Proses Perencanaan) saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital guna mencegah fragmentasi pelaksanaan tugas digital."
      },
      "SS4-KK.KP.3 -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Penyusunan target kinerja bersama (shared-outcomes) pada proses perencanaan kelembagaan selaras dengan perencanaan tata kelola Pemerintah Digital dalam menyatukan sasaran strategis instansi."
      },
      "SS4-KK.TK.1 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penyusunan peta proses bisnis kelembagaan saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit dalam menciptakan alur kerja birokrasi yang terintegrasi dan efisien."
      },
      "SS4-KK.TK.1 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penataan mekanisme koordinasi internal kelembagaan saling melengkapi dengan penguatan budaya kolaborasi penyelenggaraan Pemerintah Digital antar-satuan kerja."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.D.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan manajemen risiko kelembagaan memberikan kerangka identifikasi ancaman operasional yang mendukung pemenuhan kepatuhan standar pelindungan data pribadi (PDP) pada sistem digital."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.KP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Manajemen risiko kelembagaan memperkuat kepatuhan prosedur operasional yang secara langsung mendukung sistem manajemen keamanan informasi dan ketahanan siber Pemdi dari potensi kerentanan keamanan informasi."
      },
      "SS4-KK.TK.3 -> SS1-PEMDI.KP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Manajemen risiko kelembagaan memperkuat kepatuhan prosedur operasional yang secara langsung mendukung kesiapsiagaan kapabilitas penanganan dan pemulihan insiden siber dari potensi kerentanan keamanan informasi."
      },
      "SS4-SAKIP -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Akuntabilitas kinerja perencanaan dan pelaporan SAKIP menyelaraskan evaluasi capaian program dengan arah kebijakan tata kelola Pemerintah Digital."
      },
      "SS4-SAKIP -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran capaian kinerja organisasi pada SAKIP didukung oleh ketersediaan tata kelola dan standardisasi data Pemerintah Digital sebagai sumber data evaluasi yang terpercaya dan terverifikasi."
      },
      "SS4-SAKIP -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran capaian kinerja organisasi pada SAKIP didukung oleh ketersediaan penyelenggaraan statistik sektoral dan analitika data sebagai sumber data evaluasi yang terpercaya dan terverifikasi."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Evaluasi capaian efektivitas kebijakan publik didukung oleh ketersediaan penyelenggaraan statistik sektoral dan analitika data untuk menyediakan data pertanggungjawaban yang transparan."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Mekanisme akuntabilitas dan pengawasan kebijakan publik mendukung pemenuhan kesiapsiagaan kapabilitas penanganan dan pemulihan insiden siber guna menjaga integritas penyelenggaraan sistem digital."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Mekanisme akuntabilitas dan pengawasan kebijakan publik mendukung pemenuhan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital guna menjaga integritas penyelenggaraan sistem digital."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Evaluasi capaian efektivitas kebijakan publik didukung oleh ketersediaan tata kelola dan standardisasi data Pemerintah Digital untuk menyediakan data pertanggungjawaban yang transparan."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Evaluasi capaian efektivitas kebijakan publik didukung oleh ketersediaan integrasi dan konektivitas antar-aplikasi layanan pemerintah untuk menyediakan data pertanggungjawaban yang transparan."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KLDP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Evaluasi capaian efektivitas kebijakan publik didukung oleh ketersediaan interoperabilitas data dan pertukaran informasi antar-sistem digital untuk menyediakan data pertanggungjawaban yang transparan."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Mekanisme akuntabilitas dan pengawasan kebijakan publik mendukung pemenuhan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis guna menjaga integritas penyelenggaraan sistem digital."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Mekanisme akuntabilitas dan pengawasan kebijakan publik mendukung pemenuhan pelaksanaan audit keamanan teknologi informasi dan kepatuhan sistem guna menjaga integritas penyelenggaraan sistem digital."
      },
      "SS5-IKK.EKK.1 -> SS1-PEMDI.KP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Mekanisme akuntabilitas dan pengawasan kebijakan publik mendukung pemenuhan sistem manajemen keamanan informasi dan ketahanan siber Pemdi guna menjaga integritas penyelenggaraan sistem digital."
      },
      "SS5-IKK.IK.1 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan koordinasi pelaksanaan kebijakan saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit dan instansi dalam menjamin kelancaran implementasi program di lapangan."
      },
      "SS5-IKK.IK.1 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan koordinasi pelaksanaan kebijakan saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital dalam menjamin kelancaran implementasi program di lapangan."
      },
      "SS5-IKK.IK.1 -> SS1-PEMDI.D.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan koordinasi pelaksanaan kebijakan saling melengkapi dengan penyelenggaraan data dan informasi geospasial tematik dalam menjamin kelancaran implementasi program di lapangan."
      },
      "SS5-IKK.PK.1 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penyusunan kebijakan berbasis bukti (evidence-based policy) memerlukan dukungan tata kelola data Pemerintah Digital yang menjamin ketersediaan data yang valid, akurat, dan mutakhir."
      },
      "SS5-IKK.PK.1 -> SS1-PEMDI.KLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penyusunan rancangan kebijakan publik yang berkualitas didukung oleh integrasi dan konektivitas antar-aplikasi layanan pemerintah sebagai instrumen analitis yang kredibel."
      },
      "SS5-IKK.PK.1 -> SS1-PEMDI.TKM.1": {
        jenis: "Keselarasan Perencanaan",
        status: "USULAN / Perlu validasi",
        alasan: "Analisis dampak formulasi kebijakan publik selaras dengan kerangka tata kelola regulasi Pemerintah Digital dalam memastikan kesesuaian arah intervensi kebijakan."
      },
      "SS5-IKK.TPP.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Keterbukaan informasi kebijakan dan kanal aspirasi masyarakat saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam menjamin kemudahan akses dan kepastian layanan bagi publik."
      },
      "SS5-IKK.TPP.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Keterbukaan informasi kebijakan dan kanal aspirasi masyarakat saling melengkapi dengan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dalam menjamin kemudahan akses dan kepastian layanan bagi publik."
      },
      "SS5-IPP.AI.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penyediaan aksesibilitas pelayanan yang inklusif mendukung pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam memberikan kemudahan dan kepastian bagi seluruh lapisan pengguna."
      },
      "SS5-IPP.AI.2 -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kelancaran akses pelayanan publik pada unit kerja didukung oleh keandalan keandalan infrastruktur komputasi, jaringan, dan pusat data nasional yang menjamin ketersediaan sistem tanpa hambatan teknis."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KLDP.3": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penyediaan alternatif kanal pelayanan publik saling melengkapi dengan portal layanan digital pemerintah terpadu dalam memperluas jangkauan akses masyarakat."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penyediaan aksesibilitas pelayanan yang inklusif mendukung penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dalam memberikan kemudahan dan kepastian bagi seluruh lapisan pengguna."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penyediaan aksesibilitas pelayanan yang inklusif mendukung pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam memberikan kemudahan dan kepastian bagi seluruh lapisan pengguna."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.D.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan tata kelola dan standardisasi data Pemerintah Digital dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.D.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan penyelenggaraan data dan informasi geospasial tematik dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.D.4": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan kepatuhan dan tata kelola pelindungan data pribadi (PDP) dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KLDP.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan keterpaduan proses bisnis layanan digital lintas unit dan instansi dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KLDP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan integrasi dan konektivitas antar-aplikasi layanan pemerintah dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KLDP.4": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan interoperabilitas data dan pertukaran informasi antar-sistem digital dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan sistem manajemen keamanan informasi dan ketahanan siber Pemdi dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.KP.3": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan penerapan teknik kriptografi untuk autentisitas dan proteksi data digital dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.TKM.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.TKM.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan standar aksesibilitas pelayanan beririsan substansi dengan standar manajemen mutu dan tata kelola siklus hidup layanan digital dalam menghadirkan layanan publik yang inklusif dan terintegrasi."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kelancaran akses pelayanan publik pada unit kerja didukung oleh keandalan standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital yang menjamin ketersediaan sistem tanpa hambatan teknis."
      },
      "SS5-IPP.AI.4 -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kelancaran akses pelayanan publik pada unit kerja didukung oleh keandalan keandalan infrastruktur komputasi, jaringan, dan pusat data nasional yang menjamin ketersediaan sistem tanpa hambatan teknis."
      },
      "SS5-IPP.EP.1 -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran efektivitas pelayanan publik didukung oleh ketersediaan penyelenggaraan statistik sektoral dan analitika data dalam mendeteksi dan mengevaluasi kinerja operasional layanan."
      },
      "SS5-IPP.EP.1 -> SS1-PEMDI.KP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran efektivitas pelayanan publik didukung oleh ketersediaan kesiapsiagaan kapabilitas penanganan dan pemulihan insiden siber dalam mendeteksi dan mengevaluasi kinerja operasional layanan."
      },
      "SS5-IPP.EP.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran efektivitas pelayanan publik didukung oleh ketersediaan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam mendeteksi dan mengevaluasi kinerja operasional layanan."
      },
      "SS5-IPP.EP.2 -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran efektivitas pelayanan publik didukung oleh ketersediaan penyelenggaraan statistik sektoral dan analitika data dalam mendeteksi dan mengevaluasi kinerja operasional layanan."
      },
      "SS5-IPP.EP.2 -> SS1-PEMDI.KP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran efektivitas pelayanan publik didukung oleh ketersediaan kesiapsiagaan kapabilitas penanganan dan pemulihan insiden siber dalam mendeteksi dan mengevaluasi kinerja operasional layanan."
      },
      "SS5-IPP.EP.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran efektivitas pelayanan publik didukung oleh ketersediaan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam mendeteksi dan mengevaluasi kinerja operasional layanan."
      },
      "SS5-IPP.FT.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan standar dan maklumat pelayanan secara konsisten mendukung penyediaan fasilitas bantuan pengguna layanan digital dengan kepastian prosedur dan waktu penyelesaian."
      },
      "SS5-IPP.FT.1 -> SS1-PEMDI.KLDP.3": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Fondasi teknis penyelenggaraan pelayanan publik saling melengkapi dengan aksesibilitas portal layanan digital pemerintah terpadu satu pintu guna mewujudkan ekosistem birokrasi digital yang efektif."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan standar dan maklumat pelayanan secara konsisten mendukung penyediaan fasilitas bantuan pengguna layanan digital dengan kepastian prosedur dan waktu penyelesaian."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi bottleneck pelayanan didukung oleh tata kelola dan standardisasi data Pemerintah Digital sebagai dasar telaah analitis berbasis data."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.KLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Fondasi teknis penyelenggaraan pelayanan publik saling melengkapi dengan integrasi dan konektivitas antar-aplikasi layanan pemerintah guna mewujudkan ekosistem birokrasi digital yang efektif."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan data kinerja pelayanan publik untuk mengidentifikasi bottleneck pelayanan didukung oleh penyelenggaraan statistik sektoral dan analitika data sebagai dasar telaah analitis berbasis data."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.KLDP.4": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Fondasi teknis penyelenggaraan pelayanan publik saling melengkapi dengan interoperabilitas data dan pertukaran informasi antar-sistem digital guna mewujudkan ekosistem birokrasi digital yang efektif."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Fondasi teknis penyelenggaraan pelayanan publik saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital guna mewujudkan ekosistem birokrasi digital yang efektif."
      },
      "SS5-IPP.FT.2 -> SS1-PEMDI.TKM.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Fondasi teknis penyelenggaraan pelayanan publik saling melengkapi dengan perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital guna mewujudkan ekosistem birokrasi digital yang efektif."
      },
      "SS5-IPP.FT.3 -> SS1-PEMDI.P.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Fondasi teknis penyelenggaraan pelayanan publik saling melengkapi dengan pengembangan kompetensi dan literasi digital aparatur sipil negara guna mewujudkan ekosistem birokrasi digital yang efektif."
      },
      "SS5-IPP.KM.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Tindak lanjut aspirasi dan pengaduan masyarakat melalui SP4N-LAPOR! saling melengkapi dengan penyediaan fasilitas bantuan pengguna (helpdesk) layanan digital dalam menyelesaikan keluhan masyarakat."
      },
      "SS5-IPP.KM.2 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Tindak lanjut aspirasi dan pengaduan masyarakat melalui SP4N-LAPOR! saling melengkapi dengan penyediaan fasilitas bantuan pengguna (helpdesk) layanan digital dalam menyelesaikan keluhan masyarakat."
      },
      "SS5-IPP.KM.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran indeks kepuasan masyarakat (SKM) dan tindak lanjut konsultasi publik saling melengkapi dengan pengelolaan survei kepuasan layanan digital untuk perbaikan mutu berkelanjutan."
      },
      "SS5-IPP.KM.2 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengelolaan saluran keterlibatan masyarakat dan penanganan keluhan publik mendukung penguatan tata kelola dan standardisasi data Pemerintah Digital dalam merespons kebutuhan pengguna secara cepat."
      },
      "SS5-IPP.KM.2 -> SS1-PEMDI.TKM.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengelolaan saluran keterlibatan masyarakat dan penanganan keluhan publik mendukung penguatan perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital dalam merespons kebutuhan pengguna secara cepat."
      },
      "SS5-IPP.KM.3 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran indeks kepuasan masyarakat (SKM) dan tindak lanjut konsultasi publik saling melengkapi dengan pengelolaan survei kepuasan layanan digital untuk perbaikan mutu berkelanjutan."
      },
      "SS5-IPP.KM.3 -> SS1-PEMDI.P.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengelolaan saluran keterlibatan masyarakat dan penanganan keluhan publik mendukung penguatan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital dalam merespons kebutuhan pengguna secara cepat."
      },
      "SS5-IPP.KM.4 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pengukuran indeks kepuasan masyarakat (SKM) dan tindak lanjut konsultasi publik saling melengkapi dengan pengelolaan survei kepuasan layanan digital untuk perbaikan mutu berkelanjutan."
      },
      "SS5-OP.I.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan kepatuhan pengelolaan pengaduan menurut standar Ombudsman saling melengkapi dengan penyediaan fasilitas bantuan pengguna layanan digital untuk mencegah terjadinya maladministrasi."
      },
      "SS5-OP.I.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Tindak lanjut rekomendasi pengawasan pengaduan pelayanan publik saling melengkapi dengan pemantauan kepuasan pengguna layanan digital pemerintah secara berkelanjutan."
      },
      "SS5-OP.I.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan pemenuhan standar pelayanan publik versi Ombudsman saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam mewujudkan tata kelola birokrasi bebas maladministrasi."
      },
      "SS5-OP.I.2 -> SS1-PEMDI.D.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Ketersediaan alokasi dan kelengkapan sarana prasarana operasional pelayanan mendukung keandalan operasional penyelenggaraan data dan informasi geospasial tematik dalam melayani masyarakat."
      },
      "SS5-OP.KMT.1 -> SS1-PEMDI.D.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan kapasitas dan pemahaman petugas pelayanan terhadap regulasi pelayanan publik mendukung pemenuhan standar penyelenggaraan data dan informasi geospasial tematik aparatur dalam menyelenggarakan layanan digital."
      },
      "SS5-OP.KMT.1 -> SS1-PEMDI.P.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan kapasitas dan pemahaman petugas pelayanan terhadap regulasi pelayanan publik mendukung pemenuhan standar pengembangan kompetensi dan literasi digital aparatur sipil negara aparatur dalam menyelenggarakan layanan digital."
      },
      "SS5-OP.KMT.1 -> SS1-PEMDI.KP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Jaminan keamanan fisik dan keselamatan pelayanan pada standar Ombudsman mendukung pelaksanaan audit keamanan teknologi informasi dan kepatuhan sistem guna meningkatkan kepercayaan publik terhadap keandalan sistem birokrasi."
      },
      "SS5-OP.O.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan pemenuhan standar pelayanan publik versi Ombudsman saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam mewujudkan tata kelola birokrasi bebas maladministrasi."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan pemenuhan standar pelayanan publik versi Ombudsman saling melengkapi dengan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dalam mewujudkan tata kelola birokrasi bebas maladministrasi."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Tindak lanjut rekomendasi pengawasan pengaduan pelayanan publik saling melengkapi dengan pemantauan kepuasan pengguna layanan digital pemerintah secara berkelanjutan."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Jaminan keamanan fisik dan keselamatan pelayanan pada standar Ombudsman mendukung sistem manajemen keamanan informasi dan ketahanan siber Pemdi guna meningkatkan kepercayaan publik terhadap keandalan sistem birokrasi."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.D.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan pemenuhan standar pelayanan publik versi Ombudsman saling melengkapi dengan tata kelola dan standardisasi data Pemerintah Digital dalam mewujudkan tata kelola birokrasi bebas maladministrasi."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.D.3": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan pemenuhan standar pelayanan publik versi Ombudsman saling melengkapi dengan penyelenggaraan statistik sektoral dan analitika data dalam mewujudkan tata kelola birokrasi bebas maladministrasi."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan pemenuhan standar pelayanan publik versi Ombudsman saling melengkapi dengan integrasi dan konektivitas antar-aplikasi layanan pemerintah dalam mewujudkan tata kelola birokrasi bebas maladministrasi."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.KLDP.4": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan pemenuhan standar pelayanan publik versi Ombudsman saling melengkapi dengan interoperabilitas data dan pertukaran informasi antar-sistem digital dalam mewujudkan tata kelola birokrasi bebas maladministrasi."
      },
      "SS5-OP.P.1 -> SS1-PEMDI.P.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan kapasitas dan pemahaman petugas pelayanan terhadap regulasi pelayanan publik mendukung pemenuhan standar pengembangan kompetensi dan literasi digital aparatur sipil negara aparatur dalam menyelenggarakan layanan digital."
      },
      "SS5-OP.P.2 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan pemenuhan standar pelayanan publik versi Ombudsman saling melengkapi dengan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dalam mewujudkan tata kelola birokrasi bebas maladministrasi."
      },
      "SS5-OP.PN.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemenuhan kepatuhan pengelolaan pengaduan menurut standar Ombudsman saling melengkapi dengan penyediaan fasilitas bantuan pengguna layanan digital untuk mencegah terjadinya maladministrasi."
      },
      "SS5-OP.PN.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Tindak lanjut rekomendasi pengawasan pengaduan pelayanan publik saling melengkapi dengan pemantauan kepuasan pengguna layanan digital pemerintah secara berkelanjutan."
      },
      "SS5-OP.PN.1 -> SS1-PEMDI.D.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kepatuhan unit kerja dalam penanganan pengaduan masyarakat mendukung tata kelola penyelenggaraan data dan informasi geospasial tematik agar berorientasi pada transparansi pelayanan."
      },
      "SS5-OP.PN.1 -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Ketersediaan alokasi dan kelengkapan sarana prasarana operasional pelayanan mendukung keandalan operasional keandalan infrastruktur komputasi, jaringan, dan pusat data nasional dalam melayani masyarakat."
      },
      "SS5-ZI.MP.1 -> SS1-PEMDI.D.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi penyelenggaraan statistik sektoral dan analitika data pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.1 -> SS1-PEMDI.KP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi kesiapsiagaan kapabilitas penanganan dan pemulihan insiden siber pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi pengelolaan survei dan umpan balik kepuasan pengguna layanan digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.D.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi penyelenggaraan data dan informasi geospasial tematik pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.KLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi keterpaduan proses bisnis layanan digital lintas unit dan instansi pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.KLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi integrasi dan konektivitas antar-aplikasi layanan pemerintah pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.KLDP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi interoperabilitas data dan pertukaran informasi antar-sistem digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.TKM.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.TKM.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi standar manajemen mutu dan tata kelola siklus hidup layanan digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.2 -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi keandalan infrastruktur komputasi, jaringan, dan pusat data nasional pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.KLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi integrasi dan konektivitas antar-aplikasi layanan pemerintah pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.KLDP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi interoperabilitas data dan pertukaran informasi antar-sistem digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.TKM.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.TKM.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi standar manajemen mutu dan tata kelola siklus hidup layanan digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi keandalan infrastruktur komputasi, jaringan, dan pusat data nasional pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.KP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi pelaksanaan audit keamanan teknologi informasi dan kepatuhan sistem pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.MP.3 -> SS1-PEMDI.KP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Komitmen pimpinan dan pembentukan budaya kerja adaptif dalam Manajemen Perubahan Zona Integritas mendukung adopsi dan implementasi sistem manajemen keamanan informasi dan ketahanan siber Pemdi pada seluruh jajaran unit kerja."
      },
      "SS5-ZI.PA.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penilaian kepuasan masyarakat dan keterbukaan informasi publik pada unit Zona Integritas saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital guna menjamin transparansi kinerja pelayanan."
      },
      "SS5-ZI.PA.4 -> SS1-PEMDI.KP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan mekanisme pengendalian intern dan pengawasan pencegahan penyimpangan pada unit kerja mendukung pemenuhan pelaksanaan audit keamanan teknologi informasi dan kepatuhan sistem dari risiko tata kelola dan keamanan."
      },
      "SS5-ZI.PA.4 -> SS1-PEMDI.KP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan mekanisme pengendalian intern dan pengawasan pencegahan penyimpangan pada unit kerja mendukung pemenuhan sistem manajemen keamanan informasi dan ketahanan siber Pemdi dari risiko tata kelola dan keamanan."
      },
      "SS5-ZI.PA.5 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pengelolaan pengaduan masyarakat pada unit kerja berpredikat ZI saling melengkapi dengan fasilitas bantuan pengguna layanan digital untuk memastikan setiap keluhan terselesaikan secara tuntas."
      },
      "SS5-ZI.PA.5 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penanganan pengaduan dan saran pengguna layanan pada Zona Integritas saling melengkapi dengan pemantauan indeks kepuasan pengguna layanan digital pemerintah."
      },
      "SS5-ZI.PKPP.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pembangunan Zona Integritas menuju WBK/WBBM saling melengkapi dengan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dalam mengakselerasi tata kelola birokrasi yang bersih dan melayani."
      },
      "SS5-ZI.PKPP.2 -> SS1-PEMDI.P.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengembangan kompetensi pegawai dan internalisasi budaya pelayanan prima mendukung peningkatan kapabilitas pengembangan kompetensi dan literasi digital aparatur sipil negara dalam memberikan pelayanan digital yang ramah dan responsif."
      },
      "SS5-ZI.PKPP.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengembangan kompetensi pegawai dan internalisasi budaya pelayanan prima mendukung peningkatan kapabilitas pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dalam memberikan pelayanan digital yang ramah dan responsif."
      },
      "SS5-ZI.PKPP.2 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengembangan kompetensi pegawai dan internalisasi budaya pelayanan prima mendukung peningkatan kapabilitas penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dalam memberikan pelayanan digital yang ramah dan responsif."
      },
      "SS5-ZI.PKPP.3 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pengelolaan pengaduan masyarakat pada unit kerja berpredikat ZI saling melengkapi dengan fasilitas bantuan pengguna layanan digital untuk memastikan setiap keluhan terselesaikan secara tuntas."
      },
      "SS5-ZI.PKPP.3 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penanganan pengaduan dan saran pengguna layanan pada Zona Integritas saling melengkapi dengan pemantauan indeks kepuasan pengguna layanan digital pemerintah."
      },
      "SS5-ZI.PKPP.4 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penilaian kepuasan masyarakat dan keterbukaan informasi publik pada unit Zona Integritas saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital guna menjamin transparansi kinerja pelayanan."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Inovasi teknologi pelayanan publik pada Zona Integritas beririsan materi dengan integrasi dan konektivitas antar-aplikasi layanan pemerintah dalam menghubungkan data dan modul pelayanan."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.3": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada unit pelayanan prima saling melengkapi dengan portal layanan digital terpadu dalam memperluas keterjangkauan akses publik."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.4": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Inovasi teknologi pelayanan publik pada Zona Integritas beririsan materi dengan interoperabilitas data dan pertukaran informasi antar-sistem digital dalam menghubungkan data dan modul pelayanan."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan TI pada loket pelayanan publik saling melengkapi dengan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis guna mempermudah asistensi pengguna dan meningkatkan kepuasan masyarakat."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan TI pada loket pelayanan publik saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital guna mempermudah asistensi pengguna dan meningkatkan kepuasan masyarakat."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.TKM.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.TKM.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan standar manajemen mutu dan tata kelola siklus hidup layanan digital dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengembangan inovasi TI pelayanan publik didukung oleh ketersediaan standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital yang stabil dan berkinerja tinggi."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengembangan inovasi TI pelayanan publik didukung oleh ketersediaan keandalan infrastruktur komputasi, jaringan, dan pusat data nasional yang stabil dan berkinerja tinggi."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.D.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan tata kelola dan standardisasi data Pemerintah Digital dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit dan instansi dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.P.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan pengembangan kompetensi dan literasi digital aparatur sipil negara dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.P.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.D.3": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan penyelenggaraan statistik sektoral dan analitika data dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PKPP.5 -> SS1-PEMDI.KP.4": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan kesiapsiagaan kapabilitas penanganan dan pemulihan insiden siber dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.KLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan integrasi dan konektivitas antar-aplikasi layanan pemerintah agar berjalan tertib regulasi."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.KLDP.4": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan interoperabilitas data dan pertukaran informasi antar-sistem digital agar berjalan tertib regulasi."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.TKM.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital agar berjalan tertib regulasi."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.TKM.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan standar manajemen mutu dan tata kelola siklus hidup layanan digital agar berjalan tertib regulasi."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital agar berjalan tertib regulasi."
      },
      "SS5-ZI.PLKS.1 -> SS1-PEMDI.TP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan keandalan infrastruktur komputasi, jaringan, dan pusat data nasional agar berjalan tertib regulasi."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KLDP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Integrasi aplikasi layanan publik dalam kerangka SPBE unit kerja beririsan substansi dengan standarisasi integrasi aplikasi pada ekosistem Pemerintah Digital."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KLDP.3": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Layanan elektronik SPBE unit kerja saling melengkapi dengan portal layanan digital pemerintah terpadu dalam mendekatkan akses layanan kepada masyarakat."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KLDP.4": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan pertukaran data antar-layanan SPBE unit beririsan langsung dengan kriteria interoperabilitas data Pemerintah Digital untuk kelancaran arus informasi."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan SPBE unit kerja yang patuh standar keamanan mendukung penguatan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dari ancaman kebocoran data."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan SPBE unit kerja yang patuh standar keamanan mendukung penguatan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dari ancaman kebocoran data."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.P.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan pengembangan kompetensi dan literasi digital aparatur sipil negara dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.TKM.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.TKM.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan standar manajemen mutu dan tata kelola siklus hidup layanan digital dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.TP.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan aplikasi SPBE pada unit kerja Zona Integritas beririsan materi dengan pemenuhan tingkat kematangan aplikasi Pemerintah Digital dalam memastikan keandalan fungsionalitas sistem."
      },
      "SS5-ZI.PLKS.2 -> SS1-PEMDI.TP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Penyediaan infrastruktur SPBE di tingkat unit kerja beririsan lingkup dengan pemenuhan tingkat kematangan infrastruktur pusat Pemerintah Digital."
      },
      "SS5-ZI.PPP.6 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penanganan pengaduan dan saran pengguna layanan pada Zona Integritas saling melengkapi dengan pemantauan indeks kepuasan pengguna layanan digital pemerintah."
      },
      "SS5-ZI.PPW.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan mekanisme pengendalian intern dan pengawasan pencegahan penyimpangan pada unit kerja mendukung pemenuhan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dari risiko tata kelola dan keamanan."
      },
      "SS5-ZI.PPW.1 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan mekanisme pengendalian intern dan pengawasan pencegahan penyimpangan pada unit kerja mendukung pemenuhan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dari risiko tata kelola dan keamanan."
      },
      "SS5-ZI.PPW.2 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan mekanisme pengendalian intern dan pengawasan pencegahan penyimpangan pada unit kerja mendukung pemenuhan tata kelola dan standardisasi data Pemerintah Digital dari risiko tata kelola dan keamanan."
      },
      "SS5-ZI.PPW.2 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan mekanisme pengendalian intern dan pengawasan pencegahan penyimpangan pada unit kerja mendukung pemenuhan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dari risiko tata kelola dan keamanan."
      },
      "SS5-ZI.PPW.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penguatan mekanisme pengendalian intern dan pengawasan pencegahan penyimpangan pada unit kerja mendukung pemenuhan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dari risiko tata kelola dan keamanan."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan TI pada loket pelayanan publik saling melengkapi dengan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis guna mempermudah asistensi pengguna dan meningkatkan kepuasan masyarakat."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.P.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan pengembangan kompetensi dan literasi digital aparatur sipil negara dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.D.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan penyelenggaraan data dan informasi geospasial tematik dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KLDP.1": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan keterpaduan proses bisnis layanan digital lintas unit dan instansi dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KLDP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Inovasi teknologi pelayanan publik pada Zona Integritas beririsan materi dengan integrasi dan konektivitas antar-aplikasi layanan pemerintah dalam menghubungkan data dan modul pelayanan."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KLDP.4": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Inovasi teknologi pelayanan publik pada Zona Integritas beririsan materi dengan interoperabilitas data dan pertukaran informasi antar-sistem digital dalam menghubungkan data dan modul pelayanan."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan TI pada loket pelayanan publik saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital guna mempermudah asistensi pengguna dan meningkatkan kepuasan masyarakat."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.TKM.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan teknologi informasi pada pelayanan prima Zona Integritas saling melengkapi dengan standar manajemen mutu dan tata kelola siklus hidup layanan digital dalam menyajikan layanan publik modern."
      },
      "SS5-ZI.PPW.4 -> SS1-PEMDI.TP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengembangan inovasi TI pelayanan publik didukung oleh ketersediaan standardisasi fungsionalitas dan pengembangan aplikasi Pemerintah Digital yang stabil dan berkinerja tinggi."
      },
      "SS5-ZI.PSM.2 -> SS1-PEMDI.D.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengembangan kompetensi pegawai dan internalisasi budaya pelayanan prima mendukung peningkatan kapabilitas penyelenggaraan data dan informasi geospasial tematik dalam memberikan pelayanan digital yang ramah dan responsif."
      },
      "SS5-ZI.PSM.3 -> SS1-PEMDI.P.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pengembangan kompetensi pegawai dan internalisasi budaya pelayanan prima mendukung peningkatan kapabilitas pengembangan kompetensi dan literasi digital aparatur sipil negara dalam memberikan pelayanan digital yang ramah dan responsif."
      },
      "SS5-ZI.PT.1 -> SS1-PEMDI.KLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan SOP kegiatan utama dan peta proses bisnis unit kerja mendukung perumusan keterpaduan proses bisnis layanan digital lintas instansi secara baku dan akuntabel."
      },
      "SS5-ZI.PT.1 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis agar berjalan tertib regulasi."
      },
      "SS5-ZI.PT.1 -> SS1-PEMDI.D.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan penyelenggaraan data dan informasi geospasial tematik agar berjalan tertib regulasi."
      },
      "SS5-ZI.PT.1 -> SS1-PEMDI.TKM.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Kejelasan SOP dan tata laksana kerja pada unit Zona Integritas mendukung efektivitas penyelenggaraan standar manajemen mutu dan tata kelola siklus hidup layanan digital agar berjalan tertib regulasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.D.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Pemanfaatan data operasional SPBE pada unit Zona Integritas mendukung dan memerlukan tata kelola data Pemerintah Digital yang terstandar."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KLDP.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan keterpaduan proses bisnis layanan digital lintas unit dan instansi dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KLDP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Integrasi aplikasi layanan publik dalam kerangka SPBE unit kerja beririsan substansi dengan standarisasi integrasi aplikasi pada ekosistem Pemerintah Digital."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KLDP.3": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Layanan elektronik SPBE unit kerja saling melengkapi dengan portal layanan digital pemerintah terpadu dalam mendekatkan akses layanan kepada masyarakat."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KLDP.4": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan pertukaran data antar-layanan SPBE unit beririsan langsung dengan kriteria interoperabilitas data Pemerintah Digital untuk kelancaran arus informasi."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KPLDP.1": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan SPBE unit kerja yang patuh standar keamanan mendukung penguatan penyediaan fasilitas bantuan pengguna (helpdesk) dan penanganan kendala teknis dari ancaman kebocoran data."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan SPBE unit kerja yang patuh standar keamanan mendukung penguatan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital dari ancaman kebocoran data."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.P.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan pengembangan kompetensi dan literasi digital aparatur sipil negara dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.P.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan kematangan kolaborasi dan kerja sama penyelenggaraan Pemerintah Digital dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.TKM.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan perencanaan arsitektur dan tata kelola regulasi Pemerintah Digital dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.TKM.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan standar manajemen mutu dan tata kelola siklus hidup layanan digital dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.TP.1": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan aplikasi SPBE pada unit kerja Zona Integritas beririsan materi dengan pemenuhan tingkat kematangan aplikasi Pemerintah Digital dalam memastikan keandalan fungsionalitas sistem."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.TP.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Penyediaan infrastruktur SPBE di tingkat unit kerja beririsan lingkup dengan pemenuhan tingkat kematangan infrastruktur pusat Pemerintah Digital."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.D.2": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan penyelenggaraan data dan informasi geospasial tematik dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.D.3": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan penyelenggaraan statistik sektoral dan analitika data dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.D.4": {
        jenis: "Beririsan Substansi",
        status: "USULAN / Perlu validasi",
        alasan: "Pilar penerapan SPBE pada Zona Integritas beririsan substansi dengan kepatuhan dan tata kelola pelindungan data pribadi (PDP) dalam mempercepat digitalisasi administrasi pemerintahan."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KP.2": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan SPBE unit kerja yang patuh standar keamanan mendukung penguatan sistem manajemen keamanan informasi dan ketahanan siber Pemdi dari ancaman kebocoran data."
      },
      "SS5-ZI.PT.2 -> SS1-PEMDI.KP.3": {
        jenis: "Mendukung",
        status: "USULAN / Perlu validasi",
        alasan: "Penerapan SPBE unit kerja yang patuh standar keamanan mendukung penguatan penerapan teknik kriptografi untuk autentisitas dan proteksi data digital dari ancaman kebocoran data."
      },
      "SS5-ZI.PT.3 -> SS1-PEMDI.KPLDP.2": {
        jenis: "Saling Melengkapi",
        status: "USULAN / Perlu validasi",
        alasan: "Penilaian kepuasan masyarakat dan keterbukaan informasi publik pada unit Zona Integritas saling melengkapi dengan pengelolaan survei dan umpan balik kepuasan pengguna layanan digital guna menjamin transparansi kinerja pelayanan."
      }
    },

    // Mapping 50 Alasan / Justifikasi Substantif Berdasarkan Penyandingan Rincian Indikator Sasaran 4
    sasaran4Justifikasi: {
      // === KK ⟷ SPIP (16 Relasi) ===
      "SS4-KK.KF.1.1_SS4-SPIP.1.1": {
        jenis: "Mendukung",
        alasan: "Relevansi mandat memastikan tugas pokok dan fungsi instansi selaras dengan regulasi nasional, sehingga pelaksanaan program kerja terarah langsung pada pencapaian sasaran strategis yang efektif dan efisien.",
        rekomendasi: "Disarankan penguatan sinergi antara unit perumus mandat kelembagaan dan tim penjamin kualitas internal agar penataan tugas pokok dan fungsi dapat memperkuat ketercapaian sasaran strategis instansi secara terpadu."
      },
      "SS4-KK.KF.1.1_SS4-SPIP.1.2": {
        jenis: "Mendukung",
        alasan: "Kejelasan mandat tugas dan fungsi memberikan dasar kewenangan yang pasti bagi unit kerja, yang mendukung keandalan pencatatan serta pertanggungjawaban dalam pelaporan keuangan.",
        rekomendasi: "Disarankan pemanfaatan kejelasan struktur mandat tugas dan fungsi sebagai dasar penetapan kewenangan otorisasi transaksi keuangan, guna meningkatkan keandalan sistem pelaporan keuangan internal."
      },
      "SS4-KK.KF.1.1_SS4-SPIP.2.1": {
        jenis: "Mendukung",
        alasan: "Kesesuaian mandat tugas mendasari legalitas penguasaan sumber daya organisasi, sehingga mendukung kepastian pengawasan dan pengamanan aset negara dari potensi penyalahgunaan.",
        rekomendasi: "Instansi disarankan mengintegrasikan kejelasan mandat unit kerja ke dalam penetapan status kuasa pengguna barang, guna memperkuat kepastian hukum dan pengawasan fisik terhadap aset negara."
      },
      "SS4-KK.KF.1.1_SS4-SPIP.2.2": {
        jenis: "Mendukung",
        alasan: "Kesesuaian pelaksanaan tugas pokok dengan regulasi pembentukan organisasi secara langsung mendukung kepatuhan hukum instansi terhadap seluruh peraturan perundang-undangan.",
        rekomendasi: "Disarankan peninjauan berkala terhadap kesesuaian operasional tugas fungsi terhadap regulasi pembentukan instansi, guna memastikan seluruh pelaksanaan program tetap patuh pada ketentuan perundang-undangan."
      },
      "SS4-KK.KU.2.1_SS4-SPIP.1.1": {
        jenis: "Mendukung",
        alasan: "Penyederhanaan struktur organisasi mereduksi duplikasi fungsi dan memperpendek rentang koordinasi, yang secara langsung mendorong efektivitas proses kerja dan efisiensi alokasi sumber daya dalam SPIP.",
        rekomendasi: "Disarankan optimalisasi proses bisnis pasca-penyederhanaan struktur ke dalam peta proses kerja terpadu, agar efisiensi alokasi sumber daya dapat secara nyata mempercepat pencapaian sasaran strategis SPIP."
      },
      "SS4-KK.KU.2.1_SS4-SPIP.1.2": {
        jenis: "Mendukung",
        alasan: "Kejelasan pembidangan dan batas tanggung jawab pasca-penyederhanaan struktur memudahkan verifikasi alur otorisasi, yang mendukung keandalan pengawasan internal terhadap pelaporan keuangan.",
        rekomendasi: "Disarankan penyesuaian alur otorisasi dan verifikasi dokumen keuangan mengikuti struktur pembidangan baru, sehingga pengendalian internal pelaporan keuangan tetap andal dan akuntabel."
      },
      "SS4-KK.KU.2.1_SS4-SPIP.2.1": {
        jenis: "Mendukung",
        alasan: "Penataan unit kerja yang proporsional memperjelas batas kewenangan pengguna barang, sehingga memperkuat pengawasan internal dalam pengamanan fisik dan hukum aset negara.",
        rekomendasi: "Disarankan pemutakhiran daftar penanggung jawab inventaris barang milik negara pada setiap unit kerja hasil penataan, guna menjamin efektivitas pengamanan fisik dan administrasi aset."
      },
      "SS4-KK.KU.2.1_SS4-SPIP.2.2": {
        jenis: "Mendukung",
        alasan: "Penataan struktur organisasi yang adaptif memastikan pembagian fungsi operasional tetap berada dalam koridor hukum, mendukung ketaatan menyeluruh terhadap peraturan perundang-undangan.",
        rekomendasi: "Instansi disarankan melakukan penyelarasan SOP operasional unit hasil penataan kelembagaan dengan ketentuan regulasi teknis yang berlaku, guna mencegah kekosongan hukum dalam pelaksanaan tugas."
      },
      "SS4-KK.KP.3.1_SS4-SPIP.1.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Penyelarasan hasil kerja bersama (shared-outcomes) antarunit internal mengeliminasi ego sektoral dalam perencanaan, sehingga target strategis instansi dapat dicapai secara lebih efisien dan efektif.",
        rekomendasi: "Perlu dilakukan sinkronisasi indikator kinerja antarunit internal sejak penyusunan rencana kerja tahunan, guna memastikan seluruh target sasaran strategis instansi terhubung secara konsisten dan bebas dari ego sektoral."
      },
      "SS4-KK.KP.3.1_SS4-SPIP.1.2": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Perumusan target kinerja bersama memperjelas alokasi pembiayaan terpadu sejak tahap perencanaan, yang mendukung ketepatan penganggaran dan keandalan pelaporan keuangan.",
        rekomendasi: "Disarankan penyelarasan target kinerja bersama dengan pengalokasian anggaran lintas unit, guna menghindari tumpang tindih pembiayaan dan menjamin konsistensi dokumen anggaran dengan pertanggungjawaban keuangan."
      },
      "SS4-KK.KP.3.1_SS4-SPIP.2.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Perencanaan program kolaboratif mengintegrasikan kebutuhan sarana dan prasarana kerja antarunit, sehingga mendukung efisiensi pemanfaatan dan pengamanan aset negara.",
        rekomendasi: "Perlu dilakukan penyusunan rencana kebutuhan barang milik negara (RKBMN) berbasis program bersama lintas unit, agar pengadaan dan pemanfaatan sarana prasarana berjalan tepat sasaran dan hemat anggaran."
      },
      "SS4-KK.KP.3.1_SS4-SPIP.2.2": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Penyusunan target kerja bersama berpedoman pada kaidah regulasi perencanaan pemerintah, mendukung kepatuhan instansi terhadap ketentuan peraturan perundang-undangan.",
        rekomendasi: "Disarankan penguatan telaah regulasi pada tahap perumusan program kerja bersama, guna memastikan dokumen perencanaan kinerja kolaboratif selaras dengan tata kelola perencanaan nasional."
      },
      "SS4-KK.TK.3.1_SS4-SPIP.1.1": {
        jenis: "Beririsan Substansi",
        alasan: "Penerapan manajemen risiko kelembagaan beririsan langsung dengan pilar efektivitas dan efisiensi SPIP dalam mengidentifikasi serta memitigasi potensi hambatan pencapaian sasaran strategis.",
        rekomendasi: "Perlu dilakukan sinkronisasi register risiko kelembagaan dengan profil risiko SPIP, serta penegasan batas pengukuran agar mitigasi hambatan kinerja dilakukan secara terpadu tanpa duplikasi instrumen penilaian."
      },
      "SS4-KK.TK.3.1_SS4-SPIP.1.2": {
        jenis: "Beririsan Substansi",
        alasan: "Mitigasi risiko proses kerja secara langsung memperkuat pengendalian internal atas pelaporan keuangan guna mencegah kekeliruan pencatatan dan penyimpangan anggaran.",
        rekomendasi: "Disarankan pemetaan titik kritis pengendalian internal pada proses akuntansi dan pelaporan keuangan, serta pemanfaatan data manajemen risiko organisasi untuk memprioritaskan uji petik pengawasan keuangan."
      },
      "SS4-KK.TK.3.1_SS4-SPIP.2.1": {
        jenis: "Beririsan Substansi",
        alasan: "Pengendalian risiko operasional dan logistik beririsan dengan upaya perlindungan fisik serta pengamanan hukum atas aset negara dari risiko kerugian atau kerusakan.",
        rekomendasi: "Perlu dilakukan pemetaan irisan risiko terkait pengamanan aset negara antara manajemen risiko organisasi dan SPIP, sehingga langkah pencegahan kerugian fisik dan hukum BMN dapat dijalankan secara terintegrasi."
      },
      "SS4-KK.TK.3.1_SS4-SPIP.2.2": {
        jenis: "Beririsan Substansi",
        alasan: "Identifikasi risiko kepatuhan hukum memastikan setiap aktivitas tata kelola instansi terproteksi dari potensi penyimpangan terhadap peraturan perundang-undangan.",
        rekomendasi: "Disarankan penyelarasan pemantauan kepatuhan regulasi antara tim manajemen risiko dan auditor internal, guna memastikan mitigasi pelanggaran hukum dijalankan secara konsisten tanpa tumpang tindih pelaporan."
      },

      // === KK ⟷ IPPN (9 Relasi) ===
      "SS4-KK.KU.1.1_SS4-IPPN.2.a.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Distribusi beban kerja yang proporsional mendasari perhitungan kebutuhan sumber daya riil unit, yang selaras dengan kepatuhan alokasi anggaran output prioritas pada tahun perencanaan RKP.",
        rekomendasi: "Perlu dilakukan sinkronisasi analisis beban kerja unit dengan perhitungan standar biaya keluaran, guna menjamin alokasi anggaran output prioritas pada tahun perencanaan RKP didukung ketersediaan sumber daya pelaksana yang memadai."
      },
      "SS4-KK.KU.1.1_SS4-IPPN.2.b.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Ketepatan alokasi tugas operasional menjaga konsistensi beban belanja, mendukung kesesuaian antara total anggaran dalam RKA K/L dengan rencana kerja (Renja) K/L.",
        rekomendasi: "Disarankan penelaahan bersama antara unit perencanaan dan kepegawaian dalam menyusun RKA K/L, agar pergeseran anggaran operasional tetap konsisten dengan pagu dan target yang tercantum pada Renja K/L."
      },
      "SS4-KK.KU.1.1_SS4-IPPN.2.c.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Pengaturan rentang kendali dan kapasitas kerja unit pelaksana memastikan ketersediaan pelaksana kegiatan, mendukung kepatuhan pembiayaan output prioritas RKP pada tahun pelaksanaan.",
        rekomendasi: "Perlu dipastikan kesiapan alokasi personel dan rentang kendali pelaksana sebelum tahun anggaran berjalan, sehingga penyerapan anggaran pembiayaan output prioritas RKP tidak mengalami hambatan teknis di lapangan."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.a.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Perumusan shared-outcomes internal memastikan sasaran strategis instansi terintegrasi, yang menjadi prasyarat kepatuhan keselarasan muatan Renstra K/L terhadap target nasional RPJMN.",
        rekomendasi: "Disarankan penguatan cascading sasaran strategis instansi berbasis hasil kerja bersama, guna menjamin seluruh muatan target dan satuan Renstra K/L selaras secara penuh dengan koridor prioritas RPJMN."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.b.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Keselarasan target kinerja bersama antarunit menjamin keterpaduan cascading program dan kegiatan, sehingga muatan Renja K/L konsisten terhadap sasaran Renstra K/L.",
        rekomendasi: "Perlu dilakukan rekonsiliasi berkala antarunit saat perumusan target tahunan Renja K/L, guna menjaga konsistensi vertikal terhadap sasaran program dan kegiatan yang telah ditetapkan dalam Renstra K/L."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.c.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Kolaborasi antarunit dalam penetapan target bersama memperjelas kontribusi instansi terhadap output prioritas koridor Kegiatan Prioritas Utama (KPU) dalam RKP.",
        rekomendasi: "Instansi disarankan memetakan kontribusi output bersama antarunit kerja secara eksplisit terhadap koridor Kegiatan Prioritas Utama (KPU) RKP, agar akuntabilitas pencapaian target nasional lebih transparan."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.c.2": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Keterpaduan perencanaan internal memvalidasi penetapan target volume dan satuan output prioritas Renja K/L agar presisi dengan proyek prioritas koridor KPU RKP.",
        rekomendasi: "Disarankan penyeragaman definisi operasional satuan ukuran dan metode penghitungan volume output prioritas pada Renja K/L, agar selaras dengan tolok ukur proyek prioritas koridor KPU RKP."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.c.3": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Sinergi antarunit kerja dalam penetapan hasil bersama mengarahkan keluaran program instansi agar selaras dengan output proyek prioritas koridor Prioritas Nasional (PN) pada RKP.",
        rekomendasi: "Perlu dilakukan peninjauan berkala terhadap relevansi rincian keluaran program bersama terhadap tema Prioritas Nasional (PN), guna memastikan dukungan optimal instansi terhadap sasaran strategis RKP."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.c.4": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Perencanaan target bersama antarunit mendasari penetapan target dan satuan keluaran Renja K/L yang konsisten dengan tolok ukur Proyek Prioritas Nasional RKP.",
        rekomendasi: "Disarankan integrasi sistem informasi perencanaan internal dengan sistem pemantauan nasional, guna memastikan kesesuaian target volume keluaran Renja K/L terhadap tolok ukur Proyek Prioritas Nasional RKP."
      },

      // === KK ⟷ IKPA (7 Relasi) ===
      "SS4-KK.KU.1.1_SS4-IKPA.1.1": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Beban kerja unit perencana dan pelaksana yang tidak seimbang berisiko memicu ketidakmatangan perencanaan anggaran, sehingga berpotensi menimbulkan tumpang tindih usulan revisi DIPA.",
        rekomendasi: "Perlu dilakukan penelaahan terhadap distribusi beban kerja pada unit perencanaan dan penganggaran. Apabila teridentifikasi hambatan koordinasi dalam penyusunan anggaran, instansi disarankan menyelaraskan mekanisme telaah internal untuk meminimalkan frekuensi revisi DIPA."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.1.2": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Ketimpangan distribusi penugasan pada unit pengelola anggaran dapat mengganggu disiplin penarikan dana bulanan, yang berpotensi memicu deviasi terhadap rencana Halaman III DIPA.",
        rekomendasi: "Disarankan penataan proporsi tugas pengelola perbendaharaan dan penguatan koordinasi jadwal penarikan dana dengan unit pelaksana kegiatan, guna menjaga ketepatan realisasi kas bulanan sesuai rencana Halaman III DIPA."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.2.1": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Pengaturan rentang kendali operasional yang kurang proporsional berpotensi menghambat eksekusi kegiatan, memicu ketidakmerataan penyerapan anggaran antartriwulan.",
        rekomendasi: "Perlu dilakukan evaluasi rentang kendali manajerial pada unit-unit pelaksana kegiatan teknis. Apabila ditemukan sumbatan proses persetujuan kegiatan, instansi disarankan menyederhanakan alur birokrasi agar penyerapan anggaran terdistribusi merata sejak triwulan awal."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.2.2": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Penumpukan beban administrasi pengadaan pada pejabat pengadaan berisiko menunda pendaftaran kontrak ke KPPN, memicu potensi keterlambatan belanja kontraktual.",
        rekomendasi: "Perlu dilakukan peninjauan distribusi beban kerja dan pembagian tanggung jawab dalam proses administrasi pengadaan. Apabila ditemukan duplikasi tugas atau hambatan koordinasi, instansi disarankan menyelaraskan SOP dan memperjelas pembagian peran untuk memastikan ketepatan waktu pendaftaran kontrak."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.2.3": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Keterbatasan personel verifikasi akibat rentang kendali yang padat berpotensi memperlambat penerbitan SPM-LS, memicu hambatan ketepatan waktu penyelesaian tagihan.",
        rekomendasi: "Disarankan penyesuaian alokasi petugas verifikator dokumen tagihan dan pembagian rentang kendali verifikasi yang seimbang, guna menjamin ketepatan waktu penerbitan SPM dan penyelesaian tagihan pihak ketiga."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.2.4": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Beban kerja pengelola keuangan yang berlebih berisiko mengganggu perputaran Uang Persediaan (UP/TUP), memicu potensi keterlambatan pertanggungjawaban uang muka satker.",
        rekomendasi: "Perlu dilakukan penataan pembagian tugas bendahara pengeluaran dan pemegang uang muka kerja, serta penyelarasan SOP revolving UP/TUP agar pertanggungjawaban uang persediaan berjalan tertib dan tepat waktu."
      },
      "SS4-KK.KU.2.1_SS4-IKPA.3.1": {
        jenis: "Mendukung",
        alasan: "Penyederhanaan struktur organisasi memperjelas penanggung jawab teknis kegiatan dan mempercepat jalur komando, mendukung ketepatan serta optimalisasi ketercapaian volume output satker.",
        rekomendasi: "Disarankan penguatan akuntabilitas pejabat pembuat komitmen dan tim pelaksana teknis pasca-penyederhanaan struktur, guna mengoptimalkan ketercapaian target volume keluaran dan efisiensi rincian output satker."
      },

      // === KK ⟷ IPA (2 Relasi) ===
      "SS4-KK.KU.1.1_SS4-IPA.1.1": {
        jenis: "Saling Melengkapi",
        alasan: "Alokasi personel pengelola aset yang proporsional melengkapi fungsi penatausahaan BMN dalam mempercepat tindak lanjut dan penyelesaian temuan BPK secara akuntabel.",
        rekomendasi: "Disarankan pengelolaan terpadu antara analisis beban kerja pengelola barang milik negara dan tim tindak lanjut hasil audit, guna mempercepat penyelesaian rekomendasi temuan BPK terkait penatausahaan aset."
      },
      "SS4-KK.KU.1.1_SS4-IPA.1.2": {
        jenis: "Saling Melengkapi",
        alasan: "Pembagian tugas yang seimbang pada unit pemanfaatan aset melengkapi upaya intensifikasi pengelolaan BMN guna mengoptimalkan realisasi penerimaan negara bukan pajak (PNBP).",
        rekomendasi: "Disarankan penguatan koordinasi penugasan personel pengelola aset dalam mengidentifikasi potensi pemanfaatan BMN yang belum optimal, guna mendukung peningkatan realisasi target PNBP instansi secara akuntabel."
      },

      // === KK ⟷ CKKP (4 Relasi) ===
      "SS4-KK.KU.2.1_SS4-CKKP.1.a": {
        jenis: "Mendukung",
        alasan: "Kejelasan pembidangan tugas pasca-penyederhanaan struktur memudahkan pembagian target kinerja, mendukung pencapaian indikator sasaran strategis dan mandat penugasan nasional.",
        rekomendasi: "Disarankan penetapan matriks peran dan hasil (cross-cutting) yang jelas bagi setiap unit kerja pasca-penyederhanaan struktur, guna memperkuat sinergi ketercapaian indikator sasaran strategis kementerian/lembaga."
      },
      "SS4-KK.KU.2.1_SS4-CKKP.1.b": {
        jenis: "Mendukung",
        alasan: "Pengurangan fragmentasi unit kerja memperkuat konsentrasi tanggung jawab program, mendukung keberhasilan pencapaian indikator program kementerian/lembaga.",
        rekomendasi: "Disarankan integrasi pemantauan kinerja program kerja secara berkala antarunit yang telah disederhanakan, guna memastikan pencapaian indikator program tetap fokus dan berdaya guna."
      },
      "SS4-KK.KU.2.1_SS4-CKKP.1.c": {
        jenis: "Mendukung",
        alasan: "Struktur organisasi yang ramping mempercepat eksekusi proses bisnis di tingkat operasional, mendukung kelancaran pelaksanaan dan capaian indikator kegiatan.",
        rekomendasi: "Instansi disarankan menyelaraskan tata kelola kerja berbasis tim fungsional pasca-perampingan struktur, agar koordinasi operasional pelaksanaan kegiatan berjalan lincah dan tepat waktu."
      },
      "SS4-KK.KU.2.1_SS4-CKKP.2.a": {
        jenis: "Mendukung",
        alasan: "Penyederhanaan hierarki kelembagaan mempercepat koordinasi penyerahan keluaran, mendukung pemenuhan target volume dan progres fisik Rincian Output (RO) Prioritas Nasional.",
        rekomendasi: "Disarankan penguatan monitoring berkala terhadap progres fisik dan volume Rincian Output (RO) Prioritas Nasional, dengan memanfaatkan jalur komando yang lebih ringkas pasca-penyederhanaan struktur."
      },

      // === KK ⟷ SAKIP (4 Relasi) ===
      "SS4-KK.KU.2.1_SS4-SAKIP.2": {
        jenis: "Saling Melengkapi",
        alasan: "Kejelasan batas tanggung jawab unit hasil penyederhanaan struktur melengkapi sistem pengukuran kinerja SAKIP dalam menetapkan indikator kinerja utama (IKU) yang tepat dan terukur secara berjenjang.",
        rekomendasi: "Disarankan penyandingan hasil penataan struktur organisasi dengan dokumen penetapan indikator kinerja utama (IKU), guna memastikan cascading pengukuran kinerja SAKIP terdefinisi secara jelas hingga level operasional."
      },
      "SS4-KK.KU.2.1_SS4-SAKIP.3": {
        jenis: "Saling Melengkapi",
        alasan: "Penyederhanaan struktur organisasi berorientasi pada peningkatan kejelasan tanggung jawab, efektivitas koordinasi, dan efisiensi penggunaan sumber daya. Hal tersebut melengkapi pelaporan kinerja SAKIP yang menyajikan informasi capaian dan efisiensi sebagai dasar evaluasi serta perbaikan kinerja organisasi.",
        rekomendasi: "Disarankan pengelolaan terpadu antara data efisiensi kelembagaan pasca-penyederhanaan struktur dengan penyusunan Laporan Kinerja (Lkj), agar informasi perbaikan kinerja organisasi dan penghematan sumber daya terdokumentasi secara komprehensif."
      },
      "SS4-KK.KU.2.1_SS4-SAKIP.4": {
        jenis: "Saling Melengkapi",
        alasan: "Struktur kelembagaan yang proporsional memperjelas alur koordinasi evaluasi, melengkapi pelaksanaan evaluasi akuntabilitas kinerja internal agar dapat terlaksana secara berkualitas dan objektif pada seluruh unit kerja.",
        rekomendasi: "Disarankan pemanfaatan peta kelembagaan yang proporsional untuk mempermudah pelaksanaan evaluasi SAKIP internal oleh Inspektorat, guna menjamin cakupan evaluasi yang menyeluruh dan objektif pada setiap unit kerja."
      },
      "SS4-KK.KP.3.1_SS4-SAKIP.1": {
        jenis: "Saling Melengkapi",
        alasan: "Perumusan hasil kerja bersama (shared-outcomes) antarunit mengintegrasikan komitmen kerja internal, yang melengkapi ketersediaan dokumen perencanaan kinerja jangka menengah dan pendek SAKIP yang berkualitas.",
        rekomendasi: "Disarankan penguatan keselarasan dokumen perencanaan kinerja (Renstra dan Perjanjian Kinerja) berbasis komitmen shared-outcomes internal, agar perencanaan kinerja instansi terintegrasi dan berorientasi hasil."
      },

      // === KK ⟷ ELPPD (8 Relasi) ===
      "SS4-KK.KU.2.1_SS4-ELPPD.TP.1": {
        jenis: "Mendukung",
        alasan: "Penyederhanaan pembidangan kelembagaan daerah memperjelas pembagian tanggung jawab urusan, mendukung pencapaian tujuan evaluasi makro daerah dan kualitas layanan publik.",
        rekomendasi: "Disarankan penguatan koordinasi antar-OPD pasca-penyederhanaan struktur kelembagaan daerah, agar pembagian tanggung jawab urusan pemerintahan terfokus pada perbaikan kualitas layanan publik dan sasaran makro daerah."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.IU.1": {
        jenis: "Mendukung",
        alasan: "Pengurangan rantai birokrasi dan peningkatan kecepatan koordinasi perizinan serta investasi daerah mendukung pencapaian sasaran makro pertumbuhan ekonomi.",
        rekomendasi: "Disarankan simplifikasi SOP pelayanan perizinan dan investasi terintegrasi antardinas terkait, guna mempercepat realisasi investasi dan mendorong pertumbuhan ekonomi daerah."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.IU.2": {
        jenis: "Mendukung",
        alasan: "Penataan unit kerja layanan dasar pendidikan dan kesehatan yang terintegrasi mendukung peningkatan capaian Indeks Pembangunan Manusia (IPM) daerah.",
        rekomendasi: "Disarankan penguatan sinergi program antara perangkat daerah pengampu pendidikan, kesehatan, dan kesejahteraan sosial, guna memaksimalkan dampak pelayanan dasar terhadap peningkatan capaian IPM daerah."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.IU.3": {
        jenis: "Mendukung",
        alasan: "Eliminasi tumpang tindih fungsi perlindungan sosial antar-OPD memperkuat konvergensi program penanggulangan kemiskinan dan efisiensi urusan pemerintahan.",
        rekomendasi: "Disarankan penyelarasan data sasaran dan konvergensi program penanggulangan kemiskinan lintas perangkat daerah, guna menghindari duplikasi bantuan dan meningkatkan efektivitas pengentasan kemiskinan."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.IU.4": {
        jenis: "Mendukung",
        alasan: "Kejelasan pembidangan fungsi lingkungan hidup dan kebersihan mempercepat respons operasional penanganan limbah, mendukung peningkatan kualitas lingkungan hidup daerah.",
        rekomendasi: "Disarankan pemantapan SOP terpadu pengelolaan sampah dan pemantauan kualitas lingkungan antardinas teknis, agar respons pengendalian pencemaran berjalan cepat dan berkesinambungan."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.SD.1": {
        jenis: "Mendukung",
        alasan: "Struktur OPD yang proporsional mempermudah rekonsiliasi data sektoral antardinas dengan BPS, mendukung ketersediaan data makro daerah yang valid dan terintegrasi.",
        rekomendasi: "Disarankan pembentukan forum Satu Data Daerah antar-OPD dan BPS, guna memastikan validitas, konsistensi, dan keterpaduan data statistik sektoral makro daerah."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.SD.2": {
        jenis: "Mendukung",
        alasan: "Struktur birokrasi yang ramping mempercepat konsolidasi bahan evaluasi perangkat daerah, mendukung ketepatan waktu penyusunan dokumen perencanaan dan laporan LPPD.",
        rekomendasi: "Disarankan pemanfaatan sistem pelaporan kinerja daerah berbasis elektronik untuk mengintegrasikan bahan evaluasi OPD, guna menjamin ketepatan waktu dan akurasi penyusunan laporan LPPD."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.K.1": {
        jenis: "Mendukung",
        alasan: "Kejelasan mandat pembidangan pada seluruh urusan wajib dan pilihan mendukung keterpaduan capaian pembangunan makro dengan kinerja urusan pemerintahan daerah.",
        rekomendasi: "Disarankan penyelarasan indikator kinerja perangkat daerah dengan indikator evaluasi penyelenggaraan pemerintahan daerah, agar pelaksanaan urusan wajib dan pilihan terukur secara komprehensif."
      }
    },

    // Resolusi Klasifikasi Sasaran 4 (Internal - 50 Relasi) ke dalam 5 Kategori Standar
    classifySasaran4: function (srcGroup, dstInst, dstGroup, srcCode, dstCode, srcLabel, dstLabel) {
      // Prioritas 1: Lookup hasil penyandingan substantif rincian indikator resmi
      const pairKey = `${srcCode}_${dstCode}`;
      if (this.sasaran4Justifikasi && this.sasaran4Justifikasi[pairKey]) {
        const item = this.sasaran4Justifikasi[pairKey];
        return {
          jenis: item.jenis,
          status: "Perlu Validasi",
          alasan: item.alasan,
          rekomendasi: item.rekomendasi || ""
        };
      }

      // Prioritas 2: Lookup aturan resmi dari RB_DATA.s4.relations
      const s4Rules = (typeof window !== "undefined" && window.RB_DATA && window.RB_DATA.s4 && window.RB_DATA.s4.relations) || [];
      for (const rule of s4Rules) {
        const matchSrc = rule.sourceCodes && rule.sourceCodes.includes(srcCode);
        const matchDst = !rule.targetCodes || rule.targetCodes.length === 0 || rule.targetCodes.includes(dstCode);
        if (matchSrc && matchDst) {
          return {
            jenis: rule.type || "Mendukung",
            status: "Perlu Validasi",
            alasan: rule.reason || `"${srcLabel || srcCode}" berkaitan dengan "${dstLabel || dstCode}".`
          };
        }
      }

      // Fallback klasifikasi analitis
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

      const cleanSrc = String(srcLabel || srcCode).replace(/^(?:(?:SS|P)\d+\.?\s*|(?:[0-9]+|[a-z])(?:\.[0-9a-z]+)*\.?\s+)/i, "").trim();
      const cleanDst = String(dstLabel || dstCode).replace(/^(?:(?:SS|P)\d+\.?\s*|(?:[0-9]+|[a-z])(?:\.[0-9a-z]+)*\.?\s+)/i, "").trim();
      const alasan = cleanSrc && cleanDst
        ? `"${cleanSrc}" berkaitan dengan "${cleanDst}".`
        : (cleanSrc ? `"${cleanSrc}"` : (cleanDst ? `"${cleanDst}"` : `Keterkaitan antara ${sg} dan ${di}.`));

      return {
        jenis: jenis,
        status: "Perlu Validasi",
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
