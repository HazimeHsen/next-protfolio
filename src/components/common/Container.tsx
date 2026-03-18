import React from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[88rem] px-6 sm:px-8 lg:px-12 xl:px-16",
        className
      )}>
      {children}
    </div>
  );
};

export { Container };
