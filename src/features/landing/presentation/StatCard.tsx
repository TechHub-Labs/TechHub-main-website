/**
 * StatCard.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { useState, useEffect, ReactNode } from "react";
import { ThemeColors } from "../domain/types";

interface StatCardProps {
  rowSpan: number;
  index: number;
  colors: ThemeColors;
  children: ReactNode;
}

export function StatCard({ rowSpan, index, colors, children }: StatCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 180 + index * 110);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`row-span-${rowSpan} rounded-xl p-5 sm:p-7 flex flex-col justify-between cursor-default select-none`}
      style={{
        background: colors.bgCard,
        color: colors.text,
        border: `1.5px solid ${colors.cardBorder}`,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1) translateY(0)" : "scale(0.82)",
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {children}
    </div>
  );
}
