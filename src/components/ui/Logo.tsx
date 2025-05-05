import { Brain, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "p-1.5",
      icon: "h-4 w-4",
      text: "text-lg",
    },
    md: {
      container: "p-1.5",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    lg: {
      container: "p-2",
      icon: "h-6 w-6",
      text: "text-2xl",
    },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center">
        {/* Outer glow effect */}
        <div className={cn("absolute -inset-1.5 bg-blue-500/20 rounded-lg blur-md")}></div>
        
        {/* Main logo container */}
        <div className={cn("relative flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg", sizeClasses[size].container)}>
          {/* Medical cross */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Stethoscope className={cn("text-white/40", sizeClasses[size].icon)} />
          </div>
          
          {/* AI Brain overlay */}
          <Brain className={cn("text-white relative z-10", sizeClasses[size].icon)} />
        </div>
      </div>
      
      {showText && (
        <span className={cn("font-bold tracking-tight", sizeClasses[size].text)}>
          <span className="text-gray-900">Med</span>
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Genius</span>
          <span className="text-gray-900"> AI</span>
        </span>
      )}
    </div>
  );
} 