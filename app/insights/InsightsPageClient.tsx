"use client";

import { useState, useMemo } from "react";
import { Client } from "@/lib/types";
import { loadClients } from "@/lib/clientsCache";
import { buildInsights } from "@/lib/insights";
import PainPointsChart from "@/app/components/insights/PainPointsChart";
import ChannelConversionChart from "@/app/components/insights/ChannelConversionChart";
import SentimentChart from "@/app/components/insights/SentimentChart";

interface Props {
  initialClients: Client[];
}

export default function InsightsPageClient({ initialClients }: Props) {
  const [clients] = useState<Client[]>(() => loadClients(initialClients));
  const insights = useMemo(() => buildInsights(clients), [clients]);

  const analyzedCount = clients.filter((c) => c.category).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink">Insights</h1>
          <p className="text-sm text-ink-5 mt-1">
            Patrones estratégicos extraídos del análisis IA de las transcripciones
          </p>
        </div>
        <div className="bg-card border border-line rounded-xl px-4 py-2 text-center shrink-0">
          <p className="text-xl font-black text-accent">{analyzedCount}</p>
          <p className="text-xs text-ink-5 mt-0.5">Analizados</p>
        </div>
      </div>

      {/* No-data state */}
      {!insights.hasAiData && (
        <div className="bg-card border border-dashed border-line rounded-2xl p-16 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-ink-3">Sin datos de análisis IA</p>
            <p className="text-xs text-ink-5 mt-1">
              Vuelve al Dashboard y presiona <span className="text-accent font-medium">Analizar con IA</span> para generar insights
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      {insights.hasAiData && (
        <>
          {/* Row 1 — Pain points (full width) */}
          <PainPointsChart data={insights.painPoints} />

          {/* Row 2 — Channel conversion + Sentiment side by side */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ChannelConversionChart data={insights.channelConversion} />
            <SentimentChart
              data={insights.sentimentDistribution}
              total={analyzedCount}
            />
          </div>
        </>
      )}
    </div>
  );
}
