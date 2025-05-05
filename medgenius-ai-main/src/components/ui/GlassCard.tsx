
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard = ({ children, className, onClick }: GlassCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-2xl p-6 border border-white/10 shadow-glass transition-all duration-300",
        onClick && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
