# Integrasi Strapi — SMAN 1 Kraksaan Web

Website membaca semua konten dari Strapi kamu
(`https://cms.sman1kraksaan-web.my.id`). Kredensial ada di `.env`:

```env
STRAPI_URL=https://cms.sman1kraksaan-web.my.id
STRAPI_TOKEN=<token read-only dari admin Strapi>
```

## Prinsip kerja

Setiap getter di `src/lib/api/index.ts` bekerja berurutan:

1. **Coba Strapi** (cache ISR, refresh tiap 60–120 detik).
2. Kalau Strapi **tidak terjangkau** atau content type **belum dibuat**
   → otomatis pakai **data contoh** dari `src/data/*` supaya situs tidak pernah
   tampak rusak.
3. Kalau content type **ada tapi masih kosong** → halaman menampilkan
   **state kosong yang jujur** ("Belum ada … di CMS — tambahkan entri di
   Strapi"). Data contoh TIDAK dipakai lagi, supaya kamu selalu tahu mana
   konten asli dari CMS dan mana contoh.

Komponen tidak perlu diubah — shape data selalu sama dengan interface di
`src/types/index.ts`.

## Peta content type (sesuai CMS kamu saat ini)

| Halaman         | Endpoint Strapi       | Field di CMS kamu                  | Tampil di beranda            |
| --------------- | --------------------- | ---------------------------------- | ---------------------------- |
| `/news`         | `articles`            | `title`, `media`, `content`        | 4 berita teratas (hero, 16:9)|
| `/achievements` | `achievements`        | `title`, `name`, `media`, `date`   | 4 prestasi terbaru           |
| `/events`       | `events`              | `title`, `date`                    | 3 agenda terdekat            |
| `/alumni`       | `alumni-profiles`     | `name`, `media`, `description`     | carousel lulusan (loop)      |
| `/partners`     | `partners`            | `title`, `media`, `decption`       | 4 mitra (dengan logo)        |
| `/programs`     | `programs`            | `title`, `decption`                | 5 program (layout bento)     |
| `/jelajahi`     | `school-places`       | `name`, `media`, `description`, `panorama` (opsional, foto 360°) | teaser peta ikon |
| `/schedule`     | `schedules`           | `Class`, `Subject`, `Teacher`      | widget "Pelajaran hari ini"  |
| `/ppdb`         | `ppdb-infos`          | (belum ada field)                  | —                            |
| Tentang/Akreditasi | `acreditation` (single type) | `media` (PDF sertifikat)  | tombol "Unduh Sertifikat"    |
| Tentang         | `about` (single type) | belum terpakai (endpoint 404)      | —                            |

## Catatan penting per konten

### Berita — `articles`
- `media` = foto sampul (Multiple Media; yang pertama dipakai). Foto berukuran
  thumbnail video (16:9) — carousel hero sudah disesuaikan ke rasio 16:9.
- `content` (Blocks) menjadi isi artikel; paragraf pertama juga dipakai
  sebagai excerpt di kartu.
- Tanggal pakai `publishedAt` otomatis dari Strapi.

### Prestasi — `achievements`
- `title` = nama lomba/prestasi, `name` = nama peraih (boleh beberapa, pisahkan
  dengan koma — otomatis jadi daftar "Peserta").
- `date` = tanggal prestasi (tahun dipakai untuk pengurutan).
- Field `level`/`tingkat` tidak ada di CMS → tingkat ditebak dari judul
  ("Nasional", "Provinsi", "Kabupaten", dst). Kalau mau akurat, tambahkan
  field Enumeration `level`.

### Alumni — `alumni-profiles`
- Beranda kini menampilkan **carousel kelas Prestasi** (foto di atas, badge,
  nama) yang **geser sendiri dan berulang terus**; klik kartu → **pop-up info
  singkat** (foto, nama, jalur, deskripsi dari `description`).
- Entri tanpa `name` tetap tampil (nama cadangan "Alumni SMAN 1 Kraksaan"),
  ditaruh paling belakang. Isi `name` supaya rapi.

### Mitra — `partners`
- Unggah **logo di field `media`** — kartu mitra (beranda & halaman) otomatis
  menampilkan logo; kalau kosong, dipakai inisial huruf.
- `decption` = deskripsi kerja sama (typo field di CMS ikut didukung; kalau
  suatu saat diganti `description`, tetap terbaca).

### Program — `programs`
- Masih kosong → halaman & section beranda menampilkan state kosong dengan
  petunjuk. Isi `title` + `decption`, lalu halaman terisi otomatis.

### Jelajahi — `school-places`
- **Posisi ruangan di denah tetap dari kode** (denah statis di
  `src/data/school-map.ts`), karena Strapi tidak punya field x/y.
- **Foto + deskripsi** diambil dari Strapi: entri dicocokkan ke denah lewat
  `name` (mis. "LAB FISIKA" → ruang "Lab. Fisika", "RUANG TU DAN KEPSEK" →
  "Ruang TU & Kepsek"). 20 entri CMS kamu semuanya sudah terpetakan.
- Pop-up klik ruangan menampilkan foto, nama, dan deskripsi dari CMS.
- **Foto panorama 360°** — tambahkan field baru bertipe **Media (tunggal/satu
  gambar)** bernama `Panorama` pada content type `School Place`, lalu unggah
  foto equirectangular (rasio **2:1**, disarankan ≥ 4096×2048 px, format JPG).
  Setelah itu pop-up ruangan menampilkan tombol **"Lihat Foto 360°"** yang
  membuka penampil photo sphere (putar 360°, zoom, fullscreen).
  - Nama field bebas: `panorama`, `panorama360`, `photo360`, `foto360`,
    `photosphere` semuanya otomatis terbaca (lihat alias di
    `getSchoolRooms()`).
  - Ruangan tanpa foto 360° tidak menampilkan tombol (bukan tombol mati).
  - Sumber foto 360: mode panorama HP (Google Street View / kamera 360° HP),
    aplikasi Google Street View, atau kamera 360 (Insta360, Ricoh Theta) —
    ekspor hasilnya sebagai JPG equirectangular.
  - Sementara 3 ruangan bawaan (Lab. Fisika, Perpustakaan, Lapangan) memakai
    foto demo di `public/jelajah/panorama/` — begitu field Panorama diisi di
    Strapi, foto CMS otomatis menimpa demo.

### Jadwal — `schedules`
- Schema CMS kamu saat ini: `Class`, `Subject`, `Teacher` (enumeration) —
  **belum ada hari & jam**, jadi grid jadwal mingguan belum bisa dibangun dari
  CMS; sementara dipakai jadwal bawaan.
- Supaya CMS jadi sumber jadwal, tambahkan field `Day` (enumeration:
  Senin–Jumat) dan `Start` (angka jam ke-1..11). Parser sudah mendukung bentuk
  `{ class, day, start, span, subject, teacher }`.

### Akreditasi — single type `acreditation`
- Unggah PDF sertifikat di field `media` → tombol "Unduh Sertifikat Akreditasi
  (PDF)" di beranda & halaman Tentang otomatis memakai file dari CMS.

## Alias field yang didukung

Frontend membaca beberapa nama alternatif per field (lihat `pick(...)` di
`src/lib/api/index.ts`), jadi perubahan nama kecil di Strapi tidak langsung
merusak situs. Daftar lengkap ada di komentar kode.

## Debugging cepat

- Data tidak muncul? Buka `https://cms.sman1kraksaan-web.my.id/api/<endpoint>?populate=*`
  dengan header `Authorization: Bearer <STRAPI_TOKEN>`. Harus 200.
- 401/403 → izin token kurang; beri akses `find` pada tiap content type.
- Entri ada di admin tapi tidak tampil di situs → entri masih **Draft**;
  klik **Publish**.
- Cache situs 60–120 detik; setelah Publish, tunggu sebentar lalu refresh.
