"use client";

import { useState } from "react";
import { Client } from "@/lib/types";
import { loadClients } from "@/lib/clientsCache";
import ClientsTable from "@/app/components/clients/ClientsTable";

interface Props {
  initialClients: Client[];
}

export default function ClientsPageClient({ initialClients }: Props) {
  const [clients] = useState<Client[]>(() => loadClients(initialClients));
  const analyzedCount = clients.filter((c) => c.category).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink">Clientes</h1>
          <p className="text-sm text-ink-5 mt-1">
            Directorio completo de clientes y detalle de categorización
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          {[
            { label: "Total",      value: clients.length },
            { label: "Analizados", value: analyzedCount, accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bg-card border border-line rounded-xl px-4 py-2 text-center">
              <p className={`text-xl font-black ${accent ? "text-accent" : "text-ink"}`}>{value}</p>
              <p className="text-xs text-ink-5 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <ClientsTable clients={clients} />
    </div>
  );
}
