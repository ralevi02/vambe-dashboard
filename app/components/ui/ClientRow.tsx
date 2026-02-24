import { Client } from "@/lib/types";
import Badge from "./Badge";

interface Props {
  client: Client;
  onClick: (client: Client) => void;
}

const urgencyVariant = (u?: string) =>
  u === "Alta" ? "danger" : u === "Media" ? "warning" : ("default" as const);

/**
 * Compact clickable client row — shared between the seller modal list
 * and any other compact client listing.
 */
export default function ClientRow({ client, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(client)}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-hover transition-colors text-left cursor-pointer"
    >
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
        <span className="text-[11px] font-black text-accent">
          {client.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Name + email */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{client.name}</p>
        <p className="text-xs text-ink-5 truncate">{client.email}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          label={client.closed ? "Cerrado" : "Abierto"}
          variant={client.closed ? "success" : "warning"}
        />
        {client.category?.urgencyLevel && (
          <Badge
            label={client.category.urgencyLevel}
            variant={urgencyVariant(client.category.urgencyLevel)}
          />
        )}
      </div>
    </button>
  );
}
