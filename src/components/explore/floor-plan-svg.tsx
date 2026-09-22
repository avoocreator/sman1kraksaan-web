"use client";

import { SchoolRoom } from "@/types";
import { MAP_VIEWBOX } from "@/data/school-map";

const categoryColors: Record<string, { fill: string; text: string }> = {
  kelas: { fill: "#FDE7B8", text: "#7A5B12" },
  lab: { fill: "#CFEAF3", text: "#0E5A73" },
  fasilitas: { fill: "#F2EDE1", text: "#5C5646" },
  ekstrakurikuler: { fill: "#F6C9A0", text: "#8A4A12" },
  taman: { fill: "#7FB8A4", text: "#FFFFFF" },
  toilet: { fill: "#B9DCEA", text: "#1B4A5C" },
  kantin: { fill: "#E8935C", text: "#FFFFFF" },
};

interface FloorPlanSVGProps {
  rooms: SchoolRoom[];
  overlayRooms?: SchoolRoom[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: (room: SchoolRoom) => void;
}

export function FloorPlanSVG({ rooms, overlayRooms, hoveredId, onHover, onClick }: FloorPlanSVGProps) {
  const renderRoom = (room: SchoolRoom, interactive: boolean) => {
    const cx = room.x + room.width / 2;
    const cy = room.y + room.height / 2;
    const colors = categoryColors[room.category] ?? categoryColors.fasilitas;
    const isHovered = interactive && hoveredId === room.id;

    return (
      <g
        key={room.id}
        onMouseEnter={() => interactive && onHover(room.id)}
        onMouseLeave={() => interactive && onHover(null)}
        onClick={() => interactive && onClick(room)}
        style={{ cursor: interactive ? "pointer" : "default" }}
        opacity={interactive ? 1 : 0.28}
      >
        <rect
          x={room.x}
          y={room.y}
          width={room.width}
          height={room.height}
          rx={8}
          fill={interactive ? colors.fill : "#B9B9B9"}
          stroke={isHovered ? "#EB662B" : "#FFFFFF"}
          strokeWidth={isHovered ? 3 : 2}
        />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={room.fontSize ?? 14}
            fontWeight={600}
            fill={interactive ? colors.text : "#6B6B6B"}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {room.name}
          </text>
      </g>
    );
  };

    return (
    <svg viewBox={MAP_VIEWBOX} className="h-full w-full">
      {rooms.map((room) => renderRoom(room, !overlayRooms))}
      {overlayRooms?.map((room) => renderRoom(room, true))}
    </svg>
  );
}