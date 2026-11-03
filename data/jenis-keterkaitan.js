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
        alasan: "Relevansi mandat memastikan tugas pokok dan fungsi instansi selaras dengan regulasi nasional, sehingga pelaksanaan program kerja terarah langsung pada pencapaian sasaran strategis yang efektif dan efisien."
      },
      "SS4-KK.KF.1.1_SS4-SPIP.1.2": {
        jenis: "Mendukung",
        alasan: "Kejelasan mandat tugas dan fungsi memberikan dasar kewenangan yang pasti bagi unit kerja, yang mendukung keandalan pencatatan serta pertanggungjawaban dalam pelaporan keuangan."
      },
      "SS4-KK.KF.1.1_SS4-SPIP.2.1": {
        jenis: "Mendukung",
        alasan: "Kesesuaian mandat tugas mendasari legalitas penguasaan sumber daya organisasi, sehingga mendukung kepastian pengawasan dan pengamanan aset negara dari potensi penyalahgunaan."
      },
      "SS4-KK.KF.1.1_SS4-SPIP.2.2": {
        jenis: "Mendukung",
        alasan: "Kesesuaian pelaksanaan tugas pokok dengan regulasi pembentukan organisasi secara langsung mendukung kepatuhan hukum instansi terhadap seluruh peraturan perundang-undangan."
      },
      "SS4-KK.KU.2.1_SS4-SPIP.1.1": {
        jenis: "Mendukung",
        alasan: "Penyederhanaan struktur organisasi mereduksi duplikasi fungsi dan memperpendek rentang koordinasi, yang secara langsung mendorong efektivitas proses kerja dan efisiensi alokasi sumber daya dalam SPIP."
      },
      "SS4-KK.KU.2.1_SS4-SPIP.1.2": {
        jenis: "Mendukung",
        alasan: "Kejelasan pembidangan dan batas tanggung jawab pasca-penyederhanaan struktur memudahkan verifikasi alur otorisasi, yang mendukung keandalan pengawasan internal terhadap pelaporan keuangan."
      },
      "SS4-KK.KU.2.1_SS4-SPIP.2.1": {
        jenis: "Mendukung",
        alasan: "Penataan unit kerja yang proporsional memperjelas batas kewenangan pengguna barang, sehingga memperkuat pengawasan internal dalam pengamanan fisik dan hukum aset negara."
      },
      "SS4-KK.KU.2.1_SS4-SPIP.2.2": {
        jenis: "Mendukung",
        alasan: "Penataan struktur organisasi yang adaptif memastikan pembagian fungsi operasional tetap berada dalam koridor hukum, mendukung ketaatan menyeluruh terhadap peraturan perundang-undangan."
      },
      "SS4-KK.KP.3.1_SS4-SPIP.1.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Penyelarasan hasil kerja bersama (shared-outcomes) antarunit internal mengeliminasi ego sektoral dalam perencanaan, sehingga target strategis instansi dapat dicapai secara lebih efisien dan efektif."
      },
      "SS4-KK.KP.3.1_SS4-SPIP.1.2": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Perumusan target kinerja bersama memperjelas alokasi pembiayaan terpadu sejak tahap perencanaan, yang mendukung ketepatan penganggaran dan keandalan pelaporan keuangan."
      },
      "SS4-KK.KP.3.1_SS4-SPIP.2.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Perencanaan program kolaboratif mengintegrasikan kebutuhan sarana dan prasarana kerja antarunit, sehingga mendukung efisiensi pemanfaatan dan pengamanan aset negara."
      },
      "SS4-KK.KP.3.1_SS4-SPIP.2.2": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Penyusunan target kerja bersama berpedoman pada kaidah regulasi perencanaan pemerintah, mendukung kepatuhan instansi terhadap ketentuan peraturan perundang-undangan."
      },
      "SS4-KK.TK.3.1_SS4-SPIP.1.1": {
        jenis: "Beririsan Substansi",
        alasan: "Penerapan manajemen risiko kelembagaan beririsan langsung dengan pilar efektivitas dan efisiensi SPIP dalam mengidentifikasi serta memitigasi potensi hambatan pencapaian sasaran strategis."
      },
      "SS4-KK.TK.3.1_SS4-SPIP.1.2": {
        jenis: "Beririsan Substansi",
        alasan: "Mitigasi risiko proses kerja secara langsung memperkuat pengendalian internal atas pelaporan keuangan guna mencegah kekeliruan pencatatan dan penyimpangan anggaran."
      },
      "SS4-KK.TK.3.1_SS4-SPIP.2.1": {
        jenis: "Beririsan Substansi",
        alasan: "Pengendalian risiko operasional dan logistik beririsan dengan upaya perlindungan fisik serta pengamanan hukum atas aset negara dari risiko kerugian atau kerusakan."
      },
      "SS4-KK.TK.3.1_SS4-SPIP.2.2": {
        jenis: "Beririsan Substansi",
        alasan: "Identifikasi risiko kepatuhan hukum memastikan setiap aktivitas tata kelola instansi terproteksi dari potensi penyimpangan terhadap peraturan perundang-undangan."
      },

      // === KK ⟷ IPPN (9 Relasi) ===
      "SS4-KK.KU.1.1_SS4-IPPN.2.a.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Distribusi beban kerja yang proporsional mendasari perhitungan kebutuhan sumber daya riil unit, yang selaras dengan kepatuhan alokasi anggaran output prioritas pada tahun perencanaan RKP."
      },
      "SS4-KK.KU.1.1_SS4-IPPN.2.b.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Ketepatan alokasi tugas operasional menjaga konsistensi beban belanja, mendukung kesesuaian antara total anggaran dalam RKA K/L dengan rencana kerja (Renja) K/L."
      },
      "SS4-KK.KU.1.1_SS4-IPPN.2.c.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Pengaturan rentang kendali dan kapasitas kerja unit pelaksana memastikan ketersediaan pelaksana kegiatan, mendukung kepatuhan pembiayaan output prioritas RKP pada tahun pelaksanaan."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.a.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Perumusan shared-outcomes internal memastikan sasaran strategis instansi terintegrasi, yang menjadi prasyarat kepatuhan keselarasan muatan Renstra K/L terhadap target nasional RPJMN."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.b.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Keselarasan target kinerja bersama antarunit menjamin keterpaduan cascading program dan kegiatan, sehingga muatan Renja K/L konsisten terhadap sasaran Renstra K/L."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.c.1": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Kolaborasi antarunit dalam penetapan target bersama memperjelas kontribusi instansi terhadap output prioritas koridor Kegiatan Prioritas Utama (KPU) dalam RKP."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.c.2": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Keterpaduan perencanaan internal memvalidasi penetapan target volume dan satuan output prioritas Renja K/L agar presisi dengan proyek prioritas koridor KPU RKP."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.c.3": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Sinergi antarunit kerja dalam penetapan hasil bersama mengarahkan keluaran program instansi agar selaras dengan output proyek prioritas koridor Prioritas Nasional (PN) pada RKP."
      },
      "SS4-KK.KP.3.1_SS4-IPPN.1.c.4": {
        jenis: "Keselarasan Perencanaan",
        alasan: "Perencanaan target bersama antarunit mendasari penetapan target dan satuan keluaran Renja K/L yang konsisten dengan tolok ukur Proyek Prioritas Nasional RKP."
      },

      // === KK ⟷ IKPA (7 Relasi) ===
      "SS4-KK.KU.1.1_SS4-IKPA.1.1": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Beban kerja unit perencana dan pelaksana yang tidak seimbang berisiko memicu ketidakmatangan perencanaan anggaran, sehingga berpotensi menimbulkan tumpang tindih usulan revisi DIPA."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.1.2": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Ketimpangan distribusi penugasan pada unit pengelola anggaran dapat mengganggu disiplin penarikan dana bulanan, yang berpotensi memicu deviasi terhadap rencana Halaman III DIPA."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.2.1": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Pengaturan rentang kendali operasional yang kurang proporsional berpotensi menghambat eksekusi kegiatan, memicu ketidakmerataan penyerapan anggaran antartriwulan."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.2.2": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Penumpukan beban administrasi pengadaan pada pejabat pengadaan berisiko menunda pendaftaran kontrak ke KPPN, memicu potensi keterlambatan belanja kontraktual."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.2.3": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Keterbatasan personel verifikasi akibat rentang kendali yang padat berpotensi memperlambat penerbitan SPM-LS, memicu hambatan ketepatan waktu penyelesaian tagihan."
      },
      "SS4-KK.KU.1.1_SS4-IKPA.2.4": {
        jenis: "Potensi Tumpang Tindih",
        alasan: "Beban kerja pengelola keuangan yang berlebih berisiko mengganggu perputaran Uang Persediaan (UP/TUP), memicu potensi keterlambatan pertanggungjawaban uang muka satker."
      },
      "SS4-KK.KU.2.1_SS4-IKPA.3.1": {
        jenis: "Mendukung",
        alasan: "Penyederhanaan struktur organisasi memperjelas penanggung jawab teknis kegiatan dan mempercepat jalur komando, mendukung ketepatan serta optimalisasi ketercapaian volume output satker."
      },

      // === KK ⟷ IPA (2 Relasi) ===
      "SS4-KK.KU.1.1_SS4-IPA.1.1": {
        jenis: "Saling Melengkapi",
        alasan: "Alokasi personel pengelola aset yang proporsional melengkapi fungsi penatausahaan BMN dalam mempercepat tindak lanjut dan penyelesaian temuan BPK secara akuntabel."
      },
      "SS4-KK.KU.1.1_SS4-IPA.1.2": {
        jenis: "Saling Melengkapi",
        alasan: "Pembagian tugas yang seimbang pada unit pemanfaatan aset melengkapi upaya intensifikasi pengelolaan BMN guna mengoptimalkan realisasi penerimaan negara bukan pajak (PNBP)."
      },

      // === KK ⟷ CKKP (4 Relasi) ===
      "SS4-KK.KU.2.1_SS4-CKKP.1.a": {
        jenis: "Mendukung",
        alasan: "Kejelasan pembidangan tugas pasca-penyederhanaan struktur memudahkan pembagian target kinerja, mendukung pencapaian indikator sasaran strategis dan mandat penugasan nasional."
      },
      "SS4-KK.KU.2.1_SS4-CKKP.1.b": {
        jenis: "Mendukung",
        alasan: "Pengurangan fragmentasi unit kerja memperkuat konsentrasi tanggung jawab program, mendukung keberhasilan pencapaian indikator program kementerian/lembaga."
      },
      "SS4-KK.KU.2.1_SS4-CKKP.1.c": {
        jenis: "Mendukung",
        alasan: "Struktur organisasi yang ramping mempercepat eksekusi proses bisnis di tingkat operasional, mendukung kelancaran pelaksanaan dan capaian indikator kegiatan."
      },
      "SS4-KK.KU.2.1_SS4-CKKP.2.a": {
        jenis: "Mendukung",
        alasan: "Penyederhanaan hierarki kelembagaan mempercepat koordinasi penyerahan keluaran, mendukung pemenuhan target volume dan progres fisik Rincian Output (RO) Prioritas Nasional."
      },

      // === KK ⟷ SAKIP (4 Relasi) ===
      "SS4-KK.KU.2.1_SS4-SAKIP.2": {
        jenis: "Saling Melengkapi",
        alasan: "Kejelasan batas tanggung jawab unit hasil penyederhanaan struktur melengkapi sistem pengukuran kinerja SAKIP dalam menetapkan indikator kinerja utama (IKU) yang tepat dan terukur secara berjenjang."
      },
      "SS4-KK.KU.2.1_SS4-SAKIP.3": {
        jenis: "Saling Melengkapi",
        alasan: "Penyederhanaan struktur organisasi berorientasi pada peningkatan kejelasan tanggung jawab, efektivitas koordinasi, dan efisiensi penggunaan sumber daya. Hal tersebut melengkapi pelaporan kinerja SAKIP yang menyajikan informasi capaian dan efisiensi sebagai dasar evaluasi serta perbaikan kinerja organisasi."
      },
      "SS4-KK.KU.2.1_SS4-SAKIP.4": {
        jenis: "Saling Melengkapi",
        alasan: "Struktur kelembagaan yang proporsional memperjelas alur koordinasi evaluasi, melengkapi pelaksanaan evaluasi akuntabilitas kinerja internal agar dapat terlaksana secara berkualitas dan objektif pada seluruh unit kerja."
      },
      "SS4-KK.KP.3.1_SS4-SAKIP.1": {
        jenis: "Saling Melengkapi",
        alasan: "Perumusan hasil kerja bersama (shared-outcomes) antarunit mengintegrasikan komitmen kerja internal, yang melengkapi ketersediaan dokumen perencanaan kinerja jangka menengah dan pendek SAKIP yang berkualitas."
      },

      // === KK ⟷ ELPPD (8 Relasi) ===
      "SS4-KK.KU.2.1_SS4-ELPPD.TP.1": {
        jenis: "Mendukung",
        alasan: "Penyederhanaan pembidangan kelembagaan daerah memperjelas pembagian tanggung jawab urusan, mendukung pencapaian tujuan evaluasi makro daerah dan kualitas layanan publik."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.IU.1": {
        jenis: "Mendukung",
        alasan: "Pengurangan rantai birokrasi dan peningkatan kecepatan koordinasi perizinan serta investasi daerah mendukung pencapaian sasaran makro pertumbuhan ekonomi."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.IU.2": {
        jenis: "Mendukung",
        alasan: "Penataan unit kerja layanan dasar pendidikan dan kesehatan yang terintegrasi mendukung peningkatan capaian Indeks Pembangunan Manusia (IPM) daerah."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.IU.3": {
        jenis: "Mendukung",
        alasan: "Eliminasi tumpang tindih fungsi perlindungan sosial antar-OPD memperkuat konvergensi program penanggulangan kemiskinan dan efisiensi urusan pemerintahan."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.IU.4": {
        jenis: "Mendukung",
        alasan: "Kejelasan pembidangan fungsi lingkungan hidup dan kebersihan mempercepat respons operasional penanganan limbah, mendukung peningkatan kualitas lingkungan hidup daerah."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.SD.1": {
        jenis: "Mendukung",
        alasan: "Struktur OPD yang proporsional mempermudah rekonsiliasi data sektoral antardinas dengan BPS, mendukung ketersediaan data makro daerah yang valid dan terintegrasi."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.SD.2": {
        jenis: "Mendukung",
        alasan: "Struktur birokrasi yang ramping mempercepat konsolidasi bahan evaluasi perangkat daerah, mendukung ketepatan waktu penyusunan dokumen perencanaan dan laporan LPPD."
      },
      "SS4-KK.KU.2.1_SS4-ELPPD.K.1": {
        jenis: "Mendukung",
        alasan: "Kejelasan mandat pembidangan pada seluruh urusan wajib dan pilihan mendukung keterpaduan capaian pembangunan makro dengan kinerja urusan pemerintahan daerah."
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
          alasan: item.alasan
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
