/**
 * PageMargin.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { ReactNode } from "react";

interface PageMarginProps {
  children: ReactNode;
  className?: string;
}

export function PageMargin({ children, className = "" }: PageMarginProps) {
  return (
    <div className={`w-full px-4 lg:px-[99px] ${className}`}>{children}</div>
  );
}
