// Raw row from the CSV file
export interface ClientRaw {
  Nombre: string;
  "Correo Electronico": string;
  "Numero de Telefono": string;
  "Fecha de la Reunion": string;
  "Vendedor asignado": string;
  closed: string;
  Transcripcion: string;
}

// Parsed and normalised client
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  meetingDate: string;
  seller: string;
  closed: boolean;
  transcription: string;
  // LLM-enriched fields (populated after Gemini analysis)
  category?: ClientCategory;
}

// Categories extracted by the LLM from the transcription
export interface ClientCategory {
  sector: string;           // e.g. "Servicios financieros", "Salud", "E-commerce"
  discoveryChannel: string; // How they learnt about Vambe
  mainPainPoint: string;    // Core problem they want to solve
  interactionVolume: "Bajo" | "Medio" | "Alto"; // Weekly interactions
  integrationNeeds: string; // Systems they want to integrate with
  urgencyLevel: "Baja" | "Media" | "Alta";
  summary: string;          // Short summary of the transcript
  sentiment: "Positivo" | "Neutral" | "Negativo"; // Overall client attitude
  triggerWords: string[];   // High-intent keywords detected (e.g. "presupuesto", "urgente")
  nextSteps: string;        // Concrete commitments extracted (e.g. "Enviar demo el lunes")
}

// Shape returned by the /api/clients endpoint
export interface ClientsApiResponse {
  clients: Client[];
  total: number;
}

// Shape expected by the /api/analyze endpoint
export interface AnalyzeRequest {
  clientId: string;
  transcription: string;
}

// Shape returned by the /api/analyze endpoint
export interface AnalyzeResponse {
  clientId: string;
  category: ClientCategory;
}

// Dashboard-level aggregated metrics
export interface DashboardMetrics {
  totalClients: number;
  closedDeals: number;
  openDeals: number;
  conversionRate: number;             // 0-100
  avgInteractionVolume: string;
  topSeller: string;
  sectorDistribution: Record<string, number>;
  discoveryChannelDistribution: Record<string, number>;
  sellerPerformance: SellerPerformance[];
}

export interface SellerPerformance {
  seller: string;
  total: number;
  closed: number;
  conversionRate: number;
}
