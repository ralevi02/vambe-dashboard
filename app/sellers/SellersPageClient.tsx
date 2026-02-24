"use client";

import { useState, useMemo } from "react";
import { Client } from "@/lib/types";
import { loadClients } from "@/lib/clientsCache";
import { buildSellerDetails, buildSellersSummary, SellerDetail } from "@/lib/sellers";
import FilterSelect from "@/app/components/ui/FilterSelect";
import SellerRow from "@/app/components/sellers/SellerRow";
import SellerModal from "@/app/components/sellers/SellerModal";
import SellersMetricsBanner from "@/app/components/sellers/SellersMetricsBanner";
import ClientModal from "@/app/components/client/ClientModal";

type SortKey = "total" | "conversionRate" | "closed";

const SORT_OPTIONS = [
  { value: "total",          label: "Más reuniones" },
  { value: "conversionRate", label: "Mejor conversión" },
  { value: "closed",         label: "Más cerradas" },
];

interface Props {
  initialClients: Client[];
}

export default function SellersPageClient({ initialClients }: Props) {
  const [clients] = useState<Client[]>(() => loadClients(initialClients));
  const [sortBy, setSortBy] = useState<SortKey>("total");
  const [selectedSeller, setSelectedSeller] = useState<SellerDetail | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const sellers = useMemo(() => buildSellerDetails(clients), [clients]);
  const summary = useMemo(() => buildSellersSummary(sellers), [sellers]);

  const sorted = useMemo(
    () => [...sellers].sort((a, b) => b[sortBy] - a[sortBy]),
    [sellers, sortBy]
  );

  function handleSellerSelect(seller: SellerDetail) {
    setSelectedSeller(seller);
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-ink">Vendedores</h1>
          <p className="text-sm text-ink-5 mt-1">
            Rendimiento individual y detalle de reuniones por vendedor
          </p>
        </div>
        <FilterSelect
          value={sortBy}
          onChange={(v) => setSortBy(v as SortKey)}
          options={SORT_OPTIONS}
          placeholder="Ordenar por"
        />
      </div>

      {/* Summary banner */}
      <SellersMetricsBanner summary={summary} />

      {/* Sellers table */}
      <div className="bg-card border border-line rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-line">
                {["Vendedor", "Reuniones", "Cerradas", "Analizados", "Sector top", "Urgencia prom.", "Conversión", ""].map(
                  (col) => (
                    <th
                      key={col}
                      className={`px-4 py-3 text-xs font-bold text-ink-4 uppercase tracking-widest whitespace-nowrap${
                        col === "Sector top" || col === "Urgencia prom." ? " hidden md:table-cell" : ""
                      }`}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sorted.map((seller) => (
                <SellerRow
                  key={seller.seller}
                  seller={seller}
                  onSelect={handleSellerSelect}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-line-subtle">
          <p className="text-xs text-ink-4">{sorted.length} vendedores</p>
        </div>
      </div>

      {/* Seller modal */}
      {selectedSeller && (
        <SellerModal
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
          onClientClick={setSelectedClient}
        />
      )}

      {/* Client modal — reuse the same modal from /clients */}
      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}
