"use client";

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

export default function SentimentChart({ data, total }: Props) {
  return (
    <Card title="Distribución de Sentimiento">
      {/* Summary chips */}
      <div className="flex gap-3 mb-5">
        {data.map(({ sentiment, count }) => (
          <div key={sentiment} className="flex-1 bg-surface rounded-xl p-4 text-center">
            <p className="text-3xl font-black" style={{ color: SENTIMENT_COLOR[sentiment] ?? "var(--ink)" }}>
              {total > 0 ? Math.round((count / total) * 100) : 0}%
            </p>
            <p className="text-xs text-ink-4 mt-1">{sentiment}</p>
            <p className="text-xs text-ink-5 mt-0.5">{count} cliente{count !== 1 ? "s" : ""}</p>
          </div>
        ))}
      </div>

      {/* Simple bar rows */}
      <div className="space-y-3">
        {data.map(({ sentiment, count }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={sentiment}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-ink-3">{sentiment}</span>
                <span className="text-ink-4">{count}</span>
              </div>
              <div className="h-2 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: SENTIMENT_COLOR[sentiment] ?? "var(--ink-4)" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
