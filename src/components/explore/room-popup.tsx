"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Images, Rotate3d, X } from "lucide-react";
import { SchoolRoom } from "@/types";
import { PanoramaViewer } from "@/components/explore/panorama-viewer";

export function RoomPopup({ room, onClose }: { room: SchoolRoom | null; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);
  const [imgRoom, setImgRoom] = useState<SchoolRoom | null>(room);
  const [panoRoom, setPanoRoom] = useState<SchoolRoom | null>(null);
  const showFallback = !room?.photo || (imgError && imgRoom === room);

  if (imgRoom !== room) {
    setImgRoom(room);
    setImgError(false);
  }

  return (
    <>
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
                {showFallback ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-alt text-muted">
                    <Images className="h-8 w-8" strokeWidth={1.5} aria-hidden />
                    <span className="text-xs">Foto ruangan belum tersedia</span>
                  </div>
                ) : (
                  <img
                    src={room.photo}
                    alt={room.name}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-ink">{room.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{room.description}</p>

                <button
                  onClick={() => room.panorama && setPanoRoom(room)}
                  disabled={!room.panorama}
                  title={
                    room.panorama
                      ? "Lihat foto panorama 360°"
                      : "Foto panorama belum tersedia di CMS untuk ruangan ini"
                  }
                  className={
                    "mt-4 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-md transition-colors " +
                    (room.panorama
                      ? "bg-orange text-white hover:bg-orange-dark"
                      : "cursor-not-allowed bg-ink/10 text-ink/40")
                  }
                >
                  <Rotate3d className="h-4.5 w-4.5" aria-hidden />
                  Lihat Foto 360°
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PanoramaViewer room={panoRoom} onClose={() => setPanoRoom(null)} />
    </>
  );
}
