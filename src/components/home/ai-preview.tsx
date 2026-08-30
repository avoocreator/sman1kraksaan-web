"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { AiChatThread } from "@/components/ai/ai-chat-thread";

export function AiPreview() {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            eyebrow="Asisten Digital"
            title="Meet Your School Assistant."
            description="Butuh informasi seputar program, prestasi, alumni, atau kegiatan sekolah? Tanyakan langsung pada asisten digital kami."
          />
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-alt px-4 py-2 text-xs font-medium text-ink-soft">
            <Sparkles className="h-3.5 w-3.5 text-orange" />
            Tersedia di seluruh halaman — cukup klik ikon di pojok layar.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex h-[26rem] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-xl shadow-ink/5"
        >
          <div className="flex items-center gap-2.5 border-b border-border bg-blue px-5 py-4 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Asisten Sekolah</p>
              <p className="text-[11px] text-white/70">Contoh percakapan</p>
            </div>
          </div>
          <AiChatThread />
        </motion.div>
      </div>
    </section>
  );
}
