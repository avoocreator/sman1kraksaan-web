"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { AiChatThread } from "@/components/ai/ai-chat-thread";

export default function AiFloatingButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Buka asisten sekolah"
        className="fixed bottom-6 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-blue text-white shadow-lg shadow-blue/30 sm:bottom-8 sm:right-8"
        style={{ height: 52, width: 52 }}
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-24 right-5 z-50 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-ink/10 sm:bottom-28 sm:right-8"
          >
            <div className="flex items-center gap-2.5 border-b border-border bg-blue px-4 py-3.5 text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Asisten Sekolah</p>
                <p className="text-[11px] text-white/70">Biasanya membalas dalam hitungan detik</p>
              </div>
            </div>
            <AiChatThread compact />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
