import { cn } from "@/lib/utils";

/**
 * Badge — Subtle label badge with navy/gold palette
 */
export default function Badge({ children, className, style }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold tracking-wide",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
