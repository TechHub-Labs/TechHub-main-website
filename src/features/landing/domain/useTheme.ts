/**
 * THEME HOOK
 * 
 * Manages dark/light mode state and provides theme colors.
 */

import { useState, useMemo } from 'react';
import { ThemeColors } from './types';

const DARK: ThemeColors = {
  bg: "#0d1340",
  bgCard: "#1a2160",
  bgCardHover: "#1e2870",
  bgHero: "#0d1340",
  nav: "#0d1340",
  navBorder: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.65)",
  textSubtle: "rgba(255,255,255,0.45)",
  accent: "#c8f135",
  accentText: "#0d1340",
  btnPrimary: "#c8f135",
  btnPrimaryText: "#0d1340",
  btnSecondary: "transparent",
  btnSecondaryBorder: "rgba(255,255,255,0.35)",
  btnSecondaryText: "#ffffff",
  tagBg: "rgba(255,255,255,0.1)",
  tagText: "rgba(255,255,255,0.7)",
  statCard: "#1a2160",
  terminalBg: "#0a0e1a",
  footerBg: "#070c2e",
  footerText: "rgba(255,255,255,0.5)",
  divider: "rgba(255,255,255,0.08)",
  liveGreen: "#22c55e",
  liveYellow: "#eab308",
  memberBg: "#2a3275",
};

const LIGHT: ThemeColors = {
  bg: "#f4f5fa",
  bgCard: "#ffffff",
  bgCardHover: "#f0f2ff",
  bgHero: "#f4f5fa",
  nav: "#ffffff",
  navBorder: "rgba(0,0,0,0.08)",
  text: "#0d1340",
  textMuted: "rgba(13,19,64,0.7)",
  textSubtle: "rgba(13,19,64,0.45)",
  accent: "#0d1340",
  accentText: "#c8f135",
  btnPrimary: "#0d1340",
  btnPrimaryText: "#ffffff",
  btnSecondary: "transparent",
  btnSecondaryBorder: "rgba(13,19,64,0.35)",
  btnSecondaryText: "#0d1340",
  tagBg: "rgba(13,19,64,0.08)",
  tagText: "rgba(13,19,64,0.65)",
  statCard: "#eef0fa",
  terminalBg: "#1a1a2e",
  footerBg: "#e8eaf5",
  footerText: "rgba(13,19,64,0.55)",
  divider: "rgba(0,0,0,0.08)",
  liveGreen: "#16a34a",
  liveYellow: "#ca8a04",
  memberBg: "#e0e4f5",
};

export function useTheme() {
  const [dark, setDark] = useState(true);
  const colors = useMemo(() => (dark ? DARK : LIGHT), [dark]);
  
  return { dark, setDark, colors };
}
