import Card from "@/app/components/ui/Card";

interface CategoryChartProps {
  title: string;
  distribution: Record<string, number>;
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

export default function CategoryChart({
  title,
  distribution,
}: CategoryChartProps) {
  const entries = Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  return (
    <Card title={title}>
      <div className="space-y-3">
        {entries.map(([label, count], i) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-ink-2 truncate max-w-[60%]">
                  {label}
                </span>
                <span className="text-sm text-ink-3 ml-2">
                  {count} · {pct}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-line overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
