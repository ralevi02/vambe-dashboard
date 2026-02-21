import { NextRequest, NextResponse } from "next/server";
import { analyzeAllTranscriptions } from "@/lib/aiModel";
import { AnalyzeRequest, AnalyzeResponse } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: AnalyzeRequest = await req.json();

    if (!body.transcription || !body.clientId) {
      return NextResponse.json(
        { error: "clientId and transcription are required" },
        { status: 400 }
      );
    }

    const map = await analyzeAllTranscriptions([
      {
        id: body.clientId,
        name: "",
        email: "",
        phone: "",
        meetingDate: "",
        seller: "",
        closed: false,
        transcription: body.transcription,
      },
    ]);

    const category = map.get(body.clientId);
    if (!category) throw new Error("No se obtuvo categoría del modelo");

    const response: AnalyzeResponse = {
      clientId: body.clientId,
      category,
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

