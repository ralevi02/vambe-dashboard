import { Client, SellerPerformance } from "./types";

/** Extended seller stats including their individual clients. */
export interface SellerDetail extends SellerPerformance {
  clients: Client[];
  /** Most common sector among this seller's analysed clients. */
  topSector: string;
  /** Average urgency label derived from AI analysis. */
  avgUrgency: "Alta" | "Media" | "Baja" | "—";
  /** Number of clients that already have AI analysis. */
  analyzedCount: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function topKey(map: Map<string, number>): string {
  let best = "";
  let bestN = 0;
  map.forEach((n, k) => {
    if (n > bestN) { bestN = n; best = k; }
  });
  return best || "—";
}

const URGENCY_SCORE: Record<string, number> = { Baja: 1, Media: 2, Alta: 3 };
const SCORE_LABEL: [number, "Alta" | "Media" | "Baja"][] = [
  [2.5, "Alta"],
  [1.5, "Media"],
  [0,   "Baja"],
];

function scoreToLabel(avg: number): "Alta" | "Media" | "Baja" {
  return SCORE_LABEL.find(([threshold]) => avg >= threshold)![1];
}

// ── Main derive fn ────────────────────────────────────────────────────────────

/**
 * Derives per-seller aggregated stats from a flat list of clients.
 * Pure function — no side effects, safe on the server or client.
 */
export function buildSellerDetails(clients: Client[]): SellerDetail[] {
  // Group clients by seller
  const bySellerMap = new Map<string, Client[]>();
  for (const client of clients) {
    if (!bySellerMap.has(client.seller)) bySellerMap.set(client.seller, []);
    bySellerMap.get(client.seller)!.push(client);
  }

  return Array.from(bySellerMap.entries())
    .map(([seller, sellerClients]) => {
      const total = sellerClients.length;
      const closed = sellerClients.filter((c) => c.closed).length;
      const conversionRate = total ? Math.round((closed / total) * 100) : 0;

      // Sector distribution
      const sectorMap = new Map<string, number>();
      const urgencyScores: number[] = [];

      for (const c of sellerClients) {
        if (c.category?.sector) {
          sectorMap.set(c.category.sector, (sectorMap.get(c.category.sector) ?? 0) + 1);
        }
        if (c.category?.urgencyLevel) {
          urgencyScores.push(URGENCY_SCORE[c.category.urgencyLevel] ?? 0);
        }
      }

      const topSector = topKey(sectorMap);
      const analyzedCount = sellerClients.filter((c) => c.category).length;

      const avgScore =
        urgencyScores.length
          ? urgencyScores.reduce((a, b) => a + b, 0) / urgencyScores.length
          : null;

      const avgUrgency: SellerDetail["avgUrgency"] =
        avgScore !== null ? scoreToLabel(avgScore) : "—";

      return {
        seller,
        total,
        closed,
        conversionRate,
        clients: sellerClients,
        topSector,
        avgUrgency,
        analyzedCount,
      };
    })
    .sort((a, b) => b.total - a.total); // default: most clients first
}

// ── Summary metrics ───────────────────────────────────────────────────────────

export interface SellersSummary {
  totalSellers: number;
  totalMeetings: number;
  bestSeller: string;
  bestConversionRate: number;
}

export function buildSellersSummary(details: SellerDetail[]): SellersSummary {
  const best = details.reduce<SellerDetail | null>(
    (top, s) => (!top || s.conversionRate > top.conversionRate ? s : top),
    null
  );
  return {
    totalSellers: details.length,
    totalMeetings: details.reduce((sum, s) => sum + s.total, 0),
    bestSeller: best?.seller ?? "—",
    bestConversionRate: best?.conversionRate ?? 0,
  };
}
