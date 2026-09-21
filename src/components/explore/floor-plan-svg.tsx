"use client";

import { SchoolRoom } from "@/types";
import { MAP_VIEWBOX, MAP_CENTER } from "@/data/school-map";

const categoryColors: Record<string, { fill: string; text: string }> = {
  kelas: { fill: "#FCD34D", text: "#1B2430" },
  lab: { fill: "#BFDCEF", text: "#1B2430" },
  fasilitas: { fill: "#FCD34D", text: "#1B2430" },
  ekstrakurikuler: { fill: "#F0A868", text: "#1B2430" },
  taman: { fill: "#5EAB99", text: "#FFFFFF" },
  toilet: { fill: "#7EC8E3", text: "#1B2430" },
  kantin: { fill: "#F0A868", text: "#1B2430" },
};

interface FloorPlanSVGProps {
  rooms: SchoolRoom[];
  overlayRooms?: SchoolRoom[];
  rotation: number;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: (room: SchoolRoom) => void;
}

export function FloorPlanSVG({ rooms, overlayRooms, rotation, hoveredId, onHover, onClick }: FloorPlanSVGProps) {
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
          rx={6}
          fill={interactive ? colors.fill : "#B9B9B9"}
          stroke={isHovered ? "#EB662B" : "#00000022"}
          strokeWidth={isHovered ? 3 : 1}
        />
        <g transform={`rotate(${-rotation} ${cx} ${cy})`}>
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
      </g>
    );
  };

  return (
    <svg viewBox={MAP_VIEWBOX} className="h-full w-full">
      <g transform={`rotate(${rotation} ${MAP_CENTER.x} ${MAP_CENTER.y})`}>
        {rooms.map((room) => renderRoom(room, !overlayRooms))}
        {overlayRooms?.map((room) => renderRoom(room, true))}
      </g>
    </svg>
  );
}