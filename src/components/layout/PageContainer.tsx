import React from 'react';
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const PageContainer = ({ children, fullWidth = false, className = "bg-white" }: PageContainerProps) => {
  return (
    <div className={cn(`min-h-full w-full pt-20`, className)}>
      <div className={fullWidth ? "w-full" : "container mx-auto max-w-7xl"}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer; 