"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import DayList from "./DayList";
import NowPanel from "./NowPanel";
import { useNow, usePersisted } from "./hooks";
import { chipClass, DAYS_SHORT, dayStats } from "./shared";
import { useSchedule } from "@/components/schedule/context";
import { teacherName as fmtTeacherName } from "@/lib/schedule";

const LEVELS = ["X", "XI", "XII"] as const;

export default function ScheduleExplorer() {
  const { classes, dayEntries, DAYS, fmt, scheduleDay, teacherHours, teachers } = useSchedule();
  const now = useNow();
  const reduce = useReducedMotion();
  const [mode, setMode] = usePersisted<"kelas" | "guru">("sch:mode", "kelas");
  const [classIdx, setClassIdx] = usePersisted("sch:class", 0);
  const [teacher, setTeacher] = usePersisted("sch:teacher", teachers[0]?.code ?? "");
  const [pickedDay, setPickedDay] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const cls = classes[classIdx] ?? classes[0];
  const tch = teachers.find((t) => t.code === teacher) ?? { code: teacher ?? "", name: fmtTeacherName(teacher ?? "") || teacher || "—" };
  const weekend = now !== null && (now.day === 0 || now.day === 6);
  const day = pickedDay ?? scheduleDay(now);
  const nowMin = now && now.day === day ? now.min : null;
  const show = mode === "kelas" ? "class" : "teacher";

  const entries =
    mode === "kelas"
      ? dayEntries({ classIdx: cls?.idx ?? 0 }, day)
      : dayEntries({ teacher: tch.code }, day);
  const stats = dayStats(entries);
  const filtered = teachers.filter((t) => t.name.toLowerCase().includes(q.trim().toLowerCase()));

  if (classes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-4 py-16 text-center text-ink-soft">
        Jadwal belum tersedia — data jadwal masih kosong. Hubungi admin sekolah atau coba lagi nanti.
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-12">
      {/* Pemilih */}
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div
          role="group"
          aria-label="Lihat jadwal berdasarkan"
          className="inline-flex rounded-full border border-border bg-surface-alt p-1"
        >
          {(["kelas", "guru"] as const).map((m) => (
            <button
              key={m}
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
                mode === m ? "bg-blue text-bg" : "text-ink-soft hover:text-ink"
              }`}
            >
              {m === "kelas" ? "Per kelas" : "Per guru"}
            </button>
          ))}
        </div>

        {mode === "kelas" ? (
          <div className="space-y-4">
            <div role="group" aria-label="Tingkat" className="flex gap-2">
              {LEVELS.map((lv) => (
                <button
                  key={lv}
                  aria-pressed={cls.level === lv}
                  className={chipClass(cls.level === lv)}
                  onClick={() => {
                    const c = classes.find((cl) => cl.level === lv);
                    if (c) setClassIdx(c.idx);
                  }}
                >
                  Kelas {lv}
                </button>
              ))}
            </div>
            <div role="group" aria-label="Kelas" className="flex flex-wrap gap-2">
              {classes
                .filter((c) => c.level === cls.level)
                .map((c) => (
                  <button
                    key={c.idx}
                    aria-pressed={c.idx === cls.idx}
                    className={chipClass(c.idx === cls.idx)}
                    onClick={() => setClassIdx(c.idx)}
                  >
                    {c.short}
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="sch-cari-guru" className="sr-only">
              Cari nama guru
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                id="sch-cari-guru"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama guru"
                className="w-full rounded-full border border-border bg-surface py-2 pl-9 pr-4 text-sm text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              />
            </div>
            <ul className="mt-3 max-h-72 divide-y divide-border overflow-y-auto rounded-xl border border-border bg-surface">
              {filtered.length === 0 && <li className="px-3 py-3 text-sm text-ink-soft">Guru tidak ditemukan.</li>}
              {filtered.map((t) => (
                <li key={t.code}>
                  <button
                    aria-pressed={t.code === tch.code}
                    onClick={() => setTeacher(t.code)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue ${
                      t.code === tch.code ? "bg-blue text-bg" : "text-ink-soft hover:bg-surface-alt hover:text-ink"
                    }`}
                  >
                    {t.name}
                    <span className={`text-xs tabular-nums ${t.code === tch.code ? "text-bg/70" : "text-muted"}`}>
                      {teacherHours(t.code)} jam
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Jadwal */}
      <section aria-live="polite" className="min-w-0">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {mode === "kelas" ? cls.label : tch.name}
        </h2>
        <p className="mt-1 text-ink-soft">
          {mode === "kelas"
            ? `Kelas ${cls.level}, jam pelajaran dan guru pengajar.`
            : `Mengajar ${teacherHours(tch.code)} jam pelajaran per minggu.`}
        </p>

        {nowMin !== null && (
          <div className="mt-6">
            <NowPanel entries={entries} nowMin={nowMin} show={show} />
          </div>
        )}

        <div role="tablist" aria-label="Hari" className="relative mt-8 flex border-b border-border">
          {DAYS.map((name, i) => {
            const d = i + 1;
            const on = d === day;
            return (
              <button
                key={name}
                role="tab"
                aria-selected={on}
                onClick={() => setPickedDay(d)}
                className={`relative flex-1 px-1 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue sm:flex-none sm:px-6 ${
                  on ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span className="hidden sm:inline">{name}</span>
                <span className="sm:hidden">{DAYS_SHORT[i]}</span>
                {now && now.day === d && (
                  <span
                    className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[hsl(152_60%_38%)] align-middle"
                    title="Hari ini"
                  >
                    <span className="sr-only">hari ini</span>
                  </span>
                )}
                {on && (
                  <motion.span
                    layoutId="hari-aktif"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-blue"
                  />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-sm text-ink-soft">
          {weekend && pickedDay === null && "Hari ini akhir pekan, jadi yang tampil jadwal Senin. "}
          {stats
            ? `${DAYS[day - 1]}: ${stats.hours} jam pelajaran, ${fmt(stats.from)}-${fmt(stats.to)}.`
            : `${DAYS[day - 1]}: tidak ada pelajaran.`}
        </p>

        <div className="mt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${mode}-${mode === "kelas" ? cls.idx : tch.code}-${day}`}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <DayList entries={entries} show={show} nowMin={nowMin} />
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-8 text-sm text-muted">Sumber: jadwal KBM per 9 Juli 2026. Waktu mengikuti WIB.</p>
      </section>
    </div>
  );
}