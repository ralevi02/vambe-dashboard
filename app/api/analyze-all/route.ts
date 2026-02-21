import { parseClientsCSV } from "@/lib/csvParser";
import { analyzeAllTranscriptions } from "@/lib/aiModel";
import { Client } from "@/lib/types";

// SSE helper
function sseMsg(data: object) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET(): Promise<Response> {
  const clients = parseClientsCSV();

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();

      // Single LLM call with all transcriptions at once
      const categoryMap = await analyzeAllTranscriptions(clients);

      const enriched: Client[] = clients.map((c) => ({
        ...c,
        category: categoryMap.get(c.id),
      }));

      // Stream each client result so the UI progress bar still animates
      for (let i = 0; i < enriched.length; i++) {
        controller.enqueue(
          enc.encode(
            sseMsg({
              type: "progress",
              done: i + 1,
              total: enriched.length,
              client: enriched[i],
            })
          )
        );
      }

      controller.enqueue(
        enc.encode(
          sseMsg({
            type: "done",
            clients: enriched,
            total: enriched.length,
            analyzed: enriched.filter((c) => c.category).length,
          })
        )
      );
      controller.close();
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
