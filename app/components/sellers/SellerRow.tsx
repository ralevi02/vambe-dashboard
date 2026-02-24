import { SellerDetail } from "@/lib/sellers";
import SellerConversionBar from "./SellerConversionBar";

interface Props {
  seller: SellerDetail;
  onSelect: (seller: SellerDetail) => void;
}

export default function SellerRow({ seller, onSelect }: Props) {
  const urgencyColor =
    seller.avgUrgency === "Alta"
      ? "text-red-400"
      : seller.avgUrgency === "Media"
      ? "text-yellow-400"
      : "text-ink-5";

  return (
    <tr
      onClick={() => onSelect(seller)}
      className="border-b border-line-subtle hover:bg-hover cursor-pointer transition-colors group"
    >
      {/* Vendedor */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-black text-accent">
              {seller.seller.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-semibold text-sm text-ink group-hover:text-accent transition-colors">
            {seller.seller}
          </span>
        </div>
      </td>

      {/* Reuniones */}
      <td className="px-4 py-3 text-sm text-ink-2 text-center">{seller.total}</td>

      {/* Cerradas */}
      <td className="px-4 py-3 text-sm text-ink-2 text-center">{seller.closed}</td>

      {/* Analizados */}
      <td className="px-4 py-3 text-sm text-ink-2 text-center">{seller.analyzedCount}</td>

      {/* Sector top */}
      <td className="px-4 py-3 text-xs text-ink-4 hidden md:table-cell">
        {seller.topSector}
      </td>

      {/* Urgencia promedio */}
      <td className={`px-4 py-3 text-xs font-bold hidden md:table-cell ${urgencyColor}`}>
        {seller.avgUrgency}
      </td>

      {/* Conversión */}
      <td className="px-4 py-3 w-40">
        <div className="flex items-center gap-2">
          <SellerConversionBar value={seller.conversionRate} max={100} className="flex-1" />
          <span className="text-xs font-black text-accent w-9 text-right shrink-0">
            {seller.conversionRate}%
          </span>
        </div>
      </td>

      {/* Chevron */}
      <td className="px-4 py-3 text-ink-5 group-hover:text-accent transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </td>
    </tr>
  );
}
