import type { Metadata } from "next";
import { getAchievements, getAlumni, getNews, getEvents, getPrograms } from "@/lib/api";
import { SearchExplorer } from "@/components/search/search-explorer";
import type { SearchItem } from "@/types/search";

export const revalidate = 60;

export const metadata: Metadata = { title: "Pencarian", description: "Cari prestasi, alumni, berita, agenda, dan program di satu tempat." };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [achievements, alumni, news, events, programs, params] = await Promise.all([
    getAchievements(), getAlumni(), getNews(), getEvents(), getPrograms(),
    searchParams,
  ]);
  const initialQuery = (params.q ?? "").slice(0, 100);

  const items: SearchItem[] = [
    ...achievements.map((a) => ({ title: a.title, category: "Prestasi" as const, href: `/achievements/${a.slug}`, description: `${a.category} · ${a.level} · ${a.year}` })),
    ...alumni.map((a) => ({ title: a.name, category: "Alumni" as const, href: `/alumni/${a.slug}`, description: a.role })),
    ...news.map((n) => ({ title: n.title, category: "Berita" as const, href: `/news/${n.slug}`, description: n.excerpt })),
    ...events.map((e) => ({ title: e.title, category: "Agenda" as const, href: `/events/${e.slug}`, description: e.location })),
    ...programs.map((p) => ({ title: p.name, category: "Program" as const, href: `/programs`, description: p.focus })),
  ];

  const popular: SearchItem[] = [...news]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 5)
    .map((n) => ({ title: n.title, category: "Berita" as const, href: `/news/${n.slug}`, description: n.excerpt }));

  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Pencarian</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Cari Apa Saja di Sini</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">Prestasi, alumni, berita, agenda, hingga program — semua dalam satu pencarian.</p>
      </div>
      <div className="mt-10">
        <SearchExplorer items={items} initialQuery={initialQuery} popular={popular} />
      </div>
    </div>
  );
}
