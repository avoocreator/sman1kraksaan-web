"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, GraduationCap, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export type AlumniItem = {
  name: string;
  year: string;
  university: string;
  major: string;
  path: string;
  photo?: string;
  desc?: string;
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const THRESHOLD = 60;

export function AlumniPreview({ items = [] }: { items?: AlumniItem[] }) {
  const [selected, setSelected] = useState<AlumniItem | null>(null);
  const total = items.length;

  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [anim, setAnim] = useState(true);

  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef({ startX: 0, active: false, captured: false });
  const draggedRef = useRef(false);

  const dragXRef = useRef(0);
  const stepRef = useRef(296);
  const rafRef = useRef(0);

  const apply = useCallback((target: number, animate: boolean) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.transition = animate ? "transform 620ms cubic-bezier(0.22, 1, 0.36, 1)" : "none";
    el.style.transform = `translate3d(calc(${-target * stepRef.current}px + ${dragXRef.current}px), 0, 0)`;
  }, []);

  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.children[0] as HTMLElement | undefined;
      const second = trackRef.current?.children[1] as HTMLElement | undefined;
      if (first && second) {
        stepRef.current = second.offsetLeft - first.offsetLeft;
        apply(index, false);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [total, index, apply]);

  const copies = total > 0 && total < 5 ? 3 : 2;
  const loop = total > 0 ? Array.from({ length: copies }, () => items).flat() : [];

  useEffect(() => {
    if (dragging || total === 0) return;
    if (index >= total) {
      const id = window.requestAnimationFrame(() => {
        setAnim(false);
        setIndex(0);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [index, total, dragging]);

  useEffect(() => {
    if (anim) return;
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setAnim(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [anim]);

  useEffect(() => {
    apply(index, anim);
  }, [index, anim, apply]);

  useEffect(() => {
    if (total <= 1 || dragging || selected) return;
    const t = window.setInterval(() => setIndex((i) => i + 1), 4500);
    return () => window.clearInterval(t);
  }, [total, dragging, selected]);

  if (total === 0) {
    return (
      <section aria-labelledby="lulusan-beranda" className="bg-surface-alt/40 py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <HeaderMeta />
            <Link
              href="/alumni"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
            >
              Lihat semua alumni <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-10">
            <EmptyState
              title="Belum ada data alumni di CMS."
              description="Tambahkan entri di Strapi (Collection Types → Alumni profile) dan galeri ini terisi otomatis."
            />
          </div>
        </div>
      </section>
    );
  }

  const next = () => setIndex((i) => i + 1);
  const prev = () => {
    if (index <= 0) {
      setAnim(false);
      setIndex(total);
      window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => {
          setAnim(true);
          setIndex(total - 1);
        }),
      );
    } else {
      setIndex((i) => i - 1);
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (total <= 1) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { startX: e.clientX, active: true, captured: false };
    draggedRef.current = false;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.captured && Math.abs(dx) > 8) {
      drag.current.captured = true;
      try {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      } catch {}
    }
    if (drag.current.captured) {
      if (Math.abs(dx) > 8) draggedRef.current = true;
      dragXRef.current = dx;
      if (!rafRef.current) {
        rafRef.current = window.requestAnimationFrame(() => {
          rafRef.current = 0;
          apply(index, false);
        });
      }
    }
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = dragXRef.current;
    dragXRef.current = 0;
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    setDragging(false);
    if (drag.current.captured) {
      if (dx <= -THRESHOLD) next();
      else if (dx >= THRESHOLD) prev();
      else apply(index, true);
    }
    drag.current.captured = false;
  };

  return (
    <section aria-labelledby="lulusan-beranda" className="bg-surface-alt/40 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Lulusan</p>
            <h2
              id="lulusan-beranda"
              className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              Setelah lulus, mereka ke mana
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Galeri lulusan terbaik kami — geser ke samping, klik kartu untuk info singkat.
            </p>
          </div>
          <Link
            href="/alumni"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            Lihat semua alumni <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div
          className="relative -mx-5 mt-10 touch-pan-y select-none overflow-hidden md:-mx-10"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)",
          }}
        >
        <ul
          ref={trackRef}
          className={`flex w-max px-5 md:px-10 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ willChange: "transform" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(e) => e.preventDefault()}
          onClickCapture={(e) => {
            if (draggedRef.current) {
              e.preventDefault();
              e.stopPropagation();
              draggedRef.current = false;
            }
          }}
        >
          {loop.map((a, i) => (
            <li key={`${a.name}-${i}`} className="shrink-0 pr-4">
              <button
                type="button"
                onClick={() => setSelected(a)}
                className="group block w-[260px] overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/5 sm:w-[280px]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
                  {a.photo ? (
                    <img
                      src={a.photo}
                      alt={a.name}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-ink/90 text-2xl font-black text-bg">
                      {initials(a.name)}
                    </span>
                  )}
                  <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-orange backdrop-blur">
                    <GraduationCap className="h-4 w-4" aria-hidden />
                  </span>
                </div>

                <div className="p-4">
                  {a.path && <Badge tone="orange">{a.path}</Badge>}
                  <h3 className="mt-2 line-clamp-2 min-h-[2.6em] text-sm font-semibold leading-snug text-ink group-hover:text-orange-dark">
                    {a.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-1 text-xs text-muted">
                    {[a.year && `Lulus ${a.year}`, a.university].filter(Boolean).join(" · ")}
                  </p>
                  {a.desc && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-soft">{a.desc}</p>}
                </div>
              </button>
            </li>
          ))}
        </ul>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-2xl"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Tutup"
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md hover:bg-white"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              <div className="aspect-video w-full overflow-hidden bg-surface-alt">
                {selected.photo ? (
                  <img src={selected.photo} alt={selected.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-ink text-3xl font-black text-bg">
                    {initials(selected.name)}
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {selected.path && <Badge tone="orange">{selected.path}</Badge>}
                  {selected.year && <Badge tone="blue">Lulus {selected.year}</Badge>}
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink">{selected.name}</h3>
                {selected.university && (
                  <p className="mt-1 flex items-start gap-2 text-sm text-ink-soft">
                    <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
                    <span>
                      <span className="font-semibold text-ink">{selected.university}</span>
                      {selected.major && <span className="block">{selected.major}</span>}
                    </span>
                  </p>
                )}
                {selected.desc && (
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{selected.desc}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function HeaderMeta() {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-muted">Lulusan</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Setelah lulus, mereka ke mana
      </h2>
      <p className="mt-3 max-w-xl text-ink-soft">
        Galeri lulusan terbaik kami — geser ke samping, klik kartu untuk info singkat.
      </p>
    </div>
  );
}
