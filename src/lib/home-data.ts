import type { ProgramItem } from "@/components/home/programs-preview";
import type { AlumniItem } from "@/components/home/alumni-preview";
import type { PartnerItem } from "@/components/home/partners-preview";
import type { Achievement, Alumnus, NewsArticle, Partner, Program, SchoolEvent } from "@/types";
import type { SearchItem } from "@/types/search";
import type { RawSchedule } from "@/lib/schedule";
import {
  getAchievements, getAlumni, getEvents, getNews, getPartners, getPrograms, getScheduleRaw,
} from "@/lib/api";
import { todayJakarta } from "@/lib/utils";

/**
 * Data beranda: subset terkurasi dari data halaman masing-masing.
 * Semua berasal dari lapisan API yang sama dengan halaman penuhnya
 * (Strapi dulu, fallback data contoh) — hanya diambil sebagian agar
 * beranda ringkas, bukan menyalin seluruh isi halaman.
 */
export type HomeData = {
  heroArticles: NewsArticle[]; // 4 berita teratas: featured dulu, lalu terbaru
  achievements: Achievement[]; // 4 prestasi dengan tahun terbaru
  programItems: ProgramItem[]; // 5 program untuk layout bento
  alumniItems: AlumniItem[]; // galeri lulusan utk carousel
  partnerItems: PartnerItem[]; // 4 mitra
  events: SchoolEvent[]; // semua agenda; preview sendiri memilih 3 terdekat
  schedule: RawSchedule | null; // jadwal dari Strapi (null = statis)
};

const truncate = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

function toProgramItem(p: Program): ProgramItem {
  return {
    title: p.name,
    level: p.focus,
    desc: truncate(p.description, 130),
    icon: "book",
  };
}

function toAlumniItem(a: Alumnus): AlumniItem {
  return {
    name: a.name,
    year: a.graduationYear ? String(a.graduationYear) : "",
    university: a.destination,
    major: "",
    path: a.category,
    photo: a.photo || undefined,
    desc: a.bio || undefined, // info singkat utk pop-up (dari Strapi: description)
  };
}

function toPartnerItem(p: Partner): PartnerItem {
  return {
    name: p.name,
    type: p.type,
    note: truncate(p.description, 90),
    logo: p.logoImage || undefined, // logo dari field media Strapi
  };
}

export async function getHomeData(): Promise<HomeData> {
  const [news, achievements, programs, alumni, partners, events, schedule] = await Promise.all([
    getNews(),
    getAchievements(),
    getPrograms(),
    getAlumni(),
    getPartners(),
    getEvents(),
    getScheduleRaw(),
  ]);

  // Hero: berita unggulan dulu, lalu sisanya per tanggal terbaru.
  const heroArticles = [...news]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4);

  // Beranda menampilkan alumni dari Strapi (yang bernama didahulukan);
  // carousel kelas Prestasi menggeser semuanya berulang.
  const namedAlumni = alumni.filter((a) => !a.name.startsWith("Alumni SMAN"));
  const alumniForHome = namedAlumni.length ? namedAlumni : alumni;

  const n: Record<string, number> = {};
  return {
    heroArticles,
    // 4 teratas per kategori: filter di beranda dilakukan di klien, jadi tab
    // non-teratas tidak kosong. Urutan (tahun terbaru) tetap terjaga.
    achievements: achievements.filter((a) => (n[a.category] = (n[a.category] ?? 0) + 1) <= 4),
    programItems: programs.slice(0, 5).map(toProgramItem),
    alumniItems: alumniForHome.map(toAlumniItem),
    partnerItems: partners.slice(0, 4).map(toPartnerItem),
    events,
    schedule,
  };
}

/**
 * Rekomendasi untuk search bar beranda (maksimal ±6).
 * Prioritas: agenda hari ini dulu (paling relevan saat ini diakses),
 * lalu berita terbaru/unggulan, lalu prestasi terbaru, lalu halaman populer.
 * Data diambil lewat lapisan API yang sama (ISR 60 detik) sehingga selalu
 * segar tanpa perlu endpoint tambahan.
 */
export async function getSearchSuggestions(): Promise<SearchItem[]> {
  const [news, events, achievements] = await Promise.all([
    getNews(),
    getEvents(),
    getAchievements(),
  ]);

  const today = todayJakarta();
  const out: SearchItem[] = [];

  // 1) Agenda hari ini — kalau hari ini ada agenda (mis. Hari Batik Nasional).
  const todayEvent = events.find((e) => e.date === today);
  if (todayEvent) {
    out.push({
      title: todayEvent.title,
      category: "Agenda",
      href: `/events/${todayEvent.slug}`,
      description: "Agenda yang berlangsung hari ini",
    });
  }

  // 2) Berita terbaru/unggulan (sudah diurut featured dulu di getHomeData,
  //    di sini cukup per tanggal terbaru).
  for (const n of [...news]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4)) {
    out.push({
      title: n.title,
      category: "Berita",
      href: `/news/${n.slug}`,
      description: n.excerpt || n.category,
    });
  }

  // 3) Prestasi terbaru.
  const topAchievement = achievements[0];
  if (topAchievement) {
    out.push({
      title: topAchievement.title,
      category: "Prestasi",
      href: `/achievements/${topAchievement.slug}`,
      description: `${topAchievement.category} · ${topAchievement.level} · ${topAchievement.year}`,
    });
  }

  // Buang duplikat berdasarkan href lalu batasi jumlahnya.
  const seen = new Set<string>();
  return out.filter((s) => (seen.has(s.href) ? false : (seen.add(s.href), true))).slice(0, 6);
}
