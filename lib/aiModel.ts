import OpenAI from "openai";
import { Client, ClientCategory } from "./types";
import { GROQ_BASE_URL, GROQ_MODEL, AI_BATCH_SIZE } from "./config";

const openai = new OpenAI({
  baseURL: GROQ_BASE_URL,
  apiKey: process.env.GROQ_API_KEY ?? "",
});

const SYSTEM_PROMPT = `Eres un analista de ventas experto.
Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, sin bloques de código.`;

/** Split an array into chunks of at most `size` elements */
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

/** Capitalize the first letter of a string, leave the rest as-is */
const cap = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** Normalize free-text fields returned by the LLM to start with a capital letter */
function normalizeCategory(c: ClientCategory): Partial<ClientCategory> {
  return {
    sector:            cap(c.sector),
    discoveryChannel:  cap(c.discoveryChannel),
    mainPainPoint:     cap(c.mainPainPoint),
    integrationNeeds:  cap(c.integrationNeeds),
    summary:           cap(c.summary),
    nextSteps:         cap(c.nextSteps),
    triggerWords:      c.triggerWords?.map(cap) ?? [],
  };
}

/** Send one batch of clients to the LLM and return id→category pairs */
async function analyzeBatch(
  batch: Client[],
  model: string
): Promise<Array<{ id: string } & ClientCategory>> {
  const lines = batch
    .map((c, i) => `### Cliente ${i + 1} (id: ${c.id})\n${c.transcription.trim()}`)
    .join("\n\n");

  const userPrompt = `
A continuación hay ${batch.length} transcripciones de reuniones de ventas.
Para CADA una, extrae las categorías y devuelve un array JSON con exactamente ${batch.length} objetos en el mismo orden.

Esquema de cada objeto:
{
  "id": "<id del cliente tal como aparece en el encabezado>",
  "sector": "<industria o rubro>",
  "discoveryChannel": "<cómo se enteró de Vambe: Conferencia, Google, LinkedIn, Recomendación, Webinar, Podcast, Artículo online, Feria, Evento de networking, u otro>",
  "mainPainPoint": "<principal problema que quieren resolver con Vambe>",
  "interactionVolume": "<'Bajo' si <100/semana | 'Medio' si 100-300/semana | 'Alto' si >300/semana>",
  "integrationNeeds": "<sistemas con los que necesitan integración, o 'Ninguno mencionado'>",
  "urgencyLevel": "<'Alta' | 'Media' | 'Baja'>",
  "summary": "<resumen de 1-2 oraciones>",
  "sentiment": "<'Positivo' si el cliente mostró entusiasmo o interés claro | 'Neutral' si fue indiferente o exploratorio | 'Negativo' si hubo objeciones fuertes o desinterés>",
  "triggerWords": ["<palabra o frase de alta intención detectada en la transcripción, ej: 'presupuesto', 'urgente', 'competencia', 'integración', 'demo'>"],
  "nextSteps": "<compromiso concreto acordado en la reunión, ej: 'Enviar propuesta el viernes' — o 'Sin próximos pasos mencionados' si no hay ninguno>"
}

Transcripciones:
${lines}

Responde SOLO con el array JSON, sin ningún texto adicional.
`;

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });

  const text = response.choices[0]?.message?.content?.trim() ?? "";
  const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const parsed = JSON.parse(clean) as Array<{ id: string } & ClientCategory>;
  return parsed.map((item) => ({ ...item, ...normalizeCategory(item) }));
}

/**
 * Splits clients into batches of BATCH_SIZE and fires them all in parallel.
 * Total time ≈ slowest batch instead of sum of all batches.
 */
export async function analyzeAllTranscriptions(
  clients: Client[],
  BATCH_SIZE = AI_BATCH_SIZE,
  model = GROQ_MODEL
): Promise<Map<string, ClientCategory>> {
  const batches = chunk(clients, BATCH_SIZE);

  // All batches run concurrently
  const results = await Promise.all(batches.map((b) => analyzeBatch(b, model)));

  const map = new Map<string, ClientCategory>();
  for (const items of results) {
    for (const { id, ...category } of items) {
      map.set(id, category as ClientCategory);
    }
  }
  return map;
}
