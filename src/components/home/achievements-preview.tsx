"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Achievement } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { AchievementCard } from "@/components/achievements/achievement-card";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

const filters = ["Semua", "Akademik", "Teknologi", "Olahraga", "Seni"] as const;

export function AchievementsPreview({ achievements }: { achievements: Achievement[] }) {
  const [active, setActive] = useState<(typeof filters)[number]>("Semua");

  const filtered =
    active === "Semua" ? achievements : achievements.filter((a) => a.category === active);

  return (
    <section className="container-page py-20 md:py-28">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow="Prestasi" title="Excellence, in Action." />
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                active === f
                  ? "border-orange bg-orange text-white"
                  : "border-border text-ink-soft hover:border-ink"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {filtered.length === 0 ? (
          <EmptyState title="Belum ada prestasi pada kategori ini." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.slice(0, 4).map((a, i) => (
              <AchievementCard achievement={a} key={a.slug} index={i} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <LinkButton href="/achievements" variant="outline">
          Lihat Semua Prestasi <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </div>
    </section>
  );
}
