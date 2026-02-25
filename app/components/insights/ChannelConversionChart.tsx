"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ChannelConversionStat } from "@/lib/types";
import Card from "@/app/components/ui/Card";

interface Props {
  data: ChannelConversionStat[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomYTick({ x, y, payload }: any) {
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill="var(--ink-3)" fontSize={11}>
      {payload.value}
    </text>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total  = payload.find((p: any) => p.dataKey === "total")?.value  ?? 0;
  const closed = payload.find((p: any) => p.dataKey === "closed")?.value ?? 0;
  const rate   = total > 0 ? Math.round((closed / total) * 100) : 0;
  return (
    <div className="bg-elevated border border-line rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-ink mb-1.5">{label}</p>
      <p className="text-ink-3">{total} reuniones totales</p>
      <p className="text-ink-2">{closed} cerradas</p>
      <p className="text-accent font-bold mt-1">{rate}% conversión</p>
    </div>
  );
}

export default function ChannelConversionChart({ data }: Props) {
  // Top 8 channels by total meetings
  const top = [...data].sort((a, b) => b.total - a.total).slice(0, 8);
  const height = Math.max(220, top.length * 38);

  return (
    <Card title="Conversión por Canal de Descubrimiento">
      {/* Legend */}
      <div className="flex gap-5 mb-3">
        {[
          { color: "var(--ink-5)",  label: "Reuniones" },
          { color: "var(--accent)", label: "Cerradas"  },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-ink-3">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
            {label}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 4, right: 48, left: 0, bottom: 4 }}
          barCategoryGap="30%"
          barGap={2}
        >
          <CartesianGrid horizontal={false} stroke="var(--line)" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "var(--ink-4)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="channel"
            width={130}
            tick={<CustomYTick />}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--hover)" }} />
          <Bar dataKey="total"  name="Reuniones" fill="var(--ink-5)"  radius={[0, 4, 4, 0]} maxBarSize={14} />
          <Bar dataKey="closed" name="Cerradas"  fill="var(--accent)" radius={[0, 4, 4, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
