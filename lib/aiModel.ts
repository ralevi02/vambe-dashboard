import OpenAI from "openai";
import { Client, ClientCategory } from "./types";

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN ?? "",
});

const SYSTEM_PROMPT = `Eres un analista de ventas experto.
Responde ÚNICAMENTE con un array JSON válido, sin texto adicional, sin markdown, sin bloques de código.`;

/** Split an array into chunks of at most `size` elements */
function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

/** Send one batch of clients to the LLM and return id→category pairs */
async function analyzeBatch(
  batch: Client[]
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
  "summary": "<resumen de 1-2 oraciones>"
}

Transcripciones:
${lines}

Responde SOLO con el array JSON, sin ningún texto adicional.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });

  const text = response.choices[0]?.message?.content?.trim() ?? "";
  const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(clean) as Array<{ id: string } & ClientCategory>;
}

/**
 * Splits clients into batches of BATCH_SIZE and fires them all in parallel.
 * Total time ≈ slowest batch instead of sum of all batches.
 */
export async function analyzeAllTranscriptions(
  clients: Client[],
  BATCH_SIZE = 10
): Promise<Map<string, ClientCategory>> {
  const batches = chunk(clients, BATCH_SIZE);

  // All batches run concurrently
  const results = await Promise.all(batches.map((b) => analyzeBatch(b)));

  const map = new Map<string, ClientCategory>();
  for (const items of results) {
    for (const { id, ...category } of items) {
      map.set(id, category as ClientCategory);
    }
  }
  return map;
}
