import { useState, useMemo } from 'react';
import { ThemeColors } from './types';

export function useTheme() {
  // Changed from true to false: Light mode is now the default
  const [dark, setDark] = useState(false);

  const colors: ThemeColors = useMemo(() => {
    return dark ? {
      // --- DARK MODE PALETTE ---
      bg: "#0d1340",
      bgCard: "#1a2160",
      bgCardHover: "#1e2870",
      bgHero: "#0d1340",
      nav: "#0d1340",
      navBorder: "rgba(255,255,255,0.05)",
      text: "#ffffff",
      textMuted: "rgba(255,255,255,0.65)",
      textSubtle: "rgba(255,255,255,0.45)",
      accent: "#A3D045",
      accentText: "#0F1524",
      btnPrimary: "#A3D045",
      btnPrimaryText: "#0F1524",
      btnSecondary: "transparent",
      btnSecondaryText: "#ffffff",
      btnSecondaryBorder: "rgba(255,255,255,0.4)",
      tagBg: "rgba(255,255,255,0.1)",
      tagText: "rgba(255,255,255,0.7)",
      terminalBg: "#0a0e1a",
      footerBg: "#070c2e",
      footerText: "rgba(255,255,255,0.5)",
      memberBg: "#2a3275",
      liveGreen: "#22c55e",
      liveYellow: "#f59e0b",
      divider: "rgba(255,255,255,0.05)"
    } : {
      // --- LIGHT MODE PALETTE ---
      bg: "#f4f5fa",
      bgCard: "#ffffff",
      bgCardHover: "#f0f2ff",
      bgHero: "#f4f5fa",
      nav: "#ffffff",
      navBorder: "rgba(13,19,64,0.05)",
      text: "#0d1340",
      textMuted: "rgba(13,19,64,0.7)",
      textSubtle: "rgba(13,19,64,0.45)",
      accent: "#0d1340",
      accentText: "#A3D045",
      btnPrimary: "#0d1340",
      btnPrimaryText: "#ffffff",
      btnSecondary: "transparent",
      btnSecondaryText: "#0d1340",
      btnSecondaryBorder: "rgba(13,19,64,0.4)",
      tagBg: "rgba(13,19,64,0.08)",
      tagText: "rgba(13,19,64,0.65)",
      terminalBg: "#1a1a2e",
      footerBg: "#e8eaf5",
      footerText: "rgba(13,19,64,0.55)",
      memberBg: "#e0e4f5",
      liveGreen: "#22c55e",
      liveYellow: "#f59e0b",
      divider: "rgba(13,19,64,0.05)"
    };
  }, [dark]);

  return { dark, setDark, colors };
}