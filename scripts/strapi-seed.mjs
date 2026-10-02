#!/usr/bin/env node
/**
 * strapi-seed.mjs — isi content type Strapi untuk web SMAN 1 Kraksaan.
 *
 * Pemakaian:
 *   STRAPI_URL=https://cms.sman1kraksaan-web.my.id \
 *   STRAPI_TOKEN=<token yang punya izin TULIS> \
 *   node scripts/strapi-seed.mjs <konten...> [--dry-run]
 *
 * Konten: berita agenda prestasi jelajahi program partner jadwal
 * Gunakan "semua" untuk mengisi semuanya. Contoh:
 *   node scripts/strapi-seed.msemua                      # salah ketik, lihat bawah
 *   node scripts/strapi-seed.mjs semua                   # isi semua
 *   node scripts/strapi-seed.mjs jadwal                  # impor 890 pelajaran dari schedule.json
 *   node scripts/strapi-seed.mjs berita agenda --dry-run # simulasikan tanpa menulis
 *
 * CATATAN PENTING:
 * - Token di .env website (STRAPI_TOKEN) biasanya read-only. Untuk seed,
 *   buat API token baru di Strapi Admin → Settings → API Tokens →
 *   pilih "Custom" dan aktifkan create/update untuk tiap content type.
 * - Content type yang belum ada di Strapi (lihat strapi-schemas/README.md)
 *   akan dilewati dengan peringatan, bukan error.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const STRAPI_URL = (process.env.STRAPI_URL || "").replace(/\/$/, "");
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || "";
const DRY_RUN = process.argv.includes("--dry-run");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const targets = args.length ? args : ["semua"];
const all = targets.includes("semua");

const CONCURRENCY = Number(process.env.CONCURRENCY || 4);

if (!STRAPI_URL || !STRAPI_TOKEN) {
  console.error("❌ STRAPI_URL dan STRAPI_TOKEN wajib diisi (lihat header file ini).");
  process.exit(1);
}

const H = { "Content-Type": "application/json", Authorization: `Bearer ${STRAPI_TOKEN}` };

async function post(plural, data) {
  const res = await fetch(`${STRAPI_URL}/api/${plural}`, {
    method: "POST",
    headers: H,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${body.slice(0, 160)}`);
  }
  return res.json();
}

async function exists(plural) {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${plural}?pagination[pageSize]=1`, { headers: H });
    return res.ok; // 404 = belum dibuat; 403 = token tidak punya izin find
  } catch {
    return false;
  }
}

function para(text) {
  // Blocks Strapi v5: satu paragraf per item.
  return [{ type: "paragraph", children: [{ type: "text", text }] }];
}

/* ------------------------------------------------------------------ */
/* Data contoh (diambil dari mock repo, siap dipakai atau diganti)      */
/* ------------------------------------------------------------------ */

const seedBerita = [
  {
    title: "SMAN 1 Kraksaan Raih Predikat Adiwiyata Nasional",
    excerpt: "Konsistensi program lingkungan sekolah membuahkan hasil dengan diraihnya predikat Adiwiyata tingkat nasional.",
    content: para("SMAN 1 Kraksaan resmi menerima penghargaan Adiwiyata Nasional setelah melalui proses penilaian selama satu tahun terakhir. Program bank sampah, kebun sekolah, dan kurikulum lingkungan hidup menjadi penilaian utama tim juri."),
    category: "Prestasi",
    author: "Humas Sekolah",
    featured: true,
  },
  {
    title: "Pembukaan Laboratorium Inovasi Digital",
    excerpt: "Fasilitas baru ini dilengkapi perangkat pemrograman dan IoT untuk mendukung pembelajaran teknologi.",
    content: para("Laboratorium Inovasi Digital resmi dibuka untuk mendukung program Koding dan Kecerdasan Artifisial. Fasilitas ini merupakan hasil kolaborasi dengan mitra industri teknologi."),
    category: "Fasilitas",
    author: "Tim Media",
  },
  {
    title: "Workshop Kewirausahaan Bersama Alumni",
    excerpt: "Alumni sukses berbagi pengalaman merintis usaha di hadapan siswa kelas XI dan XII.",
    content: para("Kegiatan ini menghadirkan alumni yang kini menjalankan usaha di bidang kuliner dan kreatif. Siswa berlatih menyusun rencana bisnis sederhana selama sesi workshop."),
    category: "Kegiatan",
    author: "OSIS",
  },
];

const seedAgenda = [
  {
    title: "School Innovation Day",
    date: "2026-11-12",
    location: "Aula SMAN 1 Kraksaan",
    description: para("Pameran karya inovasi siswa dari seluruh program keahlian, terbuka untuk umum."),
  },
  {
    title: "Campus Expo & Beasiswa",
    date: "2026-11-25",
    location: "Lapangan Utama",
    description: para("Pameran perguruan tinggi dan informasi beasiswa untuk siswa kelas XII."),
  },
  {
    title: "Pekan Olahraga & Seni (PORSENI)",
    date: "2026-12-05",
    location: "GOR Kraksaan",
    description: para("Kompetisi olahraga dan seni antar kelas dalam rangka HUT sekolah."),
  },
];

const seedPrestasi = [
  {
    title: "Juara 1 OSN Matematika Tingkat Provinsi",
    year: 2025,
    category: "Akademik",
    level: "Provinsi",
    description: para("Tim Olimpiade Sains Nasional bidang Matematika berhasil meraih juara pertama tingkat Provinsi Jawa Timur setelah melalui rangkaian seleksi ketat sejak tingkat kabupaten."),
    participants: "Ahmad Fauzan, Nadia Putri",
  },
  {
    title: "Juara 2 Kompetisi Robotik Nasional",
    year: 2025,
    category: "Teknologi",
    level: "Nasional",
    description: para("Tim robotik SMAN 1 Kraksaan tampil sebagai runner-up dalam Kompetisi Robotik Nasional kategori line follower otonom."),
    participants: "Bagas Prakoso, Citra Ayu, Dimas Aditya",
  },
  {
    title: "Medali Emas Cabang Atletik POPDA",
    year: 2024,
    category: "Olahraga",
    level: "Kabupaten",
    description: para("Cabang lari 100 meter putra berhasil membawa pulang medali emas dalam Pekan Olahraga Pelajar Daerah tingkat Kabupaten Probolinggo."),
    participants: "Rizky Ramadhan",
  },
];

const seedJelajahi = [
  { name: "Aula", category: "fasilitas", description: "Gedung serbaguna untuk upacara, pertunjukan, dan acara besar sekolah.", lantai: 1 },
  { name: "Lab. Fisika", category: "lab", description: "Laboratorium praktikum Fisika dengan peralatan eksperimen dasar hingga lanjutan.", lantai: 1 },
  { name: "Lab. Informatika", category: "lab", description: "Laboratorium komputer untuk pembelajaran Informatika dan KKA.", lantai: 1 },
  { name: "Perpustakaan", category: "fasilitas", description: "Koleksi buku teks dan fiksi, dilengkapi area baca siswa.", lantai: 1 },
  { name: "Ruang OSIS", category: "ekstrakurikuler", description: "Sekretariat organisasi siswa (OSKAMATURA).", lantai: 1 },
  { name: "Kantin Sekolah", category: "kantin", description: "Dapur dan area makan siswa dengan pedagang terkurasi.", lantai: 1 },
];

const seedProgram = [
  {
    name: "Koding dan Kecerdasan Artifisial",
    focus: "Kelas X",
    description: para("Dasar pemrograman dan AI sebagai pelajaran tetap di kelas X."),
    subjects: "Berpikir Komputasional, Praktik Koding, Etika AI",
    facilities: "Lab Informatika",
    careers: "Data Analyst, Software Engineer",
  },
  {
    name: "Mata Pelajaran Tingkat Lanjut",
    focus: "Kelas XI dan XII",
    description: para("Matematika, Bahasa Inggris, dan Sejarah dengan materi yang lebih dalam sebagai persiapan studi lanjut."),
    subjects: "Matematika TL, Bahasa Inggris TL, Sejarah TL",
    facilities: "Ruang Kelas, Lab, Perpustakaan",
    careers: "Kedokteran, Teknik, Sastra",
  },
  {
    name: "Bahasa Jepang",
    focus: "Kelas XI dan XII",
    description: para("Bahasa asing pilihan untuk siswa yang ingin belajar di luar bahasa Inggris."),
    subjects: "Bahasa Jepang",
    facilities: "Ruang Kelas, Lab Bahasa",
    careers: "Sastra Bahasa, Penerjemah",
  },
];

const seedPartner = [
  {
    title: "Universitas Brawijaya",
    partnerType: "Kuliah Tamu",
    description: para("Kolaborasi akademik dalam bentuk kuliah tamu, olimpiade bersama, dan pengenalan jalur penerimaan mahasiswa berprestasi."),
    since: 2019,
    website: "https://ub.ac.id",
  },
  {
    title: "Bank Jatim",
    partnerType: "Beasiswa & Jalur Masuk",
    description: para("Mendukung pengembangan siswa melalui edukasi literasi keuangan dan program beasiswa pendidikan."),
    since: 2022,
  },
];

/* ------------------------------------------------------------------ */
/* Jadwal dari src/data/schedule.json (30 kelas, 890 pelajaran)         */
/* ------------------------------------------------------------------ */

function schedulePayload() {
  const raw = JSON.parse(readFileSync(join(ROOT, "src/data/schedule.json"), "utf8"));
  const classes = raw.classes; // ["X A", ...]
  const items = [];
  for (const [classIdx, day, start, span, subject, teacher] of raw.lessons) {
    items.push({
      class: classes[classIdx] ?? `Kelas ${classIdx}`,
      day, // 1 = Senin ... 5 = Jumat
      start, // jam ke-1..11
      span,
      subject,
      teacher,
    });
  }
  return items;
}

/* ------------------------------------------------------------------ */
/* Eksekusi                                                            */
/* ------------------------------------------------------------------ */

const JOBS = [
  { key: "berita", plural: "beritas", label: "Berita", items: seedBerita },
  { key: "agenda", plural: "agendas", label: "Agenda", items: seedAgenda },
  { key: "prestasi", plural: "prestasis", label: "Prestasi", items: seedPrestasi },
  { key: "jelajahi", plural: "jelajahis", label: "Jelajahi", items: seedJelajahi },
  { key: "program", plural: "programs", label: "Program", items: seedProgram },
  { key: "partner", plural: "partners", label: "Partner", items: seedPartner },
];

async function seedCollection(job) {
  const ok = await exists(job.plural);
  if (!ok) {
    console.log(`⚠️  ${job.label}: endpoint /api/${job.plural} belum tersedia (404) atau token tidak punya izin find.`);
    console.log("   → Buat content type-nya dulu (lihat strapi-schemas/README.md), lalu jalankan ulang.");
    return { skipped: true };
  }
  if (DRY_RUN) {
    console.log(`🟡 ${job.label} (dry-run): akan mengirim ${job.items.length} entri ke /api/${job.plural}`);
    console.log("   Contoh payload:", JSON.stringify(job.items[0]).slice(0, 220), "…");
    return { sent: 0 };
  }
  let sent = 0, failed = 0;
  for (const item of job.items) {
    try {
      await post(job.plural, item);
      sent++;
    } catch (err) {
      failed++;
      if (failed <= 2) console.error(`   ❌ gagal: ${err.message}`);
    }
  }
  console.log(`✅ ${job.label}: ${sent} entri terkirim${failed ? `, ${failed} gagal` : ""}.`);
  return { sent };
}

async function seedSchedule() {
  const items = schedulePayload();
  const ok = await exists("schedules");
  if (!ok) {
    console.log("⚠️  Jadwal: endpoint /api/schedules belum tersedia atau token tanpa izin find.");
    return;
  }
  if (DRY_RUN) {
    console.log(`🟡 Jadwal (dry-run): akan mengirim ${items.length} pelajaran ke /api/schedules`);
    console.log("   Contoh payload:", JSON.stringify(items[0]));
    return;
  }
  let sent = 0, failed = 0, next = 0;
  async function worker() {
    while (next < items.length) {
      const item = items[next++];
      try {
        await post("schedules", item);
        sent++;
      } catch (err) {
        failed++;
        if (failed <= 3) console.error(`   ❌ gagal: ${err.message}`);
      }
      if (sent % 100 === 0 && sent > 0) console.log(`   … ${sent}/${items.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log(`✅ Jadwal: ${sent}/${items.length} pelajaran terkirim${failed ? `, ${failed} gagal` : ""}.`);
  console.log("   Format field yang dipakai: class, day (1-5), start (1-11), span, subject, teacher.");
}

console.log(`→ Target: ${STRAPI_URL}${DRY_RUN ? " (DRY RUN — tidak menulis apa pun)" : ""}\n`);

let anySkipped = false;
for (const job of JOBS) {
  if (!all && !targets.includes(job.key)) continue;
  const r = await seedCollection(job);
  if (r?.skipped) anySkipped = true;
}
if (all || targets.includes("jadwal")) {
  await seedSchedule();
}

console.log("\nSelesai. Jika ada yang terlewati, cek pesan ⚠️ di atas lalu:");
console.log("  1. Buat content type di Strapi (strapi-schemas/README.md),");
console.log("  2. Beri izin find + create pada API token,");
console.log("  3. Jalankan ulang skrip ini.");
