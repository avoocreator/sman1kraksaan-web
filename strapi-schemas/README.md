# Content Type untuk Strapi SMAN 1 Kraksaan

Folder ini berisi **4 content type yang belum ada** di Strapi kamu:
**Berita, Agenda, Prestasi, Jelajahi**. Website sudah siap membacanya —
begitu dibuat dan diisi, halaman terkait otomatis menampilkan data Strapi
(tanpa perlu mengubah kode frontend).

Strapi yang sudah ada dan sudah terhubung: `alumni-profiles`, `partners`,
`schedules`, `programs`.

## Cara memasang (pilih salah satu)

### Cara A — lewat Admin UI (paling cepat, tanpa deploy ulang)

1. Buka `https://cms.sman1kraksaan-web.my.id/admin` → **Content-Type Builder**.
2. Buat content type baru dengan nama & field **persis seperti di
   `*/content-types/*/schema.json`** pada folder ini (nama field, tipe,
   enum, dan default-nya sudah dirancang cocok dengan frontend).
   - Berita → plural `beritas`, field: title, slug, excerpt, content (Blocks),
     category, cover (media), author, featured (boolean).
   - Agenda → plural `agendas`, field: title, slug, date, endDate, location,
     description (Blocks), image (media).
   - Prestasi → plural `prestasis`, field: title, slug, year, category (enum),
     level (enum), image (media), description (Blocks), participants (text).
   - Jelajahi → plural `jelajahis`, field: name, category (enum), description,
     photo (media), lantai, x, y, width, height, fontSize, vertical.
3. Setelah semuanya dibuat, **restart** Strapi bila diminta.

### Cara B — lewat file schema (kalau kamu punya akses ke project Strapi)

Salin isi folder ini ke project Strapi (Strapi v5):

```
strapi-schemas/berita/   → src/api/berita/
strapi-schemas/agenda/   → src/api/agenda/
strapi-schemas/prestasi/ → src/api/prestasi/
strapi-schemas/jelajahi/ → src/api/jelajahi/
```

Lalu jalankan ulang Strapi — tabel & API dibuat otomatis.

## Jangan lupa: izin API token

`Settings → API Tokens → <token website>` → aktifkan **find** dan **findOne**
untuk: Berita, Agenda, Prestasi, Jelajahi (dan content type lain yang dipakai
website: Alumni profile, Partner, Program, Schedule).

Tanpa izin ini, endpoint akan merespons 403 dan website akan tetap memakai
data contoh.

## Mengisi data awal

```bash
STRAPI_URL=https://cms.sman1kraksaan-web.my.id \
STRAPI_TOKEN=<token-yang-bisa-menulis> \
node scripts/strapi-seed.mjs semua
```

atau per bagian, misalnya hanya jadwal:

```bash
... node scripts/strapi-seed.mjs jadwal
```

Tambahkan `--dry-run` untuk melihat payload tanpa menulis data.
