// ── AI / Groq ────────────────────────────────────────────────────────────────
export const GROQ_BASE_URL = process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1";
export const GROQ_MODEL    = process.env.GROQ_MODEL    ?? "llama-3.3-70b-versatile";

/** Available models shown in Settings. label is displayed, value is sent to the API. */
export const GROQ_MODELS: { label: string; value: string; description: string; recommended?: boolean }[] = [
  {
    label: "Llama 3.3 70B",
    value: "llama-3.3-70b-versatile",
    description: "Equilibrio ideal entre calidad y velocidad · Recomendado",
    recommended: true,
  },
  {
    label: "Llama 4 Maverick 17B",
    value: "meta-llama/llama-4-maverick-17b-128e-instruct",
    description: "Llama 4 · MoE 128 expertos · Mayor precisión",
  },
  {
    label: "Llama 4 Scout 17B",
    value: "meta-llama/llama-4-scout-17b-16e-instruct",
    description: "Llama 4 · MoE 16 expertos · Más rápido",
  },
  {
    label: "Kimi K2",
    value: "moonshotai/kimi-k2-instruct",
    description: "Moonshot AI · Excelente razonamiento",
  },
  {
    label: "Qwen3 32B",
    value: "qwen/qwen3-32b",
    description: "Alibaba · Sólido en tareas de análisis",
  },
  {
    label: "Llama 3.1 8B",
    value: "llama-3.1-8b-instant",
    description: "Más rápido · Menor precisión",
  },
];

/** Number of client transcriptions sent per LLM request */
export const AI_BATCH_SIZE = 8;

// ── localStorage keys ────────────────────────────────────────────────────────
export const LS_CLIENTS_KEY    = "vambe_analyzed_clients";
export const LS_THEME_KEY      = "vambe-theme";
export const LS_CUSTOM_CSV_KEY = "vambe_custom_csv";
export const LS_MODEL_KEY      = "vambe-model";
