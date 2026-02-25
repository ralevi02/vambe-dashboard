"use client";

import { Client } from "@/lib/types";
import Modal from "@/app/components/ui/Modal";
import Badge from "@/app/components/ui/Badge";

interface Props {
  client: Client;
  onClose: () => void;
}

const urgencyVariant = (u?: string) =>
  u === "Alta" ? "danger" : u === "Media" ? "warning" : ("default" as const);

const volumeVariant = (v?: string) =>
  v === "Alto" ? "danger" : v === "Medio" ? "warning" : ("default" as const);

export default function ClientModal({ client, onClose }: Props) {
  const cat = client.category;

  return (
    <Modal
      onClose={onClose}
      title={client.name}
      subtitle={client.email}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">

          {/* Contact chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { icon: "📞", value: client.phone || "—" },
              { icon: "📅", value: new Date(client.meetingDate).toLocaleDateString("es-CL") },
              { icon: "👤", value: client.seller },
            ].map(({ icon, value }) => (
              <span key={value} className="flex items-center gap-1.5 px-3 py-1.5 bg-elevated rounded-full text-ink-3">
                <span>{icon}</span>
                {value}
              </span>
            ))}
            <Badge
              label={client.closed ? "Cerrado" : "Abierto"}
              variant={client.closed ? "success" : "warning"}
            />
          </div>

          {/* AI section */}
          {cat ? (
            <>
              {/* Summary */}
              <div className="p-4 bg-accent/5 border border-accent/15 rounded-xl">
                <p className="text-xs font-bold text-accent mb-1.5">Resumen IA</p>
                <p className="text-sm text-ink-2 leading-relaxed">{cat.summary}</p>
              </div>

              {/* Quick badges row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Sector",   node: <Badge label={cat.sector} variant="info" /> },
                  { label: "Urgencia", node: <Badge label={cat.urgencyLevel} variant={urgencyVariant(cat.urgencyLevel)} /> },
                  { label: "Volumen",  node: <Badge label={cat.interactionVolume} variant={volumeVariant(cat.interactionVolume)} /> },
                ].map(({ label, node }) => (
                  <div key={label} className="bg-surface rounded-xl p-3 flex flex-col gap-2">
                    <p className="text-xs text-ink-3">{label}</p>
                    {node}
                  </div>
                ))}
              </div>

              {/* Text fields */}
              <div className="divide-y divide-line">
                {[
                  { label: "Canal de descubrimiento", value: cat.discoveryChannel },
                  { label: "Principal problema",      value: cat.mainPainPoint },
                  { label: "Integraciones",           value: cat.integrationNeeds },
                ].map(({ label, value }) => (
                  <div key={label} className="py-3 flex gap-4">
                    <span className="text-xs text-ink-4 w-40 shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-ink-2 leading-snug">{value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-4 bg-elevated rounded-xl text-center">
              <p className="text-sm text-ink-5">
                Sin análisis IA — vuelve al Dashboard y presiona &ldquo;Analizar con IA&rdquo;
              </p>
            </div>
          )}

          {/* Transcription */}
          <section>
            <p className="text-xs font-bold text-ink-5 uppercase tracking-widest mb-2">Transcripción</p>
            <pre className="text-xs text-ink-4 leading-relaxed whitespace-pre-wrap bg-surface p-4 rounded-xl border border-line-subtle max-h-48 overflow-y-auto font-sans">
              {client.transcription}
            </pre>
          </section>
      </div>
    </Modal>
  );
}
