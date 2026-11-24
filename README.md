# Dashboard Relasi Antar-Sasaran Reformasi Birokrasi (Portal RB)

Aplikasi web visualisasi dan analisis matriks relasi antar-sasaran strategis **Reformasi Birokrasi (RB)** — Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB).

Aplikasi menyediakan dataset baseline lokal agar antarmuka tetap dapat dibuka secara offline. Saat dijalankan melalui Netlify atau server pengembangan, data relasi Sasaran 1 s.d. 5 disinkronkan dari tab `sasaran1.js` s.d. `sasaran5.js`. File workbook lokal hanya menjadi acuan struktur; bukan sumber data runtime.

---

## Fitur Utama

1. **Alur Navigasi 3 Tahapan:**
   - **Tahap 1: Matriks Relasi** — Matriks interaktif pemetaan relasi antar-indeks (indikator tujuan unik) dengan filter dinamis dan sel yang dapat diklik.
   - **Tahap 2: Peta Relasi (Diagram Hubungan)** — Visualisasi kartu indikator sumber dan tujuan yang dihubungkan dengan kurva Bezier interaktif serta panah relasi (mode fokus hover).
   - **Tahap 3: Daftar Rincian Hubungan Analitis** — Tabel komprehensif memuat kode, substansi indikator, jenis keterkaitan, dan justifikasi hubungan.

2. **Ruang Lingkup Relasi:**
   - **Relasi Internal:** Memetakan keterkaitan antar-indeks dalam satu sasaran (Sasaran 1 s.d. 5).
   - **Relasi Eksternal:** Memetakan hubungan indikator antar-sasaran dari kelima tab `sasaran.js`, dengan sumber dan tujuan yang dapat dipilih.

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
│   ├── build-comparison-s4.py          # Membentuk dataset perbandingan dari workbook
│   ├── build-sasaran-baseline.js       # Membangun baseline relasi dari 5 tab sheet
│   └── dev-server.js                   # Server lokal + emulasi Netlify Functions
├── tests/                              # Pengujian function, parser, dan modul perbandingan
├── vendor/                             # Pustaka pihak ketiga untuk ekspor PDF
└── README.md
```

Dataset utama mencakup 783 indikator, 550 relasi internal, dan 170 relasi eksternal.
Utilitas untuk membangun dataset perbandingan tetap berada di `scripts/`; pengujiannya di `tests/`.

---

## Cara Menjalankan

Aplikasi dapat dijalankan dengan mudah melalui dua cara:

### 1. Mode Offline
Buka `index.html` langsung melalui protokol `file:///` untuk melihat dataset baseline. Sinkronisasi Google Sheets memerlukan HTTP server.

### 2. Mode Online dan Pengembangan
Deploy ke Netlify untuk menggunakan Netlify Functions dan sinkronisasi Google Sheets. Untuk pengembangan lokal, jalankan `npm run dev` lalu buka URL yang ditampilkan server. Endpoint `/api/sasaran1` s.d. `/api/sasaran5` dan `/api/external` dilayani oleh `get-sasaran.js` dengan tab `sasaranN.js`.

### Pengujian

```powershell
npm test
node tests/test-internal-s4-analysis.cjs
node scripts/build-sasaran-baseline.js
```

Pengujian browser modul perbandingan memerlukan Playwright dan Chrome lokal dengan
`NODE_PATH` yang sesuai; jalankan dengan `npm run test:browser`.
