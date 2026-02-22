import { Client } from "./types";
import { LS_CLIENTS_KEY as KEY, LS_CUSTOM_CSV_KEY as CSV_KEY } from "./config";

// ── Custom CSV ────────────────────────────────────────────────────────────────

export function saveCustomCSV(clients: Client[]): void {
  try {
    localStorage.setItem(CSV_KEY, JSON.stringify(clients));
  } catch {
    // storage full — fail silently
  }
}

export function loadCustomCSV(): Client[] | null {
  try {
    const raw = localStorage.getItem(CSV_KEY);
    return raw ? (JSON.parse(raw) as Client[]) : null;
  } catch {
    return null;
  }
}

export function clearCustomCSV(): void {
  try {
    localStorage.removeItem(CSV_KEY);
  } catch {
    // ignore
  }
}

// ── Analysis cache (AI categories) ───────────────────────────────────────────

export function saveClients(clients: Client[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(clients));
  } catch {
    // storage full or unavailable — fail silently
  }
}

/**
 * Returns clients for rendering, with AI categories overlaid.
 * Priority: custom-uploaded CSV > server-default CSV.
 * Categories from the cache are re-applied by matching on client id.
 */
export function loadClients(fresh: Client[]): Client[] {
  try {
    // Use custom-uploaded CSV as base if one has been imported
    const customRaw = localStorage.getItem(CSV_KEY);
    const base: Client[] = customRaw ? JSON.parse(customRaw) : fresh;

    // Overlay AI categories
    const catRaw = localStorage.getItem(KEY);
    if (!catRaw) return base;
    const cached: Client[] = JSON.parse(catRaw);
    const categoryMap = new Map(cached.map((c) => [c.id, c.category]));
    return base.map((c) => ({
      ...c,
      category: categoryMap.get(c.id) ?? c.category,
    }));
  } catch {
    return fresh;
  }
}

export function clearClients(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
