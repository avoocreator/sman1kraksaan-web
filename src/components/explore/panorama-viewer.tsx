"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Rotate3d, TriangleAlert } from "lucide-react";
import type { Viewer } from "@photo-sphere-viewer/core";
import { SchoolRoom } from "@/types";

import "@photo-sphere-viewer/core/index.css";

/**
 * Penampil foto panorama 360° (photo sphere) layar penuh.
 *
 * Renderer: @photo-sphere-viewer/core + three.js (WebGL) — foto equirectangular
 * dipetakan ke bola sehingga bisa diputar 360° seperti bola.
 * Modul renderer dimuat dinamis di dalam useEffect supaya aman dari SSR dan
 * hanya diunduh saat panorama benar-benar dibuka.
 */
export function PanoramaViewer({
  room,
  onClose,
}: {
  room: SchoolRoom | null;
  onClose: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  const panoUrl = room?.panorama ?? null;
  const panoName = room?.name ?? "";
  const open = Boolean(panoUrl);

  useEffect(() => {
    if (!open || !panoUrl || !boxRef.current) return;

    let disposed = false;
    let viewer: Viewer | null = null;
    setStatus("loading");

    (async () => {
      try {
        // Pra-muat foto: deteksi 404/gagal unduh dengan andal sebelum WebGL jalan.
        await new Promise<void>((resolve, reject) => {
          const probe = new Image();
          probe.onload = () => resolve();
          probe.onerror = () => reject(new Error("foto panorama gagal dimuat"));
          probe.src = panoUrl;
        });
        if (disposed || !boxRef.current) return;

        const [{ Viewer: PSVViewer }, { AutorotatePlugin }] = await Promise.all([
          import("@photo-sphere-viewer/core"),
          import("@photo-sphere-viewer/autorotate-plugin"),
        ]);
        if (disposed || !boxRef.current) return;

        viewer = new PSVViewer({
          container: boxRef.current,
          panorama: panoUrl,
          caption: panoName,
          navbar: ["zoom", "caption", "fullscreen"],
          defaultZoomLvl: 30,
          // Putar pelan otomatis; berhenti saat pengguna menyentuh, lanjut lagi saat idle.
          plugins: [
            [AutorotatePlugin, { autostartDelay: 800, autostartOnIdle: true, autorotateSpeed: "0.6rpm" }],
          ],
        });
        viewerRef.current = viewer;
        viewer.addEventListener("ready", () => {
          if (!disposed) setStatus("ready");
        });
        viewer.addEventListener("panorama-error", () => {
          if (!disposed) setStatus("error");
        });
      } catch {
        if (!disposed) setStatus("error");
      }
    })();

    return () => {
      disposed = true;
      try {
        viewer?.destroy();
      } catch {
        // viewer mungkin belum selesai inisialisasi — abaikan
      }
      viewerRef.current = null;
    };
  }, [open, panoUrl, panoName, attempt]);

  // Tombol ESC menutup penampil.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {room?.panorama && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Foto 360 derajat ${room.name}`}
          className="fixed inset-0 z-[70] overscroll-contain bg-ink"
        >
          {/* Wadah viewer WebGL — diisi @photo-sphere-viewer */}
          <div ref={boxRef} className="absolute inset-0 [&_canvas]:outline-none" />

          {/* Bilah atas: kembali + nama ruangan + badge 360° */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent p-4">
            <button
              onClick={onClose}
              aria-label="Kembali ke peta"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white sm:text-base">{room.name}</p>
              <p className="text-[11px] text-white/70">Tarik untuk memutar — cubit/scroll untuk zoom</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-orange px-2.5 py-1 text-[11px] font-bold text-white shadow">
              <Rotate3d className="h-3.5 w-3.5" aria-hidden />
              360°
            </span>
          </div>

          {/* Status memuat */}
          {status === "loading" && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-white/80">
              <Loader2 className="h-9 w-9 animate-spin" aria-hidden />
              <p className="text-sm">Memuat foto 360°…</p>
            </div>
          )}

          {/* Status gagal (foto tidak ada / WebGL bermasalah) */}
          {status === "error" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center">
              <TriangleAlert className="h-10 w-10 text-orange" aria-hidden />
              <div>
                <p className="font-bold text-white">Foto panorama tidak dapat dimuat</p>
                <p className="mt-1 text-sm text-white/70">
                  Pastikan foto berformat equirectangular (rasio 2:1) sudah diunggah di Strapi.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAttempt((a) => a + 1)}
                  className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-dark"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Kembali
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
