import Card from "@/app/components/ui/Card";
import { DashboardMetrics } from "@/lib/types";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

function StatCard({ title, value, sub, accent = "text-ink" }: StatCardProps) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-xs font-bold text-ink-4 uppercase tracking-widest">
        {title}
      </p>
      <p className={`text-3xl font-black ${accent}`}>{value}</p>
      {sub && <p className="text-sm text-ink-4 mt-1">{sub}</p>}
    </Card>
  );
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Clientes"
        value={metrics.totalClients}
        sub="en el CSV"
      />
      <StatCard
        title="Cierres"
        value={metrics.closedDeals}
        sub={`${metrics.openDeals} sin cerrar`}
        accent="text-[#00e676]"
      />
      <StatCard
        title="Tasa de Conversión"
        value={`${metrics.conversionRate}%`}
        sub="ventas cerradas"
        accent="text-[#00e676]"
      />
      <StatCard
        title="Top Vendedor"
        value={metrics.topSeller}
        sub="por cierres"
      />
    </div>
  );
}
