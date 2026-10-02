# 📝 Panduan Ubah Kata-Kata Website SMAN 1 Kraksaan

Panduan ini menjawab satu pertanyaan: **"kalau mau ganti tulisan di website, edit di mana?"**

Website ini punya **2 jenis teks** dengan tempat edit yang berbeda:

| Jenis | Contoh | Cara mengubah |
|---|---|---|
| **A. Teks di kode** | Judul hero, label menu, tagline section | Edit file → push ke GitHub → Vercel deploy otomatis |
| **B. Konten dari Strapi CMS** | Berita, prestasi, agenda, alumni, pengumuman, PDF akreditasi | Edit langsung di admin Strapi → tampil dalam ±1 menit |

---

## A. Teks yang Menempel di Kode

> Semua path di bawah relatif dari folder proyek. Setelah edit, jalankan
> `npm run dev` dan cek di `localhost:3000` sebelum push.

| Bagian halaman | File yang diedit | Yang bisa diubah di situ |
|---|---|---|
| **Navbar** — nama sekolah & subjudul "School Digital Hub" | `src/components/layout/navbar.tsx` | Teks di dalam `<span>` tepat setelah logo (baris ±79-83) |
| **Navbar** — daftar menu | `src/components/layout/navbar.tsx` | Array `navLinks` (menu utama: Tentang, Program, Prestasi, Alumni, Berita) dan `moreLinks` (isi menu Lainnya) |
| **Hero** — judul besar "SMAN 1 KRAKSAAN / School Digital Hub" | `src/components/home/hero.tsx` | Isi `<motion.h1>` (±baris 29) |
| **Hero** — paragraf deskripsi sekolah | `src/components/home/hero.tsx` | Isi `<motion.p>` setelah judul (±baris 40) |
| **Hero** — tombol "Jelajahi Sekolah" | `src/components/home/hero.tsx` | Teks di dalam `<LinkButton>` |
| **Hero** — box akreditasi (Terakreditasi A, BAN-S/M) | `src/data/school-profile.ts` | Objek `accreditation`: `rank`, `issuedBy`, `certificatePdf` |
| **Beranda — Program** ("Kenapa sekolah di sini?") | `src/components/home/programs-preview.tsx` | Eyebrow, judul, subcopy, judul kartu program, kartu penutup |
| **Beranda — Prestasi** (judul section) | `src/components/home/achievements-preview.tsx` | Teks judul & subjudul section |
| **Beranda — Alumni** (judul section) | `src/components/home/alumni-preview.tsx` | Teks judul & subjudul section |
| **Beranda — Mitra** (judul section) | `src/components/home/partners-preview.tsx` | Teks judul & subjudul section |
| **Beranda — Jelajahi peta virtual** | `src/components/home/map-teaser.tsx` | Judul, copy, tombol |
| **Beranda — PPDB** (penutup) | `src/components/home/final-cta.tsx` | Judul, copy, tombol CTA |
| **Portal Siswa** — kepala halaman, judul section, 3 langkah pesan fasilitas | `src/app/siswa/page.tsx` | JSX langsung + array `langkah` |
| **Pengumuman contoh** (fallback saat Strapi belum terhubung) | `src/data/announcements.ts` | Array `announcements` |
| **Footer** — alamat, kontak, teks penutup | `src/components/layout/footer.tsx` | JSX langsung |
| **Halaman lain** (Tentang, PPDB, Jadwal, Fasilitas, dst.) | `src/app/<nama-halaman>/page.tsx` | JSX langsung di file halamannya |
| **Profil sekolah** (visi, misi, alamat, kontak, statistik) | `src/data/school-profile.ts` dan `src/data/statistics.ts` | Objek data |
| **Judul tab browser (SEO)** | `src/app/layout.tsx` + `export const metadata` di tiap halaman | Objek `metadata` |

---

## B. Konten yang Dikelola Strapi CMS

Untuk konten di tabel ini **jangan edit kode** — ubah lewat admin Strapi
(`https://cms.sman1kraksaan-web.my.id/admin` → Content Manager).

| Content type di Strapi | Endpoint | Tampil di |
|---|---|---|
| Article | `/api/articles` | Carousel hero beranda, halaman /news |
| Achievement | `/api/achievements` | Beranda (prestasi), halaman /achievements |
| Event | `/api/events` | Halaman /events (agenda) |
| Alumni Profile | `/api/alumni-profiles` | Beranda (alumni), halaman /alumni |
| School Place | `/api/school-places` | Halaman /jelajahi (peta virtual) |
| Acreditation (single type) | `/api/acreditation` | PDF sertifikat akreditasi (box di hero) |
| Schedule | `/api/schedules` | Halaman /schedule + Portal Siswa |
| **Pengumuman** ← BARU | `/api/pengumumans` | **Portal Siswa (/siswa) — bagian Pengumuman** |

### 🆕 Membuat Content Type "Pengumuman" di Strapi

1. Buka admin Strapi → **Content-Type Builder** → **Create new collection type**.
2. **Display name**: `Pengumuman` → Strapi otomatis membuat API Id singular
   `pengumuman` dan plural **`pengumumans`** (persis seperti yang dibaca website).
3. Tambahkan field berikut (nama field ditulis **huruf kecil semua**):

| Field name | Tipe field | Wajib? | Keterangan |
|---|---|---|---|
| `title` | **Text** (Short text) | ✅ | Judul pengumuman |
| `date` | **Date** | ✅ | Tanggal pengumuman (ditampilkan di kotak tanggal kartu) |
| `category` | **Enumeration** | ✅ | Pilihan nilai: `Akademik`, `PPDB`, `Kegiatan`, `Umum` |
| `important` | **Boolean** | ➖ | Nyala (true) = dapat badge **Penting** oranye + naik ke urutan teratas |
| `body` | **Rich text (blocks)** *atau* **Text** (Long text) | ✅ | Isi pengumuman — dua tipe itu sama-sama didukung |

4. **Save** → tunggu server Strapi restart.
5. **Settings → Roles → Public** → pilih `Pengumuman` → centang izin
   **find** dan **findOne** → Save. (Tanpa ini, API-nya terkunci 403.)
6. **Content Manager → Pengumuman → Create new entry** → isi → Publish.

### 📋 Contoh Isi Entri (siap salin)

| title | date | category | important | body |
|---|---|---|---|---|
| Asesmen Sumatif Tengah Semester Gasal 2026/2027 | 2026-10-05 | Akademik | ✅ true | Dilaksanakan 12–17 Oktober 2026 mengikuti jadwal per kelas yang dibagikan wali kelas. Datang minimal 15 menit sebelum sesi pertama dan bawa kartu peserta. |
| Pentas seni Sinematura: tiket mulai dijual di ruang OSIS | 2026-09-30 | Kegiatan | ➖ false | Pentas seni tahunan digelar Sabtu malam di aula. Tiket dijual di ruang OSIS setelah jam pelajaran, kuota terbatas per kelas. |
| Daftar ulang PPDB Gelombang 1 dimulai pekan ini | 2026-09-28 | PPDB | ➖ false | Calon siswa yang lolos seleksi mengumpulkan berkas di ruang Tata Usaha paling lambat pukul 13.00 WIB hari kerja. |

> Kalau collection sudah dibuat tapi **belum ada entri**, Portal Siswa menampilkan
> kotak "Belum ada pengumuman". Kalau Strapi **tidak terjangkau** atau collection
> belum dibuat, otomatis tampil data contoh dari `src/data/announcements.ts`.

---

## C. 🔴 Vercel: Menghubungkan Strapi (WAJIB DILAKUKAN SEKALI)

**Kenapa di Vercel semua data Strapi tidak muncul?** Karena file `.env`
(berisi alamat Strapi + token rahasia) **sengaja tidak ikut ter-push** ke GitHub —
ia masuk daftar `.gitignore` supaya token tidak bocor. Akibatnya Vercel tidak
tahu alamat CMS kamu, dan semua pengambilan data gagal diam-diam (yang tampil
adalah data contoh).

**Solusinya — pasang Environment Variables di Vercel:**

1. Buka file `.env` di proyek lokalmu (dari zip), di situ ada dua baris:
   ```
   STRAPI_URL=https://cms.sman1kraksaan-web.my.id
   STRAPI_TOKEN=... (kunci panjang)
   ```
2. Buka **vercel.com** → proyek `sman1kraksaan-web` → **Settings → Environment Variables**.
3. Tambahkan **dua variabel** ini (namanya harus persis sama, nilainya salin
   persis dari `.env`):
   - Key: `STRAPI_URL` → Value: isi dari `.env`
   - Key: `STRAPI_TOKEN` → Value: isi dari `.env`
   - Untuk keduanya, centang environment **Production, Preview, dan Development**.
4. Tab **Deployments** → cari deployment teratas → titik tiga (**⋯**) →
   **Redeploy** (jangan centang "use existing build cache").
5. Setelah selesai deploy, buka web Vercel-mu — berita, prestasi, alumni,
   agenda, akreditasi, dan pengumuman sekarang semuanya dari Strapi. ✅

> 🔒 **Catatan keamanan:** jangan pernah memaksa `.env` masuk GitHub. Kalau
> token terlanjur bocor, buat token baru di Strapi (**Settings → API Tokens**)
> lalu perbarui nilainya di Vercel.

---

## D. Alur Kerja Edit → Tampil di Web

1. Edit file (atau edit konten di Strapi).
2. `npm run dev` → cek hasilnya di `http://localhost:3000`.
3. Commit & push ke GitHub:
   ```bat
   git add .
   git commit -m "Ubah teks ..."
   git push
   ```
4. Vercel mendeteksi push dan deploy otomatis (±1–2 menit).

💡 **Tips:** konten Strapi di-cache selama 60 detik (`revalidate = 60`). Setelah
mengubah konten di CMS, tunggu ±1 menit lalu refresh halaman — atau lakukan
Redeploy di Vercel kalau mau langsung pasti.
