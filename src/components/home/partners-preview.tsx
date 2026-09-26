"use client";

import { motion } from "framer-motion";
import { ArrowRight, Building2, GraduationCap, Handshake, HeartHandshake, Presentation } from "lucide-react";
import { Partner } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";

const typeIcons: Record<string, React.ElementType> = {
  "Kuliah Tamu": Presentation,
  "Kunjungan Edukatif": Building2,
  "Beasiswa & Jalur Masuk": GraduationCap,
  "Kolaborasi Riset": Handshake,
  "Kegiatan Sosial": HeartHandshake,
};

const types = ["Kuliah Tamu", "Kunjungan Edukatif", "Beasiswa & Jalur Masuk", "Kolaborasi Riset", "Kegiatan Sosial"];

export function PartnersPreview({ partners }: { partners: Partner[] }) {
  return (
    <section className="container-page py-20 md:py-28">
      <SectionHeading eyebrow="Kolaborasi" title="School × Industry" align="center" className="mx-auto" />

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {partners.map((p, i) => (
          <motion.a
            key={p.slug}
            href={`/partners/${p.slug}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="group flex h-24 items-center justify-center rounded-2xl border border-border bg-surface px-6 transition-colors hover:border-orange"
          >
            <img
              src={p.logoImage}
              alt={p.name}
              className="max-h-10 w-full object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
            />
          </motion.a>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        {types.map((t) => {
          const Icon = typeIcons[t];
          return (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3.5 py-1.5 text-xs font-medium text-ink-soft"
            >
              <Icon className="h-3.5 w-3.5" /> {t}
            </span>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <LinkButton href="/partners" variant="outline">
          Jelajahi Mitra Sekolah <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </div>
    </section>
  );
}