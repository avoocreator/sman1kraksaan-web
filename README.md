# SMAN 1 Kraksaan — School Digital Hub

Frontend untuk kompetisi **Jagoan Hosting Innovation Competition (JHIC) 2.0 2026** — cabang Web Development.

"One School. One Digital Ecosystem." — menghubungkan informasi sekolah, prestasi, alumni, mitra industri, karier/PKL, berita, agenda, dan asisten AI dalam satu platform.

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (design tokens berbasis CSS variables)
- Framer Motion (micro-interactions)
- Lucide React (ikon)
- Recharts (grafik dashboard/analitik)
- React Hook Form + Zod (siap dipakai untuk form CRUD lanjutan)

## Menjalankan Proyek

```bash
npm install
npm run dev
```

Buka http://localhost:3000

Build produksi:

```bash
npm run build
npm start
```

> Catatan: font Plus Jakarta Sans dimuat lewat `next/font/google`, jadi build memerlukan akses internet (normal di Vercel/lokal dengan koneksi). Jika environment build kamu tanpa internet, ganti ke `next/font/local` di `src/app/layout.tsx`.

## Struktur Folder

```
src/
├── app/                  # Routes (App Router)
│   ├── (public routes)/  # /, /about, /programs, /achievements, /alumni,
│   │                     # /partners, /career, /news, /events, /ppdb, /search
│   ├── login/
│   └── dashboard/        # Admin panel + sub-routes CRUD & analytics
├── components/
│   ├── ui/                # Button, Badge, SectionHeading, EmptyState
│   ├── layout/             # Navbar, Footer
│   ├── home/                # Seluruh section homepage
│   ├── achievements/ alumni/ partners/ career/ news/ events/ search/
│   ├── dashboard/           # Sidebar, Topbar, DataTable, charts
│   └── ai/                  # Floating button + chat thread (mock)
├── data/                  # Mock data terpusat (achievements, alumni, dst.)
├── lib/
│   ├── api/                # Abstraksi API — ganti isi fungsi dengan fetch()
│   │                       # ke backend Hono saat backend siap
│   ├── ai.ts                # Mock resolver AI assistant
│   └── utils.ts
└── types/                 # Semua interface TypeScript
```

## Menghubungkan ke Backend (Hono + PostgreSQL + Drizzle)

1. Buat `NEXT_PUBLIC_API_URL` di `.env.local`.
2. Edit setiap fungsi di `src/lib/api/index.ts` — ganti body dari
   `return getAllAchievements()` (mock) menjadi `fetch(...)` ke endpoint REST.
   Signature fungsi & shape data sengaja dibuat stabil sehingga
   **komponen tidak perlu diubah sama sekali**.
3. Untuk AI Assistant, edit `src/lib/ai.ts` (`getMockAiResponse`) agar
   memanggil endpoint AI backend, dan ubah `AiChatThread` agar `async`.
4. Untuk autentikasi admin, hubungkan form di `src/app/login/page.tsx`
   ke endpoint auth, lalu tambahkan middleware/guard di
   `src/app/dashboard/layout.tsx`.
5. Untuk form tambah/edit data di dashboard (saat ini tombol "Tambah..."
   masih UI-only), buat form dengan React Hook Form + Zod dan sambungkan
   ke endpoint POST/PUT/DELETE terkait.

## Environment Variables

Belum ada variabel wajib untuk menjalankan frontend saat ini (murni mock data).
Saat backend siap, tambahkan di `.env.local`:

```
NEXT_PUBLIC_API_URL=https://api.sman1kraksaan.sch.id
```

## Sisa Pekerjaan (TODO)

- Hubungkan seluruh fungsi di `src/lib/api/` dan `src/lib/ai.ts` ke backend nyata
- Tambahkan form create/edit (React Hook Form + Zod) pada tombol "Tambah..." di setiap halaman dashboard
- Tambahkan autentikasi & proteksi route `/dashboard/*`
- Tambahkan halaman `/dashboard/settings`
- Ganti gambar placeholder (Unsplash) dengan aset resmi sekolah
- Tambahkan pagination pada `/partners` dan halaman lain bila data bertambah banyak
- Tambahkan skeleton loading state saat data mulai berasal dari network (saat ini data lokal sehingga instan)
- Uji aksesibilitas (kontras warna, navigasi keyboard) secara menyeluruh
