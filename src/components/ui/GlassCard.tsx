import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "frost" | "dark" | "glow" | "subtle";
}

const GlassCard = ({ children, className, onClick, variant = "default" }: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300 backdrop-blur-md text-foreground",
        variant === "default" && "bg-card/80 border border-border shadow-sm",
        variant === "frost" && "bg-background/70 border border-border shadow-md",
        variant === "dark" && "bg-muted border border-border shadow-md",
        variant === "glow" && "bg-card/80 border border-border shadow-glow",
        variant === "subtle" && "bg-background/40 border border-border shadow-subtle",
        onClick && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
