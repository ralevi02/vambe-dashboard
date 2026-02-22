import { parseClientsCSV } from "@/lib/csvParser";
import ClientsPageClient from "./ClientsPageClient";

export default function ClientsPage() {
  const clients = parseClientsCSV();
  return <ClientsPageClient initialClients={clients} />;
}
