"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { AccreditationDownloadCard } from "@/components/ui/accreditation-badge";
import { NewsArticle } from "@/types";
import type { SearchItem } from "@/types/search";
import { NewsDepthCarousel } from "@/components/home/news-depth-carousel";
import { HeroSearch } from "@/components/search/hero-search";

interface HeroProps {
  articles: NewsArticle[];
  accreditationPdf?: string;
  suggestions?: SearchItem[];
}

export function Hero({ articles, accreditationPdf, suggestions = [] }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-blue/10 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:py-14">
        {/* kiri */}
        <div>
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
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <LinkButton href="/jelajahi" size="lg">
              Jelajahi Sekolah
              <ArrowRight className="h-4 w-4" />
            </LinkButton>

            <HeroSearch
              suggestions={suggestions}
              className="w-full sm:w-auto sm:min-w-[240px] lg:min-w-0 lg:max-w-[330px] lg:flex-1"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-7 flex flex-wrap items-center gap-4"
          >
            <AccreditationDownloadCard href={accreditationPdf} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="min-w-0"
        >
          {/* kanan */}
          <NewsDepthCarousel articles={articles} />
        </motion.div>
      </div>
    </section>
  );
}