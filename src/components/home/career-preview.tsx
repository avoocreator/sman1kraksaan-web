"use client";

import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Calendar, MapPin } from "lucide-react";
import { CareerOpportunity } from "@/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function CareerPreview({ opportunities }: { opportunities: CareerOpportunity[] }) {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading eyebrow="Karier & PKL" title="Your Next Opportunity Starts Here." />
          <LinkButton href="/career" variant="outline" size="sm">
            Semua Peluang <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {opportunities.map((job, i) => (
            <motion.a
              key={job.slug}
              href={`/career/${job.slug}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-bg p-5 transition-shadow hover:shadow-lg hover:shadow-ink/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-soft text-orange">
                <Briefcase className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge tone="blue" className="mb-2">{job.type}</Badge>
                <p className="truncate text-sm font-semibold text-ink group-hover:text-orange-dark">{job.position}</p>
                <p className="mt-0.5 text-xs text-muted">{job.company}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(job.deadline)}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
