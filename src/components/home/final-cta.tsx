"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="container-page pb-20 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[32px] bg-blue px-6 py-16 text-center sm:px-10 md:py-20"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <h2 className="text-balance mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Discover What Makes SMAN 1 Kraksaan Different.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-white/80">
          Satu platform untuk mengenal sekolah, prestasi, alumni, dan peluang masa depan.
        </p>
        <div className="mt-8">
          <LinkButton href="/ppdb" size="lg" className="bg-orange hover:bg-orange-dark">
            Jelajahi Sekolah <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </motion.div>
    </section>
  );
}
