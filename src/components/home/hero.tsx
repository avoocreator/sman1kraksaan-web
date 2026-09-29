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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue/10 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1.5 text-xs font-semibold text-orange"
          >
            <Sparkles className="h-3.5 w-3.5" />
            The Digital Home of SMAN 1 Kraksaan
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl font-black leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          >
            SMAN 1 KRAKSAAN
            <br />
            <span className="text-orange">School Digital Hub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-5 max-w-xl text-base leading-7 text-ink-soft sm:text-lg"
          >
            Pusat informasi digital SMAN 1 Kraksaan untuk mengikuti berita,
            prestasi, agenda, kegiatan, dan berbagai informasi terbaru sekolah
            dalam satu tempat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <LinkButton href="/jelajahi" size="lg">
              Jelajahi Sekolah
              <ArrowRight className="h-4 w-4" />
            </LinkButton>

            <LinkButton href="/news" variant="outline" size="lg">
              Semua Berita
            </LinkButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <AccreditationBadge />
            <AccreditationCertificateDownload />
          </motion.div>
        </div>

        {/* Right: News Carousel */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="min-w-0"
        >
          <NewsDepthCarousel articles={articles} />
        </motion.div>
      </div>
    </section>
  );
}