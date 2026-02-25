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
import { PainPointCount } from "@/lib/types";
import Card from "@/app/components/ui/Card";

interface Props {
  data: PainPointCount[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { fullLabel, count } = payload[0].payload;
  return (
    <div className="bg-elevated border border-line rounded-lg px-3 py-2 text-xs text-ink-2 shadow-lg max-w-[280px]">
      <p className="font-semibold text-ink mb-0.5 leading-snug">{fullLabel}</p>
      <p>{count} cliente{count !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function PainPointsChart({ data }: Props) {
  return (
    <Card title="Pain Points más frecuentes">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
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
            dataKey="label"
            width={170}
            tick={{ fontSize: 11, fill: "var(--ink-3)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--hover)" }} />
          <Bar dataKey="count" fill="var(--accent)" radius={[0, 4, 4, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
