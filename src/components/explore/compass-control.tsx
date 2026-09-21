"use client";

import { RotateCcw, RotateCw } from "lucide-react";

export function CompassControl({
  rotation,
  onRotate,
  onReset,
}: {
  rotation: number;
  onRotate: (delta: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lg">
      <button
        onClick={onReset}
        aria-label="Reset arah ke Utara"
        className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-bg"
      >
        <div
          className="absolute inset-0 flex items-start justify-center pt-1.5 transition-transform duration-300"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <span className="text-xs font-bold text-orange">N</span>
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-ink" />
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onRotate(-90)}
          aria-label="Putar kiri"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-ink-soft hover:bg-surface-alt"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRotate(90)}
          aria-label="Putar kanan"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-ink-soft hover:bg-surface-alt"
        >
          <RotateCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}