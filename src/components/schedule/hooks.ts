"use client";

import { useEffect, useState } from "react";
import { wibNow } from "@/lib/schedule";

export function useNow() {
  const [now, setNow] = useState<{ day: number; min: number } | null>(null);
  useEffect(() => {
    const tick = () => setNow(wibNow());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved) as T);
    } catch {}
  }, [key]);
  const set = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  };
  return [value, set] as const;
}