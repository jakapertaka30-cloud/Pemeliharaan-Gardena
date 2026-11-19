# Gardena Maintenance Dashboard

Dashboard kartu riwayat maintenance digital PT Gardena Furniture. Dibuat dengan HTML, CSS (diinjeksikan dari `style.js`), dan JavaScript ES Modules tanpa framework.


## Cara menjalankan lokal
1. Ekstrak folder project.
2. Buka folder di VS Code.
3. Jalankan dengan Live Server (atau server HTTP statis lain), jangan buka melalui `file://`.
4. Buka `index.html`.

## Deploy ke GitHub Pages
1. Upload **seluruh isi folder project** ke root repository (pastikan `index.html` berada di root, bukan di folder bertingkat).
2. Repository → **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu Save.
5. Tunggu deployment selesai dan buka URL Pages yang diberikan GitHub.

## Fitur
- KPI: jumlah catatan, downtime total, respons rata-rata, biaya total.
- Grafik: gangguan per peralatan, downtime, komponen yang tercatat.
- Ringkasan jadwal preventive maintenance.
- Tabel riwayat dengan pencarian dan filter peralatan/CM/PM.
- Tambah, edit, dan hapus catatan maintenance.
- Export CSV (mengekspor semua catatan, bukan hanya hasil filter tabel).
- Print view dan toggle tema.
- Penyimpanan data lokal melalui `localStorage` browser.

## Data & batasan
- Data awal berjumlah 17 catatan.
- Data yang ditambahkan/edit/disimpan hanya tersedia pada browser/perangkat yang digunakan; belum terhubung ke database/cloud dan belum sinkron antar pengguna.
- Reset Data mengembalikan catatan ke data awal project.

## Pemeriksaan otomatis
Gunakan Node.js 18+ dan jalankan:
```bash
npm test
```
Smoke test memeriksa file dan path, ID HTML, seed data, helper format, serta rendering KPI, chart, filter, dan tabel menggunakan mock DOM. Ini bukan pengganti pengujian browser penuh.

## Struktur project
- `index.html`: markup
- `app.js`: bootstrap aplikasi
- `style.js`: CSS tema/responsive/print
- `data/maintenance-data.js`: seed records
- `js/config.js`: daftar equipment dan jadwal PM
- `js/dashboard.js`: KPI
- `js/charts.js`: chart dan jadwal PM
- `js/table.js`: tabel, filter, CSV
- `js/form.js`: CRUD form
- `js/storage.js`: localStorage
- `js/utils.js`: helper format
- `tests/smoke-check.mjs`: smoke tests
