import { parseClientsCSV } from "@/lib/csvParser";
import InsightsPageClient from "./InsightsPageClient";

export default function InsightsPage() {
  const clients = parseClientsCSV();
  return <InsightsPageClient initialClients={clients} />;
}
