import type { Metadata } from "next";
import { getNews } from "@/lib/api";
import { NewsExplorer } from "@/components/news/news-explorer";
import { EmptyState } from "@/components/ui/empty-state";

export const revalidate = 60;

export const metadata: Metadata = { title: "Berita", description: "Kabar dan informasi terbaru dari SMAN 1 Kraksaan." };

export default async function NewsPage() {
  const articles = await getNews();
  return (
    <div className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Berita</p>
        <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">Kabar Sekolah</h1>
      </div>
      <div className="mt-10">
        {articles.length === 0 ? (
          <EmptyState
            title="Belum ada berita di CMS."
            description="Tambahkan entri di Strapi (Collection Types → Article): isi title, content, dan unggah foto di field media — halaman ini terisi otomatis."
          />
        ) : (
          <NewsExplorer articles={articles} />
        )}
      </div>
    </div>
  );
}
