# Gardena Maintenance Dashboard

Dashboard kartu riwayat maintenance digital PT Gardena Furniture. Dibuat dengan HTML, CSS (diinjeksikan dari `style.js`), dan JavaScript ES Modules tanpa framework.

## Cara menjalankan lokal
1. Buka folder project di VS Code.
2. Jalankan dengan Live Server atau server HTTP statis lain.
3. Buka `index.html`. Jangan membuka melalui skema `file://` karena aplikasi menggunakan JavaScript ES Modules.

## Deploy ke GitHub Pages
1. Upload seluruh isi project ini ke root repository; `index.html` dan `app.js` harus berada langsung di root.
2. Buka **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch `main` dan folder `/ (root)`, lalu Save.
5. Tunggu deployment selesai dan buka URL Pages yang diberikan GitHub.

## Fitur
- KPI jumlah catatan, total downtime, rata-rata respons, dan biaya total.
- Grafik gangguan per peralatan, downtime, dan komponen yang tercatat.
- Ringkasan jadwal preventive maintenance.
- Tabel riwayat dengan pencarian dan filter peralatan/jenis CM/PM.
- Tambah, edit, dan hapus catatan maintenance.
- Export CSV, print view, dan toggle tema.
- Penyimpanan lokal browser melalui `localStorage`.

## Data & batasan
- Data awal berjumlah 17 catatan.
- Perubahan data disimpan pada browser/perangkat yang digunakan. Aplikasi belum terhubung ke database/cloud sehingga data tidak tersinkron antar pengguna atau perangkat.
- Reset Data mengembalikan catatan ke data awal project.

## Pemeriksaan otomatis
Dengan Node.js 18+ jalankan:
```bash
npm test
```
Smoke test memeriksa path dan ID HTML, data awal, helper, rendering KPI/grafik/tabel, serta operasi tambah/edit/hapus dengan mock DOM. Ini bukan pengganti pengujian browser penuh.

## Struktur project
Semua file aplikasi berada di root repository:
- `index.html`: markup
- `app.js`: bootstrap aplikasi
- `style.js`: CSS tema/responsive/print
- `maintenance-data.js`: data awal
- `config.js`: daftar equipment dan jadwal PM
- `dashboard.js`: KPI
- `charts.js`: grafik dan jadwal PM
- `table.js`: tabel, filter, dan CSV
- `form.js`: tambah/edit/hapus catatan
- `storage.js`: localStorage
- `utils.js`: helper format
- `smoke-check.mjs`: pemeriksaan otomatis
- `package.json`: perintah test
