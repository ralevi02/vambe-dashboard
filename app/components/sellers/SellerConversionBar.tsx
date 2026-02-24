/** Visual progress bar showing a ratio (0-100). */
interface Props {
  value: number;  // 0-100
  max?: number;   // used to scale relative to the group max
  className?: string;
}

export default function SellerConversionBar({ value, max = 100, className = "" }: Props) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={`h-2 rounded-full bg-line overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
      />
    </div>
  );
}
