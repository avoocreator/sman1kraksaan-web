/**
 * API abstraction layer — sumber data seluruh situs.
 *
 * Urutan pengambilan data untuk setiap konten:
 *   1. Strapi CMS (STRAPI_URL + STRAPI_TOKEN di .env) — sumber utama.
 *   2. Data contoh di `src/data/*` — fallback otomatis kalau Strapi
 *      tidak terjangkau, content type belum dibuat, atau masih kosong.
 *
 * Shape data yang dikembalikan SELALU sama dengan interface di
 * `src/types/index.ts`, jadi komponen tidak perlu tahu dari mana data datang.
 *
 * Mapping field sengaja fleksibel (beberapa alias per field) karena nama
 * field di Strapi ditentukan saat content type dibuat. Alias yang didukung
 * terdokumentasi di `docs/STRAPI-INTEGRASI.md`.
 */

import { getAllAchievements, getAchievementBySlug } from "@/data/achievements";
import { getAllAlumni, getAlumnusBySlug } from "@/data/alumni";
import { getAllPartners, getPartnerBySlug } from "@/data/partners";
import { getAllNews, getNewsBySlug } from "@/data/news";
import { getAllEvents, getEventBySlug } from "@/data/events";
import { getAllPrograms, getProgramBySlug } from "@/data/programs";
import { statistics } from "@/data/statistics";
import type {
  Achievement, AchievementCategory, AchievementLevel,
  Alumnus, NewsArticle, Partner, Program, SchoolEvent, SchoolRoom, Statistics,
} from "@/types";
import {
  arr, blocksToParagraphs, blocksToText, dateOnly, mediaUrl, num, pick, rowSlug, strapiCount, strapiList, strapiSingle, txt,
} from "@/lib/strapi";
import type { StrapiRow } from "@/lib/strapi";
import { todayJakarta } from "@/lib/utils";

export { getScheduleRaw } from "@/lib/schedule-strapi";

/**
 * Kandidat nama endpoint (pluralName di Strapi bisa bervariasi).
 * Urutan mengikuti content type yang benar-benar ada di CMS user:
 *   berita=articles, prestasi=achievements, agenda=events,
 *   jelajahi=school-places, alumni=alumni-profiles, dst.
 */
const CT = {
  prestasi: ["achievements", "prestasis", "prestasi"],
  alumni: ["alumni-profiles", "alumnis", "alumni"],
  partner: ["partners", "partner", "mitras", "mitra"],
  berita: ["articles", "beritas", "berita", "news", "news-articles"],
  agenda: ["events", "agendas", "agenda", "kegiatans"],
  jelajahi: ["school-places", "jelajahis", "rooms", "ruangans"],
  program: ["programs", "program"],
  jadwal: ["schedules", "schedule", "jadwals"],
  akreditasi: ["acreditation", "accreditations", "acreditation"],
};

const REVALIDATE = 60; // detik sebelum cache Strapi di-refresh

function placeholder(kind: "berita" | "agenda" | "prestasi"): string {
  const w = 1200;
  switch (kind) {
    case "berita":
      return `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=${w}&auto=format&fit=crop`;
    case "agenda":
      return `https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=${w}&auto=format&fit=crop`;
    case "prestasi":
      return `https://images.unsplash.com/photo-1596496181848-3091d4878b24?q=80&w=${w}&auto=format&fit=crop`;
  }
}

/* ------------------------------------------------------------------ */
/* PRESTASI (halaman /achievements)                                    */
/* ------------------------------------------------------------------ */

const LEVELS: AchievementLevel[] = ["Sekolah", "Kabupaten", "Provinsi", "Nasional", "Internasional"];
const CATEGORIES: AchievementCategory[] = ["Akademik", "Teknologi", "Olahraga", "Seni"];

function normEnum<T extends string>(v: unknown, options: T[], fallback: T): T {
  const s = txt(v).toLowerCase();
  const found = options.find((o) => s === o.toLowerCase() || s.includes(o.toLowerCase()));
  return found ?? fallback;
}

function mapAchievement(r: StrapiRow): Achievement {
  const title = txt(pick(r, "title", "judul"));
  const achieverName = txt(pick(r, "name", "nama", "peserta"));
  const yearGuess = num(pick(r, "year", "tahun"), 0);
  const dateField = pick(r, "date", "tanggal", "tanggalPrestasi");
  const year =
    yearGuess ||
    Number(dateOnly(dateField, "").slice(0, 4)) ||
    new Date(txt(pick(r, "publishedAt")) || Date.now()).getFullYear();

  return {
    slug: rowSlug(r),
    title: title || achieverName || "Prestasi Siswa",
    year,
    category: normEnum(pick(r, "category", "kategori", "bidang"), CATEGORIES, "Akademik"),
    // Tanpa field level → tebak dari kata kunci di judul (mis. "Nasional").
    level: inferLevel(pick(r, "level", "tingkat", "jenjang"), title),
    image:
      mediaUrl(pick(r, "image", "gambar", "foto", "cover", "dokumentasi", "media")) ??
      placeholder("prestasi"),
    description: blocksToText(pick(r, "description", "deskripsi", "keterangan"), 420),
    // Di CMS user, field `name` berisi nama peraih (bisa beberapa, dipisah koma).
    participants: achieverName && achieverName !== title ? arr(achieverName) : arr(pick(r, "participants", "peserta", "siswa", "anggota")),
  };
}

/** Tebak tingkat prestasi dari isi judul kalau field level tidak ada. */
function inferLevel(v: unknown, title: string): AchievementLevel {
  const explicit = txt(v);
  if (explicit) return normEnum(explicit, LEVELS, "Sekolah");
  const t = title.toLowerCase();
  if (t.includes("internasional") || t.includes("international")) return "Internasional";
  if (t.includes("nasional")) return "Nasional";
  if (t.includes("provinsi")) return "Provinsi";
  if (t.includes("kabupaten") || t.includes("kota") || t.includes("kecamatan")) return "Kabupaten";
  return "Sekolah";
}

export async function getAchievements(): Promise<Achievement[]> {
  const rows = await strapiList(CT.prestasi, REVALIDATE);
  // null  = Strapi tidak terjangkau / endpoint belum ada → data contoh.
  // []    = CMS ada tapi belum diisi → halaman tampil kosong (jujur).
  if (rows === null) return getAllAchievements();
  return rows.map(mapAchievement).sort((a, b) => b.year - a.year);
}

export async function getAchievement(slug: string): Promise<Achievement | undefined> {
  const all = await getAchievements();
  return (
    all.find((a) => a.slug === slug) ??
    getAchievementBySlug(slug)
  );
}

/* ------------------------------------------------------------------ */
/* ALUMNI (halaman /alumni — Strapi: alumni-profiles)                  */
/* ------------------------------------------------------------------ */

function parseTimeline(v: unknown): { year: number; label: string }[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => {
      if (typeof item === "string") return { year: 0, label: item };
      if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        return { year: num(o.year ?? o.tahun, 0), label: txt(o.label ?? o.kejadian ?? o.event) };
      }
      return null;
    })
    .filter((t): t is { year: number; label: string } => Boolean(t?.label));
}

function mapAlumnus(r: StrapiRow): Alumnus {
  const name = txt(pick(r, "name", "nama", "fullName"));
  const media = pick(r, "media", "photo", "foto", "gambar");
  const photo = mediaUrl(media);
  const graduationYear = num(pick(r, "graduationYear", "tahunLulus", "angkatan"), 0);
  const university = txt(pick(r, "university", "universitas", "destination", "kampus"));
  const major = txt(pick(r, "major", "prodi", "programStudi", "jurusan"));
  const role = txt(pick(r, "role", "pekerjaan", "jabatan", "posisi", "profesi"));
  const categoryRaw = txt(pick(r, "category", "kategori"));

  let timeline = parseTimeline(pick(r, "timeline", "riwayat", "perjalanan"));
  if (timeline.length === 0 && graduationYear) {
    timeline = [{ year: graduationYear, label: "Lulus SMAN 1 Kraksaan" }];
    if (university) timeline.push({ year: graduationYear + 4, label: `${university}${major ? ` — ${major}` : ""}` });
  }

  return {
    slug: rowSlug(r),
    name: name || "Alumni SMAN 1 Kraksaan",
    photo: photo ?? "",
    graduationYear,
    destination: university,
    role: role || (university ? `Mahasiswa ${major || university}` : ""),
    location: txt(pick(r, "location", "lokasi", "kota", "domisili")),
    category: (["Pendidikan Tinggi", "Karier Profesional", "Wirausaha"].find((c) =>
      categoryRaw.toLowerCase().includes(c.split(" ")[0].toLowerCase()),
    ) ?? (university ? "Pendidikan Tinggi" : "Karier Profesional")) as Alumnus["category"],
    bio: blocksToText(pick(r, "description", "deskripsi", "bio", "biografi")) ||
      [university && `Melanjutkan ke ${university}${major ? `, jurusan ${major}` : ""}.`, role && `Kini: ${role}.`]
        .filter(Boolean)
        .join(" "),
    timeline,
  };
}

export async function getAlumni(): Promise<Alumnus[]> {
  const rows = await strapiList(CT.alumni, REVALIDATE);
  if (rows === null) return getAllAlumni();
  return rows
    .map(mapAlumnus)
    // Entri tanpa nama (hanya foto/deskripsi) ditaruh paling belakang.
    .sort(
      (a, b) =>
        Number(a.name.startsWith("Alumni SMAN")) - Number(b.name.startsWith("Alumni SMAN")) ||
        b.graduationYear - a.graduationYear,
    );
}

export async function getAlumnus(slug: string): Promise<Alumnus | undefined> {
  const all = await getAlumni();
  return (
    all.find((a) => a.slug === slug) ??
    getAlumnusBySlug(slug)
  );
}

/* ------------------------------------------------------------------ */
/* PARTNER / MITRA (halaman /partners)                                 */
/* ------------------------------------------------------------------ */

function mapPartner(r: StrapiRow): Partner {
  const name = txt(pick(r, "name", "nama", "title", "judul")) || "Mitra";
  const sinceGuess = num(pick(r, "since", "tahunMulai", "sejak", "tahun"), 0);
  return {
    slug: rowSlug(r),
    name,
    logo: name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join(""),
    logoImage: mediaUrl(pick(r, "logo", "logoImage", "media", "gambar", "image")) ?? "",
    type: (txt(pick(r, "partnerType", "partner_type", "type", "jenis", "kategori")) || "Mitra") as Partner["type"],
    description: blocksToText(pick(r, "decription", "description", "deskripsi"), 420),
    since: sinceGuess || new Date(txt(pick(r, "publishedAt")) || Date.now()).getFullYear(),
    website: txt(pick(r, "website", "situs", "url")) || undefined,
    programs: arr(pick(r, "programs", "program", "programKerja", "bentukKerjaSama", "bidangKerjaSama")),
  };
}

export async function getPartners(): Promise<Partner[]> {
  const rows = await strapiList(CT.partner, REVALIDATE);
  if (rows === null) return getAllPartners();
  return rows.map(mapPartner);
}

export async function getPartner(slug: string): Promise<Partner | undefined> {
  const all = await getPartners();
  return (
    all.find((p) => p.slug === slug) ??
    getPartnerBySlug(slug)
  );
}

/* ------------------------------------------------------------------ */
/* BERITA (halaman /news)                                              */
/* ------------------------------------------------------------------ */

function mapNews(r: StrapiRow): NewsArticle {
  const contentBlocks = pick(r, "content", "isi", "konten", "body");
  const paragraphs = blocksToParagraphs(contentBlocks);
  const excerpt = blocksToText(pick(r, "excerpt", "ringkasan", "summary"), 180);
  return {
    slug: rowSlug(r),
    title: txt(pick(r, "title", "judul")) || "Berita",
    excerpt: excerpt || paragraphs[0]?.slice(0, 160) || "",
    content: paragraphs,
    category: txt(pick(r, "category", "kategori")) || "Berita",
    cover:
      mediaUrl(pick(r, "cover", "sampul", "gambar", "image", "thumbnail", "media")) ??
      placeholder("berita"),
    publishedAt: dateOnly(pick(r, "publishedAt", "tanggal", "date", "createdAt")),
    author: txt(pick(r, "author", "penulis")) || "Humas Sekolah",
    featured: pick(r, "featured", "utama") === true,
  };
}

export async function getNews(): Promise<NewsArticle[]> {
  const rows = await strapiList(CT.berita, REVALIDATE);
  if (rows === null) return getAllNews();
  return rows.map(mapNews).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | undefined> {
  const all = await getNews();
  return (
    all.find((n) => n.slug === slug) ??
    getNewsBySlug(slug)
  );
}

/* ------------------------------------------------------------------ */
/* AGENDA (halaman /events)                                            */
/* ------------------------------------------------------------------ */

function mapEvent(r: StrapiRow): SchoolEvent {
  const date = dateOnly(pick(r, "date", "tanggal", "tanggalMulai", "startDate", "waktu", "createdAt"));
  return {
    slug: rowSlug(r),
    title: txt(pick(r, "title", "judul", "nama", "name")) || "Agenda",
    date,
    location: txt(pick(r, "location", "lokasi", "tempat")) || "SMAN 1 Kraksaan",
    description: blocksToText(pick(r, "description", "deskripsi", "keterangan"), 420),
    image:
      mediaUrl(pick(r, "image", "gambar", "foto", "poster", "media")) ?? placeholder("agenda"),
    // Hari ini mengikuti WIB, bukan UTC server, supaya agenda hari ini
    // tidak salah masuk kelompok "Selesai" sebelum jam 07:00.
    status: date >= todayJakarta() ? "Akan Datang" : "Selesai",
  };
}

export async function getEvents(): Promise<SchoolEvent[]> {
  const rows = await strapiList(CT.agenda, REVALIDATE);
  if (rows === null) return getAllEvents();
  // Urut dari tanggal terdekat (untuk "kegiatan mendatang" di beranda).
  return rows.map(mapEvent).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getEvent(slug: string): Promise<SchoolEvent | undefined> {
  const all = await getEvents();
  return (
    all.find((e) => e.slug === slug) ??
    getEventBySlug(slug)
  );
}

/* ------------------------------------------------------------------ */
/* PROGRAM (halaman /programs)                                         */
/* ------------------------------------------------------------------ */

function mapProgram(r: StrapiRow): Program {
  return {
    slug: rowSlug(r),
    name: txt(pick(r, "name", "nama", "title", "judul")) || "Program",
    description: blocksToText(pick(r, "description", "decription", "deskripsi"), 600),
    focus: txt(pick(r, "focus", "fokus", "penekanan", "level", "tingkat")),
    subjects: arr(pick(r, "subjects", "mapel", "mataPelajaran", "pelajaran")),
    facilities: arr(pick(r, "facilities", "fasilitas", "sarana")),
    careers: arr(pick(r, "careers", "karier", "karir", "prospekKarier", "studiLanjut")),
  };
}

export async function getPrograms(): Promise<Program[]> {
  const rows = await strapiList(CT.program, REVALIDATE);
  if (rows === null) return getAllPrograms();
  return rows.map(mapProgram);
}

export async function getProgram(slug: string): Promise<Program | undefined> {
  const all = await getPrograms();
  return (
    all.find((p) => p.slug === slug) ??
    getProgramBySlug(slug)
  );
}

/* ------------------------------------------------------------------ */
/* JELAJAHI — ruang peta sekolah (halaman /jelajahi)                   */
/* ------------------------------------------------------------------ */

/**
 * Ruangan per lantai: [lantai1, lantai2].
 *
 * Peta denah (posisi x/y/w/h) selalu memakai layout statis repo karena
 * di Strapi tidak ada field posisi. Konten ruangan (foto + deskripsi)
 * AMBIL dari Strapi content type `school-places` — dicocokkan ke denah
 * lewat nama (mis. "LAB FISIKA" → ruang "Lab. Fisika"). Ruangan yang
 * tidak ada padanannya tetap memakai konten bawaan.
 */
const PLACE_ALIASES: Record<string, string> = {
  "RUANG SINEMATURA": "r-sinematura",
  "LAB FISIKA": "lab-fisika",
  "POS SATPAM": "satpam",
  "LAB KIMIA": "lab-kimia",
  "LAB BIOLOGI": "lab-biologi",
  PERPUSTAKAAN: "perpustakaan",
  "RUANG PERTEMUAN": "ruang-pertemuan",
  TAMAN: "taman-besar",
  "RUANG KOMITE": "komite",
  "RUANG KURIKULUM": "kurikulum",
  "RUANG TU DAN KEPSEK": "tu-kepsek",
  "RUANG GURU": "r-guru",
  "RUANG BK": "r-bk",
  "RUANG MUSIK": "ruang-musik",
  "RUANG OSIS": "r-osis",
  UKS: "uks",
  "RUANG BOS DAN BPOPP": "r-bos",
  "RUANG PECINTA ALAM": "r-pecinta-alam",
  "RUANG PRAMUKA": "r-pramuka",
  "RUANG SILAT": "r-silat",
};

/** Normalisasi nama ruangan untuk pencocokan longgar. */
function normRoomName(s: string): string {
  return s
    .toUpperCase()
    .replace(/[.\/&]/g, " ")
    .replace(/\bDAN\b|\bDAN-\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchRoomId(name: string, rooms: SchoolRoom[]): string | undefined {
  const alias = PLACE_ALIASES[normRoomName(name)];
  if (alias) return alias;
  const target = normRoomName(name);
  // Buang awalan generik "RUANG "/"R "/"LAB " di kedua sisi lalu bandingkan.
  const strip = (s: string) => s.replace(/^(RUANG|R|LAB)\s+/, "");
  return rooms.find((room) => strip(normRoomName(room.name)) === strip(target))?.id;
}

export async function getSchoolRooms(): Promise<{ floor1: SchoolRoom[]; floor2: SchoolRoom[] }> {
  const { floor1Rooms, floor2Rooms } = await import("@/data/school-map");
  const applyOverride = (rooms: SchoolRoom[]): SchoolRoom[] => rooms.map((room) => ({ ...room }));
  const floor1 = applyOverride(floor1Rooms);
  const floor2 = applyOverride(floor2Rooms);

  const rows = await strapiList(CT.jelajahi, REVALIDATE);
  if (!rows) return { floor1, floor2 };

  const byId = new Map(floor1.concat(floor2).map((room) => [room.id, room]));
  for (const r of rows) {
    const name = txt(pick(r, "name", "nama", "title", "judul"));
    if (!name) continue;
    const roomId = matchRoomId(name, [...floor1, ...floor2]);
    const room = roomId ? byId.get(roomId) : undefined;
    const photo = mediaUrl(pick(r, "photo", "foto", "gambar", "image", "media"));
    const desc = blocksToText(pick(r, "description", "deskripsi", "keterangan"), 300);
    if (room) {
      // Konten dari CMS menimpa bawaan; posisi (x/y/w/h) tetap dari denah.
      if (photo) room.photo = photo;
      if (desc) room.description = desc;
    } else if (photo) {
      // Ruangan CMS tanpa padanan di denah: tampilkan sebagai kartu ekstra
      // di bawah peta tidak memungkinkan (peta statis) — lewati saja.
      continue;
    }
  }
  return { floor1, floor2 };
}

/* ------------------------------------------------------------------ */
/* AKREDITASI (single type `acreditation` — PDF sertifikat)            */
/* ------------------------------------------------------------------ */

/** URL PDF sertifikat akreditasi dari Strapi; undefined kalau belum ada. */
export async function getAccreditationPdf(): Promise<string | undefined> {
  const row = await strapiSingle<StrapiRow>(CT.akreditasi, 300);
  if (!row) return undefined;
  return mediaUrl(pick(row, "media", "file", "certificate", "sertifikat"));
}

/* ------------------------------------------------------------------ */
/* STATISTIK (dashboard)                                               */
/* ------------------------------------------------------------------ */

export async function getStatistics(): Promise<Statistics> {
  const [prestasi, alumni, partners, programs] = await Promise.all([
    strapiCount(CT.prestasi),
    strapiCount(CT.alumni),
    strapiCount(CT.partner),
    strapiCount(CT.program),
  ]);
  return {
    achievements: prestasi ?? statistics.achievements,
    alumni: alumni ?? statistics.alumni,
    partners: partners ?? statistics.partners,
    programs: programs ?? statistics.programs,
    alumniHigherEd: statistics.alumniHigherEd,
    alumniProfessional: statistics.alumniProfessional,
    alumniEntrepreneur: statistics.alumniEntrepreneur,
  };
}
