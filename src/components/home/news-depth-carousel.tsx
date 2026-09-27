"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { NewsArticle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface NewsDepthCarouselProps {
  articles: NewsArticle[];
}

export function NewsDepthCarousel({
  articles,
}: NewsDepthCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = articles.slice(0, 5);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[28px] border border-border bg-surface-alt text-sm text-muted">
        Belum ada berita terbaru.
      </div>
    );
  }

  const getOffset = (index: number) => {
    let offset = index - activeIndex;

    if (offset > items.length / 2) {
      offset -= items.length;
    }

    if (offset < -items.length / 2) {
      offset += items.length;
    }

    return offset;
  };

  return (
    <div className="relative mx-auto h-[500px] w-full max-w-[420px] sm:h-[540px] lg:max-w-[500px]">
      {items.map((article, index) => {
        const offset = getOffset(index);

        const isActive = offset === 0;
        const isVisible = Math.abs(offset) <= 2;

        return (
          <motion.a
            key={article.slug}
            href={`/news/${article.slug}`}
            className="absolute left-1/2 top-1/2 block w-[270px] sm:w-[300px]"
            initial={false}
            animate={{
              x: `calc(-50% + ${offset * 92}px)`,
              y: `calc(-50% + ${Math.abs(offset) * 18}px)`,
              scale:
                offset === 0
                  ? 1
                  : offset === 1 || offset === -1
                    ? 0.9
                    : 0.8,
              rotateY: offset * -7,
              opacity: isVisible
                ? offset === 0
                  ? 1
                  : offset === 1 || offset === -1
                    ? 0.72
                    : 0.35
                : 0,
              zIndex: 20 - Math.abs(offset),
              filter:
                offset === 0
                  ? "blur(0px)"
                  : `blur(${Math.min(Math.abs(offset) * 2, 4)}px)`,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformStyle: "preserve-3d",
              pointerEvents: isVisible ? "auto" : "none",
            }}
            whileHover={
              isActive
                ? {
                    scale: 1.025,
                    y: "calc(-50% - 4px)",
                  }
                : undefined
            }
          >
            <article className="overflow-hidden rounded-[22px] border border-border bg-surface shadow-2xl shadow-ink/10">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={article.cover}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <Badge>{article.category}</Badge>

                  <h3 className="mt-3 line-clamp-3 text-lg font-bold leading-snug">
                    {article.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-xs text-white/75">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 bg-surface px-4 py-3">
                <p className="line-clamp-1 text-xs text-ink-soft">
                  {article.excerpt}
                </p>

                <ArrowRight className="h-4 w-4 shrink-0 text-orange" />
              </div>
            </article>
          </motion.a>
        );
      })}

      <div className="absolute -bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
        {items.map((article, index) => (
          <button
            key={article.slug}
            type="button"
            aria-label={`Tampilkan berita ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-6 bg-orange"
                : "w-1.5 bg-border hover:bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
