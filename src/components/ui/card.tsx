import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-shadow-sm hover:shadow-md transition-all p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

