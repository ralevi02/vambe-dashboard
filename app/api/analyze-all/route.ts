import { parseClientsCSV } from "@/lib/csvParser";
import { analyzeAllTranscriptions } from "@/lib/aiModel";
import { Client } from "@/lib/types";
import { GROQ_MODEL } from "@/lib/config";

// SSE helper
function sseMsg(data: object) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model") ?? GROQ_MODEL;
  const clients = parseClientsCSV();

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (data: object) =>
        controller.enqueue(enc.encode(sseMsg(data)));

      try {
        // Single LLM call with all transcriptions at once
        const categoryMap = await analyzeAllTranscriptions(clients, undefined, model);

        const enriched: Client[] = clients.map((c) => ({
          ...c,
          category: categoryMap.get(c.id),
        }));

        // Stream each client result so the UI progress bar still animates
        for (let i = 0; i < enriched.length; i++) {
          send({
            type: "progress",
            done: i + 1,
            total: enriched.length,
            client: enriched[i],
          });
        }

        send({
          type: "done",
          clients: enriched,
          total: enriched.length,
          analyzed: enriched.filter((c) => c.category).length,
        });
      } catch (err) {
        send({
          type: "error",
          message: err instanceof Error ? err.message : String(err),
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
