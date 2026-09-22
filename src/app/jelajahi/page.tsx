"use client";

import { useState } from "react";
import { FloorPlanSVG } from "@/components/explore/floor-plan-svg";
import { RoomPopup } from "@/components/explore/room-popup";
import { CompassControl } from "@/components/explore/compass-control";
import { floor1Rooms, floor2Rooms } from "@/data/school-map";
import { SchoolRoom } from "@/types";
import { cn } from "@/lib/utils";

export default function JelajahiPage() {
  const [floor, setFloor] = useState<1 | 2>(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<SchoolRoom | null>(null);

  const hoveredRoom = [...floor1Rooms, ...floor2Rooms].find((r) => r.id === hoveredId);

  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange">Jelajahi Sekolah</p>
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Peta Virtual SMAN 1 Kraksaan</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Arahkan kursor untuk melihat nama ruangan, klik untuk detail lengkap. Gunakan kompas untuk memutar tampilan peta.
        </p>
      </div>

    <div className="mt-8">
        <div>
          <div className="mb-4 flex items-center gap-2">
            {([1, 2] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFloor(f)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  floor === f ? "border-orange bg-orange text-white" : "border-border bg-surface text-ink-soft hover:border-ink"
                )}
              >
                Lantai {f}
              </button>
            ))}
          </div>
         <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl border border-border bg-surface">
            <FloorPlanSVG
              rooms={floor1Rooms}
              overlayRooms={floor === 2 ? floor2Rooms : undefined}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onClick={setSelectedRoom}
            />
            {hoveredRoom && (
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg">
                {hoveredRoom.name}
              </div>
            )}
            <div className="pointer-events-none absolute right-4 top-4">
              <CompassControl />
            </div>
          </div>
          {floor === 2 && (
            <p className="mt-3 text-xs text-muted">
              Lantai 2 hanya tersedia di satu bagian gedung (XI A &amp; XI B) — bagian lainnya ditampilkan pudar sebagai referensi lantai 1.
            </p>
          )}
        </div>
      </div>

      <RoomPopup room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </div>
  );
}