"use client";

import { useState } from "react";
import { Client } from "@/lib/types";
import Card from "@/app/components/ui/Card";
import Badge from "@/app/components/ui/Badge";
import SearchBar from "@/app/components/ui/SearchBar";
import FilterSelect from "@/app/components/ui/FilterSelect";

interface ClientsTableProps {
  clients: Client[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  const [search, setSearch] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const sellers = Array.from(new Set(clients.map((c) => c.seller))).sort();

  const filtered = clients.filter((c) => {
    const matchSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchSeller = sellerFilter === "" || c.seller === sellerFilter;
    const matchStatus =
      statusFilter === "" ||
      (statusFilter === "closed" && c.closed) ||
      (statusFilter === "open" && !c.closed);
    return matchSearch && matchSeller && matchStatus;
  });

  return (
    <Card title="Clientes">
      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-5">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nombre o email..."
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-[#1f1f1f]">
              {["Cliente", "Vendedor", "Fecha", "Sector", "Estado"].map(
                (col) => (
                  <th
                    key={col}
                    className="pb-3 pr-4 text-xs font-bold text-[#555] uppercase tracking-widest"
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#555]">
                  Sin resultados
                </td>
              </tr>
            ) : (
              filtered.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors"
                >
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-white">{client.name}</p>
                    <p className="text-xs text-[#555]">{client.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-[#888]">{client.seller}</td>
                  <td className="py-3 pr-4 text-[#555]">
                    {new Date(client.meetingDate).toLocaleDateString("es-CL")}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      label={client.category?.sector ?? "Sin analizar"}
                      variant={client.category ? "info" : "default"}
                    />
                  </td>
                  <td className="py-3 pr-4">
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
      <p className="mt-3 text-xs text-[#444] text-right">
        {filtered.length} de {clients.length} clientes
      </p>
    </Card>
  );
}
