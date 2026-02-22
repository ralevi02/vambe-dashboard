"use client";

import { useState } from "react";
import { Client } from "@/lib/types";
import { loadClients } from "@/lib/clientsCache";
import Badge from "@/app/components/ui/Badge";
import SearchBar from "@/app/components/ui/SearchBar";
import FilterSelect from "@/app/components/ui/FilterSelect";
import ClientModal from "@/app/components/client/ClientModal";

interface Props {
  initialClients: Client[];
}

const urgencyVariant = (u?: string) =>
  u === "Alta" ? "danger" : u === "Media" ? "warning" : ("default" as const);

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ClientsPageClient({ initialClients }: Props) {
  const [clients] = useState<Client[]>(() => loadClients(initialClients));
  const [selected, setSelected] = useState<Client | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  const sellers = Array.from(new Set(clients.map((c) => c.seller))).sort();
  const sectors = Array.from(
    new Set(clients.map((c) => c.category?.sector).filter(Boolean))
  ).sort() as string[];
  const hasAnalysis = clients.some((c) => c.category);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q);
    const matchSeller = !sellerFilter || c.seller === sellerFilter;
    const matchStatus =
      !statusFilter ||
      (statusFilter === "closed" && c.closed) ||
      (statusFilter === "open" && !c.closed);
    const matchSector = !sectorFilter || c.category?.sector === sectorFilter;
    const matchUrgency = !urgencyFilter || c.category?.urgencyLevel === urgencyFilter;
    return matchSearch && matchSeller && matchStatus && matchSector && matchUrgency;
  });

  const analyzedCount = clients.filter((c) => c.category).length;
  const closedCount = filtered.filter((c) => c.closed).length;

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
        {/* Quick stats */}
        <div className="flex gap-3 shrink-0">
          {[
            { label: "Total", value: clients.length },
            { label: "Analizados", value: analyzedCount, green: true },
          ].map(({ label, value, green }) => (
            <div key={label} className="bg-card border border-line rounded-xl px-4 py-2 text-center">
              <p className={`text-xl font-black ${green ? "text-[#00e676]" : "text-ink"}`}>{value}</p>
              <p className="text-xs text-ink-5 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre, email o teléfono..."
          className="flex-1 min-w-[200px]"
        />
        <FilterSelect
          value={sellerFilter}
          onChange={setSellerFilter}
          options={sellers.map((s) => ({ label: s, value: s }))}
          placeholder="Todos los vendedores"
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Cerrado", value: "closed" },
            { label: "Abierto", value: "open" },
          ]}
          placeholder="Todos los estados"
        />
        {hasAnalysis && (
          <>
            <FilterSelect
              value={sectorFilter}
              onChange={setSectorFilter}
              options={sectors.map((s) => ({ label: s, value: s }))}
              placeholder="Todos los sectores"
            />
            <FilterSelect
              value={urgencyFilter}
              onChange={setUrgencyFilter}
              options={[
                { label: "Alta", value: "Alta" },
                { label: "Media", value: "Media" },
                { label: "Baja", value: "Baja" },
              ]}
              placeholder="Toda urgencia"
            />
          </>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-line">
                {[
                  "Cliente",
                  "Vendedor",
                  "Fecha",
                  ...(hasAnalysis ? ["Sector", "Canal", "Urgencia"] : []),
                  "Estado",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-xs font-bold text-ink-4 uppercase tracking-widest whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={hasAnalysis ? 7 : 4}
                    className="py-12 text-center text-ink-5"
                  >
                    Sin resultados para los filtros aplicados
                  </td>
                </tr>
              ) : (
                filtered.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => setSelected(client)}
                    className="border-b border-line-subtle hover:bg-hover cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink group-hover:text-[#00e676] transition-colors">
                        {client.name}
                      </p>
                      <p className="text-xs text-ink-5">{client.email}</p>
                    </td>
                  <td className="px-4 py-3 text-ink-2 whitespace-nowrap">{client.seller}</td>
                  <td className="px-4 py-3 text-ink-3 whitespace-nowrap">
                      {new Date(client.meetingDate).toLocaleDateString("es-CL")}
                    </td>
                    {hasAnalysis && (
                      <>
                        <td className="px-4 py-3">
                          <Badge
                            label={client.category?.sector ?? "—"}
                            variant={client.category ? "info" : "default"}
                          />
                        </td>
                        <td className="px-4 py-3 text-ink-4 text-xs max-w-[140px] truncate">
                          {client.category?.discoveryChannel ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          {client.category ? (
                            <Badge
                              label={client.category.urgencyLevel}
                              variant={urgencyVariant(client.category.urgencyLevel)}
                            />
                          ) : (
                            <span className="text-ink-5">—</span>
                          )}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <Badge
                        label={client.closed ? "Cerrado" : "Abierto"}
                        variant={client.closed ? "success" : "warning"}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-line-subtle flex justify-between items-center">
          <p className="text-xs text-ink-4">
            {filtered.length} de {clients.length} clientes
          </p>
          <p className="text-xs text-ink-4">
            {closedCount} cerrados ({filtered.length > 0 ? Math.round((closedCount / filtered.length) * 100) : 0}%)
          </p>
        </div>
      </div>

      {/* Client detail modal */}
      {selected && (
        <ClientModal client={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
