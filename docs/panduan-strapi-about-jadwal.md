# Panduan: Konten "Tentang" & Jadwal JSON dari Strapi

Panduan ini menjelaskan cara menghubungkan halaman **Tentang** dan **Jadwal
pelajaran** ke Strapi. Semua perubahan kode sudah selesai — di sisi web,
data Strapi **selalu diutamakan**, dan kalau CMS kosong/field belum diisi,
konten lama (hardcode) otomatis dipakai sehingga situs tidak pernah rusak.

---

## Bagian 1 — Halaman Tentang (single type `About`)

Single type dipakai karena isinya hanya ada satu set (satu sekolah = satu
sejarah, satu visi-misi, satu sambutan kepala sekolah). Kamu sudah membuat
single type **About** dan mengisi semua fieldnya — termasuk `schoolPhoto`
(foto sekolah) dan `principalPhoto` (foto kepala sekolah).

### Langkah 1 — Tambahkan field di Content-Type Builder

Buka **Content-Type Builder → Single Types → About → Add another field**, lalu tambahkan:

| # | Nama field        | Tipe field           | Keterangan                                            |
|---|-------------------|----------------------|-------------------------------------------------------|
| 1 | `history`         | Rich text (Blocks)   | Sejarah singkat                                       |
| 2 | `vision`          | Text → Long text     | Visi sekolah                                          |
| 3 | `mission`         | Text → Long text     | Misi — **satu misi per baris** (Enter untuk baris baru) |
| 4 | `facilitiesList`  | Text → Long text     | Fasilitas — satu per baris (boleh dikosongkan, lihat catatan) |
| 5 | `extracurriculars`| Text → Long text     | Ekstrakurikuler — satu per baris                      |
| 6 | `principalName`   | Text → Short text    | Nama kepala sekolah                                   |
| 7 | `principalMessage`| Rich text (Blocks)   | Isi sambutan kepala sekolah                           |
| 8 | `principalPhoto`  | Media → Single media | Foto kepala sekolah                                   |
| 9 | `schoolPhoto`     | Media → Single media | Foto gedung sekolah (di samping "Sejarah Singkat")    |

> `title` dan `decription` boleh dihapus/kosong — kalau tidak ada, web pakai
> judul & paragraf pengantar bawaan.

> **Penting penamaan**: tulis nama field persis seperti di tabel (huruf kecil,
> tanpa spasi). Kode sudah toleran terhadap beda huruf besar/kecil, tapi
> kesalahan ejaan tetap membuat field tidak terbaca.

Klik **Save**. Strapi akan restart sebentar — tunggu sampai admin muncul lagi.

### Langkah 2 — Isi kontennya

Buka **Content Manager → About** (single type ini hanya punya satu entri):

- `title` — biarkan kosong (judul H1 pakai bawaan) atau isi mis.
  "Mengenal SMAN 1 Kraksaan".
- `decription` — paragraf pengantar bagian atas (field yang sudah kamu buat;
  ejaannya typo tapi tetap terbaca oleh web, tidak perlu diubah).
- `schoolPhoto` — foto gedung/depan sekolah yang tampil di samping
  "Sejarah Singkat" (sudah terisi "Foto depan matura.webp"; ganti kapan pun
  lewat Content Manager → About → schoolPhoto, lalu Save + Publish).
- `history`, `vision`, `mission` — isi sesuai teks yang dulu hardcode
  (teksnya masih ada sebagai cadangan, bisa disalin dari situs).
- `extracurriculars` — satu ekskul per baris, misalnya:
  ```
  Robotika (Matura Robot Tech)
  Bahasa Jepang (Nihongo)
  ECC (English Conversation Club)
  ```
- `principalName` + `principalMessage` + `principalPhoto` — data kepala sekolah.

Klik **Save**, lalu **Publish**.

### Langkah 3 — Fasilitas (tidak perlu input ulang!)

Daftar fasilitas di halaman Tentang otomatis mengambil **nama dari collection
type `Facility`** yang sudah berisi 13 fasilitas. Urutan sesuai abjad nama.

Kalau ingin daftar khusus untuk halaman Tentang (misalnya mau mencantumkan
"Ruang Kelas", "Kantin", dst. yang bukan fasilitas booking), isi saja field
`facilitiesList` di About — satu per baris — dan daftar itu yang dipakai.

### Prioritas sumber data (sudah otomatis di kode)

```
Field di About  →  nama dari CT Facility  →  teks cadangan bawaan
```

---

## Bagian 2 — Jadwal pelajaran (single type `Jadwal`, input JSON)

Jadwal web berformat JSON (30 kelas, ±890 baris pelajaran). Membuatnya satu
per satu lewat collection type tidak praktis, jadi dipakai **single type
dengan satu field JSON** — cukup **tempel sekali**, dan setiap ada perubahan
semester tinggal tempel ulang JSON baru.

### Langkah 1 — Buat single type "Jadwal"

**Content-Type Builder → + Create new single type**:

- Display name: `Jadwal`
- (API ID akan terisi otomatis: `jadwal`)

Tambahkan field:

| # | Nama field | Tipe field        | Keterangan                                  |
|---|------------|-------------------|---------------------------------------------|
| 1 | `data`     | JSON              | Isi JSON jadwal utuh (lihat langkah 2)      |
| 2 | `title`    | Text → Short text | Opsional, mis. "Semester Ganjil 2025/2026"  |

Klik **Save** (Strapi restart sebentar), lalu **Publish**.

> Collection type `Schedule` yang lama biarkan saja — tidak diganggu,
> web tidak akan memakainya selama single type `Jadwal` sudah terisi.

### Langkah 2 — Salin JSON jadwal

1. Buka file `src/data/schedule.json` di repo (ini sumber jadwal yang
   sekarang tampil di web), atau unduh salinannya dari tautan yang
   disertakan bersama panduan ini.
2. **Salin seluruh isinya** (Ctrl+A, Ctrl+C).
3. Buka **Content Manager → Jadwal**, klik field `data`, **tempel** di situ.
4. (Opsional) isi `title`, mis. "Semester Ganjil 2025/2026".
5. **Save** → **Publish**.

### Langkah 3 — Selesai, cek hasilnya

- Halaman `/schedule`, beranda (tab jadwal), dan `/siswa` otomatis memakai
  JSON dari Strapi.
- Ubah isi `data` di Strapi → halaman terbaru muncul dalam ±60 detik
  (cache halaman 1 menit).

### Format JSON yang diterima (fleksibel)

Kode menerima tiga bentuk — semuanya dinormalkan otomatis:

**A. Persis isi `schedule.json`** (yang direkomendasikan — tinggal tempel):

```json
{
  "classes": ["X A", "X B", "..."],
  "lessons": [[0, 1, 2, 1, "TAHFIDZ", ""], [0, 1, 3, 1, "PAI", "B.Khotim"]]
}
```

Tuple = `[indeksKelas, hari(1=Senin..5=Jumat), jamKe(1-11), durasi, mapel, guru]`

**B. Objek per pelajaran** (lebih mudah dibaca manusia):

```json
{
  "classes": ["X A", "X B"],
  "lessons": [
    { "class": "X A", "day": "Senin", "start": 1, "span": 2, "subject": "MTK", "teacher": "B.Ike" }
  ]
}
```

`day` boleh angka (1-5) atau teks ("Senin"); `start` boleh jam ke- (1-11)
atau teks jam ("07.40").

**C. Array per kelas**:

```json
[
  { "class": "X A", "lessons": [ { "day": 1, "start": 2, "span": 2, "subject": "MTK", "teacher": "B.Ike" } ] }
]
```

### Prioritas sumber jadwal (sudah otomatis di kode)

```
JSON di single type Jadwal  →  entri collection schedules  →  schedule.json bawaan
```

---

## Cara kerja di sisi web (ringkas)

- `src/lib/api/tentang.ts` — mengambil single type `about`, menormalkan semua
  field, lengkap dengan nilai cadangan. Diekspor sebagai `getAboutContent()`.
- `src/lib/schedule-strapi.ts` — `getScheduleRaw()` kini mencoba single type
  `jadwal` (field `data`) lebih dulu, memvalidasi bentuk JSON
  (`normalizeScheduleJson`), baru mundur ke collection `schedules`, lalu ke
  JSON statis. Dipakai bersama oleh `/schedule`, `/siswa`, dan beranda.
- Halaman `src/app/about/page.tsx` sepenuhnya merender data dari
  `getAboutContent()` — tidak ada lagi teks hardcode di halaman.

## Pemecahan masalah

| Gejala | Penyebab umum | Solusi |
|---|---|---|
| Konten Tentang tidak berubah | Entri belum **Publish** | Content Manager → About → Publish |
| Foto gedung tidak muncul | Field Media kosong / salah nama field | Cek `schoolPhoto` dan `principalPhoto` terisi |
| Jadwal web tidak berubah | JSON tidak valid (ada koma menggantung, dll.) | Tempel ulang; cek valid di jsonlint.com |
| Jadwal kembali ke data lama | Field `data` kosong / ST belum publish | Isi & publish single type Jadwal |
| 401/403 di log Vercel | Token `STRAPI_TOKEN` belum punya izin baca CT baru | Settings → API Tokens → beri akses `about` & `jadwal` |

**Jangan lupa**: setelah membuat CT baru, beri izin **find** pada token yang
dipakai web (Settings → API Tokens → token yang dipakai → pada Content Type
`about` dan `jadwal` centang find) — kalau tidak, Strapi membalas 403 dan web
diam-diam memakai data cadangan.
