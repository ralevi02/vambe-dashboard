import {
  Client,
  InsightsData,
  PainPointCount,
  ChannelConversionStat,
  SentimentStat,
} from "./types";

/** Shorten long LLM text to a readable chart label (max 40 chars) */
function shorten(text: string, max = 40): string {
  const t = text.trim();
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export function buildInsights(clients: Client[]): InsightsData {
  const analyzed = clients.filter((c) => c.category);

  if (analyzed.length === 0) {
    return {
      painPoints: [],
      channelConversion: [],
      sentimentDistribution: [],
      hasAiData: false,
    };
  }

  // ── Pain points frequency ────────────────────────────────────────────────
  const painMap: Record<string, { count: number; full: string }> = {};
  for (const c of analyzed) {
    const full = c.category!.mainPainPoint.trim();
    const key = shorten(full);
    if (!painMap[key]) painMap[key] = { count: 0, full };
    painMap[key].count++;
  }
  const painPoints: PainPointCount[] = Object.entries(painMap)
    .map(([label, { count, full }]) => ({ label, fullLabel: full, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // ── Channel → conversion rate ────────────────────────────────────────────
  const channelMap: Record<string, { total: number; closed: number }> = {};
  for (const c of analyzed) {
    const ch = c.category!.discoveryChannel;
    if (!channelMap[ch]) channelMap[ch] = { total: 0, closed: 0 };
    channelMap[ch].total++;
    if (c.closed) channelMap[ch].closed++;
  }
  const channelConversion: ChannelConversionStat[] = Object.entries(channelMap)
    .map(([channel, { total, closed }]) => ({
      channel,
      total,
      closed,
      rate: Math.round((closed / total) * 100),
    }))
    .sort((a, b) => b.rate - a.rate);

  // ── Sentiment distribution ───────────────────────────────────────────────
  const sentMap: Record<string, number> = {};
  for (const c of analyzed) {
    const s = c.category!.sentiment;
    if (s) sentMap[s] = (sentMap[s] ?? 0) + 1;
  }
  const ORDER = ["Positivo", "Neutral", "Negativo"];
  const sentimentDistribution: SentimentStat[] = ORDER.filter((s) => sentMap[s])
    .map((sentiment) => ({ sentiment, count: sentMap[sentiment] }));

  return { painPoints, channelConversion, sentimentDistribution, hasAiData: true };
}
