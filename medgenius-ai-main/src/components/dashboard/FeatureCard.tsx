
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  className?: string;
  index?: number;
}

const FeatureCard = ({ title, description, icon, link, className, index = 0 }: FeatureCardProps) => {
  return (
    <Link 
      to={link}
      className={cn(
        "group relative flex flex-col p-6 rounded-2xl border border-border bg-white shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-primary-50/50 to-primary-100/30 transition-opacity duration-300" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="bg-primary-50 text-primary-600 p-3 rounded-lg w-fit mb-6">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        
        <p className="text-muted-foreground text-sm mb-6 flex-grow">
          {description}
        </p>
        
        <div className="flex items-center text-primary font-medium text-sm gap-2 mt-auto group-hover:gap-3 transition-all">
          Learn more
          <ArrowRight className="h-4 w-4 transition-all group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
