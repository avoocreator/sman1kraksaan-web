# SMAN 1 Kraksaan — School Digital Hub

Frontend untuk kompetisi **Jagoan Hosting Innovation Competition (JHIC) 2.0 2026** — cabang Web Development.

"One School. One Digital Ecosystem." — menghubungkan informasi sekolah, prestasi, alumni, mitra industri, karier/PKL, berita, agenda, dan asisten AI dalam satu platform.

> **Terhubung Strapi CMS** — seluruh konten (alumni, mitra, program, jadwal, berita, agenda, prestasi, jelajahi) kini dibaca dari Strapi dengan fallback otomatis ke data contoh. Panduan lengkap: [`docs/STRAPI-INTEGRASI.md`](docs/STRAPI-INTEGRASI.md).

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (design tokens berbasis CSS variables)
- Strapi v5 (CMS headless, REST + API token)
- Framer Motion (micro-interactions)
- Lucide React (ikon)
- Recharts (grafik dashboard/analitik)
- React Hook Form + Zod (form CRUD dashboard)

## Menjalankan Proyek

```bash
npm install   # atau bun install
npm run dev
```

Buka http://localhost:3000

Isi `.env` (lihat `.env.example`):

```env
STRAPI_URL=https://cms.sman1kraksaan-web.my.id
STRAPI_TOKEN=<API token read-only dari Strapi>
```

## Arsitektur data

```
Strapi (CMS) ──▶ src/lib/strapi.ts (transport + util)
                     │
                     ▼
              src/lib/api/index.ts   ◀── fallback: src/data/* (data contoh)
                     │
        ┌────────────┼────────────────┬─────────────┐
        ▼            ▼                ▼             ▼
   halaman publik  beranda        /schedule     dashboard
   (kurasi di lib/home-data.ts)   (buildSchedule + ScheduleProvider)
```

- Halaman apa pun **tidak pernah blank**: kalau Strapi down / content type
  belum dibuat / datanya kosong, data contoh tampil sebagai cadangan.
- Cache ISR: data Strapi di-refresh tiap 60–120 detik (lihat `revalidate`
  di tiap halaman).
- Field Strapi dibaca fleksibel (beberapa alias per field) — daftar lengkap
  di `docs/STRAPI-INTEGRASI.md`.

## Struktur Folder

```
src/
├── app/                  # Routes (App Router)
│   ├── (public)/         # /, /about, /programs, /achievements, /alumni,
│   │                     # /partners, /news, /events, /schedule, /jelajahi, ...
│   ├── login/            # dan /dashboard/* (admin panel mock)
├── components/
│   ├── ui/               # Button, Badge, SectionHeading, EmptyState
│   ├── layout/           # Navbar, Footer
│   ├── home/             # Section beranda (preview per konten)
│   ├── schedule/         # ScheduleExplorer + ScheduleProvider (context)
│   ├── explore/          # Peta sekolah (JelajahiView)
│   └── ...
├── data/                 # Data contoh (fallback) + schedule.json
├── lib/
│   ├── strapi.ts         # Transport Strapi: fetch, populate, media, blocks
│   ├── api/              # Getter per konten: Strapi dulu → fallback
│   ├── schedule.ts       # buildSchedule(): jadwal dari dataset apa pun
│   ├── schedule-strapi.ts# Parser content type `schedules` → dataset jadwal
│   ├── home-data.ts      # Kurasi subset beranda
│   └── utils.ts
└── types/                # Interface TypeScript
strapi-schemas/           # Schema 4 content type baru (Berita, Agenda,
                          # Prestasi, Jelajahi) siap dipasang di Strapi
scripts/strapi-seed.mjs   # Isi data Strapi (termasuk 890 pelajaran)
docs/STRAPI-INTEGRASI.md  # Panduan integrasi lengkap
```

## Halaman & sumber data

| Route            | Konten   | Endpoint Strapi  |
| ---------------- | -------- | ---------------- |
| `/alumni`        | Alumni   | `alumni-profiles`|
| `/partners`      | Mitra    | `partners`       |
| `/programs`      | Program  | `programs`       |
| `/schedule`      | Jadwal   | `schedules`      |
| `/news`          | Berita   | `beritas` (baru) |
| `/events`        | Agenda   | `agendas` / `events` |
| `/achievements`  | Prestasi | `prestasis` (baru) |
| `/jelajahi`      | Peta     | `jelajahis` (baru) |

Beranda menampilkan **subset terkurasi** dari halaman masing-masing:
4 berita (hero) → 4 prestasi → 5 program → 3 alumni → 4 mitra →
teaser peta → widget "pelajaran hari ini" → 3 agenda terdekat.

## Aktivasi Strapi (checklist)

1. [x] `alumni-profiles`, `partners`, `programs`, `schedules`, `events` — sudah ada di CMS.
2. [ ] Buat `beritas`, `prestasis`, `jelajahis` — salin dari `strapi-schemas/` (cara cepat: tiru field di Admin → Content-Type Builder).
3. [ ] Beri izin **find + findOne** pada API token untuk semua content type.
4. [ ] Isi data: `STRAPI_URL=... STRAPI_TOKEN=<token-tulis> node scripts/strapi-seed.mjs semua`
       (atau isi manual lewat Admin Strapi).
5. [ ] Selesai — tanpa perlu mengubah kode frontend.

## Environment Variables

```
STRAPI_URL=https://cms.sman1kraksaan-web.my.id   # base URL CMS
STRAPI_TOKEN=...                                  # API token (find/findOne minimal)
```

## Sisa Pekerjaan (TODO)

- Isi konten asli di Strapi (mitra, program, berita, prestasi, jelajahi).
- Isi `schedules` (format field ada di `docs/STRAPI-INTEGRASI.md`) agar
  halaman jadwal otomatis beralih dari JSON statis ke CMS.
- Form create/edit dashboard (React Hook Form + Zod) ke endpoint Strapi
  (butuh API token dengan izin tulis — jangan pernah ditaruh di client).
- Autentikasi & proteksi route `/dashboard/*`.
- Ganti foto placeholder (peta `/jelajah/photos/*`, Unsplash) dengan aset resmi sekolah.
