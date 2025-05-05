
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
        "group relative flex flex-col p-6 rounded-2xl border border-primary-100 bg-white shadow-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${0.1 + index * 0.1}s` }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-primary-50/50 to-primary-100/30 transition-opacity duration-300" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-50/50 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="bg-primary-50 text-primary-600 p-3 rounded-lg w-fit mb-6 transition-all duration-300 group-hover:shadow-glow group-hover:bg-primary-100">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-primary-700">{title}</h3>
        
        <p className="text-muted-foreground text-sm mb-6 flex-grow">
          {description}
        </p>
        
        <div className="flex items-center text-primary font-medium text-sm gap-1 mt-auto group-hover:gap-3 transition-all duration-300 overflow-hidden">
          <span className="relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary-500 after:left-0 after:bottom-0 after:origin-bottom-left after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300">
            Learn more
          </span>
          <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
