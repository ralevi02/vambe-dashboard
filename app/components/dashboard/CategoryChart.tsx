import Card from "@/app/components/ui/Card";

interface CategoryChartProps {
  title: string;
  distribution: Record<string, number>;
}

const COLORS = [
  "bg-[#00e676]",
  "bg-[#00bcd4]",
  "bg-[#69f0ae]",
  "bg-[#00acc1]",
  "bg-[#26c6da]",
  "bg-[#4dd0e1]",
  "bg-[#80cbc4]",
  "bg-[#a5d6a7]",
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
                <span className="text-sm text-[#ccc] truncate max-w-[60%]">
                  {label}
                </span>
                <span className="text-xs text-[#555] ml-2">
                  {count} · {pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#1f1f1f] overflow-hidden">
                <div
                  className={`h-full rounded-full ${COLORS[i % COLORS.length]} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
