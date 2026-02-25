"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { SentimentStat } from "@/lib/types";
import Card from "@/app/components/ui/Card";

interface Props {
  data: SentimentStat[];
  total: number;
}

const SENTIMENT_COLOR: Record<string, string> = {
  Positivo: "var(--accent)",
  Neutral:  "var(--ink-4)",
  Negativo: "#f87171", // red-400 — no token exists for red
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { sentiment, count } = payload[0].payload;
  return (
    <div className="bg-elevated border border-line rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-ink mb-0.5">{sentiment}</p>
      <p className="text-ink-3">{count} cliente{count !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function SentimentChart({ data, total }: Props) {
  return (
    <Card title="Distribución de Sentimiento">
      {/* Summary chips */}
      <div className="flex gap-3 mb-4">
        {data.map(({ sentiment, count }) => (
          <div key={sentiment} className="flex-1 bg-surface rounded-xl p-3 text-center">
            <p className="text-xl font-black" style={{ color: SENTIMENT_COLOR[sentiment] ?? "var(--ink)" }}>
              {total > 0 ? Math.round((count / total) * 100) : 0}%
            </p>
            <p className="text-xs text-ink-4 mt-0.5">{sentiment}</p>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
          <XAxis
            dataKey="sentiment"
            tick={{ fontSize: 12, fill: "var(--ink-3)" }}
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
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry) => (
              <Cell
                key={entry.sentiment}
                fill={SENTIMENT_COLOR[entry.sentiment] ?? "var(--ink-4)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
