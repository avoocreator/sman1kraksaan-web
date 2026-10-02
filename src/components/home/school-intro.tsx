"use client";

import { motion } from "framer-motion";
import { ArrowRight, Target, Eye } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function SchoolIntro() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative order-2 lg:order-1"
        >
          <div className="aspect-[5/4] overflow-hidden rounded-3xl border border-border">
            <img
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop"
              alt="Gedung SMAN 1 Kraksaan"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 hidden w-52 rounded-2xl border border-border bg-surface p-4 shadow-lg shadow-ink/5 sm:block">
            <p className="text-xs font-semibold text-muted">Berdiri Sejak</p>
            <p className="mt-1 text-2xl font-extrabold text-ink">1965</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2"
        >
          <SectionHeading
            eyebrow="Tentang Kami"
            title="Sekolah yang Dibangun untuk Masa Depan."
            description="Sejak 1965, SMAN 1 Kraksaan tumbuh menjadi rumah belajar yang memadukan akademik kuat, karakter, dan keterhubungan dengan dunia nyata — mempersiapkan siswa untuk pendidikan tinggi, karier, maupun kewirausahaan."
          />

          <div className="mt-8 space-y-5">
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-soft text-orange">
                <Eye className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Visi</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Menjadi sekolah unggul yang menghasilkan lulusan berkarakter, kompetitif, dan siap menghadapi tantangan global.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-soft text-blue">
                <Target className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Misi</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Menyelenggarakan pembelajaran bermutu, membina prestasi, dan membangun jejaring dengan perguruan tinggi serta industri.
                </p>
              </div>
            </div>
          </div>

          <LinkButton href="/about" variant="outline" size="md" className="mt-8">
            Selengkapnya Tentang Kami <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </motion.div>
      </div>
    </section>
  );
}
