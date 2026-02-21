import OpenAI from "openai";
import { ClientCategory } from "./types";

const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN ?? "",
});

const SYSTEM_PROMPT = `Eres un analista de ventas experto.
Cuando recibas una transcripción de reunión de ventas, extrae las categorías solicitadas.
Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown.`;

const USER_PROMPT = (transcription: string) => `
Analiza la siguiente transcripción y devuelve exactamente este esquema JSON:
{
  "sector": "<industria o rubro de la empresa del cliente>",
  "discoveryChannel": "<cómo se enteró de Vambe: ej. Conferencia, Google, LinkedIn, Recomendación, Webinar, Podcast, Artículo online, Feria, Evento de networking>",
  "mainPainPoint": "<principal problema u necesidad que quieren resolver con Vambe>",
  "interactionVolume": "<'Bajo' si <100/semana, 'Medio' si 100-300/semana, 'Alto' si >300/semana>",
  "integrationNeeds": "<sistemas o plataformas con los que necesitan integración, o 'Ninguno mencionado'>",
  "urgencyLevel": "<'Alta' si mencionan urgencia o pico inmediato, 'Media' si lo necesitan pronto, 'Baja' si están explorando>",
  "summary": "<resumen de 1-2 oraciones del contexto del cliente>"
}

Transcripción:
"""
${transcription}
"""
`;

/**
 * Sends a transcription to GitHub Models (gpt-4o-mini) and returns the extracted ClientCategory.
 */
export async function analyzeTranscription(
  transcription: string
): Promise<ClientCategory> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT(transcription) },
    ],
    temperature: 0.2,
  });

  const text = response.choices[0]?.message?.content?.trim() ?? "";
  const clean = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  return JSON.parse(clean) as ClientCategory;
}
