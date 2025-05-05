import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface InfoCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "highlight" | "warning";
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
}

const InfoCard = ({ 
  children, 
  className, 
  onClick, 
  variant = "default",
  icon,
  title,
  subtitle
}: InfoCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-xl border p-6 shadow-md transition-all duration-300",
        "bg-card hover:shadow-lg",
        variant === "default" && "border-border",
        variant === "highlight" && "border-primary/20 bg-primary/5",
        variant === "warning" && "border-destructive/20 bg-destructive/5",
        onClick && "cursor-pointer hover:-translate-y-1",
        className
      )}
    >
      {icon && (
        <div className={cn(
          "mb-4 inline-flex rounded-lg p-3",
          variant === "default" && "bg-muted text-foreground",
          variant === "highlight" && "bg-primary/10 text-primary",
          variant === "warning" && "bg-destructive/10 text-destructive"
        )}>
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="mb-2 font-semibold tracking-tight text-foreground">
          {title}
        </h3>
      )}
      
      {subtitle && (
        <p className="mb-4 text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
      
      <div className="text-foreground">
        {children}
      </div>
    </div>
  );
};

export default InfoCard; 