export type Lesson = {
  classIdx: number;
  day: number; // 1 = Senin ... 5 = Jumat
  start: number; // jam ke-
  span: number; // jumlah jam berurutan
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