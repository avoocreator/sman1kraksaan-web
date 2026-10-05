export type Lesson = {
  classIdx: number;
  day: number;
  start: number;
  span: number;
  subject: string;
  teacher: string;
};

export type ClassInfo = {
  idx: number;
  name: string;
  label: string;
  level: "X" | "XI" | "XII";
  short: string;
};

export type Entry =
  | { kind: "lesson"; lesson: Lesson; from: number; to: number }
  | { kind: "break"; label: string; from: number; to: number }
  | { kind: "gap"; count: number; from: number; to: number };