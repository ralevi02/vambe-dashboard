type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-elevated text-ink-3",
  success: "bg-[#00e676]/10 text-[#00e676]",
  warning: "bg-amber-500/10 text-amber-400",
  danger:  "bg-red-500/10 text-red-400",
  info:    "bg-blue-500/10 text-blue-400",
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  label,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {label}
    </span>
  );
}
