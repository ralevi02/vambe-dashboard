import { parseClientsCSV } from "@/lib/csvParser";
import DashboardClient from "@/app/components/dashboard/DashboardClient";

export default function DashboardPage() {
  const clients = parseClientsCSV();
  return <DashboardClient initialClients={clients} />;
}

