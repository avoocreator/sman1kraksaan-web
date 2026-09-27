"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import {
  AccreditationBadge,
  AccreditationCertificateDownload,
} from "@/components/ui/accreditation-badge";
import { NewsArticle } from "@/types";
import { NewsDepthCarousel } from "@/components/home/news-depth-carousel";

interface HeroProps {
  articles: NewsArticle[];
}

export function Hero({ articles }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-bg">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue/10 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        {/* Left: School Digital Hub introduction */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange" />
            The Digital Home of SMAN 1 Kraksaan
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            SMAN 1 KRAKSAAN
            <br />
            <span className="text-orange">School Digital Hub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            Pusat informasi digital SMAN 1 Kraksaan untuk mengikuti berita,
            prestasi, agenda, kegiatan, dan berbagai informasi terbaru sekolah
            dalam satu tempat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <LinkButton href="/jelajahi" size="lg">
              Jelajahi Sekolah <ArrowRight className="h-4 w-4" />
            </LinkButton>

            <LinkButton href="/news" variant="outline" size="lg">
              Semua Berita
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

        {/* Right: Automatic news depth carousel */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="mb-3 flex items-center justify-between px-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Berita Terbaru
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Informasi terbaru dari sekolah
              </p>
            </div>

            <a
              href="/news"
              className="text-xs font-semibold text-orange transition-colors hover:text-orange-dark"
            >
              Lihat semua
            </a>
          </div>

          <NewsDepthCarousel articles={articles} />
        </motion.div>
      </div>
    </section>
  );
}
