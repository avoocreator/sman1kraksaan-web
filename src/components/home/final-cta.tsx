"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const jadwal = [
  { label: "Pendaftaran online dibuka", date: "1 Juni 2026" },
  { label: "Pengumuman hasil seleksi", date: "20 Juni 2026" },
  { label: "Daftar ulang", date: "21–25 Juni 2026" },
];

export function FinalCta() {
  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue via-blue to-[#0a4f6b] px-6 py-14 text-bg sm:px-10 md:py-16"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-7 right-4 select-none text-[7rem] font-extrabold leading-none tracking-tighter text-white/[0.06] sm:text-[9rem]"
        >
          2026
        </span>

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-orange" aria-hidden />
              PPDB 2026/2027 · Dibuka
            </span>

            <h2 className="text-balance mt-5 max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Mulai Langkah Pertamamu di SMAN 1 Kraksaan.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              Pendaftaran peserta didik baru tahun ajaran 2026/2027 telah dibuka.
              Cek jalur, persyaratan, dan jadwalnya lalu daftarkan dirimu.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton href="/ppdb" size="lg" className="bg-orange hover:bg-orange-dark">
                Daftar PPDB Sekarang <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton
                href="/ppdb"
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
              >
                Lihat Jadwal &amp; Syarat
              </LinkButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/75">
              <CalendarCheck className="h-4 w-4 text-orange" aria-hidden />
              Jadwal penting
            </p>
            <ol className="mt-4 space-y-3.5">
              {jadwal.map((j, i) => (
                <li key={j.label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange text-[10px] font-bold text-ink">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{j.label}</span>
                    <span className="block text-xs text-white/70">{j.date}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
