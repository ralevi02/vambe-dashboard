import { parseClientsCSV } from "@/lib/csvParser";
import SellersPageClient from "./SellersPageClient";

export default function SellersPage() {
  const clients = parseClientsCSV();
  return <SellersPageClient initialClients={clients} />;
}
