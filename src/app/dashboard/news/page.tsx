import { DashboardTopbar } from "@/components/dashboard/topbar";
import { NewsTable } from "@/components/dashboard/news-table";
import { getNews } from "@/lib/api";

export default async function DashboardNewsPage() {
  const news = await getNews();
  return (
    <div>
      <DashboardTopbar title="Manajemen Berita" />
      <div className="p-4 lg:p-8">
        <NewsTable news={news} />
      </div>
    </div>
  );
}
