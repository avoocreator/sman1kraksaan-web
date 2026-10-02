import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ContentTable } from "@/components/dashboard/content-table";
import { getNews, getEvents, getAchievements } from "@/lib/api";

export default async function ContentPage() {
  const [news, events, achievements] = await Promise.all([getNews(), getEvents(), getAchievements()]);

  const rows = [
    ...news.map((n) => ({ id: `news-${n.slug}`, title: n.title, type: "Berita", status: "Terbit", updated: n.publishedAt, author: n.author })),
    ...events.map((e) => ({ id: `event-${e.slug}`, title: e.title, type: "Agenda", status: e.status === "Akan Datang" ? "Terbit" : "Selesai", updated: e.date, author: "Admin" })),
    ...achievements.map((a) => ({ id: `ach-${a.slug}`, title: a.title, type: "Prestasi", status: "Terbit", updated: `${a.year}-01-01`, author: "Admin" })),
  ];

  return (
    <div>
      <DashboardTopbar title="Manajemen Konten" />
      <div className="p-4 lg:p-8">
        <ContentTable rows={rows} />
      </div>
    </div>
  );
}
