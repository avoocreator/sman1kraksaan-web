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

## Stress Test dengan k6

Stress test mencakup seluruh halaman publik, detail konten, login, dan dashboard. Setiap run menghasilkan dashboard HTML mandiri, ringkasan JSON, dan log diagnostik di `reports/k6/`.

Pasang [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) terlebih dahulu. Di macOS:

```bash
brew install k6
```

Jalankan aplikasi dalam mode produksi agar hasilnya representatif:

```bash
npm run build
npm start
```

Di terminal lain, jalankan:

```bash
npm run test:load
```

Profil default menaikkan beban dari 5 hingga 100 virtual users selama sekitar 4 menit. Konfigurasi dapat dioverride melalui environment variable:

```bash
BASE_URL=https://staging.example.com \
STAGES="30s:10,1m:50,2m:200,30s:0" \
MAX_P95_MS=1500 \
MAX_P99_MS=2000 \
MAX_ERROR_RATE=0.01 \
THINK_TIME=0.5 \
npm run test:load
```

`STAGES` menggunakan format `durasi:virtual-users` yang dipisahkan koma. Tes dianggap gagal jika lebih dari 1% request error atau p95/p99 response time melampaui 2 detik, termasuk pemeriksaan per halaman. Setiap run menyimpan dashboard HTML, ringkasan JSON, dan log terminal bertimestamp; log mencatat URL, status, error code, dan durasi request yang gagal. k6 pada skenario ini mengukur respons HTTP dokumen halaman; gunakan Lighthouse atau browser performance test secara terpisah untuk Core Web Vitals dan waktu pemuatan aset di browser.

### Breakpoint test

Breakpoint test mencari batas kapasitas dalam request per detik (RPS), bukan jumlah virtual user. Profil default menaikkan target dari 50 hingga 1.200 RPS. Tes berhenti otomatis jika error rate mencapai 5% atau p95 melampaui 2 detik selama 20 detik.

Jalankan hanya pada maintenance window. Perintah memerlukan konfirmasi eksplisit karena dapat membuat target tidak tersedia dan menimbulkan biaya trafik:

```bash
BASE_URL=https://staging.example.com \
CONFIRM_PRODUCTION_BREAKPOINT=I_UNDERSTAND_THIS_CAN_CAUSE_AN_OUTAGE \
npm run test:breakpoint
```

Profil dan pengaman dapat dioverride:

```bash
BASE_URL=https://staging.example.com \
RATE_STAGES="30s:100,1m:100,30s:200,1m:200,30s:400,1m:400" \
MAX_P95_MS=2000 \
MAX_ERROR_RATE=0.05 \
ABORT_DELAY=20s \
PREALLOCATED_VUS=200 \
MAX_VUS=3000 \
CONFIRM_PRODUCTION_BREAKPOINT=I_UNDERSTAND_THIS_CAN_CAUSE_AN_OUTAGE \
npm run test:breakpoint
```

`RATE_STAGES` menggunakan format `durasi:target-RPS`. Batas operasional yang aman sebaiknya maksimal 60-70% dari tingkat tertinggi yang tetap memenuhi p95 dan error rate. Jika `dropped_iterations` lebih dari nol, generator beban gagal mencapai target sehingga hasil tersebut belum membuktikan batas server.

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
