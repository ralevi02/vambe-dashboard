import { SellersSummary } from "@/lib/sellers";

const ACCENT = "text-accent";

interface StatProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

function Stat({ label, value, accent }: StatProps) {
  return (
    <div className="bg-card border border-line rounded-xl px-5 py-4 flex-1 min-w-[130px]">
      <p className={`text-2xl font-black ${accent ? ACCENT : "text-ink"}`}>{value}</p>
      <p className="text-xs text-ink-5 mt-1">{label}</p>
    </div>
  );
}

interface Props {
  summary: SellersSummary;
}

export default function SellersMetricsBanner({ summary }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <Stat label="Vendedores" value={summary.totalSellers} />
      <Stat label="Reuniones totales" value={summary.totalMeetings} />
      <Stat label="Mejor conversión" value={`${summary.bestConversionRate}%`} accent />
      <Stat label="Top vendedor" value={summary.bestSeller} accent />
    </div>
  );
}
