"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
