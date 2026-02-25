"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChannelConversionStat } from "@/lib/types";
import Card from "@/app/components/ui/Card";

interface Props {
  data: ChannelConversionStat[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.find((p: any) => p.dataKey === "total")?.value ?? 0;
  const closed = payload.find((p: any) => p.dataKey === "closed")?.value ?? 0;
  const rate = total > 0 ? Math.round((closed / total) * 100) : 0;
  return (
    <div className="bg-elevated border border-line rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-ink mb-1.5">{label}</p>
      <p className="text-ink-3">{total} reuniones totales</p>
      <p className="text-ink-2">{closed} cerradas</p>
      <p className="text-accent font-bold mt-1">{rate}% conversión</p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomLegend({ payload }: any) {
  return (
    <div className="flex justify-center gap-5 mt-1">
      {payload.map((entry: any) => (
        <span key={entry.value} className="flex items-center gap-1.5 text-xs text-ink-3">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

export default function ChannelConversionChart({ data }: Props) {
  return (
    <Card title="Conversión por Canal de Descubrimiento">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
          <XAxis
            dataKey="channel"
            tick={{ fontSize: 10, fill: "var(--ink-4)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--ink-4)" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--hover)" }} />
          <Legend content={<CustomLegend />} />
          <Bar dataKey="total" name="Reuniones" fill="var(--ink-5)" radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar dataKey="closed" name="Cerradas"  fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
