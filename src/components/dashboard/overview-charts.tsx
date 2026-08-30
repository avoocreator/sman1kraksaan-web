"use client";

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line,
} from "recharts";
import { trafficTrend, alumniGrowth, achievementsByYear } from "@/data/analytics";

const gridColor = "#E7E1D6";
const inkSoft = "#4B5361";

export function TrafficChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={trafficTrend}>
        <defs>
          <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EB662B" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#EB662B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E1D6", fontSize: 12 }} />
        <Area type="monotone" dataKey="visitors" stroke="#EB662B" strokeWidth={2} fill="url(#colorVisitors)" name="Pengunjung" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AlumniGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={alumniGrowth}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E1D6", fontSize: 12 }} />
        <Line type="monotone" dataKey="total" stroke="#234C6E" strokeWidth={2.5} dot={{ r: 3 }} name="Total Alumni" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AchievementsByYearChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={achievementsByYear}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E1D6", fontSize: 12 }} />
        <Bar dataKey="count" fill="#EB662B" radius={[6, 6, 0, 0]} name="Prestasi" />
      </BarChart>
    </ResponsiveContainer>
  );
}
