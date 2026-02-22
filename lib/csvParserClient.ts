import Papa from "papaparse";
import { Client, ClientRaw } from "./types";

/**
 * Parses a raw CSV string into Client objects.
 * Identical column mapping to the server-side csvParser — safe to run in the browser.
 */
export function parseCSVString(csvContent: string): Client[] {
  const result = Papa.parse<ClientRaw>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    const fatal = result.errors.filter((e) => e.type === "Delimiter" || e.type === "Quotes");
    if (fatal.length > 0) throw new Error("El archivo CSV no tiene un formato válido.");
  }

  const clients = result.data.map((row, index) => ({
    id: `client-${index + 1}`,
    name: row["Nombre"] ?? "",
    email: row["Correo Electronico"] ?? "",
    phone: row["Numero de Telefono"] ?? "",
    meetingDate: row["Fecha de la Reunion"] ?? "",
    seller: row["Vendedor asignado"] ?? "",
    closed: row["closed"] === "1",
    transcription: row["Transcripcion"] ?? "",
  }));

  if (clients.length === 0) throw new Error("El CSV no contiene filas de datos.");
  return clients;
}
