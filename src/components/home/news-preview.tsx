"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { NewsArticle } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function NewsPreview({ articles }: { articles: NewsArticle[] }) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug).slice(0, 3);

  return (
    <section className="container-page py-20 md:py-28">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <SectionHeading eyebrow="Berita" title="Kabar Terbaru Sekolah." />
        <LinkButton href="/news" variant="outline" size="sm">
          Semua Berita <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <motion.a
          href={`/news/${featured.slug}`}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="group block overflow-hidden rounded-3xl border border-border bg-surface"
        >
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={featured.cover}
              alt={featured.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <Badge>{featured.category}</Badge>
            <h3 className="mt-3 text-xl font-bold leading-snug text-ink group-hover:text-orange-dark">
              {featured.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{featured.excerpt}</p>
            <p className="mt-4 text-xs text-muted">{formatDate(featured.publishedAt)} · {featured.author}</p>
          </div>
        </motion.a>

        <div className="grid gap-4">
          {rest.map((a, i) => (
            <motion.a
              key={a.slug}
              href={`/news/${a.slug}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex gap-4 rounded-2xl border border-border bg-surface p-3"
            >
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                <img src={a.cover} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="min-w-0">
                <Badge tone="neutral" className="mb-1.5">{a.category}</Badge>
                <p className="truncate text-sm font-semibold text-ink group-hover:text-orange-dark">{a.title}</p>
                <p className="mt-1 text-xs text-muted">{formatDate(a.publishedAt)}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
