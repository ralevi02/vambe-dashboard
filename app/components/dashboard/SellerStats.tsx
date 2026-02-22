import Card from "@/app/components/ui/Card";
import { SellerPerformance } from "@/lib/types";

interface SellerStatsProps {
  sellers: SellerPerformance[];
}

export default function SellerStats({ sellers }: SellerStatsProps) {
  const maxTotal = Math.max(...sellers.map((s) => s.total), 1);

  return (
    <Card title="Rendimiento por Vendedor">
      <div className="space-y-4">
        {sellers.map((seller) => (
          <div key={seller.seller}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-ink">
                {seller.seller}
              </span>
              <div className="flex items-center gap-2 text-xs text-ink-3">
                <span>
                  {seller.closed}/{seller.total}
                </span>
                <span className="font-black text-[#00e676]">
                  {seller.conversionRate}%
                </span>
              </div>
            </div>
            {/* Bar */}
            <div className="h-2 rounded-full bg-line overflow-hidden">
              <div
                className="h-full rounded-full bg-[#00e676] transition-all duration-500"
                style={{ width: `${(seller.total / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
