"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, BookOpen, Cpu, Languages, Leaf, Sigma } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ProgramItem = {
  title: string;
  level: string;
  desc: string;
  icon: string;
};

const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  sigma: Sigma,
  languages: Languages,
  book: BookOpen,
  leaf: Leaf,
};

const sample: ProgramItem[] = [
  { title: "Koding dan Kecerdasan Artifisial", level: "Kelas X", icon: "cpu", desc: "Dasar pemrograman dan AI sebagai pelajaran tetap di kelas X." },
  { title: "Mata pelajaran Tingkat Lanjut", level: "Kelas XI dan XII", icon: "sigma", desc: "Matematika, Bahasa Inggris, dan Sejarah dengan materi yang lebih dalam." },
  { title: "Bahasa Jepang", level: "Kelas XI dan XII", icon: "languages", desc: "Bahasa asing pilihan untuk siswa yang ingin belajar di luar bahasa Inggris." },
  { title: "Tahfidz", level: "Kelas X A", icon: "book", desc: "Hafalan Al-Qur'an terjadwal Senin sampai Jumat, di awal hari sekolah." },
  { title: "Pembiasaan dan Adiwiyata", level: "Semua kelas", icon: "leaf", desc: "Kegiatan pembiasaan dan kepedulian lingkungan rutin setiap Jumat." },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ProgramsPreview({ items = sample }: { items?: ProgramItem[] }) {
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="program-beranda" className="py-16 sm:py-20">
      <motion.div
        className="container-page"
        variants={container}
        initial={reduce ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      >
        <motion.div variants={rise} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Program Unggulan </p>
            <h2
              id="program-beranda"
              className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl"
            >
              PROGRAM UNGGULAN KAMI
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Ini alasan yang paling sering disebut siswa dan orang tua kami —
              dari program unggulan sampai pembiasaan yang memang jalan tiap
              minggu, bukan cuma tulisan di brosur.
            </p>
          </div>
          <Link
            href="/programs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
          >
            Lihat semua program <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </motion.div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map(({ title, level, desc, icon }, i) => {
            const Icon = ICONS[icon] ?? BookOpen;
            return (
              <motion.li key={`${title}-${i}`} variants={rise} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/5 sm:p-7">
                  <Icon
                    aria-hidden
                    strokeWidth={1.25}
                    className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 text-ink opacity-[0.05] transition-transform duration-700 ease-out group-hover:-rotate-6 group-hover:scale-110"
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-alt text-ink">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="flex items-center gap-2 text-xs font-semibold text-muted">
                      {level && (
                        <span className="max-w-[170px] truncate rounded-full border border-border bg-bg px-3 py-1 text-ink-soft">
                          {level}
                        </span>
                      )}
                      <span className="tabular-nums" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                  </div>

                  <h3 className="relative mt-6 line-clamp-2 min-h-[3.4rem] text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">
                    {title}
                  </h3>
                  <p className="relative mt-2 line-clamp-3 text-sm text-ink-soft">{desc}</p>
                </article>
              </motion.li>
            );
          })}

          <motion.li variants={rise} className="sm:col-span-2 lg:col-span-3">
            <Link
              href="/programs"
              className="group flex items-center justify-between gap-4 rounded-3xl bg-blue px-6 py-5 text-bg transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue sm:px-8"
            >
              <span>
                <span className="block text-lg font-semibold">Masih ragu pilih yang mana?</span>
                <span className="block text-sm text-bg/70">Cek program lengkap, mapelnya, dan peluang lanjutannya di halaman program.</span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg text-ink transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-5 w-5" aria-hidden />
              </span>
            </Link>
          </motion.li>
        </ul>
      </motion.div>
    </section>
  );
}
