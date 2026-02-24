"use client";

import { Client } from "@/lib/types";
import SharedClientsTable from "@/app/components/ui/ClientsTable";

interface ClientsTableProps {
  clients: Client[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  return <SharedClientsTable clients={clients} compact />;
}
