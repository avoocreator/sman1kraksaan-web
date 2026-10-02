"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { buildSchedule, staticSchedule, type RawSchedule, type Schedule } from "@/lib/schedule";

/**
 * Menyuplai dataset jadwal ke seluruh komponen client (ScheduleExplorer,
 * DayList, NowPanel, ScheduleWidget). Tanpa provider, komponen memakai
 * jadwal statis bawaan repo — jadi halaman tetap berfungsi apa pun yang
 * terjadi pada Strapi.
 */
const ScheduleContext = createContext<Schedule>(staticSchedule);

export function ScheduleProvider({
  raw,
  children,
}: {
  /** Dataset dari Strapi (null = pakai jadwal statis). */
  raw?: RawSchedule | null;
  children: ReactNode;
}) {
  const schedule = useMemo(() => (raw ? buildSchedule(raw) : staticSchedule), [raw]);
  return <ScheduleContext.Provider value={schedule}>{children}</ScheduleContext.Provider>;
}

export function useSchedule(): Schedule {
  return useContext(ScheduleContext);
}
