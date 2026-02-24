import { SellerDetail } from "@/lib/sellers";
import { Client } from "@/lib/types";
import SellerConversionBar from "./SellerConversionBar";
import ClientRow from "@/app/components/ui/ClientRow";

interface Props {
  seller: SellerDetail;
  onClientClick: (client: Client) => void;
}

export default function SellerDetailPanel({ seller, onClientClick }: Props) {
  const openClients = seller.clients.filter((c) => !c.closed);
  const closedClients = seller.clients.filter((c) => c.closed);

  return (
    <div className="flex flex-col gap-6">
      {/* Conversion rate */}
      <div>
        <div className="flex justify-between text-xs text-ink-4 mb-1.5">
          <span>Tasa de conversión</span>
          <span className="font-black text-accent">{seller.conversionRate}%</span>
        </div>
        <SellerConversionBar value={seller.conversionRate} max={100} />
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 text-xs text-center">
        {[
          { label: "Sector top", value: seller.topSector },
          { label: "Urgencia prom.", value: seller.avgUrgency },
          { label: "Analizados", value: `${seller.analyzedCount} / ${seller.total}` },
          { label: "Cerradas", value: `${seller.closed} / ${seller.total}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-elevated rounded-lg px-3 py-2">
            <p className="font-black text-ink truncate">{value}</p>
            <p className="text-ink-5 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Client lists */}
      <div className="space-y-4">
        {[
          { title: `Abiertas (${openClients.length})`, list: openClients },
          { title: `Cerradas (${closedClients.length})`, list: closedClients },
        ].map(({ title, list }) =>
          list.length > 0 ? (
            <div key={title}>
              <p className="text-[10px] font-bold text-ink-5 uppercase tracking-widest mb-1 px-1">
                {title}
              </p>
              <div className="divide-y divide-line-subtle">
                {list.map((c) => (
                  <ClientRow key={c.id} client={c} onClick={onClientClick} />
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
