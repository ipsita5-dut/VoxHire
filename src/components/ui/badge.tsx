import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
  color?: "default" | "technical" | "behavioral" | "mixed";
}

export function Badge({ className, children, color = "default" }: BadgeProps) {
  const colorMap = {
    default: "bg-gray-100 text-gray-800",
    technical: "bg-blue-100 text-blue-800",
    behavioral: "bg-orange-100 text-orange-800",
    mixed: "bg-purple-100 text-purple-800",
  };

  return (
    <div
      className={cn(
        "text-xs font-semibold px-3 py-1 rounded-full",
        colorMap[color],
        className
      )}
    >
      {children}
    </div>
  );
}
