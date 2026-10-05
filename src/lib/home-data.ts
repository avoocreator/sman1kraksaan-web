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

export type HomeData = {
  heroArticles: NewsArticle[];
  achievements: Achievement[];
  programItems: ProgramItem[];
  alumniItems: AlumniItem[];
  partnerItems: PartnerItem[];
  events: SchoolEvent[];
  schedule: RawSchedule | null;
};

const truncate = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s);

// mapper
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

// data beranda
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

  const heroArticles = [...news]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4);

  const namedAlumni = alumni.filter((a) => !a.name.startsWith("Alumni SMAN"));
  const alumniForHome = namedAlumni.length ? namedAlumni : alumni;

  const n: Record<string, number> = {};
  return {
    heroArticles,
    achievements: achievements.filter((a) => (n[a.category] = (n[a.category] ?? 0) + 1) <= 4),
    programItems: programs.slice(0, 5).map(toProgramItem),
    alumniItems: alumniForHome.map(toAlumniItem),
    partnerItems: partners.slice(0, 4).map(toPartnerItem),
    events,
    schedule,
  };
}

// saran pencarian
export async function getSearchSuggestions(): Promise<SearchItem[]> {
  const [news, events, achievements] = await Promise.all([
    getNews(),
    getEvents(),
    getAchievements(),
  ]);

  const today = todayJakarta();
  const out: SearchItem[] = [];

  const todayEvent = events.find((e) => e.date === today);
  if (todayEvent) {
    out.push({
      title: todayEvent.title,
      category: "Agenda",
      href: `/events/${todayEvent.slug}`,
      description: "Agenda yang berlangsung hari ini",
    });
  }

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

  const topAchievement = achievements[0];
  if (topAchievement) {
    out.push({
      title: topAchievement.title,
      category: "Prestasi",
      href: `/achievements/${topAchievement.slug}`,
      description: `${topAchievement.category} · ${topAchievement.level} · ${topAchievement.year}`,
    });
  }

  const seen = new Set<string>();
  return out.filter((s) => (seen.has(s.href) ? false : (seen.add(s.href), true))).slice(0, 6);
}
