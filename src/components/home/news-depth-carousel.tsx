"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { NewsArticle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface NewsDepthCarouselProps {
  articles: NewsArticle[];
}

// Geser sekian px baru dianggap pindah slide.
const SWIPE_THRESHOLD = 40;

export function NewsDepthCarousel({
  articles,
}: NewsDepthCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Drag/swipe: dragPx mengikuti jari, paused menghentikan autoplay.
  const [dragPx, setDragPx] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ startX: 0, active: false, captured: false });
  const draggedRef = useRef(false);

  const items = articles.slice(0, 5);

  useEffect(() => {
    if (items.length <= 1 || paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) {
    return (
      <div className="mx-auto flex aspect-video w-full max-w-[460px] items-center justify-center rounded-[24px] border border-border bg-surface-alt text-sm text-muted">
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

  const onPointerDown = (e: React.PointerEvent) => {
    if (items.length <= 1) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { startX: e.clientX, active: true, captured: false };
    draggedRef.current = false;
    setPaused(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.captured && Math.abs(dx) > 8) {
      drag.current.captured = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        /* pointer mungkin sudah lepas */
      }
    }
    if (drag.current.captured) {
      if (Math.abs(dx) > 8) draggedRef.current = true;
      setDragPx(dx);
    }
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = dragPx;
    setPaused(false);
    setDragPx(0);
    if (drag.current.captured && Math.abs(dx) >= SWIPE_THRESHOLD) {
      setActiveIndex((current) =>
        dx < 0
          ? (current + 1) % items.length // geser ke kiri → berita berikutnya
          : (current - 1 + items.length) % items.length, // geser ke kanan → sebelumnya
      );
    }
    drag.current.captured = false;
  };

  return (
    <div
      className="relative mx-auto h-[330px] w-full max-w-[460px] cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[370px] sm:max-w-[520px]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDragStart={(e) => e.preventDefault()}
      onClickCapture={(e) => {
        // Setelah menyeret, jangan anggap sebagai klik kartu.
        if (draggedRef.current) {
          e.preventDefault();
          e.stopPropagation();
          draggedRef.current = false;
        }
      }}
    >
      {items.map((article, index) => {
        const offset = getOffset(index);
        const isActive = offset === 0;
        const isVisible = Math.abs(offset) <= 2;
        const isDragging = dragPx !== 0;

        return (
          <motion.a
            key={article.slug}
            href={`/news/${article.slug}`}
            className="absolute left-1/2 top-1/2 block w-[300px] sm:w-[380px]"
            initial={false}
            animate={{
              x: `calc(-50% + ${offset * 116 + dragPx * 0.35}px)`,
              y: `calc(-50% + ${Math.abs(offset) * 14}px)`,
              scale:
                offset === 0
                  ? 1
                  : offset === 1 || offset === -1
                    ? 0.88
                    : 0.78,
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
              duration: isDragging ? 0 : 0.7,
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
            <article className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-2xl shadow-ink/10">
              {/* Foto berita dari CMS umumnya rasio 16:9 (seperti thumbnail video) */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={article.cover}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <Badge>{article.category}</Badge>

                  <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug sm:text-lg">
                    {article.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-white/75">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 bg-surface px-4 py-2.5">
                <p className="line-clamp-1 text-xs text-ink-soft">
                  {article.excerpt}
                </p>

                <ArrowRight className="h-4 w-4 shrink-0 text-orange" />
              </div>
            </article>
          </motion.a>
        );
      })}

      {/* Indicator + Lihat semua */}
      <div className="absolute inset-x-0 -bottom-10 z-30 h-5">
        {/* Dots tetap tepat di tengah carousel */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5">
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

        {/* Lihat semua tetap di sisi kanan carousel */}
        <a
          href="/news"
          className="absolute right-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-semibold text-orange transition-colors hover:text-orange-dark"
        >
          Lihat semua →
        </a>
      </div>
    </div>
  );
}