"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SchoolRoom } from "@/types";

export function RoomPopup({ room, onClose }: { room: SchoolRoom | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {room && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-surface shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md hover:bg-white"
            >
              <X className="h-4.5 w-4.5" />
            </button>
            <div className="aspect-[16/9] w-full overflow-hidden bg-surface-alt">
              <img src={room.photo} alt={room.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-ink">{room.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{room.description}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}