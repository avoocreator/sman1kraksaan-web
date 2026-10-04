"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { buildSchedule, staticSchedule, type RawSchedule, type Schedule } from "@/lib/schedule";

const ScheduleContext = createContext<Schedule>(staticSchedule);

export function ScheduleProvider({
  raw,
  children,
}: {
  raw?: RawSchedule | null;
  children: ReactNode;
}) {
  const schedule = useMemo(() => (raw ? buildSchedule(raw) : staticSchedule), [raw]);
  return <ScheduleContext.Provider value={schedule}>{children}</ScheduleContext.Provider>;
}

export function useSchedule(): Schedule {
  return useContext(ScheduleContext);
}
