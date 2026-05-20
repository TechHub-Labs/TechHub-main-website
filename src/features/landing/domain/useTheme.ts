import { useState, useMemo, useEffect } from 'react';
import { ThemeColors } from './types';

export function useTheme() {
  const getInitial = () => {
    try {
      const saved = localStorage.getItem('nh_techhub_theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch (e) {}
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const [dark, setDark] = useState<boolean>(getInitial);

  useEffect(() => {
    try {
      localStorage.setItem('nh_techhub_theme', dark ? 'dark' : 'light');
    } catch (e) {}
  }, [dark]);

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
      teal: "#14363E",
      tealText: "#ffffff",
      btnPrimary: "#A3D045",
      btnPrimaryText: "#0F1524",
      btnSecondary: "transparent",
      btnSecondaryText: "#ffffff",
      btnSecondaryBorder: "rgba(255,255,255,0.4)",
      tagBg: "rgba(255,255,255,0.1)",
      tagText: "rgba(255,255,255,0.7)",
      statCard: "#1a2160",
      terminalBg: "#0a0e1a",
      footerBg: "#070c2e",
      footerText: "rgba(255,255,255,0.5)",
      memberBg: "#2a3275",
      liveGreen: "#22c55e",
      liveYellow: "#f59e0b",
      statusPaused: "#ef4444",
      statusInDev: "#3B5BDB",
      statusUpcoming: "#f59e0b",
      statusLive: "#22c55e",
      divider: "rgba(255,255,255,0.05)"
    } : {
      // --- LIGHT MODE PALETTE ---
      bg: "#f4f5fa",
      bgCard: "#ffffff",
      bgCardHover: "#14363E",
      bgHero: "#f4f5fa",
      nav: "#ffffff",
      navBorder: "rgba(13,19,64,0.05)",
      text: "#0d1340",
      textMuted: "rgba(13,19,64,0.7)",
      textSubtle: "rgba(13,19,64,0.45)",
      accent: "#0d1340",
      accentText: "#A3D045",
      teal: "#14363E",
      tealText: "#ffffff",
      btnPrimary: "#0d1340",
      btnPrimaryText: "#ffffff",
      btnSecondary: "transparent",
      btnSecondaryText: "#0d1340",
      btnSecondaryBorder: "rgba(13,19,64,0.4)",
      tagBg: "rgba(13,19,64,0.08)",
      tagText: "rgba(13,19,64,0.65)",
      statCard: "#ffffff",
      terminalBg: "#1a1a2e",
      footerBg: "#e8eaf5",
      footerText: "rgba(13,19,64,0.55)",
      memberBg: "#e0e4f5",
      liveGreen: "#22c55e",
      liveYellow: "#f59e0b",
      statusPaused: "#ef4444",
      statusInDev: "#3B5BDB",
      statusUpcoming: "#f59e0b",
      statusLive: "#22c55e",
      divider: "rgba(13,19,64,0.05)"
    };
  }, [dark]);

  return { dark, setDark, colors };
}