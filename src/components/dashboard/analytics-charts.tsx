"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { engagementByContent, popularPages, trafficTrend } from "@/data/analytics";

const gridColor = "#E7E1D6";
const inkSoft = "#4B5361";
const pieColors = ["#EB662B", "#234C6E", "#3E7CA6", "#F0A277", "#7A7F87"];

export function EngagementPieChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={engagementByContent} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {engagementByContent.map((_, i) => (
            <Cell key={i} fill={pieColors[i % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E1D6", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PopularPagesChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={popularPages} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="page" tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} width={100} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E1D6", fontSize: 12 }} />
        <Bar dataKey="views" fill="#234C6E" radius={[0, 6, 6, 0]} name="Kunjungan" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PageviewsTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={trafficTrend}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: inkSoft }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E1D6", fontSize: 12 }} />
        <Line type="monotone" dataKey="pageviews" stroke="#EB662B" strokeWidth={2.5} dot={{ r: 3 }} name="Tampilan Halaman" />
      </LineChart>
    </ResponsiveContainer>
  );
}
