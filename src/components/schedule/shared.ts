import type { Entry } from "@/types/schedule";

export type LessonEntry = Extract<Entry, { kind: "lesson" }>;

export const DAYS_SHORT = ["Sen", "Sel", "Rab", "Kam", "Jum"];

export const chipClass = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
    on
      ? "border-blue bg-blue text-bg"
      : "border-border bg-surface text-ink-soft hover:border-blue/40 hover:text-ink"
  }`;

export function liveState(entries: Entry[], nowMin: number | null) {
  const lessons = entries.filter((e): e is LessonEntry => e.kind === "lesson");
  const first = lessons[0] ?? null;
  const last = lessons[lessons.length - 1] ?? null;
  if (nowMin === null || !first || !last) {
    return { lessons, first, last, current: null, next: null, onBreak: null, before: false, after: false };
  }
  return {
    lessons,
    first,
    last,
    current: lessons.find((e) => nowMin >= e.from && nowMin < e.to) ?? null,
    next: lessons.find((e) => e.from > nowMin) ?? null,
    onBreak: entries.find((e) => e.kind === "break" && nowMin >= e.from && nowMin < e.to) ?? null,
    before: nowMin < first.from,
    after: nowMin >= last.to,
  };
}

export function dayStats(entries: Entry[]) {
  const lessons = entries.filter((e): e is LessonEntry => e.kind === "lesson");
  if (lessons.length === 0) return null;
  return {
    count: lessons.length,
    hours: lessons.reduce((n, e) => n + e.lesson.span, 0),
    from: lessons[0].from,
    to: lessons[lessons.length - 1].to,
  };
}