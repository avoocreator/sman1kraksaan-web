"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Alumnus, Statistics } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";

export function AlumniPreview({ alumni, statistics }: { alumni: Alumnus[]; statistics: Statistics }) {
  const stats = [
    { label: "Alumni", value: `${(statistics.alumni / 1000).toFixed(1)}rb+` },
    { label: "Pendidikan Tinggi", value: `${statistics.alumniHigherEd}%` },
    { label: "Karier Profesional", value: `${statistics.alumniProfessional}%` },
    { label: "Wirausaha", value: `${statistics.alumniEntrepreneur}%` },
  ];

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Alumni"
              title="From Here, To Everywhere."
              description="Lulusan SMAN 1 Kraksaan tersebar di berbagai kampus, perusahaan, dan usaha rintisan — membawa nilai yang sama ke mana pun mereka pergi."
            />
            <dl className="mt-8 grid grid-cols-2 gap-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-2xl font-extrabold text-ink">{s.value}</dt>
                  <dd className="mt-1 text-xs text-ink-soft">{s.label}</dd>
                </div>
              ))}
            </dl>
            <LinkButton href="/alumni" variant="outline" className="mt-8">
              Temui Alumni Kami <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {alumni.map((a, i) => (
              <motion.a
                key={a.slug}
                href={`/alumni/${a.slug}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group overflow-hidden rounded-2xl border border-border bg-bg transition-shadow hover:shadow-lg hover:shadow-ink/5"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={a.photo}
                    alt={a.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold leading-snug text-ink">{a.name}</p>
                  <p className="mt-0.5 text-xs text-muted">Angkatan {a.graduationYear}</p>
                  <p className="mt-1 text-xs leading-snug text-ink-soft">{a.role}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
