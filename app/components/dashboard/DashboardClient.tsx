"use client";

import { useState } from "react";
import { Client } from "@/lib/types";
import { buildMetrics } from "@/lib/metrics";
import { saveClients, loadClients, clearClients } from "@/lib/clientsCache";
import { LS_MODEL_KEY, GROQ_MODELS } from "@/lib/config";
import MetricsCards from "@/app/components/dashboard/MetricsCards";
import ClientsTable from "@/app/components/dashboard/ClientsTable";
import SellerStats from "@/app/components/dashboard/SellerStats";
import CategoryChart from "@/app/components/dashboard/CategoryChart";

type AnalysisState = "idle" | "loading" | "done" | "error";

interface DashboardClientProps {
  initialClients: Client[];
}

export default function DashboardClient({ initialClients }: DashboardClientProps) {
  // Lazy initializer: hydrates categories from localStorage on first render
  const [clients, setClients] = useState<Client[]>(() => loadClients(initialClients));
  const [analysisState, setAnalysisState] = useState<AnalysisState>(
    () => (loadClients(initialClients).some((c) => c.category) ? "done" : "idle")
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const metrics = buildMetrics(clients);
  const analyzedCount = clients.filter((c) => c.category).length;
  const hasAnalysis = analyzedCount > 0;

  async function runAnalysis() {
    setAnalysisState("loading");
    setErrorMsg("");
    setProgress({ done: 0, total: 0 });
    clearClients();
    setClients(initialClients);

    try {
      const model = localStorage.getItem(LS_MODEL_KEY) ?? GROQ_MODELS[0].value;
      const res = await fetch(`/api/analyze-all?model=${encodeURIComponent(model)}`);
      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const json = JSON.parse(part.slice(6));

          if (json.type === "progress") {
            setProgress({ done: json.done, total: json.total });
            // Update the specific client in the list
            setClients((prev) =>
              prev.map((c) => (c.id === json.client.id ? json.client : c))
            );
          } else if (json.type === "done") {
            saveClients(json.clients);
            setClients(json.clients);
            setAnalysisState("done");
          }
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setAnalysisState("error");
    }
  }

  const progressPct =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ink">Dashboard</h1>
          <p className="text-sm text-ink-4 mt-1">
            Resumen del rendimiento de ventas y análisis de clientes
          </p>
        </div>

        {/* Analyze button */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={runAnalysis}
            disabled={analysisState === "loading"}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
              ${analysisState === "loading"
                ? "bg-elevated text-ink-5 cursor-not-allowed"
                : "bg-[#00e676] text-black hover:bg-[#00c864] active:scale-95"
              }`}
          >
            {analysisState === "loading" ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analizando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636 6.364l.707-.707M12 20v1m-6.364-1.636l.707-.707M6.343 6.343l-.707-.707" />
                </svg>
                {hasAnalysis ? "Re-analizar con IA" : "Analizar con IA"}
              </>
            )}
          </button>

          {/* Progress bar */}
          {analysisState === "loading" && progress.total > 0 && (
            <div className="w-48">
              <div className="flex justify-between text-xs text-ink-4 mb-1">
                <span>Procesando clientes</span>
                <span className="text-[#00e676]">{progress.done}/{progress.total}</span>
              </div>
              <div className="h-1.5 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00e676] rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {analysisState === "done" && (
            <p className="text-xs text-[#00e676]">
              ✓ {analyzedCount}/{clients.length} clientes analizados
            </p>
          )}
          {analysisState === "error" && (
            <div className="max-w-[300px] text-right">
              <p className="text-xs text-red-400 font-bold">Error de API</p>
              <p className="text-xs text-red-400/70 mt-0.5" title={errorMsg}>
                {errorMsg.slice(0, 120)}{errorMsg.length > 120 ? "…" : ""}
              </p>
            </div>
          )}
          {analysisState === "idle" && (
            <p className="text-xs text-ink-4">Extrae categorías con IA</p>
          )}
        </div>
      </div>

      {/* KPI row */}
      <MetricsCards metrics={metrics} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SellerStats sellers={metrics.sellerPerformance} />

        {hasAnalysis ? (
          <CategoryChart
            title="Distribución por Sector"
            distribution={metrics.sectorDistribution}
          />
        ) : (
          <div className="bg-card rounded-xl border border-dashed border-line flex flex-col items-center justify-center p-10 text-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00e676]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#00e676]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m1.636 6.364l.707-.707M12 20v1m-6.364-1.636l.707-.707M6.343 6.343l-.707-.707" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-ink-5">Análisis LLM pendiente</p>
              <p className="text-xs text-ink-5/60 mt-1">
                Presiona &ldquo;Analizar con IA&rdquo; para ver distribución por sector
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Discovery channel chart — only after analysis */}
      {hasAnalysis && (
        <CategoryChart
          title="Canal de Descubrimiento"
          distribution={metrics.discoveryChannelDistribution}
        />
      )}

      {/* Clients table */}
      <ClientsTable clients={clients} />
    </div>
  );
}
