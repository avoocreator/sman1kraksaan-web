"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Building2, Handshake, Presentation, Users2 } from "lucide-react";
import { Partner } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";

const typeIcons: Record<string, React.ElementType> = {
  Magang: Briefcase,
  "Kunjungan Industri": Building2,
  "Kuliah Tamu": Presentation,
  Rekrutmen: Users2,
  Kolaborasi: Handshake,
};

export function PartnersPreview({ partners }: { partners: Partner[] }) {
  const types = ["Magang", "Kunjungan Industri", "Kuliah Tamu", "Rekrutmen", "Kolaborasi"];

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
            className="flex h-24 items-center justify-center rounded-2xl border border-border bg-surface px-4 text-center text-sm font-semibold text-ink-soft transition-colors hover:border-orange hover:text-orange-dark"
          >
            {p.logo}
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
