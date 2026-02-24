"use client";

import { useState, useMemo } from "react";
import { Client } from "@/lib/types";
import { SellerDetail } from "@/lib/sellers";
import FilterSelect from "@/app/components/ui/FilterSelect";
import SellerRow from "./SellerRow";
import SellerModal from "./SellerModal";
import ClientModal from "@/app/components/clients/ClientModal";

type SortKey = "total" | "conversionRate" | "closed";

const SORT_OPTIONS = [
  { value: "total",          label: "Más reuniones" },
  { value: "conversionRate", label: "Mejor conversión" },
  { value: "closed",         label: "Más cerradas" },
];

const COLS = ["Vendedor", "Reuniones", "Cerradas", "Analizados", "Sector top", "Urgencia prom.", "Conversión", ""];
const HIDDEN_MD = new Set(["Sector top", "Urgencia prom."]);

interface Props {
  sellers: SellerDetail[];
}

export default function SellersTable({ sellers }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>("total");
  const [selectedSeller, setSelectedSeller] = useState<SellerDetail | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const sorted = useMemo(
    () => [...sellers].sort((a, b) => b[sortBy] - a[sortBy]),
    [sellers, sortBy]
  );

  return (
    <>
      {/* Sort control */}
      <div className="flex justify-end">
        <FilterSelect
          value={sortBy}
          onChange={(v) => setSortBy(v as SortKey)}
          options={SORT_OPTIONS}
          placeholder="Ordenar por"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-line rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-line">
                {COLS.map((col) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-xs font-bold text-ink-4 uppercase tracking-widest whitespace-nowrap${
                      HIDDEN_MD.has(col) ? " hidden md:table-cell" : ""
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((seller) => (
                <SellerRow
                  key={seller.seller}
                  seller={seller}
                  onSelect={setSelectedSeller}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-line-subtle">
          <p className="text-xs text-ink-4">{sorted.length} vendedores</p>
        </div>
      </div>

      {selectedSeller && (
        <SellerModal
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
          onClientClick={setSelectedClient}
        />
      )}
      {selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </>
  );
}
