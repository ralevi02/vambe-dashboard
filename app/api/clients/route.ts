import { NextResponse } from "next/server";
import { parseClientsCSV } from "@/lib/csvParser";
import { ClientsApiResponse } from "@/lib/types";

export async function GET(): Promise<NextResponse<ClientsApiResponse>> {
  const clients = parseClientsCSV();
  return NextResponse.json({ clients, total: clients.length });
}
