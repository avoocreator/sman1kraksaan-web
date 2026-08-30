import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getNewsArticle, getNews } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  return (
    <article className="container-page py-14 md:py-20">
      <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Berita
      </Link>

      <div className="mx-auto mt-8 max-w-3xl">
        <Badge>{article.category}</Badge>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{article.title}</h1>
        <p className="mt-3 text-sm text-muted">{formatDate(article.publishedAt)} · {article.author}</p>

        <div className="mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-border">
          <img src={article.cover} alt={article.title} className="h-full w-full object-cover" />
        </div>

        <div className="prose-content mt-8 space-y-5">
          {article.content.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-ink-soft">{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
