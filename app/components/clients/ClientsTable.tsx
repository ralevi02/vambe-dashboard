"use client";

import { useState } from "react";
import { Client } from "@/lib/types";
import Badge from "@/app/components/ui/Badge";
import SearchBar from "@/app/components/ui/SearchBar";
import FilterSelect from "@/app/components/ui/FilterSelect";
import Card from "@/app/components/ui/Card";
import ClientModal from "./ClientModal";

const urgencyVariant = (u?: string) =>
  u === "Alta" ? "danger" : u === "Media" ? "warning" : ("default" as const);

interface Props {
  clients: Client[];
  /**
   * compact=true  → dashboard mode: 3 filters, 5 columns (no Canal / Urgencia), wrapped in Card
   * compact=false → full mode: 5 filters, all columns, standalone container
   */
  compact?: boolean;
}

export default function ClientsTable({ clients, compact = false }: Props) {
  const [search, setSearch] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);

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
    const matchSentiment = !sentimentFilter || c.category?.sentiment === sentimentFilter;
    return matchSearch && matchSeller && matchStatus && matchSector && matchUrgency && matchSentiment;
  });

  const closedCount = filtered.filter((c) => c.closed).length;

  // Columns shown depend on mode
  const showAiCols = !compact && hasAnalysis;
  const colCount = showAiCols ? 8 : 5;

  const filters = (
    <div className={`flex flex-wrap gap-3 ${compact ? "mb-4" : "mb-5"}`}>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nombre, email..."
        className="flex-1 min-w-[180px]"
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
      {!compact && hasAnalysis && (
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
          <FilterSelect
            value={sentimentFilter}
            onChange={setSentimentFilter}
            options={[
              { label: "Positivo", value: "Positivo" },
              { label: "Neutral",  value: "Neutral" },
              { label: "Negativo", value: "Negativo" },
            ]}
            placeholder="Todo sentimiento"
          />
        </>
      )}
    </div>
  );

  const thead = (
    <tr className="border-b border-line">
      {[
        "Cliente",
        "Vendedor",
        "Fecha",
        "Sector",
        ...(showAiCols ? ["Canal", "Urgencia", "Sentimiento"] : []),
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
  );

  const tbody = filtered.length === 0 ? (
    <tr>
      <td colSpan={colCount} className="py-12 text-center text-ink-5">
        Sin resultados
      </td>
    </tr>
  ) : (
    <>
      {filtered.map((client) => (
        <tr
          key={client.id}
          onClick={() => setSelected(client)}
          className="border-b border-line-subtle hover:bg-hover cursor-pointer transition-colors group"
        >
          <td className="px-4 py-3">
            <p className="font-semibold text-ink group-hover:text-accent transition-colors">
              {client.name}
            </p>
            <p className="text-xs text-ink-5">{client.email}</p>
          </td>
          <td className="px-4 py-3 text-ink-2 whitespace-nowrap">{client.seller}</td>
          <td className="px-4 py-3 text-ink-3 whitespace-nowrap">
            {new Date(client.meetingDate).toLocaleDateString("es-CL")}
          </td>
          <td className="px-4 py-3">
            <Badge
              label={client.category?.sector ?? "—"}
              variant={client.category ? "info" : "default"}
            />
          </td>
          {showAiCols && (
            <>
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
              <td className="px-4 py-3">
                {client.category ? (
                  <Badge
                    label={client.category.sentiment}
                    variant={
                      client.category.sentiment === "Positivo" ? "success"
                      : client.category.sentiment === "Negativo" ? "danger"
                      : "default"
                    }
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
      ))}
    </>
  );

  const footer = (
    <div className="px-4 py-3 border-t border-line-subtle flex justify-between items-center">
      <p className="text-xs text-ink-4">{filtered.length} de {clients.length} clientes</p>
      {!compact && (
        <p className="text-xs text-ink-4">
          {closedCount} cerrados ({filtered.length > 0 ? Math.round((closedCount / filtered.length) * 100) : 0}%)
        </p>
      )}
    </div>
  );

  const table = (
    <>
      {filters}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>{thead}</thead>
          <tbody>{tbody}</tbody>
        </table>
      </div>
      {footer}
      {selected && <ClientModal client={selected} onClose={() => setSelected(null)} />}
    </>
  );

  if (compact) return <Card title="Clientes">{table}</Card>;

  return (
    <div className="bg-card border border-line rounded-xl overflow-hidden">
      <div className="p-6 pb-0">{filters}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>{thead}</thead>
          <tbody>{tbody}</tbody>
        </table>
      </div>
      {footer}
      {selected && <ClientModal client={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
