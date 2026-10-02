"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, GraduationCap, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export type AlumniItem = {
  name: string;
  year: string; // tahun lulus
  university: string;
  major: string;
  path: string; // jalur, mis. Pendidikan Tinggi / Karier Profesional / Wirausaha
  photo?: string; // URL foto (opsional)
  desc?: string; // info singkat dari CMS (deskripsi alumni)
};

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

// Lebar kartu 280px + jarak antar kartu 16px (pr-4) = 296px per langkah.
const STEP = 296;
const THRESHOLD = 60; // geser sekian px baru dianggap pindah slide

/**
 * Preview alumni di beranda — kartu kelas Prestasi (foto + badge + nama)
 * dalam carousel yang bisa DIGESER LANGSUNG (drag/swipe ke samping), bukan
 * cuma lewat dot. Auto-play berhenti sementara saat pengguna sedang menyeret.
 *
 * Teknik: track = konten terduplikasi (2-3 salinan), index berjalan 0..total.
 * Sampai di salinan kedua (posisi visual == awal) → lompat senyap ke 0
 * tanpa animasi, sehingga loop terasa tak berujung ke kanan maupun ke kiri.
 */
export function AlumniPreview({ items = [] }: { items?: AlumniItem[] }) {
  const [selected, setSelected] = useState<AlumniItem | null>(null);
  const total = items.length;

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [anim, setAnim] = useState(true);

  const drag = useRef({ startX: 0, active: false, captured: false });
  const draggedRef = useRef(false); // true kalau sudah melewati ambang → klik dibatalkan

  // Salinan track: konten pendek perlu 3 salinan supaya area kanan tak kosong.
  const copies = total > 0 && total < 5 ? 3 : 2;
  const loop = total > 0 ? Array.from({ length: copies }, () => items).flat() : [];

  // Kembali ke 0 secara senyap saat menyentuh zona salinan kedua.
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

  // Setelah lompatan senyap, nyalakan lagi transisi di frame berikutnya.
  useEffect(() => {
    if (anim) return;
    const id = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => setAnim(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [anim]);

  // Geser sendiri setiap ±4,5 detik; berhenti saat diseret atau pop-up terbuka.
  useEffect(() => {
    if (total <= 1 || dragging || selected) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % total), 4500);
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

  const next = () => setIndex((i) => i + 1); // boleh mencapai total → efek lompat senyap di atas
  const prev = () => {
    if (index <= 0) {
      // Posisi paling kiri: lompat senyap ke salinan kedua lalu mundur satu,
      // sehingga geser ke kiri terasa tak berujung.
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
      } catch {
        /* pointer mungkin sudah lepas — biarkan */
      }
    }
    if (drag.current.captured) {
      if (Math.abs(dx) > 8) draggedRef.current = true;
      setDragX(dx);
    }
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const dx = dragX;
    setDragging(false);
    setDragX(0);
    if (drag.current.captured) {
      if (dx <= -THRESHOLD) next();
      else if (dx >= THRESHOLD) prev();
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
      </div>

      <div
        className="relative mt-10 touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      >
        <ul
          className={`flex w-max ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            transform: `translate3d(calc(${-index * STEP}px + ${dragX}px), 0, 0)`,
            transition: anim && !dragging ? "transform 620ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(e) => e.preventDefault()}
          onClickCapture={(e) => {
            // Setelah menyeret, jangan anggap sebagai klik kartu (pop-up).
            if (draggedRef.current) {
              e.preventDefault();
              e.stopPropagation();
              draggedRef.current = false;
            }
          }}
        >
          {loop.map((a, i) => (
            // pr-4 seragam agar -STEP jatuh tepat di kartu berikutnya (loop mulus)
            <li key={`${a.name}-${i}`} className="shrink-0 pr-4">
              <button
                type="button"
                onClick={() => setSelected(a)}
                className="group block w-[260px] overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-sm transition-shadow hover:shadow-lg hover:shadow-ink/5 sm:w-[280px]"
              >
                {/* Foto di atas, konsep sama dengan kartu Prestasi */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
                  {a.photo ? (
                    <img
                      src={a.photo}
                      alt={a.name}
                      loading="lazy"
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

      {/* Pop-up info singkat */}
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
