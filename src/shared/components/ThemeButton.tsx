/**
 * ThemeButton.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { ButtonHTMLAttributes } from "react";
import { ThemeColors } from "../../features/landing/domain/types";

interface ThemeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent";
  colors: ThemeColors;
  isDark?: boolean;
}

export function ThemeButton({
  children,
  variant = "primary",
  colors,
  isDark = false,
  className = "",
  style = {},
  ...props
}: ThemeButtonProps) {
  const isPrimary = variant === "primary";
  const isAccent = variant === "accent";

  const primaryBg = isDark ? "#ffffff" : "#1e2870";
  const primaryText = isDark ? "#0d1340" : "#ffffff";

  const accentBg = "#A3D045";
  const accentText = "#0f172a";

  const secondaryBorder =
    colors.btnSecondaryBorder ||
    (isDark ? "rgba(255,255,255,0.4)" : "rgba(13,19,64,0.4)");

  const baseStyle =
    "px-8 py-3.5 rounded font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-sm text-sm sm:text-base cursor-pointer";

  const getStyle = (): React.CSSProperties => {
    if (isPrimary) {
      return {
        background: primaryBg,
        color: primaryText,
        border: "none",
      };
    }
    if (isAccent) {
      return {
        background: accentBg,
        color: accentText,
        border: "none",
      };
    }

    return {
      background: "transparent",
      color: colors.text,
      borderColor: secondaryBorder,
      borderWidth: "2px",
      borderStyle: "solid",
    };
  };

  return (
    <button
      className={`${baseStyle} ${className}`}
      style={{
        ...getStyle(),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
