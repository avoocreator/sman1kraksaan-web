"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Achievement } from "@/types";
import { Badge } from "@/components/ui/badge";

export function AchievementCard({ achievement, index = 0 }: { achievement: Achievement; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/achievements/${achievement.slug}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg hover:shadow-ink/5"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={achievement.image}
            alt={achievement.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-orange backdrop-blur">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="p-4">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge tone="orange">{achievement.category}</Badge>
            <Badge tone="blue">{achievement.level}</Badge>
          </div>
          <h3 className="text-sm font-semibold leading-snug text-ink group-hover:text-orange-dark">
            {achievement.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted">{achievement.year}</p>
        </div>
      </Link>
    </motion.div>
  );
}
