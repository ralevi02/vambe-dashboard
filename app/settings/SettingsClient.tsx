"use client";

import { useRef, useState, useEffect } from "react";
import { useTheme } from "@/app/providers";
import { parseCSVString } from "@/lib/csvParserClient";
import { saveCustomCSV, loadCustomCSV, clearCustomCSV, clearClients } from "@/lib/clientsCache";
import { GROQ_MODELS, LS_MODEL_KEY } from "@/lib/config";

// ── Mini preview card ─────────────────────────────────────────────────────────
function ThemePreview({ mode }: { mode: "dark" | "light" }) {
  const isDark = mode === "dark";
  return (
    <div
      className={`rounded-xl border overflow-hidden w-full aspect-video select-none pointer-events-none ${
        isDark
          ? "bg-[#0a0a0a] border-[#222]"
          : "bg-[#f4f4f5] border-[#d4d4d8]"
      }`}
    >
      {/* Fake sidebar */}
      <div className="flex h-full">
        <div
          className={`w-10 h-full shrink-0 ${isDark ? "bg-[#111111]" : "bg-[#ffffff]"}`}
        />
        <div className="flex-1 p-2 space-y-1.5">
          {/* Fake header bar */}
          <div
            className={`h-2 w-3/4 rounded ${isDark ? "bg-[#1a1a1a]" : "bg-[#e4e4e7]"}`}
          />
          {/* Fake metric cards row */}
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 h-5 rounded ${isDark ? "bg-[#111111]" : "bg-[#ffffff]"}`}
              />
            ))}
          </div>
          {/* Fake table */}
          <div className={`h-2 w-full rounded ${isDark ? "bg-[#1a1a1a]" : "bg-[#e4e4e7]"}`} />
          <div className={`h-2 w-5/6 rounded ${isDark ? "bg-[#1a1a1a]" : "bg-[#e4e4e7]"}`} />
          {/* Accent line */}
          <div className="h-1.5 w-1/3 rounded bg-[#00e676]/60" />
        </div>
      </div>
    </div>
  );
}

// ── Main settings page ────────────────────────────────────────────────────────
export default function SettingsClient() {
  const { theme, toggle } = useTheme();

  // CSV import state
  const fileRef = useRef<HTMLInputElement>(null);
  const [csvStatus, setCsvStatus] = useState<{
    fileName: string;
    rowCount: number;
  } | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Model selection state
  const [selectedModel, setSelectedModel] = useState(GROQ_MODELS[0].value);

  useEffect(() => {
    const stored = localStorage.getItem(LS_MODEL_KEY);
    if (stored) setSelectedModel(stored);
  }, []);

  function handleModelSelect(value: string) {
    setSelectedModel(value);
    localStorage.setItem(LS_MODEL_KEY, value);
  }

  // Hydrate custom CSV info from localStorage on mount
  useEffect(() => {
    const custom = loadCustomCSV();
    if (custom) setCsvStatus({ fileName: "CSV personalizado", rowCount: custom.length });
  }, []);

  function handleFile(file: File) {
    setCsvError(null);
    if (!file.name.endsWith(".csv")) {
      setCsvError("El archivo debe tener extensión .csv");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const clients = parseCSVString(content);
        saveCustomCSV(clients);
        clearClients(); // clear old AI categories — new data, fresh analysis
        setCsvStatus({ fileName: file.name, rowCount: clients.length });
      } catch (err) {
        setCsvError((err as Error).message);
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function handleReset() {
    clearCustomCSV();
    clearClients();
    setCsvStatus(null);
    setCsvError(null);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-ink">Configuración</h1>
        <p className="text-sm text-ink-5 mt-1">Personaliza la apariencia del dashboard</p>
      </div>

      {/* Theme section */}
      <section className="bg-card border border-line rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-sm font-bold text-ink">Tema de la interfaz</h2>
          <p className="text-xs text-ink-4 mt-0.5">
            Elige entre el modo oscuro y el modo claro. Tu preferencia se guarda automáticamente.
          </p>
        </div>

        {/* Theme option cards */}
        <div className="grid grid-cols-2 gap-4">
          {(["dark", "light"] as const).map((mode) => {
            const isSelected = theme === mode;
            const label = mode === "dark" ? "Oscuro" : "Claro";
            return (
              <button
                key={mode}
                onClick={() => !isSelected && toggle()}
                className={`group flex flex-col gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-[#00e676] bg-[#00e676]/5"
                    : "border-line hover:border-line-subtle bg-transparent"
                }`}
              >
                <ThemePreview mode={mode} />
                <div className="flex items-center justify-between px-0.5">
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? "text-[#00e676]" : "text-ink-3"
                    }`}
                  >
                    {label}
                  </span>
                  {/* Radio indicator */}
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? "border-[#00e676]" : "border-line"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#00e676]" />
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick toggle button */}
        <div className="flex items-center justify-between pt-1 border-t border-line-subtle">
          <div>
            <p className="text-sm text-ink-3">Modo actual</p>
            <p className="text-xs text-ink-5">
              {theme === "dark" ? "Interfaz oscura activa" : "Interfaz clara activa"}
            </p>
          </div>
          <button
            onClick={toggle}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-elevated border border-line text-sm font-medium text-ink-3 hover:text-ink hover:border-[#00e676]/40 transition-colors"
          >
            {theme === "dark" ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M18.364 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Cambiar a claro
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Cambiar a oscuro
              </>
            )}
          </button>
        </div>
      </section>

      {/* Model selector section */}
      <section className="bg-card border border-line rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-ink">Modelo de IA</h2>
          <p className="text-xs text-ink-4 mt-0.5">
            Elige el modelo de Groq que se usará para analizar las transcripciones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GROQ_MODELS.map((m) => {
            const isSelected = selectedModel === m.value;
            return (
              <button
                key={m.value}
                onClick={() => handleModelSelect(m.value)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-[#00e676] bg-[#00e676]/5"
                    : "border-line hover:border-[#00e676]/30 bg-transparent"
                }`}
              >
                {/* Radio dot */}
                <span
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "border-[#00e676]" : "border-line"
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#00e676]" />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${isSelected ? "text-[#00e676]" : "text-ink"}`}>
                      {m.label}
                    </span>
                    {m.recommended && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00e676]/10 text-[#00e676] uppercase tracking-wide">
                        Recomendado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-4 mt-0.5">{m.description}</p>
                  <p className="text-[10px] text-ink-5 mt-1 font-mono truncate">{m.value}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* CSV import section */}
      <section className="bg-card border border-line rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-ink">Importar datos CSV</h2>
          <p className="text-xs text-ink-4 mt-0.5">
            Reemplaza el CSV por defecto con tu propio archivo. El análisis IA se reiniciará.
          </p>
        </div>

        {/* Active custom CSV badge */}
        {csvStatus && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#00e676]/5 border border-[#00e676]/20 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e676] shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#00e676]">{csvStatus.fileName}</p>
                <p className="text-xs text-ink-4">{csvStatus.rowCount} clientes cargados</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-ink-4 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
            >
              Restablecer por defecto
            </button>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
            isDragging
              ? "border-[#00e676] bg-[#00e676]/5"
              : "border-line hover:border-[#00e676]/40 hover:bg-elevated"
          }`}
        >
          <svg className="w-8 h-8 text-ink-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-ink-3">
              Arrastra un CSV aquí o <span className="text-[#00e676]">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-ink-5 mt-1">
              Columnas requeridas: Nombre, Correo Electronico, Vendedor asignado, Transcripcion…
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </div>

        {/* Error */}
        {csvError && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {csvError}
          </p>
        )}

        {/* Success toast */}
        {csvStatus && !csvError && (
          <p className="text-xs text-[#00e676] flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            CSV importado correctamente. Ve al Dashboard para analizar los nuevos clientes.
          </p>
        )}
      </section>

      {/* Info section */}
      <section className="bg-card border border-line rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-bold text-ink">Acerca del Dashboard</h2>
        <div className="divide-y divide-line-subtle text-sm">
          {[
            { label: "Versión", value: "1.0.0" },
            { label: "Framework", value: "Next.js 15 · App Router" },
            { label: "Modelo IA", value: selectedModel },
            { label: "Proyecto", value: "Prueba Técnica — Vambe AI" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2.5">
              <span className="text-ink-4">{label}</span>
              <span className="text-ink-3 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
