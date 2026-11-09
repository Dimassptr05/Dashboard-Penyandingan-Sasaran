# Dashboard Relasi Antar-Sasaran Reformasi Birokrasi (Portal RB)

Aplikasi web visualisasi dan analisis matriks relasi antar-sasaran strategis **Reformasi Birokrasi (RB)** — Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB).

Aplikasi ini beroperasi secara **100% mandiri (self-contained & offline)** tanpa memerlukan backend server, Node.js runtime, basis data SQL, atau koneksi internet eksternal. Seluruh dataset indikator, keterkaitan relasi, dan fungsi ekspor PDF telah terintegrasi secara langsung di sisi peramban (*client-side*).

---

## Fitur Utama

1. **Alur Navigasi 3 Tahapan:**
   - **Tahap 1: Matriks Relasi** — Matriks interaktif pemetaan relasi antar-indeks (indikator tujuan unik) dengan filter dinamis dan sel yang dapat diklik.
   - **Tahap 2: Peta Relasi (Diagram Hubungan)** — Visualisasi kartu indikator sumber dan tujuan yang dihubungkan dengan kurva Bezier interaktif serta panah relasi (mode fokus hover).
   - **Tahap 3: Daftar Rincian Hubungan Analitis** — Tabel komprehensif memuat kode, substansi indikator, jenis keterkaitan, dan justifikasi hubungan.

2. **Ruang Lingkup Relasi:**
   - **Relasi Internal:** Memetakan keterkaitan antar-indeks dalam satu sasaran (Sasaran 3 — Integritas & Inovasi, Sasaran 4 — Kapabilitas Kelembagaan, Sasaran 5 — Pelayanan Publik).
   - **Relasi Eksternal:** Memetakan hubungan indikator dari Sasaran 1 (Transformasi Digital) ke Sasaran 2, 3, 4, dan 5.

3. **Interaktivitas & Filter Cerdas:**
   - Pilihan sasaran, indeks sumber, dan indeks pembanding.
   - Filter cepat berdasarkan jenis keterkaitan (multi-pilihan).
   - Pencarian bebas kata kunci indikator, instrumen, dan deskripsi keterkaitan.

4. **Ekspor & Pelaporan Dokumen:**
   - Ekspor laporan Matriks, Peta Relasi, dan Daftar Relasi ke format PDF resmi dengan fitur pratinjau (*preview*) sebelum unduh.
   - Ekspor tabel Tahap 3 ke format CSV untuk analisis data tabular lebih lanjut.

---

## Struktur Berkas

```
.
├── index.html                         # Entry point, juga untuk file:// dan GitHub Pages
├── assets/
│   ├── css/                            # style.css, comparison-s4.css, internal-s4-analysis.css
│   └── js/                             # app.js dan comparison-s4.js
├── data/                               # Dataset utama, data perbandingan, dan audit JSON
├── docs/
│   └── PERBANDINGAN-SASARAN4.md        # Metode, sumber, dan batasan data perbandingan
├── scripts/
│   └── build-comparison-s4.py          # Membentuk dataset perbandingan dari workbook
├── tests/                              # Pengujian browser untuk fitur Sasaran 4
├── vendor/                             # Pustaka pihak ketiga untuk ekspor PDF
└── README.md
```

Dataset utama mencakup 783 indikator dan relasi internal/eksternal. Utilitas untuk
membangun dataset perbandingan tetap berada di `scripts/`; pengujiannya di `tests/`.

---

## Cara Menjalankan

Aplikasi dapat dijalankan dengan mudah melalui dua cara:

### 1. Buka Langsung Secara Lokal (Offline)
Cukup klik dua kali berkas `index.html` atau buka melalui browser apa pun (Google Chrome, Microsoft Edge, Mozilla Firefox) menggunakan protokol `file:///`.

### 2. Menggunakan Static Web Server / GitHub Pages
Jika di-host melalui layanan seperti **GitHub Pages**, aktifkan GitHub Pages pada pengaturan repositori (*Settings > Pages > Branch: `main` / `root`*), dan web akan langsung aktif secara publik.

### Pengujian

Pengujian browser memerlukan Playwright dan Chrome lokal. Jalankan dengan `NODE_PATH`
mengarah ke instalasi Playwright:

```powershell
node tests/test-comparison-s4.cjs
node tests/test-internal-s4-analysis.cjs
```
