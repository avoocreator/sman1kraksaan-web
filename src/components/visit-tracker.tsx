"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Pelacak kunjungan — komponen tak terlihat yang dipasang sekali di layout.
 * Setiap kali rute berubah (halaman baru dibuka), kirim ping ke /api/visit.
 * Server yang memutuskan: ping ini kunjungan baru, atau bagian dari kunjungan
 * yang sama (masih dalam rentang istirahat 60 menit).
 *
 * Delay kecil sebelum ping: hindari menghitung navigasi sesaat yang batal
 * dalam < 600 ms. Kegagalan ping diabaikan total — fitur ini opsional.
 */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      fetch("/api/visit", {
        method: "POST",
        signal: ctrl.signal,
        keepalive: true,
      }).catch(() => {
        // diam-diam: penghitung kunjungan tidak boleh mengganggu pengguna
      });
    }, 600);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [pathname]);

  return null;
}
