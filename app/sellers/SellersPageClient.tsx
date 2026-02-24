"use client";

import { useState, useMemo } from "react";
import { Client } from "@/lib/types";
import { loadClients } from "@/lib/clientsCache";
import { buildSellerDetails, buildSellersSummary } from "@/lib/sellers";
import SellersMetricsBanner from "@/app/components/sellers/SellersMetricsBanner";
import SellersTable from "@/app/components/sellers/SellersTable";

interface Props {
  initialClients: Client[];
}

export default function SellersPageClient({ initialClients }: Props) {
  const [clients] = useState<Client[]>(() => loadClients(initialClients));
  const sellers = useMemo(() => buildSellerDetails(clients), [clients]);
  const summary = useMemo(() => buildSellersSummary(sellers), [sellers]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-ink">Vendedores</h1>
        <p className="text-sm text-ink-5 mt-1">
          Rendimiento individual y detalle de reuniones por vendedor
        </p>
      </div>

      <SellersMetricsBanner summary={summary} />
      <SellersTable sellers={sellers} />
    </div>
  );
}
