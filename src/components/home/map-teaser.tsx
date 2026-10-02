"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  MapPin,
  Music2,
  School,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Chip = { icon: LucideIcon; label: string; x: number; y: number; delay: number };

/** Chip ikon lokasi penting sekolah — pengganti ilustrasi kotak-kotak. */
const chips: Chip[] = [
  { icon: School, label: "Ruang Kelas", x: 6, y: 8, delay: 0 },
  { icon: FlaskConical, label: "Laboratorium", x: 58, y: 2, delay: 0.6 },
  { icon: BookOpen, label: "Perpustakaan", x: 66, y: 40, delay: 1.1 },
  { icon: Trophy, label: "Lapangan", x: 2, y: 52, delay: 0.3 },
  { icon: Music2, label: "Ruang Musik", x: 12, y: 82, delay: 0.9 },
  { icon: UtensilsCrossed, label: "Kantin", x: 60, y: 78, delay: 1.4 },
];

export function MapTeaser() {
  return (
    <section aria-labelledby="peta-beranda" className="pb-16 sm:pb-20">
      <div className="container-page">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-blue p-6 text-bg sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-bg/60">Peta virtual</p>
            <h2
              id="peta-beranda"
              className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Keliling sekolah sebelum datang
            </h2>
            <p className="mt-3 max-w-md text-bg/75">
              Lihat denah dan titik-titik penting SMAN 1 Kraksaan lewat peta virtual, dari HP atau laptop.
            </p>
            <Link
              href="/jelajahi"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-bg px-5 py-2.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bg"
            >
              Buka peta <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {/* Mini map bergaya ikon: chip lokasi + pin berdenyut + jejak jalur */}
          <div
            className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            aria-hidden
          >
            {/* Grid halus ala denah */}
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
              }}
            />

            {/* Jejak jalur putus-putus dari tiap chip ke pin pusat */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              {chips.map((c) => (
                <path
                  key={c.label}
                  d={`M ${c.x + 14} ${c.y + 8} Q 50 ${c.y + 8} 50 50`}
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeWidth="0.5"
                  strokeDasharray="2 2.5"
                  strokeLinecap="round"
                />
              ))}
            </svg>

            {/* Pin pusat berdenyut */}
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inline-flex h-10 w-10 -translate-x-1/4 -translate-y-1/4 rounded-full bg-emerald-400/30 motion-safe:animate-ping" />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-ink shadow-lg shadow-emerald-400/30">
                <MapPin className="h-4.5 w-4.5" />
              </span>
            </span>

            {/* Chip ikon lokasi, mengapung pelan */}
            {chips.map((c) => (
              <motion.span
                key={c.label}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/15 bg-blue/80 px-2.5 py-1.5 text-[11px] font-semibold text-bg/90 shadow-lg backdrop-blur-sm"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: c.delay, ease: "easeInOut" }}
              >
                <c.icon className="h-3.5 w-3.5 text-orange" />
                {c.label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
