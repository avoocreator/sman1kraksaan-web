"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Trophy, Users } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { AccreditationBadge, AccreditationCertificateDownload } from "@/components/ui/accreditation-badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue/10 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange" />
            The Digital Home of SMAN 1 Kraksaan
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            SMAN 1 KRAKSAAN
            <br />
            Sekolah Idaman <span className="text-orange">Sepanjang Zaman</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            Temukan orang-orang, prestasi, peluang, dan cerita yang membentuk
            SMAN 1 Kraksaan — dalam satu ekosistem digital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <LinkButton href="/ppdb" size="lg">
              Jelajahi Sekolah <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/achievements" variant="outline" size="lg">
              Lihat Prestasi
            </LinkButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <AccreditationBadge />
            <AccreditationCertificateDownload />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-border bg-surface-alt">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
              alt="Kegiatan siswa SMAN 1 Kraksaan"
              className="h-full w-full object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute -left-4 top-8 flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg shadow-ink/5 sm:-left-8"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-soft text-orange">
              <Trophy className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-bold leading-none text-ink">147+</p>
              <p className="mt-1 text-[11px] text-muted">Prestasi</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="absolute -right-4 bottom-10 flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg shadow-ink/5 sm:-right-8"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-soft text-blue">
              <Users className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-sm font-bold leading-none text-ink">2.400+</p>
              <p className="mt-1 text-[11px] text-muted">Alumni</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
