# Perbandingan Sasaran 4

Menu sidebar **Perbandingan Sasaran 4** memakai alur Matriks Relasi → Peta Relasi → Daftar Relasi. Detail dibuka di dalam tahap ketiga. GPT selalu di kiri dan Claude di kanan. Fitur bekerja melalui `file://` maupun static hosting, tanpa backend.

Matriks mencakup seluruh 24 rincian sumber KK dalam 11 kelompok indikator dari audit. Lima kelompok yang juga tampil pada Relasi Internal ditempatkan lebih dahulu: Departementasi (Pembidangan), Mandat (Core Function), Pengendalian Risiko, Proses Perencanaan, dan Rentang Kendali. Enam kelompok KK lainnya tetap ditampilkan dan dihitung. Kolom F pada acuan (1) hanya menandai sumber pada dashboard utama, bukan membatasi cakupan perbandingan. Nama tampilan "Departementasi" mengikuti Relasi Internal; ejaan asli "Departemensi" tetap tersimpan dalam data acuan.

Dari Daftar Relasi tersedia tombol **Kembali ke Peta** dan **Kembali ke Matriks**. Setiap navigasi kembali ke Matriks (termasuk tombol tahap pertama) menghapus filter dan pilihan pasangan sehingga seluruh total langsung tampil. Kartu detail memisahkan aspek/kategori, kotak indikator, serta kotak rincian dan definisi operasional. Bagian Perbandingan Hasil Analisis tetap ditampilkan dengan desain semula.

Klik menu sidebar **Perbandingan Sasaran 4** juga selalu membuka matriks lengkap. Filter memisahkan **Sasaran Strategis**, **Indeks Sumber: KK — Kapabilitas Kelembagaan**, **Indikator**, dan **Indeks Pembanding**, mengikuti Relasi Internal. Kode teknis tetap digunakan dalam dataset untuk pencocokan, tetapi tidak ditampilkan pada pilihan, peta, daftar, atau detail. Label indikator memakai pembersihan label yang sama dengan dashboard utama; teks alasan dan rekomendasi tetap asli. Font, header, filter, serta warna kedua kartu menggunakan tema navy–biru yang sama.

## Sumber dan pemetaan

- GPT: `Matriks_Terpadu_Penyandingan_KK_dan_Analisis_Redundansi_Sasaran4.xlsx`, sheet **Matriks Gabungan**. Versi bernama dengan akhiran `(2)` tidak tersedia di proyek saat implementasi.
- Claude: `Relasional_Internal_Sasaran4 (1).xlsx`, sheet **Matriks Relasi (Detail)**. Hanya pasangan yang melibatkan KK disertakan.
- Acuan yang ditetapkan pengguna: `Bahan paparan Kamis (30092026) (1).xlsx`, sheet **Sasaran 4**. Ekstraksi mengikuti struktur kolom file ini, bukan struktur file (3). Hierarki indikator dibaca dari merged cells sebenarnya; sel kosong lainnya tidak diisi secara spekulatif. File (1) tidak memiliki kolom Definisi Operasional KK; kolom F adalah relasi internal dan tidak boleh ditampilkan sebagai definisi.

Pencocokan memakai ID lengkap pada tingkat rincian yang sama. Relasi Claude yang mengarah ke KK dinormalisasi untuk pencocokan; arah asli, seluruh kolom asli, nama sheet, dan nomor baris disimpan pada setiap record. Alasan, klasifikasi dan rekomendasi ditampilkan tanpa parafrasa. Rekomendasi GPT diambil dari kolom **Perlakuan / to-do yang disarankan**.

Dataset menggunakan satu pasangan unik per kombinasi ID KK dan ID pembanding. Bila sumber memuat beberapa baris untuk pasangan yang sama, seluruh analisis tetap disimpan dan ditampilkan. Tidak ada pencocokan berdasarkan kemiripan nama ataupun agregasi ke ID induk.

Beberapa ID pembanding di file analisis memakai struktur dan tingkat rincian berbeda dari file acuan (1). Dari seluruh 294 pasangan, 249 pasangan diberi status **Perlu Pemetaan ID**. Rincian katalog GPT diberi penanda asal dan belum terverifikasi, sehingga tidak diklaim berasal dari acuan (1). Status keberadaan sumber tetap ditampilkan terpisah dari status pemetaan. Tidak ada pemetaan ID berdasarkan kemiripan nama.

Hasil audit setelah penetapan acuan (1):

| Ukuran | Jumlah |
| --- | ---: |
| Kandidat / pasangan unik GPT | 168 |
| Seluruh relasi antarindeks Claude | 447 |
| Pasangan unik Claude yang melibatkan KK | 140 |
| Pasangan Claude yang arahnya dinormalisasi | 107 |
| Pasangan ditemukan pada keduanya | 14 |
| Gabungan pasangan unik | 294 |
| Hanya GPT | 154 |
| Hanya Claude | 126 |
| Pasangan bersama dengan klasifikasi berbeda | 11 |
| Perlu pemetaan ID ke acuan (1), tetap dihitung | 249 |

| Indeks pembanding | GPT | Claude | Cocok berdasarkan ID |
| --- | ---: | ---: | ---: |
| IPPN | 24 | 24 | 3 |
| CKKP | 24 | 4 | 2 |
| SPIP | 24 | 34 | 6 |
| SAKIP | 24 | 47 | 1 |
| ELPPD | 24 | 26 | 0 |
| IKPA | 24 | 3 | 0 |
| IPA | 24 | 2 | 2 |
| **Total** | **168** | **140** | **14** |

Angka di halaman dihitung dari seluruh pasangan dan mengikuti filter. Kecocokan GPT-Claude berdasarkan ID pasangan berbeda dari verifikasi ID terhadap acuan (1). Filter **Ditemukan GPT dan Claude** menampilkan semua 14 pasangan bersama, termasuk yang masih perlu pemetaan ke acuan. Filter **Perlu Pemetaan ID** memeriksa status pemetaan secara terpisah. Tidak ada relasi yang dihapus dari total karena penanda pemetaan.

Batas 50 relasi hanya berlaku untuk Relasi Internal Sasaran 4. Pada detailnya, BY GEMINI memakai analisis yang sudah ada dan BY GPT memakai pasangan ID persis dari matriks GPT; pasangan yang tidak ditemukan diberi keterangan kosong. Perbandingan Sasaran 4 menampilkan seluruh 294 pasangan audit.

## Isolasi dan pembaruan

`comparison-s4.js`, `comparison-s4.css` dan `data/perbandingan-sasaran4.js` terpisah dari logika/data dashboard utama. Integrasi di `index.html` hanya menambahkan tombol sidebar, stylesheet dan script. Modul tidak menulis ke dataset atau state `__portalRB`. Tidak ada penerapan hasil analisis ke dashboard utama.

Untuk memperbarui ekstraksi, gunakan Python dengan `openpyxl`:

```powershell
python scripts/build-comparison-s4.py
```

Nama sumber ditentukan secara eksplisit dalam skrip. Jangan mengganti acuan atau aturan pemetaan tanpa memeriksa tingkat rincian. Skrip juga menghasilkan `data/perbandingan-sasaran4-audit.json`; sidik SHA-256 workbook disimpan dalam dataset.

## Verifikasi

Pengujian browser menggunakan Playwright dan Chrome lokal:

```powershell
# NODE_PATH menunjuk ke folder node_modules yang berisi playwright.
node scripts/test-comparison-s4.cjs
```

Pengujian memeriksa setiap sel matriks dan kumpulan garis yang dihasilkan, semua detail dan teks analisis, klik indikator/garis, perbedaan klasifikasi, kasus sumber kosong, pencarian, filter, navigasi, tata letak laptop, error JavaScript, isolasi state/data/DOM utama, dan 50 hubungan Sasaran 4 pada dashboard utama. Screenshot pemeriksaan disimpan di folder sementara `rb-comparison-qa`.
