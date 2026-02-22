import Papa from "papaparse";
import fs from "fs";
import path from "path";
import { Client, ClientRaw } from "./types";

/**
 * Reads and parses the CSV file from the /data directory.
 * Intended for server-side use only (API routes / Server Components).
 */
export function parseClientsCSV(): Client[] {
  const filePath = path.join(process.cwd(), "data", "vambe_clients.csv");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const result = Papa.parse<ClientRaw>(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row, index) => ({
    id: `client-${index + 1}`,
    name: row["Nombre"] ?? "",
    email: row["Correo Electronico"] ?? "",
    phone: row["Numero de Telefono"] ?? "",
    meetingDate: row["Fecha de la Reunion"] ?? "",
    seller: row["Vendedor asignado"] ?? "",
    closed: row["closed"] === "1",
    transcription: row["Transcripcion"] ?? "",
  }));
}
