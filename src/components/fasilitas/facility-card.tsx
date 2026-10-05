"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, MapPin, ArrowRight } from "lucide-react";
import { Facility } from "@/types";
import { Badge } from "@/components/ui/badge";

const categoryTone: Record<Facility["category"], "orange" | "blue" | "neutral"> = {
  "Aula & Serbaguna": "orange",
  Laboratorium: "blue",
  "Olahraga & Lapangan": "orange",
  "Seni & Ekstrakurikuler": "blue",
  Perpustakaan: "blue",
  "Ruang Rapat": "neutral",
  "Fasilitas Ibadah": "neutral",
  "Ruang Penunjang": "neutral",
};

export function FacilityCard({ facility, index = 0 }: { facility: Facility; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/fasilitas/${facility.slug}`}
        className="group block h-full overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={facility.image}
            alt={facility.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <Badge tone={categoryTone[facility.category]}>{facility.category}</Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold leading-snug text-ink group-hover:text-orange-dark">
            {facility.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
            {facility.shortDescription}
          </p>
          <div className="mt-3 space-y-1.5 text-xs text-muted">
            <p className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0" /> Kapasitas {facility.capacity} orang
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{facility.location}</span>
            </p>
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange">
            Lihat &amp; Pesan <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
