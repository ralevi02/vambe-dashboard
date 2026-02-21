import { Client, DashboardMetrics, SellerPerformance } from "./types";

export function buildMetrics(clients: Client[]): DashboardMetrics {
  const closed = clients.filter((c) => c.closed);
  const conversionRate = Math.round((closed.length / clients.length) * 100);

  const sellerMap: Record<string, { total: number; closed: number }> = {};
  for (const c of clients) {
    if (!sellerMap[c.seller]) sellerMap[c.seller] = { total: 0, closed: 0 };
    sellerMap[c.seller].total++;
    if (c.closed) sellerMap[c.seller].closed++;
  }

  const sellerPerformance: SellerPerformance[] = Object.entries(sellerMap)
    .map(([seller, d]) => ({
      seller,
      total: d.total,
      closed: d.closed,
      conversionRate: Math.round((d.closed / d.total) * 100),
    }))
    .sort((a, b) => b.closed - a.closed);

  const topSeller = sellerPerformance[0]?.seller ?? "—";

  const sectorDist: Record<string, number> = {};
  const discoveryDist: Record<string, number> = {};
  for (const c of clients) {
    if (c.category) {
      sectorDist[c.category.sector] = (sectorDist[c.category.sector] ?? 0) + 1;
      discoveryDist[c.category.discoveryChannel] =
        (discoveryDist[c.category.discoveryChannel] ?? 0) + 1;
    }
  }

  return {
    totalClients: clients.length,
    closedDeals: closed.length,
    openDeals: clients.length - closed.length,
    conversionRate,
    avgInteractionVolume: "Medio",
    topSeller,
    sectorDistribution: sectorDist,
    discoveryChannelDistribution: discoveryDist,
    sellerPerformance,
  };
}
