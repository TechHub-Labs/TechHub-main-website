/**
 * ModalCloseButton.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { ThemeColors } from "../../features/landing/domain/types";

interface ModalCloseButtonProps {
  onClose: () => void;
  colors: ThemeColors;
  isDark: boolean;
}

export function ModalCloseButton({
  onClose,
  colors,
  isDark,
}: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 cursor-pointer"
      style={{
        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(13,19,64,0.08)",
        color: colors.text,
        border: "none",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = isDark
          ? "rgba(255,255,255,0.2)"
          : "rgba(13,19,64,0.14)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = isDark
          ? "rgba(255,255,255,0.1)"
          : "rgba(13,19,64,0.08)")
      }
      aria-label="Close modal"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M1 1L13 13M13 1L1 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
