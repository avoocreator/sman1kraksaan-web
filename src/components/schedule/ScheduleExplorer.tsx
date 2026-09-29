"use client";

import { useState } from "react";
import DayList from "./DayList";
import { useNow, usePersisted } from "./hooks";
import {
  classes, dayEntries, DAYS, scheduleDay, teacherHours, teachers,
} from "@/lib/schedule";

const LEVELS = ["X", "XI", "XII"] as const;

const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
    on
      ? "border-slate-900 bg-slate-900 text-white"
      : "border-slate-300 text-slate-700 hover:border-slate-500"
  }`;

export default function ScheduleExplorer() {
  const now = useNow();
  const [mode, setMode] = usePersisted<"kelas" | "guru">("sch:mode", "kelas");
  const [classIdx, setClassIdx] = usePersisted("sch:class", 0);
  const [teacher, setTeacher] = usePersisted("sch:teacher", teachers[0].code);
  const [pickedDay, setPickedDay] = useState<number | null>(null);

  const cls = classes[classIdx] ?? classes[0];
  const today = scheduleDay(now);
  const weekend = now !== null && (now.day === 0 || now.day === 6);
  const day = pickedDay ?? today;
  const nowMin = now && now.day === day ? now.min : null;

  const entries =
    mode === "kelas"
      ? dayEntries({ classIdx: cls.idx }, day)
      : dayEntries({ teacher }, day);

  return (
    <div>
      <div role="group" aria-label="Lihat jadwal berdasarkan" className="flex gap-2">
        <button className={chip(mode === "kelas")} aria-pressed={mode === "kelas"} onClick={() => setMode("kelas")}>
          Per kelas
        </button>
        <button className={chip(mode === "guru")} aria-pressed={mode === "guru"} onClick={() => setMode("guru")}>
          Per guru
        </button>
      </div>

      {mode === "kelas" ? (
        <div className="mt-5 space-y-3">
          <div role="group" aria-label="Tingkat" className="flex flex-wrap gap-2">
            {LEVELS.map((lv) => (
              <button
                key={lv}
                className={chip(cls.level === lv)}
                aria-pressed={cls.level === lv}
                onClick={() => setClassIdx(classes.find((c) => c.level === lv)!.idx)}
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
                  className={chip(c.idx === cls.idx)}
                  aria-pressed={c.idx === cls.idx}
                  onClick={() => setClassIdx(c.idx)}
                >
                  {c.short}
                </button>
              ))}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <label htmlFor="sch-guru" className="block text-sm font-medium text-slate-700">
            Pilih guru
          </label>
          <select
            id="sch-guru"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            className="mt-1.5 w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            {teachers.map((t) => (
              <option key={t.code} value={t.code}>
                {t.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-slate-600">Mengajar {teacherHours(teacher)} jam per minggu.</p>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900">
          {mode === "kelas" ? `Kelas ${cls.label}` : teachers.find((t) => t.code === teacher)?.name}
        </h2>

        <div role="tablist" aria-label="Hari" className="mt-3 flex border-b border-slate-200">
          {DAYS.map((name, i) => {
            const d = i + 1;
            const on = d === day;
            return (
              <button
                key={name}
                role="tab"
                aria-selected={on}
                onClick={() => setPickedDay(d)}
                className={`-mb-px flex-1 border-b-2 px-2 py-2.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-900 sm:flex-none sm:px-5 ${
                  on ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {name}
                {now && now.day === d && <span className="ml-1 text-emerald-700">*<span className="sr-only"> hari ini</span></span>}
              </button>
            );
          })}
        </div>

        {weekend && pickedDay === null && (
          <p className="mt-3 text-sm text-slate-600">Hari ini akhir pekan, jadi yang tampil jadwal Senin.</p>
        )}

        <div className="mt-2">
          <DayList entries={entries} show={mode === "kelas" ? "class" : "teacher"} nowMin={nowMin} />
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-500">Sumber data: jadwal KBM per 9 Juli 2026.</p>
    </div>
  );
}